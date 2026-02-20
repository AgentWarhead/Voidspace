'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import {
  ChevronDown, ChevronUp, CheckCircle2, Lightbulb, Zap,
  Shield, AlertTriangle, ArrowRight, Database, Cpu,
  BarChart3, Settings, Layers, Terminal, Server,
} from 'lucide-react';

// ─── Interactive Visual: Gas Cost Comparison ────────────────────────────────

function GasCostVisual() {
  const [activeOp, setActiveOp] = useState<number | null>(null);

  const operations = [
    { label: 'Storage Write', cost: 10, unit: '~5-10 TGas', color: 'from-red-500 to-orange-500', tip: 'Storage writes are the most expensive operation. Minimize writes by batching updates, using lazy collections, and computing values on-read instead of storing precomputed results.' },
    { label: 'Storage Read', cost: 5, unit: '~5 TGas', color: 'from-orange-500 to-amber-500', tip: 'Reads are cheaper than writes but still significant. Cache frequently-read values in memory during a single call. Use UnorderedMap over LookupMap when you need iteration.' },
    { label: 'Cross-Contract Call', cost: 5, unit: '~5 TGas base', color: 'from-amber-500 to-yellow-500', tip: 'Each cross-contract call costs ~5 TGas base plus gas for the called function. Always reserve 10+ TGas for callbacks. Batch multiple calls with Promise.all when possible.' },
    { label: 'Log Output', cost: 2, unit: '~2 TGas', color: 'from-green-500 to-emerald-500', tip: 'Logging costs ~3.5M gas per byte. Remove verbose logs in production. Use event-based logging with structured data instead of human-readable strings.' },
    { label: 'Math Operations', cost: 0.1, unit: '~0.001 TGas', color: 'from-emerald-500 to-teal-500', tip: 'Computation is extremely cheap compared to storage. It\'s often better to recompute values than store them. Prefer computation over storage whenever possible.' },
  ];

  const [showBudget, setShowBudget] = useState(false);
  const maxCost = 10;

  return (
    <div className="relative py-6">
      <div className="space-y-3">
        {operations.map((op, i) => (
          <motion.div
            key={i}
            className="cursor-pointer"
            onClick={() => setActiveOp(activeOp === i ? null : i)}
            whileHover={{ x: 4 }}
          >
            <div className="flex items-center gap-3">
              <span className="text-xs text-text-muted w-36 text-right flex-shrink-0">{op.label}</span>
              <div className="flex-1 h-8 bg-surface border border-border rounded-lg overflow-hidden relative">
                <motion.div
                  className={cn('h-full bg-gradient-to-r rounded-lg', op.color)}
                  initial={{ width: 0 }}
                  animate={{ width: `${(op.cost / maxCost) * 100}%` }}
                  transition={{ duration: 0.8, delay: i * 0.1 }}
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-text-muted font-mono">{op.unit}</span>
              </div>
            </div>
            <AnimatePresence>
              {activeOp === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="ml-39 mt-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
                    💡 {op.tip}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
      {/* Gas Budget Example */}
      <div className="mt-4 flex justify-center">
        <button
          onClick={() => setShowBudget(!showBudget)}
          className="text-xs text-green-400 hover:text-green-300 transition-colors flex items-center gap-1"
        >
          {showBudget ? 'Hide' : 'Show'} gas budget example →
        </button>
      </div>
      <AnimatePresence>
        {showBudget && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 p-3 rounded-lg bg-surface border border-border">
              <p className="text-xs font-semibold text-text-muted mb-2">Example: Token Transfer Gas Budget</p>
              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-text-muted">Function call base</span>
                  <span className="text-green-400">2.5 TGas</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Read sender balance</span>
                  <span className="text-green-400">5.0 TGas</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Read receiver balance</span>
                  <span className="text-green-400">5.0 TGas</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Write sender balance</span>
                  <span className="text-orange-400">8.0 TGas</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Write receiver balance</span>
                  <span className="text-orange-400">8.0 TGas</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Event log</span>
                  <span className="text-green-400">2.0 TGas</span>
                </div>
                <div className="flex justify-between border-t border-border pt-1.5 mt-1.5">
                  <span className="text-text-primary font-semibold">Total</span>
                  <span className="text-amber-400 font-semibold">~30.5 TGas</span>
                </div>
              </div>
              <p className="text-[10px] text-text-muted mt-2">
                Storage writes (sender + receiver) account for 52% of total gas. This is why minimizing writes matters!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <p className="text-center text-xs text-text-muted mt-4">
        Click any bar to see optimization tips →
      </p>
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
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500/20 to-teal-500/20 border border-green-500/20 flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-green-400" />
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
  const correctAnswer = 0;

  const question = 'What is typically the most expensive operation in a NEAR smart contract?';
  const options = [
    'Storage writes — they cost 10-100x more than computation',
    'Mathematical operations like multiplication and division',
    'Reading state from storage',
    'Logging output to the transaction receipt',
  ];
  const explanation = 'Correct! Storage writes dominate gas costs on NEAR. Writing a single byte costs ~10M gas, while a math operation costs a fraction of that. Always minimize storage writes — batch updates, use lazy collections, and prefer computation over storage.';
  const wrongExplanation = 'Not quite. Storage writes are by far the most expensive — 10-100x more than computation. This is why gas optimization on NEAR is primarily about minimizing storage operations.';

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

interface GasOptimizationDeepDiveProps {
  isActive: boolean;
  onToggle?: () => void;
}

const GasOptimizationDeepDive: React.FC<GasOptimizationDeepDiveProps> = ({ isActive, onToggle }) => {
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    try {
      const progress = JSON.parse(localStorage.getItem('voidspace-hacker-progress') || '{}');
      if (progress['gas-optimization-deep-dive']) setCompleted(true);
    } catch {}
  }, []);

  const handleComplete = () => {
    if (completed) return;
    try {
      const progress = JSON.parse(localStorage.getItem('voidspace-hacker-progress') || '{}');
      progress['gas-optimization-deep-dive'] = true;
      localStorage.setItem('voidspace-hacker-progress', JSON.stringify(progress));
      setCompleted(true);
    } catch {}
  };
  return (
    <Card variant="glass" padding="none" className="border-purple-500/20">
      {/* Accordion Header */}
      <div onClick={() => {}} style={{display:"none"}} className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Gas Optimization Deep Dive</h3>
            <p className="text-text-muted text-sm">NEAR gas model, profiling techniques, storage vs. compute tradeoffs, and optimization patterns</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-near-green/10 text-near-green border-near-green/20">Module 14 of 16</Badge>
          {completed && <Badge className="bg-emerald-500/10 text-emerald-300 border-emerald-500/20">✓ Done</Badge>}
          <Badge className="bg-red-500/10 text-red-300 border-red-500/20">Advanced</Badge>
          <Badge className="bg-purple-500/10 text-purple-300 border-purple-500/20">45 min</Badge>
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
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500/20 to-teal-500/20 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-green-400" />
                  </div>
                  <h4 className="text-lg font-bold text-text-primary">The Big Idea</h4>
                </div>
                <p className="text-text-secondary leading-relaxed">
                  Gas on NEAR is like fuel in a race car — you have a{' '}
                  <span className="text-green-400 font-medium">fixed tank (300 TGas max per transaction)</span>,
                  and every operation burns some fuel. The best drivers don&apos;t just go fast — they find the most efficient route.
                  Gas optimization is about doing more with less, and sometimes{' '}
                  <span className="text-near-green font-medium">the cheapest operation is the one you don&apos;t do at all</span>.
                </p>
              </Card>

              {/* Interactive Visual */}
              <div>
                <h4 className="text-lg font-bold text-text-primary mb-2">📊 Gas Cost Comparison</h4>
                <p className="text-sm text-text-muted mb-4">Common NEAR operations ranked by gas consumption. Click bars for optimization tips.</p>
                <GasCostVisual />
              </div>

              {/* Security Gotcha */}
              <Card variant="default" padding="md" className="border-orange-500/20 bg-orange-500/5">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-orange-400 text-sm mb-1">⚠️ Security Gotcha</h4>
                    <p className="text-sm text-text-secondary">Running out of gas mid-transaction leaves your contract in a partially-updated state! Always estimate worst-case gas consumption and add safety margins. For cross-contract calls, reserve at least 10 TGas for the callback.</p>
                  </div>
                </div>
              </Card>

              {/* Core Concepts */}
              <div>
                <h4 className="text-lg font-bold text-text-primary mb-4">🧩 Core Concepts</h4>
                <div className="space-y-3">
                  <ConceptCard icon={Cpu} title="NEAR Gas Model" preview="Gas price, gas limits, and how validators are rewarded." details="Every NEAR transaction has a 300 TGas maximum limit. Gas price fluctuates based on network demand (minimum 0.1 Ggas = 100M gas). 30% of gas fees are burned, 70% goes to the contract account. Understanding this model is essential for estimating costs and setting appropriate gas attachments." />
                  <ConceptCard icon={Database} title="Storage vs. Compute Costs" preview="Storage writes are 10-100x more expensive than computation." details="Writing a single byte to storage costs ~10M gas, while a 256-bit multiplication costs ~100K gas — a 100x difference. This means computing a value on every read is often cheaper than storing a precomputed result. Design your data structures to minimize writes: use events for historical data, compute derived values on read." />
                  <ConceptCard icon={Layers} title="Batch Optimization" preview="Combining multiple operations to reduce overhead." details="Each cross-contract call has a fixed ~5 TGas overhead. Making 10 separate calls costs 50 TGas in overhead alone. By batching operations into fewer transactions using Promise.all or batch actions, you eliminate redundant overhead. Group related state changes into single function calls." />
                  <ConceptCard icon={Settings} title="Lazy Evaluation" preview="Defer computation until results are actually needed." details="NEAR SDK provides lazy collections (LazyOption, LookupMap) that only load data from storage when accessed. Unlike UnorderedMap which loads all keys on initialization, lazy collections save gas by deferring reads. Use lazy loading for large collections where you only access a subset per call." />
                  <ConceptCard icon={Server} title="Serialization Costs" preview="Borsh vs. JSON — choosing the right format matters." details="Borsh serialization is 2-5x cheaper than JSON for storage operations because it produces smaller binary output with less parsing overhead. Use borsh for contract state storage and JSON only for function arguments (human-readable). This simple switch can save 30-60% on storage gas costs." />
                  <ConceptCard icon={Terminal} title="Gas Profiling" preview="Measuring exact gas consumption before deploying." details="Use NEAR workspaces-rs or workspaces-js to write integration tests that measure exact gas consumption of each function call. The NEAR CLI 'near call --gas' flag lets you experiment with gas limits. Profile before deploying — gas costs in production should never be a surprise." />
                </div>
              </div>

              {/* Gas Costs Table */}
              <Card variant="default" padding="md" className="border-green-500/20">
                <h4 className="font-semibold text-green-400 text-sm mb-3 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" /> Gas Reference Table
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { op: 'Function call base', cost: '2.5 TGas' },
                    { op: 'Storage write (per byte)', cost: '10M gas' },
                    { op: 'Storage read (per byte)', cost: '5.4M gas' },
                    { op: 'Promise creation', cost: '5 TGas' },
                    { op: 'Log (per byte)', cost: '3.5M gas' },
                    { op: 'SHA256 hash', cost: '5.4 TGas' },
                  ].map((row, i) => (
                    <div key={i} className="flex justify-between px-3 py-2 rounded bg-surface border border-border">
                      <span className="text-text-muted">{row.op}</span>
                      <span className="text-green-400 font-mono">{row.cost}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Attack / Defense Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card variant="default" padding="md" className="border-red-500/20">
                  <h4 className="font-semibold text-red-400 text-sm mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> Attack Vectors
                  </h4>
                  <ul className="text-xs text-text-muted space-y-1.5">
                    <li className="flex items-start gap-2"><span className="text-red-400">•</span> Gas griefing — sending txs designed to consume max gas without proportional payment</li>
                    <li className="flex items-start gap-2"><span className="text-red-400">•</span> Gas exhaustion in callbacks — insufficient gas for callback causes partial state updates</li>
                    <li className="flex items-start gap-2"><span className="text-red-400">•</span> Unbounded iteration — loop over unbounded collection exhausts gas limit</li>
                    <li className="flex items-start gap-2"><span className="text-red-400">•</span> Storage bombing — creating entries that cost more to delete than the deposit covers</li>
                  </ul>
                </Card>
                <Card variant="default" padding="md" className="border-emerald-500/20">
                  <h4 className="font-semibold text-emerald-400 text-sm mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4" /> Defenses
                  </h4>
                  <ul className="text-xs text-text-muted space-y-1.5">
                    <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> Require minimum deposits proportional to gas and storage consumption</li>
                    <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> Explicit gas budgeting with reserves — always keep 10+ TGas for callbacks</li>
                    <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> Pagination with cursor-based continuation for all collection operations</li>
                    <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> Accurate storage cost calculation with safety margin on deposits</li>
                  </ul>
                </Card>
              </div>

              {/* Optimization Cheat Sheet */}
              <Card variant="default" padding="md" className="border-green-500/20">
                <h4 className="font-semibold text-green-400 text-sm mb-2 flex items-center gap-2">
                  <Zap className="w-4 h-4" /> Quick Optimization Cheat Sheet
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  {[
                    { bad: 'Store computed values', good: 'Compute on read', save: '~50% gas' },
                    { bad: 'JSON for storage', good: 'Borsh for storage', save: '2-5x cheaper' },
                    { bad: 'Individual cross-calls', good: 'Batch with Promise.all', save: '~5 TGas/call' },
                    { bad: 'Eager collection loading', good: 'Lazy collections (LookupMap)', save: 'Up to 90%' },
                    { bad: 'Verbose log strings', good: 'Structured event logs', save: '~60% log gas' },
                    { bad: 'Guess gas limits', good: 'Profile with workspaces', save: 'Prevents failures' },
                  ].map((tip, i) => (
                    <div key={i} className="px-3 py-2 rounded bg-surface border border-border">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-red-400 line-through">{tip.bad}</span>
                        <ArrowRight className="w-3 h-3 text-text-muted" />
                        <span className="text-emerald-400">{tip.good}</span>
                      </div>
                      <span className="text-text-muted">Saves: {tip.save}</span>
                    </div>
                  ))}
                </div>
              </Card>

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
                    'Storage writes dominate gas costs — minimize writes, batch where possible.',
                    '300 TGas is the max per transaction — budget carefully for cross-contract chains.',
                    'Borsh serialization is 2-5x cheaper than JSON for storage operations.',
                    'Always reserve gas for callbacks in cross-contract calls (10+ TGas minimum).',
                    'Profile with NEAR workspaces before deploying — don\'t guess gas costs.',
                  ].map((point, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                      <ArrowRight className="w-4 h-4 text-near-green flex-shrink-0 mt-0.5" />
                      {point}
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Mark Complete */}
              <div className="flex justify-center pt-4 mt-4 border-t border-white/5">
                <motion.button
                  onClick={handleComplete}
                  disabled={completed}
                  className={cn(
                    'px-8 py-3 rounded-xl font-semibold text-sm transition-all flex items-center gap-2',
                    completed
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default'
                      : 'bg-gradient-to-r from-near-green to-emerald-500 text-white hover:shadow-lg hover:shadow-near-green/20'
                  )}
                  whileHover={completed ? {} : { scale: 1.03, y: -1 }}
                  whileTap={completed ? {} : { scale: 0.97 }}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {completed ? 'Module Completed ✓' : 'Mark as Complete'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default GasOptimizationDeepDive;
