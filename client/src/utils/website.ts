import { WebsiteInfoType } from "@/types";

/**
 * Transform backend website data to frontend format
 * This ensures backward compatibility with existing frontend code
 */
export const transformWebsiteData = (
  backendData: any
): WebsiteInfoType | null => {
  if (!backendData) return null;

  return {
    ...backendData,
    // Primary branding information
    phone: backendData.contact?.phone || backendData.phone || "",
    logo: backendData.branding?.logo || backendData.logo || null,
    preLogo: backendData.branding?.preLogo || backendData.preLogo || null,
    brandname: backendData.branding?.brandName || backendData.brandname || "",

    // Contact information with proper fallbacks
    contactAddress: backendData.contact?.address ||
      backendData.contactAddress || {
        address1: "",
        address2: "",
        city: "",
        state: "",
        pincode: "",
      },

    // Social links with proper structure
    socialLinks: {
      facebook:
        backendData.socials?.facebook ||
        backendData.socialLinks?.facebook ||
        "",
      instagram:
        backendData.socials?.instagram ||
        backendData.socialLinks?.instagram ||
        "",
      twitter:
        backendData.socials?.twitter || backendData.socialLinks?.twitter || "",
      phone: backendData.contact?.phone || backendData.phone || "",
      youtube: backendData.socials?.youtube || "",
      whatsapp: backendData.socials?.whatsapp || "",
      linkedin: backendData.socials?.linkedin || "",
    },

    // Email information with proper structure
    emails: {
      supportEmail:
        backendData.contact?.emails?.supportEmail ||
        backendData.emails?.supportEmail ||
        "",
      infoEmails:
        backendData.contact?.emails?.infoEmails ||
        backendData.emails?.infoEmails ||
        [],
    },

    // Handle new domains structure
    domains: backendData.domains || { primary: "", aliases: [] },

    // SEO information
    seo: backendData.seo || {
      metaTitle: "",
      metaDescription: "",
      metaKeywords: [],
      ogImageUrl: "",
    },

    // Booking configuration
    booking: backendData.booking || {
      currencyCode: "INR",
      currencySymbol: "₹",
      taxPercent: 0,
      taxRegistration: "",
      cancellationPolicy: "",
      advancePaymentPercent: 0,
      allowGuestCheckout: true,
    },

    // Rental configuration
    rental: backendData.rental || {
      serviceCities: [],
      minRentalHours: 0,
      maxPassengersDefault: 0,
    },

    // Business information
    business: backendData.business || {
      companyName: "",
      registrationNumber: "",
      supportHours: "",
    },

    // Files
    files: backendData.files || {
      brochureUrl: "",
    },

    // Analytics
    analytics: backendData.analytics || {
      googleAnalyticsId: "",
      facebookPixelId: "",
    },

    // Flags
    flags: backendData.flags || {
      isMaintenanceMode: false,
    },
  };
};

/**
 * Get website logo URL with fallback
 */
export const getWebsiteLogo = (
  websiteInfo: WebsiteInfoType | null
): string | null => {
  if (!websiteInfo) return null;

  // Try new structure first
  if (websiteInfo.branding?.logo?.url) {
    return websiteInfo.branding.logo.url;
  }

  // Fallback to legacy structure
  if (websiteInfo.logo?.url) {
    return websiteInfo.logo.url;
  }

  return null;
};

/**
 * Get website brand name with fallback
 */
export const getWebsiteBrandName = (
  websiteInfo: WebsiteInfoType | null
): string => {
  if (!websiteInfo) return "Website";

  // Try new structure first
  if (websiteInfo.branding?.brandName) {
    return websiteInfo.branding.brandName;
  }

  // Fallback to legacy structure
  if (websiteInfo.brandname) {
    return websiteInfo.brandname;
  }

  return "Website";
};

/**
 * Get website phone number with fallback
 */
export const getWebsitePhone = (
  websiteInfo: WebsiteInfoType | null
): string | null => {
  if (!websiteInfo) return null;

  // Try new structure first
  if (websiteInfo.contact?.phone) {
    return websiteInfo.contact.phone;
  }

  // Fallback to legacy structure
  if (websiteInfo.phone) {
    return websiteInfo.phone;
  }

  return null;
};

/**
 * Get website support email with fallback
 */
export const getWebsiteSupportEmail = (
  websiteInfo: WebsiteInfoType | null
): string | null => {
  if (!websiteInfo) return null;

  // Try new structure first
  if (websiteInfo.contact?.emails?.supportEmail) {
    return websiteInfo.contact.emails.supportEmail;
  }

  // Fallback to legacy structure
  if (websiteInfo.emails?.supportEmail) {
    return websiteInfo.emails.supportEmail;
  }

  return null;
};

/**
 * Check if website is in maintenance mode
 */
export const isWebsiteInMaintenanceMode = (
  websiteInfo: WebsiteInfoType | null
): boolean => {
  return websiteInfo?.flags?.isMaintenanceMode || false;
};

/**
 * Get website currency information
 */
export const getWebsiteCurrency = (websiteInfo: WebsiteInfoType | null) => {
  if (!websiteInfo?.booking) {
    return { code: "INR", symbol: "₹" };
  }

  return {
    code: websiteInfo.booking.currencyCode || "INR",
    symbol: websiteInfo.booking.currencySymbol || "₹",
  };
};

/**
 * Get website address as formatted string
 */
export const getWebsiteAddress = (
  websiteInfo: WebsiteInfoType | null
): string => {
  if (!websiteInfo) return "";

  const address = websiteInfo.contact?.address || websiteInfo.contactAddress;
  if (!address) return "";

  const parts = [
    address.address1,
    address.address2,
    address.city,
    address.state,
    address.pincode,
  ].filter(Boolean);

  return parts.join(", ");
};

/**
 * Get website social media links
 */
export const getWebsiteSocialLinks = (websiteInfo: WebsiteInfoType | null) => {
  if (!websiteInfo) return {};

  return {
    facebook:
      websiteInfo.socials?.facebook || websiteInfo.socialLinks?.facebook || "",
    instagram:
      websiteInfo.socials?.instagram ||
      websiteInfo.socialLinks?.instagram ||
      "",
    twitter:
      websiteInfo.socials?.twitter || websiteInfo.socialLinks?.twitter || "",
    youtube: websiteInfo.socials?.youtube || "",
    whatsapp: websiteInfo.socials?.whatsapp || "",
    linkedin: websiteInfo.socials?.linkedin || "",
  };
};

/**
 * Get website SEO information
 */
export const getWebsiteSEO = (websiteInfo: WebsiteInfoType | null) => {
  if (!websiteInfo?.seo) {
    return {
      metaTitle: "",
      metaDescription: "",
      metaKeywords: [],
      ogImageUrl: "",
    };
  }

  return websiteInfo.seo;
};
