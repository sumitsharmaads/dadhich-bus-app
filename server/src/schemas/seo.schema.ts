import { z } from 'zod';

export const seoCreateSchema = z.object({
  routePath: z.string().min(1),
  pageName: z.string().optional(),
  meta: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
      keywords: z.array(z.string()).optional(),
    })
    .optional(),
  openGraph: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
      imageUrl: z.string().url().optional(),
    })
    .optional(),
  twitter: z
    .object({
      card: z.enum(['summary', 'summary_large_image', 'app', 'player']).optional(),
      title: z.string().optional(),
      description: z.string().optional(),
      imageUrl: z.string().url().optional(),
    })
    .optional(),
  canonicalUrl: z.string().url().optional(),
  robots: z
    .object({ noindex: z.boolean().optional(), nofollow: z.boolean().optional() })
    .optional(),
  structuredData: z.record(z.string(), z.unknown()).nullable().optional(),
  isPublished: z.boolean().optional(),
});

export const seoUpdateSchema = seoCreateSchema.partial();

export const seoRouteQuerySchema = z.object({ routePath: z.string().min(1) });

export const idParamSchema = z.object({ id: z.string().min(1) });
