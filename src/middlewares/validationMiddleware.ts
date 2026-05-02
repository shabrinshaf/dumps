import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

// Pakai z.ZodSchema supaya lebih fleksibel dan tidak error TS2724
export const validate = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: 'Validasi gagal',
          errors: error.issues.map((issue) => ({
            field: issue.path[0],
            message: issue.message,
          })),
        });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
};
