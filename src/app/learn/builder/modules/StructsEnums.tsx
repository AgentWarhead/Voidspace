'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import {
  ChevronDown, ChevronUp, BookOpen, Clock, CheckCircle2,
  Lightbulb, Zap, Code, Layers, Database, GitBranch, Boxes,
} from 'lucide-react';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface StructsEnumsProps {
  isActive: boolean;
  onToggle: () => void;
}

// ─── Interactive: Pattern Matching Challenge ───────────────────────────────────

type ContractAction = 'Deposit' | 'Withdraw' | 'Transfer' | 'Stake';

const ACTION_SCENARIOS: { action: ContractAction; amount?: number; to?: string; desc: string; matchResult: string }[] = [
  { action: 'Deposit', amount: 1000, desc: 'User deposits 1000 NEAR', matchResult: 'add_to_balance(1000) → balance increases' },
  { action: 'Withdraw', amount: 500, desc: 'User withdraws 500 NEAR', matchResult: 'subtract_from_balance(500) → balance decreases' },
  { action: 'Transfer', amount: 200, to: 'bob.near', desc: 'Transfer 200 to bob.near', matchResult: 'deduct_sender, credit_receiver(bob.near, 200)' },
  { action: 'Stake', amount: 100, desc: 'Stake 100 NEAR in validator', matchResult: 'lock_tokens(100) → staking rewards accrue' },
];

const ACTION_COLORS: Record<ContractAction, string> = {
  Deposit: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10',
  Withdraw: 'text-orange-400 border-orange-500/40 bg-orange-500/10',
  Transfer: 'text-blue-400 border-blue-500/40 bg-blue-500/10',
  Stake: 'text-purple-400 border-purple-500/40 bg-purple-500/10',
};

