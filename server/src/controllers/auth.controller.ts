import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendCreated, sendSuccess } from '../utils/apiResponse';
import { userRepository } from '../repositories/user.repository';
import { AppError } from '../utils/errors';
import { sha256 } from '../lib/crypto';
import mongoose from 'mongoose';
import { User } from '../models/user.model';
import { Session } from '../models/session.model';
import { AccountLockout } from '../models/accountLockout.model';
import { EmailVerification } from '../models/emailVerification.model';
import { PasswordReset } from '../models/passwordReset.model';
import { websiteRepository } from '../repositories/website.repository';
import { renderTemplate, sendBrandedMail } from '../lib/mailer';
import { validatePasswordStrength } from '../utils/passwordValidator';

export const tempRegister = asyncHandler(async (req: Request, res: Response) => {
  const { fullname, email, phone, password } = req.body as {
    fullname: string;
    email: string;
    phone?: string;
    password: string;
  };

  // Validate password strength
  const passwordStrength = validatePasswordStrength(password);
  if (passwordStrength.score < 60) {
    throw new AppError(`Password is too weak. ${passwordStrength.feedback.join(' ')}`, 400);
  }

  const existing = await userRepository.findByEmail(email);
  if (existing) throw new AppError('Email already in use', 409);

  const username = email.split('@')[0];
  const user = await userRepository.create({
    fullname,
    email,
    username,
    phone: phone ? Number(phone) : undefined,
    password,
    isVerified: false, // User starts as unverified
    access: 1, // Awaiting email activation
  } as any);

  // Create email verification token
  const verificationToken = await EmailVerification.createVerificationToken(
    user._id as mongoose.Types.ObjectId,
    email,
  );

  // Get base URL for verification link
  const baseUrl = process.env.CLIENT_URL || 'http://localhost:3000';
  const verificationUrl = `${baseUrl}/verify-email?token=${verificationToken.token}`;

  // Send verification email
  try {
    const host = (req.headers.host || '').split(':')[0];
    const website = await websiteRepository.getByHost(host);
    if (website) {
      const data = {
        fullname: user.fullname,
        email: user.email,
        verificationUrl,
        website,
      };
      const emailHtml = await renderTemplate('email_verification_template.html', data);
      await sendBrandedMail(website, 'Verify Your Email - Dadhich Bus Services', emailHtml, [
        user.email as string,
      ]);
    }
  } catch (emailError) {
    console.error('Failed to send verification email:', emailError);
    // Don't fail registration if email fails, but log it
  }

  // Return user data with verification status
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
      message: 'Registration successful! Please check your email to verify your account.',
    },
    'Registration successful! Please check your email to verify your account.',
  );
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };
  const ipAddress = req.ip;
  const userAgent = req.headers['user-agent'];

  // Check if account is locked
  const isLocked = await AccountLockout.isAccountLocked(email);
  if (isLocked) {
    const remainingTime = await AccountLockout.getRemainingLockTime(email);
    const minutes = Math.ceil(remainingTime / 60);
    throw new AppError(
      `Account is temporarily locked due to too many failed login attempts. Please try again in ${minutes} minutes.`,
      423,
    );
  }

  const user = await userRepository.findByEmail(email, true);
  if (!user) {
    // Record failed attempt even if user doesn't exist (to prevent email enumeration)
    await AccountLockout.recordFailedAttempt(email, ipAddress, userAgent);
    throw new AppError('Invalid credentials', 401);
  }

  const ok = await user.comparePassword(password);
  if (!ok) {
    // Record failed attempt
    await AccountLockout.recordFailedAttempt(email, ipAddress, userAgent);
    throw new AppError('Invalid credentials', 401);
  }

  // Check if email is verified
  if (!user.isVerified) {
    throw new AppError(
      'Please verify your email address before logging in. Check your inbox for a verification email.',
      403,
    );
  }

  // Reset failed attempts on successful login
  await AccountLockout.resetFailedAttempts(email);

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

  // Validate new password strength
  const passwordStrength = validatePasswordStrength(newPassword);
  if (passwordStrength.score < 60) {
    throw new AppError(`Password is too weak. ${passwordStrength.feedback.join(' ')}`, 400);
  }

  const user = await User.findById(session.userId).select('+password').exec();
  if (!user) throw new AppError('User not found', 404);
  const ok = await user.comparePassword(oldPassword);
  if (!ok) throw new AppError('Invalid current password', 400);

  // Use the new updatePassword method that handles password history
  await user.updatePassword(newPassword);

  // Invalidate all other sessions for security
  await Session.deleteMany({
    userId: session.userId,
    _id: { $ne: session._id },
  });

  sendSuccess(res, null, 'Password changed successfully. Please log in again on other devices.');
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

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const session = (req as any).session;
  const sessionId = (req as any).sessionId;

  if (session && sessionId) {
    // Delete the current session
    await Session.deleteOne({ sessionIdHash: sha256(sessionId) });
  }

  // Clear the session cookie
  res.clearCookie('sid');

  sendSuccess(res, null, 'Logged out successfully');
});

