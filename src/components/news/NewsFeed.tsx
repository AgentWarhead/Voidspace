'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Newspaper, Zap } from 'lucide-react';
import { Badge } from '@/components/ui';
import { GlowCard } from '@/components/effects/GlowCard';
import type { NewsArticle } from '@/types';

interface NewsFeedProps {
  articles: NewsArticle[];
  title?: string;
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

function scoreColor(score: number): string {
  if (score >= 70) return 'text-near-green';
  if (score >= 40) return 'text-warning';
  return 'text-text-muted';
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
};

export function NewsFeed({ articles, title }: NewsFeedProps) {
  if (articles.length === 0) {
    return (
      <div className="text-center py-12 text-text-muted">
        <Newspaper className="w-8 h-8 mx-auto mb-3 opacity-40" />
        <p>No news articles yet. Run a data sync to populate the feed.</p>
      </div>
    );
  }

  return (
    <div>
      {title && (
        <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">{title}</h3>
      )}
      <motion.div
        className="space-y-3"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-30px' }}
      >
        {articles.map((article) => (
          <motion.div key={article.id} variants={item}>
            <a href={article.url} target="_blank" rel="noopener noreferrer" className="block group">
              <GlowCard padding="md">
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[11px] font-medium text-accent-cyan">{article.source}</span>
                      <span className="text-[10px] text-text-muted">{timeAgo(article.published_at)}</span>
                      {article.near_relevant && (
                        <Badge variant="default" className="text-[9px] bg-near-green/10 text-near-green border-near-green/20">
                          NEAR
                        </Badge>
                      )}
                    </div>
                    <h4 className="text-sm font-medium text-text-primary group-hover:text-near-green transition-colors line-clamp-2">
                      {article.title}
                    </h4>
                    {article.summary && (
                      <p className="text-xs text-text-muted mt-1 line-clamp-2">{article.summary}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      {article.category && (
                        <Badge variant="default" className="text-[10px]">
                          {article.category}
                        </Badge>
                      )}
                      {article.coins_mentioned?.slice(0, 3).map((coin) => (
                        <span key={coin} className="text-[10px] font-mono text-text-muted bg-surface px-1.5 py-0.5 rounded">
                          {coin}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <div className={`text-xs font-mono font-semibold ${scoreColor(article.relevance_score)}`}>
                      <Zap className="w-3 h-3 inline-block mr-0.5" />
                      {Math.round(article.relevance_score)}
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-text-muted group-hover:text-near-green transition-colors mt-1" />
                  </div>
                </div>
              </GlowCard>
            </a>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
