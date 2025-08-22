import { z } from 'zod';

export const tourCreateSchema = z.object({
  tourName: z.string().min(2),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  highlights: z.array(z.string()).optional(),
  sources: z
    .array(
      z.object({
        cityId: z.string().min(1),
        cityName: z.string().optional(),
        fare: z.number().positive(),
        onBoarding: z.array(z.string()).optional(),
        departureTime: z.string().optional(),
        arrivalTime: z.string().optional(),
      }),
    )
    .min(1),
  places: z
    .array(
      z.object({
        cityId: z.string().min(1),
        name: z.string().optional(),
        state: z.string().optional(),
        order: z.number().optional(),
        stayDuration: z.number().optional(),
        activities: z.array(z.string()).optional(),
      }),
    )
    .min(1),
  heroImage: z.object({ url: z.string().url().optional(), id: z.string().optional() }).optional(),
  gallery: z
    .array(
      z.object({
        url: z.string().url().optional(),
        id: z.string().optional(),
        caption: z.string().optional(),
      }),
    )
    .optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  duration: z.string().optional(),
  days: z.number().int().optional(),
  nights: z.number().int().optional(),
  stayDescription: z
    .array(
      z.object({
        nights: z.number().optional(),
        place: z.string().optional(),
        accommodation: z.string().optional(),
        checkIn: z.string().optional(),
        checkOut: z.string().optional(),
      }),
    )
    .optional(),
  busId: z.string().optional(),
  captainUserId: z.string().optional(),
  inclusive: z.array(z.string()).min(1),
  exclusive: z.array(z.string()).optional(),
  type: z.array(z.string()).min(1),
  category: z.string().optional(),
  capacity: z.number().int().positive(),
  itinerary: z
    .array(
      z.object({
        title: z.string().min(1),
        shortDescription: z.string().optional(),
        toggles: z.array(z.string()).optional(),
        sightseeing: z.array(z.string()).optional(),
        order: z.number().optional(),
        day: z.number().optional(),
        duration: z.string().optional(),
        meals: z.array(z.string()).optional(),
        accommodation: z.string().optional(),
        transportation: z.string().optional(),
        highlights: z.array(z.string()).optional(),
        notes: z.string().optional(),
      }),
    )
    .optional(),
  pricing: z.object({
    minFare: z.number().positive(),
    currencyCode: z.string().min(3).max(3).default('INR'),
  }),
  discount: z
    .object({
      type: z.enum(['percent', 'amount']),
      value: z.number().positive(),
      validFrom: z.string().datetime().optional(),
      validTo: z.string().datetime().optional(),
      minAmount: z.number().positive().optional(),
      maxDiscount: z.number().positive().optional(),
      applicableOn: z.string().optional(),
    })
    .optional(),
  groupDiscounts: z
    .array(
      z.object({
        minMembers: z.number().int().positive(),
        maxMembers: z.number().int().positive().optional(),
        type: z.enum(['percent', 'amount']),
        value: z.number().positive(),
        applicableOn: z.string().optional(),
        description: z.string().optional(),
      }),
    )
    .optional(),
  seo: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
      keywords: z.array(z.string()).optional(),
    })
    .optional(),
  seoRoutePath: z.string().optional(),
  status: z.enum(['draft', 'published']).optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  difficulty: z.enum(['easy', 'moderate', 'difficult']).optional(),
  ageGroup: z.array(z.string()).optional(),
  fitnessLevel: z.string().optional(),
  specialRequirements: z.array(z.string()).optional(),
  cancellationPolicy: z.string().optional(),
  refundPolicy: z.string().optional(),
});

export const tourUpdateSchema = tourCreateSchema.partial();

export const idParamSchema = z.object({ id: z.string().min(1) });

export const tourPublicQuerySchema = z.object({
  q: z.string().optional(),
  priceMin: z.coerce.number().optional(),
  priceMax: z.coerce.number().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  daysMin: z.coerce.number().int().optional(),
  daysMax: z.coerce.number().int().optional(),
  nightsMin: z.coerce.number().int().optional(),
  nightsMax: z.coerce.number().int().optional(),
  inclusive: z.string().optional(), // comma-separated
  type: z.string().optional(), // comma-separated
  sourceCity: z.string().optional(),
  placeCity: z.string().optional(),
  state: z.string().optional(),
  capacity: z.coerce.number().int().positive().optional(),
  rating: z.coerce.number().min(1).max(5).optional(),
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
    .optional(),
  page: z.coerce.number().int().min(1).default(1),
  items: z.coerce.number().int().min(1).max(100).default(20),
});
