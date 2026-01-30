import { Clock, ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui';
import { timeAgo } from '@/lib/utils';
import type { Project } from '@/types';

interface RecentActivityProps {
  recentProjects: Project[];
  lastSyncAt: string | null;
}

export function RecentActivity({ recentProjects, lastSyncAt }: RecentActivityProps) {
  if (recentProjects.length === 0) {
    return (
      <Card padding="md">
        <p className="text-center text-text-muted py-4">
          No recent activity. Run a data sync to populate projects.
        </p>
      </Card>
    );
  }

  return (
    <Card padding="none">
      <div className="divide-y divide-border">
        {recentProjects.map((project) => (
          <div key={project.id} className="flex items-center gap-3 px-4 py-3">
            <div className="w-2 h-2 rounded-full bg-near-green shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">
                {project.name}
              </p>
              <p className="text-xs text-text-muted truncate">
                {project.description || 'No description'}
              </p>
            </div>
            <span className="text-xs text-text-muted shrink-0">
              {timeAgo(project.created_at)}
            </span>
            {project.website_url && (
              <a
                href={project.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted hover:text-near-green transition-colors shrink-0"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        ))}
      </div>

      {lastSyncAt && (
        <div className="flex items-center gap-2 px-4 py-3 border-t border-border bg-surface/50">
          <Clock className="w-3.5 h-3.5 text-text-muted" />
          <span className="text-xs text-text-muted">
            Last sync: {timeAgo(lastSyncAt)}
          </span>
        </div>
      )}
    </Card>
  );
}
