'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import {
  ChevronDown, ChevronUp, BookOpen, Clock, CheckCircle2,
  Lightbulb, Zap, Code, ArrowRight, Package, Eye, Edit3, Trash2,
} from 'lucide-react';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface OwnershipBorrowingProps {
  isActive: boolean;
  onToggle: () => void;
}

// ─── Interactive: Ownership Flow Visualizer ────────────────────────────────────

type OwnershipMode = 'move' | 'borrow' | 'mut-borrow' | 'clone';

const MODES: { id: OwnershipMode; label: string; icon: React.ElementType; color: string; border: string; code: string; explanation: string }[] = [
  {
    id: 'move',
    label: 'Move',
    icon: ArrowRight,
    color: 'from-orange-500/20 to-orange-500/10',
    border: 'border-orange-500/40',
    code: 'let a = String::from("NEAR");\nlet b = a; // a is MOVED into b\n// println!("{}", a); ← COMPILER ERROR\nprintln!("{}", b); // ✓ b owns it now',
    explanation: 'Ownership transfers from `a` to `b`. The original variable is invalidated — Rust prevents use-after-move at compile time. No double-frees, ever.',
  },
  {
    id: 'borrow',
    label: 'Borrow (&)',
    icon: Eye,
    color: 'from-blue-500/20 to-blue-500/10',
    border: 'border-blue-500/40',
    code: 'let token_id = String::from("nft-001");\nlet ref1 = &token_id; // borrow\nlet ref2 = &token_id; // another borrow ✓\nprintln!("{} {}", ref1, ref2); // both valid',
    explanation: 'Multiple immutable borrows can coexist. No one owns it exclusively — perfect for NEAR view methods that just read contract state.',
  },
  {
    id: 'mut-borrow',
    label: 'Mut Borrow (&mut)',
    icon: Edit3,
    color: 'from-purple-500/20 to-purple-500/10',
    border: 'border-purple-500/40',
    code: 'let mut balance = 1000u128;\n{\n  let edit = &mut balance; // exclusive!\n  *edit += 500;\n} // edit released here\nprintln!("{}", balance); // 1500',
    explanation: 'Only ONE mutable borrow at a time. No simultaneous readers while writing. This rule alone prevents most concurrency bugs and reentrancy attacks.',
  },
  {
    id: 'clone',
    label: 'Clone',
    icon: Package,
    color: 'from-emerald-500/20 to-emerald-500/10',
    border: 'border-emerald-500/40',
    code: 'let owner = String::from("alice.near");\nlet backup = owner.clone(); // deep copy\nprintln!("{}", owner); // still valid\nprintln!("{}", backup); // independent',
    explanation: 'Clone creates an independent deep copy. Both variables are fully owned. Use sparingly in contracts — cloning large collections wastes gas.',
  },
];

function OwnershipVisualizer() {
  const [activeMode, setActiveMode] = useState<OwnershipMode>('move');
  const current = MODES.find(m => m.id === activeMode)!;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {MODES.map(mode => {
          const Icon = mode.icon;
          return (
            <motion.button
              key={mode.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveMode(mode.id)}
              className={cn(
                'rounded-lg border p-3 text-left transition-all',
                activeMode === mode.id
                  ? `bg-gradient-to-b ${current.color} ${mode.border}`
                  : 'bg-black/20 border-border hover:border-border-hover'
              )}
            >
              <Icon className={cn('w-4 h-4 mb-1', activeMode === mode.id ? 'text-text-primary' : 'text-text-muted')} />
              <div className="text-xs font-bold text-text-primary">{mode.label}</div>
            </motion.button>
          );
        })}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeMode}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="space-y-3"
        >
          <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-text-secondary border border-border whitespace-pre-wrap">
            {current.code}
          </div>
          <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-3 text-xs text-text-secondary leading-relaxed">
            💡 {current.explanation}
          </div>
        </motion.div>
      </AnimatePresence>
      <p className="text-center text-xs text-text-muted">👆 Select a mode to explore ownership mechanics</p>
    </div>
  );
}

// ─── Concept Card ──────────────────────────────────────────────────────────────

