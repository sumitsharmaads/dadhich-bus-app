"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { WebsiteInfoType, WebsiteContextType } from "@/types";
import {
  websiteStorage,
  websiteStorageExpiry,
} from "@/lib/storage/localStorage";
import { websiteService } from "@/lib/api";
import { transformWebsiteData } from "@/utils/website";

const WebsiteContext = createContext<WebsiteContextType | undefined>(undefined);

interface WebsiteContextProviderProps {
  children: ReactNode;
}

export const WebsiteContextProvider: React.FC<WebsiteContextProviderProps> = ({
  children,
}) => {
  const [websiteInfo, setWebsiteInfo] = useState<WebsiteInfoType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  const fetchWebsiteInfo = async (isRetry: boolean = false) => {
    if (isRetry) {
      setRetryCount((prev) => prev + 1);
    }

    setIsLoading(true);
    setError(null);

    try {
      // Get current hostname for the API call
      const host = window.location.hostname;
      const result = await websiteService.getWebsiteByHost(host);

      // Transform data for frontend compatibility
      const transformedData = transformWebsiteData(result);
      setWebsiteInfo(transformedData);
      websiteStorage.setItem("website", transformedData);
      websiteStorageExpiry.setItem("website_expiry", new Date().toISOString());

      // Reset retry count on success
      setRetryCount(0);
    } catch (error: any) {
      // Only show error if we've exhausted retries or it's not a retry
      if (!isRetry || retryCount >= MAX_RETRIES) {
        setError(error.message || "Failed to load website configuration");
        setWebsiteInfo(null);

        // Clear invalid cache
        websiteStorage.removeItem("website");
        websiteStorageExpiry.removeItem("website_expiry");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const refreshWebsiteInfo = async () => {
    await fetchWebsiteInfo();
  };

  const retryFetch = async () => {
    if (retryCount < MAX_RETRIES) {
      await fetchWebsiteInfo(true);
    }
  };

  useEffect(() => {
    const loadWebsiteInfo = async () => {
      try {
        const cachedData = websiteStorage.getItem("website");
        const lastUpdated = websiteStorageExpiry.getItem("website_expiry");

        // Check if cache is valid (45 minutes)
        const isDataValid = lastUpdated
          ? Date.now() - new Date(lastUpdated).getTime() < 45 * 60 * 1000
          : false;

        if (cachedData && isDataValid) {
          setWebsiteInfo(cachedData);
          setIsLoading(false);
        } else {
          // Cache expired or no cache, fetch fresh data
          await fetchWebsiteInfo();
        }
      } catch (error) {
        setError("Failed to load website configuration");
        setIsLoading(false);
      }
    };

    loadWebsiteInfo();
  }, []);

  const contextValue: WebsiteContextType = {
    websiteInfo,
    isLoading,
    error,
    retryCount,
    maxRetries: MAX_RETRIES,
    refreshWebsiteInfo,
    retryFetch,
  };

  return (
    <WebsiteContext.Provider value={contextValue}>
      {children}
    </WebsiteContext.Provider>
  );
};

export const useWebsite = () => {
  const context = useContext(WebsiteContext);
  if (!context) {
    throw new Error("useWebsite must be used within a WebsiteContextProvider");
  }
  return context;
};
