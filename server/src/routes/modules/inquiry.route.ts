import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { validate } from '../../middlewares/validate.middleware';
import {
  contactUsSchema,
  inquiryEmailSchema,
  localBusRentalSchema,
  outstationBusRentalSchema,
  planTourHelpSchema,
  quickConnectSchema,
  tourInquirySchema,
  customTourPlanningSchema,
  helpWidgetSchema,
} from '../../schemas/inquiry.schema';
import {
  contactUs,
  inquiryEmail,
  localBusRental,
  outstationBusRental,
  planTourHelp,
  quickConnect,
  tourInquiry,
  customTourPlanning,
  helpWidget,
} from '../../controllers/inquiry.controller';

export const inquiryRouter = Router();

const limiter = rateLimit({
  windowMs: 60_000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
});
const strictLimiter = rateLimit({
  windowMs: 60_000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

inquiryRouter.post('/inquiry-email', strictLimiter, validate(inquiryEmailSchema), inquiryEmail);
inquiryRouter.post('/contact-us', strictLimiter, validate(contactUsSchema), contactUs);
inquiryRouter.post('/rental/local', limiter, validate(localBusRentalSchema), localBusRental);
inquiryRouter.post(
  '/rental/outstation',
  limiter,
  validate(outstationBusRentalSchema),
  outstationBusRental,
);
inquiryRouter.post('/tour/inquiry', limiter, validate(tourInquirySchema), tourInquiry);
inquiryRouter.post('/tour/plan-help', limiter, validate(planTourHelpSchema), planTourHelp);
inquiryRouter.post(
  '/tour/custom-planning',
  limiter,
  validate(customTourPlanningSchema),
  customTourPlanning,
);
inquiryRouter.post('/help-widget', limiter, validate(helpWidgetSchema), helpWidget);
inquiryRouter.post('/quick-connect', limiter, validate(quickConnectSchema), quickConnect);
