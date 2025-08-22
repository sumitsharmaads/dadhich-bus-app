import pino from 'pino';
import { env } from './env';

export const logger = pino({
  level: env.LOG_LEVEL,
  base: { app: 'server' },
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'req.body.password',
      'req.body.oldPassword',
      'req.body.newPassword',
      'req.body.token',
      'session',
    ],
    remove: true,
  },
  transport:
    env.NODE_ENV !== 'production'
      ? {
          target: 'pino-pretty',
          options: { colorize: true, translateTime: 'SYS:standard', singleLine: true },
        }
      : undefined,
});
