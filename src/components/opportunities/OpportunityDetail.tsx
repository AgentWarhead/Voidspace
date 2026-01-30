'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, CheckCircle2 } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { GapScoreIndicator } from '@/components/opportunities/GapScoreIndicator';
import { SaveButton } from '@/components/opportunities/SaveButton';
import { BriefGenerator } from '@/components/brief/BriefGenerator';
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
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
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

      {/* Header */}
      <Card padding="lg">
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
      </Card>

      {/* Reasoning */}
      {opportunity.reasoning && (
        <Card padding="lg">
          <h2 className="text-lg font-semibold text-text-primary mb-3">Why This Gap Exists</h2>
          <p className="text-text-secondary leading-relaxed">{opportunity.reasoning}</p>
        </Card>
      )}

      {/* Suggested Features */}
      {opportunity.suggested_features && opportunity.suggested_features.length > 0 && (
        <Card padding="lg">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Suggested Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {opportunity.suggested_features.map((feature, index) => (
              <div
                key={index}
                className="flex items-start gap-2 p-3 rounded-lg bg-surface-hover"
              >
                <CheckCircle2 className="w-4 h-4 text-near-green mt-0.5 shrink-0" />
                <span className="text-sm text-text-primary">{feature}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Competition Analysis */}
      <Card padding="lg">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Competition Analysis</h2>

        {relatedProjects.length > 0 ? (
          <div className="space-y-4">
            <p className="text-sm text-text-muted">
              {relatedProjects.length} existing {relatedProjects.length === 1 ? 'project' : 'projects'} in this category
            </p>
            <div className="divide-y divide-border rounded-lg border border-border overflow-hidden">
              {relatedProjects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center gap-4 px-4 py-3 hover:bg-surface-hover transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">{project.name}</p>
                    {project.description && (
                      <p className="text-xs text-text-muted truncate">{project.description}</p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-medium text-text-primary">
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
      </Card>

      {/* Brief Generator */}
      <BriefGenerator opportunityId={opportunity.id} />
    </motion.div>
  );
}
