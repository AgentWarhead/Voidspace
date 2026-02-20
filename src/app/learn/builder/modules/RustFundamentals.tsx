'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import {
  ChevronDown, ChevronUp, BookOpen, Clock, CheckCircle2,
  Lightbulb, Zap, Code, ArrowRight, Lock, Unlock, Eye, Rocket, Shield,
} from 'lucide-react';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface RustFundamentalsProps {
  isActive: boolean;
  onToggle?: () => void;
}

// ─── Interactive Visual: Ownership Flow Diagram ────────────────────────────────

const ownershipSteps = [
  { id: 'create', label: 'Create', desc: 'let name = String::from("alice")', icon: '📦', color: 'from-emerald-500/20 to-emerald-500/10', border: 'border-emerald-500/30' },
  { id: 'move', label: 'Move', desc: 'let owner = name; // name is gone!', icon: '➡️', color: 'from-orange-500/20 to-orange-500/10', border: 'border-orange-500/30' },
  { id: 'borrow', label: 'Borrow', desc: 'let view = &name; // read-only ref', icon: '👁️', color: 'from-blue-500/20 to-blue-500/10', border: 'border-blue-500/30' },
  { id: 'mut-borrow', label: 'Mut Borrow', desc: 'let edit = &mut name; // exclusive', icon: '✏️', color: 'from-purple-500/20 to-purple-500/10', border: 'border-purple-500/30' },
  { id: 'drop', label: 'Drop', desc: 'Scope ends → memory freed', icon: '🗑️', color: 'from-red-500/20 to-red-500/10', border: 'border-red-500/30' },
];

