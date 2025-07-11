'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { generateUserId, setUserAuth } from '@/lib/auth-utils';

export function SignUpForm() {
  const t = useTranslations('SignUp');
  const locale = useLocale();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (provider: string) => {
    setIsLoading(true);
    try {
      // Generate a unique ID for the new user
      const uniqueId = generateUserId(provider);
      
      // Store authentication data
      setUserAuth(uniqueId, provider);
      
      console.log(`Signed up with ${provider}, unique ID: ${uniqueId}`);
      
      // Redirect to home page
      window.location.href = '/';
    } catch (error) {
      console.error('Sign up error:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8 space-y-6">
      <div className="space-y-3">
        <Button
          onClick={() => handleSignUp('google')}
          disabled={isLoading}
          className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center space-x-3">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>
              {t('signUpWith')} Google
            </span>
          </div>
        </Button>

        <Button
          onClick={() => handleSignUp('microsoft')}
          disabled={isLoading}
          className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center space-x-3">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#f25022" d="M1 1h10v10H1z" />
              <path fill="#00a4ef" d="M13 1h10v10H13z" />
              <path fill="#7fba00" d="M1 13h10v10H1z" />
              <path fill="#ffb900" d="M13 13h10v10H13z" />
            </svg>
            <span>
              {t('signUpWith')} Microsoft
            </span>
          </div>
        </Button>
      </div>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
              {t('alreadyHaveAccount')}
            </span>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            href={`/${locale}/auth/signin`}
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            {t('signInInstead')}
          </Link>
        </div>
      </div>

      <div className="mt-8 text-xs text-gray-500 dark:text-gray-400 text-center">
        {t('termsNotice')}{' '}
        <Link href={`/${locale}/terms`} className="text-blue-600 hover:text-blue-500">
          {t('termsOfService')}
        </Link>{' '}
        {t('and')}{' '}
        <Link href={`/${locale}/privacy`} className="text-blue-600 hover:text-blue-500">
          {t('privacyPolicy')}
        </Link>
        .
      </div>
    </div>
  );
}
