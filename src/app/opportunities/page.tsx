export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import Link from 'next/link';
import { Container, Card } from '@/components/ui';
import { OpportunityFilters } from '@/components/opportunities/OpportunityFilters';
import { OpportunityList } from '@/components/opportunities/OpportunityList';
import { Skeleton } from '@/components/ui';
import { Sparkles, Lightbulb, Target, ArrowRight, BarChart3, Cpu, Shield, Coins, Calendar, Rocket, Lock } from 'lucide-react';
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
            Detected Voids
          </GradientText>
          <p className="text-text-secondary mt-3 max-w-lg mx-auto">
            Explore voids in the NEAR ecosystem. Higher Void Scores mean deeper opportunities.
          </p>

          {/* Build Plan tagline */}
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-near-green/20 bg-near-green/5">
            <Sparkles className="w-4 h-4 text-near-green animate-pulse" />
            <span className="text-sm text-text-secondary">
              Every project comes with an AI-powered{' '}
              <span className="text-near-green font-medium">Build Plan</span>
            </span>
          </div>

          {/* Summary Stats */}
          <div className="flex items-center justify-center gap-6 sm:gap-10 mt-6">
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

      {/* Build Plans Section — Two Paths */}
      <Container size="xl" className="py-8">
        <ScrollReveal>
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-text-primary">
              Get Your <span className="text-near-green">Build Plan</span>
            </h2>
            <p className="text-sm text-text-secondary mt-1">
              Every build plan includes market analysis, tech architecture, NEAR strategy, monetization, and a week-by-week roadmap.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
          <ScrollReveal delay={0.1}>
            <Link href="#voids-list" className="block h-full group">
              <div className="h-full p-6 rounded-xl border border-near-green/20 bg-near-green/5 hover:border-near-green/40 hover:bg-near-green/10 transition-all">
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-near-green/10 border border-near-green/20 flex items-center justify-center">
                    <Target className="w-6 h-6 text-near-green" />
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary">Explore Voids</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    Browse AI-detected gaps in the NEAR ecosystem and generate a build plan for any void.
                  </p>
                  <span className="inline-flex items-center gap-1 text-near-green text-sm font-medium mt-1 group-hover:gap-2 transition-all">
                    Browse Below <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <Link href="/sanctum?mode=brief" className="block h-full group">
              <div className="h-full p-6 rounded-xl border border-cyan-400/20 bg-cyan-400/5 hover:border-cyan-400/40 hover:bg-cyan-400/10 transition-all">
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center">
                    <Lightbulb className="w-6 h-6 text-cyan-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary">Bring Your Own Idea</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    Describe your project idea and get a full blueprint — market analysis, architecture, and roadmap.
                  </p>
                  <span className="inline-flex items-center gap-1 text-cyan-400 text-sm font-medium mt-1 group-hover:gap-2 transition-all">
                    Start in Sanctum <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>
          </ScrollReveal>
        </div>

        {/* What's in a Build Plan — 6 section preview */}
        <ScrollReveal delay={0.3}>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-3xl mx-auto mt-6">
            {[
              { icon: BarChart3, title: 'Market Analysis', color: 'text-near-green' },
              { icon: Cpu, title: 'Tech Architecture', color: 'text-cyan-400' },
              { icon: Shield, title: 'NEAR Strategy', color: 'text-near-green' },
              { icon: Coins, title: 'Monetization', color: 'text-cyan-400' },
              { icon: Calendar, title: 'Week 1 Plan', color: 'text-near-green' },
              { icon: Rocket, title: 'Growth Roadmap', color: 'text-cyan-400' },
            ].map((section) => (
              <div key={section.title} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-surface/50">
                <section.icon className={`w-4 h-4 ${section.color} shrink-0`} />
                <span className="text-xs text-text-secondary">{section.title}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-2 mt-4 text-text-muted text-xs">
            <Lock className="w-3 h-3" />
            Full build plans require Sanctum credits
          </div>
        </ScrollReveal>
      </Container>

      <Container size="xl" className="py-4">
        <ScrollReveal>
          <Link href="/void-bubbles" className="group flex items-center gap-3 px-6 py-4 rounded-lg bg-accent-cyan/5 border border-accent-cyan/20 hover:border-accent-cyan/40 transition-all">
            <span className="text-2xl">🫧</span>
            <span className="text-sm text-text-secondary group-hover:text-accent-cyan transition-colors">
              Want to see these tokens LIVE? → Launch Void Bubbles
            </span>
          </Link>
        </ScrollReveal>
      </Container>

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
            <div id="voids-list" />
            <SectionHeader title="All Voids" count={total} badge="HOT" />
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
