'use client';

import { useSession, signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export function UserSession() {
  const { data: session, status } = useSession();
  const t = useTranslations('UserSession');
  const [isLoading, setIsLoading] = useState(false);

  if (status === 'loading') {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-gray-700 rounded-full animate-pulse"></div>
        <div className="w-20 h-4 bg-gray-700 rounded animate-pulse"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut({ callbackUrl: '/' });
    } catch (error) {
      console.error('Sign out error:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-3">
      {/* User Avatar */}
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden">        {session.user?.image ? (
          <Image 
            src={session.user.image} 
            alt={session.user.name ?? 'User'} 
            width={32}
            height={32}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-white text-sm font-medium">
            {session.user?.name?.charAt(0) ?? session.user?.email?.charAt(0) ?? 'U'}
          </span>
        )}
      </div>

      {/* User Info */}
      <div className="hidden sm:block">
        <p className="text-sm font-medium text-white truncate max-w-32">
          {session.user?.name ?? session.user?.email ?? t('user')}
        </p>
      </div>

      {/* Sign Out Button */}
      <Button
        onClick={handleSignOut}
        disabled={isLoading}
        variant="outline"
        size="sm"
        className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
      >
        {isLoading ? t('signingOut') : t('signOut')}
      </Button>
    </div>
  );
}
