'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import {
  ChevronDown, ChevronUp, BookOpen, Clock, CheckCircle2,
  Lightbulb, Zap, Database, HardDrive, Layers, Gauge, Code,
  Rocket,
} from 'lucide-react';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface StateManagementProps {
  isActive: boolean;
  onToggle: () => void;
}

// ─── Interactive Visual: Collection Comparison ─────────────────────────────────

const collections = [
  { name: 'LookupMap', lookup: '✅ O(1)', iterate: '❌ No', useCase: 'Balances, settings — when you only need key→value lookups', storage: 'Low', icon: '🔍' },
  { name: 'UnorderedMap', lookup: '✅ O(1)', iterate: '✅ Yes', useCase: 'Registries — when you need both lookup AND iteration', storage: 'Medium', icon: '📋' },
  { name: 'Vector', lookup: '✅ O(1) by index', iterate: '✅ Yes', useCase: 'Ordered lists, logs — when insertion order matters', storage: 'Low', icon: '📝' },
  { name: 'LookupSet', lookup: '✅ O(1)', iterate: '❌ No', useCase: 'Whitelists, seen-flags — just checking membership', storage: 'Lowest', icon: '✓' },
  { name: 'UnorderedSet', lookup: '✅ O(1)', iterate: '✅ Yes', useCase: 'Voter lists — when you need membership check + enumerate', storage: 'Medium', icon: '👥' },
];

