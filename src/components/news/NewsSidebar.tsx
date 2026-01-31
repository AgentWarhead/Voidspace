'use client';

import { ExternalLink, Zap } from 'lucide-react';
import type { NewsArticle } from '@/types';

interface NewsSidebarProps {
  articles: NewsArticle[];
}

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return '';
  const ms = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(ms / (1000 * 60 * 60));
  if (hours < 1) return `${Math.floor(ms / (1000 * 60))}m ago`;
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function NewsSidebar({ articles }: NewsSidebarProps) {
  if (articles.length === 0) return null;

  return (
    <div className="space-y-2">
      {articles.map((article) => (
        <a
          key={article.id}
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-start gap-2.5 p-3 rounded-lg bg-surface/50 border border-border hover:border-near-green/30 transition-colors group"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[10px] font-medium text-accent-cyan">{article.source}</span>
              <span className="text-[10px] text-text-muted">{timeAgo(article.published_at)}</span>
            </div>
            <h5 className="text-xs font-medium text-text-primary group-hover:text-near-green transition-colors line-clamp-2">
              {article.title}
            </h5>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Zap className="w-3 h-3 text-text-muted" />
            <span className="text-[10px] font-mono text-text-muted">{Math.round(article.relevance_score)}</span>
            <ExternalLink className="w-3 h-3 text-text-muted group-hover:text-near-green transition-colors" />
          </div>
        </a>
      ))}
    </div>
  );
}
