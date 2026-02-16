'use client';

import { motion } from 'framer-motion';
import {
  Blocks,
  Wallet,
  Zap,
  BarChart3,
  TrendingUp,
  Palette,
  GitBranch,
  Vote,
  Server,
  Database,
  Brain,
} from 'lucide-react';
import { SectionHeader } from '@/components/effects/SectionHeader';
import { GlowCard } from '@/components/effects/GlowCard';
import { GradientText } from '@/components/effects/GradientText';

const DATA_SOURCES = [
  {
    name: 'NearBlocks',
    description: 'Blockchain transactions, accounts, validators & block data',
    icon: Blocks,
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-400/10',
    category: 'blockchain',
  },
  {
    name: 'Pikespeak',
    description: 'Wallet analytics, account activity & NEAR network metrics',
    icon: Wallet,
    color: 'text-cyan-300',
    bgColor: 'bg-cyan-300/10',
    category: 'blockchain',
  },
  {
    name: 'FastNEAR',
    description: 'High-speed indexer for real-time on-chain state queries',
    icon: Zap,
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-500/10',
    category: 'blockchain',
  },
  {
    name: 'DexScreener',
    description: 'Live DEX prices, volume, liquidity & trading pair data',
    icon: BarChart3,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-400/10',
    category: 'market',
  },
  {
    name: 'DefiLlama',
    description: 'Total Value Locked (TVL) & cross-chain DeFi analytics',
    icon: TrendingUp,
    color: 'text-emerald-300',
    bgColor: 'bg-emerald-300/10',
    category: 'market',
  },
  {
    name: 'Mintbase',
    description: 'NFT marketplace data, collections & trading activity on NEAR',
    icon: Palette,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
    category: 'market',
  },
  {
    name: 'GitHub',
    description: 'Repository activity, commits & contributor metrics for NEAR projects',
    icon: GitBranch,
    color: 'text-purple-400',
    bgColor: 'bg-purple-400/10',
    category: 'social',
  },
  {
    name: 'AstroDAO',
    description: 'DAO governance proposals, voting records & treasury data',
    icon: Vote,
    color: 'text-purple-300',
    bgColor: 'bg-purple-300/10',
    category: 'social',
  },
  {
    name: 'NEAR RPC',
    description: 'Direct mainnet blockchain queries & contract state reads',
    icon: Server,
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-400/10',
    category: 'blockchain',
  },
  {
    name: 'Ecosystem Registry',
    description: 'Curated database of 180+ NEAR projects with metadata',
    icon: Database,
    color: 'text-teal-400',
    bgColor: 'bg-teal-400/10',
    category: 'blockchain',
  },
];

const AI_LAYER = {
  name: 'Anthropic Claude',
  description: 'AI intelligence powering Sanctum, Void Briefs & ecosystem analysis',
  icon: Brain,
  color: 'text-amber-400',
  bgColor: 'bg-amber-400/10',
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
  },
};

export function DataSourcesSection() {
  return (
    <section>
      <SectionHeader
        title="Real Data. Real Intelligence."
        badge="10+ LIVE SOURCES"
      />

      <p className="text-text-secondary text-sm sm:text-base max-w-3xl mx-auto text-center mb-8 sm:mb-10 px-2 sm:px-0">
        Every insight on Voidspace is backed by verifiable, real-time blockchain data.
        No synthetic data. No hallucinated metrics.{' '}
        <GradientText>Every number you see is verifiable on-chain.</GradientText>
      </p>

      {/* Data Sources Grid */}
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
      >
        {DATA_SOURCES.map((source) => {
          const Icon = source.icon;
          return (
            <motion.div key={source.name} variants={itemVariants}>
              <GlowCard padding="sm" className="h-full">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${source.bgColor} shrink-0`}>
                    <Icon className={`w-4 h-4 ${source.color}`} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-text-primary truncate">
                      {source.name}
                    </h3>
                    <p className="text-xs text-text-muted leading-relaxed mt-0.5">
                      {source.description}
                    </p>
                  </div>
                </div>
              </GlowCard>
            </motion.div>
          );
        })}
      </motion.div>

      {/* AI Layer */}
      <motion.div
        className="mt-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="relative overflow-hidden rounded-xl border border-amber-400/20 bg-amber-400/[0.03] p-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className={`p-2.5 rounded-lg ${AI_LAYER.bgColor} shrink-0`}>
              <AI_LAYER.icon className={`w-5 h-5 ${AI_LAYER.color}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-text-primary">
                  {AI_LAYER.name}
                </h3>
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400/70 bg-amber-400/10 px-2 py-0.5 rounded-full">
                  AI Layer
                </span>
              </div>
              <p className="text-xs text-text-muted mt-0.5">
                {AI_LAYER.description}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Trust note */}
      <p className="text-center text-xs text-text-muted mt-6 font-mono">
        All data is fetched in real-time and cached for performance. Every metric is verifiable on-chain.
      </p>
    </section>
  );
}