export const logoutAllDevices = asyncHandler(async (req: Request, res: Response) => {
  const session = (req as any).session;
  if (!session?.userId) throw new AppError('Unauthorized', 401);

  // Delete all sessions for this user
  await Session.deleteMany({ userId: session.userId });

  // Clear the current session cookie
  res.clearCookie('sid');

  sendSuccess(res, null, 'Logged out from all devices');
});

export const getSessions = asyncHandler(async (req: Request, res: Response) => {
  const session = (req as any).session;
  if (!session?.userId) throw new AppError('Unauthorized', 401);

  const sessions = await Session.find({ userId: session.userId })
    .select('userAgent ip deviceId deviceName lastSeenAt createdAt')
    .sort({ lastSeenAt: -1 })
    .exec();

  const currentSessionId = (req as any).sessionId;
  const formattedSessions = sessions.map((s) => ({
    id: (s._id as any).toString(),
    userAgent: s.userAgent || 'Unknown',
    ip: s.ip || 'Unknown',
    deviceId: s.deviceId || 'Unknown',
    deviceName: s.deviceName || 'Unknown Device',
    lastSeenAt: s.lastSeenAt,
    createdAt: s.createdAt,
    isCurrent: s.sessionIdHash === sha256(currentSessionId),
  }));

  sendSuccess(res, { sessions: formattedSessions }, 'User sessions retrieved');
});

export const terminateSession = asyncHandler(async (req: Request, res: Response) => {
  const session = (req as any).session;
  if (!session?.userId) throw new AppError('Unauthorized', 401);

  const { sessionId } = req.params;
  const currentSessionId = (req as any).sessionId;

  // Prevent terminating current session
  if (sessionId === currentSessionId) {
    throw new AppError('Cannot terminate current session', 400);
  }

  // Find and delete the session
  const targetSession = await Session.findOne({
    _id: sessionId,
    userId: session.userId,
  }).exec();

  if (!targetSession) {
    throw new AppError('Session not found', 404);
  }

  await Session.deleteOne({ _id: sessionId });

  sendSuccess(res, null, 'Session terminated successfully');
});

export const validatePassword = asyncHandler(async (req: Request, res: Response) => {
  const { password } = req.body as { password: string };

  if (!password) {
    throw new AppError('Password is required', 400);
  }

  const passwordStrength = validatePasswordStrength(password);

  sendSuccess(
    res,
    {
      strength: passwordStrength,
      isValid: passwordStrength.score >= 60,
    },
    'Password validation completed',
  );
});

