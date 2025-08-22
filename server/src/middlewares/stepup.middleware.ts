import { NextFunction, Request, Response } from 'express';

export function requireStepUp(req: Request, res: Response, next: NextFunction) {
  const session = (req as any).session;
  if (!session) return res.status(401).json({ success: false, message: 'Unauthorized' });
  if (session.stepUpExpiresAt && session.stepUpExpiresAt > new Date()) return next();
  return res.status(403).json({ success: false, message: 'Step-up authentication required' });
}
