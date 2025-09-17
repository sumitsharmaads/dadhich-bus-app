import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { validate } from '../../middlewares/validate.middleware';
import {
  faqsCreateSchema,
  faqsIdParamSchema,
  faqsUpdateSchema,
  faqsUpdateCurrentSchema,
} from '../../schemas/faqs.schema';
import {
  cleanupFAQs,
  createFAQs,
  deleteFAQs,
  getCurrentFAQs,
  getFAQsById,
  getFAQsCount,
  initializeFAQs,
  listFAQs,
  updateFAQs,
  updateCurrentFAQs,
} from '../../controllers/faqs.controller';
import { requireAuth } from '../../middlewares/authenticated.middleware';
import { requireAdmin } from '../../middlewares/admin.middleware';
import { verifyCsrfToken } from '../../middlewares/csrf.middleware';

export const faqsRouter = Router();

const limiter = rateLimit({
  windowMs: 60_000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
});

// Public routes
faqsRouter.get('/', limiter, getCurrentFAQs);
faqsRouter.get('/count', limiter, getFAQsCount);
faqsRouter.get('/list', limiter, listFAQs);
faqsRouter.get('/initialize', limiter, initializeFAQs);
faqsRouter.get('/cleanup', limiter, cleanupFAQs);
faqsRouter.get('/:id', limiter, validate(faqsIdParamSchema, 'params'), getFAQsById);

// Admin routes
faqsRouter.post(
  '/',
  limiter,
  verifyCsrfToken,
  requireAuth,
  requireAdmin,
  validate(faqsCreateSchema),
  createFAQs,
);

faqsRouter.put(
  '/update',
  limiter,
  verifyCsrfToken,
  requireAuth,
  requireAdmin,
  validate(faqsUpdateCurrentSchema),
  updateCurrentFAQs,
);
faqsRouter.put(
  '/:id',
  limiter,
  verifyCsrfToken,
  requireAuth,
  requireAdmin,
  validate(faqsIdParamSchema, 'params'),
  validate(faqsUpdateSchema),
  updateFAQs,
);
faqsRouter.delete(
  '/:id',
  limiter,
  verifyCsrfToken,
  requireAuth,
  requireAdmin,
  validate(faqsIdParamSchema, 'params'),
  deleteFAQs,
);
