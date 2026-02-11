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

        {/* Section 4: Void Bubbles CTA — The Showstopper */}
        <ScrollReveal delay={0.12}>
          <section>
            <div className="relative overflow-hidden rounded-3xl border border-near-green/20 shadow-2xl shadow-near-green/5">
              {/* Multi-layer cinematic background */}
              <div
                className="absolute inset-0"
                style={{
                  background: `
                    radial-gradient(ellipse 80% 60% at 30% 20%, rgba(0,236,151,0.15) 0%, transparent 60%),
                    radial-gradient(ellipse 60% 80% at 70% 80%, rgba(0,212,255,0.12) 0%, transparent 60%),
                    radial-gradient(ellipse 50% 50% at 50% 50%, rgba(157,78,221,0.06) 0%, transparent 70%),
                    linear-gradient(180deg, rgba(3,5,8,0.95) 0%, rgba(6,10,15,0.98) 100%)
                  `,
                }}
              />
              {/* Animated grid overlay */}
              <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                  backgroundImage: 'linear-gradient(rgba(0,236,151,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,236,151,0.5) 1px, transparent 1px)',
                  backgroundSize: '60px 60px',
                }}
              />
              {/* Floating particles effect */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute w-2 h-2 rounded-full bg-near-green/30 animate-pulse" style={{ top: '15%', left: '10%', animationDelay: '0s', animationDuration: '3s' }} />
                <div className="absolute w-1.5 h-1.5 rounded-full bg-accent-cyan/40 animate-pulse" style={{ top: '25%', right: '15%', animationDelay: '1s', animationDuration: '4s' }} />
                <div className="absolute w-3 h-3 rounded-full bg-near-green/20 animate-pulse" style={{ bottom: '20%', left: '20%', animationDelay: '2s', animationDuration: '5s' }} />
                <div className="absolute w-1 h-1 rounded-full bg-white/30 animate-pulse" style={{ top: '60%', right: '25%', animationDelay: '0.5s', animationDuration: '3.5s' }} />
                <div className="absolute w-2 h-2 rounded-full bg-accent-cyan/25 animate-pulse" style={{ bottom: '30%', right: '10%', animationDelay: '1.5s', animationDuration: '4.5s' }} />
              </div>
              {/* Scan line */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                  className="absolute w-full h-px"
                  style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(0,236,151,0.15) 30%, rgba(0,212,255,0.2) 50%, rgba(0,236,151,0.15) 70%, transparent 100%)',
                    animation: 'void-bg-scan 10s linear infinite',
                  }}
                />
              </div>
              
              <div className="relative z-10 p-8 sm:p-14 lg:p-16">
                {/* Badge */}
                <div className="text-center mb-6">
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-near-green/10 border border-near-green/20 text-near-green text-[11px] font-mono uppercase tracking-widest font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-near-green animate-pulse" />
                    Live · 150+ Tokens · Free Forever
                  </span>
                </div>

                {/* Hero headline */}
                <div className="text-center mb-10">
                  <GradientText as="h2" className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-snug pb-1">
                    See the entire NEAR ecosystem.
                    <br />
                    <span className="text-white/90">In one living, breathing map.</span>
                  </GradientText>
                  <p className="text-text-secondary text-base sm:text-lg mt-5 max-w-2xl mx-auto leading-relaxed">
                    150+ tokens visualized as living bubbles. Green means up. Red means down.
                    Bigger means bigger market cap. Click any bubble for DexScreener-grade intel
                    — health scores, transaction flow, whale alerts, and AI risk analysis.
                    All real-time. All free.
                  </p>
                </div>

                {/* Feature grid — 2x3 on mobile, 3x2 on desktop */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-10 max-w-4xl mx-auto">
                  <div className="group p-4 sm:p-5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-near-green/20 hover:bg-near-green/[0.04] transition-all duration-300">
                    <div className="text-2xl sm:text-3xl mb-2">🟢🔴</div>
                    <h3 className="text-sm font-semibold text-white mb-1">Live Performance</h3>
                    <p className="text-[11px] text-text-muted leading-relaxed">Green/red bubbles pulse with 1H, 6H, and 24H price action. See the market mood instantly.</p>
                  </div>
                  <div className="group p-4 sm:p-5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-accent-cyan/20 hover:bg-accent-cyan/[0.04] transition-all duration-300">
                    <div className="text-2xl sm:text-3xl mb-2">📊</div>
                    <h3 className="text-sm font-semibold text-white mb-1">DexScreener Intel</h3>
                    <p className="text-[11px] text-text-muted leading-relaxed">Click any token for MCap, FDV, volume, liquidity, buy/sell ratios, and contract info.</p>
                  </div>
                  <div className="group p-4 sm:p-5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-purple-500/20 hover:bg-purple-500/[0.04] transition-all duration-300">
                    <div className="text-2xl sm:text-3xl mb-2">🧠</div>
                    <h3 className="text-sm font-semibold text-white mb-1">AI Risk Analysis</h3>
                    <p className="text-[11px] text-text-muted leading-relaxed">Every token scored 0-100. Health bars, risk levels, and AI intelligence briefs generated in real-time.</p>
                  </div>
                  <div className="group p-4 sm:p-5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-rose-500/20 hover:bg-rose-500/[0.04] transition-all duration-300">
                    <div className="text-2xl sm:text-3xl mb-2">🐋</div>
                    <h3 className="text-sm font-semibold text-white mb-1">Whale Shockwaves</h3>
                    <p className="text-[11px] text-text-muted leading-relaxed">Watch massive trades ripple across the map. Shockwave effects push nearby bubbles in real-time.</p>
                  </div>
                  <div className="group p-4 sm:p-5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-amber-500/20 hover:bg-amber-500/[0.04] transition-all duration-300">
                    <div className="text-2xl sm:text-3xl mb-2">🔬</div>
                    <h3 className="text-sm font-semibold text-white mb-1">X-Ray Mode</h3>
                    <p className="text-[11px] text-text-muted leading-relaxed">Toggle X-ray vision to reveal health halos around every token. Spot danger before it strikes.</p>
                  </div>
                  <div className="group p-4 sm:p-5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-near-green/20 hover:bg-near-green/[0.04] transition-all duration-300">
                    <div className="text-2xl sm:text-3xl mb-2">⚡</div>
                    <h3 className="text-sm font-semibold text-white mb-1">Gainers & Losers</h3>
                    <p className="text-[11px] text-text-muted leading-relaxed">One-click filters to spotlight top performers or biggest losers. 5 timeframes from 1H to 30D.</p>
                  </div>
                </div>

                {/* CTA — double button */}
                <div className="text-center space-y-4">
                  <Link
                    href="/void-bubbles"
                    className="shimmer-btn text-background font-bold px-10 py-4 rounded-xl text-lg inline-flex items-center gap-3 shadow-lg shadow-near-green/20 hover:shadow-near-green/30 transition-shadow"
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-background animate-pulse" />
                    Enter Void Bubbles
                  </Link>
                  <p className="text-[11px] text-text-muted font-mono">
                    No wallet required · No signup · Updated every 120 seconds
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
