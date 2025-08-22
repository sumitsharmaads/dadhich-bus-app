import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { validate } from '../../middlewares/validate.middleware';
import {
  termsCreateSchema,
  termsIdParamSchema,
  termsUpdateSchema,
} from '../../schemas/terms.schema';
import {
  createTerms,
  deleteTerms,
  getCurrentTerms,
  getTermsById,
  listTerms,
  updateTerms,
} from '../../controllers/terms.controller';
import { requireAuth } from '../../middlewares/authenticated.middleware';
import { requireAdmin } from '../../middlewares/admin.middleware';
import { verifyCsrfToken } from '../../middlewares/csrf.middleware';

export const termsRouter = Router();

const limiter = rateLimit({
  windowMs: 60_000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
});

termsRouter.get('/', limiter, listTerms);
termsRouter.get('/current', limiter, getCurrentTerms);
termsRouter.get('/:id', limiter, validate(termsIdParamSchema, 'params'), getTermsById);
termsRouter.post(
  '/',
  limiter,
  verifyCsrfToken,
  requireAuth,
  requireAdmin,
  validate(termsCreateSchema),
  createTerms,
);
termsRouter.put(
  '/:id',
  limiter,
  verifyCsrfToken,
  requireAuth,
  requireAdmin,
  validate(termsIdParamSchema, 'params'),
  validate(termsUpdateSchema),
  updateTerms,
);
termsRouter.delete(
  '/:id',
  limiter,
  verifyCsrfToken,
  requireAuth,
  requireAdmin,
  validate(termsIdParamSchema, 'params'),
  deleteTerms,
);
