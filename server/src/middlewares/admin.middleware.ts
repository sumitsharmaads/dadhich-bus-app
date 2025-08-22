import { NextFunction, Request, Response } from 'express';

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user;
  if (user && user.roleType === 0) return next();
  return res.status(403).json({ success: false, message: 'Admin only' });
}
