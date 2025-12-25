/**
 * Global SEO Configuration for Dadhich Bus Services
 * This contains website-wide SEO settings that are consistent across all pages
 */

export const GLOBAL_SEO_CONFIG = {
  // Website Information
  website: {
    name: "Dadhich Bus Services",
    alternateName: "Dadhich Bus Service",
    description: "Premium bus rental and tour services across India",
    url: "https://dadhichbusservice.com",
    logo: "https://dadhichbusservice.com/images/logo.png",
    defaultImage: "https://dadhichbusservice.com/images/og-image.jpg",
    defaultImageSquare:
      "https://dadhichbusservice.com/images/og-image-square.jpg",
    telephone: "+91-XXXXXXXXXX",
    email: "info@dadhichbusservice.com",
    language: "en",
    locale: "en_IN",
    country: "IN",
    region: "India",
  },

  // Contact Information
  contact: {
    address: {
      "@type": "PostalAddress",
      addressCountry: "IN",
      addressRegion: "India",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 20.5937,
      longitude: 78.9629,
    },
    openingHours: "Mo-Su 00:00-23:59",
    priceRange: "₹₹",
    currenciesAccepted: "INR",
    paymentAccepted: "Cash, Credit Card, Debit Card, UPI, Net Banking",
  },

  // Social Media (Global)
  socialMedia: {
    facebook: {
      url: "https://www.facebook.com/dadhichbusservice",
      appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
      pageId: process.env.NEXT_PUBLIC_FACEBOOK_PAGE_ID,
    },
    twitter: {
      url: "https://twitter.com/dadhichbusservice",
      site: "@dadhichbusservice",
      creator: "@dadhichbusservice",
    },
    instagram: {
      url: "https://www.instagram.com/dadhichbusservice",
    },
    linkedin: {
      url: "https://www.linkedin.com/company/dadhichbusservice",
      companyId: process.env.NEXT_PUBLIC_LINKEDIN_COMPANY_ID,
    },
    youtube: {
      url: "https://www.youtube.com/@dadhichbusservice",
    },
  },

  // Analytics (Global)
  analytics: {
    googleAnalytics: process.env.NEXT_PUBLIC_GA_ID,
    googleTagManager: process.env.NEXT_PUBLIC_GTM_ID,
    facebookPixel: process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID,
  },

  // Verification Codes (Global)
  verification: {
    google: process.env.GOOGLE_VERIFICATION_CODE,
    yandex: process.env.YANDEX_VERIFICATION_CODE,
    yahoo: process.env.YAHOO_VERIFICATION_CODE,
    bing: process.env.BING_VERIFICATION_CODE,
  },

  // Default Meta Tags (Global)
  defaultMeta: {
    author: "Dadhich Bus Services",
    viewport: "width=device-width, initial-scale=1",
    charset: "utf-8",
    language: "en",
    themeColor: "#1976d2",
    robots: "index, follow",
  },

  // Service Types (Global)
  serviceTypes: [
    "Bus Rental",
    "Tour Packages",
    "Corporate Transportation",
    "Airport Transfer",
    "Wedding Transportation",
    "Local Bus Rental",
    "Outstation Bus Rental",
    "Group Travel",
    "Religious Tours",
    "Adventure Tours",
  ],

  // Areas Served (Global)
  areasServed: {
    "@type": "Country",
    name: "India",
  },

  // Default Open Graph (Global)
  defaultOpenGraph: {
    siteName: "Dadhich Bus Services",
    locale: "en_IN",
    type: "website",
  },

  // Default Twitter (Global)
  defaultTwitter: {
    card: "summary_large_image",
    creator: "@dadhichbusservice",
    site: "@dadhichbusservice",
  },

  // Default Structured Data (Global)
  defaultStructuredData: {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: "Dadhich Bus Services",
    alternateName: "Dadhich Bus Service",
    description: "Premium bus rental and tour services across India",
    url: "https://dadhichbusservice.com",
    logo: "https://dadhichbusservice.com/images/logo.png",
    image: "https://dadhichbusservice.com/images/og-image.jpg",
    telephone: "+91-XXXXXXXXXX",
    email: "info@dadhichbusservice.com",
    address: {
      "@type": "PostalAddress",
      addressCountry: "IN",
      addressRegion: "India",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 20.5937,
      longitude: 78.9629,
    },
    sameAs: [
      "https://www.facebook.com/dadhichbusservice",
      "https://www.instagram.com/dadhichbusservice",
      "https://www.linkedin.com/company/dadhichbusservice",
      "https://twitter.com/dadhichbusservice",
    ],
    openingHours: "Mo-Su 00:00-23:59",
    priceRange: "₹₹",
    currenciesAccepted: "INR",
    paymentAccepted: "Cash, Credit Card, Debit Card, UPI, Net Banking",
    areaServed: {
      "@type": "Country",
      name: "India",
    },
    serviceType: [
      "Bus Rental",
      "Tour Packages",
      "Corporate Transportation",
      "Airport Transfer",
      "Wedding Transportation",
    ],
  },

  // Default DC Meta (Global)
  defaultDCMeta: {
    "DC.title": "Dadhich Bus Services",
    "DC.creator": "Dadhich Bus Services",
    "DC.subject": "Bus Rental, Tour Packages, Transportation",
    "DC.description": "Premium bus rental and tour services across India",
    "DC.publisher": "Dadhich Bus Services",
    "DC.contributor": "Dadhich Bus Services",
    "DC.type": "Service",
    "DC.format": "text/html",
    "DC.identifier": "https://dadhichbusservice.com",
    "DC.language": "en",
    "DC.coverage": "India",
    "DC.rights": "Copyright © 2024 Dadhich Bus Services. All rights reserved.",
  },

  // Default Geo Meta (Global)
  defaultGeoMeta: {
    "geo.region": "IN",
    "geo.placename": "India",
    "geo.position": "20.5937;78.9629",
    ICBM: "20.5937, 78.9629",
  },
};

