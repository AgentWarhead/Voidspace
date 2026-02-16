'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import {
  ChevronDown, ChevronUp, CheckCircle2, Lightbulb, Zap, Shield,
  AlertTriangle, ArrowRight, Workflow, Globe, Key, Network, Users,
  Layers, RefreshCw,
} from 'lucide-react';

// ─── Interactive Visual: Intent Resolution Pipeline ──────────────────────────

function IntentPipelineVisual() {
  const [activeStage, setActiveStage] = useState<number | null>(null);

  const stages = [
    {
      id: 0,
      label: 'Intent Declaration',
      icon: '📝',
      color: 'from-violet-500/20 to-purple-500/20',
      border: 'border-violet-500/40',
      detail: 'User declares: "Swap 100 USDC for max NEAR across any chain." No execution path specified — just the desired outcome, constraints, and deadline.',
    },
    {
      id: 1,
      label: 'Solver Auction',
      icon: '⚡',
      color: 'from-purple-500/20 to-pink-500/20',
      border: 'border-purple-500/40',
      detail: 'Multiple solvers compete: Solver A bids 48.2 NEAR (via Ethereum bridge), Solver B bids 48.5 NEAR (native DEX), Solver C bids 48.1 NEAR (cross-chain aggregator). Best price wins.',
    },
    {
      id: 2,
      label: 'Execution Plan',
      icon: '🗺️',
      color: 'from-pink-500/20 to-red-500/20',
      border: 'border-pink-500/40',
      detail: 'Winning solver constructs the execution: Route through Ref Finance, split across 3 pools for minimal slippage, bridge from Ethereum if needed. User never sees this complexity.',
    },
    {
      id: 3,
      label: 'Cross-chain Settlement',
      icon: '✅',
      color: 'from-emerald-500/20 to-cyan-500/20',
      border: 'border-emerald-500/40',
      detail: 'Transactions execute atomically across chains. User receives 48.5 NEAR in their wallet. Settlement is verified on-chain. Solver collects their fee from the spread.',
    },
  ];

  return (
    <div className="relative py-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stages.map((stage, i) => (
          <div key={stage.id} className="flex flex-col items-center">
            <motion.div
              className={cn(
                'relative w-full p-3 rounded-xl border cursor-pointer transition-all text-center',
                activeStage === stage.id
                  ? `bg-gradient-to-br ${stage.color} ${stage.border} shadow-lg`
                  : 'bg-surface border-border hover:border-border-hover'
              )}
              whileHover={{ scale: 1.03, y: -2 }}
              onClick={() => setActiveStage(activeStage === stage.id ? null : stage.id)}
            >
              <div className="text-2xl mb-2">{stage.icon}</div>
              <p className="text-xs font-semibold text-text-primary">{stage.label}</p>
              {i < stages.length - 1 && (
                <div className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 text-text-muted z-10">
                  <ArrowRight className="w-3 h-3" />
                </div>
              )}
            </motion.div>
            <AnimatePresence>
              {activeStage === stage.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden w-full"
                >
                  <div className="mt-2 p-3 rounded-lg bg-surface border border-border text-xs text-text-secondary leading-relaxed">
                    {stage.detail}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
      {/* Solver bidding visualization */}
      <div className="mt-6 p-4 rounded-xl bg-surface border border-border">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-text-primary">Solver Bids (Live Auction)</p>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            3 solvers competing
          </span>
        </div>
        <div className="space-y-1.5">
          {[
            { name: 'Solver A', bid: '48.2 NEAR', route: 'ETH Bridge → Ref', pct: 72 },
            { name: 'Solver B', bid: '48.5 NEAR', route: 'Native DEX', pct: 85, winner: true },
            { name: 'Solver C', bid: '48.1 NEAR', route: 'Cross-chain Agg', pct: 68 },
          ].map((s) => (
            <div key={s.name} className="flex items-center gap-2">
              <span className={cn('text-xs font-mono w-16', s.winner ? 'text-emerald-400' : 'text-text-muted')}>{s.name}</span>
              <div className="flex-1 h-2 bg-surface-hover rounded-full overflow-hidden">
                <motion.div
                  className={cn('h-full rounded-full', s.winner ? 'bg-emerald-500' : 'bg-purple-500/50')}
                  initial={{ width: 0 }}
                  animate={{ width: `${s.pct}%` }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                />
              </div>
              <span className={cn('text-xs font-mono w-24 text-right', s.winner ? 'text-emerald-400 font-bold' : 'text-text-muted')}>
                {s.bid} {s.winner && '✓'}
              </span>
            </div>
          ))}
        </div>
      </div>
      <p className="text-center text-xs text-text-muted mt-4">Click each stage to explore the intent resolution pipeline →</p>
    </div>
  );
}

// ─── Concept Card ───────────────────────────────────────────────────────────

function ConceptCard({ icon: Icon, title, preview, details }: {
  icon: React.ElementType;
  title: string;
  preview: string;
  details: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Card variant="default" padding="md" className="cursor-pointer hover:border-border-hover transition-all" onClick={() => setIsOpen(!isOpen)}>
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/20 flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-violet-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-semibold text-text-primary text-sm">{title}</h4>
            <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown className="w-4 h-4 text-text-muted" />
            </motion.div>
          </div>
          <p className="text-sm text-text-secondary">{preview}</p>
          <AnimatePresence>
            {isOpen && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <p className="text-sm text-text-muted mt-3 pt-3 border-t border-border leading-relaxed">{details}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Card>
  );
}

// ─── Mini Quiz ──────────────────────────────────────────────────────────────

function MiniQuiz() {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const correctAnswer = 1;

  const question = 'What is the key difference between intents and traditional transactions?';
  const options = [
    'Intents are faster than traditional transactions',
    'Intents specify the desired outcome, not the execution path',
    'Intents are cheaper because they skip consensus',
    'Intents use a different consensus mechanism',
  ];
  const explanation = 'Correct! Intents declare WHAT you want (outcome), and solvers compete to determine HOW (execution path). Traditional transactions require you to specify every step.';
  const wrongExplanation = 'Not quite. The key innovation of intents is separating the desired outcome from the execution path — you declare WHAT, solvers figure out HOW.';

  return (
    <Card variant="glass" padding="lg">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-near-green" />
        <h4 className="font-bold text-text-primary">Quick Check</h4>
      </div>
      <p className="text-text-secondary mb-4">{question}</p>
      <div className="space-y-2">
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={() => { setSelected(i); setRevealed(true); }}
            className={cn(
              'w-full text-left px-4 py-3 rounded-lg border text-sm transition-all',
              revealed && i === correctAnswer
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                : revealed && i === selected && i !== correctAnswer
                  ? 'bg-red-500/10 border-red-500/30 text-red-400'
                  : selected === i
                    ? 'bg-surface-hover border-border-hover text-text-primary'
                    : 'bg-surface border-border text-text-secondary hover:border-border-hover'
            )}
          >
            <span className="font-mono text-xs mr-2 opacity-50">{String.fromCharCode(65 + i)}.</span>
            {opt}
          </button>
        ))}
      </div>
      <AnimatePresence>
        {revealed && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={cn('mt-4 p-3 rounded-lg text-sm', selected === correctAnswer ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-orange-500/10 text-orange-400 border border-orange-500/20')}>
            {selected === correctAnswer ? `✓ ${explanation}` : `✕ ${wrongExplanation}`}
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

// ─── Main Module ────────────────────────────────────────────────────────────

interface IntentsChainAbstractionProps {
  isActive: boolean;
  onToggle: () => void;
}

const IntentsChainAbstraction: React.FC<IntentsChainAbstractionProps> = ({ isActive, onToggle }) => {
  return (
    <Card variant="glass" padding="none" className="border-purple-500/20">
      {/* Accordion Header */}
      <div onClick={onToggle} className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center">
            <Workflow className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Intents &amp; Chain Abstraction</h3>
            <p className="text-text-muted text-sm">Intent-based transactions, solver networks, cross-chain UX, and the abstraction stack</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-red-500/10 text-red-300 border-red-500/20">Advanced</Badge>
          <Badge className="bg-purple-500/10 text-purple-300 border-purple-500/20">50 min</Badge>
          {isActive ? <ChevronUp className="w-5 h-5 text-text-muted" /> : <ChevronDown className="w-5 h-5 text-text-muted" />}
        </div>
      </div>

      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="border-t border-purple-500/20 p-6 space-y-8">
              {/* The Big Idea */}
              <Card variant="glass" padding="lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-violet-400" />
                  </div>
                  <h4 className="text-lg font-bold text-text-primary">The Big Idea</h4>
                </div>
                <p className="text-text-secondary leading-relaxed">
                  Instead of booking each flight, hotel, and car separately for a trip, you tell a travel agent{' '}
                  <span className="text-violet-400 font-medium">&ldquo;I want to be in Tokyo by Friday for under $2000&rdquo;</span>{' '}
                  and they figure out the rest. That&apos;s intents — you declare{' '}
                  <span className="text-near-green font-medium">WHAT you want</span>, and solvers compete to find the best{' '}
                  <span className="text-near-green font-medium">HOW</span>. The user never thinks about which chain, which bridge,
                  or which DEX — they just state a goal and get a result.
                </p>
              </Card>

              {/* Interactive Visual */}
              <div>
                <h4 className="text-lg font-bold text-text-primary mb-2">🔍 Intent Resolution Pipeline</h4>
                <p className="text-sm text-text-muted mb-4">Watch an intent flow from declaration through solver auction to cross-chain settlement.</p>
                <IntentPipelineVisual />
              </div>

              {/* Security Gotcha */}
              <Card variant="default" padding="md" className="border-orange-500/20 bg-orange-500/5">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-orange-400 text-sm mb-1">⚠️ Security Gotcha</h4>
                    <p className="text-sm text-text-secondary">
                      Solvers can front-run intents! If your intent reveals profitable information (e.g., a large swap),
                      solvers can extract value by executing before your intent settles.{' '}
                      <span className="text-orange-400 font-medium">Use private mempools or commit-reveal schemes</span> to
                      protect sensitive intents from information leakage.
                    </p>
                  </div>
                </div>
              </Card>

              {/* Core Concepts */}
              <div>
                <h4 className="text-lg font-bold text-text-primary mb-4">🧩 Core Concepts</h4>
                <div className="space-y-3">
                  <ConceptCard
                    icon={Workflow}
                    title="Intent Declaration"
                    preview="Express the desired outcome, not the execution path."
                    details="An intent is a signed message describing what you want to achieve — 'swap 100 USDC for max NEAR' — without specifying how. Unlike traditional transactions that encode exact contract calls, intents are declarative. This lets solvers optimize execution across chains, DEXes, and liquidity pools you might not even know exist."
                  />
                  <ConceptCard
                    icon={Users}
                    title="Solver Network"
                    preview="Competitive market of execution providers bidding for intents."
                    details="Solvers are specialized off-chain agents that compete to fulfill intents at the best price. They stake tokens for accountability, monitor intent pools, and submit execution plans. The competitive auction mechanism ensures users get optimal pricing — solvers that offer bad rates lose to competitors. Think of it as a reverse auction where providers compete for your business."
                  />
                  <ConceptCard
                    icon={Globe}
                    title="Chain Abstraction Layer"
                    preview="One account, any chain — hiding blockchain complexity from users."
                    details="Chain abstraction eliminates the need for users to know which blockchain they're on. NEAR's chain abstraction stack lets you hold assets on Ethereum, trade on Arbitrum, and lend on Base — all from a single NEAR account. The complexity of bridging, gas tokens, and chain-specific quirks is handled by the abstraction layer and solver network."
                  />
                  <ConceptCard
                    icon={Key}
                    title="NEP-366 Meta Transactions"
                    preview="Gasless transactions via relayers — users never buy gas tokens."
                    details="Meta transactions (NEP-366) let users sign transaction intents that relayers submit on their behalf, paying gas fees. The user never needs to hold NEAR for gas. Relayers are compensated through protocol incentives or application subsidies. This eliminates the biggest onboarding friction — buying a chain's native token just to do anything."
                  />
                  <ConceptCard
                    icon={RefreshCw}
                    title="Multichain Gas Relayer"
                    preview="Pay gas on any chain with any token."
                    details="The multichain gas relayer extends meta transactions across chains. Need to execute on Ethereum but only hold USDC on NEAR? The relayer handles the conversion, bridging, and gas payment. Users experience a single-token world where any asset can pay for any action on any chain."
                  />
                  <ConceptCard
                    icon={Network}
                    title="Account Aggregation"
                    preview="Link accounts across chains under one identity."
                    details="Account aggregation maps multiple chain-specific addresses (Ethereum EOA, Solana wallet, NEAR account) to a single identity. Using NEAR's chain signatures and MPC network, one NEAR account can sign transactions on any supported chain — no separate wallets, no seed phrase juggling, just one account that works everywhere. This is the end goal of chain abstraction: one account, any chain, any action."
                  />
                  {/* Additional context on the abstraction stack */}
                </div>
              </div>

              {/* Attack / Defense Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card variant="default" padding="md" className="border-red-500/20">
                  <h4 className="font-semibold text-red-400 text-sm mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> Attack Vectors
                  </h4>
                  <ul className="text-xs text-text-muted space-y-1.5">
                    <li className="flex items-start gap-2"><span className="text-red-400">•</span> <strong className="text-text-secondary">Intent front-running:</strong> Solver sees profitable intent and extracts value by executing ahead of settlement</li>
                    <li className="flex items-start gap-2"><span className="text-red-400">•</span> <strong className="text-text-secondary">Solver collusion:</strong> Solvers agree not to compete, giving users worse prices across the board</li>
                    <li className="flex items-start gap-2"><span className="text-red-400">•</span> <strong className="text-text-secondary">Relay censorship:</strong> Relayers selectively refuse to forward certain intents, censoring users</li>
                  </ul>
                </Card>
                <Card variant="default" padding="md" className="border-emerald-500/20">
                  <h4 className="font-semibold text-emerald-400 text-sm mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4" /> Defenses
                  </h4>
                  <ul className="text-xs text-text-muted space-y-1.5">
                    <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> <strong className="text-text-secondary">Private submission:</strong> Commit-reveal schemes and private mempools hide intent details until execution</li>
                    <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> <strong className="text-text-secondary">Solver diversity:</strong> Minimum solver requirements and reputation scoring prevent cartel formation</li>
                    <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> <strong className="text-text-secondary">Relayer fallbacks:</strong> Multiple relayer options and direct submission paths prevent censorship</li>
                  </ul>
                </Card>
              </div>

              {/* Mini Quiz */}
              <MiniQuiz />

              {/* Key Takeaways */}
              <Card variant="glass" padding="lg" className="border-near-green/20">
                <h4 className="font-bold text-text-primary mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-near-green" />
                  Key Takeaways
                </h4>
                <ul className="space-y-2">
                  {[
                    'Intents separate WHAT from HOW — users declare goals, solvers compete on execution',
                    'Solver networks create competitive markets that optimize pricing for users',
                    'Chain abstraction hides multi-chain complexity behind a single account',
                    'Meta transactions (NEP-366) enable gasless UX via relayers',
                    'The trust assumption shifts from the blockchain to the solver/relayer network — verify, don\'t trust',
                  ].map((point, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                      <ArrowRight className="w-4 h-4 text-near-green flex-shrink-0 mt-0.5" />
                      {point}
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default IntentsChainAbstraction;
