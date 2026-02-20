'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronUp,
  GitMerge,
  GitBranch,
  Zap,
  ArrowRight,
  Shield,
  Clock,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Database,
  RefreshCw,
  Lock,
  Code,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

interface UpgradingContractsProps {
  isActive: boolean;
  onToggle?: () => void;
}

const strategies = [
  { id: 'state-migration', label: 'State Migration', risk: 'Medium', riskColor: 'text-amber-400', complexity: 3, desc: 'Transform existing state in-place during upgrade',
    pros: ['No proxy overhead', 'Direct state transformation', 'Single contract to manage'],
    cons: ['Must handle all state versions', 'Migration function burns gas', 'Risky with large state'] },
  { id: 'proxy-pattern', label: 'Proxy Pattern', risk: 'Low', riskColor: 'text-emerald-400', complexity: 4, desc: 'Delegate calls through a stable proxy to upgradeable logic',
    pros: ['Stable address for users', 'Hot-swappable logic', 'Minimal downtime'],
    cons: ['Added gas per call', 'Complex deployment', 'Storage layout must stay compatible'] },
  { id: 'versioned-state', label: 'Versioned State', risk: 'Low', riskColor: 'text-emerald-400', complexity: 2, desc: 'Enum-based state that auto-migrates between versions',
    pros: ['Clean version tracking', 'Compile-time safety', 'Gradual migration'],
    cons: ['Enum grows over time', 'Old variants stay in code', 'Deserialization overhead'] },
  { id: 'full-redeploy', label: 'Full Redeploy', risk: 'High', riskColor: 'text-red-400', complexity: 1, desc: 'Deploy fresh contract, migrate data externally',
    pros: ['Clean slate', 'No legacy code', 'Simplest implementation'],
    cons: ['New contract address', 'External data migration', 'Users must re-connect'] },
];

function MigrationComparison() {
  const [activeStrategy, setActiveStrategy] = useState<string | null>(null);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {strategies.map((s) => (
        <motion.div key={s.id}
          className={cn('rounded-xl border p-4 cursor-pointer transition-all',
            activeStrategy === s.id ? 'border-cyan-500/40 bg-cyan-500/5' : 'border-border bg-black/20'
          )}
          whileHover={{ scale: 1.02 }}
          onClick={() => setActiveStrategy(activeStrategy === s.id ? null : s.id)}>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-text-primary">{s.label}</h4>
            <span className={cn('text-xs font-medium', s.riskColor)}>Risk: {s.risk}</span>
          </div>
          <div className="flex gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className={cn('h-1.5 w-6 rounded-full', n <= s.complexity ? 'bg-cyan-500' : 'bg-border')} />
            ))}
            <span className="text-[10px] text-text-muted ml-1">complexity</span>
          </div>
          <p className="text-xs text-text-muted">{s.desc}</p>
          <AnimatePresence>
            {activeStrategy === s.id && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="mt-3 pt-3 border-t border-border space-y-2">
                  <div>
                    <span className="text-[10px] text-emerald-400 font-semibold">PROS</span>
                    {s.pros.map((p) => <p key={p} className="text-xs text-text-muted">+ {p}</p>)}
                  </div>
                  <div>
                    <span className="text-[10px] text-red-400 font-semibold">CONS</span>
                    {s.cons.map((c) => <p key={c} className="text-xs text-text-muted">- {c}</p>)}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
      <p className="text-center text-xs text-text-muted md:col-span-2 mt-1">👆 Click any strategy to see trade-offs</p>
    </div>
  );
}

const upgradeSteps = [
  { label: 'Build', icon: '🔨', desc: 'Compile new WASM with cargo build --target wasm32-unknown-unknown --release', color: '#34d399' },
  { label: 'Test', icon: '🧪', desc: 'Test migration against real state snapshot using near-workspaces', color: '#3b82f6' },
  { label: 'Propose', icon: '📋', desc: 'Submit upgrade proposal to DAO with new WASM hash for verification', color: '#a78bfa' },
  { label: 'Vote', icon: '🗳️', desc: 'Council reviews code diff and votes to approve the upgrade', color: '#f59e0b' },
  { label: 'Deploy', icon: '🚀', desc: 'deploy_code deploys new WASM to the contract account', color: '#22d3ee' },
  { label: 'Migrate', icon: '🔄', desc: 'Call migrate() to transform state from old to new format', color: '#ec4899' },
];

