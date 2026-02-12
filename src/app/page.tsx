import Link from 'next/link';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - lucide-react 0.453 has broken type exports (icons declared but not exported in .d.ts)
import { ChevronRight, BookOpen, Search, Sparkles, Flame, Palette, Users, Telescope, Zap } from 'lucide-react';
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
      {/* ═══════════════════════════════════════════════════════════════
          SECTION 1: Hero — The Void Portal (KEEP AS-IS)
          ═══════════════════════════════════════════════════════════════ */}
      <HeroSection stats={stats} totalOpportunities={opportunities.length} />

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 2: Social Proof Stats Bar
          ═══════════════════════════════════════════════════════════════ */}
      <div className="border-y border-border/50 bg-surface/30 backdrop-blur-sm">
        <Container size="xl">
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-border/30">
            {[
              { value: '150+', label: 'NEAR Tokens Tracked' },
              { value: '43', label: 'Learning Modules' },
              { value: '20+', label: 'Void Categories' },
              { value: 'Free', label: 'To Start Building' },
            ].map((stat) => (
              <div key={stat.label} className="text-center py-4 px-2">
                <div className="text-lg sm:text-xl font-bold text-text-primary font-mono">{stat.value}</div>
                <div className="text-[10px] sm:text-xs text-text-muted uppercase tracking-wider mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </Container>
      </div>

      <Container size="xl" className="py-8 space-y-16">
        {/* ═══════════════════════════════════════════════════════════════
            SECTION 3: Void Bubbles — Live Ecosystem Visualization (MOVED UP)
            ═══════════════════════════════════════════════════════════════ */}
        <ScrollReveal>
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

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 4: The Sanctum — AI-Powered Builder Suite (NEW)
            ═══════════════════════════════════════════════════════════════ */}
        <ScrollReveal delay={0.1}>
          <section>
            <div className="relative overflow-hidden rounded-2xl border border-purple-500/20">
              {/* Dramatic purple background */}
              <div
                className="absolute inset-0"
                style={{
                  background: 'radial-gradient(ellipse at 60% 40%, rgba(147,51,234,0.15) 0%, rgba(109,40,217,0.08) 40%, transparent 80%)',
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-violet-500/5" />
              {/* Subtle particle dots */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: 'radial-gradient(circle, rgba(147,51,234,0.3) 1px, transparent 1px)',
                  backgroundSize: '40px 40px',
                }}
              />

              <div className="relative z-10 p-8 sm:p-12">
                {/* Header */}
                <div className="text-center mb-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-mono mb-4">
                    <Sparkles className="w-3 h-3" />
                    AI-POWERED BUILDER SUITE
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-300 via-violet-300 to-purple-400 bg-clip-text text-transparent">
                    The Sanctum
                  </h2>
                  <p className="text-text-secondary text-base mt-3 max-w-2xl mx-auto">
                    Vibe-code on NEAR with Claude Opus at your side. From quick questions to full contract builds — the Sanctum is your AI command center.
                  </p>
                </div>

                {/* 4 Mode Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 max-w-4xl mx-auto">
                  {[
                    {
                      icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>,
                      emoji: '💬',
                      title: 'Chat',
                      desc: 'Ask anything about NEAR. Get instant, sourced answers.',
                      color: 'purple',
                    },
                    {
                      icon: <Flame className="w-5 h-5" />,
                      emoji: '🔥',
                      title: 'Roast',
                      desc: 'Paste your contract. Get a brutally honest audit.',
                      color: 'red',
                    },
                    {
                      icon: <Palette className="w-5 h-5" />,
                      emoji: '🎨',
                      title: 'Visual Generator',
                      desc: 'Describe it. AI creates it. Logos, diagrams, mockups.',
                      color: 'pink',
                    },
                    {
                      icon: <Users className="w-5 h-5" />,
                      emoji: '👥',
                      title: 'Pair Programming',
                      desc: 'Build smart contracts with AI side-by-side.',
                      color: 'violet',
                    },
                  ].map((mode) => (
                    <div
                      key={mode.title}
                      className="group relative p-5 rounded-xl bg-surface/50 border border-purple-500/10 hover:border-purple-500/30 transition-all duration-300"
                    >
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500/0 to-purple-500/0 group-hover:from-purple-500/5 group-hover:to-violet-500/5 transition-all duration-300" />
                      <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">{mode.emoji}</span>
                          <h3 className="text-base font-semibold text-text-primary">{mode.title}</h3>
                        </div>
                        <p className="text-sm text-text-secondary">{mode.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="text-center">
                  <Link
                    href="/sanctum"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-lg text-base font-semibold bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300"
                  >
                    <Sparkles className="w-4 h-4" />
                    Enter the Sanctum
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                  <p className="text-xs text-text-muted font-mono mt-3">
                    Powered by Claude Opus · Credit-gated · Free to try
                  </p>
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 5: Observatory + Void Lens (NEW — compact two-card)
            ═══════════════════════════════════════════════════════════════ */}
        <ScrollReveal delay={0.12}>
          <section>
            <SectionHeader title="Intelligence Tools" badge="DEEP ANALYSIS" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Observatory Card */}
              <Link href="/observatory" className="group">
                <div className="relative p-6 rounded-xl border border-cyan-500/15 bg-surface/30 hover:border-cyan-500/40 transition-all duration-300 h-full">
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/5 group-hover:to-blue-500/5 transition-all duration-300" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                        <Telescope className="w-5 h-5 text-cyan-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-text-primary">Observatory</h3>
                      <ChevronRight className="w-4 h-4 text-text-muted ml-auto group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                    </div>
                    <p className="text-sm text-text-secondary">
                      Deep-dive any NEAR project. Health scores, team analysis, contract audits.
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {['Health Score', 'Team Intel', 'Contract Audit', 'Risk Analysis'].map((tag) => (
                        <span key={tag} className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400/70 border border-cyan-500/10">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>

              {/* Void Lens Card */}
              <Link href="/void-lens" className="group">
                <div className="relative p-6 rounded-xl border border-blue-500/15 bg-surface/30 hover:border-blue-500/40 transition-all duration-300 h-full">
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/0 to-indigo-500/0 group-hover:from-blue-500/5 group-hover:to-indigo-500/5 transition-all duration-300" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                        <Zap className="w-5 h-5 text-blue-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-text-primary">Void Lens</h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-near-green/10 text-near-green border border-near-green/20">FREE</span>
                      <ChevronRight className="w-4 h-4 text-text-muted ml-auto group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                    </div>
                    <p className="text-sm text-text-secondary">
                      AI-powered project analysis in 60 seconds. Instant insights, zero cost.
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {['60s Analysis', 'AI Summary', 'Opportunity Score', 'Free Forever'].map((tag) => (
                        <span key={tag} className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400/70 border border-blue-500/10">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </section>
        </ScrollReveal>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 6: Learn NEAR — Cinematic Education Section
            ═══════════════════════════════════════════════════════════════ */}
        <ScrollReveal delay={0.13}>
          <section>
            <div className="relative overflow-hidden rounded-2xl border border-near-green/20">
              {/* Background */}
              <div
                className="absolute inset-0"
                style={{
                  background: 'radial-gradient(ellipse at 30% 60%, rgba(0,236,151,0.1) 0%, rgba(0,212,255,0.06) 50%, transparent 80%)',
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-near-green/5 to-accent-cyan/3" />

              <div className="relative z-10 p-8 sm:p-12">
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-near-green/10 border border-near-green/20 text-near-green text-xs font-mono mb-4">
                    <BookOpen className="w-3 h-3" />
                    STRUCTURED LEARNING
                  </div>
                  <GradientText as="h2" className="text-2xl sm:text-3xl font-bold tracking-tight">
                    Learn NEAR Protocol
                  </GradientText>
                  <p className="text-text-secondary text-base mt-3 max-w-2xl mx-auto">
                    From zero to shipping on NEAR. Interactive modules, hands-on exercises, and AI-assisted learning across 4 tracks.
                  </p>
                </div>

                {/* Track cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 max-w-4xl mx-auto">
                  {[
                    { emoji: '🏗️', title: 'Builder Fundamentals', modules: '12 modules' },
                    { emoji: '📜', title: 'Smart Contracts', modules: '11 modules' },
                    { emoji: '🌐', title: 'Frontend & dApps', modules: '10 modules' },
                    { emoji: '🔬', title: 'Advanced Topics', modules: '10 modules' },
                  ].map((track) => (
                    <div key={track.title} className="text-center p-4 bg-surface/50 rounded-lg border border-border hover:border-near-green/20 transition-colors">
                      <div className="text-2xl mb-2">{track.emoji}</div>
                      <p className="text-sm font-medium text-text-primary">{track.title}</p>
                      <p className="text-xs font-mono text-text-muted mt-1">{track.modules}</p>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="text-center">
                  <Link
                    href="/learn"
                    className="shimmer-btn text-background font-semibold px-8 py-4 rounded-lg text-base inline-flex items-center gap-2 mb-3"
                  >
                    <BookOpen className="w-4 h-4" />
                    Start Learning →
                  </Link>
                  <p className="text-xs text-text-muted font-mono">
                    4 tracks · 43 modules · Free forever
                  </p>
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 7: Explore the Voids — Priority Voids + Voids For Every Builder (MOVED DOWN)
            ═══════════════════════════════════════════════════════════════ */}
        <ScrollReveal delay={0.14}>
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

        <ScrollReveal delay={0.15}>
          <section>
            <SectionHeader title="Pick your path" badge="FOR EVERY BUILDER" />
            <VoidsForEveryBuilder opportunities={opportunities} />
          </section>
        </ScrollReveal>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 8: Bottom CTA — Ready to Build (ENHANCED)
            ═══════════════════════════════════════════════════════════════ */}
        <ScrollReveal delay={0.16}>
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

              {/* Credibility badges */}
              <div className="mt-8 pt-6 border-t border-border/30">
                <p className="text-xs text-text-muted font-mono mb-3">
                  Powered by <span className="text-purple-400">Claude AI</span> · <span className="text-accent-cyan">DexScreener</span> · <span className="text-near-green">NEAR Protocol</span>
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-near-green/5 border border-near-green/15">
                  <span className="text-sm">🏆</span>
                  <span className="text-xs font-semibold text-near-green/80 tracking-wide">
                    Built for NEARCON 2026 Innovation Sandbox
                  </span>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </Container>
    </div>
  );
}
