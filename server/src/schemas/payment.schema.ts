import { z } from 'zod';

export const bookingPaymentInitSchema = z.object({
  method: z.enum(['upi', 'card']).default('upi'),
  payFull: z.boolean().optional(),
  amount: z.number().positive().optional(),
});

export const mockWebhookSchema = z.object({
  provider: z.literal('mock'),
  event: z.enum(['payment.captured', 'payment.failed']),
  data: z.object({
    providerOrderId: z.string().min(1),
    providerPaymentId: z.string().min(1),
    amount: z.number().positive(),
    currencyCode: z.string().min(1).default('INR'),
    method: z.enum(['upi', 'card']).default('upi'),
  }),
  signature: z.string().optional(),
});

export const bankTransferSubmitSchema = z.object({
  amount: z.number().positive(),
  currencyCode: z.string().min(1).default('INR'),
  utr: z.string().min(6),
  bankName: z.string().optional(),
  paidAt: z.coerce.date().optional(),
});

export const bankTransferReconcileSchema = z.object({
  utr: z.string().min(6),
  success: z.boolean(),
  amount: z.number().positive().optional(),
});
