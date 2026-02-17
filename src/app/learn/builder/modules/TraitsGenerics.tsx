'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import {
  ChevronDown, ChevronUp, BookOpen, Clock, CheckCircle2,
  Lightbulb, Zap, Puzzle, Layers, Star, Cpu, Code,
} from 'lucide-react';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface TraitsGenericsProps {
  isActive: boolean;
  onToggle: () => void;
}

// ─── Interactive: Trait Implementation Explorer ────────────────────────────────

type TraitExample = 'display' | 'borsh' | 'nep141' | 'default';

const TRAIT_EXAMPLES: { id: TraitExample; label: string; emoji: string; color: string; border: string; desc: string; code: string[] }[] = [
  {
    id: 'display',
    label: 'Display Trait',
    emoji: '🖨️',
    color: 'text-blue-400',
    border: 'border-blue-500/30',
    desc: 'Implement Display to control how your type prints — useful for debugging contract state.',
    code: [
      'use std::fmt;',
      '',
      'struct TokenBalance { account: String, amount: u128 }',
      '',
      'impl fmt::Display for TokenBalance {',
      '    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {',
      '        write!(f, "{}: {} yoctoNEAR",',
      '               self.account, self.amount)',
      '    }',
      '}',
      '',
      '// Usage: println!("{}", balance);',
      '// Output: alice.near: 1000000000000000000000000 yoctoNEAR',
    ],
  },
  {
    id: 'borsh',
    label: 'BorshSerialize',
    emoji: '📦',
    color: 'text-emerald-400',
    border: 'border-emerald-500/30',
    desc: 'Auto-derive Borsh serialization — required for all types stored in NEAR contract state.',
    code: [
      'use near_sdk::borsh::{BorshSerialize, BorshDeserialize};',
      '',
      '// #[derive] generates the impl automatically',
      '#[derive(BorshSerialize, BorshDeserialize)]',
      'pub struct UserProfile {',
      '    pub reputation: u32,',
      '    pub joined_block: u64,',
      '    pub verified: bool,',
      '}',
      '',
      '// Now UserProfile can be stored in:',
      '// LookupMap<AccountId, UserProfile>',
      '// Vector<UserProfile>',
      '// Or directly as a contract state field',
    ],
  },
  {
    id: 'nep141',
    label: 'NEP-141 Interface',
    emoji: '🪙',
    color: 'text-yellow-400',
    border: 'border-yellow-500/30',
    desc: 'Implement a NEP trait interface to make your contract compatible with NEAR wallet standards.',
    code: [
      '// NEP-141 = Fungible Token standard',
      '// Wallets and exchanges expect these methods',
      'pub trait FungibleTokenCore {',
      '    fn ft_transfer(',
      '        &mut self,',
      '        receiver_id: AccountId,',
      '        amount: U128,',
      '        memo: Option<String>,',
      '    );',
      '    fn ft_balance_of(&self, account_id: AccountId) -> U128;',
      '    fn ft_total_supply(&self) -> U128;',
      '}',
      '',
      'impl FungibleTokenCore for MyToken { /* ... */ }',
    ],
  },
  {
    id: 'default',
    label: 'Default Trait',
    emoji: '🏁',
    color: 'text-purple-400',
    border: 'border-purple-500/30',
    desc: 'Default initializes your contract when first deployed — NEAR SDK requires it for contract state.',
    code: [
      '#[near(contract_state)]',
      'pub struct MyContract {',
      '    owner: AccountId,',
      '    total_staked: u128,',
      '}',
      '',
      'impl Default for MyContract {',
      '    fn default() -> Self {',
      '        Self {',
      '            // env::predecessor_account_id() = deployer',
      '            owner: env::predecessor_account_id(),',
      '            total_staked: 0,',
      '        }',
      '    }',
      '}',
    ],
  },
];