function OwnershipFlowDiagram() {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  return (
    <div className="relative py-4">
      <div className="flex items-center justify-between gap-1">
        {ownershipSteps.map((step, i) => (
          <React.Fragment key={step.id}>
            <motion.div
              className={cn(
                'flex-1 cursor-pointer rounded-lg border p-3 transition-all text-center',
                step.border,
                activeStep === i ? `bg-gradient-to-b ${step.color}` : 'bg-black/20'
              )}
              whileHover={{ scale: 1.05, y: -4 }}
              onClick={() => setActiveStep(activeStep === i ? null : i)}
            >
              <div className="text-xl mb-1">{step.icon}</div>
              <div className="text-xs font-bold text-text-primary">{step.label}</div>
            </motion.div>
            {i < ownershipSteps.length - 1 && (
              <ArrowRight className="w-4 h-4 text-text-muted/40 flex-shrink-0" />
            )}
          </React.Fragment>
        ))}
      </div>
      <AnimatePresence>
        {activeStep !== null && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-4 bg-black/30 rounded-lg p-3 border border-border">
              <code className="text-sm text-near-green font-mono">{ownershipSteps[activeStep].desc}</code>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <p className="text-center text-xs text-text-muted mt-4">
        👆 Click each stage to see Rust&apos;s ownership in action
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
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/20 flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-orange-400" />
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
    'Values can have multiple owners at the same time',
    'Each value has exactly one owner, and the value is dropped when the owner goes out of scope',
    'Ownership is optional — you can disable it with unsafe blocks',
    'Borrowed references can outlive the original owner',
  ];
  return (
    <Card variant="glass" padding="lg">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-near-green" />
        <h4 className="font-bold text-text-primary">Quick Check</h4>
      </div>
      <p className="text-text-secondary mb-4">Which statement about Rust&apos;s ownership rules is correct?</p>
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
              ? '✓ Correct! Rust enforces single ownership — when the owner goes out of scope, the value is automatically freed. No garbage collector needed.'
              : '✗ Not quite. Rust enforces single ownership: one owner per value, dropped when the owner exits scope. Borrowing creates temporary references but doesn\'t transfer ownership.'}
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

// ─── Main Module ───────────────────────────────────────────────────────────────

const RustFundamentals: React.FC<RustFundamentalsProps> = ({ isActive, onToggle }) => {
  const [completed, setCompleted] = useState(false);

  const handleComplete = () => {
    setCompleted(true);
    const progress = JSON.parse(localStorage.getItem('voidspace-builder-progress') || '{}');
    progress['rust-fundamentals'] = true;
    localStorage.setItem('voidspace-builder-progress', JSON.stringify(progress));
  };

  return (
    <Card variant="glass" padding="none" className="border-near-green/20">
      {/* ── Accordion Header ── */}
      <div
        onClick={onToggle}
        className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
            <Code className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Rust Fundamentals</h3>
            <p className="text-text-muted text-sm">Learn the Rust basics you need for smart contract development</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-near-green/10 text-near-green border-near-green/20">Beginner</Badge>
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
            <div className="border-t border-near-green/20 p-6 space-y-8">
              {/* Module Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-near-green/20 bg-near-green/5 text-xs text-near-green">
                <BookOpen className="w-3 h-3" />
                Module 2 of 27
                <span className="text-text-muted">•</span>
                <Clock className="w-3 h-3" />
                45 min read
              </div>

              {/* The Big Idea */}
              <Card variant="glass" padding="lg" className="border-near-green/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-orange-400" />
                  </div>
                  <h2 className="text-xl font-bold text-text-primary">The Big Idea</h2>
                </div>
                <p className="text-text-secondary leading-relaxed">
                  Think of Rust&apos;s ownership like a library book system. Each book (value) has exactly <span className="text-near-green font-medium">one borrower card</span> (owner).
                  You can let a friend read the book (<span className="text-near-green font-medium">borrow</span>), but they can&apos;t take it home.
                  Only one person can write notes in the margins at a time (<span className="text-near-green font-medium">mutable borrow</span>).
                  When you&apos;re done, the book is automatically returned — no overdue fees, no memory leaks.
                </p>
              </Card>

              {/* Interactive Visual */}
              <div>
                <h3 className="text-lg font-bold text-text-primary mb-2">🔧 Ownership Flow</h3>
                <p className="text-sm text-text-muted mb-4">See how values move through Rust&apos;s ownership system — from creation to cleanup.</p>
                <OwnershipFlowDiagram />
              </div>

              {/* Code Example */}
              <div>
                <h3 className="text-lg font-bold text-text-primary mb-3">💻 Code In Action</h3>
                <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border overflow-x-auto">
                  <div className="text-text-muted">{'// A NEAR contract using ownership fundamentals'}</div>
                  <div><span className="text-purple-400">use</span> near_sdk::{'{'}<span className="text-cyan-400">near</span>, <span className="text-cyan-400">env</span>, <span className="text-cyan-400">log</span>{'}'};</div>
                  <div className="mt-2"><span className="text-text-muted">{'// Derive Default so the contract can initialize with empty state'}</span></div>
                  <div><span className="text-purple-400">#[near(contract_state)]</span></div>
                  <div><span className="text-purple-400">pub struct</span> <span className="text-cyan-400">Greeter</span> {'{'}</div>
                  <div>    greeting: <span className="text-cyan-400">String</span>,</div>
                  <div>    <span className="text-text-muted">{'// Track how many times the greeting was changed'}</span></div>
                  <div>    update_count: <span className="text-cyan-400">u64</span>,</div>
                  <div>{'}'}</div>
                  <div className="mt-2"><span className="text-text-muted">{'// Default implementation — called on first deploy'}</span></div>
                  <div><span className="text-purple-400">impl</span> <span className="text-cyan-400">Default</span> <span className="text-purple-400">for</span> <span className="text-cyan-400">Greeter</span> {'{'}</div>
                  <div>    <span className="text-purple-400">fn</span> <span className="text-near-green">default</span>() -&gt; <span className="text-cyan-400">Self</span> {'{'}</div>
                  <div>        <span className="text-cyan-400">Self</span> {'{'} greeting: <span className="text-yellow-300">&quot;Hello&quot;</span>.to_string(), update_count: <span className="text-orange-400">0</span> {'}'}</div>
                  <div>    {'}'}</div>
                  <div>{'}'}</div>
                  <div className="mt-2"><span className="text-purple-400">#[near]</span></div>
                  <div><span className="text-purple-400">impl</span> <span className="text-cyan-400">Greeter</span> {'{'}</div>
                  <div>    <span className="text-text-muted">{'// &self = borrow (view method, free to call)'}</span></div>
                  <div>    <span className="text-purple-400">pub fn</span> <span className="text-near-green">get_greeting</span>(&amp;self) -&gt; &amp;<span className="text-cyan-400">str</span> {'{'}</div>
                  <div>        &amp;self.greeting</div>
                  <div>    {'}'}</div>
                  <div className="mt-1">    <span className="text-text-muted">{'// &mut self = exclusive borrow (change method, costs gas)'}</span></div>
                  <div>    <span className="text-purple-400">pub fn</span> <span className="text-near-green">set_greeting</span>(&amp;<span className="text-purple-400">mut</span> self, greeting: <span className="text-cyan-400">String</span>) {'{'}</div>
                  <div>        <span className="text-text-muted">{'// Log who called and what changed — useful for debugging'}</span></div>
                  <div>        log!(<span className="text-yellow-300">&quot;Account {} changed greeting to: {'{}'}&quot;</span>, env::predecessor_account_id(), &amp;greeting);</div>
                  <div>        self.greeting = greeting; <span className="text-text-muted">{'// ownership moves into struct'}</span></div>
                  <div>        self.update_count += <span className="text-orange-400">1</span>;</div>
                  <div>    {'}'}</div>
                  <div className="mt-1">    <span className="text-text-muted">{'// Return a copy — caller gets owned data'}</span></div>
                  <div>    <span className="text-purple-400">pub fn</span> <span className="text-near-green">get_update_count</span>(&amp;self) -&gt; <span className="text-cyan-400">u64</span> {'{'}</div>
                  <div>        self.update_count</div>
                  <div>    {'}'}</div>
                  <div>{'}'}</div>
                </div>
              </div>

              {/* Pro Tip */}
              <div className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/5 border border-emerald-500/20 rounded-xl p-5">
                <h4 className="font-semibold text-emerald-400 text-sm mb-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" /> Pro Tip
                </h4>
                <p className="text-xs text-text-secondary leading-relaxed">
                  When you see a compiler error about &quot;value used after move,&quot; don&apos;t panic — it&apos;s Rust protecting you.
                  The fix is usually one of three things: <span className="text-emerald-400 font-medium">.clone()</span> the value if you need two copies,
                  pass a <span className="text-emerald-400 font-medium">reference (&amp;value)</span> instead of the value itself,
                  or restructure so the value is only used once. In NEAR contracts, prefer references for read operations
                  and owned values only when you need to store data permanently in contract state.
                </p>
              </div>

              {/* Concept Cards */}
              <div>
                <h3 className="text-lg font-bold text-text-primary mb-4">🧩 Core Concepts</h3>
                <div className="grid grid-cols-1 gap-4">
                  <ConceptCard
                    icon={Lock}
                    title="Ownership"
                    preview="Every value in Rust has exactly one owner"
                    details="When a variable is assigned to another, ownership moves — the original is invalidated. This prevents double-free bugs at compile time. In NEAR contracts, your contract struct owns its state. When you return a String from a method, ownership transfers to the caller. Use .clone() if you need to keep a copy."
                  />
                  <ConceptCard
                    icon={Eye}
                    title="Borrowing & References"
                    preview="Temporary access without taking ownership"
                    details="Use &value for read-only borrows (unlimited simultaneous readers) or &mut value for exclusive write access (only one at a time). NEAR view methods use &self (borrow), change methods use &mut self (mutable borrow). The compiler enforces these rules at compile time — no race conditions possible."
                  />
                  <ConceptCard
                    icon={Code}
                    title="Structs & Enums"
                    preview="Custom types for modeling your contract state"
                    details="Structs group related data (like a contract's state fields). Enums represent variants — perfect for status fields like Pending/Active/Complete. Combined with #[near(contract_state)], structs become your on-chain storage. Enums with data variants (like Result<T,E>) are Rust's alternative to null pointers and exceptions."
                  />
                  <ConceptCard
                    icon={Unlock}
                    title="Pattern Matching"
                    preview="Exhaustive branching that the compiler verifies"
                    details="match expressions force you to handle every possible case — the compiler won't let you forget a variant. This is critical in contract code where missing a case could mean lost funds. Use match with enums for state machines, with Option<T> to handle missing values safely, and with Result<T,E> for error handling."
                  />
                  <ConceptCard
                    icon={Zap}
                    title="Traits & Implementations"
                    preview="Shared behavior — Rust's version of interfaces"
                    details="Traits define method signatures that types can implement. The NEAR SDK uses #[near] on impl blocks to expose methods as contract endpoints. Default trait implementations (like Default for contract initialization) reduce boilerplate. You'll implement traits like BorshSerialize and BorshDeserialize for custom types."
                  />
                  <ConceptCard
                    icon={Shield}
                    title="Error Handling with Result"
                    preview="No exceptions — Rust uses Result<T, E> for recoverable errors"
                    details="Instead of try/catch, Rust returns Result::Ok(value) on success and Result::Err(error) on failure. The ? operator propagates errors up the call chain cleanly. In NEAR contracts, panicking (via unwrap or panic!) rolls back the entire transaction and wastes gas. Use require!() from near-sdk for guard clauses, and return meaningful errors so callers know what went wrong."
                  />
                </div>
              </div>

              {/* Real World Example */}
              <Card variant="glass" padding="lg" className="border-cyan-500/20">
                <h3 className="text-lg font-bold text-text-primary mb-3 flex items-center gap-2">
                  <Rocket className="w-5 h-5 text-cyan-400" /> Real World Example
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed mb-3">
                  Imagine building a token transfer function. Ownership rules prevent you from accidentally spending
                  the same tokens twice. When you move a balance from sender to receiver, the compiler ensures the
                  sender&apos;s original value is consumed — you literally can&apos;t reference it again without
                  the compiler stopping you.
                </p>
                <div className="bg-black/40 rounded-lg p-3 font-mono text-xs text-text-secondary border border-border">
                  <div><span className="text-purple-400">pub fn</span> <span className="text-near-green">transfer</span>(&amp;<span className="text-purple-400">mut</span> self, to: AccountId, amount: u128) {'{'}</div>
                  <div>    <span className="text-purple-400">let</span> sender = env::predecessor_account_id();</div>
                  <div>    <span className="text-purple-400">let</span> balance = self.balances.get(&amp;sender).unwrap_or(<span className="text-orange-400">0</span>);</div>
                  <div>    require!(balance &gt;= amount, <span className="text-yellow-300">&quot;Not enough funds&quot;</span>);</div>
                  <div>    <span className="text-text-muted">{'// Ownership ensures balance is updated atomically'}</span></div>
                  <div>    self.balances.insert(&amp;sender, &amp;(balance - amount));</div>
                  <div>    <span className="text-purple-400">let</span> receiver_bal = self.balances.get(&amp;to).unwrap_or(<span className="text-orange-400">0</span>);</div>
                  <div>    self.balances.insert(&amp;to, &amp;(receiver_bal + amount));</div>
                  <div>{'}'}</div>
                </div>
              </Card>

              {/* Common Mistakes */}
              <Card variant="default" padding="md" className="border-orange-500/20 bg-orange-500/5">
                <h4 className="font-semibold text-orange-400 mb-2">⚠️ Common Mistakes</h4>
                <ul className="space-y-1 text-sm text-text-secondary">
                  <li>• Using a value after it&apos;s been moved — the compiler will catch this, read the error message carefully</li>
                  <li>• Forgetting &amp;mut on methods that modify state — view methods can&apos;t change contract storage</li>
                  <li>• Using String when &amp;str suffices — prefer borrowing for function parameters to avoid unnecessary cloning</li>
                  <li>• Ignoring the Result type — unwrap() in production contracts panics and wastes gas</li>
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
                    'Ownership = one owner per value. When the owner exits scope, memory is freed automatically.',
                    'Use &self for view methods (free) and &mut self for change methods (costs gas) in NEAR contracts.',
                    'Pattern matching with match forces you to handle every case — no forgotten edge cases.',
                    'Rust catches memory bugs at compile time — if it compiles, it won\'t crash from ownership violations.',
                  ].map((point, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                      <span className="text-near-green mt-0.5 font-bold">→</span>
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

export default RustFundamentals;
