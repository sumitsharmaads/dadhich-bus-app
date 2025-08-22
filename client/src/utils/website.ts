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
    // Legacy field mappings for backward compatibility
    phone: backendData.contact?.phone || backendData.phone,
    logo: backendData.branding?.logo || backendData.logo,
    preLogo: backendData.branding?.preLogo || backendData.preLogo,
    brandname: backendData.branding?.brandName || backendData.brandname,
    contactAddress: backendData.contact?.address || backendData.contactAddress,
    socialLinks: backendData.socials
      ? {
          facebook: backendData.socials.facebook || "",
          instagram: backendData.socials.instagram || "",
          twitter: backendData.socials.twitter || "",
          phone: backendData.contact?.phone || "",
        }
      : backendData.socialLinks,
    emails: backendData.contact?.emails
      ? {
          supportEmail: backendData.contact.emails.supportEmail || "",
        }
      : backendData.emails,
    // Handle new domains structure
    domains: backendData.domains || { primary: "", aliases: [] },
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
