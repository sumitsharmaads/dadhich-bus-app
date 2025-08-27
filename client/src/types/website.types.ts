export type AddressType = {
  city: string;
  state: string;
  country?: string; // Made optional to match model
  pincode: string;
  address1: string;
  address2: string;
};

export type WebsiteInfoType = {
  id: string;
  branding: {
    brandName: string; // Only this is mandatory
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
    primary: string; // Only this is mandatory
    aliases?: string[];
  };
  analytics?: {
    googleAnalyticsId?: string;
    facebookPixelId?: string;
  };
  flags?: {
    isMaintenanceMode?: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
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
