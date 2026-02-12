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
                    VIBE-CODE ON NEAR
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-300 via-violet-300 to-purple-400 bg-clip-text text-transparent">
                    The Sanctum
                  </h2>
                  <p className="text-text-secondary text-lg mt-3 max-w-2xl mx-auto leading-relaxed">
                    AI-powered development studio for NEAR Protocol.<br />
                    <span className="text-accent-green font-medium">Contracts, webapps, deployment</span> — all through conversation.
                  </p>
                </div>

                {/* Two Focus Areas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 max-w-4xl mx-auto">
                  {/* Build */}
                  <div className="group relative p-6 rounded-xl bg-surface/50 border border-accent-green/20 hover:border-accent-green/40 transition-all duration-300">
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-accent-green/0 to-accent-green/0 group-hover:from-accent-green/5 group-hover:to-emerald-500/5 transition-all duration-300" />
                    <div className="relative z-10">
                      <div className="w-10 h-10 rounded-lg bg-accent-green/10 border border-accent-green/20 flex items-center justify-center mb-4">
                        <svg className="w-5 h-5 text-accent-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                      </div>
                      <h3 className="text-lg font-semibold text-text-primary mb-2">Build NEAR Projects</h3>
                      <p className="text-sm text-text-secondary leading-relaxed mb-4">
                        Describe what you want to build. AI walks you through creating Rust smart contracts and web frontends — step by step, from idea to deployment.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {['Smart Contracts', 'Web Apps', 'Code Audit', 'Deploy'].map((tag) => (
                          <span key={tag} className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent-green/10 text-accent-green/80 border border-accent-green/10">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Learn */}
                  <div className="group relative p-6 rounded-xl bg-surface/50 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500/0 to-purple-500/0 group-hover:from-purple-500/5 group-hover:to-violet-500/5 transition-all duration-300" />
                    <div className="relative z-10">
                      <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4">
                        <BookOpen className="w-5 h-5 text-purple-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-text-primary mb-2">Learn Rust as You Build</h3>
                      <p className="text-sm text-text-secondary leading-relaxed mb-4">
                        No Rust experience? No problem. The AI teaches you as you create — explaining every line, every pattern, every NEAR concept in real time.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {['Rust', 'NEAR SDK', 'Testing', 'Best Practices'].map((tag) => (
                          <span key={tag} className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-400/80 border border-purple-500/10">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* How it works */}
                <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 mb-10 text-sm text-text-muted">
                  {[
                    { step: '1', text: 'Describe your idea' },
                    { step: '2', text: 'AI builds with you' },
                    { step: '3', text: 'Learn as you create' },
                    { step: '4', text: 'Deploy to NEAR' },
                  ].map((item) => (
                    <div key={item.step} className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-mono flex items-center justify-center">{item.step}</span>
                      <span>{item.text}</span>
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
                    Start Building
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                  <p className="text-xs text-text-muted font-mono mt-3">
                    Powered by Claude Opus · $2.50 free credits to start · No Rust experience needed
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

              {/* Pulse Streams Card */}
              <Link href="/pulse-streams" className="group">
                <div className="relative p-6 rounded-xl border border-emerald-500/15 bg-surface/30 hover:border-emerald-500/40 transition-all duration-300 h-full">
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-500/0 to-teal-500/0 group-hover:from-emerald-500/5 group-hover:to-teal-500/5 transition-all duration-300" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                        <svg className="w-5 h-5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                      </div>
                      <h3 className="text-lg font-semibold text-text-primary">Pulse Streams</h3>
                      <ChevronRight className="w-4 h-4 text-text-muted ml-auto group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                    </div>
                    <p className="text-sm text-text-secondary">
                      Real-time NEAR ecosystem activity. Track transactions, contracts, and network health live.
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {['Live Feed', 'Transactions', 'Network Health', 'Real-Time'].map((tag) => (
                        <span key={tag} className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400/70 border border-emerald-500/10">
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
                <div className="text-center mb-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-near-green/10 border border-near-green/20 text-near-green text-xs font-mono mb-4">
                    <BookOpen className="w-3 h-3" />
                    THE MOST COMPREHENSIVE NEAR CURRICULUM — FREE
                  </div>
                  <GradientText as="h2" className="text-3xl sm:text-4xl font-bold tracking-tight">
                    Master NEAR Development
                  </GradientText>
                  <p className="text-text-secondary text-lg mt-4 max-w-2xl mx-auto leading-relaxed">
                    43 interactive modules across 4 structured tracks. From your first Rust line to deploying production dApps — with AI guidance at every step.
                  </p>
                </div>

                {/* Track cards — detailed */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 max-w-4xl mx-auto">
                  {[
                    {
                      emoji: '🧭',
                      title: 'Explorer',
                      modules: 11,
                      desc: 'Wallet setup, key concepts, ecosystem overview',
                      color: 'emerald',
                      borderClass: 'border-emerald-500/15 hover:border-emerald-500/30',
                      bgClass: 'bg-emerald-500/10',
                      textClass: 'text-emerald-400',
                      tagClass: 'bg-emerald-500/10 text-emerald-400/70 border-emerald-500/10',
                    },
                    {
                      emoji: '🏗️',
                      title: 'Builder',
                      modules: 16,
                      desc: 'Rust fundamentals, smart contracts, testing, deployment',
                      color: 'cyan',
                      borderClass: 'border-cyan-500/15 hover:border-cyan-500/30',
                      bgClass: 'bg-cyan-500/10',
                      textClass: 'text-cyan-400',
                      tagClass: 'bg-cyan-500/10 text-cyan-400/70 border-cyan-500/10',
                    },
                    {
                      emoji: '⚡',
                      title: 'Hacker',
                      modules: 11,
                      desc: 'Cross-chain patterns, security auditing, DeFi architecture',
                      color: 'purple',
                      borderClass: 'border-purple-500/15 hover:border-purple-500/30',
                      bgClass: 'bg-purple-500/10',
                      textClass: 'text-purple-400',
                      tagClass: 'bg-purple-500/10 text-purple-400/70 border-purple-500/10',
                    },
                    {
                      emoji: '🚀',
                      title: 'Founder',
                      modules: 5,
                      desc: 'Tokenomics, DAO governance, go-to-market strategy',
                      color: 'amber',
                      borderClass: 'border-amber-500/15 hover:border-amber-500/30',
                      bgClass: 'bg-amber-500/10',
                      textClass: 'text-amber-400',
                      tagClass: 'bg-amber-500/10 text-amber-400/70 border-amber-500/10',
                    },
                  ].map((track) => (
                    <div key={track.title} className={`group p-5 bg-surface/50 rounded-xl border ${track.borderClass} transition-all duration-300`}>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{track.emoji}</span>
                        <div>
                          <h3 className="text-base font-semibold text-text-primary">{track.title} Track</h3>
                          <span className={`text-[10px] font-mono ${track.textClass}`}>{track.modules} modules</span>
                        </div>
                      </div>
                      <p className="text-sm text-text-secondary">{track.desc}</p>
                    </div>
                  ))}
                </div>

                {/* Differentiators */}
                <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 mb-8 max-w-3xl mx-auto">
                  {[
                    { icon: '🤖', text: 'AI explains every concept' },
                    { icon: '🔨', text: 'Build real projects, not toy examples' },
                    { icon: '🎯', text: 'Skill constellation tracks progress' },
                    { icon: '📜', text: 'Earn completion certificates' },
                    { icon: '🌉', text: 'Cross-chain deep dives (Solana, ETH)' },
                    { icon: '💰', text: '100% free, forever' },
                  ].map((item) => (
                    <div key={item.text} className="flex items-center gap-2 text-sm text-text-secondary">
                      <span>{item.icon}</span>
                      <span>{item.text}</span>
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
                    Start Your Journey →
                  </Link>
                  <p className="text-xs text-text-muted font-mono">
                    No prerequisites · No paywall · No time limit
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
