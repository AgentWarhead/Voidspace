'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import {
  ChevronDown, ChevronUp, BookOpen, Clock, CheckCircle2,
  Lightbulb, Zap, Database, Gauge, List, Hash, TreeDeciduous,
} from 'lucide-react';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface CollectionsIteratorsProps {
  isActive: boolean;
  onToggle: () => void;
}

// ─── Interactive: Gas Cost Comparison Visualizer ───────────────────────────────

type CollectionType = 'std-hashmap' | 'lookup-map' | 'unordered-map' | 'tree-map' | 'vector';

const COLLECTION_DATA: { id: CollectionType; name: string; import: string; color: string; border: string; gasScore: number; features: string[]; bestFor: string; avoid: string }[] = [
  {
    id: 'std-hashmap',
    name: 'HashMap<K,V>',
    import: 'std::collections::HashMap',
    color: 'text-red-400',
    border: 'border-red-500/40',
    gasScore: 10,
    features: ['In-memory only', 'Full serialization on every call', 'Loads ALL entries from storage'],
    bestFor: 'Temporary local computations inside a method',
    avoid: 'NEVER store as contract state field — serializes entire map every call',
  },
  {
    id: 'lookup-map',
    name: 'LookupMap<K,V>',
    import: 'near_sdk::store::LookupMap',
    color: 'text-emerald-400',
    border: 'border-emerald-500/40',
    gasScore: 95,
    features: ['Lazy loading — only reads keys you access', 'O(1) get/insert/remove', 'No iteration support'],
    bestFor: 'Token balances, user profiles, any key-value store you only access by key',
    avoid: 'When you need to iterate all entries (use UnorderedMap instead)',
  },
  {
    id: 'unordered-map',
    name: 'UnorderedMap<K,V>',
    import: 'near_sdk::store::UnorderedMap',
    color: 'text-blue-400',
    border: 'border-blue-500/40',
    gasScore: 80,
    features: ['Lazy loading per key', 'Supports iteration', 'O(1) amortized operations'],
    bestFor: 'NFT registries, member lists where you sometimes need to list all entries',
    avoid: 'When you need sorted iteration — use TreeMap instead',
  },
  {
    id: 'tree-map',
    name: 'TreeMap<K,V>',
    import: 'near_sdk::store::TreeMap',
    color: 'text-purple-400',
    border: 'border-purple-500/40',
    gasScore: 65,
    features: ['Sorted key order always', 'Range queries supported', 'O(log n) operations'],
    bestFor: 'Leaderboards, auction bids, time-ordered events',
    avoid: 'Simple key-value — overhead of tree maintenance not worth it without range queries',
  },
  {
    id: 'vector',
    name: 'Vector<T>',
    import: 'near_sdk::store::Vector',
    color: 'text-cyan-400',
    border: 'border-cyan-500/40',
    gasScore: 90,
    features: ['Indexed access by position', 'Push/pop/swap_remove', 'Efficient append operations'],
    bestFor: 'Ordered lists, event logs, queues — anywhere you need positional access',
    avoid: 'Arbitrary key lookup — use a Map type for that',
  },
];

