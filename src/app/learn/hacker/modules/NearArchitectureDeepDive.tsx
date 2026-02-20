'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import {
  ChevronDown, ChevronUp, CheckCircle2, Lightbulb, Zap,
  Shield, AlertTriangle, ArrowRight, Layers, Server, Network,
  Workflow, Activity, RefreshCw,
} from 'lucide-react';

// ─── Interactive Sharding Visual ────────────────────────────────────────────

function ShardingDiagram() {
  const [activeShard, setActiveShard] = useState<number | null>(null);

  const shards = [
    {
      id: 0,
      label: 'Shard 0',
      accounts: 'alice.near, swap.near',
      chunks: 142,
      validators: 25,
      color: 'from-blue-500/30 to-blue-600/20',
      borderColor: 'border-blue-500/40',
      textColor: 'text-blue-400',
    },
    {
      id: 1,
      label: 'Shard 1',
      accounts: 'bob.near, nft.near',
      chunks: 138,
      validators: 23,
      color: 'from-cyan-500/30 to-cyan-600/20',
      borderColor: 'border-cyan-500/40',
      textColor: 'text-cyan-400',
    },
    {
      id: 2,
      label: 'Shard 2',
      accounts: 'carol.near, dao.near',
      chunks: 145,
      validators: 27,
      color: 'from-teal-500/30 to-teal-600/20',
      borderColor: 'border-teal-500/40',
      textColor: 'text-teal-400',
    },
    {
      id: 3,
      label: 'Shard 3',
      accounts: 'dave.near, ft.near',
      chunks: 140,
      validators: 24,
      color: 'from-emerald-500/30 to-emerald-600/20',
      borderColor: 'border-emerald-500/40',
      textColor: 'text-emerald-400',
    },
  ];

  return (
    <div className="relative py-6">
      {/* Beacon Chain */}
      <div className="text-center mb-6">
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30"
          animate={{ boxShadow: ['0 0 10px rgba(168,85,247,0.1)', '0 0 20px rgba(168,85,247,0.2)', '0 0 10px rgba(168,85,247,0.1)'] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Network className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-mono text-purple-300">Beacon Chain — Block Coordinator</span>
        </motion.div>
      </div>

      {/* Connecting lines */}
      <div className="flex justify-center mb-4">
        <div className="flex gap-12 md:gap-16">
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="w-0.5 h-8 bg-gradient-to-b from-purple-500/40 to-transparent"
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
            />
          ))}
        </div>
      </div>

      {/* Shard Boxes */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {shards.map((shard) => (
          <motion.div
            key={shard.id}
            className={cn(
              'relative rounded-xl p-3 border cursor-pointer transition-all',
              `bg-gradient-to-br ${shard.color} ${shard.borderColor}`,
              activeShard === shard.id && 'ring-1 ring-white/20 shadow-lg'
            )}
            whileHover={{ scale: 1.03, y: -2 }}
            onClick={() => setActiveShard(activeShard === shard.id ? null : shard.id)}
          >
            <div className="flex items-center gap-2 mb-2">
              <Layers className={cn('w-4 h-4', shard.textColor)} />
              <span className={cn('text-xs font-bold font-mono', shard.textColor)}>{shard.label}</span>
            </div>
            <div className="text-[10px] text-text-muted space-y-1">
              <div>Chunks: <span className="text-text-secondary">{shard.chunks}/epoch</span></div>
              <div>Validators: <span className="text-text-secondary">{shard.validators}</span></div>
            </div>
            <AnimatePresence>
              {activeShard === shard.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-2 pt-2 border-t border-white/10 text-[10px]">
                    <div className="text-text-muted">Accounts:</div>
                    <div className="text-near-green font-mono">{shard.accounts}</div>
                    <div className="text-text-muted mt-1">State stored in Merkle Patricia Trie</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Receipt flow arrows */}
      <div className="flex justify-center mt-4 gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="flex items-center gap-1"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
          >
            <div className="w-10 h-0.5 bg-gradient-to-r from-yellow-500/60 to-yellow-500/20" />
            <ArrowRight className="w-3 h-3 text-yellow-500/60" />
          </motion.div>
        ))}
      </div>
      <p className="text-center text-[10px] text-yellow-500/50 mt-1 font-mono">
        ← Async receipts flowing between shards →
      </p>

      <p className="text-center text-xs text-text-muted mt-4">
        Click any shard to explore its state →
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
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-blue-400" />
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

  const question = 'How does NEAR handle communication between shards?';
  const options = [
    'Synchronous cross-shard function calls',
    'Through async receipts that are routed between shards',
    'Shared memory space accessible by all shards',
    'Message queues managed by the beacon chain',
  ];
  const explanation = 'Correct! NEAR uses asynchronous receipts to communicate between shards. When a transaction on one shard needs to interact with another, it generates a receipt that gets routed and processed in the next block on the destination shard.';
  const wrongExplanation = 'Not quite. NEAR uses async receipts — not synchronous calls or shared memory. Receipts are generated by transactions and routed to destination shards for processing.';

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

interface NearArchitectureDeepDiveProps {
  isActive: boolean;
  onToggle?: () => void;
}

const NearArchitectureDeepDive: React.FC<NearArchitectureDeepDiveProps> = ({ isActive, onToggle }) => {
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    try {
      const progress = JSON.parse(localStorage.getItem('voidspace-hacker-progress') || '{}');
      if (progress['near-architecture-deep-dive']) setCompleted(true);
    } catch {}
  }, []);

  const handleComplete = () => {
    if (completed) return;
    try {
      const progress = JSON.parse(localStorage.getItem('voidspace-hacker-progress') || '{}');
      progress['near-architecture-deep-dive'] = true;
      localStorage.setItem('voidspace-hacker-progress', JSON.stringify(progress));
      setCompleted(true);
    } catch {}
  };
  return (
    <Card variant="glass" padding="none" className="border-blue-500/20">
      {/* Accordion Header */}
      <div onClick={() => {}} style={{display:"none"}} className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
            <Layers className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">NEAR Architecture Deep Dive</h3>
            <p className="text-text-muted text-sm">Nightshade sharding, chunk production, state management, and the receipt system</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-near-green/10 text-near-green border-near-green/20">Module 1 of 16</Badge>
          {completed && <Badge className="bg-emerald-500/10 text-emerald-300 border-emerald-500/20">✓ Done</Badge>}
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
            <div className="border-t border-blue-500/20 p-6 space-y-8">
              {/* The Big Idea */}
              <Card variant="glass" padding="lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-blue-400" />
                  </div>
                  <h4 className="text-lg font-bold text-text-primary">The Big Idea</h4>
                </div>
                <p className="text-text-secondary leading-relaxed">
                  Imagine a city that splits into <span className="text-cyan-400 font-medium">parallel neighborhoods</span> —
                  each neighborhood processes its own mail, runs its own shops, but they all share the same city directory.
                  That&apos;s NEAR&apos;s <span className="text-blue-400 font-medium">Nightshade sharding</span>. Instead of
                  every validator processing every transaction (like one giant post office), NEAR splits the work across
                  multiple shards — each handling its own slice of state, producing its own chunks, while the beacon chain
                  keeps everyone synchronized.
                </p>
              </Card>

              {/* Interactive Visual */}
              <div>
                <h4 className="text-lg font-bold text-text-primary mb-2">🔍 Nightshade Sharding Architecture</h4>
                <p className="text-sm text-text-muted mb-4">Four shards process transactions in parallel, coordinated by the beacon chain. Receipts flow between shards asynchronously.</p>
                <ShardingDiagram />
              </div>

              {/* Security Gotcha */}
              <Card variant="default" padding="md" className="border-orange-500/20 bg-orange-500/5">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-orange-400 text-sm mb-1">⚠️ Security Gotcha</h4>
                    <p className="text-sm text-text-secondary">
                      A single shard compromise could poison cross-shard receipts. If a malicious validator produces an
                      invalid chunk, the receipts generated from it could propagate bad state to other shards. NEAR
                      mitigates this with <span className="text-orange-300 font-medium">fishermen validators</span> who
                      can challenge invalid state transitions within a challenge period.
                    </p>
                  </div>
                </div>
              </Card>

              {/* Core Concepts */}
              <div>
                <h4 className="text-lg font-bold text-text-primary mb-4">🧩 Core Concepts</h4>
                <div className="space-y-3">
                  <ConceptCard
                    icon={Layers}
                    title="Nightshade Sharding"
                    preview="State is split across parallel shards for horizontal scaling."
                    details="Nightshade is NEAR's sharding design where each shard maintains its own portion of the global state. Unlike other sharding approaches, Nightshade produces a single block containing all shard chunks — simplifying cross-shard communication. Each shard processes transactions independently, enabling parallel execution and linear scalability as shards are added."
                  />
                  <ConceptCard
                    icon={Server}
                    title="Chunk Producers"
                    preview="Validators assigned to produce chunks for specific shards each epoch."
                    details="Chunk producers are validators responsible for collecting transactions, executing them, and producing chunks (shard-level blocks) every ~1 second. They are randomly assigned to shards each epoch (~12 hours) using a verifiable random function. This random assignment prevents attackers from targeting specific shards by stacking validators."
                  />
                  <ConceptCard
                    icon={Workflow}
                    title="Receipt System"
                    preview="Async cross-shard communication via receipts routed between shards."
                    details="When a transaction on Shard 0 needs to call a contract on Shard 2, it generates a receipt — a message containing the function call, attached gas, and deposit. This receipt is routed to Shard 2 and processed in the next block. Receipts can chain: Contract A → receipt → Contract B → receipt → callback to Contract A. This async model means cross-shard calls take 2+ blocks to complete."
                  />
                  <ConceptCard
                    icon={Activity}
                    title="State Trie"
                    preview="Merkle Patricia Trie stores all account state with efficient proofs."
                    details="NEAR stores all state (account balances, contract code, contract storage) in a Merkle Patricia Trie — a tree structure where each leaf is a key-value pair and each node contains a hash of its children. This allows efficient state proofs: you can prove an account has a specific balance without downloading the entire state. Each shard maintains its own sub-trie of the global state."
                  />
                  <ConceptCard
                    icon={RefreshCw}
                    title="Epoch Management"
                    preview="Validators are rotated and reassigned to shards every ~12 hours."
                    details="An epoch on NEAR lasts ~12 hours (~43,200 blocks). At epoch boundaries, the protocol recalculates validator assignments: who produces blocks, who produces chunks for each shard, and who serves as fishermen. Stake changes, slashing results, and reward distributions are all processed at epoch transitions. This regular rotation prevents long-term shard manipulation."
                  />
                </div>
              </div>

              {/* Attack Vector / Defense */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card variant="default" padding="md" className="border-red-500/20">
                  <h4 className="font-semibold text-red-400 text-sm mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> Attack Vectors
                  </h4>
                  <ul className="text-xs text-text-muted space-y-1.5">
                    <li className="flex items-start gap-2"><span className="text-red-400">•</span> Invalid state transition — malicious chunk producer includes bad transactions, generating poisoned receipts that propagate across shards</li>
                    <li className="flex items-start gap-2"><span className="text-red-400">•</span> Shard takeover — attacker accumulates 2/3 of a shard&apos;s validators to control chunk production and censor transactions</li>
                    <li className="flex items-start gap-2"><span className="text-red-400">•</span> Receipt flooding — spam one shard with cross-shard receipts to overwhelm its processing capacity</li>
                  </ul>
                </Card>
                <Card variant="default" padding="md" className="border-emerald-500/20">
                  <h4 className="font-semibold text-emerald-400 text-sm mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4" /> Defenses
                  </h4>
                  <ul className="text-xs text-text-muted space-y-1.5">
                    <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> Fishermen validators monitor chunks and can submit fraud proofs to challenge invalid state transitions within the challenge window</li>
                    <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> Random validator assignment per epoch via VRF prevents targeted shard stacking — attackers can&apos;t predict assignments</li>
                    <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> Gas limits per chunk and congestion pricing throttle receipt processing, preventing any single shard from being overwhelmed</li>
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
                    'Nightshade splits state across shards for parallelism — each shard processes independently',
                    'Chunks are shard-level blocks produced every ~1 second by randomly assigned validators',
                    'Receipts enable async cross-shard communication — cross-shard calls take 2+ blocks',
                    'Validators are randomly assigned to shards each epoch (~12hrs) to prevent targeted attacks',
                    'State is stored in a Merkle Patricia Trie enabling efficient proofs without full state download',
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

export default NearArchitectureDeepDive;
