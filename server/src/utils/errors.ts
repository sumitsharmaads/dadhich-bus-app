export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: unknown;

  constructor(message: string, statusCode = 500, code = 'INTERNAL_ERROR', details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace?.(this, this.constructor);
  }
}

export function asAppError(err: unknown, defaultStatus = 500): AppError {
  if (err instanceof AppError) return err;
  if (err instanceof Error) {
    return new AppError(err.message || 'Internal error', defaultStatus);
  }
  return new AppError('Internal error', defaultStatus);
}
