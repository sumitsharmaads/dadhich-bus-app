import { useState, useEffect } from "react";
import { SEOEntry } from "@/lib/api/services/seo.service";
import { seoService } from "@/lib/api/services/seo.service";

/**
 * Hook to fetch dynamic SEO data for a route
 */
export function useDynamicSEO(routePath: string) {
  const [seoData, setSeoData] = useState<SEOEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSEOData = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await seoService.getSEOByRoute(routePath);
        setSeoData(data);
      } catch (err) {
        console.warn(`Failed to fetch SEO data for route ${routePath}:`, err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch SEO data"
        );
        setSeoData(null);
      } finally {
        setLoading(false);
      }
    };

    if (routePath) {
      fetchSEOData();
    }
  }, [routePath]);

  return { seoData, loading, error };
}

/**
 * Hook to fetch multiple SEO entries
 */
export function useSEOList() {
  const [seoEntries, setSeoEntries] = useState<SEOEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSEOList = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await seoService.listSEO();
        setSeoEntries(data);
      } catch (err) {
        console.error("Failed to fetch SEO list:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch SEO list"
        );
        setSeoEntries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSEOList();
  }, []);

  const refresh = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await seoService.listSEO();
      setSeoEntries(data);
    } catch (err) {
      console.error("Failed to refresh SEO list:", err);
      setError(
        err instanceof Error ? err.message : "Failed to refresh SEO list"
      );
    } finally {
      setLoading(false);
    }
  };

  return { seoEntries, loading, error, refresh };
}
