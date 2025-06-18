import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'AuthError' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function AuthErrorPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { error } = await searchParams;
  const t = await getTranslations('AuthError');

  const getErrorMessage = (error: string | undefined) => {
    switch (error) {
      case 'Configuration':
        return t('configurationError');
      case 'AccessDenied':
        return t('accessDenied');
      case 'Verification':
        return t('verificationError');
      default:
        return t('defaultError');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 text-center">
            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">!</span>
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            {t('title')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            {getErrorMessage(error)}
          </p>
        </div>        <div className="mt-8 space-y-4">
          <Button asChild className="w-full">
            <Link href={`/${locale}/auth/signin`}>
              {t('tryAgain')}
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="w-full">
            <Link href={`/${locale}`}>
              {t('backToHome')}
            </Link>
          </Button>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
            <p className="text-sm text-red-600 dark:text-red-400">
              {t('errorCode')}: {error}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
