import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { validate } from '../../middlewares/validate.middleware';
import { requireAuth } from '../../middlewares/authenticated.middleware';
import { requireAdmin } from '../../middlewares/admin.middleware';
import {
  bankTransferReconcileSchema,
  bankTransferSubmitSchema,
  bookingPaymentInitSchema,
  mockWebhookSchema,
} from '../../schemas/payment.schema';
import {
  bankTransferReconcile,
  bankTransferSubmit,
  initiatePayment,
  paymentWebhook,
} from '../../controllers/payment.controller';
import { requireStepUp } from '../../middlewares/stepup.middleware';
import { verifyCsrfToken } from '../../middlewares/csrf.middleware';

export const paymentRouter = Router({ mergeParams: true });

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

// Initiate gateway payment for a booking
paymentRouter.post(
  '/init',
  strictLimiter,
  verifyCsrfToken,
  requireAuth,
  validate(bookingPaymentInitSchema),
  initiatePayment,
);

// Mock webhook (provider-agnostic endpoint in real use)
paymentRouter.post('/webhook', strictLimiter, validate(mockWebhookSchema), paymentWebhook);

// Bank transfer flows
paymentRouter.post(
  '/bank-transfer/submit',
  limiter,
  verifyCsrfToken,
  requireAuth,
  validate(bankTransferSubmitSchema),
  bankTransferSubmit,
);
paymentRouter.post(
  '/bank-transfer/reconcile',
  strictLimiter,
  verifyCsrfToken,
  requireAuth,
  requireAdmin,
  requireStepUp,
  validate(bankTransferReconcileSchema),
  bankTransferReconcile,
);
