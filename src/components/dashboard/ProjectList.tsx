'use client';

import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Globe, Github, Star, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Badge, Card } from '@/components/ui';
import { formatCurrency, formatNumber, timeAgo } from '@/lib/utils';
import type { Project } from '@/types';

interface ProjectListProps {
  projects: Project[];
  initialSort?: string;
}

const SORT_OPTIONS = [
  { key: 'tvl', label: 'TVL' },
  { key: 'name', label: 'Name' },
  { key: 'recent', label: 'Recent' },
  { key: 'stars', label: 'Stars' },
];

export function ProjectList({ projects, initialSort = 'tvl' }: ProjectListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get('sort') || initialSort;

  function updateSort(sort: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', sort);
    router.push(`?${params.toString()}`);
  }

  return (
    <div className="space-y-4">
      {/* Sort Controls */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-text-muted">Sort by:</span>
        {SORT_OPTIONS.map((sort) => (
          <button
            key={sort.key}
            onClick={() => updateSort(sort.key)}
            className={`px-3 py-1 text-xs rounded-md transition-colors ${
              currentSort === sort.key
                ? 'bg-near-green/10 text-near-green'
                : 'text-text-muted hover:text-text-primary hover:bg-surface-hover'
            }`}
          >
            {sort.label}
          </button>
        ))}
      </div>

      {/* Project List */}
      {projects.length === 0 ? (
        <Card padding="lg">
          <p className="text-center text-text-muted">No projects in this category.</p>
        </Card>
      ) : (
        <Card padding="none">
          <div className="divide-y divide-border">
            {projects.map((project) => (
              <div
                key={project.id}
                className="flex items-start gap-3 px-4 py-3 hover:bg-surface-hover transition-colors border-l-2 border-transparent hover:border-near-green/40"
              >
                {/* Logo / Avatar */}
                {project.logo_url ? (
                  <Image
                    src={project.logo_url}
                    alt=""
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full object-cover bg-surface-hover shrink-0 mt-0.5"
                    unoptimized
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-near-green/10 text-near-green flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    {project.name.charAt(0).toUpperCase()}
                  </div>
                )}

                {/* Name + Description + Meta */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-medium text-text-primary truncate">
                      {project.name}
                    </h3>
                    {project.is_active ? (
                      <span className="inline-flex items-center gap-0.5 text-[10px] text-near-green/70">
                        <CheckCircle className="w-3 h-3" />
                      </span>
                    ) : (
                      <Badge variant="default" className="bg-red-500/10 text-red-400 text-[10px] px-1.5 py-0">
                        <XCircle className="w-2.5 h-2.5 mr-0.5" />
                        Inactive
                      </Badge>
                    )}
                  </div>
                  {project.description && (
                    <p className="text-xs text-text-muted line-clamp-1 mt-0.5">
                      {project.description}
                    </p>
                  )}

                  {/* Meta row: stars, last commit */}
                  <div className="flex items-center gap-3 mt-1.5">
                    {project.github_stars > 0 && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-text-muted font-mono">
                        <Star className="w-3 h-3 text-warning" />
                        {formatNumber(project.github_stars)}
                      </span>
                    )}
                    {project.last_github_commit && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-text-muted">
                        <Clock className="w-3 h-3" />
                        {timeAgo(project.last_github_commit)}
                      </span>
                    )}
                  </div>
                </div>

                {/* TVL */}
                <div className="text-right shrink-0">
                  <p className="text-sm font-medium text-text-primary font-mono">
                    {Number(project.tvl_usd) > 0 ? formatCurrency(Number(project.tvl_usd)) : '-'}
                  </p>
                  <p className="text-[10px] text-text-muted mt-0.5 uppercase tracking-wide">
                    TVL
                  </p>
                </div>

                {/* Links */}
                <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
                  {project.website_url && (
                    <a
                      href={project.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-text-muted hover:text-near-green transition-colors p-1 rounded hover:bg-near-green/5"
                      onClick={(e) => e.stopPropagation()}
                      title="Website"
                    >
                      <Globe className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-text-muted hover:text-near-green transition-colors p-1 rounded hover:bg-near-green/5"
                      onClick={(e) => e.stopPropagation()}
                      title="GitHub"
                    >
                      <Github className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {project.twitter_url && (
                    <a
                      href={project.twitter_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-text-muted hover:text-near-green transition-colors p-1 rounded hover:bg-near-green/5"
                      onClick={(e) => e.stopPropagation()}
                      title="Twitter / X"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
