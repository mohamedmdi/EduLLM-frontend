"use client";

import dynamic from 'next/dynamic';
import { Loading } from '@/components/ui/loading';
import { Suspense } from 'react';

// Lazy load heavy components
const AnimatedSection = dynamic(() => 
  import('@/components/PageTransition').then(mod => ({ default: mod.AnimatedSection })), 
  { 
    loading: () => <div className="animate-pulse bg-card/20 rounded-lg h-20" />,
    ssr: false 
  }
);

const HoverCard = dynamic(() => 
  import('@/components/PageTransition').then(mod => ({ default: mod.HoverCard })), 
  { 
    loading: () => <div className="animate-pulse bg-card/20 rounded-lg h-32" />,
    ssr: false 
  }
);

const AnimatedButton = dynamic(() => 
  import('@/components/PageTransition').then(mod => ({ default: mod.AnimatedButton })), 
  { 
    loading: () => <div className="animate-pulse bg-card/20 rounded-lg h-10 w-24" />,
    ssr: false 
  }
);

// Lazy load Lucide icons
const GraduationCap = dynamic(() => import('lucide-react').then(mod => ({ default: mod.GraduationCap })));
const MessageSquare = dynamic(() => import('lucide-react').then(mod => ({ default: mod.MessageSquare })));
const ArrowRight = dynamic(() => import('lucide-react').then(mod => ({ default: mod.ArrowRight })));
const Play = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Play })));
const Star = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Star })));
const Zap = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Zap })));
const ListChecks = dynamic(() => import('lucide-react').then(mod => ({ default: mod.ListChecks })));

interface LazyComponentsProps {
  children: React.ReactNode;
}

export function LazyComponents({ children }: LazyComponentsProps) {
  return (
    <Suspense fallback={<Loading variant="page" message="Loading components..." />}>
      {children}
    </Suspense>
  );
}

export {
  AnimatedSection,
  HoverCard,
  AnimatedButton,
  GraduationCap,
  MessageSquare,
  ArrowRight,
  Play,
  Star,
  Zap,
  ListChecks,
};
