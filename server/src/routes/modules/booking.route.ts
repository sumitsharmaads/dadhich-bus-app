import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { validate } from '../../middlewares/validate.middleware';
import { requireAuth } from '../../middlewares/authenticated.middleware';
import { requireAdmin } from '../../middlewares/admin.middleware';
import {
  adminMarkPaidSchema,
  bookingAdminListQuerySchema,
  bookingCodeParamSchema,
  bookingRefundSchema,
  bookingCancelSchema,
  createBookingSchema,
} from '../../schemas/booking.schema';
import {
  adminListBookings,
  adminMarkPaid,
  createBooking,
  getBookingByCode,
  cancelBooking,
  refundBooking,
} from '../../controllers/booking.controller';
import { paymentRouter } from './payment.route';
import { requireStepUp } from '../../middlewares/stepup.middleware';
import { verifyCsrfToken } from '../../middlewares/csrf.middleware';

export const bookingRouter = Router();

const limiter = rateLimit({
  windowMs: 60_000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
});

const strictLimiter = rateLimit({
  windowMs: 60_000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

// Public
bookingRouter.post(
  '/',
  strictLimiter,
  verifyCsrfToken,
  validate(createBookingSchema),
  createBooking,
);
bookingRouter.get('/:code', limiter, validate(bookingCodeParamSchema, 'params'), getBookingByCode);

// Nested payments for a specific booking
bookingRouter.use('/:code/payments', validate(bookingCodeParamSchema, 'params'), paymentRouter);

// Admin
bookingRouter.get(
  '/admin/list',
  limiter,
  verifyCsrfToken,
  requireAuth,
  requireAdmin,
  validate(bookingAdminListQuerySchema, 'query'),
  adminListBookings,
);
bookingRouter.post(
  '/:code/admin/mark-paid',
  strictLimiter,
  verifyCsrfToken,
  requireAuth,
  requireAdmin,
  validate(bookingCodeParamSchema, 'params'),
  validate(adminMarkPaidSchema),
  adminMarkPaid,
);

// Cancel/refund
bookingRouter.post(
  '/:code/cancel',
  strictLimiter,
  verifyCsrfToken,
  requireAuth,
  validate(bookingCodeParamSchema, 'params'),
  validate(bookingCancelSchema),
  cancelBooking,
);
bookingRouter.post(
  '/:code/admin/refund',
  strictLimiter,
  verifyCsrfToken,
  requireAuth,
  requireAdmin,
  requireStepUp,
  validate(bookingCodeParamSchema, 'params'),
  validate(bookingRefundSchema),
  refundBooking,
);
