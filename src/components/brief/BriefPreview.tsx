'use client';

import { Lock, Sparkles } from 'lucide-react';
import { Card, Button } from '@/components/ui';
import type { ProjectBrief } from '@/types';

interface BriefPreviewProps {
  brief: ProjectBrief;
}

export function BriefPreview({ brief }: BriefPreviewProps) {
  return (
    <div className="space-y-4">
      {/* Visible sections */}
      <div className="space-y-3">
        <div>
          <h4 className="text-sm font-semibold text-text-primary mb-1">Problem Statement</h4>
          <p className="text-sm text-text-secondary">{brief.problemStatement}</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-text-primary mb-1">Solution Overview</h4>
          <p className="text-sm text-text-secondary">{brief.solutionOverview}</p>
        </div>
      </div>

      {/* Blurred/locked sections */}
      <div className="relative">
        <div className="space-y-3 blur-sm select-none pointer-events-none">
          <div className="p-3 bg-surface-hover rounded-lg">
            <h4 className="text-sm font-semibold text-text-primary mb-1">Key Features</h4>
            <p className="text-sm text-text-secondary">Feature details are locked...</p>
          </div>
          <div className="p-3 bg-surface-hover rounded-lg">
            <h4 className="text-sm font-semibold text-text-primary mb-1">Technical Requirements</h4>
            <p className="text-sm text-text-secondary">Technical stack recommendations...</p>
          </div>
          <div className="p-3 bg-surface-hover rounded-lg">
            <h4 className="text-sm font-semibold text-text-primary mb-1">NEAR Technology</h4>
            <p className="text-sm text-text-secondary">NEAR integration details...</p>
          </div>
        </div>

        {/* Upgrade overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Card padding="lg" className="text-center max-w-sm">
            <Lock className="w-6 h-6 text-near-green mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-text-primary mb-1">
              Upgrade to Unlock Full Brief
            </h3>
            <p className="text-xs text-text-secondary mb-3">
              Get full technical specs, NEAR integration details, and monetization strategies.
            </p>
            <Button variant="primary" size="sm" leftIcon={<Sparkles className="w-3.5 h-3.5" />}>
              Upgrade to Specter
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
