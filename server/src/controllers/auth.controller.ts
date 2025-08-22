import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendCreated, sendSuccess } from '../utils/apiResponse';
import { userRepository } from '../repositories/user.repository';
import { AppError } from '../utils/errors';
import { generateRandomToken } from '../lib/crypto';
import mongoose from 'mongoose';
import { User } from '../models/user.model';
import { websiteRepository } from '../repositories/website.repository';
import { renderTemplate, sendBrandedMail } from '../lib/mailer';

export const tempRegister = asyncHandler(async (req: Request, res: Response) => {
  const { fullname, email, phone, password } = req.body as {
    fullname: string;
    email: string;
    phone?: string;
    password: string;
  };
  const existing = await userRepository.findByEmail(email);
  if (existing) throw new AppError('Email already in use', 409);
  const username = email.split('@')[0];
  const user = await userRepository.create({
    fullname,
    email,
    username,
    phone: phone ? Number(phone) : undefined,
    password,
  } as any);

  // Return complete user data for consistency with login
  sendCreated(
    res,
    {
      id: user.id,
      email: user.email,
      fullname: user.fullname,
      username: user.username,
      phone: user.phone || '',
      gender: user.gender || '',
      roleType: user.roleType,
      isActive: user.isActive,
      isVerified: user.isVerified,
      access: user.access,
    },
    'Registered successfully',
  );
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };
  const user = await userRepository.findByEmail(email, true);
  if (!user) throw new AppError('Invalid credentials', 401);
  const ok = await user.comparePassword(password);
  if (!ok) throw new AppError('Invalid credentials', 401);
  const session = (req as any).session;
  session.userId = new mongoose.Types.ObjectId(user.id);
  await session.save();

  // Return complete user data needed by frontend
  sendSuccess(
    res,
    {
      id: user.id,
      email: user.email,
      fullname: user.fullname,
      username: user.username,
      phone: user.phone || '',
      gender: user.gender || '',
      roleType: user.roleType,
      isActive: user.isActive,
      isVerified: user.isVerified,
      access: user.access,
    },
    'Logged in',
  );
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body as { email: string };
  const user = await userRepository.findByEmail(email);
  if (!user) throw new AppError('User not found', 404);
  const session = (req as any).session;
  session.resetToken = generateRandomToken(16);
  session.resetUserId = new mongoose.Types.ObjectId(user.id);
  session.resetExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
  await session.save();

  const host = (req.headers.host || '').split(':')[0];
  const website = await websiteRepository.getByHost(host);
  const resetUrl = `https://${host}/reset-password?token=${session.resetToken}`;
  const html =
    (await renderTemplate('password_reset_template.html', {
      website,
      user,
      resetUrl,
      ttlMinutes: 10,
    })) ||
    `<p>Hi ${user.fullname},</p><p>Use this link to reset your password: <a href="${resetUrl}">${resetUrl}</a></p><p>This link expires in 10 minutes.</p>`;
  const to = [user.email];
  await sendBrandedMail(
    // @ts-ignore
    website || {
      branding: { brandName: 'Website' },
      contact: { emails: {} },
      domains: { primary: host },
    },
    'Reset your password',
    html,
    to,
  );

  sendSuccess(res, { message: 'Password reset link sent.' }, 'Password reset initiated');
});

export const selfUpdate = asyncHandler(async (req: Request, res: Response) => {
  const session = (req as any).session;
  if (!session?.userId) throw new AppError('Unauthorized', 401);
  const updated = await userRepository.selfUpdate(String(session.userId), req.body);
  sendSuccess(res, updated, 'Profile updated');
});

export const changePassword = asyncHandler(async (req: Request, res: Response) => {
  const session = (req as any).session;
  if (!session?.userId) throw new AppError('Unauthorized', 401);
  const { oldPassword, newPassword } = req.body as { oldPassword: string; newPassword: string };
  const user = await User.findById(session.userId).select('+password').exec();
  if (!user) throw new AppError('User not found', 404);
  const ok = await user.comparePassword(oldPassword);
  if (!ok) throw new AppError('Invalid current password', 400);
  user.password = newPassword;
  await user.save();
  sendSuccess(res, null, 'Password changed');
});

export const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
  const session = (req as any).session;
  if (!session?.userId) throw new AppError('Unauthorized', 401);

  const user = await userRepository.findById(String(session.userId));
  if (!user) throw new AppError('User not found', 404);

  // Return complete user data
  sendSuccess(
    res,
    {
      id: user.id,
      email: user.email,
      fullname: user.fullname,
      username: user.username,
      phone: user.phone || '',
      gender: user.gender || '',
      roleType: user.roleType,
      isActive: user.isActive,
      isVerified: user.isVerified,
      access: user.access,
    },
    'Current user data',
  );
});
