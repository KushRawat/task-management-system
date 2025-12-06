import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
      };
      tokenPayload?: JwtPayload;
    }
  }
}

export {};
