import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { validate } from '../../middlewares/validate.middleware';
import { requireAuth } from '../../middlewares/authenticated.middleware';
import { requireAdmin } from '../../middlewares/admin.middleware';
import {
  countryCreateSchema,
  countryUpdateSchema,
  stateCreateSchema,
  stateUpdateSchema,
  cityCreateSchema,
  cityUpdateSchema,
  idParamSchema,
} from '../../schemas/place.schema';
import {
  createCountry,
  deleteCountry,
  getCountry,
  listCountries,
  updateCountry,
  createState,
  deleteState,
  getState,
  listStates,
  updateState,
  createCity,
  deleteCity,
  getCity,
  listCities,
  updateCity,
} from '../../controllers/place.controller';
import { uploadSingleFile } from '../../middlewares/upload.middleware';
import { bulkUploadCities, downloadCityBulkTemplate } from '../../controllers/city.bulk.controller';
import { verifyCsrfToken } from '../../middlewares/csrf.middleware';

export const placeRouter = Router();

const limiter = rateLimit({
  windowMs: 60_000,
  max: 80,
  standardHeaders: true,
  legacyHeaders: false,
});

// Countries
placeRouter.get('/countries', limiter, listCountries);
placeRouter.get('/countries/:id', limiter, validate(idParamSchema, 'params'), getCountry);
placeRouter.post(
  '/countries',
  limiter,
  verifyCsrfToken,
  requireAuth,
  requireAdmin,
  validate(countryCreateSchema),
  createCountry,
);
placeRouter.put(
  '/countries/:id',
  limiter,
  verifyCsrfToken,
  requireAuth,
  requireAdmin,
  validate(idParamSchema, 'params'),
  validate(countryUpdateSchema),
  updateCountry,
);
placeRouter.delete(
  '/countries/:id',
  limiter,
  verifyCsrfToken,
  requireAuth,
  requireAdmin,
  validate(idParamSchema, 'params'),
  deleteCountry,
);

// States
placeRouter.get('/states', limiter, listStates);
placeRouter.get('/states/:id', limiter, validate(idParamSchema, 'params'), getState);
placeRouter.post(
  '/states',
  limiter,
  verifyCsrfToken,
  requireAuth,
  requireAdmin,
  validate(stateCreateSchema),
  createState,
);
placeRouter.put(
  '/states/:id',
  limiter,
  verifyCsrfToken,
  requireAuth,
  requireAdmin,
  validate(idParamSchema, 'params'),
  validate(stateUpdateSchema),
  updateState,
);
placeRouter.delete(
  '/states/:id',
  limiter,
  verifyCsrfToken,
  requireAuth,
  requireAdmin,
  validate(idParamSchema, 'params'),
  deleteState,
);

// Cities
placeRouter.get('/cities', limiter, listCities);
placeRouter.get('/cities/:id', limiter, validate(idParamSchema, 'params'), getCity);
placeRouter.post(
  '/cities',
  limiter,
  verifyCsrfToken,
  requireAuth,
  requireAdmin,
  validate(cityCreateSchema),
  createCity,
);
placeRouter.put(
  '/cities/:id',
  limiter,
  verifyCsrfToken,
  requireAuth,
  requireAdmin,
  validate(idParamSchema, 'params'),
  validate(cityUpdateSchema),
  updateCity,
);
placeRouter.delete(
  '/cities/:id',
  limiter,
  verifyCsrfToken,
  requireAuth,
  requireAdmin,
  validate(idParamSchema, 'params'),
  deleteCity,
);

// Bulk upload cities (admin)
placeRouter.post(
  '/cities/bulk',
  limiter,
  verifyCsrfToken,
  requireAuth,
  requireAdmin,
  uploadSingleFile,
  bulkUploadCities,
);
placeRouter.get(
  '/cities/bulk/template',
  limiter,
  verifyCsrfToken,
  requireAuth,
  requireAdmin,
  downloadCityBulkTemplate,
);
