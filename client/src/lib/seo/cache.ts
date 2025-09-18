/**
 * SEO Cache Management System
 * Provides in-memory caching for SEO data with smart invalidation
 */

import { normalizeRoutePath } from "./routeUtils";

interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class SEOCache {
  private cache = new Map<string, CacheEntry>();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes
  private readonly MAX_CACHE_SIZE = 1000; // Maximum cache entries

  /**
   * Get cached SEO data for a route
   */
  get(routePath: string): any | null {
    const entry = this.cache.get(routePath);

    if (!entry) {
      return null;
    }

    // Check if entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(routePath);
      return null;
    }

    return entry.data;
  }

  /**
   * Set SEO data in cache
   */
  set(routePath: string, data: any, ttl?: number): void {
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(routePath, {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.DEFAULT_TTL,
    });
  }

  /**
   * Invalidate cache for a specific route
   */
  invalidate(routePath: string): void {
    this.cache.delete(routePath);
  }

  /**
   * Invalidate cache for multiple routes (pattern matching)
   */
  invalidatePattern(pattern: string): void {
    const regex = new RegExp(pattern.replace(/\*/g, ".*"));
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getStats(): { size: number; entries: string[] } {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys()),
    };
  }

  /**
   * Clean expired entries
   */
  cleanExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

// Export singleton instance
export const seoCache = new SEOCache();

// Clean expired entries every 10 minutes
setInterval(() => {
  seoCache.cleanExpired();
}, 10 * 60 * 1000);

/**
 * Cache key generator for consistent key formatting
 */
export function generateCacheKey(routePath: string): string {
  return normalizeRoutePath(routePath);
}

/**
 * Cache invalidation helpers
 */
export const cacheInvalidation = {
  // Invalidate specific route
  route: (routePath: string) => {
    seoCache.invalidate(generateCacheKey(routePath));
  },

  // Invalidate all routes
  all: () => {
    seoCache.clear();
  },

  // Invalidate routes matching pattern
  pattern: (pattern: string) => {
    seoCache.invalidatePattern(pattern);
  },

  // Invalidate routes starting with prefix
  prefix: (prefix: string) => {
    seoCache.invalidatePattern(`${prefix}*`);
  },
};
