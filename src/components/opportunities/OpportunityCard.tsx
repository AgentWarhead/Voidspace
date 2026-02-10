'use client';

import Link from 'next/link';
import { TrendingUp } from 'lucide-react';
import { Badge, InfoTooltip } from '@/components/ui';
import { GlowCard } from '@/components/effects/GlowCard';
import { TiltCard } from '@/components/effects/TiltCard';
import { HotTag } from '@/components/effects/HotTag';
import { GapScoreIndicator } from '@/components/opportunities/GapScoreIndicator';
import { SaveButton } from '@/components/opportunities/SaveButton';
import { HELP_CONTENT } from '@/lib/help-content';
import type { Opportunity } from '@/types';

interface OpportunityCardProps {
  opportunity: Opportunity;
}

export function OpportunityCard({ opportunity }: OpportunityCardProps) {
  return (
    <Link href={`/opportunities/${opportunity.id}`}>
      <TiltCard>
        <GlowCard className="h-full group" padding="md">
          <div className="space-y-3 min-h-[120px]">
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <h3 className="font-semibold text-text-primary line-clamp-2">
                    {opportunity.title}
                  </h3>
                  {opportunity.gap_score >= 85 && <HotTag />}
                </div>
                <SaveButton opportunityId={opportunity.id} size="sm" />
              </div>
              
              {/* Hidden by default, show on hover */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {opportunity.description && (
                  <p className="text-sm text-text-muted mt-1 line-clamp-2">
                    {opportunity.description}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Always visible: Category badge */}
              {opportunity.category && (
                <Badge variant="default" className="text-xs" pulse={opportunity.gap_score >= 80}>
                  {opportunity.category.name}
                </Badge>
              )}
              
              {/* Always visible: Difficulty and competition badges */}
              <Badge variant="difficulty" difficulty={opportunity.difficulty}>
                {opportunity.difficulty}
              </Badge>
              <Badge variant="competition" competition={opportunity.competition_level}>
                {opportunity.competition_level}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              {/* Always visible: Void Score indicator */}
              <GapScoreIndicator score={opportunity.gap_score} size="md" />
              
              {/* Always visible on mobile, hover-reveal on desktop */}
              <div className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
                {opportunity.demand_score != null && opportunity.demand_score > 0 && (
                  <span className="inline-flex items-center gap-1 text-xs text-text-muted font-mono">
                    <TrendingUp className="w-3 h-3 text-near-green" />
                    Demand: {Math.round(opportunity.demand_score)}
                    <InfoTooltip term={HELP_CONTENT.demandScore.term}>
                      <p>{HELP_CONTENT.demandScore.description}</p>
                    </InfoTooltip>
                  </span>
                )}
              </div>
            </div>
          </div>
        </GlowCard>
      </TiltCard>
    </Link>
  );
}
