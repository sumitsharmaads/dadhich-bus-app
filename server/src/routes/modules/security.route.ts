import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import {
  webauthnGenerateRegistrationOptions,
  webauthnVerifyRegistration,
  webauthnGenerateAuthenticationOptions,
  webauthnVerifyAuthentication,
} from '../../controllers/webauthn.controller';
import { totpDisable, totpEnable, totpEnroll, totpStepUp } from '../../controllers/totp.controller';
import { requireAuth } from '../../middlewares/authenticated.middleware';
import { verifyCsrfToken } from '../../middlewares/csrf.middleware';

export const securityRouter = Router();

const limiter = rateLimit({
  windowMs: 60_000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
});

// WebAuthn
securityRouter.get(
  '/webauthn/register/options',
  limiter,
  requireAuth,
  webauthnGenerateRegistrationOptions,
);
securityRouter.post(
  '/webauthn/register/verify',
  limiter,
  requireAuth,
  verifyCsrfToken,
  webauthnVerifyRegistration,
);
securityRouter.get(
  '/webauthn/authenticate/options',
  limiter,
  requireAuth,
  webauthnGenerateAuthenticationOptions,
);
securityRouter.post(
  '/webauthn/authenticate/verify',
  limiter,
  requireAuth,
  verifyCsrfToken,
  webauthnVerifyAuthentication,
);

// TOTP
securityRouter.get('/totp/enroll', limiter, requireAuth, totpEnroll);
securityRouter.post('/totp/enable', limiter, requireAuth, verifyCsrfToken, totpEnable);
securityRouter.post('/totp/disable', limiter, requireAuth, verifyCsrfToken, totpDisable);
securityRouter.post('/totp/step-up', limiter, requireAuth, verifyCsrfToken, totpStepUp);
