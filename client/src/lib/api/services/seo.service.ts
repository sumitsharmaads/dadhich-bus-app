import { get, post, put, del } from "@/lib/service";

export interface SEOEntry {
  _id: string;
  routePath: string;
  pageName?: string;

  // Basic Meta Tags (Route-specific)
  meta?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };

  // Open Graph (Route-specific)
  openGraph?: {
    title?: string;
    description?: string;
    imageUrl?: string;
    imageWidth?: number;
    imageHeight?: number;
    imageAlt?: string;
  };

  // Twitter Cards (Route-specific)
  twitter?: {
    card?: "summary" | "summary_large_image" | "app" | "player";
    title?: string;
    description?: string;
    imageUrl?: string;
  };

  // Technical SEO (Route-specific)
  canonicalUrl?: string;
  robots?: {
    noindex?: boolean;
    nofollow?: boolean;
    noarchive?: boolean;
    nosnippet?: boolean;
    noimageindex?: boolean;
    maxSnippet?: number;
    maxImagePreview?: "none" | "standard" | "large";
    maxVideoPreview?: number;
  };

  // Structured Data (Route-specific)
  structuredData?: Record<string, unknown> | null;

  // Content Optimization (Route-specific)
  contentOptimization?: {
    focusKeyword?: string;
    secondaryKeywords?: string[];
    contentLength?: number;
    readabilityScore?: number;
    internalLinks?: string[];
    externalLinks?: string[];
  };

  // Publishing Control
  isPublished: boolean;
  isDeleted: boolean;
  priority?: number;
  changeFrequency?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  lastModified?: string;

  // Audit Trail
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface CreateSEORequest {
  routePath: string;
  pageName?: string;

  // Basic Meta Tags
  meta?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };

  // Open Graph
  openGraph?: {
    title?: string;
    description?: string;
    imageUrl?: string;
    imageWidth?: number;
    imageHeight?: number;
    imageAlt?: string;
  };

  // Twitter Cards
  twitter?: {
    card?: "summary" | "summary_large_image" | "app" | "player";
    title?: string;
    description?: string;
    imageUrl?: string;
  };

  // Technical SEO
  canonicalUrl?: string;
  robots?: {
    noindex?: boolean;
    nofollow?: boolean;
    noarchive?: boolean;
    nosnippet?: boolean;
    noimageindex?: boolean;
    maxSnippet?: number;
    maxImagePreview?: "none" | "standard" | "large";
    maxVideoPreview?: number;
  };

  // Structured Data
  structuredData?: Record<string, unknown> | null;

  // Content Optimization
  contentOptimization?: {
    focusKeyword?: string;
    secondaryKeywords?: string[];
    contentLength?: number;
    readabilityScore?: number;
    internalLinks?: string[];
    externalLinks?: string[];
  };

  // Publishing Control
  isPublished?: boolean;
  priority?: number;
  changeFrequency?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
}

export interface UpdateSEORequest extends Partial<CreateSEORequest> {}

export interface SEOListResponse {
  success: boolean;
  data: SEOEntry[];
  message: string;
}

export interface SEOSingleResponse {
  success: boolean;
  data: SEOEntry;
  message: string;
}

export interface SEOByRouteResponse {
  success: boolean;
  data: SEOEntry | null;
  message: string;
}

/**
 * SEO service for managing route-based SEO entries
 */
export const seoService = {
  // Get all SEO entries
  listSEO: async (): Promise<SEOEntry[]> => {
    const response = await get<SEOListResponse>("/seo");
    return response.data?.data || [];
  },

  // Get SEO by ID
  getSEOById: async (id: string): Promise<SEOEntry> => {
    const response = await get<SEOSingleResponse>(`/seo/${id}`);
    return response.data?.data;
  },

  // Get SEO by route path
  getSEOByRoute: async (routePath: string): Promise<SEOEntry | null> => {
    const response = await get<SEOByRouteResponse>("/seo/by-route", {
      params: { routePath },
    });
    return response.data?.data || null;
  },

  // Create new SEO entry
  createSEO: async (data: CreateSEORequest): Promise<SEOEntry> => {
    const response = await post<SEOSingleResponse>("/seo", data);
    return response.data?.data;
  },

  // Update existing SEO entry
  updateSEO: async (id: string, data: UpdateSEORequest): Promise<SEOEntry> => {
    const response = await put<SEOSingleResponse>(`/seo/${id}`, data);
    return response.data?.data;
  },

  // Delete SEO entry
  deleteSEO: async (id: string): Promise<void> => {
    await del(`/seo/${id}`);
  },

  // Toggle SEO entry published status
  togglePublished: async (
    id: string,
    currentStatus: boolean
  ): Promise<SEOEntry> => {
    return seoService.updateSEO(id, { isPublished: !currentStatus });
  },

  // Bulk update SEO entries
  bulkUpdateSEO: async (
    updates: Array<{ id: string; data: UpdateSEORequest }>
  ): Promise<SEOEntry[]> => {
    const promises = updates.map(({ id, data }) =>
      seoService.updateSEO(id, data)
    );
    return Promise.all(promises);
  },

  // Get common route paths for suggestions
  getCommonRoutes: (): string[] => [
    "/",
    "/about",
    "/contact",
    "/services",
    "/booking",
    "/rental",
    "/faq",
    "/terms",
    "/privacy",
    "/blog",
    "/destinations",
    "/tours",
    "/buses",
    "/admin",
    "/login",
    "/register",
  ],
};