function GasCostVisualizer() {
  const [selected, setSelected] = useState<CollectionType>('lookup-map');
  const current = COLLECTION_DATA.find(c => c.id === selected)!;

  return (
    <div className="space-y-4">
      <p className="text-sm text-text-muted">Compare NEAR SDK collections vs standard Rust collections — gas efficiency matters.</p>

      <div className="space-y-2">
        {COLLECTION_DATA.map(col => (
          <motion.button
            key={col.id}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => setSelected(col.id)}
            className={cn(
              'w-full rounded-lg border p-3 text-left transition-all',
              selected === col.id
                ? `${col.border} bg-black/30`
                : 'border-border bg-surface hover:border-border-hover'
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={cn('font-mono text-sm font-bold', selected === col.id ? col.color : 'text-text-secondary')}>
                {col.name}
              </span>
              <span className={cn('text-xs font-semibold', col.gasScore >= 85 ? 'text-emerald-400' : col.gasScore >= 60 ? 'text-yellow-400' : 'text-red-400')}>
                Gas efficiency: {col.gasScore}%
              </span>
            </div>
            <div className="w-full bg-black/30 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${col.gasScore}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className={cn(
                  'h-2 rounded-full',
                  col.gasScore >= 85 ? 'bg-emerald-500' : col.gasScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                )}
              />
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={selected}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className={cn('rounded-lg border p-4 space-y-3 bg-black/20', current.border)}
        >
          <div>
            <p className={cn('font-mono text-sm font-bold mb-0.5', current.color)}>{current.name}</p>
            <p className="text-xs text-text-muted font-mono">use {current.import};</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <p className="text-text-muted font-semibold mb-1">✨ Features</p>
              <ul className="space-y-0.5 text-text-secondary">
                {current.features.map((f, i) => <li key={i}>• {f}</li>)}
              </ul>
            </div>
            <div className="space-y-2">
              <div>
                <p className="text-emerald-400 font-semibold mb-0.5">✓ Best for</p>
                <p className="text-text-secondary">{current.bestFor}</p>
              </div>
              <div>
                <p className="text-red-400 font-semibold mb-0.5">✗ Avoid when</p>
                <p className="text-text-secondary">{current.avoid}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─── Concept Card ──────────────────────────────────────────────────────────────

function ConceptCard({ icon: Icon, title, preview, details, iconColor = 'text-teal-400', bgColor = 'from-teal-500/20 to-emerald-500/20', borderColor = 'border-teal-500/20' }: {
  icon: React.ElementType;
  title: string;
  preview: string;
  details: string;
  iconColor?: string;
  bgColor?: string;
  borderColor?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Card variant="glass" padding="md" className="cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
      <div className="flex items-start gap-4">
        <div className={cn('w-10 h-10 rounded-lg bg-gradient-to-br border flex items-center justify-center flex-shrink-0', bgColor, borderColor)}>
          <Icon className={cn('w-5 h-5', iconColor)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-semibold text-text-primary">{title}</h4>
            <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown className="w-4 h-4 text-text-muted" />
            </motion.div>
          </div>
          <p className="text-sm text-text-secondary">{preview}</p>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <p className="text-sm text-text-muted mt-3 pt-3 border-t border-border leading-relaxed">{details}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Card>
  );
}

// ─── Mini Quiz ─────────────────────────────────────────────────────────────────

function MiniQuiz() {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const correct = 1;
  const options = [
    'Use std::collections::HashMap for contract state — it\'s the most familiar collection type',
    'Use near_sdk::store::LookupMap for key-value state — it lazily loads only the keys you access, saving gas',
    'Vec<T> should always be used instead of near_sdk::store::Vector for contract state',
    'All collection types serialize identically on NEAR — choose based on API preference only',
  ];
  return (
    <Card variant="glass" padding="lg">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-near-green" />
        <h4 className="font-bold text-text-primary">Quick Check — Collections for Contract State</h4>
      </div>
      <p className="text-text-secondary mb-4 text-sm">You&apos;re building a token contract with 10,000 user balances. Which collection type should you use?</p>
      <div className="space-y-2">
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={() => { setSelected(i); setRevealed(true); }}
            className={cn(
              'w-full text-left px-4 py-3 rounded-lg border text-sm transition-all',
              revealed && i === correct
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                : revealed && i === selected && i !== correct
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
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              'mt-4 p-3 rounded-lg text-sm',
              selected === correct
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
            )}
          >
            {selected === correct
              ? '✓ Correct! LookupMap only loads the specific key you request — if a user calls ft_balance_of, it reads their entry only. HashMap would serialize/deserialize all 10,000 balances on every call — catastrophic gas cost.'
              : '✗ Always use near_sdk::store::LookupMap for key-value contract state. Standard HashMap serializes the ENTIRE map on every method call — with 10,000 balances that\'s thousands of storage reads per transaction.'}
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

// ─── Main Module ───────────────────────────────────────────────────────────────

const CollectionsIterators: React.FC<CollectionsIteratorsProps> = ({ isActive, onToggle }) => {
  const [completed, setCompleted] = useState(false);

  const handleComplete = () => {
    setCompleted(true);
    const progress = JSON.parse(localStorage.getItem('voidspace-builder-progress') || '{}');
    progress['collections-iterators'] = true;
    localStorage.setItem('voidspace-builder-progress', JSON.stringify(progress));
  };

  return (
    <Card variant="glass" padding="none" className="border-teal-500/20">
      {/* ── Accordion Header ── */}
      <div
        onClick={onToggle}
        className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center">
            <Database className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Collections &amp; Iterators</h3>
            <p className="text-text-muted text-sm">Gas-efficient data structures for NEAR smart contracts</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-teal-500/10 text-teal-300 border-teal-500/20">Intermediate</Badge>
          <Badge className="bg-purple-500/10 text-purple-300 border-purple-500/20">45 min</Badge>
          {isActive ? <ChevronUp className="w-5 h-5 text-text-muted" /> : <ChevronDown className="w-5 h-5 text-text-muted" />}
        </div>
      </div>

      {/* ── Expanded Content ── */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="border-t border-teal-500/20 p-6 space-y-8">
              {/* Module Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-teal-500/20 bg-teal-500/5 text-xs text-teal-400">
                <BookOpen className="w-3 h-3" />
                Module 7 of 27
                <span className="text-text-muted">•</span>
                <Clock className="w-3 h-3" />
                45 min read
              </div>

              {/* The Big Idea */}
              <Card variant="glass" padding="lg" className="border-teal-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500/20 to-emerald-500/20 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-teal-400" />
                  </div>
                  <h2 className="text-xl font-bold text-text-primary">The Wrong Collection Can Drain Your Users</h2>
                </div>
                <p className="text-text-secondary leading-relaxed">
                  Using <code className="text-red-400 bg-black/30 px-1 rounded">HashMap</code> in contract state is one of the
                  most common (and expensive) NEAR contract mistakes. Standard Rust collections serialize
                  <span className="text-teal-400 font-medium"> the entire collection</span> to/from storage on every method call.
                  NEAR SDK collections are <span className="text-teal-400 font-medium">lazy</span> — they only touch the
                  exact keys you access. For a contract with 10,000 users, that&apos;s the difference between
                  a ~1 TGas call and a ~10,000 TGas call.
                </p>
              </Card>

              {/* Code: Standard Collections */}
              <div>
                <h3 className="text-lg font-bold text-text-primary mb-3">💻 Standard Rust Collections (Local Use Only)</h3>
                <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-text-secondary border border-border overflow-x-auto">
                  <div className="text-text-muted">{'// Vec<T> — growable array, great for temporary calculations'}</div>
                  <div><span className="text-purple-400">let mut</span> bids: <span className="text-cyan-400">Vec</span>{'<u128>'} = Vec::new();</div>
                  <div>{'bids.push(1000); bids.push(2000); bids.push(1500);'}</div>
                  <div className="text-text-muted mt-1">{'// Iterator magic: find max bid in one line'}</div>
                  <div><span className="text-purple-400">let</span> highest = bids.iter().max().copied().unwrap_or(<span className="text-orange-400">0</span>);</div>
                  <div className="mt-3 text-text-muted">{'// Iterator chain: filter → map → collect'}</div>
                  <div><span className="text-purple-400">let</span> winners: <span className="text-cyan-400">Vec</span>{'<String>'} = accounts</div>
                  <div>{'    .iter()'}</div>
                  <div>{'    .filter(|a| balances.get(*a).unwrap_or(0) > threshold)'}</div>
                  <div>{'    .map(|a| a.to_string())'}</div>
                  <div>{'    .collect();  // materialize the iterator into a Vec'}</div>
                  <div className="mt-3 text-text-muted">{'// for..in loops use iterators under the hood'}</div>
                  <div><span className="text-purple-400">for</span> (account, amount) <span className="text-purple-400">in</span> transfers.iter() {'{'}</div>
                  <div>{'    self.balances.insert(account.clone(), *amount);'}</div>
                  <div>{'}'}</div>
                </div>
              </div>

              {/* Code: NEAR Collections */}
              <div>
                <h3 className="text-lg font-bold text-text-primary mb-3">💻 NEAR SDK Collections (For Contract State)</h3>
                <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-text-secondary border border-border overflow-x-auto">
                  <div><span className="text-purple-400">use</span> {'near_sdk::store::{LookupMap, UnorderedMap, Vector};'}</div>
                  <div><span className="text-purple-400">use</span> {'near_sdk::store::lookup_map::Entry;'}</div>
                  <div className="mt-2"><span className="text-purple-400">#[near(contract_state)]</span></div>
                  <div><span className="text-purple-400">pub struct</span> <span className="text-cyan-400">TokenContract</span> {'{'}</div>
                  <div>{'    // LookupMap: O(1) access, no iteration, minimal gas'}</div>
                  <div>{'    balances: LookupMap<AccountId, u128>,'}</div>
                  <div>{'    // UnorderedMap: O(1) access + supports iteration'}</div>
                  <div>{'    metadata: UnorderedMap<String, String>,'}</div>
                  <div>{'    // Vector: indexed, push/pop, ordered'}</div>
                  <div>{'    transfer_log: Vector<(AccountId, u128)>,'}</div>
                  <div>{'}'}</div>
                  <div className="mt-2"><span className="text-purple-400">#[near]</span></div>
                  <div><span className="text-purple-400">impl</span> <span className="text-cyan-400">TokenContract</span> {'{'}</div>
                  <div>{'    pub fn ft_balance_of(&self, account: AccountId) -> u128 {'}</div>
                  <div>{'        // Only reads ONE storage slot, not the whole map'}</div>
                  <div>{'        self.balances.get(&account).copied().unwrap_or(0)'}</div>
                  <div>{'    }'}</div>
                  <div>{'    pub fn ft_transfer(&mut self, to: AccountId, amount: u128) {'}</div>
                  <div>{'        let sender = env::predecessor_account_id();'}</div>
                  <div>{'        let from_bal = self.balances.get(&sender).copied().unwrap_or(0);'}</div>
                  <div>{'        require!(from_bal >= amount, "Insufficient balance");'}</div>
                  <div>{'        self.balances.insert(sender, from_bal - amount);'}</div>
                  <div>{'        let to_bal = self.balances.get(&to).copied().unwrap_or(0);'}</div>
                  <div>{'        self.balances.insert(to, to_bal + amount);'}</div>
                  <div>{'    }'}</div>
                  <div>{'}'}</div>
                </div>
              </div>

              {/* Interactive Gas Visualizer */}
              <div>
                <h3 className="text-lg font-bold text-text-primary mb-2">⚡ Gas Cost Comparison</h3>
                <p className="text-sm text-text-muted mb-4">Click each collection type to see its gas profile and when to use it.</p>
                <GasCostVisualizer />
              </div>

              {/* Pro Tip */}
              <div className="bg-gradient-to-r from-teal-500/10 to-emerald-500/5 border border-teal-500/20 rounded-xl p-5">
                <h4 className="font-semibold text-teal-400 text-sm mb-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" /> The Collection Decision Tree
                </h4>
                <p className="text-xs text-text-secondary leading-relaxed">
                  <span className="text-teal-400 font-medium">Key-value, no iteration needed?</span> → LookupMap (most gas-efficient).{' '}
                  <span className="text-teal-400 font-medium">Need to iterate all entries?</span> → UnorderedMap.{' '}
                  <span className="text-teal-400 font-medium">Need sorted order or range queries?</span> → TreeMap.{' '}
                  <span className="text-teal-400 font-medium">Ordered list with push/pop?</span> → Vector.{' '}
                  <span className="text-teal-400 font-medium">Temporary in-method calculations?</span> → Standard Vec/HashMap is fine there.
                </p>
              </div>

              {/* Concept Cards */}
              <div>
                <h3 className="text-lg font-bold text-text-primary mb-4">🧩 Core Concepts</h3>
                <div className="grid grid-cols-1 gap-4">
                  <ConceptCard
                    icon={List}
                    title="Vec<T> and Iterators"
                    preview="Growable arrays with a powerful functional transformation API"
                    details="Vec<T> is Rust's dynamic array. Iterator methods like .map(), .filter(), .collect(), .fold() chain together lazily — they don't compute anything until you consume the iterator with .collect() or a loop. This means long chains don't allocate intermediate collections. Use iterator chains for data transformation inside method bodies; use near_sdk::store::Vector for persistent ordered data in contract state."
                    iconColor="text-teal-400"
                    bgColor="from-teal-500/20 to-teal-500/10"
                    borderColor="border-teal-500/20"
                  />
                  <ConceptCard
                    icon={Hash}
                    title="HashMap<K,V> vs LookupMap<K,V>"
                    preview="Standard vs NEAR-optimized — critical difference for contract state"
                    details="std::collections::HashMap stores all entries in memory and serializes the whole map to/from storage on every method call. near_sdk::store::LookupMap stores each entry independently in contract storage — accessing key 'alice' reads only alice's slot. For 10,000 users, LookupMap reads 1 storage slot vs HashMap reading 10,000. Always use LookupMap for contract state."
                    iconColor="text-blue-400"
                    bgColor="from-blue-500/20 to-blue-500/10"
                    borderColor="border-blue-500/20"
                  />
                  <ConceptCard
                    icon={Database}
                    title="UnorderedMap vs TreeMap"
                    preview="When you need to iterate — pick the right ordered vs unordered variant"
                    details="UnorderedMap<K,V> supports iteration in arbitrary order — O(1) for individual key access, good for paginated listings. TreeMap<K,V> maintains sorted key order always — supports range queries like 'all entries with keys between A and B', useful for sorted leaderboards or time-windowed lookups. Both are lazy-loading like LookupMap, just with different iteration capabilities."
                    iconColor="text-purple-400"
                    bgColor="from-purple-500/20 to-purple-500/10"
                    borderColor="border-purple-500/20"
                  />
                  <ConceptCard
                    icon={Gauge}
                    title="Gas-Efficient Iteration Patterns"
                    preview="Pagination and bounded loops — never iterate unboundedly on-chain"
                    details="Iterating over all entries in a NEAR collection costs gas proportional to the count. A contract with 1 million entries that iterates all of them would exceed the gas limit and fail. Always paginate: accept from_index and limit parameters, use .iter().skip(from_index).take(limit).collect(). This is how NFT contracts implement nft_tokens — paginated access with a maximum limit."
                    iconColor="text-orange-400"
                    bgColor="from-orange-500/20 to-orange-500/10"
                    borderColor="border-orange-500/20"
                  />
                  <ConceptCard
                    icon={TreeDeciduous}
                    title="Storage Deposits & Collection Size"
                    preview="NEAR charges for storage — your collections grow and shrink storage costs"
                    details="NEAR charges ~1 NEAR per 10KB of storage. When users mint NFTs, register accounts, or add data, storage grows. Production NEAR contracts implement storage deposit mechanics: users pay for their own storage via #[payable] registration methods that call env::storage_deposit(). near-sdk provides StorageManagement (NEP-145) for this pattern. Always plan for unbounded collection growth."
                    iconColor="text-emerald-400"
                    bgColor="from-emerald-500/20 to-emerald-500/10"
                    borderColor="border-emerald-500/20"
                  />
                </div>
              </div>

              {/* Common Mistakes */}
              <Card variant="default" padding="md" className="border-orange-500/20 bg-orange-500/5">
                <h4 className="font-semibold text-orange-400 mb-2">⚠️ Common Mistakes</h4>
                <ul className="space-y-1 text-sm text-text-secondary">
                  <li>• Storing std::collections::HashMap in contract state — will serialize the ENTIRE map every call</li>
                  <li>• Iterating all collection entries without pagination — will hit gas limit and panic for large collections</li>
                  <li>• Using Vec&lt;T&gt; for contract state instead of near_sdk::store::Vector — same serialization problem as HashMap</li>
                  <li>• Not implementing storage deposit — users can fill your contract&apos;s storage for free, locking your contract</li>
                </ul>
              </Card>

              {/* Quiz */}
              <MiniQuiz />

              {/* Key Takeaways */}
              <Card variant="glass" padding="lg" className="border-teal-500/20">
                <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-teal-400" />
                  Key Takeaways
                </h3>
                <ul className="space-y-2">
                  {[
                    'NEVER store std::collections::HashMap or Vec in contract state — they serialize everything on every call.',
                    'Use near_sdk::store::LookupMap for key-value state. It\'s lazy — only reads the keys you actually access.',
                    'Need iteration? UnorderedMap (any order) or TreeMap (sorted). Always paginate with from_index + limit.',
                    'Iterator chains (.map().filter().collect()) are lazy and zero-cost — chain them freely for local transformations.',
                  ].map((point, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                      <span className="text-teal-400 mt-0.5 font-bold">→</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Mark Complete */}
              <motion.button
                onClick={handleComplete}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  'w-full py-3 rounded-xl font-semibold text-sm transition-all',
                  completed
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-teal-500/10 text-teal-300 border border-teal-500/30 hover:bg-teal-500/20'
                )}
              >
                {completed ? '✓ Module Complete' : 'Mark as Complete'}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default CollectionsIterators;
