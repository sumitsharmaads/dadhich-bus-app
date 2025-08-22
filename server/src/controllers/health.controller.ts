import { Request, Response } from 'express';
import { sendSuccess } from '../utils/apiResponse';
import { getDbState } from '../lib/mongoose';

export function getHealth(_req: Request, res: Response): void {
  const payload = {
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    db: getDbState(),
  } as const;

  sendSuccess(res, payload, 'Service is healthy');
}
