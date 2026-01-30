export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import { Container, Card } from '@/components/ui';
import { OpportunityFilters } from '@/components/opportunities/OpportunityFilters';
import { OpportunityList } from '@/components/opportunities/OpportunityList';
import { Skeleton } from '@/components/ui';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
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
  };
}

export const metadata = {
  title: 'Opportunities — Voidspace',
  description: 'Discover gap opportunities in the NEAR ecosystem.',
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
      page,
      pageSize,
    }),
    getAllCategories(),
  ]);

  return (
    <div className="min-h-screen">
      {/* Page Banner */}
      <section className="relative overflow-hidden py-12 sm:py-16">
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
            Opportunities
          </GradientText>
          <p className="text-text-secondary mt-3 max-w-lg mx-auto">
            Discover gaps in the NEAR ecosystem. Higher gap scores indicate greater opportunity.
          </p>

          {/* Summary Stats */}
          <div className="flex items-center justify-center gap-6 sm:gap-10 mt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-near-green font-mono">{total}</p>
              <p className="text-xs uppercase tracking-widest text-text-muted font-mono mt-1">Total Gaps</p>
            </div>
            <div className="w-px h-8 bg-gradient-to-b from-transparent via-near-green/30 to-transparent" />
            <div className="text-center">
              <p className="text-2xl font-bold text-text-primary font-mono">{categories.length}</p>
              <p className="text-xs uppercase tracking-widest text-text-muted font-mono mt-1">Categories</p>
            </div>
          </div>
        </Container>
      </section>

      <Container size="xl" className="py-8 space-y-6">
        <ScrollReveal>
          <Card variant="glass" padding="md">
            <Suspense fallback={<Skeleton variant="rectangular" height="40px" />}>
              <OpportunityFilters categories={categories} />
            </Suspense>
          </Card>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <section>
            <SectionHeader title="All Opportunities" count={total} badge="HOT" />
            <OpportunityList
              opportunities={opportunities}
              total={total}
              page={page}
              pageSize={pageSize}
            />
          </section>
        </ScrollReveal>
      </Container>
    </div>
  );
}
