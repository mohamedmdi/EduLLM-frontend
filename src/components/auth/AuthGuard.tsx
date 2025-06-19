/**
 * Authentication guard component for protecting routes
 * Ensures users are authenticated either as registered users or guests
 */

"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { isAuthenticated, getUserInfo } from '@/lib/auth-utils';
import { Loading } from '@/components/ui/loading';

interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
  loadingVariant?: 'default' | 'chat' | 'page';
}

export default function AuthGuard({ 
  children, 
  redirectTo,
  loadingVariant = 'default' 
}: AuthGuardProps) {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const locale = useLocale();

  // Handle client-side mounting to prevent hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Only run authentication check after component is mounted on client
    if (!isMounted) return;

    const checkAuthentication = async () => {
      try {
        // Check if user is authenticated (has valid userId)
        const authenticated = isAuthenticated();
        
        if (!authenticated) {
          // User is not authenticated, redirect to sign in
          const redirectPath = redirectTo || `/${locale}/auth/signin`;
          console.log('🔒 Authentication required. Redirecting to:', redirectPath);
          router.push(redirectPath);
          return;
        }

        // User is authenticated, check if we have valid user info
        const userInfo = getUserInfo();
        if (!userInfo) {
          // Something went wrong with user data, redirect to sign in
          console.warn('⚠️ User authenticated but no user info found, redirecting to sign in');
          const redirectPath = redirectTo || `/${locale}/auth/signin`;
          router.push(redirectPath);
          return;
        }

        const authType = userInfo.isGuest ? 'guest' : 'registered';
        console.log(`✅ User authenticated as ${authType}:`, userInfo);
        setIsAuthorized(true);
      } catch (error) {
        console.error('Authentication check failed:', error);
        const redirectPath = redirectTo || `/${locale}/auth/signin`;
        router.push(redirectPath);
      } finally {
        setIsChecking(false);
      }    };

    checkAuthentication();
  }, [router, locale, redirectTo, isMounted]);

  // Show loading while checking authentication or before mounting
  if (isChecking || !isMounted) {
    return <Loading variant={loadingVariant} />;
  }

  // Only render children if user is authorized
  if (!isAuthorized) {
    return <Loading variant={loadingVariant} />;
  }

  return <>{children}</>;
}
