export type AddressType = {
  city: string;
  state: string;
  pincode: string;
  address1: string;
  address2: string;
};

export type WebsiteInfoType = {
  id: string;
  branding: {
    brandName: string;
    tagline?: string;
    logo?: { url?: string; id?: string };
    preLogo?: { url?: string; id?: string };
  };
  contact: {
    emails: { infoEmails?: string[]; supportEmail?: string };
    phone?: string;
    address?: AddressType;
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
    currencyCode?: string;
    currencySymbol?: string;
    taxPercent?: number;
    taxRegistration?: string;
    cancellationPolicy?: string;
    advancePaymentPercent?: number;
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
  createdAt?: Date;
  updatedAt?: Date;

  // Legacy fields for backward compatibility
  phone?: string;
  logo?: { id: string; url: string } | null;
  preLogo?: { id: string; url: string } | null;
  brandname?: string;
  contactAddress?: AddressType;
  socialLinks?: {
    facebook: string;
    instagram: string;
    twitter: string;
    phone: string;
  } | null;
  emails?: {
    supportEmail: string;
  } | null;
};

export interface WebsiteContextType {
  websiteInfo: WebsiteInfoType | null;
  isLoading: boolean;
  error: string | null;
  retryCount: number;
  maxRetries: number;
  refreshWebsiteInfo: () => Promise<void>;
  retryFetch: () => Promise<void>;
}
