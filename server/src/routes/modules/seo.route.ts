import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { validate } from '../../middlewares/validate.middleware';
import { requireAuth } from '../../middlewares/authenticated.middleware';
import { requireAdmin } from '../../middlewares/admin.middleware';
import {
  idParamSchema,
  seoCreateSchema,
  seoRouteQuerySchema,
  seoUpdateSchema,
} from '../../schemas/seo.schema';
import {
  createSeo,
  deleteSeo,
  getSeoById,
  getSeoByRoute,
  listSeo,
  updateSeo,
} from '../../controllers/seo.controller';
import { verifyCsrfToken } from '../../middlewares/csrf.middleware';

export const seoRouter = Router();

const limiter = rateLimit({
  windowMs: 60_000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
});

seoRouter.get('/', limiter, listSeo);
seoRouter.get('/by-route', limiter, validate(seoRouteQuerySchema, 'query'), getSeoByRoute);
seoRouter.get('/:id', limiter, validate(idParamSchema, 'params'), getSeoById);
seoRouter.post(
  '/',
  limiter,
  verifyCsrfToken,
  requireAuth,
  requireAdmin,
  validate(seoCreateSchema),
  createSeo,
);
seoRouter.put(
  '/:id',
  limiter,
  verifyCsrfToken,
  requireAuth,
  requireAdmin,
  validate(idParamSchema, 'params'),
  validate(seoUpdateSchema),
  updateSeo,
);
seoRouter.delete(
  '/:id',
  limiter,
  verifyCsrfToken,
  requireAuth,
  requireAdmin,
  validate(idParamSchema, 'params'),
  deleteSeo,
);