/**
 * Get global Open Graph data for a specific page
 */
export function getGlobalOpenGraph(pageData: {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}) {
  return {
    siteName: GLOBAL_SEO_CONFIG.defaultOpenGraph.siteName,
    locale: GLOBAL_SEO_CONFIG.defaultOpenGraph.locale,
    type: GLOBAL_SEO_CONFIG.defaultOpenGraph.type,
    title: pageData.title || GLOBAL_SEO_CONFIG.website.name,
    description: pageData.description || GLOBAL_SEO_CONFIG.website.description,
    url: pageData.url || GLOBAL_SEO_CONFIG.website.url,
    images: [
      {
        url: pageData.image || GLOBAL_SEO_CONFIG.website.defaultImage,
        width: 1200,
        height: 630,
        alt: pageData.title || GLOBAL_SEO_CONFIG.website.name,
      },
    ],
  };
}

/**
 * Get global Twitter data for a specific page
 */
export function getGlobalTwitter(pageData: {
  title?: string;
  description?: string;
  image?: string;
}) {
  return {
    card: GLOBAL_SEO_CONFIG.defaultTwitter.card,
    creator: GLOBAL_SEO_CONFIG.defaultTwitter.creator,
    site: GLOBAL_SEO_CONFIG.defaultTwitter.site,
    title: pageData.title || GLOBAL_SEO_CONFIG.website.name,
    description: pageData.description || GLOBAL_SEO_CONFIG.website.description,
    images: [pageData.image || GLOBAL_SEO_CONFIG.website.defaultImage],
  };
}

/**
 * Get global structured data for a specific page
 */
export function getGlobalStructuredData(pageData: {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
}) {
  return {
    ...GLOBAL_SEO_CONFIG.defaultStructuredData,
    name: pageData.title || GLOBAL_SEO_CONFIG.website.name,
    description: pageData.description || GLOBAL_SEO_CONFIG.website.description,
    url: pageData.url || GLOBAL_SEO_CONFIG.website.url,
    image: pageData.image || GLOBAL_SEO_CONFIG.website.defaultImage,
  };
}

/**
 * Get global DC meta tags for a specific page
 */
export function getGlobalDCMeta(pageData: {
  title?: string;
  description?: string;
  url?: string;
}) {
  return {
    ...GLOBAL_SEO_CONFIG.defaultDCMeta,
    "DC.title": pageData.title || GLOBAL_SEO_CONFIG.website.name,
    "DC.description":
      pageData.description || GLOBAL_SEO_CONFIG.website.description,
    "DC.identifier": pageData.url || GLOBAL_SEO_CONFIG.website.url,
    "DC.date": new Date().toISOString(),
  };
}

/**
 * Get all global meta tags
 */
export function getAllGlobalMeta() {
  return {
    ...GLOBAL_SEO_CONFIG.defaultMeta,
    ...GLOBAL_SEO_CONFIG.defaultGeoMeta,
    ...GLOBAL_SEO_CONFIG.defaultDCMeta,
  };
}
