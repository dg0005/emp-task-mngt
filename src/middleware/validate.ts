import { z, ZodError } from 'zod';
import { Request, Response, NextFunction } from 'express';

const validate = (schema: z.ZodType) => (req: Request, res: Response, next: NextFunction): void => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      res.status(400).json({
        statusCode: 400,
        message: 'Validation error',
        errors: err.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      });
      return;
    }
    next(err);
  }
};

export default validate;