'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Wallet } from 'lucide-react';
import { Container } from '@/components/ui';
import { GradientText } from '@/components/effects/GradientText';
import { Button } from '@/components/ui/Button';
import { type SanctumTier } from '@/lib/sanctum-tiers';
import { useWallet } from '@/hooks/useWallet';
import { truncateAddress } from '@/lib/utils';
import { PricingCard } from './_components/PricingCard';
import { TopUpSection } from './_components/TopUpSection';
import { FAQSection } from './_components/FAQSection';

const tierOrder: SanctumTier[] = ['shade', 'specter', 'legion', 'leviathan'];

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const [loadingPack, setLoadingPack] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const { user, isConnected, isLoading: walletLoading, userLoading, openModal, accountId } = useWallet();

  async function handleSubscribe(tier: SanctumTier) {
    if (tier === 'shade') return;
    setCheckoutError(null);
    if (!isConnected) { openModal(); return; }
    if (userLoading || !user?.id) return;

    setLoadingTier(tier);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'subscription', tier, billingPeriod }),
      });
      const data = await res?.json();
      if (data?.url) {
        window.location.href = data.url;
      } else if (data?.error) {
        setCheckoutError(data.error);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setCheckoutError('Failed to start checkout. Please try again.');
    } finally {
      setLoadingTier(null);
    }
  }

  async function handleTopUp(packSlug: string) {
    setCheckoutError(null);
    if (!isConnected) { openModal(); return; }
    if (userLoading || !user?.id) return;

    setLoadingPack(packSlug);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'topup', packSlug }),
      });
      const data = await res?.json();
      if (data?.url) {
        window.location.href = data.url;
      } else if (data?.error) {
        setCheckoutError(data.error);
      }
    } catch (err) {
      console.error('Top-up error:', err);
      setCheckoutError('Failed to start checkout. Please try again.');
    } finally {
      setLoadingPack(null);
    }
  }

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] sm:w-[800px] h-[400px] sm:h-[600px] bg-near-green/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] sm:w-[600px] h-[300px] sm:h-[400px] bg-accent-cyan/5 rounded-full blur-[100px] pointer-events-none" />

      <Container className="relative z-10 py-10 sm:py-16 md:py-24 px-4 sm:px-6">
        {/* Connect Wallet Banner */}
        <AnimatePresence>
          {!walletLoading && !isConnected && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 sm:mb-8"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl border border-near-green/20 bg-near-green/5 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <Wallet className="w-5 h-5 text-near-green flex-shrink-0" />
                  <p className="text-sm text-text-secondary">
                    <span className="text-near-green font-medium">Connect your NEAR wallet</span>{' '}
                    to subscribe or purchase credits
                  </p>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={openModal}
                  className="min-h-[44px] sm:min-h-0 w-full sm:w-auto"
                >
                  Connect Wallet
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Checkout error banner */}
        <AnimatePresence>
          {checkoutError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6"
            >
              <div className="flex items-center gap-3 px-4 sm:px-5 py-3 rounded-xl border border-red-500/20 bg-red-500/5">
                <p className="text-sm text-red-400">{checkoutError}</p>
                <button
                  onClick={() => setCheckoutError(null)}
                  className="ml-auto text-red-400/60 hover:text-red-400 text-sm min-w-[44px] min-h-[44px] flex items-center justify-center"
                >
                  ✕
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <motion.div
          className="text-center mb-10 sm:mb-16 px-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full border border-near-green/20 bg-near-green/5 text-near-green text-xs sm:text-sm font-medium mb-4 sm:mb-6">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Sanctum AI Builder
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-3 sm:mb-4 tracking-tight">
            Power your builds with{' '}
            <GradientText as="span" animated>
              the void
            </GradientText>
          </h1>
          <p className="text-text-secondary text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Build like you have a team. You do. All Voidspace tools are free — Sanctum is the AI builder. Choose your tier.
          </p>
        </motion.div>

        {/* Billing Toggle + Wallet Status */}
        <motion.div
          className="flex flex-col items-center gap-3 mb-8 sm:mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-4 sm:px-4 py-2.5 sm:py-2 rounded-lg text-sm font-medium transition-all min-h-[44px] ${
                billingPeriod === 'monthly'
                  ? 'bg-surface border border-near-green/30 text-white shadow-[0_0_10px_rgba(0,236,151,0.15)]'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('annual')}
              className={`px-4 sm:px-4 py-2.5 sm:py-2 rounded-lg text-sm font-medium transition-all min-h-[44px] flex items-center gap-2 ${
                billingPeriod === 'annual'
                  ? 'bg-surface border border-near-green/30 text-white shadow-[0_0_10px_rgba(0,236,151,0.15)]'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              Annual
              <span className="text-xs bg-near-green/20 text-near-green px-2 py-0.5 rounded-full whitespace-nowrap">
                2 months free
              </span>
            </button>
          </div>

          {isConnected && accountId && (
            <div className="flex items-center gap-1.5 text-xs text-text-muted">
              <Wallet className="w-3 h-3" />
              <span>{truncateAddress(accountId)}</span>
            </div>
          )}
        </motion.div>

        {/* Tier Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-16 sm:mb-24">
          {tierOrder.map((tierKey, index) => (
            <PricingCard
              key={tierKey}
              tierKey={tierKey}
              billingPeriod={billingPeriod}
              isConnected={isConnected}
              userLoading={userLoading}
              loadingTier={loadingTier}
              index={index}
              onSubscribe={handleSubscribe}
              onGetStarted={() => (window.location.href = '/sanctum')}
            />
          ))}
        </div>

        {/* Top-Up Packs */}
        <TopUpSection
          isConnected={isConnected}
          userLoading={userLoading}
          loadingPack={loadingPack}
          onTopUp={handleTopUp}
        />

        {/* FAQ */}
        <FAQSection />
      </Container>
    </div>
  );
}
