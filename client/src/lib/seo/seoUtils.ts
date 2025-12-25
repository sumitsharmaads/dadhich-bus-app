import { Metadata } from "next";
import { SEOEntry } from "@/lib/api/services/seo.service";
import {
  getGlobalOpenGraph,
  getGlobalTwitter,
  getGlobalStructuredData,
  getGlobalDCMeta,
  getAllGlobalMeta,
  GLOBAL_SEO_CONFIG,
} from "./globalSEOConfig";

/**
 * Generate comprehensive metadata for Next.js pages
 */
export function generateMetadata(seoData: {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  canonical?: string;
  noIndex?: boolean;
  openGraph?: any;
  twitter?: any;
  alternates?: any;
  other?: Record<string, string>;
}): Metadata {
  const {
    title,
    description,
    keywords,
    image,
    canonical,
    noIndex = false,
    openGraph,
    twitter,
    alternates,
    other,
  } = seoData;

  return {
    title: title || GLOBAL_SEO_CONFIG.website.name,
    description: description || GLOBAL_SEO_CONFIG.website.description,
    keywords: keywords,
    authors: [{ name: GLOBAL_SEO_CONFIG.defaultMeta.author }],
    creator: GLOBAL_SEO_CONFIG.defaultMeta.author,
    publisher: GLOBAL_SEO_CONFIG.website.name,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(GLOBAL_SEO_CONFIG.website.url),
    alternates: {
      canonical: canonical || GLOBAL_SEO_CONFIG.website.url,
      ...alternates,
    },
    robots: {
      index: !noIndex,
      follow: true,
      googleBot: {
        index: !noIndex,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title: title || GLOBAL_SEO_CONFIG.website.name,
      description: description || GLOBAL_SEO_CONFIG.website.description,
      url: canonical || GLOBAL_SEO_CONFIG.website.url,
      siteName: GLOBAL_SEO_CONFIG.website.name,
      images: [
        {
          url: image || GLOBAL_SEO_CONFIG.website.defaultImage,
          width: 1200,
          height: 630,
          alt: title || GLOBAL_SEO_CONFIG.website.name,
        },
      ],
      locale: GLOBAL_SEO_CONFIG.defaultOpenGraph.locale,
      type: GLOBAL_SEO_CONFIG.defaultOpenGraph.type,
      ...openGraph,
    },
    twitter: {
      card: "summary_large_image",
      title: title || GLOBAL_SEO_CONFIG.website.name,
      description: description || GLOBAL_SEO_CONFIG.website.description,
      images: [image || GLOBAL_SEO_CONFIG.website.defaultImage],
      creator: "@dadhichbusservice",
      site: "@dadhichbusservice",
      ...twitter,
    },
    other: {
      ...getAllGlobalMeta(),
      ...other,
    },
  };
}

/**
 * Convert SEO entry to Next.js metadata
 */
export function seoEntryToMetadata(seoEntry: SEOEntry, path: string): Metadata {
  const pageTitle = seoEntry.meta?.title || GLOBAL_SEO_CONFIG.website.name;
  const pageDescription =
    seoEntry.meta?.description || GLOBAL_SEO_CONFIG.website.description;
  const pageImage =
    seoEntry.openGraph?.imageUrl || GLOBAL_SEO_CONFIG.website.defaultImage;
  const pageUrl = `${GLOBAL_SEO_CONFIG.website.url}${path}`;

  return generateMetadata({
    title: pageTitle,
    description: pageDescription,
    keywords: seoEntry.meta?.keywords?.join(", "),
    image: pageImage,
    canonical: seoEntry.canonicalUrl || pageUrl,
    noIndex: seoEntry.robots?.noindex || false,

    // Merge global Open Graph with route-specific data
    openGraph: {
      ...getGlobalOpenGraph({
        title: seoEntry.openGraph?.title || pageTitle,
        description: seoEntry.openGraph?.description || pageDescription,
        image: seoEntry.openGraph?.imageUrl || pageImage,
        url: pageUrl,
      }),
      // Override with route-specific data if available
      ...(seoEntry.openGraph && {
        title: seoEntry.openGraph.title,
        description: seoEntry.openGraph.description,
        imageUrl: seoEntry.openGraph.imageUrl,
        imageWidth: seoEntry.openGraph.imageWidth,
        imageHeight: seoEntry.openGraph.imageHeight,
        imageAlt: seoEntry.openGraph.imageAlt,
      }),
    },

    // Merge global Twitter with route-specific data
    twitter: {
      ...getGlobalTwitter({
        title: seoEntry.twitter?.title || pageTitle,
        description: seoEntry.twitter?.description || pageDescription,
        image: seoEntry.twitter?.imageUrl || pageImage,
      }),
      // Override with route-specific data if available
      ...(seoEntry.twitter && {
        card: seoEntry.twitter.card,
        title: seoEntry.twitter.title,
        description: seoEntry.twitter.description,
        imageUrl: seoEntry.twitter.imageUrl,
      }),
    },

    // Merge global meta with route-specific structured data
    other: {
      ...getAllGlobalMeta(),
      ...getGlobalDCMeta({
        title: pageTitle,
        description: pageDescription,
        url: pageUrl,
      }),
      ...(seoEntry.structuredData && {
        "application/ld+json": JSON.stringify(seoEntry.structuredData),
      }),
    },
  });
}

/**
 * Generate page-specific SEO with fallbacks
 */
export function generatePageSEO(
  path: string,
  customData: {
    title?: string;
    description?: string;
    keywords?: string[];
    image?: string;
    tourData?: any;
  } = {}
): Metadata {
  const pageTitle = customData.title || GLOBAL_SEO_CONFIG.website.name;
  const pageDescription =
    customData.description || GLOBAL_SEO_CONFIG.website.description;
  const pageImage = customData.image || GLOBAL_SEO_CONFIG.website.defaultImage;
  const pageUrl = `${GLOBAL_SEO_CONFIG.website.url}${path}`;

  return generateMetadata({
    title: pageTitle,
    description: pageDescription,
    keywords: customData.keywords?.join(", "),
    image: pageImage,
    canonical: pageUrl,

    // Use global Open Graph config
    openGraph: getGlobalOpenGraph({
      title: pageTitle,
      description: pageDescription,
      image: pageImage,
      url: pageUrl,
    }),

    // Use global Twitter config
    twitter: getGlobalTwitter({
      title: pageTitle,
      description: pageDescription,
      image: pageImage,
    }),

    // Use global meta tags
    other: {
      ...getAllGlobalMeta(),
      ...getGlobalDCMeta({
        title: pageTitle,
        description: pageDescription,
        url: pageUrl,
      }),
    },
  });
}

/**
 * Generate tour-specific SEO
 */
export function generateTourSEO(tourData: any, path: string): Metadata {
  const tourTitle = `${tourData.tourname} - Tour Package | Dadhich Bus Services`;
  const tourDescription =
    tourData.description ||
    `Explore ${tourData.tourname} with Dadhich Bus Services. Book your tour package now for an unforgettable travel experience.`;
  const tourImage =
    tourData.image?.url || GLOBAL_SEO_CONFIG.website.defaultImage;
  const tourUrl = `${GLOBAL_SEO_CONFIG.website.url}${path}`;

  // Generate tour-specific structured data
  const tourStructuredData = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: tourData.tourname,
    description: tourData.description,
    image: tourImage,
    url: tourUrl,
    provider: GLOBAL_SEO_CONFIG.defaultStructuredData,
    offers: {
      "@type": "Offer",
      price: tourData.minfair,
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
    },
    itinerary: tourData.places?.map((place: any) => ({
      "@type": "Place",
      name: place.name,
      address: {
        "@type": "PostalAddress",
        addressLocality: place.name,
        addressRegion: place.state,
        addressCountry: "IN",
      },
    })),
    duration: tourData.days ? `P${tourData.days}D` : undefined,
    tourType: tourData.type?.join(", "),
  };

  return generateMetadata({
    title: tourTitle,
    description: tourDescription,
    keywords: [
      tourData.tourname.toLowerCase(),
      ...(tourData.type || []).map((t: string) => t.toLowerCase()),
      ...(tourData.places || []).map((p: any) => p.name.toLowerCase()),
      "tour package",
      "travel india",
      "dadhich bus services",
      "group travel",
      "bus tour",
    ].join(", "),
    image: tourImage,
    canonical: tourUrl,

    // Use global Open Graph config
    openGraph: getGlobalOpenGraph({
      title: tourTitle,
      description: tourDescription,
      image: tourImage,
      url: tourUrl,
    }),

    // Use global Twitter config
    twitter: getGlobalTwitter({
      title: tourTitle,
      description: tourDescription,
      image: tourImage,
    }),

    // Use global meta tags with tour structured data
    other: {
      ...getAllGlobalMeta(),
      ...getGlobalDCMeta({
        title: tourTitle,
        description: tourDescription,
        url: tourUrl,
      }),
      "application/ld+json": JSON.stringify(tourStructuredData),
    },
  });
}

/**
 * Generate breadcrumb structured data
 */
export function generateBreadcrumbData(path: string): Record<string, any> {
  const pathSegments = path.split("/").filter(Boolean);
  const breadcrumbs = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: GLOBAL_SEO_CONFIG.website.url,
    },
  ];

  let currentPath = "";
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    breadcrumbs.push({
      "@type": "ListItem",
      position: index + 2,
      name:
        segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " "),
      item: `${GLOBAL_SEO_CONFIG.website.url}${currentPath}`,
    });
  });

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs,
  };
}
