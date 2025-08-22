import { Router } from 'express';
import { requireAuth } from '../../middlewares/authenticated.middleware';
import {
  adminCreateUser,
  adminDeleteUser,
  adminListUsers,
  adminUpdateUser,
  adminGetUser,
  adminUpdateUserAccess,
  adminBulkUpdateUsers,
  getDashboardStats,
} from '../../controllers/admin.user.controller';
import { validate } from '../../middlewares/validate.middleware';
import { adminCreateUserSchema, adminUpdateUserSchema } from '../../schemas/auth.schema';
import { requireAdmin } from '../../middlewares/admin.middleware';
import { verifyCsrfToken } from '../../middlewares/csrf.middleware';
import { getCurrentUser } from '../../controllers/auth.controller';

export const userRouter = Router();

// Public routes (if any)
userRouter.get('/me', requireAuth, getCurrentUser);

// Admin routes - User Management
userRouter.post(
  '/admin',
  requireAuth,
  requireAdmin,
  verifyCsrfToken,
  validate(adminCreateUserSchema),
  adminCreateUser,
);

userRouter.get('/admin/:id', requireAuth, requireAdmin, adminGetUser);

userRouter.put(
  '/admin/:id',
  requireAuth,
  requireAdmin,
  verifyCsrfToken,
  validate(adminUpdateUserSchema),
  adminUpdateUser,
);

userRouter.patch(
  '/admin/:id/access',
  requireAuth,
  requireAdmin,
  verifyCsrfToken,
  adminUpdateUserAccess,
);

userRouter.delete('/admin/:id', requireAuth, requireAdmin, verifyCsrfToken, adminDeleteUser);

userRouter.post('/admin/list', requireAuth, requireAdmin, verifyCsrfToken, adminListUsers);

userRouter.post(
  '/admin/bulk-update',
  requireAuth,
  requireAdmin,
  verifyCsrfToken,
  adminBulkUpdateUsers,
);

// Dashboard stats
userRouter.get('/admin/dashboard/stats', requireAuth, requireAdmin, getDashboardStats);
