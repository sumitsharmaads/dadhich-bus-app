import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/errors';

export function notFoundHandler(_req: Request, _res: Response, next: NextFunction): void {
  next(new AppError('Not Found', 404, 'NOT_FOUND'));
}
