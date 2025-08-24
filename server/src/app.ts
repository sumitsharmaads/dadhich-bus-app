import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import hpp from 'hpp';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import pinoHttp from 'pino-http';

import { env } from './lib/env';
import { logger } from './lib/logger';
import { router } from './routes';
import { notFoundHandler } from './middlewares/notFound.middleware';
import { errorHandler } from './middlewares/error.middleware';
import { sessionCookies, sessionMiddleware } from './middlewares/session.middleware';
import { issueCsrfToken } from './middlewares/csrf.middleware';
import { loadCurrentUser } from './middlewares/userLoader.middleware';
import { randomUUID } from 'crypto';

export function buildApp(): Application {
  const app = express();

  app.set('trust proxy', 1);

  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGIN.split(',').map((o) => o.trim()),
      credentials: true,
    }),
  );
  app.use(hpp());
  app.use(mongoSanitize());
  app.use(compression());

  app.use(
    rateLimit({
      windowMs: env.RATE_LIMIT_WINDOW_MS,
      max: env.RATE_LIMIT_MAX,
      standardHeaders: true,
      legacyHeaders: false,
      message: 'Too many requests, please try again later.',
    }),
  );

  app.use(
    pinoHttp({
      logger,
      autoLogging: { ignore: (req) => req.url === '/health' },
      genReqId: (req) => (req.headers['x-request-id'] as string) || randomUUID(),
      customProps: (req) => ({ userId: (req as any).user?._id }),
      customSuccessMessage: function () {
        return 'request completed';
      },
    }),
  );

  app.use(sessionCookies);
  // Configure body parsers to skip multipart requests
  app.use((req, _, next) => {
    if (req.headers['content-type']?.includes('multipart/form-data')) {
      return next();
    }
    next();
  });

  app.use(express.json({ limit: env.REQUEST_BODY_LIMIT }));
  app.use(express.urlencoded({ extended: true, limit: env.REQUEST_BODY_LIMIT }));
  app.use(sessionMiddleware);
  app.use(loadCurrentUser);
  app.use(issueCsrfToken);

  app.use('/api', router);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
