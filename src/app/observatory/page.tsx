import { Suspense } from 'react';
import { Metadata } from 'next';
import ObservatoryContent from './ObservatoryContent';
import { Container } from '@/components/ui/Container';
import { Skeleton } from '@/components/ui/Skeleton';
import { Globe } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Observatory — NEAR Wallet Analytics & Market Intelligence | Voidspace',
  description: 'Free tools: live token bubbles, AI wallet analysis, and transaction mapping for NEAR Protocol.',
  keywords: ['NEAR', 'wallet', 'analytics', 'blockchain', 'monitoring', 'reputation', 'Void Bubbles', 'Void Lens'],
  alternates: { canonical: 'https://voidspace.io/observatory' },
  openGraph: {
    title: 'Observatory — NEAR Wallet Analytics & Market Intelligence | Voidspace',
    description: 'Free tools: live token bubbles, AI wallet analysis, and transaction mapping for NEAR Protocol.',
    url: 'https://voidspace.io/observatory',
    siteName: 'Voidspace',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://voidspace.io/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Voidspace Observatory — NEAR Intelligence Dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Observatory — Free NEAR Analytics & Intelligence | Voidspace',
    description: 'Live token bubbles, AI wallet analysis, and transaction mapping for NEAR — all free.',
    creator: '@VoidSpaceIO',
    images: ['https://voidspace.io/og-image.jpg'],
  },
};

function ObservatoryLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header section skeleton */}
      <section className="relative py-8 sm:py-12 border-b border-border">
        <Container size="xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-near-green/10 border border-near-green/20">
                  <Globe className="w-5 h-5 text-near-green" />
                </div>
                <Skeleton className="h-8 w-48 animate-pulse bg-white/5" />
              </div>
              <Skeleton className="h-5 w-96 max-w-full animate-pulse bg-white/5" />
            </div>

            {/* Live indicator skeleton */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-near-green/10 border border-near-green/20 w-fit">
              <span className="w-2 h-2 rounded-full bg-near-green animate-pulse" />
              <span className="text-xs font-mono text-near-green uppercase tracking-wider">Live Data</span>
            </div>
          </div>

          {/* Tool tabs skeleton */}
          <div className="mt-6 flex flex-col sm:flex-row flex-wrap gap-2">
            <Skeleton className="h-10 w-28 animate-pulse bg-white/5 rounded-lg" />
            <Skeleton className="h-10 w-32 animate-pulse bg-white/5 rounded-lg" />
            <Skeleton className="h-10 w-30 animate-pulse bg-white/5 rounded-lg" />
          </div>

          {/* Tool description skeleton */}
          <Skeleton className="h-4 w-80 animate-pulse bg-white/5 mt-3" />
        </Container>
      </section>

      {/* Main content skeleton */}
      <Container className="py-8">
        {/* Analysis dashboard skeleton */}
        <div className="space-y-8">
          {/* Search/input section */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-40 animate-pulse bg-white/5" />
            <div className="flex gap-4">
              <Skeleton className="h-12 flex-1 animate-pulse bg-white/5 rounded-lg" />
              <Skeleton className="h-12 w-24 animate-pulse bg-white/5 rounded-lg" />
            </div>
          </div>

          {/* Stats cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-3 p-4 bg-surface rounded-xl border border-border">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-20 animate-pulse bg-white/5" />
                  <Skeleton className="h-6 w-6 animate-pulse bg-white/5 rounded-full" />
                </div>
                <Skeleton className="h-8 w-16 animate-pulse bg-white/5" />
                <Skeleton className="h-3 w-24 animate-pulse bg-white/5" />
              </div>
            ))}
          </div>

          {/* Main analysis area */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Chart/visualization skeleton */}
            <div className="space-y-4 p-6 bg-surface rounded-xl border border-border">
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-32 animate-pulse bg-white/5" />
                <Skeleton className="h-8 w-20 animate-pulse bg-white/5 rounded-lg" />
              </div>
              <Skeleton className="h-64 w-full animate-pulse bg-white/5 rounded-lg" />
              <div className="flex justify-between">
                <Skeleton className="h-4 w-16 animate-pulse bg-white/5" />
                <Skeleton className="h-4 w-20 animate-pulse bg-white/5" />
                <Skeleton className="h-4 w-16 animate-pulse bg-white/5" />
              </div>
            </div>

            {/* Data table/list skeleton */}
            <div className="space-y-4 p-6 bg-surface rounded-xl border border-border">
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-40 animate-pulse bg-white/5" />
                <Skeleton className="h-8 w-16 animate-pulse bg-white/5 rounded-lg" />
              </div>
              
              {/* Table rows */}
              <div className="space-y-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-background rounded-lg border border-border-subtle">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-8 w-8 animate-pulse bg-white/5 rounded-full" />
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-32 animate-pulse bg-white/5" />
                        <Skeleton className="h-3 w-24 animate-pulse bg-white/5" />
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <Skeleton className="h-4 w-16 animate-pulse bg-white/5" />
                      <Skeleton className="h-3 w-12 animate-pulse bg-white/5" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Network map or additional visualization */}
          <div className="space-y-4 p-6 bg-surface rounded-xl border border-border">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-48 animate-pulse bg-white/5" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-20 animate-pulse bg-white/5 rounded-lg" />
                <Skeleton className="h-8 w-24 animate-pulse bg-white/5 rounded-lg" />
              </div>
            </div>
            <div className="relative">
              <Skeleton className="h-80 w-full animate-pulse bg-white/5 rounded-lg" />
              {/* Overlay elements to simulate interactive network map */}
              <div className="absolute inset-4 flex items-center justify-center">
                <div className="grid grid-cols-3 gap-8 opacity-30">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                    <Skeleton key={i} className="h-12 w-12 animate-pulse bg-white/5 rounded-full" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default function ObservatoryPage() {
  return (
    <Suspense fallback={<ObservatoryLoading />}>
      <ObservatoryContent />
    </Suspense>
  );
}
