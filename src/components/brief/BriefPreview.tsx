'use client';

import { Lock, Sparkles } from 'lucide-react';
import { Card, Badge, Button } from '@/components/ui';
import type { ProjectBrief } from '@/types';

interface BriefPreviewProps {
  brief: ProjectBrief;
}

export function BriefPreview({ brief }: BriefPreviewProps) {
  return (
    <div className="space-y-4">
      {/* Visible sections — 5 sections to hook the user */}
      <div className="space-y-3">
        <div>
          <h4 className="text-sm font-semibold text-text-primary mb-1">Problem Statement</h4>
          <p className="text-sm text-text-secondary">{brief.problemStatement}</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-text-primary mb-1">Solution Overview</h4>
          <p className="text-sm text-text-secondary">{brief.solutionOverview}</p>
        </div>
        {brief.whyNow && (
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-1">Why Now</h4>
            <p className="text-sm text-text-secondary">{brief.whyNow}</p>
          </div>
        )}
        <div>
          <h4 className="text-sm font-semibold text-text-primary mb-1">Target Users</h4>
          <ul className="space-y-1">
            {brief.targetUsers.map((user, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                <span className="text-near-green mt-1">-</span>
                {user}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-text-primary mb-1">Key Features</h4>
          <div className="flex flex-wrap gap-2">
            {brief.keyFeatures.map((feature, i) => (
              <Badge key={i} variant="default">{feature.name}</Badge>
            ))}
          </div>
          <p className="text-xs text-text-muted mt-1.5">Upgrade to see full feature descriptions and priorities.</p>
        </div>
      </div>

      {/* Blurred/locked sections */}
      <div className="relative">
        <div className="space-y-3 blur-sm select-none pointer-events-none">
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
            <Button variant="primary" size="sm" leftIcon={<Sparkles className="w-3.5 h-3.5" />}>
              Upgrade to Specter
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
