import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { GraduationCap, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SignInForm } from '@/components/auth/SignInForm';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'SignIn' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function SignInPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations('SignIn');
  return (
    <div className="min-h-[calc(100vh-5rem)] bg-background">
      <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            {/* Logo with gradient background matching the app style */}
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-8 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-2xl">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            {/* Title with gradient text */}
            <h2 className="mb-2 text-4xl font-bold text-foreground">
              {t('title')}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t('subtitle')}
            </p>
          </div>
          
          {/* Form container with app-consistent styling */}
          <div className="p-8 border bg-slate-900/30 border-slate-800/50 rounded-2xl">
            <SignInForm />
          </div>
        </div>
      </div>
    </div>
  );
}
