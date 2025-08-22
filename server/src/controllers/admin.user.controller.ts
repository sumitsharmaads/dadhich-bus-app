import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { userRepository } from '../repositories/user.repository';
import { sendCreated, sendNoContent, sendSuccess } from '../utils/apiResponse';

export const adminCreateUser = asyncHandler(async (req: Request, res: Response) => {
  const data = req.body;
  const username = data.email.split('@')[0];
  const user = await userRepository.adminCreate({ ...data, username, createdByAdmin: true } as any);
  sendCreated(res, { id: user.id, email: user.email, fullname: user.fullname }, 'User created');
});

export const adminUpdateUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await userRepository.adminUpdate(id, req.body);
  sendSuccess(res, user, 'User updated');
});

export const adminDeleteUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await userRepository.softDelete(id);
  sendNoContent(res);
});

export const adminListUsers = asyncHandler(async (req: Request, res: Response) => {
  const result = await userRepository.list(req.body || {});
  sendSuccess(res, result, 'Users fetched');
});

export const adminGetUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await userRepository.findById(id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  sendSuccess(res, user, 'User fetched');
});

export const adminUpdateUserAccess = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { isActive, access } = req.body;
  const user = await userRepository.adminUpdate(id, { isActive, access });
  sendSuccess(res, user, 'User access updated');
});

export const adminBulkUpdateUsers = asyncHandler(async (req: Request, res: Response) => {
  const { userIds, updates } = req.body;
  const results = await Promise.all(
    userIds.map(async (userId: string) => {
      try {
        return await userRepository.adminUpdate(userId, updates);
      } catch (error) {
        return { userId, error: 'Failed to update' };
      }
    }),
  );
  sendSuccess(res, results, 'Users updated in bulk');
});

export const getDashboardStats = asyncHandler(async (_req: Request, res: Response) => {
  const stats = await userRepository.getUsersStats();
  sendSuccess(res, stats, 'Dashboard stats fetched');
});
