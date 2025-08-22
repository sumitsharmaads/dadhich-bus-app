import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { ZodError } from 'zod';

import { logger } from '../lib/logger';
import { AppError, asAppError } from '../utils/errors';
import { sendError } from '../utils/apiResponse';
import { randomUUID } from 'crypto';

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction): void {
  const error: AppError = normalizeError(err);

  if (res.headersSent) {
    return;
  }

  const errorId = randomUUID();
  if (error.statusCode >= 500) {
    logger.error(
      { err, errorId, path: req.originalUrl, method: req.method, userId: (req as any).user?._id },
      'Internal server error',
    );
  } else {
    logger.warn(
      { err, errorId, path: req.originalUrl, method: req.method, userId: (req as any).user?._id },
      'Handled client error',
    );
  }

  res.setHeader('X-Error-Id', errorId);
  sendError(res, error);
}

function normalizeError(err: unknown): AppError {
  // Zod validation
  if (err instanceof ZodError) {
    const details = err.issues.map((i) => ({ path: i.path.join('.'), message: i.message }));
    return new AppError('Validation failed', 400, 'VALIDATION_ERROR', details);
  }

  // Mongoose duplicate key
  if (isMongoDuplicateKeyError(err)) {
    const dup = err as mongoose.mongo.MongoServerError & { keyValue?: Record<string, unknown> };
    const details = dup.keyValue ? [dup.keyValue] : undefined;
    return new AppError('Duplicate value', 409, 'DUPLICATE_KEY', details);
  }

  // Mongoose validation/cast
  if (err instanceof mongoose.Error.ValidationError) {
    return new AppError('Invalid document', 400, 'MONGOOSE_VALIDATION');
  }
  if (err instanceof mongoose.Error.CastError) {
    return new AppError('Invalid identifier', 400, 'MONGOOSE_CAST');
  }

  const appError = asAppError(err);
  return appError;
}

function isMongoDuplicateKeyError(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false;
  const maybe = err as { code?: unknown };
  return maybe.code === 11000;
}
