import { Suspense } from 'react';
import { Metadata } from 'next';
import ObservatoryContent from './ObservatoryContent';
import { Container } from '@/components/ui/Container';
import { Skeleton } from '@/components/ui/Skeleton';
import { Telescope } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Observatory — Voidspace',
  description: 'Intelligence tools to analyze wallets, map relationships, and monitor the NEAR ecosystem in real-time.',
  keywords: ['NEAR', 'wallet', 'analytics', 'blockchain', 'monitoring', 'reputation'],
};

function ObservatoryLoading() {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-8 sm:py-12 border-b border-border">
        <Container size="xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-near-green/10 border border-near-green/20">
              <Telescope className="w-5 h-5 text-near-green" />
            </div>
            <Skeleton variant="text" width="200px" height="32px" />
          </div>
          <Skeleton variant="text" width="400px" height="20px" className="mt-2" />
          <div className="mt-6 flex gap-2">
            <Skeleton variant="rectangular" width="120px" height="40px" className="rounded-lg" />
            <Skeleton variant="rectangular" width="120px" height="40px" className="rounded-lg" />
            <Skeleton variant="rectangular" width="120px" height="40px" className="rounded-lg" />
          </div>
        </Container>
      </section>
      <Container className="py-8">
        <Skeleton variant="rectangular" height="400px" className="rounded-lg" />
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