function UpgradeProcessFlow() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const play = () => {
    setIsPlaying(true);
    setActiveStep(0);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step >= upgradeSteps.length) {
        clearInterval(interval);
        setIsPlaying(false);
      } else {
        setActiveStep(step);
      }
    }, 800);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-1 overflow-x-auto pb-2">
        {upgradeSteps.map((step, i) => (
          <div key={step.label} className="flex items-center flex-shrink-0">
            <motion.div
              onClick={() => { setActiveStep(i); setIsPlaying(false); }}
              animate={{ scale: activeStep === i ? 1.1 : 1, opacity: activeStep >= i ? 1 : 0.4 }}
              className={cn(
                'cursor-pointer rounded-xl px-3 py-2 border text-center min-w-[70px] transition-all',
                activeStep === i ? 'border-cyan-500/50 bg-cyan-500/10' : 'border-border bg-black/30'
              )}
            >
              <span className="text-lg block">{step.icon}</span>
              <span className="text-[10px] font-semibold text-text-primary block mt-1">{step.label}</span>
            </motion.div>
            {i < upgradeSteps.length - 1 && (
              <motion.div animate={{ opacity: activeStep > i ? 1 : 0.2 }} className="mx-0.5">
                <ArrowRight className="w-3 h-3 text-cyan-400" />
              </motion.div>
            )}
          </div>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={activeStep} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
          className="border border-border rounded-xl p-4 bg-black/20">
          <h5 className="text-sm font-semibold mb-1" style={{ color: upgradeSteps[activeStep].color }}>
            Step {activeStep + 1}: {upgradeSteps[activeStep].label}
          </h5>
          <p className="text-xs text-text-muted">{upgradeSteps[activeStep].desc}</p>
        </motion.div>
      </AnimatePresence>
      <button onClick={play} disabled={isPlaying}
        className={cn('text-xs px-4 py-2 rounded-lg border transition-all', isPlaying ? 'border-border text-text-muted' : 'border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10')}>
        {isPlaying ? 'Playing...' : '▶ Animate Pipeline'}
      </button>
    </div>
  );
}

function ConceptCard({ icon: Icon, title, preview, details }: {
  icon: React.ElementType; title: string; preview: string; details: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer border border-border rounded-xl p-4 hover:border-cyan-500/30 transition-all bg-black/20">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
          <Icon className="w-4 h-4 text-cyan-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-semibold text-text-primary text-sm">{title}</h4>
            <motion.div animate={{ rotate: isOpen ? 180 : 0 }}><ChevronDown className="w-4 h-4 text-text-muted" /></motion.div>
          </div>
          <p className="text-xs text-text-secondary">{preview}</p>
          <AnimatePresence>
            {isOpen && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <p className="text-xs text-text-muted mt-3 pt-3 border-t border-border leading-relaxed">{details}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function MiniQuiz() {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const correctAnswer = 0;
  const options = [
    'Use a versioned enum for contract state so old data can deserialize into the new structure',
    'Delete all storage and redeploy from scratch with a fresh state',
    'Keep the old contract running and deploy a new one at a different address',
    'Store all state as raw JSON strings to avoid schema changes',
  ];
  return (
    <div className="border border-border rounded-xl p-5 bg-black/20">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-amber-400" />
        <h4 className="font-semibold text-text-primary">Quick Check</h4>
      </div>
      <p className="text-sm text-text-secondary mb-4">What&apos;s the recommended pattern for handling state changes during a NEAR contract upgrade?</p>
      <div className="space-y-2">
        {options.map((opt, i) => (
          <button key={i} onClick={() => { setSelected(i); setRevealed(true); }} className={cn(
            'w-full text-left p-3 rounded-lg border text-sm transition-all',
            revealed && i === correctAnswer ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300'
              : revealed && i === selected && i !== correctAnswer ? 'border-red-500/50 bg-red-500/10 text-red-300'
              : selected === i ? 'border-near-green/50 bg-near-green/10 text-text-primary'
              : 'border-border hover:border-near-green/30 text-text-secondary hover:text-text-primary'
          )}>
            <span className="font-medium mr-2">{String.fromCharCode(65 + i)}.</span>{opt}
          </button>
        ))}
      </div>
      <AnimatePresence>
        {revealed && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className={cn('mt-4 p-3 rounded-lg border text-sm', selected === correctAnswer ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-300' : 'border-amber-500/30 bg-amber-500/5 text-amber-300')}>
              {selected === correctAnswer
                ? <p><CheckCircle className="w-4 h-4 inline mr-1" /> Correct! A versioned enum lets you deserialize old state into the new structure with a migrate() function — compile-time safety and clean version tracking.</p>
                : <p><AlertTriangle className="w-4 h-4 inline mr-1" /> Not quite. Versioned state enums let you deserialize old formats and transform them into the new structure during upgrade, without losing data.</p>
              }
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function UpgradingContracts({ isActive, onToggle }: UpgradingContractsProps) {
  const [completed, setCompleted] = useState(false);

  const handleComplete = () => {
    if (typeof window !== 'undefined') {
      const progress = JSON.parse(localStorage.getItem('voidspace-builder-progress') || '{}');
      progress['upgrading-contracts'] = true;
      localStorage.setItem('voidspace-builder-progress', JSON.stringify(progress));
      setCompleted(true);
    }
  };

  return (
    <Card variant="glass" padding="none" className="border-cyan-500/20">
      <div onClick={() => {}} style={{display:"none"}} className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
            <GitMerge className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Upgrading Contracts</h3>
            <p className="text-text-muted text-sm">Contract migration, state versioning, and upgrade patterns</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border-cyan-500/20">Builder</Badge>
          {isActive ? <ChevronUp className="w-5 h-5 text-text-muted" /> : <ChevronDown className="w-5 h-5 text-text-muted" />}
        </div>
      </div>

      {isActive && (
        <div className="border-t border-cyan-500/20 p-6 space-y-8">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 flex-wrap">
            <Badge className="bg-cyan-500/10 text-cyan-300 border-cyan-500/20">Module 18 of 27</Badge>
            <Badge className="bg-black/30 text-text-muted border-border"><Clock className="w-3 h-3 inline mr-1" />30 min read</Badge>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="bg-gradient-to-br from-cyan-500/10 to-blue-500/5 border border-cyan-500/20 rounded-xl p-5">
            <h4 className="text-lg font-bold text-text-primary mb-2">💡 The Big Idea</h4>
            <p className="text-sm text-text-secondary leading-relaxed">
              Upgrading a live smart contract is like <span className="text-cyan-400 font-medium">renovating a house while people are still living in it</span>.
              You can&apos;t tear everything down — keep the plumbing working, move furniture carefully, and make sure nobody&apos;s
              data gets lost. NEAR lets you redeploy code to the same account, but <span className="text-cyan-400 font-medium">the state stays</span>.
              If your new code expects a different state shape, you&apos;ll get deserialization panics. The solution: versioned
              state and migration functions that transform old data into the new format seamlessly.
            </p>
          </motion.div>

          <div>
            <h4 className="text-base font-semibold text-text-primary mb-4 flex items-center gap-2">
              <ArrowRight className="w-5 h-5 text-cyan-400" />
              Upgrade Pipeline — Interactive
            </h4>
            <div className="border border-border rounded-xl p-5 bg-black/20">
              <UpgradeProcessFlow />
            </div>
          </div>

          <div>
            <h4 className="text-base font-semibold text-text-primary mb-4 flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-cyan-400" />
              Migration Strategy Comparison
            </h4>
            <MigrationComparison />
          </div>

          <div>
            <h4 className="text-base font-semibold text-text-primary mb-3">💻 Code In Action</h4>
            <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border overflow-x-auto">
              <div className="text-text-muted">{'// Versioned state migration pattern'}</div>
              <div><span className="text-purple-400">use</span> near_sdk::borsh::{'{'}BorshDeserialize, BorshSerialize{'}'};</div>
              <div><span className="text-purple-400">use</span> near_sdk::{'{'}near, env{'}'};</div>
              <div className="mt-2"><span className="text-text-muted">// Old state (V1)</span></div>
              <div>#[derive(BorshDeserialize, BorshSerialize)]</div>
              <div><span className="text-purple-400">pub struct</span> <span className="text-cyan-400">ContractV1</span> {'{'}</div>
              <div>    owner: String,</div>
              <div>    value: u64,</div>
              <div>{'}'}</div>
              <div className="mt-2"><span className="text-text-muted">// New state (V2) — added field</span></div>
              <div>#[near(contract_state)]</div>
              <div><span className="text-purple-400">pub struct</span> <span className="text-cyan-400">Contract</span> {'{'}</div>
              <div>    owner: String,</div>
              <div>    value: u64,</div>
              <div>    description: String, <span className="text-text-muted">// new!</span></div>
              <div>{'}'}</div>
              <div className="mt-2">#[near]</div>
              <div><span className="text-purple-400">impl</span> <span className="text-cyan-400">Contract</span> {'{'}</div>
              <div>    #[private]</div>
              <div>    #[init(ignore_state)]</div>
              <div>    <span className="text-purple-400">pub fn</span> <span className="text-yellow-300">migrate</span>() -&gt; Self {'{'}</div>
              <div>        <span className="text-purple-400">let</span> old: ContractV1 =</div>
              <div>            env::state_read().expect(<span className="text-yellow-300">"failed"</span>);</div>
              <div>        Self {'{'}</div>
              <div>            owner: old.owner,</div>
              <div>            value: old.value,</div>
              <div>            description: String::from(<span className="text-yellow-300">"Migrated"</span>),</div>
              <div>        {'}'}</div>
              <div>    {'}'}</div>
              <div>{'}'}</div>
            </div>
          </div>

          <div>
            <h4 className="text-base font-semibold text-text-primary mb-4">Core Concepts</h4>
            <div className="grid gap-3">
              <ConceptCard icon={GitBranch} title="State Versioning" preview="Track state changes with version enums"
                details="Define VersionedState { V1(ContractV1), V2(ContractV2) }. When the contract loads, it deserializes whichever version exists and upgrades to latest. Rust compiler ensures you handle every version — compile-time exhaustiveness checks." />
              <ConceptCard icon={RefreshCw} title="Migration Functions" preview="Transform state from old to new format on upgrade"
                details="Use #[init(ignore_state)] to bypass normal initialization and manually read old state with env::state_read(). Construct the new shape and return it. Call immediately after deploying: near call contract.near migrate." />
              <ConceptCard icon={Shield} title="Access Control" preview="Only the contract itself should trigger migrations"
                details="Always mark migration functions with #[private] so only the contract account can call them. Without this, anyone could reset state. For DAO contracts, the upgrade proposal should include both deploy and migrate in a batch." />
              <ConceptCard icon={Database} title="Storage Compatibility" preview="Collection prefixes must stay stable across versions"
                details={'NEAR collections use byte prefixes to namespace storage keys. Changing a prefix between versions orphans all existing data. Use explicit, stable prefixes: LookupMap::new(b"b") \u2014 document your prefix map.'} />
              <ConceptCard icon={GitMerge} title="DAO-Governed Upgrades" preview="Multi-sig approval for production upgrades"
                details="Use SputnikDAO to approve upgrades. Flow: propose with WASM hash, council votes, then deploy_code + migrate execute atomically. Prevents single-key compromises from pushing malicious upgrades." />
              <ConceptCard icon={Lock} title="Emergency Rollback" preview="Always have a rollback strategy ready"
                details="Keep previous WASM and state struct in your codebase. If migration goes wrong, redeploy old code with reverse-migration. Some teams add a 'pause' function that freezes state-changing operations during upgrades." />
            </div>
          </div>

          <div className="border border-red-500/30 rounded-xl p-5 bg-red-500/5">
            <h4 className="font-semibold text-red-400 text-sm mb-2 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" /> Security Gotcha
            </h4>
            <p className="text-xs text-text-secondary mb-2">
              <strong className="text-red-300">Attack:</strong> A missing #[private] on migrate() lets anyone call it, potentially
              resetting contract state. Worse: if migrate() accepts parameters, an attacker could set themselves as owner.
            </p>
            <p className="text-xs text-text-secondary">
              <strong className="text-emerald-300">Defense:</strong> Always #[private] on migration functions. Test against real
              mainnet state snapshots. Implement contract pause during upgrades. Use DAO governance for all production upgrades.
            </p>
          </div>

          <div className="bg-gradient-to-br from-orange-500/5 to-transparent border border-orange-500/20 rounded-xl p-5">
            <h4 className="font-semibold text-orange-400 mb-3">⚠️ Common Mistakes</h4>
            <ul className="space-y-1 text-sm text-text-secondary">
              <li>• Deploying new code without a migration function — causes deserialization panics</li>
              <li>• Changing collection prefixes — makes existing stored data permanently inaccessible</li>
              <li>• Forgetting #[private] on migrate() — lets anyone reset your contract state</li>
              <li>• Not testing against real state snapshots — use near-workspaces with mainnet state</li>
              <li>• Assuming migration is free — large state transforms can exceed gas limits</li>
              <li>• No rollback plan — always keep previous WASM binary and reverse-migration ready</li>
            </ul>
          </div>

          <MiniQuiz />

          <div className="bg-gradient-to-br from-emerald-500/5 to-transparent border border-emerald-500/20 rounded-xl p-5">
            <h4 className="font-semibold text-text-primary mb-3">🎯 Key Takeaways</h4>
            <ul className="space-y-2">
              {[
                'NEAR lets you redeploy code but state persists — plan for schema changes',
                'Use versioned enums + migrate() for safe, compile-time-checked upgrades',
                'Always #[private] on migration functions and test against real state',
                'Keep collection prefixes stable — changing them orphans existing data',
                'DAO-governed upgrades add critical security for production contracts',
                'Always have a rollback plan — old WASM + reverse-migration function',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <motion.button onClick={handleComplete} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className={cn('w-full py-3 rounded-xl font-semibold text-sm transition-all', completed ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20')}>
            {completed ? '✓ Module Complete' : 'Mark as Complete'}
          </motion.button>
        </div>
      )}
    </Card>
  );
}
