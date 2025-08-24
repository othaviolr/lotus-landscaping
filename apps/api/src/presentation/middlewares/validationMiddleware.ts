import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

export const validateRequest = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        res.status(400).json({
          error: "Validation failed",
          details: validationErrors,
        });
        return;
      }

      res.status(400).json({ error: "Invalid request data" });
    }
  };
};

export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        res.status(400).json({
          error: "Query validation failed",
          details: validationErrors,
        });
        return;
      }

      res.status(400).json({ error: "Invalid query parameters" });
    }
  };
};
