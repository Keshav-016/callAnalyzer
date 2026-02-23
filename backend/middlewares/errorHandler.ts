import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  status?: number;
}

class ErrorHandler {
  errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction): void => {
    console.error(err);
    const status = err.status || 500;
    res.status(status).json({ error: err.message || 'Internal Server Error' });
  };
}

export default new ErrorHandler();
