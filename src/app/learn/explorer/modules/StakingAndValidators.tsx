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
  Shield, Coins, TrendingUp, Users,
  Zap, Lock, Calculator, Server,
  AlertTriangle, Droplets, Percent,
} from 'lucide-react';

// ─── Staking Concept Explorer ──────────────────────────────────────────────────

function StakingConceptExplorer() {
  const [activeConcept, setActiveConcept] = useState(0);

  const concepts = [
    {
      icon: Shield,
      title: 'Proof of Stake',
      emoji: '🛡️',
      tagline: 'Secure the network by locking tokens.',
      description: 'NEAR uses a Proof of Stake (PoS) consensus mechanism called Nightshade. Instead of using energy-intensive mining, validators stake NEAR tokens as collateral. If they validate honestly, they earn rewards. If they act maliciously, their stake gets "slashed" (partially taken). This creates economic incentives for honest behavior.',
      nearProject: 'NEAR Protocol',
      howItWorks: [
        'Validators run nodes and stake NEAR tokens as collateral',
        'They are assigned to validate blocks based on their stake size',
        'Honest validation earns staking rewards (~8-10% APY)',
        'Nightshade sharding distributes work across multiple shards',
        'Each epoch (~12 hours), validators are reassigned and rewards distributed',
      ],
      risk: 'Running a validator requires technical expertise and a significant stake (currently ~45,000 NEAR seat price).',
    },
    {
      icon: Users,
      title: 'Delegation',
      emoji: '🤝',
      tagline: 'Stake without running a node.',
      description: 'You don\'t need to run a validator to earn staking rewards. Delegation lets you stake your NEAR with an existing validator. You keep ownership of your tokens — they\'re locked in a staking contract, not transferred. The validator takes a small fee (typically 5-10%) and you earn the rest of the rewards.',
      nearProject: 'near-staking.com',
      howItWorks: [
        'Choose a validator from the active validator list',
        'Delegate (stake) your NEAR tokens to that validator',
        'Rewards accrue automatically each epoch (~12 hours)',
        'You can unstake anytime — there\'s a 2-3 epoch waiting period',
        'After the unstaking period, withdraw your NEAR + accumulated rewards',
      ],
      risk: 'Choose reliable validators with high uptime. If a validator has too much downtime, rewards decrease.',
    },
    {
      icon: Droplets,
      title: 'Liquid Staking',
      emoji: '💧',
      tagline: 'Stake and stay liquid — use your tokens in DeFi.',
      description: 'Liquid staking is the best of both worlds. You stake your NEAR and receive a liquid staking token (stNEAR from Meta Pool or LiNEAR from LiNEAR Protocol) that represents your staked position. This token earns staking rewards AND can be used in DeFi — lending, LP pools, or as collateral.',
      nearProject: 'Meta Pool & LiNEAR',
      howItWorks: [
        'Deposit NEAR into Meta Pool to receive stNEAR, or LiNEAR Protocol for LiNEAR',
        'Your liquid staking token automatically appreciates in value (reflecting rewards)',
        'Use stNEAR/LiNEAR in DeFi protocols (Ref Finance, Burrow) for extra yield',
        'Meta Pool distributes your stake across many validators for decentralization',
        'Unstake anytime — instant unstake available for a small fee (~0.3%)',
      ],
      risk: 'Liquid staking tokens can temporarily trade below their theoretical value (depeg). Smart contract risk also applies.',
    },
    {
      icon: Server,
      title: 'Choosing a Validator',
      emoji: '🔍',
      tagline: 'Not all validators are equal.',
      description: 'Choosing the right validator matters. Look for high uptime (99%+), reasonable fees (5-10%), and a track record of consistent block production. Supporting smaller validators helps decentralize the network. NEAR currently has ~100 active validators, with a seat price that fluctuates based on total stake.',
      nearProject: 'NEAR Validators',
      howItWorks: [
        'Check uptime percentage — 99%+ is ideal for maximum rewards',
        'Compare commission fees — most charge 5-10% of your rewards',
        'Look at total stake — very large validators may not need more delegation',
        'Consider supporting smaller validators to improve decentralization',
        'Review their track record on near-staking.com or NearBlocks validators page',
      ],
      risk: 'Avoid validators with frequent downtime or very high fees. Diversify across multiple validators if staking large amounts.',
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
                ? 'bg-gradient-to-br from-emerald-500/15 to-cyan-500/15 border-emerald-500/30'
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
                <span className="text-xs font-bold text-orange-400">Note</span>
              </div>
              <p className="text-xs text-text-secondary">{concept.risk}</p>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─── Staking Rewards Calculator ────────────────────────────────────────────────

function StakingCalculator() {
  const [amount, setAmount] = useState(100);
  const [period, setPeriod] = useState(12);
  const apy = 9.5;

  const rewards = amount * (apy / 100) * (period / 12);
  const total = amount + rewards;
  const monthly = rewards / period;

  return (
    <Card variant="default" padding="lg" className="border-near-green/20">
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="w-5 h-5 text-near-green" />
        <h3 className="font-bold text-text-primary">📊 Staking Rewards Calculator</h3>
      </div>
      <p className="text-sm text-text-secondary mb-6">
        See how much you could earn by staking NEAR. Adjust the amount and time period.
      </p>

      <div className="space-y-4 mb-6">
        <div>
          <label className="text-xs text-text-muted mb-1 block">Amount to Stake (NEAR)</label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={10}
              max={10000}
              step={10}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="flex-1 accent-[#00ec97]"
            />
            <span className="font-mono text-near-green font-bold w-20 text-right">{amount.toLocaleString()}</span>
          </div>
        </div>

        <div>
          <label className="text-xs text-text-muted mb-1 block">Staking Period (months)</label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={1}
              max={36}
              value={period}
              onChange={(e) => setPeriod(Number(e.target.value))}
              className="flex-1 accent-[#00ec97]"
            />
            <span className="font-mono text-near-green font-bold w-20 text-right">{period} mo</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'APY', value: `~${apy}%`, icon: Percent },
          { label: 'Monthly Earn', value: `${monthly.toFixed(1)} Ⓝ`, icon: TrendingUp },
          { label: 'Total Rewards', value: `${rewards.toFixed(1)} Ⓝ`, icon: Coins },
          { label: 'Final Balance', value: `${total.toFixed(1)} Ⓝ`, icon: Zap },
        ].map((stat) => {
          const StatIcon = stat.icon;
          return (
            <div key={stat.label} className="p-3 rounded-lg bg-surface border border-border text-center">
              <StatIcon className="w-4 h-4 text-near-green mx-auto mb-1" />
              <div className="text-near-green font-bold text-lg">{stat.value}</div>
              <div className="text-[10px] text-text-muted">{stat.label}</div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 p-3 rounded-lg bg-near-green/5 border border-near-green/15">
        <p className="text-xs text-near-green">
          💡 This is an estimate based on ~{apy}% APY. Actual rewards vary based on network conditions, validator uptime, and total stake.
          Liquid staking (Meta Pool, LiNEAR) typically yields slightly less due to protocol fees.
        </p>
      </div>
    </Card>
  );
}

// ─── Liquid Staking Comparison ─────────────────────────────────────────────────

function LiquidStakingComparison() {
  const protocols = [
    {
      name: 'Meta Pool',
      token: 'stNEAR',
      apy: '~8.5-9.5%',
      validators: '80+',
      feature: 'Instant unstake available, largest liquid staking on NEAR',
      website: 'metapool.app',
    },
    {
      name: 'LiNEAR Protocol',
      token: 'LiNEAR',
      apy: '~8-9%',
      validators: '50+',
      feature: 'Algorithmic validator selection for optimal returns',
      website: 'linearprotocol.org',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {protocols.map((p) => (
        <GlowCard key={p.name} padding="md">
          <div className="flex items-center gap-2 mb-2">
            <Droplets className="w-4 h-4 text-near-green" />
            <h4 className="font-bold text-text-primary text-sm">{p.name}</h4>
          </div>
          <div className="space-y-1 mb-3">
            <div className="flex justify-between text-xs">
              <span className="text-text-muted">Token</span>
              <span className="text-near-green font-mono font-bold">{p.token}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-text-muted">APY</span>
              <span className="text-text-primary">{p.apy}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-text-muted">Validators</span>
              <span className="text-text-primary">{p.validators}</span>
            </div>
          </div>
          <p className="text-[10px] text-text-muted">{p.feature}</p>
        </GlowCard>
      ))}
    </div>
  );
}

// ─── Staking Glossary ──────────────────────────────────────────────────────────

function StakingGlossary() {
  const [expandedTerm, setExpandedTerm] = useState<number | null>(null);

  const terms = [
    { term: 'Epoch', full: 'Network Epoch', definition: 'A time period (~12 hours on NEAR) after which validators rotate, rewards distribute, and stake changes take effect.' },
    { term: 'Slashing', full: 'Stake Slashing', definition: 'Penalty for validator misbehavior. A portion of staked tokens is burned. Extremely rare on NEAR due to protocol design.' },
    { term: 'Seat Price', full: 'Validator Seat Price', definition: 'The minimum stake required to become a validator. Fluctuates based on total network stake (~45,000+ NEAR).' },
    { term: 'APY', full: 'Annual Percentage Yield', definition: 'The annualized return on staking, including compound interest. NEAR staking yields ~8-10% APY.' },
    { term: 'Delegation', full: 'Token Delegation', definition: 'Staking your tokens with a validator without running a node. You retain ownership; the validator validates on your behalf.' },
    { term: 'Unstaking', full: 'Unstaking Period', definition: 'The waiting period (2-3 epochs, ~36 hours) to withdraw staked tokens. Liquid staking offers instant unstake for a small fee.' },
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

export function StakingAndValidators() {
  return (
    <Container size="md">
      <ScrollReveal>
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-near-green/20 bg-near-green/5 text-xs text-near-green mb-4">
            <BookOpen className="w-3 h-3" />
            Module 13 of 16
            <span className="text-text-muted">•</span>
            <Clock className="w-3 h-3" />
            15 min read
          </div>
          <GradientText as="h1" animated className="text-4xl md:text-5xl font-bold mb-4">
            Staking & Validators
          </GradientText>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            <span className="text-near-green font-medium">Proof of Stake</span> — earn rewards by
            securing the network. Delegate, liquid stake, or run your own validator.
          </p>
        </div>
      </ScrollReveal>

      {/* What is Staking */}
      <ScrollReveal delay={0.1}>
        <Card variant="glass" padding="lg" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center shadow-lg shadow-emerald-500/10 backdrop-blur-sm">
              <Lock className="w-4 h-4 text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold text-text-primary">What is Staking?</h2>
          </div>
          <p className="text-text-secondary leading-relaxed text-lg mb-4">
            Staking is the process of <span className="text-near-green font-medium">locking your NEAR tokens</span> to
            help validate transactions on the network. In return, you earn staking rewards — passive income
            for supporting blockchain security. Think of it like earning interest on a savings account, but
            instead of a bank, you&apos;re securing a decentralized network.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { emoji: '🔒', title: 'Lock & Earn', desc: 'Stake tokens to earn ~8-10% APY' },
              { emoji: '🛡️', title: 'Secure Network', desc: 'Your stake helps validate transactions' },
              { emoji: '💧', title: 'Stay Liquid', desc: 'Liquid staking lets you use tokens in DeFi' },
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
          <h3 className="text-lg font-bold text-text-primary mb-2">💡 Staking Deep Dive</h3>
          <p className="text-sm text-text-muted mb-6">Explore the different aspects of staking on NEAR.</p>
          <StakingConceptExplorer />
        </div>
      </ScrollReveal>

      {/* Liquid Staking Comparison */}
      <ScrollReveal delay={0.18}>
        <div className="mb-12">
          <h3 className="text-lg font-bold text-text-primary mb-4">💧 Liquid Staking Protocols</h3>
          <p className="text-sm text-text-muted mb-4">Compare the two leading liquid staking protocols on NEAR.</p>
          <LiquidStakingComparison />
        </div>
      </ScrollReveal>

      {/* Calculator */}
      <ScrollReveal delay={0.2}>
        <div className="mb-12">
          <StakingCalculator />
        </div>
      </ScrollReveal>

      {/* Glossary */}
      <ScrollReveal delay={0.25}>
        <div className="mb-12">
          <h3 className="text-lg font-bold text-text-primary mb-4">📖 Staking Glossary</h3>
          <StakingGlossary />
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
              'NEAR uses Proof of Stake (Nightshade) — validators stake tokens to secure the network.',
              'You can delegate NEAR to validators without running a node and earn ~8-10% APY.',
              'Liquid staking (Meta Pool → stNEAR, LiNEAR → LiNEAR) lets you stake and use DeFi simultaneously.',
              'Choose validators with high uptime (99%+), reasonable fees, and support smaller ones for decentralization.',
              'Unstaking takes 2-3 epochs (~36 hours). Liquid staking offers instant unstake for a small fee.',
              'Staking is one of the lowest-risk ways to earn passive income in crypto.',
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
        <MarkComplete moduleSlug="staking-and-validators" />
      </ScrollReveal>
    </Container>
  );
}
