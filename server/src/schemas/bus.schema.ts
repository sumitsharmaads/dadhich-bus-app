import { z } from 'zod';

export const seatLayoutCellSchema = z.object({
  row: z.number().int().nonnegative(),
  col: z.number().int().nonnegative(),
  type: z.enum(['seat', 'berth', 'aisle', 'empty']).optional(),
  code: z.string().optional(),
});

export const busCreateSchema = z.object({
  name: z.string().min(2, 'Bus name must be at least 2 characters'),
  registrationNumber: z.string().min(2, 'Registration number must be at least 2 characters'),
  capacity: z.number().int().positive('Capacity must be a positive integer'),
  // totalSeats: z.number().int().positive('Total seats must be a positive integer').optional(),
  type: z.enum(['seater', 'sleeper', 'mixed']).optional(),
  ac: z.boolean().optional(),
  amenities: z.array(z.string()).optional(),
  images: z
    .array(
      z.object({
        url: z.string().url('Invalid image URL').optional(),
        id: z.string().optional(),
        caption: z.string().optional(),
      }),
    )
    .optional(),
  operator: z
    .object({
      name: z.string().optional(),
      contactEmail: z.string().email('Invalid email format').optional(),
      contactPhone: z.string().optional(),
    })
    .optional(),
  seatLayout: z
    .object({
      rows: z.number().int().nonnegative('Rows must be non-negative').optional(),
      cols: z.number().int().nonnegative('Columns must be non-negative').optional(),
      layout: z.array(seatLayoutCellSchema).optional(),
    })
    .optional(),
  notes: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const busUpdateSchema = busCreateSchema.partial();

export const idParamSchema = z.object({
  id: z.string().min(1, 'Bus ID is required'),
});

export const busAdminListQuerySchema = z.object({
  q: z.string().optional(),
  type: z.enum(['seater', 'sleeper', 'mixed']).optional(),
  isActive: z.coerce.boolean().optional(),
  page: z.coerce.number().int().min(1).default(1),
  items: z.coerce.number().int().min(1).max(100).default(20),
});

// New schemas for enhanced functionality
export const busBulkUpdateSchema = z.object({
  busIds: z.array(z.string().min(1)).min(1, 'At least one bus ID is required'),
  updates: busUpdateSchema,
});

export const busBulkDeleteSchema = z.object({
  busIds: z.array(z.string().min(1)).min(1, 'At least one bus ID is required'),
});

export const busStatusUpdateSchema = z.object({
  isActive: z.boolean('isActive must be a boolean'),
});

export const busSeatLayoutUpdateSchema = z.object({
  seatLayout: z.object({
    rows: z.number().int().nonnegative('Rows must be non-negative'),
    cols: z.number().int().nonnegative('Columns must be non-negative'),
    layout: z.array(seatLayoutCellSchema),
  }),
});
