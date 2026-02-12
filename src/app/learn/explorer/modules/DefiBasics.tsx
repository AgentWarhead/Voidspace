'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container, Card } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { GradientText } from '@/components/effects/GradientText';
import { GlowCard } from '@/components/effects/GlowCard';
import { cn } from '@/lib/utils';
import {
  BookOpen, Clock, CheckCircle2, ChevronDown,
  ArrowRightLeft, Coins, TrendingUp, Shield,
  AlertTriangle, Droplets, Percent,
  Lock, BarChart3,
} from 'lucide-react';

// ─── DeFi Concept Explorer ────────────────────────────────────────────────────

function DefiConceptExplorer() {
  const [activeConcept, setActiveConcept] = useState(0);

  const concepts = [
    {
      icon: ArrowRightLeft,
      title: 'Swapping (DEX)',
      emoji: '🔄',
      tagline: 'Trade tokens without a middleman.',
      description: 'A decentralized exchange (DEX) lets you swap one token for another directly from your wallet. No account creation, no KYC, no waiting. You\'re trading against a liquidity pool — a smart contract holding reserves of both tokens.',
      nearProject: 'Ref Finance',
      howItWorks: [
        'Connect your NEAR wallet to Ref Finance',
        'Select the token you want to swap FROM and TO',
        'Enter the amount — the DEX calculates the exchange rate',
        'Review the price impact and slippage',
        'Confirm the swap — tokens appear in your wallet instantly',
      ],
      risk: 'Price slippage on large trades. Always check the rate before confirming.',
    },
    {
      icon: Coins,
      title: 'Staking',
      emoji: '🥩',
      tagline: 'Earn rewards by securing the network.',
      description: 'Staking means locking your NEAR tokens to help validate transactions. In return, you earn staking rewards (~8-10% APY). Liquid staking (via Meta Pool) gives you stNEAR — a token that represents your staked NEAR and can be used in DeFi while still earning rewards.',
      nearProject: 'Meta Pool',
      howItWorks: [
        'Go to Meta Pool and connect your wallet',
        'Deposit NEAR to receive stNEAR (liquid staking token)',
        'Your stNEAR earns staking rewards automatically',
        'Use stNEAR in other DeFi protocols for extra yield',
        'Unstake anytime (1-2 epoch delay for withdrawal)',
      ],
      risk: 'Validator slashing risk (very rare on NEAR). Liquid staking tokens can depeg temporarily.',
    },
    {
      icon: TrendingUp,
      title: 'Lending & Borrowing',
      emoji: '🏦',
      tagline: 'Earn interest or borrow against your holdings.',
      description: 'Lending protocols let you deposit crypto to earn interest (like a savings account). You can also borrow against your deposits — useful for leverage or accessing cash without selling your crypto.',
      nearProject: 'Burrow',
      howItWorks: [
        'Deposit tokens (NEAR, USDC, etc.) as collateral',
        'Earn interest automatically — rates vary by supply/demand',
        'Optionally borrow against your deposits (up to ~70% of value)',
        'Pay back your loan + interest to reclaim collateral',
        'Watch your health factor — if it drops too low, you get liquidated',
      ],
      risk: 'Liquidation risk if collateral value drops. Always maintain a healthy collateral ratio.',
    },
    {
      icon: Droplets,
      title: 'Liquidity Pools',
      emoji: '🌊',
      tagline: 'Provide liquidity, earn trading fees.',
      description: 'Liquidity pools are the engine of DeFi. You deposit a pair of tokens (e.g., NEAR/USDC) into a pool. Every time someone swaps, you earn a share of the trading fees proportional to your pool share.',
      nearProject: 'Ref Finance',
      howItWorks: [
        'Choose a token pair (e.g., NEAR/USDC)',
        'Deposit equal value of both tokens',
        'Receive LP tokens representing your pool share',
        'Earn trading fees automatically (added to your position)',
        'Withdraw anytime by burning your LP tokens',
      ],
      risk: 'Impermanent loss — if token prices diverge, you may end up with less than if you just held. Works best in stable pairs.',
    },
  ];

  const concept = concepts[activeConcept];
  const Icon = concept.icon;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {concepts.map((c, i) => (
          <button
            key={c.title}
            onClick={() => setActiveConcept(i)}
            className={cn(
              'p-3 rounded-lg border text-center transition-all',
              activeConcept === i
                ? 'bg-near-green/10 border-near-green/30'
                : 'bg-surface border-border hover:border-border-hover'
            )}
          >
            <div className="text-xl mb-1">{c.emoji}</div>
            <div className={cn('text-xs font-medium', activeConcept === i ? 'text-near-green' : 'text-text-muted')}>
              {c.title}
            </div>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeConcept}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <Card variant="glass" padding="lg">
            <div className="flex items-center gap-3 mb-2">
              <Icon className="w-5 h-5 text-near-green" />
              <h3 className="text-xl font-bold text-text-primary">{concept.title}</h3>
            </div>
            <p className="text-near-green text-sm font-medium mb-3">{concept.tagline}</p>
            <p className="text-text-secondary leading-relaxed mb-4">{concept.description}</p>

            <div className="p-3 rounded-lg bg-surface border border-border mb-4">
              <div className="text-xs text-text-muted mb-1">On NEAR →</div>
              <div className="text-sm text-near-green font-bold">{concept.nearProject}</div>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-semibold text-text-primary mb-2">How It Works</h4>
              <div className="space-y-2">
                {concept.howItWorks.map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="flex items-start gap-3 text-sm text-text-secondary"
                  >
                    <span className="text-near-green font-mono text-xs font-bold mt-0.5">{i + 1}</span>
                    {step}
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-orange-500/5 border border-orange-500/15">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />
                <span className="text-xs font-bold text-orange-400">Risk</span>
              </div>
              <p className="text-xs text-text-secondary">{concept.risk}</p>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─── Risk Awareness ────────────────────────────────────────────────────────────

function RiskAwareness() {
  const risks = [
    {
      icon: AlertTriangle,
      title: 'Smart Contract Risk',
      desc: 'Bugs in code can lead to loss of funds. Only use audited protocols.',
      severity: 'High',
    },
    {
      icon: BarChart3,
      title: 'Impermanent Loss',
      desc: 'LP providers may lose value compared to simply holding tokens.',
      severity: 'Medium',
    },
    {
      icon: Lock,
      title: 'Liquidation Risk',
      desc: 'Borrowing too much against volatile collateral can lead to forced liquidation.',
      severity: 'High',
    },
    {
      icon: Percent,
      title: 'APY is Not Guaranteed',
      desc: 'Advertised yields can change based on supply, demand, and token prices.',
      severity: 'Medium',
    },
    {
      icon: Shield,
      title: 'Rug Pull Risk',
      desc: 'Unaudited projects may be scams. Always research before depositing.',
      severity: 'Critical',
    },
  ];

  return (
    <Card variant="default" padding="lg" className="border-orange-500/20">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-orange-400" />
        <h3 className="font-bold text-text-primary">⚠️ DeFi Risk Awareness</h3>
      </div>
      <p className="text-sm text-text-secondary mb-4">
        DeFi offers incredible opportunities, but also real risks. Understand them before you invest.
      </p>
      <div className="space-y-3">
        {risks.map((risk) => {
          const Icon = risk.icon;
          return (
            <div key={risk.title} className="flex items-start gap-3 p-3 rounded-lg bg-surface border border-border">
              <Icon className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-text-primary text-sm">{risk.title}</h4>
                  <span className={cn(
                    'text-[9px] px-1.5 py-0.5 rounded-full font-bold',
                    risk.severity === 'Critical' ? 'bg-red-500/10 text-red-400' :
                    risk.severity === 'High' ? 'bg-orange-500/10 text-orange-400' :
                    'bg-yellow-500/10 text-yellow-400'
                  )}>
                    {risk.severity}
                  </span>
                </div>
                <p className="text-xs text-text-muted mt-1">{risk.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 p-3 rounded-lg bg-near-green/5 border border-near-green/15">
        <p className="text-xs text-near-green">
          💡 Golden rule: Never invest more than you can afford to lose. Start small, learn the mechanics, then scale up.
        </p>
      </div>
    </Card>
  );
}

// ─── DeFi Glossary ─────────────────────────────────────────────────────────────

function DefiGlossary() {
  const [expandedTerm, setExpandedTerm] = useState<number | null>(null);

  const terms = [
    { term: 'TVL', full: 'Total Value Locked', definition: 'The total amount of assets deposited in a DeFi protocol. Higher TVL = more trust and liquidity.' },
    { term: 'APY', full: 'Annual Percentage Yield', definition: 'The annualized return including compound interest. A 10% APY means $100 becomes ~$110 in a year.' },
    { term: 'LP', full: 'Liquidity Provider', definition: 'Someone who deposits tokens into a pool. In return, they earn trading fees.' },
    { term: 'Slippage', full: 'Price Slippage', definition: 'The difference between expected and actual trade price. Higher with large trades or low liquidity.' },
    { term: 'IL', full: 'Impermanent Loss', definition: 'Loss of value experienced by LP providers when token prices change relative to when they deposited.' },
    { term: 'Yield Farming', full: 'Yield Farming', definition: 'Moving assets between protocols to maximize returns. Often involves LP tokens staked in farms for bonus rewards.' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {terms.map((t, i) => (
        <GlowCard key={t.term} padding="md" onClick={() => setExpandedTerm(expandedTerm === i ? null : i)}>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="text-near-green font-mono font-bold text-sm">{t.term}</span>
              <span className="text-xs text-text-muted">— {t.full}</span>
            </div>
            <motion.div animate={{ rotate: expandedTerm === i ? 180 : 0 }}>
              <ChevronDown className="w-3 h-3 text-text-muted" />
            </motion.div>
          </div>
          <AnimatePresence>
            {expandedTerm === i && (
              <motion.p
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="text-xs text-text-secondary mt-2 pt-2 border-t border-border overflow-hidden"
              >
                {t.definition}
              </motion.p>
            )}
          </AnimatePresence>
        </GlowCard>
      ))}
    </div>
  );
}

// ─── Mark Complete ─────────────────────────────────────────────────────────────

function MarkComplete({ moduleSlug }: { moduleSlug: string }) {
  const [completed, setCompleted] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      const progress = JSON.parse(localStorage.getItem('voidspace-explorer-progress') || '{}');
      return !!progress[moduleSlug];
    } catch { return false; }
  });

  const handleComplete = () => {
    try {
      const progress = JSON.parse(localStorage.getItem('voidspace-explorer-progress') || '{}');
      progress[moduleSlug] = true;
      localStorage.setItem('voidspace-explorer-progress', JSON.stringify(progress));
      setCompleted(true);
    } catch { /* noop */ }
  };

  return (
    <div className="flex justify-center">
      <Button
        variant={completed ? 'secondary' : 'primary'}
        size="lg"
        onClick={handleComplete}
        leftIcon={completed ? <CheckCircle2 className="w-5 h-5" /> : undefined}
        className={completed ? 'border-near-green/30 text-near-green' : ''}
      >
        {completed ? 'Module Completed ✓' : 'Mark as Complete'}
      </Button>
    </div>
  );
}

// ─── Main Module ───────────────────────────────────────────────────────────────

export function DefiBasics() {
  return (
    <Container size="md">
      <ScrollReveal>
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-near-green/20 bg-near-green/5 text-xs text-near-green mb-4">
            <BookOpen className="w-3 h-3" />
            Module 10 of 11
            <span className="text-text-muted">•</span>
            <Clock className="w-3 h-3" />
            15 min read
          </div>
          <GradientText as="h1" animated className="text-4xl md:text-5xl font-bold mb-4">
            DeFi Basics on NEAR
          </GradientText>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            <span className="text-near-green font-medium">Decentralized Finance</span> — swap, stake,
            lend, and earn. The financial layer of the new internet.
          </p>
        </div>
      </ScrollReveal>

      {/* What is DeFi */}
      <ScrollReveal delay={0.1}>
        <Card variant="glass" padding="lg" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-near-green/10 flex items-center justify-center">
              <Coins className="w-4 h-4 text-near-green" />
            </div>
            <h2 className="text-xl font-bold text-text-primary">What is DeFi?</h2>
          </div>
          <p className="text-text-secondary leading-relaxed text-lg mb-4">
            DeFi stands for <span className="text-near-green font-medium">Decentralized Finance</span> —
            financial services built on blockchain, without banks, brokers, or intermediaries.
            Trading, lending, borrowing, earning interest — all done through smart contracts,
            open to anyone, anywhere, 24/7.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { emoji: '🏦', title: 'No Banks', desc: 'Smart contracts replace financial institutions' },
              { emoji: '🌍', title: 'Global Access', desc: 'Anyone with a wallet can participate' },
              { emoji: '👁️', title: 'Transparent', desc: 'All rules and transactions are public' },
            ].map((item) => (
              <div key={item.title} className="p-3 rounded-lg bg-surface border border-border text-center">
                <div className="text-xl mb-1">{item.emoji}</div>
                <h4 className="font-bold text-text-primary text-sm">{item.title}</h4>
                <p className="text-[10px] text-text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </Card>
      </ScrollReveal>

      {/* Core Concepts */}
      <ScrollReveal delay={0.15}>
        <div className="mb-12">
          <h3 className="text-lg font-bold text-text-primary mb-2">💡 Core DeFi Concepts</h3>
          <p className="text-sm text-text-muted mb-6">Click each concept to see how it works on NEAR.</p>
          <DefiConceptExplorer />
        </div>
      </ScrollReveal>

      {/* Glossary */}
      <ScrollReveal delay={0.2}>
        <div className="mb-12">
          <h3 className="text-lg font-bold text-text-primary mb-4">📖 DeFi Glossary</h3>
          <DefiGlossary />
        </div>
      </ScrollReveal>

      {/* Risk Awareness */}
      <ScrollReveal delay={0.25}>
        <div className="mb-12">
          <RiskAwareness />
        </div>
      </ScrollReveal>

      {/* Key Takeaways */}
      <ScrollReveal delay={0.3}>
        <Card variant="glass" padding="lg" className="mb-12 border-near-green/20">
          <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-near-green" />
            Key Takeaways
          </h3>
          <ul className="space-y-2">
            {[
              'DeFi = financial services without banks, powered by smart contracts.',
              'Swapping: trade tokens on Ref Finance without intermediaries.',
              'Staking: earn ~8-10% APY by securing the network (Meta Pool for liquid staking).',
              'Lending: deposit to earn interest or borrow against collateral (Burrow).',
              'Liquidity pools: provide liquidity, earn trading fees, but watch for impermanent loss.',
              'Always understand the risks: smart contract bugs, liquidation, rug pulls. Start small.',
            ].map((point, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                <span className="text-near-green mt-0.5 font-bold">→</span>
                {point}
              </li>
            ))}
          </ul>
        </Card>
      </ScrollReveal>

      <ScrollReveal delay={0.35}>
        <MarkComplete moduleSlug="defi-basics" />
      </ScrollReveal>
    </Container>
  );
}
