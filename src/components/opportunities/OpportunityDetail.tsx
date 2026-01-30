'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, CheckCircle2 } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { GapScoreIndicator } from '@/components/opportunities/GapScoreIndicator';
import { SaveButton } from '@/components/opportunities/SaveButton';
import { BriefGenerator } from '@/components/brief/BriefGenerator';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { SectionHeader } from '@/components/effects/SectionHeader';
import { GlowCard } from '@/components/effects/GlowCard';
import { GridPattern } from '@/components/effects/GridPattern';
import { ScanLine } from '@/components/effects/ScanLine';
import { AnimatedBorderCard } from '@/components/effects/AnimatedBorderCard';
import { formatCurrency } from '@/lib/utils';
import { COMPETITION_LABELS, DIFFICULTY_LABELS } from '@/lib/constants';
import type { Opportunity, Project, Category } from '@/types';

interface OpportunityDetailProps {
  opportunity: Opportunity;
  relatedProjects: Project[];
  category: Category;
}

export function OpportunityDetail({ opportunity, relatedProjects, category }: OpportunityDetailProps) {
  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Back link */}
      <Link
        href="/opportunities"
        className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-text-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Opportunities
      </Link>

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
                <Badge variant="difficulty" difficulty={opportunity.difficulty}>
                  {DIFFICULTY_LABELS[opportunity.difficulty] || opportunity.difficulty}
                </Badge>
                <Badge variant="competition" competition={opportunity.competition_level}>
                  {COMPETITION_LABELS[opportunity.competition_level] || opportunity.competition_level}
                </Badge>
              </div>
              <h1 className="text-2xl font-bold text-text-primary">
                {opportunity.title}
              </h1>
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

      {/* Reasoning */}
      {opportunity.reasoning && (
        <ScrollReveal>
          <SectionHeader title="Why This Gap Exists" badge="AI ANALYZED" />
          <Card variant="glass" padding="lg">
            <p className="text-text-secondary leading-relaxed">{opportunity.reasoning}</p>
          </Card>
        </ScrollReveal>
      )}

      {/* Suggested Features */}
      {opportunity.suggested_features && opportunity.suggested_features.length > 0 && (
        <ScrollReveal delay={0.1}>
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
      <ScrollReveal delay={0.15}>
        <SectionHeader title="Competition Analysis" count={relatedProjects.length} />
        <Card variant="glass" padding="lg" className="relative overflow-hidden">
          <ScanLine />
          <div className="relative z-10">
            {relatedProjects.length > 0 ? (
              <div className="space-y-4">
                <p className="text-sm text-text-muted">
                  {relatedProjects.length} existing {relatedProjects.length === 1 ? 'project' : 'projects'} in this category
                </p>
                <div className="divide-y divide-border rounded-lg border border-border overflow-hidden">
                  {relatedProjects.map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center gap-4 px-4 py-3 border-l-2 border-transparent hover:border-near-green/50 hover:bg-surface-hover transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate">{project.name}</p>
                        {project.description && (
                          <p className="text-xs text-text-muted truncate">{project.description}</p>
                        )}
                      </div>
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
                No competing projects found in this category — wide open opportunity.
              </p>
            )}
          </div>
        </Card>
      </ScrollReveal>

      {/* Brief Generator */}
      <ScrollReveal delay={0.2}>
        <SectionHeader title="AI Project Brief" badge="PREMIUM" />
        <AnimatedBorderCard padding="none">
          <BriefGenerator opportunityId={opportunity.id} />
        </AnimatedBorderCard>
      </ScrollReveal>
    </motion.div>
  );
}
