/**
 * Server-side SEO utilities that work during build time and SSR
 * These functions don't make HTTP requests but work with the database directly
 */

import { Metadata } from "next";
import { generatePageSEO, seoEntryToMetadata } from "./seoUtils";
import { seoCache, generateCacheKey } from "./cache";
import { get } from "../service";
import { SEOEntry, SEOByRouteResponse } from "../api/services/seo.service";

/**
 * Server-side SEO data fetcher with caching
 * This should be used in generateMetadata functions
 */
export async function fetchServerSEO(
  routePath: string
): Promise<SEOEntry | null> {
  // Handle null, undefined, empty string cases - default to root route
  const normalizedRoute = routePath || "/";

  try {
    const cacheKey = generateCacheKey(normalizedRoute);

    // Check cache first
    const cachedData = seoCache.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    // Check if we're in a build environment where server might not be available
    const isBuildTime =
      process.env.NODE_ENV === "production" && !process.env.NEXT_PUBLIC_API_URL;

    if (isBuildTime) {
      // During build time, skip API calls and use fallback
      seoCache.set(cacheKey, null, 5 * 60 * 1000);
      return null;
    }

    // Fetch SEO data from server API using existing service
    const response = await get<SEOByRouteResponse>("/seo/by-route", {
      params: { routePath: normalizedRoute },
      timeout: 5000, // 5 second timeout
    });

    // Check if we got valid SEO data
    if (
      response.data.success &&
      response.data.data &&
      response.data.data.isPublished &&
      !response.data.data.isDeleted
    ) {
      console.log(`✅ SEO data fetched for route: ${normalizedRoute}`);
      // Cache the valid SEO data
      seoCache.set(cacheKey, response.data.data, 10 * 60 * 1000); // Cache for 10 minutes
      return response.data.data;
    } else {
      console.log(
        `ℹ️ No published SEO data found for route: ${normalizedRoute}`
      );
    }

    // Cache the null result to avoid repeated API calls
    seoCache.set(cacheKey, null, 5 * 60 * 1000); // Cache null for 5 minutes
    return null;
  } catch (error) {
    const cacheKey = generateCacheKey(normalizedRoute);

    // Handle different types of errors
    if (error instanceof Error) {
      if (error.message.includes("timeout")) {
        console.warn(`SEO API timeout for route ${normalizedRoute}`);
        // Cache null for shorter time on timeout
        seoCache.set(cacheKey, null, 1 * 60 * 1000); // 1 minute
      } else {
        console.warn(
          `Failed to fetch server SEO for route ${normalizedRoute}:`,
          error.message
        );
        // Cache null for longer time on other errors
        seoCache.set(cacheKey, null, 2 * 60 * 1000); // 2 minutes
      }
    } else {
      console.warn(
        `Failed to fetch server SEO for route ${normalizedRoute}:`,
        error
      );
      seoCache.set(cacheKey, null, 2 * 60 * 1000); // 2 minutes
    }

    return null;
  }
}

/**
 * Generate metadata with server-side SEO support
 */
export async function generateServerMetadata(
  routePath: string,
  fallbackData: {
    title: string;
    description: string;
    keywords?: string[];
    image?: string;
  }
): Promise<Metadata> {
  // Normalize route path - handle null, undefined, empty string cases
  const normalizedRoute = routePath || "/";

  try {
    // Try to fetch server-side SEO data
    console.log("Fetching server SEO for", normalizedRoute);
    const dynamicSEO = await fetchServerSEO(normalizedRoute);
    if (dynamicSEO && dynamicSEO.isPublished && !dynamicSEO.isDeleted) {
      return seoEntryToMetadata(dynamicSEO, normalizedRoute);
    }
  } catch (error) {
    console.warn(`Failed to fetch server SEO for ${normalizedRoute}:`, error);
  }

  // Fallback to page-specific SEO with global config
  return generatePageSEO(routePath, fallbackData);
}
