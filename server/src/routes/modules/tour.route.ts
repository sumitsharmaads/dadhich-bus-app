import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { validate } from '../../middlewares/validate.middleware';
import { requireAuth } from '../../middlewares/authenticated.middleware';
import { requireAdmin } from '../../middlewares/admin.middleware';
import {
  idParamSchema,
  tourCreateSchema,
  tourPublicQuerySchema,
  tourUpdateSchema,
} from '../../schemas/tour.schema';
import {
  createTour,
  deleteTour,
  draftTour,
  facets,
  getTourPublic,
  listToursAdmin,
  listToursPublic,
  priceRange,
  publishTour,
  upcomingTours,
  updateTour,
  stateBreakup,
  tourStats,
  getTourById,
  toggleTourActive,
  getAdminTourStats,
  bulkPublishTours,
  bulkDraftTours,
  bulkDeleteTours,
  exportTours,
  importTours,
  getAvailableBuses,
  getAvailableCaptains,
  getTourCategories,
  getTourTypes,
  downloadTourTemplate,
  searchTourInformation,
} from '../../controllers/tour.controller';
import { verifyCsrfToken } from '../../middlewares/csrf.middleware';
import { uploadSingleFile } from '../../middlewares/upload.middleware';

export const tourRouter = Router();

const limiter = rateLimit({
  windowMs: 60_000,
  max: 80,
  standardHeaders: true,
  legacyHeaders: false,
});

// Public
tourRouter.get('/', limiter, validate(tourPublicQuerySchema, 'query'), listToursPublic);
tourRouter.get('/upcoming', limiter, upcomingTours);
tourRouter.get('/price-range', limiter, priceRange);
tourRouter.get('/facets', limiter, facets);
tourRouter.get('/state-breakup', limiter, stateBreakup);
tourRouter.get('/stats', limiter, tourStats);
tourRouter.get('/categories', limiter, getTourCategories);
tourRouter.get('/types', limiter, getTourTypes);
tourRouter.get('/searchtourInformation', limiter, searchTourInformation);
tourRouter.get('/public/:id', limiter, validate(idParamSchema, 'params'), getTourPublic);

// Admin
tourRouter.get('/admin/list', limiter, requireAuth, requireAdmin, listToursAdmin);
tourRouter.get('/admin/stats', limiter, requireAuth, requireAdmin, getAdminTourStats);
tourRouter.get('/admin/buses', limiter, requireAuth, requireAdmin, getAvailableBuses);
tourRouter.get('/admin/captains', limiter, requireAuth, requireAdmin, getAvailableCaptains);
tourRouter.get(
  '/admin/:id',
  limiter,
  requireAuth,
  requireAdmin,
  validate(idParamSchema, 'params'),
  getTourById,
);
tourRouter.post(
  '/',
  limiter,
  verifyCsrfToken,
  requireAuth,
  requireAdmin,
  validate(tourCreateSchema),
  createTour,
);
tourRouter.put(
  '/:id',
  limiter,
  verifyCsrfToken,
  requireAuth,
  requireAdmin,
  validate(idParamSchema, 'params'),
  validate(tourUpdateSchema),
  updateTour,
);
tourRouter.post(
  '/:id/publish',
  limiter,
  verifyCsrfToken,
  requireAuth,
  requireAdmin,
  validate(idParamSchema, 'params'),
  publishTour,
);
tourRouter.post(
  '/:id/draft',
  limiter,
  verifyCsrfToken,
  requireAuth,
  requireAdmin,
  validate(idParamSchema, 'params'),
  draftTour,
);
tourRouter.put(
  '/:id/toggle-active',
  limiter,
  verifyCsrfToken,
  requireAuth,
  requireAdmin,
  validate(idParamSchema, 'params'),
  toggleTourActive,
);
tourRouter.delete(
  '/:id',
  limiter,
  verifyCsrfToken,
  requireAuth,
  requireAdmin,
  validate(idParamSchema, 'params'),
  deleteTour,
);

// Bulk operations
tourRouter.post(
  '/admin/bulk-publish',
  limiter,
  verifyCsrfToken,
  requireAuth,
  requireAdmin,
  bulkPublishTours,
);
tourRouter.post(
  '/admin/bulk-draft',
  limiter,
  verifyCsrfToken,
  requireAuth,
  requireAdmin,
  bulkDraftTours,
);
tourRouter.post(
  '/admin/bulk-delete',
  limiter,
  verifyCsrfToken,
  requireAuth,
  requireAdmin,
  bulkDeleteTours,
);

// Export/Import
tourRouter.post('/admin/export', limiter, verifyCsrfToken, requireAuth, requireAdmin, exportTours);
tourRouter.post(
  '/admin/import',
  limiter,
  verifyCsrfToken,
  requireAuth,
  requireAdmin,
  uploadSingleFile,
  importTours,
);
tourRouter.get(
  '/admin/template',
  limiter,
  verifyCsrfToken,
  requireAuth,
  requireAdmin,
  downloadTourTemplate,
);
