import { z } from 'zod';

export const termsCreateSchema = z.object({
  title: z.string().optional(),
  slug: z.string().min(1).optional(),
  text: z.string().min(1),
  isCurrent: z.boolean().optional(),
  publishedAt: z.string().datetime().optional(),
});

export const termsUpdateSchema = z.object({
  title: z.string().optional(),
  slug: z.string().min(1).optional(),
  text: z.string().min(1).optional(),
  isCurrent: z.boolean().optional(),
  publishedAt: z.string().datetime().optional(),
});

export const termsIdParamSchema = z.object({ id: z.string().min(1) });

export type TermsCreateInput = z.infer<typeof termsCreateSchema>;
export type TermsUpdateInput = z.infer<typeof termsUpdateSchema>;
