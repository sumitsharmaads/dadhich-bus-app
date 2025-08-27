import { z } from 'zod';

const url = () => z.string().url().optional().or(z.literal(''));
const phone = () => z.string().min(5).max(20).optional();

export const websiteCreateSchema = z.object({
  branding: z.object({
    brandName: z.string().min(2), // Only this is mandatory
    tagline: z.string().optional(),
    logo: z.object({ url: z.string().url().optional(), id: z.string().optional() }).optional(),
    preLogo: z.object({ url: z.string().url().optional(), id: z.string().optional() }).optional(),
  }),
  contact: z
    .object({
      emails: z
        .object({
          infoEmails: z.array(z.string().email()).optional(),
          supportEmail: z.string().email().optional(),
        })
        .optional(),
      phone: phone(),
      address: z
        .object({
          address1: z.string().optional(),
          address2: z.string().optional(),
          city: z.string().optional(),
          state: z.string().optional(),
          country: z.string().optional(), // Added country field
          pincode: z.string().optional(),
        })
        .optional(),
    })
    .optional(),
  socials: z
    .object({
      facebook: url(),
      instagram: url(),
      twitter: url(),
      youtube: url(),
      whatsapp: z.string().optional(),
      linkedin: url(),
    })
    .optional(),
  seo: z
    .object({
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
      metaKeywords: z.array(z.string()).optional(),
      ogImageUrl: url(),
    })
    .optional(),
  booking: z
    .object({
      currencyCode: z.string().length(3).optional(),
      currencySymbol: z.string().optional(),
      taxPercent: z.number().min(0).max(100).optional(),
      taxRegistration: z.string().optional(),
      cancellationPolicy: z.string().optional(),
      advancePaymentPercent: z.number().min(0).max(100).optional(),
      allowGuestCheckout: z.boolean().optional(),
    })
    .optional(),
  rental: z
    .object({
      serviceCities: z.array(z.string()).optional(),
      minRentalHours: z.number().min(0).optional(),
      maxPassengersDefault: z.number().min(0).optional(),
    })
    .optional(),
  business: z
    .object({
      companyName: z.string().optional(),
      registrationNumber: z.string().optional(),
      supportHours: z.string().optional(),
    })
    .optional(),
  files: z.object({ brochureUrl: url() }).optional(),
  domains: z.object({
    primary: z.string().min(3), // Only this is mandatory
    aliases: z.array(z.string().min(3)).optional(),
  }),
  analytics: z
    .object({
      googleAnalyticsId: z.string().optional(),
      facebookPixelId: z.string().optional(),
    })
    .optional(),
  flags: z.object({ isMaintenanceMode: z.boolean().optional() }).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const websiteUpdateSchema = websiteCreateSchema.partial();

export const websiteIdParamSchema = z.object({ id: z.string().min(1) });
export const websiteHostQuerySchema = z.object({ host: z.string().min(3) });

export type WebsiteCreateInput = z.infer<typeof websiteCreateSchema>;
export type WebsiteUpdateInput = z.infer<typeof websiteUpdateSchema>;
