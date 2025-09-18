import { Router } from 'express';
import rateLimit from 'express-rate-limit';

import {
  tempRegister,
  login,
  requestPasswordReset,
  resetPassword,
  selfUpdate,
  changePassword,
  logout,
  logoutAllDevices,
  getSessions,
  terminateSession,
  validatePassword,
  verifyEmail,
  resendVerificationEmail,
} from '../../controllers/auth.controller';
import { validate } from '../../middlewares/validate.middleware';
import {
  changePasswordSchema,
  forgotPasswordSchema,
  loginSchema,
  selfUpdateSchema,
  tempRegisterSchema,
  resendVerificationSchema,
  resetPasswordSchema,
} from '../../schemas/auth.schema';
import { requireAuth } from '../../middlewares/authenticated.middleware';
import { verifyCsrfToken } from '../../middlewares/csrf.middleware';

export const authRouter = Router();

const authLimiter = rateLimit({
  windowMs: 60_000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

authRouter.post('/register', authLimiter, validate(tempRegisterSchema), tempRegister);

authRouter.post('/login', authLimiter, validate(loginSchema), login);

authRouter.post(
  '/forgot-password',
  authLimiter,
  validate(forgotPasswordSchema),
  requestPasswordReset,
);
authRouter.post('/reset-password', authLimiter, validate(resetPasswordSchema), resetPassword);

authRouter.put(
  '/me',
  authLimiter,
  verifyCsrfToken,
  requireAuth,
  validate(selfUpdateSchema),
  selfUpdate,
);

authRouter.post(
  '/change-password',
  authLimiter,
  verifyCsrfToken,
  requireAuth,
  validate(changePasswordSchema),
  changePassword,
);

// Password validation route (public)
authRouter.post('/validate-password', authLimiter, validatePassword);

// Email verification routes (public)
authRouter.get('/verify-email', authLimiter, verifyEmail);
authRouter.post(
  '/resend-verification',
  authLimiter,
  validate(resendVerificationSchema),
  resendVerificationEmail,
);

// Session management routes
authRouter.post('/logout', requireAuth, logout);
authRouter.post('/logout-all', requireAuth, logoutAllDevices);
authRouter.get('/sessions', requireAuth, getSessions);
authRouter.delete('/sessions/:sessionId', requireAuth, terminateSession);
