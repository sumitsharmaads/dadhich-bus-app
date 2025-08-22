import { z } from 'zod';

export const createBookingSchema = z.object({
  tourId: z.string().min(1),
  quantity: z.number().int().positive(),
  guestContact: z
    .object({ fullName: z.string().min(2), email: z.string().email(), phone: z.string().min(5) })
    .optional(),
  source: z
    .object({
      cityId: z.string().optional(),
      cityName: z.string().optional(),
      onBoarding: z.string().optional(),
    })
    .optional(),
  passengers: z
    .array(
      z.object({
        fullName: z.string().min(2),
        age: z.number().optional(),
        gender: z.string().optional(),
        seatCode: z.string().optional(),
      }),
    )
    .optional(),
  partialPayment: z
    .object({ enabled: z.boolean(), minimumDepositAmount: z.number().positive().optional() })
    .optional(),
});

export const bookingCodeParamSchema = z.object({ code: z.string().min(1) });

export const bookingAdminListQuerySchema = z.object({
  status: z.enum(['pending', 'confirmed', 'cancelled', 'refunded', 'expired']).optional(),
  page: z.coerce.number().int().min(1).default(1),
  items: z.coerce.number().int().min(1).max(100).default(20),
});

export const adminMarkPaidSchema = z.object({
  amount: z.number().positive(),
  method: z.enum(['cash', 'other']).default('cash'),
});

export const bookingCancelSchema = z.object({ reason: z.string().min(3).optional() });

export const bookingRefundSchema = z.object({
  amount: z.number().positive(),
  reason: z.string().min(3).optional(),
});
