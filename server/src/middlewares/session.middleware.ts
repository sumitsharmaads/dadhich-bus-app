import { NextFunction, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import { Session } from '../models/session.model';
import { generateRandomToken, sha256 } from '../lib/crypto';
import { createHash } from 'crypto';

const COOKIE_NAME = 'sid';
const ABSOLUTE_TIMEOUT_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export const sessionCookies = cookieParser();

// Helper function to generate device ID from user agent and IP
function generateDeviceId(userAgent: string, ip: string): string {
  const combined = `${userAgent || 'unknown'}-${ip || 'unknown'}`;
  return createHash('sha256').update(combined).digest('hex').substring(0, 16);
}

// Helper function to generate device name from user agent
function generateDeviceName(userAgent: string): string {
  if (!userAgent) return 'Unknown Device';

  // Simple device name extraction
  if (userAgent.includes('Mobile')) {
    if (userAgent.includes('iPhone')) return 'iPhone';
    if (userAgent.includes('Android')) return 'Android Phone';
    return 'Mobile Device';
  }

  if (userAgent.includes('Tablet')) return 'Tablet';
  if (userAgent.includes('Windows')) return 'Windows PC';
  if (userAgent.includes('Mac')) return 'Mac';
  if (userAgent.includes('Linux')) return 'Linux PC';

  return 'Desktop';
}

export async function sessionMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const now = Date.now();
    let sid = req.cookies?.[COOKIE_NAME] as string | undefined;

    // Create sessions for all requests to ensure proper session management

    if (!sid) {
      // Create session for all requests to ensure proper session management
      // This allows session management endpoints to work properly

      sid = generateRandomToken(24);
      const sessionIdHash = sha256(sid);
      const expiresAt = new Date(now + ABSOLUTE_TIMEOUT_MS);
      const userAgent = req.headers['user-agent'] || '';
      const ip = req.ip || '';
      const deviceId = generateDeviceId(userAgent, ip);
      const deviceName = generateDeviceName(userAgent);

      await Session.create({
        sessionIdHash,
        userAgent,
        ip,
        deviceId,
        deviceName,
        lastSeenAt: new Date(now),
        expiresAt,
      });
      setCookie(res, sid, expiresAt);
      // @ts-ignore expose helpers
      req.sessionId = sid;
      // @ts-ignore
      req.session = { sessionIdHash, userId: null, lastSeenAt: new Date(now), expiresAt };
      return next();
    }

    const session = await Session.findOne({ sessionIdHash: sha256(sid) }).exec();
    if (!session) {
      // Session not found, create new one
      // Clear invalid cookie first
      res.clearCookie(COOKIE_NAME);

      const newSid = generateRandomToken(24);
      const expiresAt = new Date(now + ABSOLUTE_TIMEOUT_MS);
      const userAgent = req.headers['user-agent'] || '';
      const ip = req.ip || '';
      const deviceId = generateDeviceId(userAgent, ip);
      const deviceName = generateDeviceName(userAgent);

      await Session.create({
        sessionIdHash: sha256(newSid),
        userAgent,
        ip,
        deviceId,
        deviceName,
        lastSeenAt: new Date(now),
        expiresAt,
      });
      setCookie(res, newSid, expiresAt);
      // @ts-ignore
      req.sessionId = newSid;
      // @ts-ignore
      req.session = {
        sessionIdHash: sha256(newSid),
        userId: null,
        lastSeenAt: new Date(now),
        expiresAt,
      };
      return next();
    }

    // Check if session is expired
    if (session.expiresAt.getTime() < now) {
      await Session.deleteOne({ _id: session._id });
      res.clearCookie(COOKIE_NAME);
      // @ts-ignore
      req.session = null;
      return next();
    }

    // Update last seen only if it's been more than 5 minutes
    const shouldUpdateLastSeen = session.lastSeenAt.getTime() + 5 * 60 * 1000 < now;
    if (shouldUpdateLastSeen) {
      session.lastSeenAt = new Date(now);
      await session.save();
    }

    // @ts-ignore attach for downstream use
    req.session = session;
    // @ts-ignore shortcut for user id
    req.sessionUserId = session.userId?.toString();
    // @ts-ignore
    req.sessionId = sid;
    next();
  } catch (err) {
    next(err);
  }
}

function setCookie(res: Response, sid: string, expiresAt: Date) {
  res.cookie(COOKIE_NAME, sid, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
    domain: process.env.NODE_ENV === 'production' ? '.dadhichbusservice.com' : undefined,
  });
}
