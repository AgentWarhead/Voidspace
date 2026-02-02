import nextDynamic from 'next/dynamic';
import Link from 'next/link';

import { ChevronRight, BookOpen } from 'lucide-react';
import { Container, Card } from '@/components/ui';
import { HeroSection } from '@/components/hero/HeroSection';
import { VoidDetectionShowcase } from '@/components/dashboard/VoidDetectionShowcase';
import { PriorityVoids } from '@/components/dashboard/PriorityVoids';
import { VoidsForEveryBuilder } from '@/components/dashboard/VoidsForEveryBuilder';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { SectionHeader } from '@/components/effects/SectionHeader';
import { ScanLine } from '@/components/effects/ScanLine';
import { GradientText } from '@/components/effects/GradientText';
import { CategoryGrid } from '@/components/dashboard/CategoryGrid';
import {
  getEcosystemStats,
  getCategoriesWithStats,
  getTopOpportunities,
} from '@/lib/queries';

export const dynamic = 'force-dynamic';

const CategorySaturationChart = nextDynamic(
  () => import('@/components/charts/CategorySaturationChart').then((m) => m.CategorySaturationChart),
  { ssr: false }
);

const TVLByCategory = nextDynamic(
  () => import('@/components/charts/TVLByCategory').then((m) => m.TVLByCategory),
  { ssr: false }
);

export default async function DashboardPage() {
  const [stats, categories, opportunities] = await Promise.all([
    getEcosystemStats(),
    getCategoriesWithStats(),
    getTopOpportunities(100),
  ]);

  return (
    <div className="min-h-screen">
      {/* Section 1: Hero — The Void Portal */}
      <HeroSection stats={stats} totalOpportunities={opportunities.length} />

      <Container size="xl" className="py-8 space-y-16">
        {/* Section 2: AI-Powered Void Detection */}
        <ScrollReveal>
          <VoidDetectionShowcase />
        </ScrollReveal>

        {/* Section 3: Priority Voids — NEAR Strategic Areas */}
        <ScrollReveal delay={0.05}>
          <section>
            <SectionHeader title="Priority Voids" badge="NEAR PRIORITY" />
            <PriorityVoids categories={categories} />
          </section>
        </ScrollReveal>

        {/* Section 4: Voids For Every Builder — Skill Level Showcase */}
        <ScrollReveal delay={0.1}>
          <VoidsForEveryBuilder opportunities={opportunities} />
        </ScrollReveal>

        {/* Section 5: Void Analysis — Charts that work */}
        <ScrollReveal delay={0.15}>
          <section>
            <SectionHeader title="Void Analysis" badge="AI ANALYZED" />
            <div className="space-y-8">
              <Card variant="glass" padding="lg" className="relative overflow-hidden">
                <ScanLine />
                <div className="mb-6">
                  <h3 className="text-base font-semibold text-text-primary">Ecosystem Gap Radar</h3>
                  <p className="text-xs text-text-muted mt-1 max-w-2xl">
                    Each slice is a NEAR category. The further it extends, the bigger the void — more demand, fewer builders. Look for the longest spikes — that&apos;s where your opportunity lives.
                  </p>
                </div>
                <CategorySaturationChart categories={categories} />
              </Card>
              <Card variant="glass" padding="lg" className="relative overflow-hidden">
                <ScanLine />
                <div className="mb-6">
                  <h3 className="text-base font-semibold text-text-primary">Capital Gravity Map</h3>
                  <p className="text-xs text-text-muted mt-1 max-w-2xl">
                    Where is the money? Categories closer to center have more capital locked in. Small circles with green color = few builders, big opportunity. That&apos;s where smart money hasn&apos;t arrived yet.
                  </p>
                </div>
                <TVLByCategory categories={categories} />
              </Card>
            </div>
          </section>
        </ScrollReveal>

        {/* Section 6: Ecosystem Map — Category Grid */}
        <ScrollReveal delay={0.2}>
          <section>
            <SectionHeader title="Ecosystem Map" count={categories.length} />
            <CategoryGrid categories={categories} />
          </section>
        </ScrollReveal>

        {/* Section 7: Enter the Void — CTA Footer */}
        <ScrollReveal delay={0.25}>
          <div className="relative overflow-hidden rounded-2xl">
            <div
              className="absolute inset-0"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(0,236,151,0.06) 0%, transparent 70%)',
              }}
            />
            <div className="relative z-10 text-center py-12 px-6">
              <GradientText as="h2" className="text-2xl sm:text-3xl font-bold tracking-tight">
                Ready to build the future of NEAR?
              </GradientText>
              <p className="text-text-secondary mt-3 max-w-md mx-auto text-sm">
                Every void you fill makes NEAR stronger. Find your opportunity, generate your mission brief, and start building.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
                <Link href="/opportunities">
                  <button className="shimmer-btn text-background font-semibold px-8 py-3 rounded-lg text-sm inline-flex items-center gap-2">
                    Explore the Void
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </Link>
                <Link
                  href="/learn"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-surface border border-border hover:border-near-green/30 text-text-secondary hover:text-near-green rounded-lg transition-colors text-sm"
                >
                  <BookOpen className="w-4 h-4" />
                  New to NEAR?
                </Link>
              </div>
              <p className="text-[10px] text-text-muted font-mono mt-4">
                Built for NEARCON 2026 Innovation Sandbox
              </p>
            </div>
          </div>
        </ScrollReveal>
      </Container>
    </div>
  );
}
