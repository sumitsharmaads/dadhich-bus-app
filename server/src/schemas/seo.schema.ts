import { z } from 'zod';

export const seoCreateSchema = z.object({
  routePath: z.string().min(1),
  pageName: z.string().optional(),

  // Basic Meta Tags
  meta: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
      keywords: z.array(z.string()).optional(),
    })
    .optional(),

  // Open Graph
  openGraph: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
      imageUrl: z.string().url().optional(),
      imageWidth: z.number().optional(),
      imageHeight: z.number().optional(),
      imageAlt: z.string().optional(),
    })
    .optional(),

  // Twitter Cards
  twitter: z
    .object({
      card: z.enum(['summary', 'summary_large_image', 'app', 'player']).optional(),
      title: z.string().optional(),
      description: z.string().optional(),
      imageUrl: z.string().url().optional(),
    })
    .optional(),

  // Technical SEO
  canonicalUrl: z.string().url().optional(),
  robots: z
    .object({
      noindex: z.boolean().optional(),
      nofollow: z.boolean().optional(),
      noarchive: z.boolean().optional(),
      nosnippet: z.boolean().optional(),
      noimageindex: z.boolean().optional(),
      maxSnippet: z.number().optional(),
      maxImagePreview: z.enum(['none', 'standard', 'large']).optional(),
      maxVideoPreview: z.number().optional(),
    })
    .optional(),

  // Structured Data
  structuredData: z.record(z.string(), z.unknown()).nullable().optional(),

  // Content Optimization
  contentOptimization: z
    .object({
      focusKeyword: z.string().optional(),
      secondaryKeywords: z.array(z.string()).optional(),
      contentLength: z.number().optional(),
      readabilityScore: z.number().optional(),
      internalLinks: z.array(z.string()).optional(),
      externalLinks: z.array(z.string()).optional(),
    })
    .optional(),

  // Publishing Control
  isPublished: z.boolean().optional(),
  priority: z.number().min(0).max(1).optional(),
  changeFrequency: z
    .enum(['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'])
    .optional(),
});

export const seoUpdateSchema = seoCreateSchema.partial();

export const seoRouteQuerySchema = z.object({ routePath: z.string().min(1) });

export const idParamSchema = z.object({ id: z.string().min(1) });
