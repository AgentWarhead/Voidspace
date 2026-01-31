'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Layers, Target, Grid3X3, Star, GitFork, TrendingUp, Search } from 'lucide-react';
import { Card, Badge, VoidEmptyState } from '@/components/ui';
import { ScanLine } from '@/components/effects/ScanLine';
import { formatCurrency, formatNumber } from '@/lib/utils';
import type { Project, Opportunity, Category } from '@/types';

type Tab = 'projects' | 'opportunities' | 'categories';

interface SearchResultsProps {
  projects: Project[];
  opportunities: Opportunity[];
  categories: Category[];
  query: string;
}

export function SearchResults({ projects, opportunities, categories, query }: SearchResultsProps) {
  const [activeTab, setActiveTab] = useState<Tab>(
    projects.length > 0 ? 'projects' : opportunities.length > 0 ? 'opportunities' : 'categories'
  );

  const tabs: { key: Tab; label: string; count: number; icon: React.ReactNode }[] = [
    { key: 'projects', label: 'Projects', count: projects.length, icon: <Layers className="w-3.5 h-3.5" /> },
    { key: 'opportunities', label: 'Voids', count: opportunities.length, icon: <Target className="w-3.5 h-3.5" /> },
    { key: 'categories', label: 'Categories', count: categories.length, icon: <Grid3X3 className="w-3.5 h-3.5" /> },
  ];

  const totalResults = projects.length + opportunities.length + categories.length;

  if (!query) {
    return (
      <VoidEmptyState
        icon={Search}
        title="Search the Void"
        description="Enter a search term above to find projects, voids, and categories."
      />
    );
  }

  if (totalResults === 0) {
    return (
      <VoidEmptyState
        icon={Search}
        title="No results found"
        description={`Nothing matched \u201c${query}\u201d. Try a different search term.`}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-1 border-b border-border pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-3 py-2 text-sm rounded-t-lg transition-colors ${
              activeTab === tab.key
                ? 'text-near-green bg-near-green/10 border-b-2 border-near-green'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
            }`}
          >
            {tab.icon}
            {tab.label}
            <span className="text-[10px] font-mono text-text-muted ml-1">({tab.count})</span>
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="space-y-2">
        {activeTab === 'projects' && projects.map((project) => (
          <Link key={project.id} href={`/projects/${project.slug}`}>
            <Card variant="glass" padding="md" className="relative overflow-hidden hover:border-near-green/30 transition-colors cursor-pointer">
              <ScanLine />
              <div className="relative z-10 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-text-primary">{project.name}</span>
                    {project.is_active ? (
                      <Badge variant="default" className="text-[10px] bg-near-green/10 text-near-green">Active</Badge>
                    ) : (
                      <Badge variant="default" className="text-[10px] bg-red-500/10 text-red-400">Inactive</Badge>
                    )}
                  </div>
                  {project.description && (
                    <p className="text-xs text-text-muted mt-1 line-clamp-1">{project.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-3 shrink-0 text-xs text-text-muted">
                  {Number(project.tvl_usd) > 0 && (
                    <span className="font-mono">{formatCurrency(Number(project.tvl_usd))}</span>
                  )}
                  {project.github_stars > 0 && (
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-warning" />
                      {formatNumber(project.github_stars)}
                    </span>
                  )}
                  {project.github_forks > 0 && (
                    <span className="flex items-center gap-1">
                      <GitFork className="w-3 h-3" />
                      {formatNumber(project.github_forks)}
                    </span>
                  )}
                </div>
              </div>
            </Card>
          </Link>
        ))}

        {activeTab === 'opportunities' && opportunities.map((opp) => (
          <Link key={opp.id} href={`/opportunities/${opp.id}`}>
            <Card variant="glass" padding="md" className="relative overflow-hidden hover:border-near-green/30 transition-colors cursor-pointer">
              <ScanLine />
              <div className="relative z-10 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-text-primary">{opp.title}</span>
                    <Badge variant="difficulty" difficulty={opp.difficulty}>
                      {opp.difficulty}
                    </Badge>
                  </div>
                  {opp.description && (
                    <p className="text-xs text-text-muted mt-1 line-clamp-1">{opp.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className="text-lg font-bold font-mono"
                    style={{
                      color: opp.gap_score >= 67 ? '#00EC97' : opp.gap_score >= 34 ? '#FFA502' : '#FF4757',
                    }}
                  >
                    {opp.gap_score}
                  </span>
                  {opp.demand_score != null && (
                    <span className="flex items-center gap-1 text-xs text-text-muted">
                      <TrendingUp className="w-3 h-3" />
                      {Number(opp.demand_score).toFixed(1)}
                    </span>
                  )}
                </div>
              </div>
            </Card>
          </Link>
        ))}

        {activeTab === 'categories' && categories.map((cat) => (
          <Link key={cat.id} href={`/categories/${cat.slug}`}>
            <Card variant="glass" padding="md" className="relative overflow-hidden hover:border-near-green/30 transition-colors cursor-pointer">
              <ScanLine />
              <div className="relative z-10 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-text-primary">{cat.name}</span>
                    {cat.is_strategic && (
                      <Badge variant="default" className="text-[10px] bg-near-green/10 text-near-green">NEAR Priority</Badge>
                    )}
                  </div>
                  {cat.description && (
                    <p className="text-xs text-text-muted mt-1 line-clamp-1">{cat.description}</p>
                  )}
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
