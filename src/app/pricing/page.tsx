'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Zap, Crown, Rocket, Code2, Sparkles, ChevronRight } from 'lucide-react';
import { Container } from '@/components/ui';
import { GradientText } from '@/components/effects/GradientText';
import { Button } from '@/components/ui/Button';
import { SANCTUM_TIERS, TOPUP_PACKS, type SanctumTier } from '@/lib/sanctum-tiers';

const tierIcons: Record<SanctumTier, React.ReactNode> = {
  shade: <Code2 className="w-6 h-6" />,
  specter: <Rocket className="w-6 h-6" />,
  legion: <Zap className="w-6 h-6" />,
  leviathan: <Crown className="w-6 h-6" />,
};

const tierOrder: SanctumTier[] = ['shade', 'specter', 'legion', 'leviathan'];

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const [loadingPack, setLoadingPack] = useState<string | null>(null);

  async function handleSubscribe(tier: SanctumTier) {
    if (tier === 'shade') return;
    setLoadingTier(tier);
    try {
      // TODO: Get userId from auth context
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: '', // Will be filled from auth context
          type: 'subscription',
          tier,
          billingPeriod,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error('Checkout error:', err);
    } finally {
      setLoadingTier(null);
    }
  }

  async function handleTopUp(packSlug: string) {
    setLoadingPack(packSlug);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: '', // Will be filled from auth context
          type: 'topup',
          packSlug,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error('Top-up error:', err);
    } finally {
      setLoadingPack(null);
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-near-green/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-accent-cyan/5 rounded-full blur-[100px] pointer-events-none" />

      <Container className="relative z-10 py-16 md:py-24">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-near-green/20 bg-near-green/5 text-near-green text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Sanctum AI Builder
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
            Power your builds with{' '}
            <GradientText as="span" animated>
              the void
            </GradientText>
          </h1>
          <p className="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto">
            All Voidspace tools are free. Sanctum is the AI builder — credit-gated,
            infinitely powerful. Choose your tier.
          </p>
        </motion.div>

        {/* Billing Toggle */}
        <motion.div
          className="flex items-center justify-center gap-4 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <button
            onClick={() => setBillingPeriod('monthly')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              billingPeriod === 'monthly'
                ? 'bg-surface border border-near-green/30 text-white shadow-[0_0_10px_rgba(0,236,151,0.15)]'
                : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingPeriod('annual')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              billingPeriod === 'annual'
                ? 'bg-surface border border-near-green/30 text-white shadow-[0_0_10px_rgba(0,236,151,0.15)]'
                : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            Annual
            <span className="text-xs bg-near-green/20 text-near-green px-2 py-0.5 rounded-full">
              2 months free
            </span>
          </button>
        </motion.div>

        {/* Tier Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {tierOrder.map((tierKey, index) => {
            const tier = SANCTUM_TIERS[tierKey];
            const price = billingPeriod === 'annual' ? tier.annualPrice : tier.monthlyPrice;
            const monthlyEquivalent = billingPeriod === 'annual' && tier.annualPrice > 0
              ? Math.round(tier.annualPrice / 12)
              : tier.monthlyPrice;

            return (
              <motion.div
                key={tierKey}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
                className={`relative group rounded-xl overflow-hidden ${
                  tier.popular
                    ? 'ring-2 ring-near-green/50 shadow-[0_0_30px_rgba(0,236,151,0.15)]'
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
                  className={`relative bg-surface border border-border rounded-xl p-6 h-full flex flex-col transition-all duration-300 hover:border-opacity-50 ${
                    tier.popular ? 'pt-10' : ''
                  }`}
                  style={{
                    ['--tier-color' as string]: tier.color,
                  }}
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
                        <h3 className="text-lg font-bold" style={{ color: tier.color }}>
                          {tier.name}
                        </h3>
                        <p className="text-text-muted text-xs">{tier.tagline}</p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="mb-6">
                      {tierKey === 'shade' ? (
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-bold">$0</span>
                          <span className="text-text-muted text-sm">forever</span>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-bold">
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
                      <div className="flex items-center gap-2 mb-5 px-3 py-2 rounded-lg bg-white/5 border border-white/5">
                        <Zap className="w-4 h-4" style={{ color: tier.color }} />
                        <span className="text-sm font-medium">
                          ${tier.creditsPerMonth}/mo in credits
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 mb-5 px-3 py-2 rounded-lg bg-white/5 border border-white/5">
                        <Sparkles className="w-4 h-4 text-text-muted" />
                        <span className="text-sm font-medium text-text-secondary">
                          $2.50 starter credits
                        </span>
                      </div>
                    )}

                    {/* Features */}
                    <ul className="space-y-2.5 mb-8 flex-1">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2.5 text-sm">
                          <Check
                            className="w-4 h-4 mt-0.5 flex-shrink-0"
                            style={{ color: tier.color }}
                          />
                          <span className="text-text-secondary">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    {tierKey === 'shade' ? (
                      <Button
                        variant="secondary"
                        size="lg"
                        className="w-full"
                        onClick={() => (window.location.href = '/sanctum')}
                      >
                        Get Started
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button
                        variant={tier.popular ? 'primary' : 'secondary'}
                        size="lg"
                        className="w-full"
                        isLoading={loadingTier === tierKey}
                        onClick={() => handleSubscribe(tierKey)}
                        style={
                          !tier.popular
                            ? { borderColor: `${tier.color}30`, color: tier.color }
                            : undefined
                        }
                      >
                        Subscribe
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Top-Up Packs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Need more credits?{' '}
              <GradientText as="span">Top up anytime</GradientText>
            </h2>
            <p className="text-text-secondary max-w-lg mx-auto">
              Top-up credits never expire and work with any tier — even Free.
              Bigger packs = bigger bonuses.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {TOPUP_PACKS.map((pack, index) => (
              <motion.div
                key={pack.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.08 }}
                className="group relative bg-surface border border-border rounded-xl p-5 hover:border-accent-cyan/30 hover:shadow-[0_0_20px_rgba(0,212,255,0.1)] transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-lg">{pack.name}</h3>
                  {pack.bonus && (
                    <span className="text-xs bg-accent-cyan/10 text-accent-cyan px-2 py-0.5 rounded-full font-medium">
                      {pack.bonus}
                    </span>
                  )}
                </div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-3xl font-bold">${pack.price}</span>
                </div>
                <p className="text-text-muted text-sm mb-4">
                  ${pack.credits} in credits
                </p>
                <Button
                  variant="secondary"
                  size="md"
                  className="w-full border-accent-cyan/20 hover:border-accent-cyan/40"
                  isLoading={loadingPack === pack.slug}
                  onClick={() => handleTopUp(pack.slug)}
                >
                  <Zap className="w-4 h-4 text-accent-cyan" />
                  Buy Pack
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* FAQ / Credit explanation */}
        <motion.div
          className="mt-24 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <h3 className="text-xl font-bold text-center mb-8">How credits work</h3>
          <div className="space-y-4">
            {[
              {
                q: 'What is 1 credit?',
                a: '$1 of AI compute in Sanctum. A typical build session uses ~$5 in credits.',
              },
              {
                q: 'Do subscription credits roll over?',
                a: 'No. Subscription credits reset each billing cycle. Use them or lose them.',
              },
              {
                q: 'Do top-up credits expire?',
                a: 'Never. Top-up credits stay in your account until you use them.',
              },
              {
                q: 'Which credits are used first?',
                a: 'Subscription credits burn first. Top-ups are only used after subscription credits run out.',
              },
              {
                q: 'Can I top up on the Free tier?',
                a: 'Yes! Top-ups are available to all tiers, including Free.',
              },
            ].map((faq) => (
              <div
                key={faq.q}
                className="bg-surface border border-border rounded-lg p-4"
              >
                <p className="font-medium text-sm mb-1">{faq.q}</p>
                <p className="text-text-muted text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </Container>
    </div>
  );
}
