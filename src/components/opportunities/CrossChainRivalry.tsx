'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Target, TrendingUp } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { ScanLine } from '@/components/effects/ScanLine';
import { GradientText } from '@/components/effects/GradientText';
import { 
  getCompetitorsForCategory, 
  getCategoryCompetitionSummary,
  CHAIN_COLORS,
  CHAIN_EMOJIS,
  type CrossChainCompetitor 
} from '@/lib/cross-chain-data';

interface CrossChainRivalryProps {
  categorySlug: string;
  nearProjectCount: number;
  className?: string;
}

export function CrossChainRivalry({ categorySlug, nearProjectCount, className }: CrossChainRivalryProps) {
  const competitors = getCompetitorsForCategory(categorySlug);
  const summary = getCategoryCompetitionSummary(categorySlug);

  // Don't render if no competitors found
  if (competitors.length === 0) {
    return null;
  }

  // Group competitors by chain for better organization
  const competitorsByChain = competitors.reduce((acc, competitor) => {
    if (!acc[competitor.chain]) {
      acc[competitor.chain] = [];
    }
    acc[competitor.chain].push(competitor);
    return acc;
  }, {} as Record<string, CrossChainCompetitor[]>);

  // Format TVL summary
  const formatTVLSummary = (totalTVL: number) => {
    if (totalTVL >= 1e9) return `$${(totalTVL / 1e9).toFixed(1)}B`;
    if (totalTVL >= 1e6) return `$${(totalTVL / 1e6).toFixed(0)}M`;
    if (totalTVL >= 1e3) return `$${(totalTVL / 1e3).toFixed(0)}K`;
    return `$${totalTVL.toFixed(0)}`;
  };

  return (
    <ScrollReveal delay={0.25}>
      <Card variant="glass" padding="lg" className={`relative overflow-hidden ${className}`}>
        <ScanLine />
        <div className="relative z-10 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <GradientText 
              as="h3" 
              className="text-xl font-bold flex items-center gap-2"
            >
              🏁 Cross-Chain Competition
            </GradientText>
            <Badge variant="default" className="text-xs">
              {competitors.length} protocols
            </Badge>
          </div>

          {/* Summary Banner */}
          <motion.div 
            className="p-4 rounded-lg border border-border/50 bg-surface/30"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex flex-wrap items-center gap-2 text-sm text-text-secondary">
              {summary.topChains.map((item, index) => (
                <span key={item.chain} className="flex items-center gap-1">
                  <span style={{ color: CHAIN_COLORS[item.chain as keyof typeof CHAIN_COLORS] }}>
                    {CHAIN_EMOJIS[item.chain as keyof typeof CHAIN_EMOJIS]} {item.chain}
                  </span>
                  <span className="text-text-primary font-medium">
                    {item.count} protocol{item.count !== 1 ? 's' : ''}
                  </span>
                  {index < summary.topChains.length - 1 && (
                    <span className="text-text-muted/50 mx-1">•</span>
                  )}
                </span>
              ))}
              <span className="text-text-muted/50">•</span>
              <span className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-near-green" />
                {formatTVLSummary(summary.totalTVL)} combined TVL
              </span>
            </div>
            
            {/* NEAR comparison */}
            <div className="mt-3 pt-3 border-t border-border/30">
              {nearProjectCount === 0 ? (
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-near-green" />
                  <span className="text-near-green font-bold">
                    NEAR has ZERO — this void is wide open 🎯
                  </span>
                </div>
              ) : (
                <div className="text-sm text-text-secondary">
                  <span className="text-near-green font-medium">NEAR</span> has{' '}
                  <span className="text-text-primary font-bold">{nearProjectCount}</span>{' '}
                  {nearProjectCount === 1 ? 'protocol' : 'protocols'} in this space
                </div>
              )}
            </div>
          </motion.div>

          {/* Competitors by Chain — Solana first, then alphabetical */}
          <div className="space-y-3">
            {Object.entries(competitorsByChain)
              .sort(([a], [b]) => {
                if (a === 'Solana') return -1;
                if (b === 'Solana') return 1;
                return a.localeCompare(b);
              })
              .map(([chain, chainCompetitors]) => (
              <motion.div
                key={chain}
                className="space-y-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + Object.keys(competitorsByChain).indexOf(chain) * 0.05 }}
              >
                {/* Chain header */}
                <div className="flex items-center gap-2">
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: CHAIN_COLORS[chain as keyof typeof CHAIN_COLORS] }}
                  />
                  <span 
                    className="text-sm font-medium"
                    style={{ color: CHAIN_COLORS[chain as keyof typeof CHAIN_COLORS] }}
                  >
                    {CHAIN_EMOJIS[chain as keyof typeof CHAIN_EMOJIS]} {chain}
                  </span>
                  <Badge variant="default">
                    {chainCompetitors.length}
                  </Badge>
                </div>

                {/* Competitors list */}
                <div className="pl-4 space-y-2">
                  {chainCompetitors.map((competitor) => (
                    <motion.div
                      key={`${competitor.chain}-${competitor.name}`}
                      className="flex items-center justify-between p-3 rounded-lg bg-surface/20 border border-border/30 hover:border-border/60 transition-colors group"
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-text-primary group-hover:text-near-green transition-colors">
                            {competitor.name}
                          </span>
                          {competitor.tvl && (
                            <Badge variant="default" className="text-xs font-mono">
                              {competitor.tvl}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-text-muted mt-1 line-clamp-2">
                          {competitor.description}
                        </p>
                      </div>
                      <ExternalLink className="w-3 h-3 text-text-muted group-hover:text-near-green transition-colors shrink-0" />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Footer insight */}
          <motion.div
            className="text-xs text-text-muted italic pt-2 border-t border-border/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            💡 This shows what builders have already built on other chains — your opportunity to bring it to NEAR
          </motion.div>
        </div>
      </Card>
    </ScrollReveal>
  );
}