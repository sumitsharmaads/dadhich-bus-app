import { z } from 'zod';

export const tourCreateSchema = z.object({
  tourName: z.string().min(2),
  description: z.string().optional().or(z.literal('')).nullable(),
  shortDescription: z.string().optional().or(z.literal('')).nullable(),
  highlights: z.array(z.string()).optional().nullable(),
  sources: z
    .array(
      z.object({
        cityId: z.string().min(1),
        cityName: z.string().optional().or(z.literal('')).nullable(),
        fare: z.number().positive(),
        onBoarding: z.array(z.string()).optional().nullable(),
        departureTime: z.string().optional().or(z.literal('')).nullable(),
        arrivalTime: z.string().optional().or(z.literal('')).nullable(),
      }),
    )
    .min(1),
  places: z
    .array(
      z.object({
        cityId: z.string().min(1),
        name: z.string().optional().or(z.literal('')).nullable(),
        state: z.string().optional().or(z.literal('')).nullable(),
        order: z.number().optional().nullable(),
        stayDuration: z.number().optional().nullable(),
        activities: z.array(z.string()).optional().nullable(),
      }),
    )
    .min(1),
  heroImage: z
    .object({
      url: z.string().url().optional().or(z.literal('')).nullable(),
      id: z.string().optional().or(z.literal('')).nullable(),
    })
    .optional()
    .nullable(),
  gallery: z
    .array(
      z.object({
        url: z.string().url().optional().or(z.literal('')).nullable(),
        id: z.string().optional().or(z.literal('')).nullable(),
        caption: z.string().optional().or(z.literal('')).nullable(),
      }),
    )
    .optional()
    .nullable(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  duration: z.string().optional().or(z.literal('')).nullable(),
  days: z.number().int().optional().nullable(),
  nights: z.number().int().optional().nullable(),
  stayDescription: z
    .array(
      z.object({
        nights: z.number().optional().nullable(),
        place: z.string().optional().or(z.literal('')).nullable(),
        accommodation: z.string().optional().or(z.literal('')).nullable(),
        checkIn: z.string().optional().or(z.literal('')).nullable(),
        checkOut: z.string().optional().or(z.literal('')).nullable(),
      }),
    )
    .optional()
    .nullable(),
  busId: z.string().optional().or(z.literal('')).nullable(),
  captainUserId: z.string().optional().or(z.literal('')).nullable(),
  inclusive: z.array(z.string()).min(1),
  exclusive: z.array(z.string()).optional().nullable(),
  type: z.array(z.string()).min(1),
  category: z.string().optional().or(z.literal('')).nullable(),
  capacity: z.number().int().positive(),
  itinerary: z
    .array(
      z.object({
        title: z.string().min(1),
        shortDescription: z.string().optional().or(z.literal('')).nullable(),
        toggles: z.array(z.string()).optional().nullable(),
        sightseeing: z.array(z.string()).optional().nullable(),
        order: z.number().optional().nullable(),
        day: z.number().optional().nullable(),
        duration: z.string().optional().or(z.literal('')).nullable(),
        meals: z.array(z.string()).optional().nullable(),
        accommodation: z.string().optional().or(z.literal('')).nullable(),
        transportation: z.string().optional().or(z.literal('')).nullable(),
        highlights: z.array(z.string()).optional().nullable(),
        notes: z.string().optional().or(z.literal('')).nullable(),
      }),
    )
    .optional()
    .nullable(),
  pricing: z.object({
    minFare: z.number().positive(),
    currencyCode: z.string().min(3).max(3).default('INR'),
  }),
  discount: z
    .object({
      type: z.enum(['percent', 'amount']),
      value: z.number().positive(),
      validFrom: z.string().datetime().optional().nullable(),
      validTo: z.string().datetime().optional().nullable(),
      minAmount: z.number().positive().optional().nullable(),
      maxDiscount: z.number().positive().optional().nullable(),
      applicableOn: z.string().optional().or(z.literal('')).nullable(),
    })
    .optional()
    .nullable(),
  groupDiscounts: z
    .array(
      z.object({
        minMembers: z.number().int().positive(),
        maxMembers: z.number().int().positive().optional().nullable(),
        type: z.enum(['percent', 'amount']),
        value: z.number().positive(),
        applicableOn: z.string().optional().or(z.literal('')).nullable(),
        description: z.string().optional().or(z.literal('')).nullable(),
      }),
    )
    .optional()
    .nullable(),
  seo: z
    .object({
      title: z.string().optional().or(z.literal('')).nullable(),
      description: z.string().optional().or(z.literal('')).nullable(),
      keywords: z.array(z.string()).optional().nullable(),
    })
    .optional()
    .nullable(),
  seoRoutePath: z.string().optional().or(z.literal('')).nullable(),
  status: z.enum(['draft', 'published']).optional().nullable(),
  isActive: z.boolean().optional().nullable(),
  isFeatured: z.boolean().optional().nullable(),
  difficulty: z.enum(['easy', 'moderate', 'difficult']).optional().nullable(),
  ageGroup: z.array(z.string()).optional().nullable(),
  fitnessLevel: z.string().optional().or(z.literal('')).nullable(),
  specialRequirements: z.array(z.string()).optional().nullable(),
  cancellationPolicy: z.string().optional().or(z.literal('')).nullable(),
  refundPolicy: z.string().optional().or(z.literal('')).nullable(),
});

export const tourUpdateSchema = tourCreateSchema.partial();

export const idParamSchema = z.object({ id: z.string().min(1) });

export const tourPublicQuerySchema = z.object({
  q: z.string().optional().or(z.literal('')).nullable(),
  priceMin: z.coerce.number().optional().nullable(),
  priceMax: z.coerce.number().optional().nullable(),
  startDate: z.string().datetime().optional().nullable(),
  endDate: z.string().datetime().optional().nullable(),
  daysMin: z.coerce.number().int().optional().nullable(),
  daysMax: z.coerce.number().int().optional().nullable(),
  nightsMin: z.coerce.number().int().optional().nullable(),
  nightsMax: z.coerce.number().int().optional().nullable(),
  inclusive: z.string().optional().or(z.literal('')).nullable(), // comma-separated
  type: z.string().optional().or(z.literal('')).nullable(), // comma-separated
  sourceCity: z.string().optional().or(z.literal('')).nullable(),
  placeCity: z.string().optional().or(z.literal('')).nullable(),
  state: z.string().optional().or(z.literal('')).nullable(),
  capacity: z.coerce.number().int().positive().optional().nullable(),
  rating: z.coerce.number().min(1).max(5).optional().nullable(),
  sortBy: z
    .enum([
      'price_asc',
      'price_desc',
      'duration_asc',
      'duration_desc',
      'date_asc',
      'date_desc',
      'popularity',
    ])
    .optional()
    .nullable(),
  page: z.coerce.number().int().min(1).default(1),
  items: z.coerce.number().int().min(1).max(100).default(20),
});
