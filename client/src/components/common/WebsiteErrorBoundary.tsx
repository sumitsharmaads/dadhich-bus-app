"use client";

import React from "react";
import { useWebsite } from "@/contexts/WebsiteProvider";

interface WebsiteErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const WebsiteErrorBoundary: React.FC<WebsiteErrorBoundaryProps> = ({
  children,
  fallback,
}) => {
  const { error, isLoading, retryCount, maxRetries, retryFetch } = useWebsite();

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading website configuration...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Configuration Error
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>

          {retryCount < maxRetries && (
            <button
              onClick={retryFetch}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Retry ({retryCount + 1}/{maxRetries})
            </button>
          )}

          {retryCount >= maxRetries && (
            <div className="text-sm text-gray-500">
              Maximum retries reached. Please refresh the page or contact
              support.
            </div>
          )}
        </div>
      </div>
    );
  }

  // Show children when everything is loaded
  return <>{children}</>;
};

export default WebsiteErrorBoundary;
