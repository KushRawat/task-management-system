import { AnyZodObject, ZodSchema } from "zod";
import { NextFunction, Request, Response } from "express";

export const validateBody =
  <T>(schema: ZodSchema<T>) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return next(parsed.error);
    }
    req.body = parsed.data as unknown as Request["body"];
    next();
  };

export const validateQuery =
  (schema: AnyZodObject) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.query);
    if (!parsed.success) {
      return next(parsed.error);
    }
    req.query = parsed.data;
    next();
  };
