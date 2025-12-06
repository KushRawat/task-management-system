import { NextFunction, Request, Response } from "express";
import { HttpError } from "../utils/httpError";
import { verifyAccessToken } from "../utils/tokens";

export const requireAuth = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    throw new HttpError(401, "Access token missing");
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, email: payload.email };
    req.tokenPayload = payload;
    next();
  } catch (error) {
    throw new HttpError(401, "Invalid or expired token");
  }
};
