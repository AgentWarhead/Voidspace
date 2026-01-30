'use client';

import { Star, GitFork, AlertCircle, Activity } from 'lucide-react';
import { Card, Badge, InfoTooltip } from '@/components/ui';
import { AnimatedCounter } from '@/components/effects/AnimatedCounter';
import { ScanLine } from '@/components/effects/ScanLine';
import { formatNumber } from '@/lib/utils';
import { HELP_CONTENT } from '@/lib/help-content';
import type { GitHubAggregateStats } from '@/types';

interface GitHubPulseProps {
  stats: GitHubAggregateStats;
}

export function GitHubPulse({ stats }: GitHubPulseProps) {
  const statItems = [
    { label: 'Total Stars', value: stats.totalStars, icon: Star, helpKey: 'githubStars' as const },
    { label: 'Total Forks', value: stats.totalForks, icon: GitFork, helpKey: 'githubForks' as const },
    { label: 'Open Issues', value: stats.totalOpenIssues, icon: AlertCircle, helpKey: 'openIssues' as const },
    { label: 'Recently Active', value: stats.recentlyActive, icon: Activity, helpKey: 'recentlyActive' as const },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statItems.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.label} variant="glass" padding="md" className="relative overflow-hidden">
              <ScanLine />
              <div className="relative z-10 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-near-green/10">
                  <Icon className="w-5 h-5 text-near-green" />
                </div>
                <div>
                  <p className="text-xs text-text-muted uppercase tracking-wide font-mono flex items-center">
                    {item.label}
                    <InfoTooltip term={HELP_CONTENT[item.helpKey].term}>
                      <p>{HELP_CONTENT[item.helpKey].description}</p>
                    </InfoTooltip>
                  </p>
                  <p className="text-xl font-bold text-text-primary">
                    <AnimatedCounter value={item.value} formatter={formatNumber} />
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Top Languages Mini Chart */}
      {stats.topLanguages.length > 0 && (
        <Card variant="glass" padding="md" className="relative overflow-hidden">
          <ScanLine />
          <div className="relative z-10">
            <p className="text-xs text-text-muted uppercase tracking-wide font-mono mb-3">
              Top Languages by Project Count
            </p>
            <div className="flex flex-wrap gap-2">
              {stats.topLanguages.slice(0, 8).map((lang) => (
                <Badge key={lang.language} variant="default" className="text-xs">
                  {lang.language} ({lang.count})
                </Badge>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
