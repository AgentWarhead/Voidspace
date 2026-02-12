'use client';

import { useRouter } from 'next/navigation';
import { Lock, Sparkles } from 'lucide-react';
import { Card, Button } from '@/components/ui';
import type { ProjectBrief } from '@/types';

interface BriefPreviewProps {
  brief: ProjectBrief;
}

/** Truncate text to the first N sentences (splits on `. `). */
function truncateToSentences(text: string, n: number): string {
  const sentences = text.split('. ');
  if (sentences.length <= n) return text;
  return sentences.slice(0, n).join('. ') + '...';
}

export function BriefPreview({ brief }: BriefPreviewProps) {
  const router = useRouter();

  return (
    <div className="space-y-4">
      {/* Visible teaser — just enough to tantalize */}
      <div className="space-y-3">
        <div>
          <h4 className="text-sm font-semibold text-text-primary mb-1">Problem Statement</h4>
          <p className="text-sm text-text-secondary">
            {truncateToSentences(brief.problemStatement, 2)}
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-text-primary mb-1">Solution Overview</h4>
          <p className="text-sm text-text-secondary">
            {truncateToSentences(brief.solutionOverview, 1)}
          </p>
        </div>

        {/* Hint about locked content */}
        <p className="text-xs text-text-muted italic pt-1">
          Plus 10 more sections: Why Now, Target Users, Key Features, Technical Requirements, NEAR Strategy, Monetization, Week 1 Plan, Funding Opportunities...
        </p>
      </div>

      {/* Blurred/locked sections — taller to convey lots of hidden value */}
      <div className="relative">
        <div className="space-y-3 blur-sm select-none pointer-events-none min-h-[360px]">
          <div className="p-3 bg-surface-hover rounded-lg">
            <h4 className="text-sm font-semibold text-text-primary mb-1">Why Now</h4>
            <p className="text-sm text-text-secondary">Market timing analysis and ecosystem readiness signals...</p>
          </div>
          <div className="p-3 bg-surface-hover rounded-lg">
            <h4 className="text-sm font-semibold text-text-primary mb-1">Target Users</h4>
            <p className="text-sm text-text-secondary">Primary user personas and market segments...</p>
          </div>
          <div className="p-3 bg-surface-hover rounded-lg">
            <h4 className="text-sm font-semibold text-text-primary mb-1">Key Features</h4>
            <p className="text-sm text-text-secondary">Full feature breakdown with priorities and descriptions...</p>
          </div>
          <div className="p-3 bg-surface-hover rounded-lg">
            <h4 className="text-sm font-semibold text-text-primary mb-1">Technical Requirements</h4>
            <p className="text-sm text-text-secondary">Frontend, backend, and blockchain stack...</p>
          </div>
          <div className="p-3 bg-surface-hover rounded-lg">
            <h4 className="text-sm font-semibold text-text-primary mb-1">NEAR Technology</h4>
            <p className="text-sm text-text-secondary">Shade Agents, Intents, Chain Signatures...</p>
          </div>
          <div className="p-3 bg-surface-hover rounded-lg">
            <h4 className="text-sm font-semibold text-text-primary mb-1">Monetization & Next Steps</h4>
            <p className="text-sm text-text-secondary">Revenue models, week 1 actions, funding...</p>
          </div>
          <div className="p-3 bg-surface-hover rounded-lg">
            <h4 className="text-sm font-semibold text-text-primary mb-1">Week 1 Action Plan</h4>
            <p className="text-sm text-text-secondary">Day-by-day execution roadmap...</p>
          </div>
        </div>

        {/* Upgrade overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Card padding="lg" className="text-center max-w-sm">
            <Lock className="w-6 h-6 text-near-green mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-text-primary mb-1">
              Unlock Your Full Build Blueprint
            </h3>
            <p className="text-xs text-text-secondary mb-3">
              Get technical specs, NEAR integration details, monetization strategies, next steps, and funding opportunities.
            </p>
            <Button variant="primary" size="sm" leftIcon={<Sparkles className="w-3.5 h-3.5" />} onClick={() => router.push('/pricing')}>
              Upgrade to Specter
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
