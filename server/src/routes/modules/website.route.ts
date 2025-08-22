import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { validate } from '../../middlewares/validate.middleware';
import {
  websiteCreateSchema,
  websiteUpdateSchema,
  websiteIdParamSchema,
  websiteHostQuerySchema,
} from '../../schemas/website.schema';
import {
  createWebsite,
  deleteWebsite,
  getWebsiteByHost,
  getWebsiteById,
  listWebsites,
  updateWebsite,
  getWebsiteSettings,
  updateWebsiteSettings,
} from '../../controllers/website.controller';
import { requireAuth } from '../../middlewares/authenticated.middleware';
import { requireAdmin } from '../../middlewares/admin.middleware';
import { verifyCsrfToken } from '../../middlewares/csrf.middleware';

export const websiteRouter = Router();

const limiter = rateLimit({
  windowMs: 60_000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
});

websiteRouter.get('/', limiter, listWebsites);
websiteRouter.get('/by-host', limiter, validate(websiteHostQuerySchema, 'query'), getWebsiteByHost);
websiteRouter.get('/:id', limiter, validate(websiteIdParamSchema, 'params'), getWebsiteById);
websiteRouter.post(
  '/',
  limiter,
  requireAuth,
  requireAdmin,
  verifyCsrfToken,
  validate(websiteCreateSchema),
  createWebsite,
);
websiteRouter.put(
  '/:id',
  limiter,
  requireAuth,
  requireAdmin,
  verifyCsrfToken,
  validate(websiteIdParamSchema, 'params'),
  validate(websiteUpdateSchema),
  updateWebsite,
);
websiteRouter.delete(
  '/:id',
  limiter,
  requireAuth,
  requireAdmin,
  verifyCsrfToken,
  validate(websiteIdParamSchema, 'params'),
  deleteWebsite,
);

// Settings-specific routes
websiteRouter.get(
  '/:id/settings',
  limiter,
  requireAuth,
  requireAdmin,
  validate(websiteIdParamSchema, 'params'),
  getWebsiteSettings,
);

websiteRouter.put(
  '/:id/settings',
  limiter,
  requireAuth,
  requireAdmin,
  verifyCsrfToken,
  validate(websiteIdParamSchema, 'params'),
  validate(websiteUpdateSchema),
  updateWebsiteSettings,
);
