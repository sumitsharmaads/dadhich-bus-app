import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { uploadSingle } from '../../middlewares/upload.middleware';
import multer from 'multer';
import { requireAuth } from '../../middlewares/authenticated.middleware';
import { requireAdmin } from '../../middlewares/admin.middleware';
import { verifyCsrfToken } from '../../middlewares/csrf.middleware';
import {
  deleteImage,
  renameImage,
  uploadImage,
  uploadImages,
} from '../../controllers/media.controller';

export const mediaRouter = Router();

const limiter = rateLimit({
  windowMs: 60_000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
});

const storage = multer.memoryStorage();
const uploadMany = multer({ storage }).array('files', 10);

mediaRouter.post(
  '/upload',
  limiter,
  verifyCsrfToken,
  requireAuth,
  requireAdmin,
  uploadSingle,
  uploadImage,
);
mediaRouter.post(
  '/upload-multiple',
  limiter,
  verifyCsrfToken,
  requireAuth,
  requireAdmin,
  uploadMany,
  uploadImages,
);
mediaRouter.post('/delete', limiter, verifyCsrfToken, requireAuth, requireAdmin, deleteImage);
mediaRouter.post('/rename', limiter, verifyCsrfToken, requireAuth, requireAdmin, renameImage);
