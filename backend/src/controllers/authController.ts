import { randomUUID } from "crypto";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { HttpError } from "../utils/httpError";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/tokens";
import { config } from "../config/env";
import { asyncHandler } from "../utils/asyncHandler";

const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const parseDurationToMs = (value: string) => {
  const match = value.match(/^(\d+)(ms|s|m|h|d)$/);
  if (!match) return 0;
  const amount = Number(match[1]);
  const unit = match[2];
  const multipliers: Record<string, number> = {
    ms: 1,
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };
  return amount * (multipliers[unit] ?? 0);
};

const refreshMaxAge =
  parseDurationToMs(config.REFRESH_TOKEN_EXPIRES_IN) ||
  7 * 24 * 60 * 60 * 1000;

const getRefreshExpiry = () => new Date(Date.now() + refreshMaxAge);

const serializeUser = (user: { id: string; email: string; name: string }) => ({
  id: user.id,
  email: user.email,
  name: user.name,
});

const setRefreshCookie = (res: Response, token: string) => {
  res.cookie("refresh_token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    maxAge: refreshMaxAge,
    path: "/",
  });
};

const clearRefreshCookie = (res: Response) => {
  res.cookie("refresh_token", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    expires: new Date(0),
    path: "/",
  });
};

const createSession = async (userId: string, email: string, res: Response) => {
  const tokenId = randomUUID();
  const accessToken = signAccessToken(userId, email);
  const refreshToken = signRefreshToken(userId, tokenId);
  const tokenHash = await bcrypt.hash(refreshToken, 10);

  await prisma.refreshToken.create({
    data: {
      id: tokenId,
      tokenHash,
      userId,
      expiresAt: getRefreshExpiry(),
    },
  });

  setRefreshCookie(res, refreshToken);

  return { accessToken };
};

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, name } = authSchema.parse(req.body);

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new HttpError(409, "Email is already registered");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, name, passwordHash },
    select: { id: true, email: true, name: true },
  });

  const session = await createSession(user.id, user.email, res);

  res.status(201).json({ user: serializeUser(user), accessToken: session.accessToken });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = loginSchema.parse(req.body);

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new HttpError(401, "Invalid email or password");
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    throw new HttpError(401, "Invalid email or password");
  }

  const session = await createSession(user.id, user.email, res);
  res.json({ user: serializeUser(user), accessToken: session.accessToken });
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const token =
    req.cookies.refresh_token ||
    (typeof req.body?.refreshToken === "string" ? req.body.refreshToken : "");

  if (!token) {
    throw new HttpError(401, "Refresh token missing");
  }

  const payload = (() => {
    try {
      return verifyRefreshToken(token);
    } catch (error) {
      throw new HttpError(401, "Invalid refresh token");
    }
  })();

  const stored = await prisma.refreshToken.findUnique({
    where: { id: payload.jti },
  });

  if (
    !stored ||
    stored.revoked ||
    stored.expiresAt.getTime() < Date.now()
  ) {
    throw new HttpError(401, "Refresh token is no longer valid");
  }

  const matches = await bcrypt.compare(token, stored.tokenHash);
  if (!matches) {
    await prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revoked: true },
    });
    throw new HttpError(401, "Refresh token does not match");
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: { id: true, email: true, name: true },
  });

  if (!user) {
    throw new HttpError(404, "User not found");
  }

  await prisma.refreshToken.update({
    where: { id: stored.id },
    data: { revoked: true },
  });

  const session = await createSession(user.id, user.email, res);
  res.json({ user: serializeUser(user), accessToken: session.accessToken });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const token =
    req.cookies.refresh_token ||
    (typeof req.body?.refreshToken === "string" ? req.body.refreshToken : "");

  if (token) {
    try {
      const payload = verifyRefreshToken(token);
      await prisma.refreshToken.updateMany({
        where: { id: payload.jti, revoked: false },
        data: { revoked: true },
      });
    } catch (error) {
      // Token might already be invalid; still proceed to clear cookie.
    }
  }

  clearRefreshCookie(res);
  res.json({ message: "Logged out successfully" });
});
