import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { AppErrorShape } from '../utils/appError.js';

class ErrorHandler {
  errorHandler = (
    err: AppErrorShape,
    req: Request,
    res: Response,
    next: NextFunction,
  ): void => {
    console.error(err);
    if ((err as Error & { code?: number }).code === 11000) {
      const duplicate = err as Error & { keyPattern?: Record<string, number> };
      const fields = Object.keys(duplicate.keyPattern ?? {});
      res.status(409).json({
        error: 'Duplicate key conflict',
        fields,
      });
      return;
    }

    if (err instanceof mongoose.Error.ValidationError) {
      const details = Object.values(err.errors).map((validationError) => ({
        field: validationError.path,
        message: validationError.message,
      }));
      res.status(400).json({
        error: 'Validation failed',
        details,
      });
      return;
    }

    if (err instanceof mongoose.Error.CastError) {
      res.status(400).json({
        error: 'Invalid value',
        field: err.path,
        value: err.value,
      });
      return;
    }

    const status = err.status || 500;
    res.status(status).json({ error: err.message || 'Internal Server Error' });
  };
}

export default new ErrorHandler();
