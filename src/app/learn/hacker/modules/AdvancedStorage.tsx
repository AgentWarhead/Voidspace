'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import {
  ChevronDown, ChevronUp, CheckCircle2, Lightbulb, Zap,
  Shield, AlertTriangle, ArrowRight, Database, Box,
  Search, Settings, Layers,
} from 'lucide-react';

// ─── Interactive Storage Calculator ─────────────────────────────────────────

function StorageCalculator() {
  const [activeCollection, setActiveCollection] = useState<number>(0);

  const collections = [
    {
      name: 'LookupMap',
      lookup: 'O(1)',
      iteration: '✕ No',
      ordering: '✕ No',
      storagePerEntry: '~130 bytes',
      gasRead: '~5 TGas',
      gasWrite: '~5 TGas',
      bestFor: 'Simple key-value lookups (balances, configs)',
      overhead: 'Lowest',
      color: 'from-emerald-500/30 to-emerald-600/20',
      borderColor: 'border-emerald-500/40',
      textColor: 'text-emerald-400',
    },
    {
      name: 'UnorderedMap',
      lookup: 'O(1)',
      iteration: '✓ Yes',
      ordering: '✕ No',
      storagePerEntry: '~180 bytes',
      gasRead: '~5 TGas',
      gasWrite: '~8 TGas',
      bestFor: 'Collections you need to iterate (all users, all NFTs)',
      overhead: 'Medium',
      color: 'from-blue-500/30 to-blue-600/20',
      borderColor: 'border-blue-500/40',
      textColor: 'text-blue-400',
    },
    {
      name: 'TreeMap',
      lookup: 'O(log n)',
      iteration: '✓ Yes',
      ordering: '✓ Yes',
      storagePerEntry: '~250 bytes',
      gasRead: '~7 TGas',
      gasWrite: '~10 TGas',
      bestFor: 'Sorted data (leaderboards, price feeds)',
      overhead: 'Highest',
      color: 'from-amber-500/30 to-amber-600/20',
      borderColor: 'border-amber-500/40',
      textColor: 'text-amber-400',
    },
    {
      name: 'Vector',
      lookup: 'O(1) by index',
      iteration: '✓ Yes',
      ordering: '✓ Insert order',
      storagePerEntry: '~100 bytes',
      gasRead: '~5 TGas',
      gasWrite: '~5 TGas',
      bestFor: 'Append-only lists (logs, history, queues)',
      overhead: 'Low',
      color: 'from-purple-500/30 to-purple-600/20',
      borderColor: 'border-purple-500/40',
      textColor: 'text-purple-400',
    },
  ];

  const active = collections[activeCollection];
  const entriesExample = 1000;
  const bytesPerEntry = parseInt(active.storagePerEntry) || 150;
  const totalBytes = entriesExample * bytesPerEntry;
  const nearCost = (totalBytes / 100_000).toFixed(3);

  return (
    <div className="relative py-6">
      {/* Collection Selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
        {collections.map((col, i) => (
          <motion.button
            key={col.name}
            onClick={() => setActiveCollection(i)}
            className={cn(
              'rounded-xl p-3 border text-left transition-all',
              `bg-gradient-to-br ${col.color} ${col.borderColor}`,
              activeCollection === i && 'ring-1 ring-white/20 shadow-lg'
            )}
            whileHover={{ scale: 1.02 }}
          >
            <span className={cn('text-xs font-bold font-mono block', col.textColor)}>{col.name}</span>
            <span className="text-[10px] text-text-muted block mt-1">{col.overhead} overhead</span>
          </motion.button>
        ))}
      </div>

      {/* Detail Card */}
      <motion.div
        key={activeCollection}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn('rounded-xl p-4 border', `bg-gradient-to-br ${active.color} ${active.borderColor}`)}
      >
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-text-muted block">Lookup</span>
            <span className="text-text-primary font-mono">{active.lookup}</span>
          </div>
          <div>
            <span className="text-text-muted block">Iteration</span>
            <span className="text-text-primary font-mono">{active.iteration}</span>
          </div>
          <div>
            <span className="text-text-muted block">Ordering</span>
            <span className="text-text-primary font-mono">{active.ordering}</span>
          </div>
          <div>
            <span className="text-text-muted block">Storage/Entry</span>
            <span className="text-text-primary font-mono">{active.storagePerEntry}</span>
          </div>
          <div>
            <span className="text-text-muted block">Gas Read</span>
            <span className="text-text-primary font-mono">{active.gasRead}</span>
          </div>
          <div>
            <span className="text-text-muted block">Gas Write</span>
            <span className="text-text-primary font-mono">{active.gasWrite}</span>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-white/10">
          <span className="text-[10px] text-text-muted">Best for: </span>
          <span className="text-[10px] text-text-secondary">{active.bestFor}</span>
        </div>
      </motion.div>

      {/* Cost Estimate */}
      <div className="mt-4 p-3 rounded-lg bg-surface border border-border">
        <div className="flex items-center justify-between">
          <span className="text-xs text-text-muted font-mono">
            Cost for {entriesExample.toLocaleString()} entries:
          </span>
          <span className="text-sm font-bold text-near-green font-mono">{nearCost} NEAR locked</span>
        </div>
        <div className="mt-2 h-2 bg-surface-hover rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(parseFloat(nearCost) * 50, 100)}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <p className="text-[10px] text-text-muted mt-1">
          Rate: 1 NEAR per 100KB • Storage stake is locked, not burned — recoverable on deletion
        </p>
      </div>

      <p className="text-center text-xs text-text-muted mt-4">
        Click collection types to compare storage characteristics →
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
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-amber-400" />
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

  const question = 'How much NEAR is locked per 100KB of contract storage?';
  const options = [
    '0.1 NEAR',
    '10 NEAR',
    '1 NEAR',
    'Storage is free on NEAR',
  ];
  const explanation = 'Correct! NEAR locks 1 NEAR per 100KB of storage. This stake is not burned — you get it back when storage is freed. This mechanism prevents state bloat while keeping storage economically sustainable.';
  const wrongExplanation = 'Not quite. NEAR\'s storage staking rate is exactly 1 NEAR per 100KB. This is locked (not burned) and is returned when data is deleted. This economic model prevents spam while being fair to developers.';

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

interface AdvancedStorageProps {
  isActive: boolean;
  onToggle?: () => void;
}

const AdvancedStorage: React.FC<AdvancedStorageProps> = ({ isActive, onToggle }) => {
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    try {
      const progress = JSON.parse(localStorage.getItem('voidspace-hacker-progress') || '{}');
      if (progress['advanced-storage']) setCompleted(true);
    } catch {}
  }, []);

  const handleComplete = () => {
    if (completed) return;
    try {
      const progress = JSON.parse(localStorage.getItem('voidspace-hacker-progress') || '{}');
      progress['advanced-storage'] = true;
      localStorage.setItem('voidspace-hacker-progress', JSON.stringify(progress));
      setCompleted(true);
    } catch {}
  };
  return (
    <Card variant="glass" padding="none" className="border-amber-500/20">
      {/* Accordion Header */}
      <div onClick={onToggle} className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
            <Database className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Advanced Storage Patterns</h3>
            <p className="text-text-muted text-sm">Trie storage mechanics, storage staking, efficient collections, and data architecture</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-near-green/10 text-near-green border-near-green/20">Module 3 of 16</Badge>
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
            <div className="border-t border-amber-500/20 p-6 space-y-8">
              {/* The Big Idea */}
              <Card variant="glass" padding="lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-amber-400" />
                  </div>
                  <h4 className="text-lg font-bold text-text-primary">The Big Idea</h4>
                </div>
                <p className="text-text-secondary leading-relaxed">
                  Blockchain storage is like <span className="text-amber-400 font-medium">renting a safety deposit box at a bank</span> —
                  except you pay rent per byte, and the rent is locked NEAR tokens. The bigger your box, the more tokens
                  are locked. Smart developers use <span className="text-orange-400 font-medium">clever packing</span> to
                  fit more data in smaller boxes. Choose the wrong data structure and you&apos;ll waste storage (and money).
                  Choose wisely and your contract stays lean, fast, and affordable.
                </p>
              </Card>

              {/* Interactive Visual */}
              <div>
                <h4 className="text-lg font-bold text-text-primary mb-2">🔍 Storage Collection Comparison</h4>
                <p className="text-sm text-text-muted mb-4">Compare NEAR&apos;s collection types — each trades off between features and storage cost.</p>
                <StorageCalculator />
              </div>

              {/* Security Gotcha */}
              <Card variant="default" padding="md" className="border-orange-500/20 bg-orange-500/5">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-orange-400 text-sm mb-1">⚠️ Security Gotcha</h4>
                    <p className="text-sm text-text-secondary">
                      If you don&apos;t require storage deposits from users, an attacker can <span className="text-orange-300 font-medium">drain
                      your contract&apos;s NEAR balance</span> by creating thousands of entries. Each entry locks ~0.01 NEAR
                      in storage staking. 10,000 spam entries = 100 NEAR locked. Always use{' '}
                      <span className="font-mono text-orange-300">#[payable]</span> and validate the attached deposit
                      covers the storage cost before writing data.
                    </p>
                  </div>
                </div>
              </Card>

              {/* Core Concepts */}
              <div>
                <h4 className="text-lg font-bold text-text-primary mb-4">🧩 Core Concepts</h4>
                <div className="space-y-3">
                  <ConceptCard
                    icon={Database}
                    title="Storage Staking"
                    preview="1 NEAR per 100KB — locked, not burned. Recoverable when data is deleted."
                    details="NEAR uses a storage staking model: for every 100KB of state your contract uses, 1 NEAR must be locked in the contract's account. This isn't a fee — the NEAR is returned when storage is freed. This creates economic pressure to keep state small and incentivizes cleanup. Contracts should track storage usage before/after operations and charge users proportionally."
                  />
                  <ConceptCard
                    icon={Layers}
                    title="Trie Storage"
                    preview="NEAR stores all state in a Merkle Patricia Trie for efficient proofs."
                    details="Under the hood, all contract state is stored in a Merkle Patricia Trie — a tree where each path from root to leaf represents a storage key. This structure enables efficient state proofs (prove a value exists without downloading everything) and incremental state syncing. Each key-value write updates the trie path, so key length affects gas cost. Shorter, well-structured keys = cheaper operations."
                  />
                  <ConceptCard
                    icon={Box}
                    title="Collection Types"
                    preview="LookupMap vs UnorderedMap vs TreeMap — each has different tradeoffs."
                    details="LookupMap: O(1) reads/writes, no iteration — use for simple key-value (token balances). UnorderedMap: O(1) reads/writes with iteration support — use when you need to enumerate all entries. TreeMap: O(log n) with sorted iteration — use for ordered data like price feeds or leaderboards. Vector: O(1) index access — use for append-only lists. Wrong choice = wasted gas and storage."
                  />
                  <ConceptCard
                    icon={Settings}
                    title="Lazy Loading"
                    preview="near_sdk lazy options prevent loading entire collections on every call."
                    details="By default, near_sdk deserializes your entire contract state on every function call — even if you only need one field. For large collections, this wastes enormous gas. Use LazyOption<T> for fields loaded on-demand, and prefer LookupMap over UnorderedMap when you don't need iteration. The pattern: #[near(contract_state)] with Lazy<T> wrapping expensive fields ensures they're only loaded when accessed."
                  />
                  <ConceptCard
                    icon={Search}
                    title="Storage Keys & Prefixes"
                    preview="Prefix-based namespacing prevents key collisions between data structures."
                    details="Each near_sdk collection uses a byte prefix to namespace its keys in the trie. If two collections accidentally share a prefix, they'll overwrite each other's data — a critical bug. Always use unique, short prefixes: b'a' for accounts, b'b' for balances, etc. The StorageKey enum pattern is recommended: #[derive(BorshSerialize)] enum StorageKey { Accounts, Balances, Metadata }. This ensures compile-time uniqueness."
                  />
                  <ConceptCard
                    icon={Shield}
                    title="Storage Deposits"
                    preview="Requiring users to pay for their own storage prevents drain attacks."
                    details="The standard pattern: mark functions that write data as #[payable], measure storage before and after the operation using env::storage_usage(), calculate the cost (bytes_used * STORAGE_PRICE_PER_BYTE), and assert the attached deposit covers it. Refund any excess. NEP-145 (Storage Management) standardizes this: users register with a storage deposit, and the contract tracks per-user storage accounting."
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
                    <li className="flex items-start gap-2"><span className="text-red-400">•</span> Storage exhaustion — spam entries to drain the contract&apos;s NEAR balance through forced storage staking</li>
                    <li className="flex items-start gap-2"><span className="text-red-400">•</span> Key collision — malicious prefix overlap between collections causes silent data corruption</li>
                    <li className="flex items-start gap-2"><span className="text-red-400">•</span> State bloat — unbounded collections grow indefinitely, making the contract progressively more expensive to operate</li>
                  </ul>
                </Card>
                <Card variant="default" padding="md" className="border-emerald-500/20">
                  <h4 className="font-semibold text-emerald-400 text-sm mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4" /> Defenses
                  </h4>
                  <ul className="text-xs text-text-muted space-y-1.5">
                    <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> Require storage deposit per entry — measure before/after and assert deposit covers the difference</li>
                    <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> Use StorageKey enum for unique prefix namespacing — compile-time guarantee of no collisions</li>
                    <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> Implement pagination and cleanup methods — set maximum collection sizes and allow users to remove their own data</li>
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
                    'Storage staking locks 1 NEAR per 100KB — it\'s not burned and is recoverable on deletion',
                    'Use LookupMap for key-value without iteration, UnorderedMap when you need to enumerate entries',
                    'Always require storage deposits from users to prevent balance drain attacks',
                    'Lazy loading prevents expensive deserialization of large collections on every call',
                    'Prefix namespacing with StorageKey enum prevents key collisions between data structures',
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

export default AdvancedStorage;
