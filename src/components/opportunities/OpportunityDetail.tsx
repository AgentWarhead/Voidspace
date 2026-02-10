'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ExternalLink, CheckCircle2, TrendingUp, Star, GitFork, Code, Clock, Sparkles, ChevronRight } from 'lucide-react';
import { Card, Badge, InfoTooltip } from '@/components/ui';
import { GapScoreIndicator } from '@/components/opportunities/GapScoreIndicator';
import { AnimatedCounter } from '@/components/effects/AnimatedCounter';
import { GapScoreBreakdown } from '@/components/opportunities/GapScoreBreakdown';
import { SaveButton } from '@/components/opportunities/SaveButton';
import { BriefGenerator } from '@/components/brief/BriefGenerator';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { SectionHeader } from '@/components/effects/SectionHeader';
import { GlowCard } from '@/components/effects/GlowCard';
import { GridPattern } from '@/components/effects/GridPattern';
import { ScanLine } from '@/components/effects/ScanLine';
import { GradientText } from '@/components/effects/GradientText';
import { AnimatedBorderCard } from '@/components/effects/AnimatedBorderCard';
import { formatCurrency, formatNumber, timeAgo } from '@/lib/utils';
import { COMPETITION_LABELS, DIFFICULTY_LABELS } from '@/lib/constants';
import { HELP_CONTENT } from '@/lib/help-content';
import type { Opportunity, Project, Category, GapScoreBreakdown as GapScoreBreakdownType } from '@/types';

interface OpportunityDetailProps {
  opportunity: Opportunity;
  relatedProjects: Project[];
  category: Category;
  breakdown?: GapScoreBreakdownType;
}

