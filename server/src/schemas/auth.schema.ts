import { z } from 'zod';

export const tempRegisterSchema = z.object({
  fullname: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z
    .string()
    .regex(/^\d{10}$/)
    .optional(),
  password: z.string().min(10).max(128),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

export const forgotPasswordSchema = z.object({ email: z.string().email() });

export const selfUpdateSchema = z.object({
  fullname: z.string().min(2).max(100).optional(),
  phone: z
    .string()
    .regex(/^\d{10}$/)
    .optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
});

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(8).max(128),
  newPassword: z.string().min(10).max(128),
});

export const adminCreateUserSchema = z.object({
  fullname: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(10).max(128),
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
