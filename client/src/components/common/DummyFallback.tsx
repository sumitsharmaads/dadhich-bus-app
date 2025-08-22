"use client";

import React from "react";

interface DummyFallbackProps {
  message?: string;
  className?: string;
}

const DummyFallback: React.FC<DummyFallbackProps> = ({
  message = "Loading, please wait...",
  className = "",
}) => {
  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-surface-primary/60 backdrop-blur-sm z-50 ${className}`}
    >
      <div className="flex flex-col items-center space-y-4">
        {/* Loading Spinner */}
        <div className="relative">
          <div className="w-12 h-12 border-4 border-neutral-200 border-t-primary-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-primary-300 rounded-full animate-spin animate-reverse"></div>
        </div>

        {/* Loading Text */}
        <div className="text-lg font-medium text-text-primary animate-pulse">
          {message}
        </div>

        {/* Loading Dots */}
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
          <div
            className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"
            style={{ animationDelay: "0.2s" }}
          ></div>
          <div
            className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"
            style={{ animationDelay: "0.4s" }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default DummyFallback;
