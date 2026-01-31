'use client';

import { motion } from 'framer-motion';
import { Flame, TrendingUp } from 'lucide-react';
import type { HotTopic } from '@/lib/news-queries';

interface HotSignalBarProps {
  hotTopics: HotTopic[];
}

const CATEGORY_LABELS: Record<string, string> = {
  market: 'Market',
  defi: 'DeFi',
  nft: 'NFT',
  regulatory: 'Regulatory',
  exchange: 'Exchange',
  security: 'Security',
  layer1: 'Layer 1',
  layer2: 'Layer 2',
};

export function HotSignalBar({ hotTopics }: HotSignalBarProps) {
  if (hotTopics.length === 0) return null;

  return (
    <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
      <div className="flex items-center gap-1.5 text-text-muted shrink-0">
        <TrendingUp className="w-4 h-4" />
        <span className="text-xs font-medium uppercase tracking-wider">Trending</span>
      </div>
      {hotTopics.map((topic, i) => (
        <motion.div
          key={topic.category}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.05 }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border shrink-0"
          style={{
            borderColor: topic.spike >= 3 ? 'rgba(255, 71, 87, 0.4)' : topic.spike >= 2 ? 'rgba(255, 165, 2, 0.4)' : 'rgba(0, 236, 151, 0.3)',
            backgroundColor: topic.spike >= 3 ? 'rgba(255, 71, 87, 0.08)' : topic.spike >= 2 ? 'rgba(255, 165, 2, 0.08)' : 'rgba(0, 236, 151, 0.06)',
          }}
        >
          {topic.spike >= 3 && <Flame className="w-3 h-3 text-error" />}
          <span className="text-xs font-medium text-text-primary">
            {CATEGORY_LABELS[topic.category] || topic.category}
          </span>
          <span
            className="text-[10px] font-mono font-semibold"
            style={{
              color: topic.spike >= 3 ? '#FF4757' : topic.spike >= 2 ? '#FFA502' : '#00EC97',
            }}
          >
            +{Math.round((topic.spike - 1) * 100)}%
          </span>
        </motion.div>
      ))}
    </div>
  );
}
