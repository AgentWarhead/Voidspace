'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, X, ExternalLink, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { GradientText } from '@/components/effects/GradientText';
import { SANCTUM_TIERS, TOPUP_PACKS, type SanctumTier } from '@/lib/sanctum-tiers';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBalance?: number;
  userId?: string;
}

const PAID_TIERS: SanctumTier[] = ['specter', 'legion', 'leviathan'];

export function UpgradeModal({ isOpen, onClose, currentBalance, userId }: UpgradeModalProps) {
  const [loadingPack, setLoadingPack] = useState<string | null>(null);
  const [loadingTier, setLoadingTier] = useState<string | null>(null);

  async function handleTopUp(packSlug: string) {
    setLoadingPack(packSlug);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId || '',
          type: 'topup',
          packSlug,
        }),
      });
      const data = await res?.json();
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error('Top-up error:', err);
    } finally {
      setLoadingPack(null);
    }
  }

  async function handleSubscribe(tier: SanctumTier) {
    setLoadingTier(tier);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId || '',
          type: 'subscription',
          tier,
          billingPeriod: 'monthly',
        }),
      });
      const data = await res?.json();
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error('Checkout error:', err);
    } finally {
      setLoadingTier(null);
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-void-black/80 backdrop-blur-md"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal Card */}
          <motion.div
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-near-green/20 bg-void-black/95 shadow-[0_0_60px_rgba(0,236,151,0.08)] backdrop-blur-xl"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            {/* Glow border effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-near-green/10 via-transparent to-accent-cyan/5 pointer-events-none" />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-text-muted hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative p-6 md:p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/20 mb-4">
                  <Zap className="w-7 h-7 text-amber-400" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">
                  <GradientText as="span" animated>Credits Depleted</GradientText>
                </h2>
                <p className="text-text-secondary text-sm md:text-base">
                  Your Sanctum session needs more fuel to keep building.
                </p>
                {typeof currentBalance === 'number' && (
                  <p className="text-xs text-text-muted mt-1">
                    Current balance: <span className="text-amber-400">${currentBalance?.toFixed(2)}</span>
                  </p>
                )}
              </div>

              {/* Quick Top-Up Section */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Quick Top-Up
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {TOPUP_PACKS?.map((pack) => (
                    <motion.button
                      key={pack?.slug}
                      onClick={() => handleTopUp(pack?.slug)}
                      disabled={loadingPack === pack?.slug}
                      className="relative group rounded-xl border border-border-subtle hover:border-amber-500/40 bg-surface/50 hover:bg-amber-500/5 p-4 text-center transition-all duration-200"
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {pack?.bonus && (
                        <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-[10px] font-bold text-amber-400">
                          {pack.bonus}
                        </span>
                      )}
                      <div className="text-lg font-bold text-white">{pack?.name}</div>
                      <div className="text-2xl font-black text-near-green mt-1">${pack?.price}</div>
                      <div className="text-xs text-text-muted mt-1">${pack?.credits} credits</div>
                      {loadingPack === pack?.slug && (
                        <div className="absolute inset-0 rounded-xl bg-void-black/60 flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-near-green/30 border-t-near-green rounded-full animate-spin" />
                        </div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Upgrade Tier Section */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3 flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-accent-cyan" />
                  Upgrade Your Tier
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {PAID_TIERS?.map((tierKey) => {
                    const tier = SANCTUM_TIERS?.[tierKey];
                    if (!tier) return null;
                    return (
                      <motion.div
                        key={tierKey}
                        className="relative rounded-xl border bg-surface/30 p-4 transition-all duration-200"
                        style={{
                          borderColor: `${tier.color}30`,
                        }}
                        whileHover={{
                          borderColor: tier.color,
                          boxShadow: `0 0 20px ${tier.glowColor}`,
                        }}
                      >
                        {tier.popular && (
                          <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-near-green/20 border border-near-green/30 text-[10px] font-bold text-near-green">
                            POPULAR
                          </span>
                        )}
                        <div className="text-center">
                          <div className="font-bold text-white" style={{ color: tier.color }}>
                            {tier.name}
                          </div>
                          <div className="text-xl font-black text-white mt-1">
                            ${tier.monthlyPrice}<span className="text-sm font-normal text-text-muted">/mo</span>
                          </div>
                          <div className="text-xs text-text-muted mt-1">
                            ${tier.creditsPerMonth} credits/mo
                          </div>
                          <Button
                            variant={tier.popular ? 'primary' : 'secondary'}
                            size="sm"
                            className="w-full mt-3"
                            isLoading={loadingTier === tierKey}
                            onClick={() => handleSubscribe(tierKey)}
                          >
                            Subscribe
                          </Button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Footer links */}
              <div className="flex flex-col items-center gap-3 pt-2 border-t border-border-subtle">
                <a
                  href="/pricing"
                  className="inline-flex items-center gap-1.5 text-sm text-near-green hover:text-near-green/80 transition-colors"
                >
                  View full pricing & features
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  onClick={onClose}
                  className="text-xs text-text-muted hover:text-text-secondary transition-colors"
                >
                  or continue on free tier
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
