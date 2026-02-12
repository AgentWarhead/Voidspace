export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import Link from 'next/link';
import { Container, Card } from '@/components/ui';
import { OpportunityFilters } from '@/components/opportunities/OpportunityFilters';
import { OpportunityList } from '@/components/opportunities/OpportunityList';
import { Skeleton } from '@/components/ui';
import { Sparkles } from 'lucide-react';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { BuildPlansSection } from '@/components/brief/BuildPlansSection';
import { SectionHeader } from '@/components/effects/SectionHeader';
import { GradientText } from '@/components/effects/GradientText';
import { GridPattern } from '@/components/effects/GridPattern';
import { getOpportunities, getAllCategories } from '@/lib/queries';

interface Props {
  searchParams: {
    category?: string;
    difficulty?: string;
    sort?: string;
    minScore?: string;
    maxScore?: string;
    page?: string;
    q?: string;
  };
}

export const metadata = {
  title: 'Voids — Voidspace',
  description: 'Discover voids in the NEAR ecosystem. Find your next build.',
};

export default async function OpportunitiesPage({ searchParams }: Props) {
  const page = parseInt(searchParams.page || '1', 10);
  const pageSize = 12;

  const [{ data: opportunities, total }, categories] = await Promise.all([
    getOpportunities({
      category: searchParams.category,
      difficulty: searchParams.difficulty,
      sort: searchParams.sort || 'gap_score',
      minScore: searchParams.minScore ? parseInt(searchParams.minScore) : undefined,
      maxScore: searchParams.maxScore ? parseInt(searchParams.maxScore) : undefined,
      search: searchParams.q,
      page,
      pageSize,
    }),
    getAllCategories(),
  ]);

  return (
    <div className="min-h-screen">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden py-10 sm:py-14">
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(0,236,151,0.04) 0%, transparent 70%)',
          }}
        />
        <GridPattern className="opacity-20" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 40%, #0a0a0a 100%)',
          }}
        />
        <Container size="xl" className="relative z-10 text-center">
          <GradientText as="h1" className="text-4xl sm:text-5xl font-bold tracking-tight">
            Detected Voids
          </GradientText>
          <p className="text-text-secondary mt-2 max-w-lg mx-auto text-sm sm:text-base">
            Explore voids in the NEAR ecosystem. Higher Void Scores mean deeper opportunities.
          </p>

          {/* Build Plan tagline */}
          <div className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-near-green/20 bg-near-green/5">
            <Sparkles className="w-4 h-4 text-near-green animate-pulse" />
            <span className="text-sm text-text-secondary">
              Every project comes with an AI-powered{' '}
              <span className="text-near-green font-medium">Build Plan</span>
            </span>
          </div>

          {/* Summary Stats */}
          <div className="flex items-center justify-center gap-6 sm:gap-10 mt-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-near-green font-mono">{total}</p>
              <p className="text-xs uppercase tracking-widest text-text-muted font-mono mt-1">Voids Detected</p>
            </div>
            <div className="w-px h-8 bg-gradient-to-b from-transparent via-near-green/30 to-transparent" />
            <div className="text-center">
              <p className="text-2xl font-bold text-text-primary font-mono">{categories.length}</p>
              <p className="text-xs uppercase tracking-widest text-text-muted font-mono mt-1">Categories</p>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. Filters + Voids Grid */}
      <Container size="xl" className="py-6 space-y-6">
        <Card variant="glass" padding="md">
          <Suspense fallback={<Skeleton variant="rectangular" height="40px" />}>
            <OpportunityFilters categories={categories} />
          </Suspense>
        </Card>

        <section>
          <div id="voids-list" />
          <SectionHeader title="All Voids" count={total} badge="HOT" />
          <OpportunityList
            opportunities={opportunities}
            total={total}
            page={page}
            pageSize={pageSize}
          />
        </section>
      </Container>

      {/* 3. Custom Brief Section */}
      <Container size="xl" className="py-8">
        <BuildPlansSection />
      </Container>

      {/* 4. Void Bubbles CTA */}
      <Container size="xl" className="py-4 pb-12">
        <ScrollReveal>
          <Link href="/void-bubbles" className="group flex items-center gap-3 px-6 py-4 rounded-lg bg-accent-cyan/5 border border-accent-cyan/20 hover:border-accent-cyan/40 transition-all">
            <span className="text-2xl">🫧</span>
            <span className="text-sm text-text-secondary group-hover:text-accent-cyan transition-colors">
              Want to see these tokens LIVE? → Launch Void Bubbles
            </span>
          </Link>
        </ScrollReveal>
      </Container>
    </div>
  );
}
