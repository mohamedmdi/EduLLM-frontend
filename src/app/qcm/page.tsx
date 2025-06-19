'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function QCMPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the sign-in page with returnTo parameter
    router.push('/en/auth/signin?returnTo=qcm');
  }, [router]);

  // Show a simple loading state while redirecting
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-400">Redirecting to sign in...</p>
      </div>
    </div>
  );
}