function TraitExplorer() {
  const [active, setActive] = useState<TraitExample>('borsh');
  const current = TRAIT_EXAMPLES.find(t => t.id === active)!;

  return (
    <div className="space-y-4">
      <p className="text-sm text-text-muted">Explore trait implementations you&apos;ll use in every NEAR contract.</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {TRAIT_EXAMPLES.map(t => (
          <motion.button
            key={t.id}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActive(t.id)}
            className={cn(
              'rounded-lg border py-2 px-3 text-xs font-semibold transition-all text-left',
              active === t.id
                ? `${t.color} ${t.border} bg-black/30`
                : 'bg-surface border-border text-text-muted hover:border-border-hover'
            )}
          >
            <span className="text-base block mb-0.5">{t.emoji}</span>
            {t.label}
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="space-y-3"
        >
          <div className={cn('rounded-lg border p-3 text-xs bg-black/20', current.border)}>
            <p className={cn('font-semibold mb-1', current.color)}>{current.emoji} {current.label}</p>
            <p className="text-text-muted">{current.desc}</p>
          </div>
          <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-text-secondary border border-border overflow-x-auto">
            {current.code.map((line, i) => (
              <div key={i}>{line || '\u00A0'}</div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─── Concept Card ──────────────────────────────────────────────────────────────

function ConceptCard({ icon: Icon, title, preview, details, iconColor = 'text-amber-400', bgColor = 'from-amber-500/20 to-yellow-500/20', borderColor = 'border-amber-500/20' }: {
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
  const correct = 3;
  const options = [
    '#[derive(BorshSerialize)] is optional for contract state fields',
    'Generics in Rust always cause runtime overhead via boxing',
    'Trait objects (dyn Trait) are the only way to use traits in Rust',
    '#[derive] macros auto-generate trait implementations at compile time — BorshSerialize enables a type to be stored in NEAR state',
  ];
  return (
    <Card variant="glass" padding="lg">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-near-green" />
        <h4 className="font-bold text-text-primary">Quick Check — Derive Macros</h4>
      </div>
      <p className="text-text-secondary mb-4 text-sm">Which statement about <code className="text-amber-400">#[derive]</code> macros is correct?</p>
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
              ? '✓ Correct! #[derive] is a proc-macro that generates trait implementations at compile time. BorshSerialize is required for any type you want to store in NEAR contract state.'
              : '✗ #[derive(BorshSerialize, BorshDeserialize)] is REQUIRED for any custom types stored in NEAR contract state. Without it, the NEAR SDK can\'t read/write your type to chain storage.'}
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

// ─── Main Module ───────────────────────────────────────────────────────────────

const TraitsGenerics: React.FC<TraitsGenericsProps> = ({ isActive, onToggle }) => {
  const [completed, setCompleted] = useState(false);

  const handleComplete = () => {
    setCompleted(true);
    const progress = JSON.parse(localStorage.getItem('voidspace-builder-progress') || '{}');
    progress['traits-generics'] = true;
    localStorage.setItem('voidspace-builder-progress', JSON.stringify(progress));
  };

  return (
    <Card variant="glass" padding="none" className="border-amber-500/20">
      {/* ── Accordion Header ── */}
      <div
        onClick={onToggle}
        className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center">
            <Puzzle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Traits &amp; Generics</h3>
            <p className="text-text-muted text-sm">Shared behavior, derive macros, and NEAR&apos;s serialization story</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-amber-500/10 text-amber-300 border-amber-500/20">Intermediate</Badge>
          <Badge className="bg-purple-500/10 text-purple-300 border-purple-500/20">40 min</Badge>
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
            <div className="border-t border-amber-500/20 p-6 space-y-8">
              {/* Module Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/20 bg-amber-500/5 text-xs text-amber-400">
                <BookOpen className="w-3 h-3" />
                Rust Curriculum — Phase 1
                <span className="text-text-muted">•</span>
                <Clock className="w-3 h-3" />
                40 min read
              </div>

              {/* The Big Idea */}
              <Card variant="glass" padding="lg" className="border-amber-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/20 to-yellow-500/20 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-amber-400" />
                  </div>
                  <h2 className="text-xl font-bold text-text-primary">The NEAR SDK is Built on Traits</h2>
                </div>
                <p className="text-text-secondary leading-relaxed">
                  Every NEAR contract relies on traits: <span className="text-amber-400 font-medium">BorshSerialize</span> to write state to chain,
                  <span className="text-amber-400 font-medium"> BorshDeserialize</span> to read it back,
                  <span className="text-amber-400 font-medium"> Default</span> for initialization.
                  NEP standards (NEP-141 fungible tokens, NEP-171 NFTs) are trait <em>interfaces</em> — implementing them
                  makes your contract compatible with every wallet and exchange in the NEAR ecosystem.
                  Generics let you write one function that works across many types without runtime overhead.
                </p>
              </Card>

              {/* Code: Trait Definition */}
              <div>
                <h3 className="text-lg font-bold text-text-primary mb-3">💻 Defining &amp; Implementing Traits</h3>
                <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-text-secondary border border-border overflow-x-auto">
                  <div className="text-text-muted">{'// Define a trait — like an interface in other languages'}</div>
                  <div><span className="text-purple-400">pub trait</span> <span className="text-cyan-400">Stakeable</span> {'{'}</div>
                  <div>{'    fn stake(&mut self, amount: u128);'}</div>
                  <div>{'    fn unstake(&mut self, amount: u128);'}</div>
                  <div>{'    // Default method — implementors can override or inherit'}</div>
                  <div>{'    fn staked_balance(&self) -> u128 { 0 }'}</div>
                  <div>{'}'}</div>
                  <div className="mt-3 text-text-muted">{'// Implement the trait for your contract type'}</div>
                  <div><span className="text-purple-400">impl</span> <span className="text-cyan-400">Stakeable</span> <span className="text-purple-400">for</span> <span className="text-cyan-400">MyContract</span> {'{'}</div>
                  <div>{'    fn stake(&mut self, amount: u128) {'}</div>
                  <div>{'        require!(amount > 0, "Stake amount must be positive");'}</div>
                  <div>{'        self.total_staked += amount;'}</div>
                  <div>{'    }'}</div>
                  <div>{'    fn unstake(&mut self, amount: u128) {'}</div>
                  <div>{'        require!(self.total_staked >= amount, "Insufficient stake");'}</div>
                  <div>{'        self.total_staked -= amount;'}</div>
                  <div>{'    }'}</div>
                  <div>{'    fn staked_balance(&self) -> u128 { self.total_staked }'}</div>
                  <div>{'}'}</div>
                </div>
              </div>

              {/* Code: Generics */}
              <div>
                <h3 className="text-lg font-bold text-text-primary mb-3">💻 Generics &amp; Trait Bounds</h3>
                <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-text-secondary border border-border overflow-x-auto">
                  <div className="text-text-muted">{'// Generic function — T must implement Display + PartialOrd'}</div>
                  <div><span className="text-purple-400">fn</span> <span className="text-near-green">max_value</span>{'<T: std::fmt::Display + PartialOrd>(a: T, b: T) -> T {'}</div>
                  <div>{'    if a > b { a } else { b }'}</div>
                  <div>{'}'}</div>
                  <div className="mt-2">{'// Works for u128, u64, String — any type satisfying bounds'}</div>
                  <div>{'let higher_bid = max_value(bid_a, bid_b); // u128 at runtime'}</div>
                  <div className="mt-3 text-text-muted">{'// NEAR SDK generic collections — T must be Borsh-serializable'}</div>
                  <div><span className="text-purple-400">use</span> {'near_sdk::store::LookupMap;'}</div>
                  <div><span className="text-purple-400">pub struct</span> <span className="text-cyan-400">Registry</span> {'{'}</div>
                  <div>{'    // LookupMap<K, V> — K and V must implement BorshSerialize'}</div>
                  <div>{'    members: LookupMap<AccountId, UserProfile>,'}</div>
                  <div>{'    scores: LookupMap<AccountId, u64>,'}</div>
                  <div>{'}'}</div>
                </div>
              </div>

              {/* Interactive Explorer */}
              <div>
                <h3 className="text-lg font-bold text-text-primary mb-2">🔧 Trait Implementation Explorer</h3>
                <TraitExplorer />
              </div>

              {/* Pro Tip */}
              <div className="bg-gradient-to-r from-amber-500/10 to-yellow-500/5 border border-amber-500/20 rounded-xl p-5">
                <h4 className="font-semibold text-amber-400 text-sm mb-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" /> Derive vs Manual Implementation
                </h4>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Use <span className="text-amber-400 font-medium">#[derive(...)]</span> whenever possible — it generates
                  correct, optimized code automatically. For most NEAR contract types, you&apos;ll derive:
                  <code className="text-amber-300 ml-1">BorshSerialize</code>, <code className="text-amber-300">BorshDeserialize</code>,
                  <code className="text-amber-300"> Clone</code>, <code className="text-amber-300">Debug</code>, and sometimes
                  <code className="text-amber-300"> PartialEq</code>.
                  Only write <code className="text-amber-300">impl Trait for Type</code> manually when you need custom logic
                  (like a special <code className="text-amber-300">Display</code> format or a NEP interface).
                </p>
              </div>

              {/* Concept Cards */}
              <div>
                <h3 className="text-lg font-bold text-text-primary mb-4">🧩 Core Concepts</h3>
                <div className="grid grid-cols-1 gap-4">
                  <ConceptCard
                    icon={Puzzle}
                    title="Traits — Shared Behavior Contracts"
                    preview="Define a set of methods any type can implement"
                    details="A trait declares method signatures — types opt-in by implementing them. Unlike OOP inheritance, traits are composable: a type can implement dozens of traits. The compiler verifies correctness at compile time. Rust's standard library traits (Debug, Clone, PartialEq) unlock powerful functionality — derive them for free where possible."
                    iconColor="text-amber-400"
                    bgColor="from-amber-500/20 to-amber-500/10"
                    borderColor="border-amber-500/20"
                  />
                  <ConceptCard
                    icon={Cpu}
                    title="Generics — Zero-Cost Abstraction"
                    preview="Write once, work for any type that meets the bounds"
                    details="Generics let you write fn process<T: SomeTrait>(value: T) — one function for any T implementing SomeTrait. The compiler monomorphizes (specializes) it per concrete type at compile time — no runtime overhead, no boxing. Rust's generic collections (Vec<T>, HashMap<K,V>) and NEAR SDK collections (LookupMap<K,V>) all use generics for type safety."
                    iconColor="text-blue-400"
                    bgColor="from-blue-500/20 to-blue-500/10"
                    borderColor="border-blue-500/20"
                  />
                  <ConceptCard
                    icon={Layers}
                    title="BorshSerialize / BorshDeserialize"
                    preview="The serialization format NEAR uses for on-chain state"
                    details="Borsh (Binary Object Representation Serializer for Hashing) is NEAR's canonical serialization format. It's compact, deterministic, and fast. Any type stored in contract state MUST implement both BorshSerialize and BorshDeserialize. For standard types (u64, String, Vec<T>, etc.) these are already implemented. Custom structs and enums need #[derive(BorshSerialize, BorshDeserialize)]."
                    iconColor="text-emerald-400"
                    bgColor="from-emerald-500/20 to-emerald-500/10"
                    borderColor="border-emerald-500/20"
                  />
                  <ConceptCard
                    icon={Star}
                    title="NEP Trait Interfaces"
                    preview="NEAR Enhancement Proposals define contract standards as traits"
                    details="NEP-141 (Fungible Token), NEP-171 (NFT), NEP-145 (Storage Management) — each defines a trait interface your contract implements. This is how NEAR achieves ecosystem composability: wallets, DEXes, and other contracts can call your contract using the standard interface without knowing your implementation. Implement the NEP traits, pass the compliance tests, and your contract works everywhere."
                    iconColor="text-purple-400"
                    bgColor="from-purple-500/20 to-purple-500/10"
                    borderColor="border-purple-500/20"
                  />
                  <ConceptCard
                    icon={Code}
                    title="#[near] Attribute Macro"
                    preview="The magic that turns Rust structs/impls into contract endpoints"
                    details="#[near(contract_state)] on a struct tells the NEAR SDK: this is your contract state, serialize/deserialize it automatically. #[near] on an impl block exposes all pub methods as callable contract endpoints. The macro generates JSON serialization for function parameters/returns and registers methods with the NEAR runtime. It's why NEAR contracts look so clean compared to raw WebAssembly."
                    iconColor="text-cyan-400"
                    bgColor="from-cyan-500/20 to-cyan-500/10"
                    borderColor="border-cyan-500/20"
                  />
                </div>
              </div>

              {/* Common Mistakes */}
              <Card variant="default" padding="md" className="border-orange-500/20 bg-orange-500/5">
                <h4 className="font-semibold text-orange-400 mb-2">⚠️ Common Mistakes</h4>
                <ul className="space-y-1 text-sm text-text-secondary">
                  <li>• Forgetting BorshSerialize/Deserialize on custom types in contract state — causes compile errors</li>
                  <li>• Using dyn Trait (trait objects) when generics work — generics have zero overhead, dyn has vtable overhead</li>
                  <li>• Implementing NEP traits manually instead of using near-sdk&apos;s built-in helpers — use FungibleToken, NonFungibleToken structs</li>
                  <li>• Deriving Clone on types with NEAR collections — clone of a LookupMap clones the entire collection (very expensive!)</li>
                </ul>
              </Card>

              {/* Quiz */}
              <MiniQuiz />

              {/* Key Takeaways */}
              <Card variant="glass" padding="lg" className="border-amber-500/20">
                <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-amber-400" />
                  Key Takeaways
                </h3>
                <ul className="space-y-2">
                  {[
                    'Traits define shared behavior. impl Trait for Type wires them together. #[derive] generates common traits automatically.',
                    'BorshSerialize + BorshDeserialize are required for any custom type in NEAR contract state — always derive them.',
                    'Generics enable zero-cost abstractions — LookupMap<AccountId, Profile> is type-safe with no runtime overhead.',
                    'NEP trait interfaces (NEP-141, NEP-171) make your contract compatible with the entire NEAR ecosystem automatically.',
                  ].map((point, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                      <span className="text-amber-400 mt-0.5 font-bold">→</span>
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
                    : 'bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20'
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

export default TraitsGenerics;
