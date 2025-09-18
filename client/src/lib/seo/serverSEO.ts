/**
 * Server-side SEO utilities that work during build time and SSR
 * These functions don't make HTTP requests but work with the database directly
 */

import { Metadata } from "next";
import { generatePageSEO, seoEntryToMetadata } from "./seoUtils";
import { seoCache, generateCacheKey } from "./cache";

/**
 * Server-side SEO data fetcher with caching
 * This should be used in generateMetadata functions
 */
export async function fetchServerSEO(routePath: string): Promise<any | null> {
  try {
    const cacheKey = generateCacheKey(routePath);

    // Check cache first
    const cachedData = seoCache.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    // In a real implementation, you would directly access the database here
    // For now, we'll return null to use fallback SEO
    // This prevents the ECONNREFUSED error during build time

    // TODO: Implement direct database access here
    // Example:
    // const seoData = await db.seo.findOne({ routePath, isPublished: true, isDeleted: false });
    // if (seoData) {
    //   seoCache.set(cacheKey, seoData, 10 * 60 * 1000); // Cache for 10 minutes
    //   return seoData;
    // }

    // Cache the null result to avoid repeated database queries
    seoCache.set(cacheKey, null, 5 * 60 * 1000); // Cache null for 5 minutes
    return null;
  } catch (error) {
    console.warn(`Failed to fetch server SEO for route ${routePath}:`, error);
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
  try {
    // Try to fetch server-side SEO data
    const dynamicSEO = await fetchServerSEO(routePath);
    if (dynamicSEO && dynamicSEO.isPublished && !dynamicSEO.isDeleted) {
      return seoEntryToMetadata(dynamicSEO, routePath);
    }
  } catch (error) {
    console.warn(`Failed to fetch server SEO for ${routePath}:`, error);
  }

  // Fallback to page-specific SEO with global config
  return generatePageSEO(routePath, fallbackData);
}
