import { Router } from 'express';
import rateLimit from 'express-rate-limit';

import {
  tempRegister,
  login,
  forgotPassword,
  selfUpdate,
  changePassword,
} from '../../controllers/auth.controller';
import { validate } from '../../middlewares/validate.middleware';
import {
  changePasswordSchema,
  forgotPasswordSchema,
  loginSchema,
  selfUpdateSchema,
  tempRegisterSchema,
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

authRouter.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), forgotPassword);

authRouter.put(
  '/me',
  authLimiter,
  verifyCsrfToken,
  requireAuth,
  validate(selfUpdateSchema),
  selfUpdate,
);

authRouter.post(
  '/reset-password',
  authLimiter,
  verifyCsrfToken,
  requireAuth,
  validate(changePasswordSchema),
  changePassword,
);
