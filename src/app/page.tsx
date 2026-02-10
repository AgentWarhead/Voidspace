import Link from 'next/link';

import { ChevronRight, BookOpen, Search, Sparkles } from 'lucide-react';
import { Container } from '@/components/ui';
import { HeroSection } from '@/components/hero/HeroSection';
import { PriorityVoids } from '@/components/dashboard/PriorityVoids';
import { VoidsForEveryBuilder } from '@/components/dashboard/VoidsForEveryBuilder';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { SectionHeader } from '@/components/effects/SectionHeader';
import { GradientText } from '@/components/effects/GradientText';
import {
  getEcosystemStats,
  getCategoriesWithStats,
  getTopOpportunities,
} from '@/lib/queries';

export const dynamic = 'force-dynamic';

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
        {/* Section 2: Here's what NEAR needs — Combined Void Detection + Priority Voids */}
        <ScrollReveal>
          <section>
            <SectionHeader title="Here's what NEAR needs" badge="AI ANALYZED" />
            <div className="mb-8">
              <p className="text-text-secondary max-w-3xl mx-auto text-center">
                Our AI continuously scans the NEAR ecosystem to identify critical gaps where innovation is needed most. These voids represent the highest-impact opportunities for builders to make their mark.
              </p>
            </div>
            <PriorityVoids categories={categories} />
          </section>
        </ScrollReveal>

        {/* Section 3: Pick your path — Voids For Every Builder */}
        <ScrollReveal delay={0.1}>
          <section>
            <SectionHeader title="Pick your path" badge="FOR EVERY BUILDER" />
            <VoidsForEveryBuilder opportunities={opportunities} />
          </section>
        </ScrollReveal>

        {/* Section 4: Void Bubbles CTA */}
        <ScrollReveal delay={0.12}>
          <section>
            <div className="relative overflow-hidden rounded-2xl border border-accent-cyan/20">
              {/* Enhanced dramatic background */}
              <div
                className="absolute inset-0"
                style={{
                  background: 'radial-gradient(ellipse at 40% 50%, rgba(0,212,255,0.12) 0%, rgba(0,236,151,0.08) 40%, transparent 80%)',
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/5 to-near-green/5" />
              
              <div className="relative z-10 p-8 sm:p-12">
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="text-6xl sm:text-7xl mb-4">🫧</div>
                  <GradientText as="h2" className="text-2xl sm:text-3xl font-bold tracking-tight">
                    Void Bubbles — Live Ecosystem Visualization
                  </GradientText>
                  <p className="text-text-secondary text-base mt-3 max-w-2xl mx-auto">
                    Watch every NEAR token breathe in real-time. AI health scores, whale alerts, rug detection,
                    and sonic feedback — all in one mesmerizing bubble map.
                  </p>
                </div>

                {/* Feature highlight grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 max-w-4xl mx-auto">
                  <div className="text-center p-4 bg-surface/50 rounded-lg border border-border">
                    <div className="text-2xl mb-2">🟢🔴</div>
                    <p className="text-xs font-mono text-text-secondary">Real-Time Performance</p>
                  </div>
                  <div className="text-center p-4 bg-surface/50 rounded-lg border border-border">
                    <div className="text-2xl mb-2">🧠</div>
                    <p className="text-xs font-mono text-text-secondary">AI Health Scores</p>
                  </div>
                  <div className="text-center p-4 bg-surface/50 rounded-lg border border-border">
                    <div className="text-2xl mb-2">🐋</div>
                    <p className="text-xs font-mono text-text-secondary">Whale Alert Feed</p>
                  </div>
                  <div className="text-center p-4 bg-surface/50 rounded-lg border border-border">
                    <div className="text-2xl mb-2">🔊</div>
                    <p className="text-xs font-mono text-text-secondary">Sonic Market Feedback</p>
                  </div>
                </div>

                {/* CTA Button and Secondary Text */}
                <div className="text-center">
                  <Link
                    href="/void-bubbles"
                    className="shimmer-btn text-background font-semibold px-8 py-4 rounded-lg text-base inline-flex items-center gap-2 mb-3"
                  >
                    Launch Void Bubbles →
                  </Link>
                  <p className="text-xs text-text-muted font-mono">
                    Updated every 60 seconds · 150+ NEAR tokens · Free forever
                  </p>
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Section 5: Ready to build — CTA Footer */}
        <ScrollReveal delay={0.15}>
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
              <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
                <Link href="/opportunities">
                  <button className="shimmer-btn text-background font-semibold px-6 py-3 rounded-lg text-sm inline-flex items-center gap-2">
                    Explore Voids
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </Link>
                <Link
                  href="/sanctum"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-500/20 border border-purple-500/30 hover:bg-purple-500/30 text-purple-300 rounded-lg transition-colors text-sm"
                >
                  <Sparkles className="w-4 h-4" />
                  Sanctum
                </Link>
                <Link
                  href="/void-bubbles"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-cyan-500/20 border border-cyan-500/30 hover:bg-cyan-500/30 text-cyan-300 rounded-lg transition-colors text-sm"
                >
                  🫧 Void Bubbles
                </Link>
                <Link
                  href="/observatory"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-surface border border-border hover:border-accent-cyan/30 text-text-secondary hover:text-accent-cyan rounded-lg transition-colors text-sm"
                >
                  <Search className="w-4 h-4" />
                  Observatory
                </Link>
                <Link
                  href="/learn"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-surface border border-border hover:border-near-green/30 text-text-secondary hover:text-near-green rounded-lg transition-colors text-sm"
                >
                  <BookOpen className="w-4 h-4" />
                  Learn
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
