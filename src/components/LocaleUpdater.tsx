"use client";

import { useEffect } from 'react';

interface LocaleUpdaterProps {
  locale: string;
}

export function LocaleUpdater({ locale }: LocaleUpdaterProps) {
  useEffect(() => {
    // Update the html lang attribute when the locale changes
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  return null; // This component doesn't render anything
}
