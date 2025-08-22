import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { validate } from '../../middlewares/validate.middleware';
import { requireAuth } from '../../middlewares/authenticated.middleware';
import { requireAdmin } from '../../middlewares/admin.middleware';
import {
  busAdminListQuerySchema,
  busCreateSchema,
  busUpdateSchema,
  idParamSchema,
  busBulkUpdateSchema,
  busBulkDeleteSchema,
  busStatusUpdateSchema,
  busSeatLayoutUpdateSchema,
} from '../../schemas/bus.schema';
import {
  createBus,
  deleteBus,
  getBusById,
  listBusesAdmin,
  updateBus,
  getBusStats,
  bulkUpdateBuses,
  bulkDeleteBuses,
  updateBusStatus,
  getBusSeatLayout,
  updateBusSeatLayout,
} from '../../controllers/bus.controller';
import { verifyCsrfToken } from '../../middlewares/csrf.middleware';

export const busRouter = Router();

const limiter = rateLimit({
  windowMs: 60_000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
});

// Admin routes - Bus Management
busRouter.get(
  '/admin',
  limiter,
  requireAuth,
  requireAdmin,
  validate(busAdminListQuerySchema, 'query'),
  listBusesAdmin,
);

// Bus statistics
busRouter.get('/admin/stats', limiter, requireAuth, requireAdmin, getBusStats);

// Bulk operations
busRouter.post(
  '/admin/bulk-update',
  limiter,
  verifyCsrfToken,
  requireAuth,
  requireAdmin,
  validate(busBulkUpdateSchema),
  bulkUpdateBuses,
);

busRouter.post(
  '/admin/bulk-delete',
  limiter,
  verifyCsrfToken,
  requireAuth,
  requireAdmin,
  validate(busBulkDeleteSchema),
  bulkDeleteBuses,
);

// Individual bus operations
busRouter.get(
  '/:id',
  limiter,
  verifyCsrfToken,
  requireAuth,
  requireAdmin,
  validate(idParamSchema, 'params'),
  getBusById,
);

busRouter.post(
  '/',
  limiter,
  verifyCsrfToken,
  requireAuth,
  requireAdmin,
  validate(busCreateSchema),
  createBus,
);

busRouter.put(
  '/:id',
  limiter,
  verifyCsrfToken,
  requireAuth,
  requireAdmin,
  validate(idParamSchema, 'params'),
  validate(busUpdateSchema),
  updateBus,
);

busRouter.delete(
  '/:id',
  limiter,
  verifyCsrfToken,
  requireAuth,
  requireAdmin,
  validate(idParamSchema, 'params'),
  deleteBus,
);

// Bus status update
busRouter.patch(
  '/:id/status',
  limiter,
  verifyCsrfToken,
  requireAuth,
  requireAdmin,
  validate(idParamSchema, 'params'),
  validate(busStatusUpdateSchema),
  updateBusStatus,
);

// Seat layout management
busRouter.get(
  '/:id/seat-layout',
  limiter,
  requireAuth,
  requireAdmin,
  validate(idParamSchema, 'params'),
  getBusSeatLayout,
);

busRouter.put(
  '/:id/seat-layout',
  limiter,
  verifyCsrfToken,
  requireAuth,
  requireAdmin,
  validate(idParamSchema, 'params'),
  validate(busSeatLayoutUpdateSchema),
  updateBusSeatLayout,
);
