'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  TrendingUp,
  ChevronRight,
  ChevronDown,
  BarChart3,
  Cpu,
  Shield,
  Coins,
  Calendar,
  Rocket,
} from 'lucide-react';
import { Card, Badge, InfoTooltip } from '@/components/ui';
import { GapScoreIndicator } from '@/components/opportunities/GapScoreIndicator';
import { AnimatedCounter } from '@/components/effects/AnimatedCounter';
import { GapScoreBreakdown } from '@/components/opportunities/GapScoreBreakdown';
import { VoidOpportunityPanel } from '@/components/opportunities/VoidOpportunityPanel';
import { CrossChainRivalry } from '@/components/opportunities/CrossChainRivalry';
import { SaveButton } from '@/components/opportunities/SaveButton';
import { ShareButton } from '@/components/opportunities/ShareButton';
import { VoidTimer } from '@/components/opportunities/VoidTimer';
import { BriefGenerator } from '@/components/brief/BriefGenerator';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { SectionHeader } from '@/components/effects/SectionHeader';
import { GlowCard } from '@/components/effects/GlowCard';
import { GridPattern } from '@/components/effects/GridPattern';
import { ScanLine } from '@/components/effects/ScanLine';
import { GradientText } from '@/components/effects/GradientText';
import { AnimatedBorderCard } from '@/components/effects/AnimatedBorderCard';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { COMPETITION_LABELS, DIFFICULTY_LABELS } from '@/lib/constants';
import { HELP_CONTENT } from '@/lib/help-content';
import { CompetitorList, getActivityStatus } from '@/components/opportunities/CompetitorList';
import type { Opportunity, Project, Category, GapScoreBreakdown as GapScoreBreakdownType } from '@/types';

interface OpportunityDetailProps {
  opportunity: Opportunity;
  relatedProjects: Project[];
  category: Category;
  breakdown?: GapScoreBreakdownType;
  competitors?: Project[];
}

// ── Brief teaser items (static, no API) ──────────────────────────────────────
const BRIEF_TEASER = [
  { icon: BarChart3, label: 'Market Analysis' },
  { icon: Cpu, label: 'Tech Architecture' },
  { icon: Shield, label: 'NEAR Strategy' },
  { icon: Coins, label: 'Monetization Plan' },
  { icon: Calendar, label: 'Week 1 Action Plan' },
  { icon: Rocket, label: 'Growth Roadmap' },
] as const;

// ── MVP estimates derived from difficulty ────────────────────────────────────
const mvpEstimates = {
  beginner: {
    time: '1–4 weeks',
    team: 'Solo builder',
    emoji: '🛠️',
    color: 'text-near-green',
    border: 'border-near-green/25',
    bg: 'bg-near-green/[0.06]',
  },
  intermediate: {
    time: '4–12 weeks',
    team: '2–3 people',
    emoji: '👥',
    color: 'text-cyan-400',
    border: 'border-cyan-400/25',
    bg: 'bg-cyan-400/[0.06]',
  },
  advanced: {
    time: '3–6 months',
    team: '3–5+ people',
    emoji: '🏗️',
    color: 'text-violet-400',
    border: 'border-violet-400/25',
    bg: 'bg-violet-400/[0.06]',
  },
} as const;

const competitionContext = {
  low: {
    label: 'First-mover opportunity',
    emoji: '🚀',
    color: 'text-near-green',
    border: 'border-near-green/25',
    bg: 'bg-near-green/[0.06]',
  },
  medium: {
    label: 'Room to compete',
    emoji: '⚡',
    color: 'text-amber-400',
    border: 'border-amber-400/25',
    bg: 'bg-amber-400/[0.06]',
  },
  high: {
    label: 'Competitive space',
    emoji: '🥊',
    color: 'text-rose-400',
    border: 'border-rose-400/25',
    bg: 'bg-rose-400/[0.06]',
  },
} as const;