function ConceptCard({ icon: Icon, title, preview, details, iconColor = 'text-cyan-400', bgColor = 'from-cyan-500/20 to-blue-500/20', borderColor = 'border-cyan-500/20' }: {
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

// ─── Borrow Rules Quiz ─────────────────────────────────────────────────────────

function BorrowQuiz() {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const correct = 2;
  const options = [
    'You can have any number of mutable borrows at the same time',
    'You can mix immutable and mutable borrows of the same value simultaneously',
    'You can have EITHER many immutable borrows OR one mutable borrow — never both',
    'Mutable borrows prevent reads but immutable borrows never conflict',
  ];
  return (
    <Card variant="glass" padding="lg">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-near-green" />
        <h4 className="font-bold text-text-primary">Quick Check — The Borrow Rules</h4>
      </div>
      <p className="text-text-secondary mb-4 text-sm">Which statement correctly describes Rust&apos;s borrowing rules?</p>
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
              ? '✓ Exactly right! Many readers OR one writer — the borrow checker enforces this at compile time. It\'s why Rust has no data races.'
              : '✗ The golden rule: many immutable borrows (&) OR exactly one mutable borrow (&mut) — never both at once. The compiler enforces this with zero runtime overhead.'}
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

// ─── Main Module ───────────────────────────────────────────────────────────────

const OwnershipBorrowing: React.FC<OwnershipBorrowingProps> = ({ isActive, onToggle }) => {
  const [completed, setCompleted] = useState(false);

  const handleComplete = () => {
    setCompleted(true);
    const progress = JSON.parse(localStorage.getItem('voidspace-builder-progress') || '{}');
    progress['ownership-borrowing'] = true;
    localStorage.setItem('voidspace-builder-progress', JSON.stringify(progress));
  };

  return (
    <Card variant="glass" padding="none" className="border-cyan-500/20">
      {/* ── Accordion Header ── */}
      <div
        onClick={onToggle}
        className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
            <Package className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Ownership &amp; Borrowing</h3>
            <p className="text-text-muted text-sm">Rust&apos;s superpower — memory safety without a garbage collector</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-cyan-500/10 text-cyan-300 border-cyan-500/20">Intermediate</Badge>
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
            <div className="border-t border-cyan-500/20 p-6 space-y-8">
              {/* Module Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-xs text-cyan-400">
                <BookOpen className="w-3 h-3" />
                Module 3 of 27
                <span className="text-text-muted">•</span>
                <Clock className="w-3 h-3" />
                40 min read
              </div>

              {/* The Big Idea */}
              <Card variant="glass" padding="lg" className="border-cyan-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-cyan-400" />
                  </div>
                  <h2 className="text-xl font-bold text-text-primary">Why Ownership Matters for Contracts</h2>
                </div>
                <p className="text-text-secondary leading-relaxed">
                  Most languages let you create memory bugs at runtime — dangling pointers, double-frees, data races.
                  Rust eliminates all of these <span className="text-cyan-400 font-medium">at compile time</span> through ownership rules.
                  For NEAR smart contracts, this is huge: a contract bug can mean lost funds with no undo button.
                  Rust&apos;s ownership system is your <span className="text-cyan-400 font-medium">first line of defense</span> against contract exploits.
                </p>
              </Card>

              {/* Interactive Visualizer */}
              <div>
                <h3 className="text-lg font-bold text-text-primary mb-2">🔧 Ownership Mode Explorer</h3>
                <p className="text-sm text-text-muted mb-4">Explore the four ways to handle values in Rust — and when to use each in NEAR contracts.</p>
                <OwnershipVisualizer />
              </div>

              {/* NEAR Context Code */}
              <div>
                <h3 className="text-lg font-bold text-text-primary mb-3">💻 Ownership in a NEAR Contract</h3>
                <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-text-secondary border border-border overflow-x-auto">
                  <div className="text-text-muted">{'// Ownership shows up in every NEAR contract method signature'}</div>
                  <div><span className="text-purple-400">use</span> {'near_sdk::{'}<span className="text-cyan-400">near</span>, <span className="text-cyan-400">AccountId</span>{'}'};</div>
                  <div className="mt-2"><span className="text-purple-400">#[near(contract_state)]</span></div>
                  <div><span className="text-purple-400">pub struct</span> <span className="text-cyan-400">Vault</span> {'{'}</div>
                  <div>{'    owner: AccountId,'}</div>
                  <div>{'    locked_amount: u128,'}</div>
                  <div>{'}'}</div>
                  <div className="mt-2"><span className="text-purple-400">#[near]</span></div>
                  <div><span className="text-purple-400">impl</span> <span className="text-cyan-400">Vault</span> {'{'}</div>
                  <div>{'    // &self = immutable borrow → view method (FREE, no gas)'}</div>
                  <div>{'    '}<span className="text-purple-400">pub fn</span> <span className="text-near-green">get_owner</span>{'(&self) -> &AccountId {'}</div>
                  <div>{'        &self.owner // return a reference, not a copy'}</div>
                  <div>{'    }'}</div>
                  <div className="mt-1">{'    // &mut self = mutable borrow → change method (costs gas)'}</div>
                  <div>{'    '}<span className="text-purple-400">pub fn</span> <span className="text-near-green">deposit</span>{'(&mut self, amount: u128) {'}</div>
                  <div>{'        // self.locked_amount is mutably borrowed via &mut self'}</div>
                  <div>{'        self.locked_amount += amount;'}</div>
                  <div>{'    }'}</div>
                  <div className="mt-1">{'    // Takes owned AccountId — caller gives up their copy'}</div>
                  <div>{'    '}<span className="text-purple-400">pub fn</span> <span className="text-near-green">transfer_ownership</span>{'(&mut self, new_owner: AccountId) {'}</div>
                  <div>{'        self.owner = new_owner; // moved into struct'}</div>
                  <div>{'    }'}</div>
                  <div>{'}'}</div>
                </div>
              </div>

              {/* Pro Tip */}
              <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/5 border border-cyan-500/20 rounded-xl p-5">
                <h4 className="font-semibold text-cyan-400 text-sm mb-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" /> The NEAR Rule of Thumb
                </h4>
                <p className="text-xs text-text-secondary leading-relaxed">
                  In NEAR contracts: use <span className="text-cyan-400 font-medium">&amp;self</span> for view methods (reading state — they&apos;re free to call),
                  <span className="text-cyan-400 font-medium"> &amp;mut self</span> for change methods (writing state — costs gas),
                  and only take <span className="text-cyan-400 font-medium">owned values</span> (like <code className="text-cyan-300">AccountId</code>, <code className="text-cyan-300">String</code>)
                  when you need to store them permanently. References avoid unnecessary cloning, which means less gas consumption.
                </p>
              </div>

              {/* Concept Cards */}
              <div>
                <h3 className="text-lg font-bold text-text-primary mb-4">🧩 Core Concepts</h3>
                <div className="grid grid-cols-1 gap-4">
                  <ConceptCard
                    icon={Package}
                    title="Move Semantics"
                    preview="Values have one owner — assigning moves ownership"
                    details="When you do `let b = a`, ownership moves from a to b. The compiler prevents you from using a afterwards — no copies made, no runtime overhead. This is why Rust has no garbage collector: the compiler knows exactly when to free memory (when the owner exits scope). In contracts, moving is how you transfer data into storage."
                    iconColor="text-orange-400"
                    bgColor="from-orange-500/20 to-orange-500/10"
                    borderColor="border-orange-500/20"
                  />
                  <ConceptCard
                    icon={Eye}
                    title="Immutable References (&)"
                    preview="Read-only access — many can coexist"
                    details="You can create any number of &T references simultaneously. None can modify the value. This maps perfectly to NEAR view methods: `&self` is an immutable borrow of the entire contract state. View calls are free on NEAR precisely because they don't modify state — borrowing semantics reinforce this distinction."
                    iconColor="text-blue-400"
                    bgColor="from-blue-500/20 to-blue-500/10"
                    borderColor="border-blue-500/20"
                  />
                  <ConceptCard
                    icon={Edit3}
                    title="Mutable References (&mut)"
                    preview="Exclusive write access — only one at a time"
                    details="&mut T grants exclusive write access. No other borrows (mutable or immutable) can exist simultaneously. This rule eliminates data races at compile time — a critical property for financial contracts where concurrent state modification would be catastrophic. In NEAR, `&mut self` in change methods enforces this contract-wide."
                    iconColor="text-purple-400"
                    bgColor="from-purple-500/20 to-purple-500/10"
                    borderColor="border-purple-500/20"
                  />
                  <ConceptCard
                    icon={Trash2}
                    title="Drop &amp; Lifetimes"
                    preview="Values are automatically freed when their owner exits scope"
                    details="When an owner goes out of scope, Rust calls drop() automatically — like a destructor. No manual free(), no GC pause. Lifetimes (the 'a syntax) are the compiler's way of tracking how long references are valid. Most of the time you don't write lifetimes explicitly — the compiler infers them. You'll encounter them in NEAR SDK when returning references from contract methods."
                    iconColor="text-red-400"
                    bgColor="from-red-500/20 to-red-500/10"
                    borderColor="border-red-500/20"
                  />
                </div>
              </div>

              {/* Common Mistakes */}
              <Card variant="default" padding="md" className="border-orange-500/20 bg-orange-500/5">
                <h4 className="font-semibold text-orange-400 mb-2">⚠️ Borrow Checker Battles</h4>
                <ul className="space-y-1 text-sm text-text-secondary">
                  <li>• &quot;value used after move&quot; → you moved it into a function; pass &amp;value instead, or .clone() if you need both</li>
                  <li>• &quot;cannot borrow as mutable because it is also borrowed as immutable&quot; → drop the read borrow before taking &amp;mut</li>
                  <li>• &quot;does not live long enough&quot; → you&apos;re returning a reference to something that will be dropped; return owned value instead</li>
                  <li>• Resist the urge to .clone() everything — it costs gas in contracts. Fix the borrow instead.</li>
                </ul>
              </Card>

              {/* Quiz */}
              <BorrowQuiz />

              {/* Key Takeaways */}
              <Card variant="glass" padding="lg" className="border-cyan-500/20">
                <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                  Key Takeaways
                </h3>
                <ul className="space-y-2">
                  {[
                    'Every value has exactly one owner. Ownership transfers on assignment — the original is gone.',
                    'Many immutable borrows (&) OR one mutable borrow (&mut) — the borrow checker enforces this at compile time.',
                    'In NEAR contracts: &self = view (free), &mut self = change (costs gas). This maps directly to ownership.',
                    'Rust\'s ownership system means smart contracts are memory-safe by construction — the compiler catches exploits before they happen.',
                  ].map((point, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                      <span className="text-cyan-400 mt-0.5 font-bold">→</span>
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
                    : 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/20'
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

export default OwnershipBorrowing;