export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.query as { token: string };

  if (!token) {
    throw new AppError('Verification token is required', 400);
  }

  // Find and validate the verification token
  const verificationToken = await EmailVerification.verifyToken(token);

  if (!verificationToken) {
    throw new AppError('Invalid or expired verification token', 400);
  }

  // Update user verification status
  const user = await User.findByIdAndUpdate(
    verificationToken.userId,
    {
      isVerified: true,
      access: 0, // Set to active
    },
    { new: true },
  );

  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Mark token as used
  verificationToken.isUsed = true;
  await verificationToken.save();

  // Send verification success email
  try {
    const host = (req.headers.host || '').split(':')[0];
    const website = await websiteRepository.getByHost(host);
    if (website) {
      const baseUrl = process.env.CLIENT_URL || 'http://localhost:3000';
      const loginUrl = `${baseUrl}/login`;
      const data = {
        fullname: user.fullname,
        email: user.email,
        loginUrl,
        website,
      };
      const emailHtml = await renderTemplate('email_verified_template.html', data);
      await sendBrandedMail(
        website,
        'Email Verified Successfully - Dadhich Bus Services',
        emailHtml,
        [user.email as string],
      );
    }
  } catch (emailError) {
    console.error('Failed to send verification success email:', emailError);
    // Don't fail verification if email fails
  }

  sendSuccess(
    res,
    {
      id: user.id,
      email: user.email,
      fullname: user.fullname,
      isVerified: user.isVerified,
      access: user.access,
    },
    'Email verified successfully! You can now log in to your account.',
  );
});

export const resendVerificationEmail = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body as { email: string };

  if (!email) {
    throw new AppError('Email is required', 400);
  }

  // Find user
  const user = await User.findOne({ email, isDeleted: false });
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Check if already verified
  if (user.isVerified) {
    throw new AppError('Email is already verified', 400);
  }

  // Check for recent verification emails (rate limiting)
  const recentToken = await EmailVerification.findOne({
    userId: user._id,
    isUsed: false,
    createdAt: { $gte: new Date(Date.now() - 5 * 60 * 1000) }, // 5 minutes ago
  });

  if (recentToken) {
    throw new AppError('Please wait 5 minutes before requesting another verification email', 429);
  }

  // Create new verification token
  const verificationToken = await EmailVerification.createVerificationToken(
    user._id as mongoose.Types.ObjectId,
    email,
  );

  // Send verification email
  try {
    const host = (req.headers.host || '').split(':')[0];
    const website = await websiteRepository.getByHost(host);
    if (website) {
      const baseUrl = process.env.CLIENT_URL || 'http://localhost:3000';
      const verificationUrl = `${baseUrl}/verify-email?token=${verificationToken.token}`;
      const data = {
        fullname: user.fullname,
        email: user.email,
        verificationUrl,
        website,
      };
      const emailHtml = await renderTemplate('email_verification_template.html', data);
      await sendBrandedMail(website, 'Verify Your Email - Dadhich Bus Services', emailHtml, [
        user.email as string,
      ]);
    }
  } catch (emailError) {
    console.error('Failed to send verification email:', emailError);
    throw new AppError('Failed to send verification email. Please try again later.', 500);
  }

  sendSuccess(res, null, 'Verification email sent successfully');
});

