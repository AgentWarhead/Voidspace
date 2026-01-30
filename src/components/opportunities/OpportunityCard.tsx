'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui';
import { GlowCard } from '@/components/effects/GlowCard';
import { TiltCard } from '@/components/effects/TiltCard';
import { HotTag } from '@/components/effects/HotTag';
import { GapScoreIndicator } from '@/components/opportunities/GapScoreIndicator';
import { SaveButton } from '@/components/opportunities/SaveButton';
import type { Opportunity } from '@/types';

interface OpportunityCardProps {
  opportunity: Opportunity;
}

export function OpportunityCard({ opportunity }: OpportunityCardProps) {
  return (
    <Link href={`/opportunities/${opportunity.id}`}>
      <TiltCard>
        <GlowCard className="h-full" padding="md">
          <div className="space-y-3">
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
              {opportunity.description && (
                <p className="text-sm text-text-muted mt-1 line-clamp-2">
                  {opportunity.description}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {opportunity.category && (
                <Badge variant="default" className="text-xs" pulse={opportunity.gap_score >= 80}>
                  {opportunity.category.name}
                </Badge>
              )}
              <Badge variant="difficulty" difficulty={opportunity.difficulty}>
                {opportunity.difficulty}
              </Badge>
              <Badge variant="competition" competition={opportunity.competition_level}>
                {opportunity.competition_level}
              </Badge>
            </div>

            <GapScoreIndicator score={opportunity.gap_score} size="md" />
          </div>
        </GlowCard>
      </TiltCard>
    </Link>
  );
}
