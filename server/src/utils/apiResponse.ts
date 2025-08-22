import { Response } from 'express';

export type SuccessMeta = {
  page?: number;
  perPage?: number;
  total?: number;
  [key: string]: unknown;
};

export function sendSuccess<T>(
  res: Response,
  data: T,
  message = 'Success',
  meta?: SuccessMeta,
): void {
  res.status(200).json({ success: true, message, data, meta: meta ?? null });
}

export function sendCreated<T>(res: Response, data: T, message = 'Created'): void {
  res.status(201).json({ success: true, message, data });
}

export function sendNoContent(res: Response): void {
  res.status(204).send();
}

export function sendError(
  res: Response,
  err: { statusCode: number; message: string; code?: string; details?: unknown },
): void {
  const status = err.statusCode || 500;
  res
    .status(status)
    .json({
      success: false,
      message: err.message,
      code: err.code ?? 'ERROR',
      details: err.details ?? null,
    });
}
