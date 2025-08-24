import { NextFunction, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import { Session } from '../models/session.model';
import { generateRandomToken, sha256 } from '../lib/crypto';

const COOKIE_NAME = 'sid';
const IDLE_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
const ABSOLUTE_TIMEOUT_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export const sessionCookies = cookieParser();

export async function sessionMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const now = Date.now();
    let sid = req.cookies?.[COOKIE_NAME] as string | undefined;

    if (!sid) {
      sid = generateRandomToken(24);
      const sessionIdHash = sha256(sid);
      const expiresAt = new Date(now + ABSOLUTE_TIMEOUT_MS);
      await Session.create({
        sessionIdHash,
        userAgent: req.headers['user-agent'],
        ip: req.ip,
        lastSeenAt: new Date(now),
        expiresAt,
      });
      setCookie(res, sid, expiresAt);
      // @ts-ignore expose helpers
      req.sessionId = sid;
      return next();
    }

    const session = await Session.findOne({ sessionIdHash: sha256(sid) }).exec();
    if (!session) {
      const newSid = generateRandomToken(24);
      const expiresAt = new Date(now + ABSOLUTE_TIMEOUT_MS);
      await Session.create({
        sessionIdHash: sha256(newSid),
        userAgent: req.headers['user-agent'],
        ip: req.ip,
        lastSeenAt: new Date(now),
        expiresAt,
      });
      setCookie(res, newSid, expiresAt);
      // @ts-ignore
      req.sessionId = newSid;
      return next();
    }

    const needsRotation = session.lastSeenAt.getTime() + IDLE_TIMEOUT_MS < now;
    if (needsRotation) {
      const newSid = generateRandomToken(24);
      session.sessionIdHash = sha256(newSid);
      session.lastSeenAt = new Date(now);
      await session.save();
      setCookie(res, newSid, session.expiresAt);
      // @ts-ignore
      req.sessionId = newSid;
    } else {
      session.lastSeenAt = new Date(now);
      await session.save();
      // @ts-ignore
      req.sessionId = sid;
    }

    // @ts-ignore attach for downstream use
    req.session = session;
    // @ts-ignore shortcut for user id
    req.sessionUserId = session.userId?.toString();
    next();
  } catch (err) {
    next(err);
  }
}

function setCookie(res: Response, sid: string, expiresAt: Date) {
  res.cookie(COOKIE_NAME, sid, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
    domain: process.env.NODE_ENV === 'production' ? '.dadhichbusservice.com' : undefined,
  });
}
