'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ExternalLink } from 'lucide-react';
import { Badge, Card } from '@/components/ui';
import { formatCurrency, timeAgo } from '@/lib/utils';
import type { Project } from '@/types';

interface ProjectListProps {
  projects: Project[];
  initialSort?: string;
}

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
        {['tvl', 'name', 'recent'].map((sort) => (
          <button
            key={sort}
            onClick={() => updateSort(sort)}
            className={`px-3 py-1 text-xs rounded-md transition-colors ${
              currentSort === sort
                ? 'bg-near-green/10 text-near-green'
                : 'text-text-muted hover:text-text-primary hover:bg-surface-hover'
            }`}
          >
            {sort === 'tvl' ? 'TVL' : sort === 'name' ? 'Name' : 'Recent'}
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
              <div key={project.id} className="flex items-center gap-4 px-4 py-3 hover:bg-surface-hover transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium text-text-primary truncate">
                      {project.name}
                    </h3>
                    {!project.is_active && (
                      <Badge variant="default" className="bg-red-500/10 text-red-400 text-xs">
                        Inactive
                      </Badge>
                    )}
                  </div>
                  {project.description && (
                    <p className="text-xs text-text-muted truncate mt-0.5">
                      {project.description}
                    </p>
                  )}
                </div>

                <div className="text-right shrink-0">
                  <p className="text-sm font-medium text-text-primary">
                    {Number(project.tvl_usd) > 0 ? formatCurrency(Number(project.tvl_usd)) : '-'}
                  </p>
                  <p className="text-xs text-text-muted">
                    {timeAgo(project.updated_at)}
                  </p>
                </div>

                {project.website_url && (
                  <a
                    href={project.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-muted hover:text-near-green transition-colors shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
