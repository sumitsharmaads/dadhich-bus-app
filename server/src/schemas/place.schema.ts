import { z } from 'zod';

export const countryCreateSchema = z.object({
  name: z.string().min(2),
  code: z.string().min(2).max(3).toUpperCase(),
  slug: z.string().min(2),
});

export const countryUpdateSchema = countryCreateSchema.partial();

export const stateCreateSchema = z.object({
  name: z.string().min(2),
  code: z.string().min(1).max(10).optional(),
  slug: z.string().min(2),
  countryId: z.string().min(1),
});

export const stateUpdateSchema = stateCreateSchema.partial();

export const cityCreateSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  countryId: z.string().min(1),
  stateId: z.string().min(1),
  location: z
    .object({
      type: z.literal('Point').default('Point'),
      coordinates: z.tuple([z.number(), z.number()]),
    })
    .optional(),
});

export const cityUpdateSchema = cityCreateSchema.partial();

export const idParamSchema = z.object({ id: z.string().min(1) });
