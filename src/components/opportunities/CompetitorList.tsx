import Link from 'next/link';
import { ExternalLink, Star, Clock } from 'lucide-react';
import { formatCurrency, formatNumber, timeAgo } from '@/lib/utils';
import type { Project } from '@/types';

export type ActivityStatus = 'active' | 'stale' | 'abandoned';

export function getActivityStatus(lastCommit: string | null): ActivityStatus {
  if (!lastCommit) return 'abandoned';
  const commitDate = new Date(lastCommit);
  const now = new Date();
  const monthsAgo = (now.getTime() - commitDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
  if (monthsAgo <= 3) return 'active';
  if (monthsAgo <= 12) return 'stale';
  return 'abandoned';
}

function activityIndicator(status: ActivityStatus) {
  switch (status) {
    case 'active': return '🟢';
    case 'stale': return '🟡';
    case 'abandoned': return '🔴';
  }
}

export function CompetitorList({ projects }: { projects: Project[] }) {
  return (
    <div className="divide-y divide-border rounded-lg border border-border overflow-hidden">
      {projects.map((project) => {
        const status = getActivityStatus(project.last_github_commit);
        return (
          <div
            key={project.id}
            className="flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-3 border-l-2 border-transparent hover:border-near-green/50 hover:bg-surface-hover transition-colors"
          >
            <span className="shrink-0 text-sm" title={status}>{activityIndicator(status)}</span>
            <Link
              href={`/projects/${project.slug}`}
              className="flex-1 min-w-0 py-1 active:scale-[0.98] touch-manipulation"
            >
              <p className="text-sm font-medium text-text-primary truncate hover:text-near-green transition-colors">
                {project.name}
              </p>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                {(project.github_stars ?? 0) > 0 && (
                  <span className="inline-flex items-center gap-0.5 text-[10px] sm:text-xs text-text-muted font-mono">
                    <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-warning" /> {formatNumber(project.github_stars)}
                  </span>
                )}
                {Number(project.tvl_usd) > 0 && (
                  <span className="inline-flex items-center gap-0.5 text-[10px] sm:text-xs text-text-muted font-mono">
                    {formatCurrency(Number(project.tvl_usd))} TVL
                  </span>
                )}
                {project.last_github_commit && (
                  <span className="inline-flex items-center gap-0.5 text-[10px] sm:text-xs text-text-muted">
                    <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> {timeAgo(project.last_github_commit)}
                  </span>
                )}
              </div>
            </Link>
            {project.website_url && (
              <a
                href={project.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted hover:text-near-green transition-colors shrink-0 p-2 -m-2 min-w-[44px] min-h-[44px] flex items-center justify-center active:scale-95 touch-manipulation"
                aria-label={`Visit ${project.name} website`}
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        );
      })}
    </div>
  );
}