function CollectionComparison() {
  const [activeCol, setActiveCol] = useState<number | null>(null);

  return (
    <div className="relative py-4">
      <div className="space-y-2">
        {collections.map((col, i) => (
          <motion.div
            key={col.name}
            className={cn(
              'cursor-pointer rounded-lg border p-3 transition-all',
              activeCol === i
                ? 'border-near-green/40 bg-near-green/5'
                : 'border-border bg-black/20 hover:border-border-hover'
            )}
            onClick={() => setActiveCol(activeCol === i ? null : i)}
            whileHover={{ x: 4 }}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{col.icon}</span>
              <span className="text-sm font-bold text-text-primary flex-1">{col.name}</span>
              <div className="flex gap-3 text-xs">
                <span className="text-text-muted">Lookup: <span className="text-near-green">{col.lookup.split(' ')[0]}</span></span>
                <span className="text-text-muted">Iterate: <span className={col.iterate.startsWith('✅') ? 'text-near-green' : 'text-red-400'}>{col.iterate.split(' ')[0]}</span></span>
              </div>
            </div>
            <AnimatePresence>
              {activeCol === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-2 pt-2 border-t border-border/50 flex flex-col gap-1">
                    <p className="text-xs text-text-muted"><span className="text-text-secondary font-medium">Use case:</span> {col.useCase}</p>
                    <p className="text-xs text-text-muted"><span className="text-text-secondary font-medium">Storage overhead:</span> {col.storage}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
      <p className="text-center text-xs text-text-muted mt-4">
        👆 Click each collection to see when to use it
      </p>
    </div>
  );
}

// ─── Concept Card ──────────────────────────────────────────────────────────────

function ConceptCard({ icon: Icon, title, preview, details }: {
  icon: React.ElementType;
  title: string;
  preview: string;
  details: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Card variant="glass" padding="md" className="cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-cyan-400" />
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
                <p className="text-sm text-text-muted mt-3 pt-3 border-t border-border leading-relaxed">
                  {details}
                </p>
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
  const correctAnswer = 2;
  const options = [
    'UnorderedMap — it handles everything and iteration is always needed',
    'Vector — ordered storage is the most efficient choice',
    'LookupMap — O(1) lookups with no iteration overhead',
    'LookupSet — sets are always better for key-value data',
  ];
  return (
    <Card variant="glass" padding="lg">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-near-green" />
        <h4 className="font-bold text-text-primary">Quick Check</h4>
      </div>
      <p className="text-text-secondary mb-4">You&apos;re building an FT contract that maps accounts to balances. Which collection is best?</p>
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
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              'mt-4 p-3 rounded-lg text-sm',
              selected === correctAnswer
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
            )}
          >
            {selected === correctAnswer
              ? '✓ Correct! LookupMap gives O(1) lookups with minimal storage overhead. You rarely need to iterate over all balances, so the extra cost of UnorderedMap is wasted.'
              : '✗ Not quite. LookupMap is ideal for account→balance mappings because it provides O(1) lookups without the storage overhead needed for iteration support. Use UnorderedMap only when you truly need to enumerate all entries.'}
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

// ─── Main Module ───────────────────────────────────────────────────────────────

const StateManagement: React.FC<StateManagementProps> = ({ isActive, onToggle }) => {
  const [completed, setCompleted] = useState(false);

  const handleComplete = () => {
    setCompleted(true);
  };

  return (
    <Card variant="glass" padding="none" className="border-near-green/20">
      {/* ── Accordion Header ── */}
      <div
        onClick={onToggle}
        className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
            <Database className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">State Management</h3>
            <p className="text-text-muted text-sm">On-chain storage, persistent collections, and storage staking</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {completed && (
            <Badge className="bg-emerald-500/10 text-emerald-300 border-emerald-500/20">✓ Complete</Badge>
          )}
          <Badge className="bg-amber-500/10 text-amber-300 border-amber-500/20">Intermediate</Badge>
          <Badge className="bg-purple-500/10 text-purple-300 border-purple-500/20">35 min</Badge>
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
            <div className="border-t border-near-green/20 p-6 space-y-8">
              {/* Module Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-near-green/20 bg-near-green/5 text-xs text-near-green">
                <BookOpen className="w-3 h-3" />
                Module 5 of 22
                <span className="text-text-muted">•</span>
                <Clock className="w-3 h-3" />
                35 min read
              </div>

              {/* The Big Idea */}
              <Card variant="glass" padding="lg" className="border-near-green/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-cyan-400" />
                  </div>
                  <h2 className="text-xl font-bold text-text-primary">The Big Idea</h2>
                </div>
                <p className="text-text-secondary leading-relaxed">
                  On-chain storage is like a <span className="text-near-green font-medium">pay-per-square-foot warehouse</span>. Every byte you
                  store costs NEAR tokens locked as a deposit — you get them back when you delete the data. Unlike a regular
                  database, you can&apos;t just throw everything in a <span className="text-near-green font-medium">HashMap</span> — NEAR&apos;s
                  persistent collections are lazy-loaded from storage, so choosing the right collection type directly impacts
                  your contract&apos;s gas costs and storage fees.
                </p>
              </Card>

              {/* Interactive Visual */}
              <div>
                <h3 className="text-lg font-bold text-text-primary mb-2">🔧 Collection Picker</h3>
                <p className="text-sm text-text-muted mb-4">Compare NEAR&apos;s persistent collections — pick the right one for your use case.</p>
                <CollectionComparison />
              </div>

              {/* Code Example */}
              <div>
                <h3 className="text-lg font-bold text-text-primary mb-3">💻 Code In Action</h3>
                <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border overflow-x-auto">
                  <div><span className="text-purple-400">use</span> near_sdk::{'{'}near, env, NearToken{'}'};;</div>
                  <div><span className="text-purple-400">use</span> near_sdk::store::LookupMap;</div>
                  <div className="mt-2"><span className="text-purple-400">#[near(contract_state)]</span></div>
                  <div><span className="text-purple-400">pub struct</span> <span className="text-cyan-400">TokenVault</span> {'{'}</div>
                  <div>    balances: LookupMap&lt;AccountId, <span className="text-cyan-400">u128</span>&gt;,</div>
                  <div>    total_supply: <span className="text-cyan-400">u128</span>,</div>
                  <div>{'}'}</div>
                  <div className="mt-2"><span className="text-purple-400">impl</span> <span className="text-cyan-400">Default</span> <span className="text-purple-400">for</span> <span className="text-cyan-400">TokenVault</span> {'{'}</div>
                  <div>    <span className="text-purple-400">fn</span> <span className="text-near-green">default</span>() -&gt; <span className="text-cyan-400">Self</span> {'{'}</div>
                  <div>        <span className="text-cyan-400">Self</span> {'{'}</div>
                  <div>            balances: LookupMap::new(<span className="text-yellow-300">b&quot;b&quot;</span>),</div>
                  <div>            total_supply: <span className="text-cyan-400">0</span>,</div>
                  <div>        {'}'}</div>
                  <div>    {'}'}</div>
                  <div>{'}'}</div>
                  <div className="mt-2"><span className="text-purple-400">#[near]</span></div>
                  <div><span className="text-purple-400">impl</span> <span className="text-cyan-400">TokenVault</span> {'{'}</div>
                  <div>    <span className="text-purple-400">#[payable]</span></div>
                  <div>    <span className="text-purple-400">pub fn</span> <span className="text-near-green">deposit</span>(&amp;<span className="text-purple-400">mut</span> self) {'{'}</div>
                  <div>        <span className="text-purple-400">let</span> amount = env::attached_deposit();</div>
                  <div>        <span className="text-purple-400">let</span> account = env::predecessor_account_id();</div>
                  <div>        <span className="text-purple-400">let</span> balance = self.balances.get(&amp;account).unwrap_or(&amp;<span className="text-cyan-400">0</span>);</div>
                  <div>        self.balances.set(account, Some(balance + amount.as_yoctonear()));</div>
                  <div>    {'}'}</div>
                  <div>{'}'}</div>
                </div>
              </div>

              {/* Pro Tip - Storage Deposit Patterns */}
              <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/5 border border-blue-500/20 rounded-xl p-5">
                <h4 className="font-semibold text-cyan-400 text-sm mb-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" /> Pro Tip
                </h4>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Always measure storage before and after writes:{' '}
                  <code className="text-cyan-300 bg-black/30 px-1 rounded">let before = env::storage_usage();</code>{' '}
                  ... write data ...{' '}
                  <code className="text-cyan-300 bg-black/30 px-1 rounded">let after = env::storage_usage();</code>.{' '}
                  Charge users{' '}
                  <code className="text-cyan-300 bg-black/30 px-1 rounded">(after - before) * env::storage_byte_cost()</code>{' '}
                  to cover the deposit. This pattern prevents your contract from running out of storage budget.
                  The NEP-145 storage management standard formalizes this into{' '}
                  <code className="text-cyan-300 bg-black/30 px-1 rounded">storage_deposit()</code> and{' '}
                  <code className="text-cyan-300 bg-black/30 px-1 rounded">storage_withdraw()</code> methods.
                </p>
              </div>

              {/* Concept Cards */}
              <div>
                <h3 className="text-lg font-bold text-text-primary mb-4">🧩 Core Concepts</h3>
                <div className="grid grid-cols-1 gap-4">
                  <ConceptCard
                    icon={HardDrive}
                    title="Storage Staking"
                    preview="1 byte stored ≈ 0.00001 NEAR locked as a deposit"
                    details="NEAR requires a storage deposit for every byte stored on-chain. This isn't a fee — it's a stake. Delete the data and you get the NEAR back. A typical account entry costs ~0.01 NEAR. Contracts should track storage usage before/after writes and charge users accordingly via #[payable] methods. Forgetting storage deposits is the #1 cause of failed transactions."
                  />
                  <ConceptCard
                    icon={Database}
                    title="Persistent Collections"
                    preview="Lazy-loaded data structures optimized for on-chain storage"
                    details="Unlike standard Rust HashMap/Vec which load ALL data into memory, NEAR's persistent collections (LookupMap, UnorderedMap, Vector, etc.) load entries lazily — only the keys you access are read from storage. This is critical because loading 10,000 entries on every call would be prohibitively expensive. Each collection needs a unique prefix (b'b') to namespace its storage keys."
                  />
                  <ConceptCard
                    icon={Layers}
                    title="Storage Prefixes"
                    preview="Every collection needs a unique byte prefix to avoid key collisions"
                    details="When you create a LookupMap::new(b'b'), the 'b' prefix namespaces all keys in that collection. If two collections share a prefix, they'll overwrite each other's data. Convention: use single bytes (b'a', b'b', b'c') for top-level collections. Nested collections (like a map of maps) need dynamic prefixes generated from the outer key."
                  />
                  <ConceptCard
                    icon={Gauge}
                    title="Gas Optimization"
                    preview="Every storage read/write costs gas — minimize them"
                    details="Reading from storage costs ~5 Tgas per read, writing costs ~10 Tgas. For hot paths, cache values in local variables instead of reading from storage multiple times. Batch writes when possible. Use LookupMap over UnorderedMap unless you truly need iteration — UnorderedMap maintains extra indexing data that costs gas on every write."
                  />
                  <ConceptCard
                    icon={Code}
                    title="Borsh Serialization"
                    preview="How Rust structs become bytes stored on-chain"
                    details="NEAR uses Borsh (Binary Object Representation Serializer for Hashing) to convert Rust types into compact bytes. It's deterministic — same data always produces same bytes. The #[near(contract_state)] macro auto-derives BorshSerialize and BorshDeserialize. For JSON-compatible APIs, method parameters use serde_json by default. Custom types in collections must derive BorshSerialize + BorshDeserialize."
                  />
                  <ConceptCard
                    icon={Layers}
                    title="Nested Collections &amp; Advanced Types"
                    preview="TreeMap for sorted data, LazyOption for large optional values"
                    details="When you need sorted iteration (e.g., a leaderboard), use TreeMap — it keeps entries ordered by key with O(log n) lookups. LazyOption is ideal for large values you rarely read (like contract metadata or config blobs) — it only loads from storage when explicitly accessed. For maps-of-maps patterns, generate unique prefixes by hashing the outer key: LookupMap::new(env::sha256(outer_key.as_bytes())). This avoids prefix collisions in deeply nested structures."
                  />
                </div>
              </div>

              {/* Real World Example */}
              <Card variant="glass" padding="lg" className="border-cyan-500/20">
                <h3 className="text-lg font-bold text-text-primary mb-3 flex items-center gap-2">
                  <Rocket className="w-5 h-5 text-cyan-400" /> Real World Example
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed mb-3">
                  A user registration system that charges storage deposits. When users register,
                  they pay for their storage. When they unregister, the deposit is refunded.
                </p>
                <div className="bg-black/40 rounded-lg p-3 font-mono text-xs text-text-secondary border border-border overflow-x-auto">
                  <div><span className="text-purple-400">#[near]</span></div>
                  <div><span className="text-purple-400">impl</span> <span className="text-cyan-400">Registry</span> {'{'}</div>
                  <div>    <span className="text-purple-400">#[payable]</span></div>
                  <div>    <span className="text-purple-400">pub fn</span> <span className="text-near-green">register</span>(&amp;<span className="text-purple-400">mut</span> self) {'{'}</div>
                  <div>        <span className="text-text-muted">// Measure storage before the write</span></div>
                  <div>        <span className="text-purple-400">let</span> before = env::storage_usage();</div>
                  <div>        <span className="text-purple-400">let</span> account = env::predecessor_account_id();</div>
                  <div className="mt-1">        <span className="text-text-muted">// Insert user into the registry</span></div>
                  <div>        self.users.insert(account.clone(), UserProfile::new());</div>
                  <div className="mt-1">        <span className="text-text-muted">// Calculate storage cost</span></div>
                  <div>        <span className="text-purple-400">let</span> after = env::storage_usage();</div>
                  <div>        <span className="text-purple-400">let</span> cost = NearToken::from_yoctonear(</div>
                  <div>            u128::from(after - before) * env::storage_byte_cost().as_yoctonear()</div>
                  <div>        );</div>
                  <div className="mt-1">        <span className="text-text-muted">// Ensure the user attached enough deposit</span></div>
                  <div>        <span className="text-purple-400">assert!</span>(</div>
                  <div>            env::attached_deposit() &gt;= cost,</div>
                  <div>            <span className="text-yellow-300">&quot;Attach at least {'{'}{'}'} to cover storage&quot;</span>, cost</div>
                  <div>        );</div>
                  <div className="mt-1">        <span className="text-text-muted">// Track deposit for refund on unregister</span></div>
                  <div>        self.deposits.insert(account, env::attached_deposit());</div>
                  <div>    {'}'}</div>
                  <div className="mt-2">    <span className="text-purple-400">pub fn</span> <span className="text-near-green">unregister</span>(&amp;<span className="text-purple-400">mut</span> self) {'{'}</div>
                  <div>        <span className="text-purple-400">let</span> account = env::predecessor_account_id();</div>
                  <div>        self.users.remove(&amp;account);</div>
                  <div>        <span className="text-text-muted">// Refund their storage deposit</span></div>
                  <div>        <span className="text-purple-400">if let</span> Some(deposit) = self.deposits.remove(&amp;account) {'{'}</div>
                  <div>            Promise::new(account).transfer(deposit);</div>
                  <div>        {'}'}</div>
                  <div>    {'}'}</div>
                  <div>{'}'}</div>
                </div>
              </Card>

              {/* Common Mistakes */}
              <Card variant="default" padding="md" className="border-orange-500/20 bg-orange-500/5">
                <h4 className="font-semibold text-orange-400 mb-2">⚠️ Common Mistakes</h4>
                <ul className="space-y-1 text-sm text-text-secondary">
                  <li>• Reusing storage prefixes across collections — causes data corruption with no compile-time warning</li>
                  <li>• Using standard HashMap instead of NEAR&apos;s LookupMap — loads ALL data on every call, hitting gas limits</li>
                  <li>• Forgetting storage deposits on #[payable] methods — transactions fail when storage can&apos;t be covered</li>
                  <li>• Iterating over large UnorderedMaps in a single call — will exceed gas limits above ~1000 entries</li>
                </ul>
              </Card>

              {/* Mini Quiz */}
              <MiniQuiz />

              {/* Key Takeaways */}
              <Card variant="glass" padding="lg" className="border-near-green/20">
                <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-near-green" />
                  Key Takeaways
                </h3>
                <ul className="space-y-2">
                  {[
                    'Storage costs NEAR tokens locked as a deposit — delete data to reclaim them.',
                    'Use LookupMap for key→value pairs you don\'t need to iterate; UnorderedMap when you do.',
                    'Every collection needs a unique byte prefix to prevent storage key collisions.',
                    'Persistent collections are lazy-loaded — only accessed keys are read from storage.',
                    'Measure storage before/after writes and charge callers the difference as a deposit.',
                  ].map((point, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                      <span className="text-near-green mt-0.5 font-bold">→</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Mark Complete Button */}
              <div className="flex justify-center pt-2">
                <motion.button
                  onClick={handleComplete}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={cn(
                    'px-8 py-3 rounded-xl font-semibold text-sm transition-all flex items-center gap-2',
                    completed
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default'
                      : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-cyan-500/20 cursor-pointer'
                  )}
                  disabled={completed}
                >
                  {completed ? (
                    <>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                      >
                        <CheckCircle2 className="w-5 h-5" />
                      </motion.div>
                      Module Complete!
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      Mark as Complete
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default StateManagement;
