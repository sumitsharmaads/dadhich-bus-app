import { z } from 'zod';
import { passwordSchema } from '../utils/passwordValidator';

export const tempRegisterSchema = z.object({
  fullname: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z
    .string()
    .regex(/^\d{10}$/)
    .optional(),
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password is required'), // Basic validation for login
});

export const forgotPasswordSchema = z.object({ email: z.string().email() });

export const resendVerificationSchema = z.object({ email: z.string().email() });

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  newPassword: passwordSchema,
});

export const selfUpdateSchema = z.object({
  fullname: z.string().min(2).max(100).optional(),
  phone: z
    .string()
    .regex(/^\d{10}$/)
    .optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
});

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, 'Current password is required'),
  newPassword: passwordSchema,
});

export const adminCreateUserSchema = z.object({
  fullname: z.string().min(2).max(100),
  email: z.string().email(),
  password: passwordSchema,
  gender: z.enum(['male', 'female', 'other']).optional(),
  roleType: z.number().int().min(0).max(2).default(1),
  phone: z
    .string()
    .regex(/^\d{10}$/)
    .optional(),
});

export const adminUpdateUserSchema = z.object({
  fullname: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  roleType: z.number().int().min(0).max(2).optional(),
  isActive: z.boolean().optional(),
  access: z.number().int().min(-1).max(2).optional(),
  phone: z
    .string()
    .regex(/^\d{10}$/)
    .optional(),
});

export type TempRegisterInput = z.infer<typeof tempRegisterSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
