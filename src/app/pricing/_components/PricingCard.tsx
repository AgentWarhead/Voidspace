'use client';

import { motion } from 'framer-motion';
import { Check, Zap, Crown, Rocket, Code2, Sparkles, ChevronRight, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SANCTUM_TIERS, type SanctumTier } from '@/lib/sanctum-tiers';

const tierIcons: Record<SanctumTier, React.ReactNode> = {
  shade: <Code2 className="w-5 h-5 sm:w-6 sm:h-6" />,
  specter: <Rocket className="w-5 h-5 sm:w-6 sm:h-6" />,
  legion: <Zap className="w-5 h-5 sm:w-6 sm:h-6" />,
  leviathan: <Crown className="w-5 h-5 sm:w-6 sm:h-6" />,
};

interface PricingCardProps {
  tierKey: SanctumTier;
  billingPeriod: 'monthly' | 'annual';
  isConnected: boolean;
  userLoading: boolean;
  loadingTier: string | null;
  index: number;
  onSubscribe: (tier: SanctumTier) => void;
  onGetStarted: () => void;
}

export function PricingCard({
  tierKey,
  billingPeriod,
  isConnected,
  userLoading,
  loadingTier,
  index,
  onSubscribe,
  onGetStarted,
}: PricingCardProps) {
  const tier = SANCTUM_TIERS[tierKey];
  const price = billingPeriod === 'annual' ? tier?.annualPrice : tier?.monthlyPrice;
  const monthlyEquivalent =
    billingPeriod === 'annual' && (tier?.annualPrice ?? 0) > 0
      ? Math.round((tier?.annualPrice ?? 0) / 12)
      : tier?.monthlyPrice ?? 0;

  if (!tier) return null;

  return (
    <motion.div
      key={tierKey}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index, duration: 0.5 }}
      className={`relative group rounded-xl overflow-hidden ${
        tier.popular
          ? 'ring-2 ring-near-green/50 shadow-[0_0_30px_rgba(0,236,151,0.15)] md:-mt-2 md:mb-[-8px]'
          : ''
      }`}
    >
      {/* Popular badge */}
      {tier.popular && (
        <div className="absolute top-0 left-0 right-0 bg-near-green text-background text-xs font-bold text-center py-1.5 z-20">
          MOST POPULAR
        </div>
      )}

      <div
        className={`relative bg-surface border border-border rounded-xl p-4 sm:p-6 h-full flex flex-col transition-all duration-300 hover:border-opacity-50 ${
          tier.popular ? 'pt-9 sm:pt-10' : ''
        }`}
      >
        {/* Hover glow */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-xl"
          style={{
            background: `radial-gradient(ellipse at 50% 0%, ${tier.glowColor}, transparent 70%)`,
          }}
        />

        <div className="relative z-10 flex flex-col h-full">
          {/* Tier icon + name */}
          <div className="flex items-center gap-3 mb-3">
            <div
              className="p-2 rounded-lg"
              style={{ backgroundColor: `${tier.color}15`, color: tier.color }}
            >
              {tierIcons[tierKey]}
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold" style={{ color: tier.color }}>
                {tier.name}
              </h3>
              <p className="text-text-muted text-xs">{tier.tagline}</p>
            </div>
          </div>

          {/* Price */}
          <div className="mb-4 sm:mb-6">
            {tierKey === 'shade' ? (
              <div className="flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-bold">$0</span>
                <span className="text-text-muted text-sm">forever</span>
              </div>
            ) : (
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-bold">
                    ${billingPeriod === 'annual' ? monthlyEquivalent : price}
                  </span>
                  <span className="text-text-muted text-sm">/mo</span>
                </div>
                {billingPeriod === 'annual' && (
                  <p className="text-text-muted text-xs mt-1">
                    ${price}/yr — billed annually
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Credits highlight */}
          {tierKey !== 'shade' ? (
            <div className="flex items-center gap-2 mb-4 sm:mb-5 px-3 py-2 rounded-lg bg-white/5 border border-white/5">
              <Zap className="w-4 h-4 flex-shrink-0" style={{ color: tier.color }} />
              <span className="text-sm font-medium">
                ${tier.creditsPerMonth}/mo in credits
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 mb-4 sm:mb-5 px-3 py-2 rounded-lg bg-white/5 border border-white/5">
              <Sparkles className="w-4 h-4 text-text-muted flex-shrink-0" />
              <span className="text-sm font-medium text-text-secondary">
                $2.50 starter credits
              </span>
            </div>
          )}

          {/* Features */}
          <ul className="space-y-2 sm:space-y-2.5 mb-6 sm:mb-8 flex-1">
            {tier.features?.map((feature) => (
              <li key={feature} className="flex items-start gap-2.5 text-sm">
                <Check
                  className="w-4 h-4 mt-0.5 flex-shrink-0"
                  style={{ color: tier.color }}
                />
                <span className="text-text-secondary leading-snug">{feature}</span>
              </li>
            ))}
          </ul>

          {/* CTA Button */}
          {tierKey === 'shade' ? (
            <Button
              variant="secondary"
              size="lg"
              className="w-full min-h-[44px] active:scale-[0.97]"
              onClick={onGetStarted}
            >
              Get Started
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              variant={tier.popular ? 'primary' : 'secondary'}
              size="lg"
              className="w-full min-h-[44px] active:scale-[0.97]"
              isLoading={loadingTier === tierKey}
              disabled={userLoading && isConnected}
              onClick={() => onSubscribe(tierKey)}
              style={
                !tier.popular
                  ? { borderColor: `${tier.color}30`, color: tier.color }
                  : undefined
              }
            >
              {!isConnected ? (
                <>
                  Connect to Subscribe
                  <Wallet className="w-4 h-4" />
                </>
              ) : userLoading ? (
                'Loading...'
              ) : (
                <>
                  Subscribe
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
