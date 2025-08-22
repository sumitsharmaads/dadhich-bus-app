import jwt, { SignOptions } from 'jsonwebtoken';
import type { StringValue } from 'ms';
import { env } from '../lib/env';

export type JwtPayload = { sub: string } & Record<string, unknown>;

export function signAccessToken(payload: JwtPayload): string {
  const expiresIn: StringValue | number = env.JWT_EXPIRES_IN as unknown as StringValue;
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, env.JWT_SECRET, options);
}

export function signRefreshToken(payload: JwtPayload): string {
  const expiresIn: StringValue | number = env.REFRESH_TOKEN_EXPIRES_IN as unknown as StringValue;
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, env.JWT_SECRET, options);
}

export function verifyToken<T extends object = JwtPayload>(token: string): T {
  return jwt.verify(token, env.JWT_SECRET) as T;
}
