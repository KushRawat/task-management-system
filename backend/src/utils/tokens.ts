import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../config/env";

export interface RefreshTokenPayload extends JwtPayload {
  sub: string;
  jti: string;
  type: "refresh";
}

export interface AccessTokenPayload extends JwtPayload {
  sub: string;
  email: string;
  type: "access";
}

export const signAccessToken = (userId: string, email: string) =>
  jwt.sign(
    { sub: userId, email, type: "access" },
    config.ACCESS_TOKEN_SECRET,
    { expiresIn: config.ACCESS_TOKEN_EXPIRES_IN }
  );

export const signRefreshToken = (userId: string, tokenId: string) =>
  jwt.sign(
    { sub: userId, jti: tokenId, type: "refresh" },
    config.REFRESH_TOKEN_SECRET,
    { expiresIn: config.REFRESH_TOKEN_EXPIRES_IN }
  );

export const verifyAccessToken = (token: string) =>
  jwt.verify(token, config.ACCESS_TOKEN_SECRET) as AccessTokenPayload;

export const verifyRefreshToken = (token: string) =>
  jwt.verify(token, config.REFRESH_TOKEN_SECRET) as RefreshTokenPayload;
