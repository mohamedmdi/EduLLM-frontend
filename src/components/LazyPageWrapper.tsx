"use client";

import { Suspense } from "react";
import { Loading } from "./ui/loading";

interface LazyPageWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function LazyPageWrapper({ 
  children, 
  fallback = <Loading variant="chat" /> 
}: LazyPageWrapperProps) {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
}
