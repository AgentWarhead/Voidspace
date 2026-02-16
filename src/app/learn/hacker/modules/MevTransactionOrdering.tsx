'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import {
  ChevronDown, ChevronUp, CheckCircle2, Lightbulb, Zap, Shield,
  AlertTriangle, ArrowRight, Activity, Eye, Lock, Layers,
  BarChart3, Network, Clock,
} from 'lucide-react';

// ─── Interactive Visual: Sandwich Attack Timeline ────────────────────────────

function SandwichAttackVisual() {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const steps = [
    {
      id: 0,
      label: 'Victim\'s TX Spotted',
      icon: '👀',
      time: 't=0',
      color: 'border-blue-500/40 bg-blue-500/10',
      detail: 'Victim submits: "Swap 1,000 USDC → NEAR on Ref Finance." This transaction enters the mempool where it\'s visible to everyone — including MEV searchers monitoring for profitable opportunities.',
      profit: null,
    },
    {
      id: 1,
      label: 'Attacker Front-runs',
      icon: '🏃',
      time: 't=1',
      color: 'border-red-500/40 bg-red-500/10',
      detail: 'Attacker buys NEAR before the victim\'s trade executes. This large buy pushes the NEAR price up. Attacker gets NEAR at $4.80 (the pre-victim price). The pool\'s price shifts upward.',
      profit: 'Attacker buys at $4.80',
    },
    {
      id: 2,
      label: 'Victim\'s TX Executes',
      icon: '😰',
      time: 't=2',
      color: 'border-yellow-500/40 bg-yellow-500/10',
      detail: 'Victim\'s swap executes at the now-higher price of $4.95 instead of the expected $4.80. The victim receives fewer NEAR tokens than anticipated. If their slippage tolerance allows it, the trade completes at a loss.',
      profit: 'Victim pays $4.95 (expected $4.80)',
    },
    {
      id: 3,
      label: 'Attacker Back-runs',
      icon: '💰',
      time: 't=3',
      color: 'border-red-500/40 bg-red-500/10',
      detail: 'Attacker immediately sells the NEAR they bought at $4.80 for the now-inflated price of ~$4.93. After fees, the attacker pockets the spread. The victim unknowingly funded the attacker\'s profit.',
      profit: 'Attacker sells at $4.93 → ~$0.13/NEAR profit',
    },
  ];

  return (
    <div className="relative py-6">
      {/* Timeline */}
      <div className="space-y-3">
        {steps.map((step, i) => (
          <motion.div
            key={step.id}
            className={cn(
              'relative p-4 rounded-xl border cursor-pointer transition-all',
              activeStep === step.id ? step.color : 'bg-surface border-border hover:border-border-hover'
            )}
            whileHover={{ x: 4 }}
            onClick={() => setActiveStep(activeStep === step.id ? null : step.id)}
          >
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-center flex-shrink-0">
                <span className="text-lg">{step.icon}</span>
                <span className="text-[10px] font-mono text-text-muted mt-1">{step.time}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-text-primary">{step.label}</p>
                  {step.profit && (
                    <span className={cn(
                      'text-[10px] font-mono px-2 py-0.5 rounded',
                      i === 2 ? 'bg-yellow-500/10 text-yellow-400' : 'bg-red-500/10 text-red-400'
                    )}>
                      {step.profit}
                    </span>
                  )}
                </div>
              </div>
              <motion.div animate={{ rotate: activeStep === step.id ? 180 : 0 }}>
                <ChevronDown className="w-4 h-4 text-text-muted" />
              </motion.div>
            </div>
            <AnimatePresence>
              {activeStep === step.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <p className="text-sm text-text-secondary mt-3 pt-3 border-t border-border leading-relaxed">
                    {step.detail}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
            {i < steps.length - 1 && (
              <div className="absolute left-7 -bottom-3 w-0.5 h-3 bg-border z-10" />
            )}
          </motion.div>
        ))}
      </div>
      {/* Profit/Loss summary */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/20 text-center">
          <p className="text-[10px] text-text-muted mb-1">Attacker Profit</p>
          <p className="text-lg font-bold text-red-400">+$130</p>
          <p className="text-[10px] text-text-muted">on 1,000 USDC sandwich</p>
        </div>
        <div className="p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/20 text-center">
          <p className="text-[10px] text-text-muted mb-1">Victim Loss</p>
          <p className="text-lg font-bold text-yellow-400">-$150</p>
          <p className="text-[10px] text-text-muted">worse execution price</p>
        </div>
      </div>
      <p className="text-center text-xs text-text-muted mt-4">Click each step to see the anatomy of a sandwich attack →</p>
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
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/20 flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-red-400" />
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
  const correctAnswer = 2;

  const question = 'How does a sandwich attack extract value?';
  const options = [
    'By stealing tokens directly from the victim\'s wallet',
    'By exploiting a smart contract vulnerability',
    'By buying before and selling after a victim\'s swap, profiting from the price impact',
    'By double-spending tokens through a race condition',
  ];
  const explanation = 'Correct! A sandwich attack brackets the victim\'s trade: the attacker front-runs (buys before) to inflate the price, the victim trades at the worse price, then the attacker back-runs (sells after) to pocket the spread. No exploit needed — just transaction ordering control.';
  const wrongExplanation = 'Not quite. Sandwich attacks don\'t exploit bugs or steal directly — they profit by manipulating transaction ordering around a victim\'s swap, buying before and selling after to capture the price impact.';

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

interface MevTransactionOrderingProps {
  isActive: boolean;
  onToggle: () => void;
}

const MevTransactionOrdering: React.FC<MevTransactionOrderingProps> = ({ isActive, onToggle }) => {
  return (
    <Card variant="glass" padding="none" className="border-purple-500/20">
      {/* Accordion Header */}
      <div onClick={onToggle} className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">MEV &amp; Transaction Ordering</h3>
            <p className="text-text-muted text-sm">Maximal Extractable Value, front-running, sandwich attacks, and NEAR&apos;s ordering guarantees</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-red-500/10 text-red-300 border-red-500/20">Advanced</Badge>
          <Badge className="bg-purple-500/10 text-purple-300 border-purple-500/20">55 min</Badge>
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
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-red-400" />
                  </div>
                  <h4 className="text-lg font-bold text-text-primary">The Big Idea</h4>
                </div>
                <p className="text-text-secondary leading-relaxed">
                  Imagine a stock exchange where the person running the order book can{' '}
                  <span className="text-red-400 font-medium">see your buy order before it executes</span> — and place
                  their own order first. That&apos;s MEV:{' '}
                  <span className="text-near-green font-medium">value extracted by those who control transaction ordering</span>.
                  On Ethereum, miners and validators have enormous MEV power due to the global mempool. On NEAR,
                  the game is different — shard-level ordering and fast finality change the dynamics — but the
                  economic incentives for extraction still exist.
                </p>
              </Card>

              {/* Interactive Visual */}
              <div>
                <h4 className="text-lg font-bold text-text-primary mb-2">🔍 Anatomy of a Sandwich Attack</h4>
                <p className="text-sm text-text-muted mb-4">Step through a real sandwich attack to see how value is extracted from DEX traders.</p>
                <SandwichAttackVisual />
              </div>

              {/* Security Gotcha */}
              <Card variant="default" padding="md" className="border-orange-500/20 bg-orange-500/5">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-orange-400 text-sm mb-1">⚠️ Security Gotcha</h4>
                    <p className="text-sm text-text-secondary">
                      Even on NEAR, chunk producers can reorder transactions within a chunk! While NEAR has less
                      MEV surface than Ethereum (no global mempool), chunk producer MEV is still theoretically possible.{' '}
                      <span className="text-orange-400 font-medium">Use slippage limits on all swaps</span> — they&apos;re
                      your first and most important line of defense. A 0.5% slippage limit makes most sandwich attacks unprofitable.
                    </p>
                  </div>
                </div>
              </Card>

              {/* Core Concepts */}
              <div>
                <h4 className="text-lg font-bold text-text-primary mb-4">🧩 Core Concepts</h4>
                <div className="space-y-3">
                  <ConceptCard
                    icon={Activity}
                    title="MEV Definition"
                    preview="Value extractable by reordering, inserting, or censoring transactions."
                    details="Maximal Extractable Value (formerly Miner Extractable Value) is the total profit available to whoever controls transaction ordering. This includes front-running profitable trades, back-running liquidations, sandwiching DEX swaps, and censoring competing transactions. On Ethereum, MEV extraction totals billions of dollars annually. It's an invisible tax on regular users."
                  />
                  <ConceptCard
                    icon={Eye}
                    title="Front-running"
                    preview="Placing a transaction before a known pending transaction to profit."
                    details="A front-runner monitors the mempool for profitable pending transactions — like large DEX swaps that will move prices. They submit an identical or related transaction with higher gas (on Ethereum) to ensure it executes first. On NEAR, front-running is harder because there's no global mempool — transactions go directly to shard chunk producers — but it's not impossible if the chunk producer is malicious."
                  />
                  <ConceptCard
                    icon={BarChart3}
                    title="Sandwich Attacks"
                    preview="Surrounding a victim transaction with buy-before and sell-after."
                    details="The most common DEX MEV strategy. The attacker: (1) Front-runs by buying the token the victim wants, raising its price. (2) The victim's swap executes at the inflated price. (3) The attacker back-runs by selling at the higher price. The victim gets fewer tokens; the attacker pockets the difference. Tight slippage limits are the primary defense — they cause the sandwich to fail if the price moves too much."
                  />
                  <ConceptCard
                    icon={Layers}
                    title="NEAR's Ordering Model"
                    preview="Chunk producers order transactions within shards — less MEV surface."
                    details="NEAR's sharded architecture means transactions are ordered per-shard by chunk producers, not globally by a single block proposer. There's no public mempool — transactions are sent directly to the relevant shard's chunk producer. This dramatically reduces MEV compared to Ethereum's global ordering, but doesn't eliminate it — a malicious chunk producer could still reorder transactions within their chunk."
                  />
                  <ConceptCard
                    icon={Network}
                    title="Transaction Priority"
                    preview="NEAR uses first-come-first-served, not gas auctions."
                    details="Unlike Ethereum where users bid gas prices for priority (enabling MEV through priority gas auctions), NEAR processes transactions in roughly FIFO order within chunks. There's no equivalent of Ethereum's 'priority fee' that lets you pay for better positioning. This design choice significantly reduces the MEV extraction surface, though it doesn't prevent chunk producer manipulation entirely."
                  />
                  <ConceptCard
                    icon={Clock}
                    title="Back-running"
                    preview="Executing immediately after a known transaction to capture arbitrage."
                    details="Back-running means placing your transaction right after a target transaction. Common use: after a large swap moves a DEX price away from centralized exchange prices, back-runners submit arbitrage transactions to capture the difference. Unlike front-running, back-running can be positive for the ecosystem — it helps keep DEX prices aligned with global markets. Some protocols intentionally enable back-running for liquidation bots."
                  />
                </div>
              </div>

              {/* Attack / Defense Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card variant="default" padding="md" className="border-red-500/20">
                  <h4 className="font-semibold text-red-400 text-sm mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> Attack Vectors
                  </h4>
                  <ul className="text-xs text-text-muted space-y-1.5">
                    <li className="flex items-start gap-2"><span className="text-red-400">•</span> <strong className="text-text-secondary">Sandwich attacks:</strong> Front-run + back-run around DEX swaps to extract price impact</li>
                    <li className="flex items-start gap-2"><span className="text-red-400">•</span> <strong className="text-text-secondary">Chunk producer MEV:</strong> Malicious chunk producer reorders transactions for profit</li>
                    <li className="flex items-start gap-2"><span className="text-red-400">•</span> <strong className="text-text-secondary">Liquidation front-running:</strong> Racing to liquidate undercollateralized positions first</li>
                    <li className="flex items-start gap-2"><span className="text-red-400">•</span> <strong className="text-text-secondary">Time-bandit attacks:</strong> Reorging the chain to capture past MEV opportunities</li>
                  </ul>
                </Card>
                <Card variant="default" padding="md" className="border-emerald-500/20">
                  <h4 className="font-semibold text-emerald-400 text-sm mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4" /> Defenses
                  </h4>
                  <ul className="text-xs text-text-muted space-y-1.5">
                    <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> <strong className="text-text-secondary">Slippage limits:</strong> Tight tolerances make sandwich attacks unprofitable</li>
                    <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> <strong className="text-text-secondary">Encrypted mempools:</strong> Threshold encryption hides transaction details until ordering</li>
                    <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> <strong className="text-text-secondary">Dutch auctions:</strong> Gradual price discovery for liquidations prevents front-running</li>
                    <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> <strong className="text-text-secondary">Fast finality:</strong> NEAR&apos;s ~1-2s finality makes chain reorgs impractical</li>
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
                    'MEV is value extracted through transaction ordering control — an invisible tax on users',
                    'NEAR has less MEV surface than Ethereum — no global mempool, shard-level ordering, no gas auctions',
                    'Sandwich attacks are the most common DEX MEV strategy — front-run, victim trades, back-run',
                    'Always use slippage limits on swaps — they\'re your primary defense against sandwich attacks',
                    'Fast finality (~1-2s) makes time-bandit reorg attacks impractical on NEAR',
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

export default MevTransactionOrdering;
