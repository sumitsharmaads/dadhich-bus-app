import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../utils/jwt';
import { AppError } from '../utils/errors';

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export function authGuard(req: AuthenticatedRequest, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return next(new AppError('Unauthorized', 401, 'UNAUTHORIZED'));
  }

  const token = header.slice('Bearer '.length);
  try {
    const payload = verifyToken<{ sub: string }>(token);
    req.userId = payload.sub;
    next();
  } catch {
    next(new AppError('Unauthorized', 401, 'UNAUTHORIZED'));
  }
}
