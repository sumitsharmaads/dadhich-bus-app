import { PublicRoutes } from "@/constants/routes";

export const routeOptions: Record<string, string> = {
  HOME: PublicRoutes.HOME,
  ABOUT: PublicRoutes.ABOUT_US,
  CONTACT: PublicRoutes.CONTACT,
  SERVICES: PublicRoutes.SERVICES,
  LOGIN: PublicRoutes.LOGIN,
  SIGNUP: PublicRoutes.SIGNUP,
  INQUERY_NOW: PublicRoutes.INQUERY_NOW,
  TOUR_GUIDE: PublicRoutes.TOUR_GUIDES,
  TOURS: PublicRoutes.TOURS,
};

export const getRouteKey = (value: string): string | undefined => {
  const entry = Object.entries(routeOptions).find(([, path]) => path === value);
  return entry?.[0];
};

import { Metadata } from "next";

export interface SEOData {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  noIndex?: boolean;
  canonical?: string;
  openGraph?: {
    title?: string;
    description?: string;
    url?: string;
    siteName?: string;
    images?: Array<{
      url: string;
      width?: number;
      height?: number;
      alt?: string;
    }>;
    locale?: string;
    type?: string;
  };
  twitter?: {
    card?: string;
    title?: string;
    description?: string;
    images?: string[];
    creator?: string;
    site?: string;
  };
  alternates?: {
    canonical?: string;
  };
  other?: Record<string, string>;
}

export interface SEOInterface {
  _id: string;
  title: string;
  description: string;
  keywords: string;
  path: string;
  image?: string;
  canonical?: string;
  noIndex?: boolean;
  createdAt: string;
  updatedAt: string;
}

// Tour interface for SEO generation
export interface TourSEOData {
  _id: string;
  tourname: string;
  description: string;
  type: string[];
  places: {
    name: string;
    state: string;
  }[];
  minfair: string | number;
  image: {
    url: string;
  };
  days?: number;
  night?: number;
}

/**
 * Generate metadata for Next.js pages
 */
export function generateMetadata(seoData: SEOData): Metadata {
  const {
    title = "Dadhcih Bus Service | Travel & Tourism",
    description = "Dadhcih Bus Service provides premium bus rentals and curated tour packages across India. Book your next journey with trusted experts.",
    keywords = "dadhcih bus service, dadhcih, bus service, travel, tourism, tours, bus rental, guided tours, group travel",
    image = "/og-image.jpg",
    url = "",
    noIndex = false,
    canonical,
    openGraph,
    twitter,
    alternates,
    other,
  } = seoData;

  const metadata: Metadata = {
    title,
    description,
    keywords,
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: openGraph || {
      title,
      description,
      url,
      siteName: "Dadhcih Bus Service",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: twitter || {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };

  if (canonical) {
    metadata.alternates = {
      canonical,
      ...alternates,
    };
  } else if (alternates) {
    metadata.alternates = alternates;
  }

  if (other) {
    metadata.other = other;
  }

  return metadata;
}

/**
 * Generate tour-specific SEO metadata
 */
export function generateTourSEO(tour: TourSEOData, path: string): SEOData {
  const tourName = tour.tourname;
  const tourDescription =
    tour.description || `Explore ${tourName} with Dadhcih Bus Service`;
  const tourPlaces = tour.places?.map((p) => p.name).join(", ") || "";
  const tourTypes = tour.type?.join(", ") || "";
  const tourDuration =
    tour.days && tour.night ? `${tour.days} Days / ${tour.night} Nights` : "";

  // Create SEO title
  const title = `${tourName} | Dadhcih Bus Service`;

  // Create SEO description
  let description = tourDescription;
  if (description.length > 160) {
    description = description.slice(0, 157) + "...";
  }

  // Create SEO keywords
  const keywords = [
    tourName.toLowerCase(),
    tourTypes.toLowerCase(),
    tourPlaces.toLowerCase(),
    "dadhcih bus service",
    "travel packages",
    "tour booking",
    "india travel",
    "bus rental",
    tourDuration.toLowerCase(),
  ]
    .filter(Boolean)
    .join(", ");

  return {
    title,
    description,
    keywords,
    image: tour.image?.url || "/og-image.jpg",
    canonical: path,
  };
}

/**
 * Default SEO configuration
 */
export const defaultSEO: SEOData = {
  title: "Dadhcih Bus Service | Travel & Tourism",
  description:
    "Dadhcih Bus Service offers comfortable bus rentals and memorable tour experiences across India. Safe rides, curated itineraries, expert support.",
  keywords:
    "dadhcih bus service, bus booking, bus rental, tours, travel india, tourism, pilgrimage tours, group travel",
  image: "/og-image.jpg",
};

/**
 * Create page-specific SEO data
 */
export function createPageSEO(overrides: Partial<SEOData>): SEOData {
  return {
    ...defaultSEO,
    ...overrides,
  };
}

/**
 * Fetch SEO data from backend API
 */
export async function fetchSEOData(path: string): Promise<SEOInterface | null> {
  try {
    const encodedRoute = encodeURIComponent(path);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const response = await fetch(`${siteUrl}/api/seo?path=${encodedRoute}`, {
      cache: "force-cache",
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.result || null;
  } catch (error) {
    console.error("Error fetching SEO data:", error);
    return null;
  }
}

/**
 * Convert SEO interface to Next.js metadata
 */
export function seoToMetadata(seo: SEOInterface): Metadata {
  return generateMetadata({
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    image: seo.image,
    canonical: seo.canonical,
    noIndex: seo.noIndex,
  });
}
