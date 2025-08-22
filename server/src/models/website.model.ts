import mongoose, { Document, Model, Schema } from 'mongoose';

export interface WebsiteDocument extends Document {
  branding: {
    brandName: string;
    tagline?: string;
    logo?: { url?: string; id?: string };
    preLogo?: { url?: string; id?: string };
  };
  contact: {
    emails: { infoEmails?: string[]; supportEmail?: string };
    phone?: string;
    address?: {
      address1?: string;
      address2?: string;
      city?: string;
      state?: string;
      pincode?: string;
    };
  };
  socials?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
    whatsapp?: string;
    linkedin?: string;
  };
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string[];
    ogImageUrl?: string;
  };
  booking?: {
    currencyCode?: string; // e.g., INR, USD
    currencySymbol?: string; // e.g., ₹, $
    taxPercent?: number;
    taxRegistration?: string; // GST/VAT number
    cancellationPolicy?: string;
    advancePaymentPercent?: number; // deposit requirement
    allowGuestCheckout?: boolean;
  };
  rental?: {
    serviceCities?: string[];
    minRentalHours?: number;
    maxPassengersDefault?: number;
  };
  business?: {
    companyName?: string;
    registrationNumber?: string;
    supportHours?: string;
  };
  files?: {
    brochureUrl?: string;
  };
  domains: {
    primary: string; // unique canonical host
    aliases?: string[]; // other accepted hosts
  };
  analytics?: {
    googleAnalyticsId?: string;
    facebookPixelId?: string;
  };
  flags?: {
    isMaintenanceMode?: boolean;
  };

  // Legacy fields for backward compatibility
  phone?: string;
  logo?: { id: string; url: string } | null;
  preLogo?: { id: string; url: string } | null;
  brandname?: string;
  contactAddress?: {
    address1?: string;
    address2?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  socialLinks?: {
    facebook: string;
    instagram: string;
    twitter: string;
    phone: string;
  } | null;
  emails?: {
    supportEmail: string;
    infoEmails?: string[];
  } | null;

  createdAt: Date;
  updatedAt: Date;
}

export interface WebsiteModel extends Model<WebsiteDocument> {}

const WebsiteSchema = new Schema<WebsiteDocument, WebsiteModel>(
  {
    branding: {
      brandName: { type: String, required: true },
      tagline: { type: String },
      logo: { url: String, id: String },
      preLogo: { url: String, id: String },
    },
    contact: {
      emails: {
        infoEmails: { type: [String], default: [] },
        supportEmail: { type: String },
      },
      phone: String,
      address: {
        address1: String,
        address2: String,
        city: String,
        state: String,
        pincode: String,
      },
    },
    socials: {
      facebook: String,
      instagram: String,
      twitter: String,
      youtube: String,
      whatsapp: String,
      linkedin: String,
    },
    seo: {
      metaTitle: String,
      metaDescription: String,
      metaKeywords: { type: [String], default: [] },
      ogImageUrl: String,
    },
    booking: {
      currencyCode: { type: String, default: 'INR' },
      currencySymbol: { type: String, default: '₹' },
      taxPercent: { type: Number, default: 0 },
      taxRegistration: String,
      cancellationPolicy: String,
      advancePaymentPercent: { type: Number, default: 0 },
      allowGuestCheckout: { type: Boolean, default: true },
    },
    rental: {
      serviceCities: { type: [String], default: [] },
      minRentalHours: { type: Number, default: 0 },
      maxPassengersDefault: { type: Number, default: 0 },
    },
    business: {
      companyName: String,
      registrationNumber: String,
      supportHours: String,
    },
    files: {
      brochureUrl: String,
    },
    domains: {
      primary: { type: String, required: true, unique: true, index: true },
      aliases: { type: [String], default: [] },
    },
    analytics: {
      googleAnalyticsId: String,
      facebookPixelId: String,
    },
    flags: {
      isMaintenanceMode: { type: Boolean, default: false },
    },

    // Legacy fields for backward compatibility
    phone: String,
    logo: { id: String, url: String },
    preLogo: { id: String, url: String },
    brandname: String,
    contactAddress: {
      address1: String,
      address2: String,
      city: String,
      state: String,
      pincode: String,
    },
    socialLinks: {
      facebook: String,
      instagram: String,
      twitter: String,
      phone: String,
    },
    emails: {
      supportEmail: String,
      infoEmails: { type: [String], default: [] },
    },
  },
  { timestamps: true },
);

WebsiteSchema.index({ 'domains.aliases': 1 });

export const Website = mongoose.model<WebsiteDocument, WebsiteModel>('Website', WebsiteSchema);