export function OpportunityDetail({ opportunity, relatedProjects, category, breakdown }: OpportunityDetailProps) {
  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb">
        <div className="flex items-center gap-2 text-sm">
          <Link
            href="/"
            className="text-text-muted hover:text-text-primary transition-colors"
          >
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-text-muted" />
          <Link
            href="/opportunities"
            className="text-text-muted hover:text-text-primary transition-colors"
          >
            Voids
          </Link>
          <ChevronRight className="w-3 h-3 text-text-muted" />
          <Link
            href={`/opportunities?category=${category.slug}`}
            className="text-text-muted hover:text-text-primary transition-colors"
          >
            {category.name}
          </Link>
          <ChevronRight className="w-3 h-3 text-text-muted" />
          <span className="text-text-primary">
            {opportunity.title.length > 40 
              ? `${opportunity.title.substring(0, 40)}...` 
              : opportunity.title
            }
          </span>
        </div>
      </nav>

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-xl">
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(0,236,151,0.06) 0%, transparent 70%)',
          }}
        />
        <GridPattern className="opacity-20" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 40%, #0a0a0a 100%)',
          }}
        />
        <div className="relative z-10 p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-start gap-6">
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
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
              </div>
              <GradientText as="h1" className="text-2xl font-bold">
                {opportunity.title}
              </GradientText>
              {opportunity.description && (
                <p className="text-text-secondary">{opportunity.description}</p>
              )}
            </div>

            <div className="flex items-start gap-3 shrink-0">
              <GapScoreIndicator score={opportunity.gap_score} size="lg" showLabel />
              <SaveButton opportunityId={opportunity.id} />
            </div>
          </div>
        </div>
      </div>

      {/* Generate My Build Plan CTA */}
      <ScrollReveal>
        <div className="text-center">
          <motion.button
            onClick={() => {
              const briefSection = document.querySelector('[data-brief-section]');
              if (briefSection) {
                briefSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-near-green to-near-green/80 rounded-xl text-background font-bold text-lg shadow-lg shadow-near-green/25 hover:shadow-near-green/40 transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            animate={{
              boxShadow: [
                "0 10px 25px rgba(0, 236, 151, 0.25)",
                "0 10px 35px rgba(0, 236, 151, 0.35)",
                "0 10px 25px rgba(0, 236, 151, 0.25)"
              ]
            }}
            transition={{
              boxShadow: {
                repeat: Infinity,
                duration: 2,
                ease: "easeInOut"
              }
            }}
          >
            <Sparkles className="w-6 h-6" />
            Generate My Build Plan
            <motion.div
              className="absolute inset-0 bg-white/20 rounded-xl"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: [0, 0.3, 0], scale: [0.8, 1.1, 1.2] }}
              transition={{
                repeat: Infinity,
                duration: 3,
                ease: "easeInOut"
              }}
            />
          </motion.button>
          <p className="text-xs text-text-muted mt-3 flex items-center justify-center gap-1">
            <span className="w-1 h-1 bg-near-green rounded-full animate-pulse"></span>
            AI-powered
            <span className="text-text-muted/50">•</span>
            Takes ~60 seconds
            <span className="text-text-muted/50">•</span>
            Personalized to this void
          </p>
        </div>
      </ScrollReveal>

      {/* Void Brief — PROMOTED to 2nd position */}
      <ScrollReveal>
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

      {/* Void Analysis */}
      <ScrollReveal delay={0.05}>
        <SectionHeader title="Void Analysis" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card variant="glass" padding="lg" className="relative overflow-hidden">
            <ScanLine />
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
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
                    <p className="text-3xl font-bold text-text-primary font-mono flex items-center gap-2 mt-1">
                      <TrendingUp className="w-5 h-5 text-near-green" />
                      <AnimatedCounter value={Math.round(opportunity.demand_score)} className="text-3xl font-bold text-text-primary" />
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Card>
          {breakdown && <GapScoreBreakdown breakdown={breakdown} />}
        </div>
      </ScrollReveal>

      {/* Reasoning */}
      {opportunity.reasoning && (
        <ScrollReveal delay={0.1}>
          <SectionHeader title="Why This Void Exists" badge="AI ANALYZED" />
          <Card variant="glass" padding="lg">
            <p className="text-text-secondary leading-relaxed">{opportunity.reasoning}</p>
          </Card>
        </ScrollReveal>
      )}

      {/* Suggested Features */}
      {opportunity.suggested_features && opportunity.suggested_features.length > 0 && (
        <ScrollReveal delay={0.15}>
          <SectionHeader title="Suggested Features" count={opportunity.suggested_features.length} />
          <Card variant="glass" padding="lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {opportunity.suggested_features.map((feature, index) => (
                <GlowCard key={index} padding="sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-near-green mt-0.5 shrink-0" />
                    <span className="text-sm text-text-primary">{feature}</span>
                  </div>
                </GlowCard>
              ))}
            </div>
          </Card>
        </ScrollReveal>
      )}

      {/* Competition Analysis */}
      <ScrollReveal delay={0.2}>
        <SectionHeader title="Competition Analysis" count={relatedProjects.length} />
        <Card variant="glass" padding="lg" className="relative overflow-hidden">
          <ScanLine />
          <div className="relative z-10">
            {relatedProjects.length > 0 ? (
              <div className="space-y-4">
                {/* Summary row */}
                <div className="flex items-center gap-4 flex-wrap text-sm text-text-muted">
                  <span>{relatedProjects.length} {relatedProjects.length === 1 ? 'project' : 'projects'}</span>
                  <span className="text-text-muted/50">|</span>
                  <span>{relatedProjects.filter((p) => p.is_active).length} active</span>
                  <span className="text-text-muted/50">|</span>
                  <span>{formatCurrency(relatedProjects.reduce((s, p) => s + (Number(p.tvl_usd) || 0), 0))} TVL</span>
                  <span className="text-text-muted/50">|</span>
                  <span>{formatNumber(relatedProjects.reduce((s, p) => s + (p.github_stars || 0), 0))} stars</span>
                </div>
                <div className="divide-y divide-border rounded-lg border border-border overflow-hidden">
                  {relatedProjects.map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center gap-4 px-4 py-3 border-l-2 border-transparent hover:border-near-green/50 hover:bg-surface-hover transition-colors"
                    >
                      <Link href={`/projects/${project.slug}`} className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate hover:text-near-green transition-colors">{project.name}</p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          {project.github_stars > 0 && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] text-text-muted font-mono">
                              <Star className="w-2.5 h-2.5 text-warning" /> {formatNumber(project.github_stars)}
                            </span>
                          )}
                          {project.github_forks > 0 && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] text-text-muted font-mono">
                              <GitFork className="w-2.5 h-2.5" /> {formatNumber(project.github_forks)}
                            </span>
                          )}
                          {project.github_language && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] text-text-muted">
                              <Code className="w-2.5 h-2.5" /> {project.github_language}
                            </span>
                          )}
                          {project.last_github_commit && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] text-text-muted">
                              <Clock className="w-2.5 h-2.5" /> {timeAgo(project.last_github_commit)}
                            </span>
                          )}
                        </div>
                      </Link>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-medium text-text-primary font-mono">
                          {Number(project.tvl_usd) > 0 ? formatCurrency(Number(project.tvl_usd)) : '-'}
                        </p>
                      </div>
                      {project.website_url && (
                        <a
                          href={project.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-text-muted hover:text-near-green transition-colors shrink-0"
                          aria-label={`Visit ${project.name} website`}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
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
