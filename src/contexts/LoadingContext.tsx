"use client";

import { createContext, useContext, useState, ReactNode, useMemo } from "react";

interface LoadingContextType {
  isPageLoading: boolean;
  setPageLoading: (loading: boolean) => void;
  isNavigating: boolean;
  setNavigating: (navigating: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  const value = useMemo(() => ({
    isPageLoading,
    setPageLoading: setIsPageLoading,
    isNavigating,
    setNavigating: setIsNavigating
  }), [isPageLoading, isNavigating]);

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
}
