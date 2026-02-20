'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle2, TrendingUp, ChevronRight, ChevronDown } from 'lucide-react';
import { Card, Badge, InfoTooltip } from '@/components/ui';
import { GapScoreIndicator } from '@/components/opportunities/GapScoreIndicator';
import { AnimatedCounter } from '@/components/effects/AnimatedCounter';
import { GapScoreBreakdown } from '@/components/opportunities/GapScoreBreakdown';
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
import { VoidInsightPanel } from '@/components/opportunities/VoidInsightPanel';
import type { Opportunity, Project, Category, GapScoreBreakdown as GapScoreBreakdownType } from '@/types';

interface OpportunityDetailProps {
  opportunity: Opportunity;
  relatedProjects: Project[];
  category: Category;
  breakdown?: GapScoreBreakdownType;
  competitors?: Project[];
}

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

  return (
    <motion.div
      className="space-y-6 sm:space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Breadcrumbs — truncated on mobile */}
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

      {/* Header Banner */}
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

      {/* AI Void Intelligence Panel */}
      <ScrollReveal delay={0.03}>
        <VoidInsightPanel
          opportunityId={opportunity.id}
          opportunityTitle={opportunity.title}
        />
      </ScrollReveal>

      {/* Void Analysis */}
      <ScrollReveal delay={0.05}>
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

      {/* Cross-Chain Competition */}
      <ScrollReveal delay={0.08}>
        <CrossChainRivalry
          categorySlug={category.slug}
          nearProjectCount={relatedProjects.length}
        />
      </ScrollReveal>

      {/* Reasoning */}
      {opportunity.reasoning && (
        <ScrollReveal delay={0.1}>
          <SectionHeader title="Why This Void Exists" badge="AI ANALYZED" />
          <Card variant="glass" padding="lg">
            <p className="text-sm sm:text-base text-text-secondary leading-relaxed">{opportunity.reasoning}</p>
          </Card>
        </ScrollReveal>
      )}

      {/* Suggested Features */}
      {opportunity.suggested_features && opportunity.suggested_features.length > 0 && (
        <ScrollReveal delay={0.15}>
          <SectionHeader title="Suggested Features" count={opportunity.suggested_features.length} />
          <Card variant="glass" padding="lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              {opportunity.suggested_features.map((feature, index) => (
                <GlowCard key={index} padding="sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-near-green mt-0.5 shrink-0" />
                    <span className="text-xs sm:text-sm text-text-primary">{feature}</span>
                  </div>
                </GlowCard>
              ))}
            </div>
          </Card>
        </ScrollReveal>
      )}

      {/* Void Brief */}
      <ScrollReveal delay={0.18}>
        <div className="flex items-center gap-1" data-brief-section>
          <SectionHeader title="Void Brief" badge="POWERED BY CLAUDE AI" />
          <InfoTooltip term={HELP_CONTENT.aiBrief.term}>
            <p>{HELP_CONTENT.aiBrief.description}</p>
          </InfoTooltip>
        </div>
        <AnimatedBorderCard padding="none">
          <BriefGenerator opportunityId={opportunity.id} />
        </AnimatedBorderCard>
      </ScrollReveal>

      {/* Competition Analysis */}
      <ScrollReveal delay={0.2}>
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
