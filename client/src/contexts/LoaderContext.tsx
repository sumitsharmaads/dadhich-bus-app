"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { LoaderContextType } from "@/types";
import DummyFallback from "@/components/common/DummyFallback";

const LoaderContext = createContext<LoaderContextType | undefined>(undefined);

interface LoaderContextProviderProps {
  children: ReactNode;
}

export const LoaderContextProvider: React.FC<LoaderContextProviderProps> = ({
  children,
}) => {
  const [loading, setLoading] = useState(false);

  const contextValue: LoaderContextType = {
    loading,
    setLoading,
  };

  return (
    <LoaderContext.Provider value={contextValue}>
      {children}
      {loading && <DummyFallback message="Loading, please wait..." />}
    </LoaderContext.Provider>
  );
};

export const useLoader = () => {
  const context = useContext(LoaderContext);
  if (!context) {
    throw new Error("useLoader must be used within a LoaderContextProvider");
  }
  return context;
};
