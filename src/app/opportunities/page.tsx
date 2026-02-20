export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

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
import { getOpportunities, getAllCategories, getTotalOpportunitiesCount } from '@/lib/queries';

interface Props {
  searchParams: {
    category?: string;
    difficulty?: string;
    competition?: string;
    sort?: string;
    minScore?: string;
    maxScore?: string;
    page?: string;
    q?: string;
  };
}

export const metadata = {
  title: 'Explore Voids — NEAR Ecosystem Gaps & Build Opportunities | Voidspace',
  description: 'AI-detected gaps in the NEAR ecosystem. Find high-impact opportunities, generate build plans, and start shipping.',
  alternates: { canonical: 'https://voidspace.io/opportunities' },
  openGraph: {
    title: 'Explore Voids — NEAR Ecosystem Gaps & Build Opportunities | Voidspace',
    description: 'AI-detected gaps in the NEAR ecosystem. Find high-impact opportunities, generate build plans, and start shipping.',
    url: 'https://voidspace.io/opportunities',
    siteName: 'Voidspace',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://voidspace.io/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Voidspace — NEAR Ecosystem Gaps & Build Opportunities',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Explore Voids — NEAR Ecosystem Gaps | Voidspace',
    description: 'AI-detected gaps in NEAR. Find opportunities, generate build plans, start shipping.',
    creator: '@VoidSpaceIO',
    images: ['https://voidspace.io/og-image.jpg'],
  },
};

export default async function OpportunitiesPage({ searchParams }: Props) {
  const page = parseInt(searchParams?.page || '1', 10);
  const pageSize = 12;

  const [{ data: opportunities, total: filteredTotal }, categories, totalCount] = await Promise.all([
    getOpportunities({
      category: searchParams?.category,
      difficulty: searchParams?.difficulty,
      competition: searchParams?.competition,
      sort: searchParams?.sort || 'gap_score',
      minScore: searchParams?.minScore ? parseInt(searchParams.minScore) : undefined,
      maxScore: searchParams?.maxScore ? parseInt(searchParams.maxScore) : undefined,
      search: searchParams?.q,
      page,
      pageSize,
    }),
    getAllCategories(),
    getTotalOpportunitiesCount(),
  ]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-8 sm:py-10 md:py-14">
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
        <Container size="xl" className="relative z-10 text-center px-4 sm:px-6">
          <GradientText as="h1" className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            Find Your Void
          </GradientText>
          <p className="text-text-secondary mt-3 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Every void is a real gap in the NEAR ecosystem — verified against live project data.
            Each one comes with a full AI-powered build plan the moment you&apos;re ready to move.
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full border border-near-green/20 bg-near-green/5">
              <Sparkles className="w-3.5 h-3.5 text-near-green shrink-0" />
              <span className="text-xs text-text-secondary">
                Every void includes a <span className="text-near-green font-semibold">Mission Brief</span>
              </span>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-400/20 bg-cyan-400/5">
              <span className="text-xs text-cyan-400 font-semibold">🚀 First-mover opportunities available</span>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="flex items-center justify-center gap-6 sm:gap-10 mt-5">
            <div className="text-center">
              <p className="text-xl sm:text-2xl font-bold text-near-green font-mono">{totalCount}</p>
              <p className="text-[10px] sm:text-xs uppercase tracking-widest text-text-muted font-mono mt-1">Verified Voids</p>
            </div>
            <div className="w-px h-8 bg-gradient-to-b from-transparent via-near-green/30 to-transparent" />
            <div className="text-center">
              <p className="text-xl sm:text-2xl font-bold text-text-primary font-mono">{categories.length}</p>
              <p className="text-[10px] sm:text-xs uppercase tracking-widest text-text-muted font-mono mt-1">Categories</p>
            </div>
            <div className="w-px h-8 bg-gradient-to-b from-transparent via-near-green/30 to-transparent" />
            <div className="text-center">
              <p className="text-xl sm:text-2xl font-bold text-cyan-400 font-mono">
                {opportunities.filter(o => o.difficulty === 'beginner').length > 0
                  ? `${opportunities.filter(o => o.difficulty === 'beginner').length}+`
                  : '40%'}
              </p>
              <p className="text-[10px] sm:text-xs uppercase tracking-widest text-text-muted font-mono mt-1">Solo-Buildable</p>
            </div>
          </div>
        </Container>
      </section>

      {/* Filters + Voids Grid */}
      <Container size="xl" className="py-4 sm:py-6 space-y-4 sm:space-y-6 px-4 sm:px-6">
        <Card variant="glass" padding="md">
          <Suspense fallback={<Skeleton variant="rectangular" height="40px" />}>
            <OpportunityFilters categories={categories} total={totalCount} filteredTotal={filteredTotal} />
          </Suspense>
        </Card>

        <section>
          <div id="voids-list" />
          <SectionHeader title="All Voids" count={filteredTotal} badge="HOT" />
          <OpportunityList
            opportunities={opportunities}
            total={filteredTotal}
            page={page}
            pageSize={pageSize}
            searchParams={searchParams}
          />
        </section>
      </Container>

      {/* Custom Brief Section */}
      <Container size="xl" className="py-6 sm:py-8 px-4 sm:px-6">
        <BuildPlansSection />
      </Container>

      {/* Void Bubbles CTA */}
      <Container size="xl" className="py-4 pb-8 sm:pb-12 px-4 sm:px-6">
        <ScrollReveal>
          <Link
            href="/void-bubbles"
            className="group flex items-center gap-3 px-4 sm:px-6 py-4 rounded-lg bg-accent-cyan/5 border border-accent-cyan/20 hover:border-accent-cyan/40 transition-all active:scale-[0.98] touch-manipulation min-h-[56px]"
          >
            <span className="text-2xl">🫧</span>
            <span className="text-xs sm:text-sm text-text-secondary group-hover:text-accent-cyan transition-colors">
              Want to see these tokens LIVE? → Launch Void Bubbles
            </span>
          </Link>
        </ScrollReveal>
      </Container>
    </div>
  );
}
