import { NextFunction, Request, Response } from 'express';
import { generateRandomToken } from '../lib/crypto';

const CSRF_COOKIE = 'csrf_token';
const CSRF_HEADER = 'x-csrf-token';

export function issueCsrfToken(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.[CSRF_COOKIE];
  if (!token) {
    const t = generateRandomToken(16);
    res.cookie(CSRF_COOKIE, t, {
      httpOnly: false,
      secure: true,
      sameSite: 'lax',
      path: '/',
      domain: process.env.NODE_ENV === 'production' ? '.dadhichbusservice.com' : undefined,
    });
  }
  next();
}

export function verifyCsrfToken(req: Request, res: Response, next: NextFunction) {
  const method = req.method.toUpperCase();
  const isSafe = method === 'GET' || method === 'HEAD' || method === 'OPTIONS';
  if (isSafe) return next();

  const cookieToken = req.cookies?.[CSRF_COOKIE];
  const headerToken = (req.headers[CSRF_HEADER] as string) || '';
  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    return res.status(403).json({ success: false, message: 'Invalid CSRF token' });
  }
  next();
}