function PatternMatchChallenge() {
  const [selected, setSelected] = useState<ContractAction | null>(null);
  const scenario = ACTION_SCENARIOS.find(s => s.action === selected);

  return (
    <div className="space-y-4">
      <p className="text-sm text-text-muted">
        Your NEAR contract receives a <code className="text-near-green bg-black/30 px-1 rounded">ContractAction</code> enum.
        Click an action — the match arm fires!
      </p>
      <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-text-secondary border border-border overflow-x-auto">
        <div className="text-text-muted">{'// ContractAction enum — models every operation your contract handles'}</div>
        <div><span className="text-purple-400">enum</span> <span className="text-cyan-400">ContractAction</span> {'{'}</div>
        <div>{'    Deposit { amount: u128 },'}</div>
        <div>{'    Withdraw { amount: u128 },'}</div>
        <div>{'    Transfer { to: AccountId, amount: u128 },'}</div>
        <div>{'    Stake { amount: u128 },'}</div>
        <div>{'}'}</div>
        <div className="mt-2">
          <span className="text-purple-400">match</span> action {'{'}</div>
        {ACTION_SCENARIOS.map(s => (
          <div
            key={s.action}
            className={cn(
              'transition-colors px-2 rounded',
              selected === s.action ? 'bg-near-green/10 text-near-green' : ''
            )}
          >
            {'    '}<span className="text-cyan-400">ContractAction::{s.action}</span> {'{'} .. {'}'} {'=>'} <span className={selected === s.action ? 'text-near-green' : 'text-yellow-300'}>{'{ /* handle */'}</span>
          </div>
        ))}
        <div>{'}'}</div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {ACTION_SCENARIOS.map(s => (
          <motion.button
            key={s.action}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setSelected(s.action)}
            className={cn(
              'rounded-lg border px-3 py-2 text-sm font-semibold transition-all',
              selected === s.action
                ? ACTION_COLORS[s.action]
                : 'bg-surface border-border text-text-muted hover:border-border-hover'
            )}
          >
            {s.action}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {scenario && (
          <motion.div
            key={scenario.action}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={cn('rounded-lg border p-4 space-y-2', ACTION_COLORS[scenario.action])}
          >
            <p className="text-xs font-semibold uppercase tracking-widest opacity-70">Match fired: {scenario.action}</p>
            <p className="text-sm">{scenario.desc}</p>
            <p className="text-xs opacity-80 font-mono">{scenario.matchResult}</p>
          </motion.div>
        )}
      </AnimatePresence>
      {!selected && (
        <p className="text-center text-xs text-text-muted">👆 Click an action to see pattern matching in action</p>
      )}
    </div>
  );
}

// ─── Concept Card ──────────────────────────────────────────────────────────────

function ConceptCard({ icon: Icon, title, preview, details, iconColor = 'text-violet-400', bgColor = 'from-violet-500/20 to-purple-500/20', borderColor = 'border-violet-500/20' }: {
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
    'Enums can only contain unit variants (no data)',
    'Rust enums can carry data in each variant — like Deposit { amount: u128 } or Transfer { to: AccountId }',
    'You can only match enums with if/else, not match expressions',
    'Structs and enums cannot be serialized for NEAR contract state',
  ];
  return (
    <Card variant="glass" padding="lg">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-near-green" />
        <h4 className="font-bold text-text-primary">Quick Check — Enums with Data</h4>
      </div>
      <p className="text-text-secondary mb-4 text-sm">Which statement about Rust enums is true?</p>
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
              ? '✓ Correct! Rust enums are algebraic data types — each variant can carry different data. This is far more powerful than C-style enums and perfect for modeling contract actions.'
              : '✗ Rust enums are much more powerful than most languages. Each variant can carry its own data fields — `enum Action { Transfer { to: AccountId, amount: u128 } }` is totally valid.'}
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

// ─── Main Module ───────────────────────────────────────────────────────────────

const StructsEnums: React.FC<StructsEnumsProps> = ({ isActive, onToggle }) => {
  const [completed, setCompleted] = useState(false);

  const handleComplete = () => {
    setCompleted(true);
    const progress = JSON.parse(localStorage.getItem('voidspace-builder-progress') || '{}');
    progress['structs-enums'] = true;
    localStorage.setItem('voidspace-builder-progress', JSON.stringify(progress));
  };

  return (
    <Card variant="glass" padding="none" className="border-violet-500/20">
      {/* ── Accordion Header ── */}
      <div
        onClick={onToggle}
        className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Layers className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Structs &amp; Enums</h3>
            <p className="text-text-muted text-sm">Model your contract state and actions with Rust&apos;s powerful type system</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-violet-500/10 text-violet-300 border-violet-500/20">Intermediate</Badge>
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
            <div className="border-t border-violet-500/20 p-6 space-y-8">
              {/* Module Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/20 bg-violet-500/5 text-xs text-violet-400">
                <BookOpen className="w-3 h-3" />
                Rust Curriculum — Phase 1
                <span className="text-text-muted">•</span>
                <Clock className="w-3 h-3" />
                35 min read
              </div>

              {/* The Big Idea */}
              <Card variant="glass" padding="lg" className="border-violet-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-violet-400" />
                  </div>
                  <h2 className="text-xl font-bold text-text-primary">Your Contract IS a Struct</h2>
                </div>
                <p className="text-text-secondary leading-relaxed">
                  In NEAR, your entire contract state lives in a <span className="text-violet-400 font-medium">struct</span>.
                  Every field is stored on-chain. Structs define <em>what</em> your contract knows;
                  <span className="text-violet-400 font-medium"> enums</span> define <em>what actions</em> it can handle.
                  Pattern matching with <code className="text-violet-300 bg-black/30 px-1 rounded">match</code> is how you
                  route those actions safely — the compiler forces you to handle every variant. No missing cases, no surprise panics.
                </p>
              </Card>

              {/* Code: Struct + impl */}
              <div>
                <h3 className="text-lg font-bold text-text-primary mb-3">💻 Structs &amp; impl Blocks</h3>
                <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-text-secondary border border-border overflow-x-auto">
                  <div className="text-text-muted">{'// Your contract state — stored on-chain via Borsh serialization'}</div>
                  <div><span className="text-purple-400">use</span> {'near_sdk::{'}<span className="text-cyan-400">near</span>, <span className="text-cyan-400">AccountId</span>, <span className="text-cyan-400">NearToken</span>{'}'};</div>
                  <div className="mt-2"><span className="text-purple-400">#[near(contract_state)]</span></div>
                  <div><span className="text-purple-400">pub struct</span> <span className="text-cyan-400">TokenContract</span> {'{'}</div>
                  <div>{'    pub owner_id: AccountId,    // who deployed this'}</div>
                  <div>{'    pub total_supply: u128,     // total tokens in existence'}</div>
                  <div>{'    pub name: String,           // token display name'}</div>
                  <div>{'    pub symbol: String,         // e.g. "VOID"'}</div>
                  <div>{'}'}</div>
                  <div className="mt-3 text-text-muted">{'// impl block — this is where contract methods live'}</div>
                  <div><span className="text-purple-400">impl</span> <span className="text-cyan-400">TokenContract</span> {'{'}</div>
                  <div>{'    pub fn get_metadata(&self) -> (String, String, u128) {'}</div>
                  <div>{'        // Return a tuple — no cloning needed for Copy types'}</div>
                  <div>{'        (self.name.clone(), self.symbol.clone(), self.total_supply)'}</div>
                  <div>{'    }'}</div>
                  <div>{'    pub fn is_owner(&self, account: &AccountId) -> bool {'}</div>
                  <div>{'        &self.owner_id == account'}</div>
                  <div>{'    }'}</div>
                  <div>{'}'}</div>
                </div>
              </div>

              {/* Code: Enums + match */}
              <div>
                <h3 className="text-lg font-bold text-text-primary mb-3">💻 Enums with Data + Pattern Matching</h3>
                <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-text-secondary border border-border overflow-x-auto">
                  <div className="text-text-muted">{'// Enums model every possible contract action — exhaustive by design'}</div>
                  <div><span className="text-purple-400">#[derive(Debug)]</span></div>
                  <div><span className="text-purple-400">pub enum</span> <span className="text-cyan-400">VaultAction</span> {'{'}</div>
                  <div>{'    Deposit { amount: u128 },           // struct variant'}</div>
                  <div>{'    Withdraw { amount: u128 },          // each variant can have different fields'}</div>
                  <div>{'    Transfer { to: AccountId, amount: u128 },'}</div>
                  <div>{'    EmergencyPause,                     // unit variant — no data needed'}</div>
                  <div>{'}'}</div>
                  <div className="mt-2"><span className="text-purple-400">pub fn</span> <span className="text-near-green">handle_action</span>{'(&mut self, action: VaultAction) {'}</div>
                  <div>{'    match action {  // compiler forces ALL variants handled'}</div>
                  <div>{'        VaultAction::Deposit { amount } => self.balance += amount,'}</div>
                  <div>{'        VaultAction::Withdraw { amount } => {'}</div>
                  <div>{'            require!(self.balance >= amount, "Insufficient funds");'}</div>
                  <div>{'            self.balance -= amount;'}</div>
                  <div>{'        }'}</div>
                  <div>{'        VaultAction::Transfer { to, amount } => self.send(to, amount),'}</div>
                  <div>{'        VaultAction::EmergencyPause => self.paused = true,'}</div>
                  <div>{'    }'}</div>
                  <div>{'}'}</div>
                </div>
              </div>

              {/* Interactive Challenge */}
              <div>
                <h3 className="text-lg font-bold text-text-primary mb-2">🎮 Pattern Match Explorer</h3>
                <p className="text-sm text-text-muted mb-4">Trigger contract actions and watch the match arms fire.</p>
                <PatternMatchChallenge />
              </div>

              {/* Pro Tip */}
              <div className="bg-gradient-to-r from-violet-500/10 to-purple-500/5 border border-violet-500/20 rounded-xl p-5">
                <h4 className="font-semibold text-violet-400 text-sm mb-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" /> NEAR State Design Tip
                </h4>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Keep your contract struct <span className="text-violet-400 font-medium">lean</span> — every field costs storage.
                  Use NEAR SDK&apos;s collection types (<code className="text-violet-300">LookupMap</code>, <code className="text-violet-300">UnorderedMap</code>)
                  for dynamic data instead of <code className="text-violet-300">HashMap</code> stored inline.
                  Inline collections serialize the entire map on every method call — NEAR collections are lazy and only touch the keys you access.
                </p>
              </div>

              {/* Concept Cards */}
              <div>
                <h3 className="text-lg font-bold text-text-primary mb-4">🧩 Core Concepts</h3>
                <div className="grid grid-cols-1 gap-4">
                  <ConceptCard
                    icon={Database}
                    title="Structs — Your On-Chain State"
                    preview="Named fields grouped into a custom type"
                    details="struct MyContract { field: Type } is how all NEAR contracts define state. The #[near(contract_state)] attribute tells the NEAR SDK to serialize/deserialize this struct to/from on-chain storage automatically. Each field must implement BorshSerialize and BorshDeserialize — standard types do by default, custom types need #[derive(BorshSerialize, BorshDeserialize)]."
                    iconColor="text-emerald-400"
                    bgColor="from-emerald-500/20 to-emerald-500/10"
                    borderColor="border-emerald-500/20"
                  />
                  <ConceptCard
                    icon={Code}
                    title="impl Blocks — Contract Methods"
                    preview="Where you define contract behavior"
                    details="impl ContractName { } groups all methods for a type. The #[near] attribute on an impl block exposes those methods as callable contract endpoints. Methods with &self become view functions; methods with &mut self become change functions. You can have multiple impl blocks for the same type — useful for separating concerns."
                    iconColor="text-blue-400"
                    bgColor="from-blue-500/20 to-blue-500/10"
                    borderColor="border-blue-500/20"
                  />
                  <ConceptCard
                    icon={Boxes}
                    title="Enums — Modeling Actions &amp; States"
                    preview="Sum types — a value is exactly ONE of the variants"
                    details="Unlike C enums (just integers), Rust enums can carry different data per variant — they're algebraic data types (ADTs). Perfect for: contract actions (Deposit/Withdraw/Transfer), status fields (Pending/Active/Completed), and return types (Option<T> and Result<T,E> are both enums!). The compiler verifies match arms are exhaustive — no forgotten cases."
                    iconColor="text-violet-400"
                    bgColor="from-violet-500/20 to-violet-500/10"
                    borderColor="border-violet-500/20"
                  />
                  <ConceptCard
                    icon={GitBranch}
                    title="Pattern Matching with match"
                    preview="Exhaustive branching — compiler catches missing cases"
                    details="match is like switch on steroids. It must cover every possible variant (or have a _ wildcard). You can destructure enum data directly: `ContractAction::Transfer { to, amount } => ...`. Use match with Option<T> instead of null checks, with Result<T,E> instead of exceptions. In NEAR contracts, match prevents the silent bugs that cause fund losses in other smart contract languages."
                    iconColor="text-orange-400"
                    bgColor="from-orange-500/20 to-orange-500/10"
                    borderColor="border-orange-500/20"
                  />
                </div>
              </div>

              {/* Common Mistakes */}
              <Card variant="default" padding="md" className="border-orange-500/20 bg-orange-500/5">
                <h4 className="font-semibold text-orange-400 mb-2">⚠️ Common Mistakes</h4>
                <ul className="space-y-1 text-sm text-text-secondary">
                  <li>• Storing HashMap/Vec directly in contract struct — use LookupMap/Vector from near-sdk instead</li>
                  <li>• Forgetting to derive BorshSerialize/BorshDeserialize on custom types used in contract state</li>
                  <li>• Using _ wildcard in match too eagerly — be explicit, the compiler will tell you when a new variant is added</li>
                  <li>• Giant structs with dozens of fields — split into sub-structs for readability and gas efficiency</li>
                </ul>
              </Card>

              {/* Quiz */}
              <MiniQuiz />

              {/* Key Takeaways */}
              <Card variant="glass" padding="lg" className="border-violet-500/20">
                <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-violet-400" />
                  Key Takeaways
                </h3>
                <ul className="space-y-2">
                  {[
                    'Your NEAR contract IS a struct — every field is stored on-chain. Keep it lean; use SDK collections for dynamic data.',
                    'impl blocks with #[near] expose your methods. &self = view (free), &mut self = change (costs gas).',
                    'Enums carry data per variant — model contract actions, statuses, and return types expressively.',
                    'match forces exhaustive pattern handling — the compiler ensures you never miss an enum variant.',
                  ].map((point, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                      <span className="text-violet-400 mt-0.5 font-bold">→</span>
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
                    : 'bg-violet-500/10 text-violet-300 border border-violet-500/30 hover:bg-violet-500/20'
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

export default StructsEnums;