// Request password reset
export const requestPasswordReset = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body as { email: string };

  if (!email) {
    throw new AppError('Email is required', 400);
  }

  // Find user by email
  const user = await userRepository.findByEmail(email);
  if (!user) {
    // Don't reveal if email exists or not for security
    return sendSuccess(
      res,
      { message: 'If the email exists, a password reset link has been sent.' },
      'Password reset email sent!',
    );
  }

  // Check if user is verified
  if (!user.isVerified) {
    throw new AppError('Please verify your email address before resetting your password.', 403);
  }

  // Get client IP and user agent for security tracking
  const ipAddress = req.ip || req.connection.remoteAddress || 'unknown';
  const userAgent = req.get('User-Agent') || 'unknown';

  // Create password reset token
  const resetToken = await PasswordReset.createResetToken(
    user._id as mongoose.Types.ObjectId,
    email,
    ipAddress,
    userAgent,
  );

  // Send password reset email
  try {
    const host = (req.headers.host || '').split(':')[0];
    const website = await websiteRepository.getByHost(host);
    if (website) {
      const baseUrl = process.env.CLIENT_URL || 'http://localhost:3000';
      const resetUrl = `${baseUrl}/reset-password?token=${resetToken.token}`;
      const data = {
        fullname: user.fullname,
        email: user.email,
        resetUrl,
        website,
      };
      const emailHtml = await renderTemplate('password_reset_template.html', data);
      await sendBrandedMail(website, 'Reset Your Password - Dadhich Bus Services', emailHtml, [
        user.email as string,
      ]);
    }
  } catch (emailError) {
    console.error('Failed to send password reset email:', emailError);
    throw new AppError('Failed to send password reset email. Please try again.', 500);
  }

  sendSuccess(
    res,
    { message: 'If the email exists, a password reset link has been sent.' },
    'Password reset email sent!',
  );
});

// Reset password with token
export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { token, newPassword } = req.body as { token: string; newPassword: string };

  if (!token || !newPassword) {
    throw new AppError('Token and new password are required', 400);
  }

  // Validate password strength
  const passwordStrength = validatePasswordStrength(newPassword);
  if (passwordStrength.score < 60) {
    throw new AppError(`Password is too weak. ${passwordStrength.feedback.join(' ')}`, 400);
  }

  // Find and validate the reset token
  const resetToken = await PasswordReset.verifyResetToken(token);
  if (!resetToken) {
    throw new AppError('Invalid or expired reset token', 400);
  }

  // Find the user with password field
  const user = await User.findById(resetToken.userId).select('+password');
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Check if new password is different from current password
  const isCurrentPassword = await user.comparePassword(newPassword);
  if (isCurrentPassword) {
    throw new AppError('New password must be different from your current password', 400);
  }

  // Check password history (prevent reuse of last 5 passwords)
  const PasswordHistory = require('../models/passwordHistory.model').PasswordHistory;
  const recentPasswords = await PasswordHistory.find({ userId: user._id })
    .sort({ createdAt: -1 })
    .limit(5)
    .select('passwordHash');

  for (const history of recentPasswords) {
    const isReused = await require('bcryptjs').compare(newPassword, history.passwordHash);
    if (isReused) {
      throw new AppError('You cannot reuse any of your last 5 passwords', 400);
    }
  }

  // Hash the new password
  const hashedPassword = await require('bcryptjs').hash(newPassword, 12);

  // Save old password to history before updating
  await PasswordHistory.create({
    userId: user._id,
    passwordHash: user.password,
  });

  // Update user password
  user.password = hashedPassword;
  await user.save();

  // Mark reset token as used
  resetToken.isUsed = true;
  await resetToken.save();

  // Invalidate all user sessions for security
  await Session.deleteMany({ userId: user._id });

  // Send password reset success email
  try {
    const host = (req.headers.host || '').split(':')[0];
    const website = await websiteRepository.getByHost(host);
    if (website) {
      const baseUrl = process.env.CLIENT_URL || 'http://localhost:3000';
      const loginUrl = `${baseUrl}/login`;
      const data = {
        fullname: user.fullname,
        email: user.email,
        loginUrl,
        website,
      };
      const emailHtml = await renderTemplate('password_reset_success_template.html', data);
      await sendBrandedMail(
        website,
        'Password Reset Successful - Dadhich Bus Services',
        emailHtml,
        [user.email as string],
      );
    }
  } catch (emailError) {
    console.error('Failed to send password reset success email:', emailError);
    // Don't fail password reset if email fails
  }

  sendSuccess(
    res,
    { message: 'Password reset successfully! Please log in with your new password.' },
    'Password reset successful!',
  );
});
