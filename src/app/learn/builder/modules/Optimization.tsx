'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import {
  ChevronDown, ChevronUp, BookOpen, Clock, CheckCircle2,
  Lightbulb, Zap, Gauge, HardDrive, Timer, Package,
  TrendingDown, Database,
} from 'lucide-react';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface OptimizationProps {
  isActive: boolean;
  onToggle?: () => void;
}

// ─── Interactive Visual: Gas Cost Calculator ───────────────────────────────────

const gasComparisons = [
  {
    id: 'collections',
    label: 'Collection Choice',
    icon: Database,
    scenarios: [
      { name: 'LookupMap (recommended)', gas: 2.5, storage: 'Low', note: 'O(1) lookup, no iteration' },
      { name: 'UnorderedMap', gas: 3.8, storage: 'Medium', note: 'O(1) lookup + iteration support' },
      { name: 'TreeMap', gas: 5.2, storage: 'Medium', note: 'O(log n) lookup, sorted iteration' },
    ],
    desc: 'Choose LookupMap when you only need key-value lookups. UnorderedMap adds iteration support at a storage cost. TreeMap provides sorted access but is slower.',
  },
  {
    id: 'serialization',
    label: 'Serialization',
    icon: Package,
    scenarios: [
      { name: 'Borsh (default)', gas: 1.0, storage: 'Compact', note: 'Binary format, smallest size' },
      { name: 'JSON', gas: 3.2, storage: 'Larger', note: 'Human readable, bigger payloads' },
      { name: 'Manual packing', gas: 0.8, storage: 'Minimal', note: 'Custom bit-packing, complex code' },
    ],
    desc: 'Borsh is the default and usually best. JSON is only needed for cross-language calls. Manual packing saves gas but adds complexity.',
  },
  {
    id: 'patterns',
    label: 'Access Patterns',
    icon: TrendingDown,
    scenarios: [
      { name: 'Paginated query', gas: 2.0, storage: 'N/A', note: 'Returns 10-50 items at a time' },
      { name: 'Return all items', gas: 50.0, storage: 'N/A', note: 'Gas grows with data size!' },
      { name: 'View method', gas: 0.0, storage: 'N/A', note: 'Free for callers, no state change' },
    ],
    desc: 'Paginated queries keep gas predictable. Returning all items is a ticking time bomb -- it will exceed gas limits as data grows.',
  },
  {
    id: 'storage',
    label: 'Storage Tricks',
    icon: HardDrive,
    scenarios: [
      { name: 'u64 timestamp', gas: 1.0, storage: '8 bytes', note: 'Compact number format' },
      { name: 'String timestamp', gas: 1.2, storage: '~24 bytes', note: '3x more storage!' },
      { name: 'IPFS CID (off-chain)', gas: 1.0, storage: '~46 bytes', note: 'Store data off-chain' },
      { name: 'Full data on-chain', gas: 1.0, storage: '~1000+ bytes', note: 'Very expensive!' },
    ],
    desc: 'Every byte costs ~0.00001 NEAR locked. Use compact types (u64 over String), store large data off-chain (IPFS/Arweave), and only keep essential state on-chain.',
  },
];