export function OpportunityDetail({ opportunity, relatedProjects, category, breakdown, competitors }: OpportunityDetailProps) {
  const [showInactive, setShowInactive] = useState(false);
  const allProjects = competitors ?? relatedProjects;
  const activeCompetitors = allProjects.filter((p) => {
    const status = getActivityStatus(p.last_github_commit);
    return status === 'active' || status === 'stale';
  });
  const inactiveCompetitors = allProjects.filter((p) => {
    const status = getActivityStatus(p.last_github_commit);
    return status === 'abandoned';
  });

  // ── Quick Orientation derived values ──────────────────────────────────────
  const mvp = mvpEstimates[opportunity.difficulty] ?? mvpEstimates.intermediate;
  const comp = competitionContext[opportunity.competition_level] ?? competitionContext.medium;
  const grantPotential =
    opportunity.gap_score >= 80 ? '$25K–$50K+' : opportunity.gap_score >= 60 ? '$10K–$25K' : '$5K–$10K';

  const activeBuilderCount = opportunity.active_project_count ?? activeCompetitors.length;

  // ── Suggested features split ───────────────────────────────────────────────
  const features = opportunity.suggested_features ?? [];
  const coreFeatures = features.slice(0, 3);
  const extendedFeatures = features.slice(3);

  return (
    <motion.div
      className="space-y-6 sm:space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="overflow-x-auto scrollbar-none -mx-1 px-1">
        <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm whitespace-nowrap">
          <Link href="/" className="text-text-muted hover:text-text-primary transition-colors min-h-[44px] sm:min-h-0 flex items-center active:scale-95 touch-manipulation">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-text-muted shrink-0" />
          <Link href="/opportunities" className="text-text-muted hover:text-text-primary transition-colors min-h-[44px] sm:min-h-0 flex items-center active:scale-95 touch-manipulation">
            Voids
          </Link>
          <ChevronRight className="w-3 h-3 text-text-muted shrink-0" />
          <Link
            href={`/opportunities?category=${category.slug}`}
            className="text-text-muted hover:text-text-primary transition-colors min-h-[44px] sm:min-h-0 flex items-center active:scale-95 touch-manipulation"
          >
            {category.name}
          </Link>
          <ChevronRight className="w-3 h-3 text-text-muted shrink-0" />
          <span className="text-text-primary truncate max-w-[150px] sm:max-w-[300px]">
            {opportunity.title}
          </span>
        </div>
      </nav>

      {/* ── 1. Header Banner (unchanged) ─────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-xl">
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at center, rgba(0,236,151,0.06) 0%, transparent 70%)' }}
        />
        <GridPattern className="opacity-20" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, transparent 40%, #0a0a0a 100%)' }}
        />
        <div className="relative z-10 p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-start gap-4 sm:gap-6">
            <div className="flex-1 space-y-2 sm:space-y-3">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <Badge variant="default">{category.name}</Badge>
                <span className="flex items-center">
                  <Badge variant="difficulty" difficulty={opportunity.difficulty}>
                    {DIFFICULTY_LABELS[opportunity.difficulty] || opportunity.difficulty}
                  </Badge>
                  <InfoTooltip term={HELP_CONTENT.difficulty.term}>
                    <p>{HELP_CONTENT.difficulty.description}</p>
                  </InfoTooltip>
                </span>
                <span className="flex items-center">
                  <Badge variant="competition" competition={opportunity.competition_level}>
                    {COMPETITION_LABELS[opportunity.competition_level] || opportunity.competition_level}
                  </Badge>
                  <InfoTooltip term={HELP_CONTENT.competitionLevel.term}>
                    <p>{HELP_CONTENT.competitionLevel.description}</p>
                  </InfoTooltip>
                </span>
                <VoidTimer createdAt={opportunity.created_at} size="md" />
              </div>
              <GradientText as="h1" className="text-xl sm:text-2xl font-bold">
                {opportunity.title}
              </GradientText>
              {opportunity.description && (
                <p className="text-sm sm:text-base text-text-secondary">{opportunity.description}</p>
              )}
            </div>

            <div className="flex items-start gap-3 shrink-0">
              <GapScoreIndicator score={opportunity.gap_score} size="lg" showLabel />
              <div className="flex items-center gap-1">
                <SaveButton opportunityId={opportunity.id} />
                <ShareButton
                  opportunityId={opportunity.id}
                  title={opportunity.title}
                  gapScore={opportunity.gap_score}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Quick Orientation Strip ───────────────────────────────────────── */}
      <ScrollReveal delay={0.03}>
        <div className="overflow-x-auto scrollbar-none -mx-1 px-1">
          <div className="flex gap-3 min-w-max pb-1">
            {/* MVP Time */}
            <div className={`rounded-xl border ${mvp.border} ${mvp.bg} px-4 py-3 flex flex-col gap-0.5 min-w-[130px]`}>
              <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-text-muted">MVP Time</span>
              <div className="flex items-center gap-1.5">
                <span className="text-base">{mvp.emoji}</span>
                <span className={`text-sm font-bold ${mvp.color}`}>{mvp.time}</span>
              </div>
            </div>

            {/* Team Size */}
            <div className={`rounded-xl border ${mvp.border} ${mvp.bg} px-4 py-3 flex flex-col gap-0.5 min-w-[130px]`}>
              <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-text-muted">Team Size</span>
              <div className="flex items-center gap-1.5">
                <span className="text-base">👤</span>
                <span className={`text-sm font-bold ${mvp.color}`}>{mvp.team}</span>
              </div>
            </div>

            {/* Competition Context */}
            <div className={`rounded-xl border ${comp.border} ${comp.bg} px-4 py-3 flex flex-col gap-0.5 min-w-[160px]`}>
              <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-text-muted">Competition</span>
              <div className="flex items-center gap-1.5">
                <span className="text-base">{comp.emoji}</span>
                <span className={`text-sm font-bold ${comp.color}`}>{comp.label}</span>
              </div>
            </div>

            {/* Grant Potential */}
            <div className="rounded-xl border border-near-green/25 bg-near-green/[0.06] px-4 py-3 flex flex-col gap-0.5 min-w-[140px]">
              <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-text-muted">Grant Potential</span>
              <div className="flex items-center gap-1.5">
                <span className="text-base">💰</span>
                <span className="text-sm font-bold text-near-green">{grantPotential}</span>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* ── 3. Why This Void Exists ──────────────────────────────────────────── */}
      {opportunity.reasoning && (
        <ScrollReveal delay={0.06}>
          <SectionHeader title="Why This Void Exists" badge="AI ANALYZED" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left: reasoning quote card */}
            <div className="lg:col-span-2 rounded-xl border border-near-green/20 bg-near-green/[0.03] pl-4 pr-4 py-4 border-l-4 border-l-near-green/60 relative overflow-hidden">
              <ScanLine />
              <p className="relative z-10 text-sm sm:text-base text-text-secondary leading-relaxed italic">
                {opportunity.reasoning}
              </p>
            </div>

            {/* Right: Evidence Summary */}
            <div className="flex flex-col gap-3">
              <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-text-muted">Evidence Summary</p>

              {/* Active builders */}
              <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 flex items-center justify-between">
                <span className="text-xs text-text-muted">Active builders</span>
                <span className="text-base font-bold font-mono text-near-green">{activeBuilderCount}</span>
              </div>

              {/* Gap Score */}
              <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 flex items-center justify-between">
                <span className="text-xs text-text-muted">Gap Score</span>
                <span className="text-base font-bold font-mono text-near-green">{opportunity.gap_score}<span className="text-xs text-text-muted font-normal">/100</span></span>
              </div>

              {/* Signal Strength */}
              {opportunity.demand_score != null && (
                <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 flex items-center justify-between">
                  <span className="text-xs text-text-muted">Signal Strength</span>
                  <span className="text-base font-bold font-mono text-cyan-400">
                    <AnimatedCounter value={Math.round(opportunity.demand_score)} className="text-base font-bold font-mono text-cyan-400" />
                  </span>
                </div>
              )}
            </div>
          </div>
        </ScrollReveal>
      )}

      {/* ── 4. Opportunity Panel ─────────────────────────────────────────────── */}
      <ScrollReveal delay={0.09}>
        <VoidOpportunityPanel
          opportunity={opportunity}
          category={category}
          breakdown={breakdown}
          activeBuilderCount={activeBuilderCount}
        />
      </ScrollReveal>

      {/* ── 5. Void Analysis (GapScoreBreakdown) ─────────────────────────────── */}
      <ScrollReveal delay={0.09}>
        <SectionHeader title="Void Analysis" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <Card variant="glass" padding="lg" className="relative overflow-hidden">
            <ScanLine />
            <div className="relative z-10 space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-xs text-text-muted uppercase tracking-wide font-mono flex items-center">
                    Void Score
                    <InfoTooltip term={HELP_CONTENT.gapScore.term}>
                      <p>{HELP_CONTENT.gapScore.description}</p>
                    </InfoTooltip>
                  </p>
                  <GapScoreIndicator score={opportunity.gap_score} size="lg" showLabel />
                </div>
                {opportunity.demand_score != null && (
                  <div>
                    <p className="text-xs text-text-muted uppercase tracking-wide font-mono flex items-center">
                      Signal Strength
                      <InfoTooltip term={HELP_CONTENT.demandScore.term}>
                        <p>{HELP_CONTENT.demandScore.description}</p>
                      </InfoTooltip>
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-text-primary font-mono flex items-center gap-2 mt-1">
                      <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-near-green" />
                      <AnimatedCounter value={Math.round(opportunity.demand_score)} className="text-2xl sm:text-3xl font-bold text-text-primary" />
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Card>
          {breakdown && <GapScoreBreakdown breakdown={breakdown} />}
        </div>
      </ScrollReveal>

      {/* ── 5. Suggested Features ("What You'd Build") ───────────────────────── */}
      {features.length > 0 && (
        <ScrollReveal delay={0.12}>
          <SectionHeader title="What You'd Build" count={features.length} />
          <div className="space-y-4">
            {/* Core Build */}
            {coreFeatures.length > 0 && (
              <div>
                <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-near-green mb-2">
                  ● Core Build
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {coreFeatures.map((feature, index) => (
                    <GlowCard key={index} padding="sm">
                      <div className="flex items-start gap-2">
                        <span className="text-[10px] font-mono text-near-green/60 mt-0.5 shrink-0 w-4">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <div>
                          <CheckCircle2 className="w-3.5 h-3.5 text-near-green mb-1" />
                          <span className="text-xs sm:text-sm font-semibold text-text-primary leading-snug">{feature}</span>
                        </div>
                      </div>
                    </GlowCard>
                  ))}
                </div>
              </div>
            )}

            {/* Extended Vision */}
            {extendedFeatures.length > 0 && (
              <div>
                <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-cyan-400 mb-2">
                  ◎ Extended Vision
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {extendedFeatures.map((feature, index) => (
                    <GlowCard key={index} padding="sm">
                      <div className="flex items-start gap-2">
                        <span className="text-[10px] font-mono text-cyan-400/60 mt-0.5 shrink-0 w-4">
                          {String(coreFeatures.length + index + 1).padStart(2, '0')}
                        </span>
                        <div>
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 mb-1" />
                          <span className="text-xs sm:text-sm font-semibold text-text-primary leading-snug">{feature}</span>
                        </div>
                      </div>
                    </GlowCard>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollReveal>
      )}

      {/* ── 6. Cross-Chain Competition ───────────────────────────────────────── */}
      <ScrollReveal delay={0.15}>
        <CrossChainRivalry
          categorySlug={category.slug}
          nearProjectCount={relatedProjects.length}
        />
      </ScrollReveal>

      {/* ── 7. Void Brief CTA with teaser ────────────────────────────────────── */}
      <ScrollReveal delay={0.18}>
        <div className="flex items-center gap-1" data-brief-section>
          <SectionHeader title="Your Builder Blueprint" badge="POWERED BY CLAUDE AI" />
          <InfoTooltip term={HELP_CONTENT.aiBrief.term}>
            <p>{HELP_CONTENT.aiBrief.description}</p>
          </InfoTooltip>
        </div>

        {/* Teaser strip */}
        <div className="mb-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 space-y-3">
          <p className="text-xs text-text-muted text-center font-mono tracking-wide">
            Your complete blueprint — one click away
          </p>
          <div className="grid grid-cols-3 gap-2">
            {BRIEF_TEASER.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-black/20 px-3 py-2"
              >
                <Icon className="w-3.5 h-3.5 text-near-green shrink-0" />
                <span className="text-[11px] text-text-primary font-medium truncate">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <AnimatedBorderCard padding="none">
          <BriefGenerator opportunityId={opportunity.id} />
        </AnimatedBorderCard>
      </ScrollReveal>

      {/* ── 8. Competition Analysis ───────────────────────────────────────────── */}
      <ScrollReveal delay={0.21}>
        <SectionHeader title="Competition Analysis" count={allProjects.length} />
        <Card variant="glass" padding="lg" className="relative overflow-hidden">
          <ScanLine />
          <div className="relative z-10">
            {allProjects.length > 0 ? (
              <div className="space-y-4">
                {/* Summary stats */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-text-muted">
                  <span>{activeCompetitors.length} active / {inactiveCompetitors.length} inactive of {allProjects.length}</span>
                  <span className="hidden sm:inline text-text-muted/50">|</span>
                  <span>{formatCurrency(allProjects.reduce((s, p) => s + (Number(p.tvl_usd) || 0), 0))} TVL</span>
                  <span className="hidden sm:inline text-text-muted/50">|</span>
                  <span>{formatNumber(allProjects.reduce((s, p) => s + (p.github_stars || 0), 0))} stars</span>
                </div>

                {/* Active Competitors */}
                {activeCompetitors.length > 0 && (
                  <div>
                    <h4 className="text-xs uppercase tracking-wide text-text-muted font-mono mb-2">Active Competitors</h4>
                    <CompetitorList projects={activeCompetitors} />
                  </div>
                )}

                {/* Inactive/Abandoned */}
                {inactiveCompetitors.length > 0 && (
                  <div>
                    <button
                      onClick={() => setShowInactive(!showInactive)}
                      className="flex items-center gap-1 text-xs uppercase tracking-wide text-text-muted font-mono mb-2 hover:text-text-secondary transition-colors min-h-[44px] active:scale-95 touch-manipulation"
                    >
                      <ChevronDown className={`w-3 h-3 transition-transform ${showInactive ? 'rotate-0' : '-rotate-90'}`} />
                      Inactive / Abandoned ({inactiveCompetitors.length})
                    </button>
                    {showInactive && <CompetitorList projects={inactiveCompetitors} />}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-text-muted">
                No competing projects found in this category — this void is wide open.
              </p>
            )}
          </div>
        </Card>
      </ScrollReveal>
    </motion.div>
  );
}
