import cors, { CorsOptionsDelegate } from 'cors';
import type { RequestHandler } from 'express';

export function customCors(): RequestHandler {
  const allowedOrigins = (process.env.CORS_ORIGIN ?? '').split(',').map((s) => s.trim());

  const originDelegate: CorsOptionsDelegate = (req, callback) => {
    const origin = req.headers.origin;
    const host = req.headers.host;
    const allow =
      !origin ||
      (origin && allowedOrigins.includes(origin)) ||
      (host && allowedOrigins.includes(host));
    const options = {
      origin: allow,
      credentials: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      allowedHeaders: 'Accept,Authorization,Content-Type,X-Requested-With,Range',
      exposedHeaders: 'Content-Length',
    };
    callback(null, options);
  };

  return cors(originDelegate);
}