function GasCostCalculator() {
  const [activeComparison, setActiveComparison] = useState<string>('collections');

  const active = gasComparisons.find((c) => c.id === activeComparison);
  const maxGas = active ? Math.max(...active.scenarios.map((s) => s.gas)) : 1;

  return (
    <div className="space-y-4">
      {/* Category tabs */}
      <div className="flex flex-wrap gap-2">
        {gasComparisons.map((comp) => {
          const Icon = comp.icon;
          return (
            <button
              key={comp.id}
              onClick={() => setActiveComparison(comp.id)}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all border',
                activeComparison === comp.id
                  ? 'bg-yellow-500/20 border-yellow-500/40 text-yellow-300'
                  : 'bg-black/20 border-border text-text-muted hover:border-yellow-500/30'
              )}
            >
              <Icon className="w-3 h-3" />
              {comp.label}
            </button>
          );
        })}
      </div>

      {/* Comparison bars */}
      {active && (
        <div className="space-y-3">
          {active.scenarios.map((scenario, i) => (
            <motion.div
              key={scenario.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="space-y-1"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-primary font-medium">{scenario.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-text-muted">{scenario.storage}</span>
                  <span className={cn(
                    'font-mono font-bold',
                    scenario.gas === 0 ? 'text-near-green' :
                    scenario.gas <= 2 ? 'text-emerald-400' :
                    scenario.gas <= 5 ? 'text-yellow-400' : 'text-red-400'
                  )}>
                    {scenario.gas === 0 ? 'FREE' : `${scenario.gas} TGas`}
                  </span>
                </div>
              </div>
              <div className="h-2 rounded-full bg-black/40 border border-border overflow-hidden">
                <motion.div
                  className={cn(
                    'h-full rounded-full',
                    scenario.gas === 0 ? 'bg-near-green' :
                    scenario.gas <= 2 ? 'bg-gradient-to-r from-emerald-500 to-green-500' :
                    scenario.gas <= 5 ? 'bg-gradient-to-r from-yellow-500 to-amber-500' :
                    'bg-gradient-to-r from-red-500 to-orange-500'
                  )}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max((scenario.gas / maxGas) * 100, 2)}%` }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                />
              </div>
              <p className="text-xs text-text-muted">{scenario.note}</p>
            </motion.div>
          ))}
          <p className="text-xs text-text-secondary leading-relaxed mt-2 p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/10">
            {active.desc}
          </p>
        </div>
      )}

      <p className="text-center text-xs text-text-muted">
        Compare gas and storage costs across different approaches
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
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500/20 to-red-500/20 border border-yellow-500/20 flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-yellow-400" />
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
  const correctAnswer = 1;
  const options = [
    'Use UnorderedMap for everything since it supports both lookups and iteration',
    'Use LookupMap when you only need key-value access and do not need to iterate',
    'Use TreeMap as the default since sorted access is always useful',
    'Avoid all SDK collections and use raw storage operations for best performance',
  ];

  return (
    <Card variant="glass" padding="lg">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-near-green" />
        <h4 className="font-bold text-text-primary">Quick Check</h4>
      </div>
      <p className="text-text-secondary mb-4">
        What is the best practice for choosing NEAR SDK collections?
      </p>
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
            <span className="font-mono text-xs mr-2 opacity-50">
              {String.fromCharCode(65 + i)}.
            </span>
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
              ? 'Correct! LookupMap is the most gas and storage efficient collection for simple key-value access. Only upgrade to UnorderedMap when you actually need to iterate over entries, and TreeMap when you need sorted access.'
              : 'Not quite. The principle is: use the simplest collection that meets your needs. LookupMap is cheapest for lookups. UnorderedMap adds iteration at a storage cost. TreeMap is for sorted access. Raw storage is rarely worth the complexity.'}
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

// ─── Main Module ───────────────────────────────────────────────────────────────

const Optimization: React.FC<OptimizationProps> = ({ isActive, onToggle }) => {
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const progress = JSON.parse(localStorage.getItem('voidspace-builder-progress') || '{}');
      if (progress['optimization']) setCompleted(true);
    }
  }, []);

  const handleComplete = () => {
    if (typeof window !== 'undefined') {
      const progress = JSON.parse(localStorage.getItem('voidspace-builder-progress') || '{}');
      progress['optimization'] = true;
      localStorage.setItem('voidspace-builder-progress', JSON.stringify(progress));
      setCompleted(true);
    }
  };

  return (
    <Card variant="glass" padding="none" className="border-yellow-500/20">
      {/* Accordion Header */}
      <div
        onClick={onToggle}
        className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center',
            completed
              ? 'bg-gradient-to-br from-emerald-500 to-green-600'
              : 'bg-gradient-to-br from-yellow-500 to-red-500'
          )}>
            {completed ? <CheckCircle2 className="w-6 h-6 text-white" /> : <Zap className="w-6 h-6 text-white" />}
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Optimization</h3>
            <p className="text-text-muted text-sm">Reduce gas costs, minimize storage, and shrink WASM binary size</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {completed && (
            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Complete</Badge>
          )}
          <Badge className="bg-error/10 text-error border-error/20">Advanced</Badge>
          <Badge className="bg-purple-500/10 text-purple-300 border-purple-500/20">45 min</Badge>
          {isActive ? <ChevronUp className="w-5 h-5 text-text-muted" /> : <ChevronDown className="w-5 h-5 text-text-muted" />}
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="border-t border-yellow-500/20 p-6 space-y-8">
              {/* Module Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-yellow-500/20 bg-yellow-500/5 text-xs text-yellow-400">
                <BookOpen className="w-3 h-3" />
                Module 20 of 27
                <span className="text-text-muted">|</span>
                <Clock className="w-3 h-3" />
                45 min read
              </div>

              {/* The Big Idea */}
              <Card variant="glass" padding="lg" className="border-yellow-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-500/20 to-red-500/20 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-yellow-400" />
                  </div>
                  <h2 className="text-xl font-bold text-text-primary">The Big Idea</h2>
                </div>
                <p className="text-text-secondary leading-relaxed">
                  Optimization on NEAR is about{' '}
                  <span className="text-yellow-400 font-medium">three resources: gas, storage, and binary size</span>.
                  Gas determines transaction cost. Storage locks NEAR tokens proportional to bytes used.
                  Binary size affects deployment cost and gas overhead. The good news: small changes
                  yield big savings. Choosing{' '}
                  <span className="text-yellow-400 font-medium">LookupMap over UnorderedMap</span>{' '}
                  when you do not need iteration, using pagination instead of returning all items, and
                  configuring Cargo.toml for size optimization can reduce costs by 50% or more.
                </p>
              </Card>

              {/* Interactive Visual */}
              <div>
                <h3 className="text-lg font-bold text-text-primary mb-2">
                  {'\u{1F4CA}'} Gas and Storage Cost Comparison
                </h3>
                <p className="text-sm text-text-muted mb-4">
                  Compare different approaches and see their relative gas and storage costs.
                </p>
                <GasCostCalculator />
              </div>

              {/* WASM Size Code Example */}
              <div>
                <h3 className="text-lg font-bold text-text-primary mb-3">
                  {'\u{1F4E6}'} WASM Size Optimization
                </h3>
                <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border overflow-x-auto">
                  <div className="text-text-muted"># Cargo.toml -- add these for smaller builds</div>
                  <div>[profile.release]</div>
                  <div>codegen-units = 1</div>
                  <div>opt-level = <span className="text-yellow-300">&quot;z&quot;</span>       <span className="text-text-muted"># Optimize for size</span></div>
                  <div>lto = <span className="text-purple-400">true</span>              <span className="text-text-muted"># Link-time optimization</span></div>
                  <div>debug = <span className="text-purple-400">false</span>           <span className="text-text-muted"># No debug symbols</span></div>
                  <div>panic = <span className="text-yellow-300">&quot;abort&quot;</span>        <span className="text-text-muted"># Smaller panic handler</span></div>
                  <div>overflow-checks = <span className="text-purple-400">true</span>  <span className="text-text-muted"># Keep for safety!</span></div>
                </div>
                <div className="bg-black/40 rounded-lg p-3 font-mono text-sm text-text-secondary border border-border mt-3">
                  <div className="text-text-muted"># Check your WASM size</div>
                  <div><span className="text-near-green">cargo near build</span></div>
                  <div><span className="text-near-green">ls -lh target/near/*.wasm</span></div>
                  <div className="text-text-muted mt-1"># Goal: Under 200KB for simple contracts</div>
                  <div className="text-text-muted"># Complex contracts: 200KB-500KB</div>
                </div>
              </div>

              {/* Pagination Code */}
              <div>
                <h3 className="text-lg font-bold text-text-primary mb-3">
                  {'\u{26A1}'} Pagination Pattern
                </h3>
                <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border overflow-x-auto">
                  <div className="text-text-muted">{'// Never return all items at once!'}</div>
                  <div><span className="text-purple-400">pub fn</span> <span className="text-near-green">get_polls</span>(</div>
                  <div>{'    '}&amp;self,</div>
                  <div>{'    '}from_index: u64,</div>
                  <div>{'    '}limit: u64,</div>
                  <div>) -&gt; Vec&lt;&amp;Poll&gt; {'{'}</div>
                  <div>{'    '}self.polls.iter()</div>
                  <div>{'        '}.skip(from_index <span className="text-purple-400">as</span> usize)</div>
                  <div>{'        '}.take(limit <span className="text-purple-400">as</span> usize)</div>
                  <div>{'        '}.collect()</div>
                  <div>{'}'}</div>
                  <div className="mt-2 text-text-muted">{'// Client calls: get_polls(0, 20), get_polls(20, 20), ...'}</div>
                </div>
              </div>

              {/* Collection Performance Table */}
              <div>
                <h3 className="text-lg font-bold text-text-primary mb-3">
                  {'\u{1F4CA}'} Collection Performance Guide
                </h3>
                <div className="bg-black/30 rounded-lg p-4 border border-border overflow-x-auto">
                  <div className="grid grid-cols-4 gap-4 text-xs text-text-muted font-mono min-w-fit">
                    <div className="font-semibold text-text-primary">Collection</div>
                    <div className="font-semibold text-text-primary">Lookup</div>
                    <div className="font-semibold text-text-primary">Iterate</div>
                    <div className="font-semibold text-text-primary">Storage</div>
                    <div className="text-cyan-400">LookupMap</div><div className="text-near-green">O(1)</div><div className="text-red-400">No</div><div className="text-near-green">Low</div>
                    <div className="text-cyan-400">UnorderedMap</div><div className="text-near-green">O(1)</div><div className="text-near-green">Yes</div><div className="text-yellow-400">Medium</div>
                    <div className="text-cyan-400">Vector</div><div className="text-near-green">O(1)*</div><div className="text-near-green">Yes</div><div className="text-near-green">Low</div>
                    <div className="text-cyan-400">LookupSet</div><div className="text-near-green">O(1)</div><div className="text-red-400">No</div><div className="text-near-green">Lowest</div>
                    <div className="text-cyan-400">UnorderedSet</div><div className="text-near-green">O(1)</div><div className="text-near-green">Yes</div><div className="text-yellow-400">Medium</div>
                    <div className="text-cyan-400">TreeMap</div><div className="text-yellow-400">O(log n)</div><div className="text-near-green">Sorted</div><div className="text-yellow-400">Medium</div>
                  </div>
                </div>
                <p className="text-xs text-text-muted mt-1">* Vector lookup is O(1) by index, but searching by value is O(n).</p>
              </div>

              {/* Pro Tip */}
              <div className="bg-gradient-to-r from-yellow-500/10 to-red-500/5 border border-yellow-500/20 rounded-xl p-5">
                <h4 className="font-semibold text-yellow-400 text-sm mb-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" /> Pro Tip
                </h4>
                <p className="text-xs text-text-secondary leading-relaxed">
                  <span className="text-yellow-400 font-medium">View methods are free for callers</span>.
                  Any method that does not modify state (marked with <code className="text-yellow-400 bg-yellow-500/10 px-1 rounded">&amp;self</code>{' '}
                  instead of <code className="text-yellow-400 bg-yellow-500/10 px-1 rounded">&amp;mut self</code>)
                  runs as a view call -- the node processes it locally without submitting a transaction.
                  Move as much logic as possible into view methods. For example, instead of storing
                  computed values, store raw data and compute on read via view methods.
                </p>
              </div>

              {/* Concept Cards */}
              <div>
                <h3 className="text-lg font-bold text-text-primary mb-4">
                  {'\u{1F9E9}'} Core Optimization Strategies
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <ConceptCard
                    icon={Timer}
                    title="Gas Optimization"
                    preview="Reduce the cost of every transaction your users pay"
                    details="Use LookupMap over UnorderedMap when iteration is not needed. Batch multiple storage reads into a single call. Minimize cross-contract call chains -- each hop adds ~5 TGas overhead. Avoid loading entire collections; paginate everything. Use view methods for reads (free for callers). Profile gas usage with near-workspaces tests to find hot paths."
                  />
                  <ConceptCard
                    icon={HardDrive}
                    title="Storage Optimization"
                    preview="Minimize locked NEAR by reducing on-chain data"
                    details="Every byte on-chain costs ~0.00001 NEAR locked (not burned). Use u64 timestamps instead of String dates (8 bytes vs ~24). Store large data (images, metadata) on IPFS or Arweave -- only keep the CID on-chain. Use compact enum variants instead of String fields. Remove storage when no longer needed to unlock NEAR. Account for storage costs in your token economics."
                  />
                  <ConceptCard
                    icon={Package}
                    title="WASM Binary Size"
                    preview="Smaller binary means cheaper deployment and lower overhead"
                    details="Configure Cargo.toml release profile: opt-level z, lto true, codegen-units 1, panic abort. Remove unnecessary dependencies -- each crate adds to binary size. Use near-sdk features selectively. Target under 200KB for simple contracts, 200-500KB for complex ones. Run wasm-opt for additional size reduction after compilation."
                  />
                  <ConceptCard
                    icon={Gauge}
                    title="Benchmarking and Profiling"
                    preview="Measure before optimizing -- find the actual bottlenecks"
                    details="Use near-workspaces integration tests to measure gas per method call. Check transaction receipts on NearBlocks for real-world gas consumption. Compare gas before and after changes to verify improvements. Focus on the methods your users call most frequently -- optimizing a rarely-used admin method matters less than optimizing a hot DeFi path."
                  />
                </div>
              </div>

              {/* Common Mistakes */}
              <Card variant="default" padding="md" className="border-orange-500/20 bg-orange-500/5">
                <h4 className="font-semibold text-orange-400 mb-2">Common Mistakes</h4>
                <ul className="space-y-1 text-sm text-text-secondary">
                  <li>{'- '}Using UnorderedMap everywhere when LookupMap would suffice</li>
                  <li>{'- '}Returning all items without pagination (gas bomb as data grows)</li>
                  <li>{'- '}Storing computed values on-chain instead of computing in view methods</li>
                  <li>{'- '}Skipping Cargo.toml release profile optimizations</li>
                  <li>{'- '}Excessive logging in production (each log costs gas)</li>
                </ul>
              </Card>

              {/* Mini Quiz */}
              <MiniQuiz />

              {/* Key Takeaways */}
              <Card variant="glass" padding="lg" className="border-yellow-500/20">
                <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-near-green" />
                  Key Takeaways
                </h3>
                <ul className="space-y-2">
                  {[
                    'Use LookupMap for simple key-value access -- only upgrade to UnorderedMap when you need iteration',
                    'Paginate all collection queries with from_index and limit to keep gas costs predictable',
                    'Store large data on IPFS/Arweave, not on-chain -- every byte costs locked NEAR',
                    'Configure Cargo.toml release profile (opt-level z, lto, panic abort) for smaller WASM',
                    'View methods are free for callers -- move as much read logic as possible into view methods',
                  ].map((point, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                      <span className="text-near-green mt-0.5 font-bold">{'\u2192'}</span>
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

export default Optimization;
