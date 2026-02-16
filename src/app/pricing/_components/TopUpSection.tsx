'use client';

import { motion } from 'framer-motion';
import { Zap, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { GradientText } from '@/components/effects/GradientText';
import { TOPUP_PACKS } from '@/lib/sanctum-tiers';

interface TopUpSectionProps {
  isConnected: boolean;
  userLoading: boolean;
  loadingPack: string | null;
  onTopUp: (packSlug: string) => void;
}

export function TopUpSection({
  isConnected,
  userLoading,
  loadingPack,
  onTopUp,
}: TopUpSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className="text-center mb-8 sm:mb-10 px-2">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3">
          Need more credits?{' '}
          <GradientText as="span">Top up anytime</GradientText>
        </h2>
        <p className="text-text-secondary text-sm sm:text-base max-w-lg mx-auto">
          Top-up credits never expire and work with any tier — even Free.
          Bigger packs = bigger bonuses.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
        {TOPUP_PACKS?.map((pack, index) => (
          <motion.div
            key={pack?.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + index * 0.08 }}
            className="group relative bg-surface border border-border rounded-xl p-4 sm:p-5 hover:border-accent-cyan/30 hover:shadow-[0_0_20px_rgba(0,212,255,0.1)] transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-base sm:text-lg">{pack?.name}</h3>
              {pack?.bonus && (
                <span className="text-xs bg-accent-cyan/10 text-accent-cyan px-2 py-0.5 rounded-full font-medium whitespace-nowrap ml-2">
                  {pack.bonus}
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-2xl sm:text-3xl font-bold">${pack?.price}</span>
            </div>
            <p className="text-text-muted text-sm mb-4">
              ${pack?.credits} in credits
            </p>
            <Button
              variant="secondary"
              size="md"
              className="w-full min-h-[44px] border-accent-cyan/20 hover:border-accent-cyan/40 active:scale-[0.97]"
              isLoading={loadingPack === pack?.slug}
              disabled={userLoading && isConnected}
              onClick={() => pack?.slug && onTopUp(pack.slug)}
            >
              {!isConnected ? (
                <>
                  <Wallet className="w-4 h-4 text-accent-cyan" />
                  Connect to Buy
                </>
              ) : userLoading ? (
                'Loading...'
              ) : (
                <>
                  <Zap className="w-4 h-4 text-accent-cyan" />
                  Buy Pack
                </>
              )}
            </Button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
