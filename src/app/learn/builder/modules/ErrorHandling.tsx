'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import {
  ChevronDown, ChevronUp, BookOpen, Clock, CheckCircle2,
  Lightbulb, Zap, AlertTriangle, XCircle, CheckCircle, RefreshCw, Shield,
} from 'lucide-react';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface ErrorHandlingProps {
  isActive: boolean;
  onToggle?: () => void;
}

// ─── Interactive: Fix the Error Handling Challenge ─────────────────────────────

type CodeVersion = 'bad' | 'ok' | 'best';

const CODE_VERSIONS: { id: CodeVersion; label: string; emoji: string; color: string; border: string; desc: string; code: string[] }[] = [
  {
    id: 'bad',
    label: 'Panic Mode',
    emoji: '💥',
    color: 'text-red-400',
    border: 'border-red-500/40',
    desc: 'Using unwrap() — crashes the transaction and wastes all gas if anything is None or Err.',
    code: [
      'pub fn transfer_nft(&mut self, token_id: String, to: AccountId) {',
      '    // 💥 unwrap() panics if token not found → wasted gas!',
      '    let token = self.tokens.get(&token_id).unwrap();',
      '    // 💥 panics if no owner set → silent data bug',
      '    let owner = token.owner.unwrap();',
      '    // 💥 panics if not authorized → expensive revert',
      '    assert!(owner == env::predecessor_account_id());',
      '    self.tokens.insert(token_id, Token { owner: Some(to) });',
      '}',
    ],
  },
  {
    id: 'ok',
    label: 'Safe Guards',
    emoji: '🛡️',
    color: 'text-yellow-400',
    border: 'border-yellow-500/40',
    desc: 'Using require!() — still panics, but with a meaningful message and intentional guard logic.',
    code: [
      'pub fn transfer_nft(&mut self, token_id: String, to: AccountId) {',
      '    // ✓ require! panics with a clear message — intentional',
      '    let token = self.tokens.get(&token_id);',
      '    require!(token.is_some(), "Token not found");',
      '    let token = token.unwrap(); // safe now — we checked',
      '    let caller = env::predecessor_account_id();',
      '    require!(token.owner.as_ref() == Some(&caller), "Not owner");',
      '    self.tokens.insert(token_id, Token { owner: Some(to) });',
      '}',
    ],
  },
  {
    id: 'best',
    label: 'Result Pattern',
    emoji: '✅',
    color: 'text-emerald-400',
    border: 'border-emerald-500/40',
    desc: 'Using Result<T,E> with ? operator — caller knows exactly what failed, gas-efficient propagation.',
    code: [
      '#[derive(Debug)]',
      'pub enum NftError { TokenNotFound, NotOwner, AlreadyOwned }',
      '',
      'pub fn transfer_nft(',
      '    &mut self, token_id: String, to: AccountId',
      ') -> Result<(), NftError> {',
      '    let token = self.tokens.get(&token_id)',
      '        .ok_or(NftError::TokenNotFound)?;  // ? propagates error',
      '    let caller = env::predecessor_account_id();',
      '    if token.owner.as_ref() != Some(&caller) {',
      '        return Err(NftError::NotOwner);',
      '    }',
      '    self.tokens.insert(token_id, Token { owner: Some(to) });',
      '    Ok(())  // explicit success',
      '}',
    ],
  },
];

function ErrorFixChallenge() {
  const [activeVersion, setActiveVersion] = useState<CodeVersion>('bad');
  const current = CODE_VERSIONS.find(v => v.id === activeVersion)!;

  return (
    <div className="space-y-4">
      <p className="text-sm text-text-muted">Compare three approaches to error handling in the same NFT transfer function.</p>
      <div className="flex gap-2">
        {CODE_VERSIONS.map(v => (
          <motion.button
            key={v.id}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveVersion(v.id)}
            className={cn(
              'flex-1 rounded-lg border py-2 px-3 text-sm font-semibold transition-all',
              activeVersion === v.id
                ? `${v.color} ${v.border} bg-black/30`
                : 'bg-surface border-border text-text-muted hover:border-border-hover'
            )}
          >
            {v.emoji} {v.label}
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeVersion}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="space-y-3"
        >
          <div className={cn('rounded-lg border p-3 text-xs', current.border, 'bg-black/20')}>
            <p className={cn('font-semibold mb-1', current.color)}>{current.emoji} {current.label}</p>
            <p className="text-text-muted">{current.desc}</p>
          </div>
          <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-text-secondary border border-border overflow-x-auto">
            {current.code.map((line, i) => (
              <div key={i} className={cn(
                line.includes('💥') ? 'text-red-400' : '',
                line.includes('✓') ? 'text-emerald-400' : '',
              )}>
                {line || '\u00A0'}
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─── Concept Card ──────────────────────────────────────────────────────────────

function ConceptCard({ icon: Icon, title, preview, details, iconColor = 'text-rose-400', bgColor = 'from-rose-500/20 to-red-500/20', borderColor = 'border-rose-500/20' }: {
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
  const correct = 2;
  const options = [
    'unwrap() is always safe because it just returns the value if present',
    'The ? operator can only be used inside main()',
    'The ? operator propagates errors up — if the function returns Err, it returns immediately with that error',
    'Option<T> and Result<T,E> are the same type with different names',
  ];
  return (
    <Card variant="glass" padding="lg">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-near-green" />
        <h4 className="font-bold text-text-primary">Quick Check — The ? Operator</h4>
      </div>
      <p className="text-text-secondary mb-4 text-sm">What does the <code className="text-rose-400">?</code> operator do in Rust?</p>
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
              ? '✓ Correct! `?` is syntactic sugar for: if Err(e), return Err(e). It threads errors up the call chain cleanly without nested match arms.'
              : '✗ The ? operator early-returns with Err if the value is Err, or unwraps the Ok value to continue. It only works in functions that return Result (or Option).'}
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

// ─── Main Module ───────────────────────────────────────────────────────────────

const ErrorHandling: React.FC<ErrorHandlingProps> = ({ isActive, onToggle }) => {
  const [completed, setCompleted] = useState(false);

  const handleComplete = () => {
    setCompleted(true);
    const progress = JSON.parse(localStorage.getItem('voidspace-builder-progress') || '{}');
    progress['error-handling'] = true;
    localStorage.setItem('voidspace-builder-progress', JSON.stringify(progress));
  };

  return (
    <Card variant="glass" padding="none" className="border-rose-500/20">
      {/* ── Accordion Header ── */}
      <div
        onClick={() => {}} style={{display:"none"}}
        className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-red-600 rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Error Handling</h3>
            <p className="text-text-muted text-sm">Result, Option, and the ? operator — no more silent failures</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-rose-500/10 text-rose-300 border-rose-500/20">Intermediate</Badge>
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
            <div className="border-t border-rose-500/20 p-6 space-y-8">
              {/* Module Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-rose-500/20 bg-rose-500/5 text-xs text-rose-400">
                <BookOpen className="w-3 h-3" />
                Module 5 of 27
                <span className="text-text-muted">•</span>
                <Clock className="w-3 h-3" />
                35 min read
              </div>

              {/* The Big Idea */}
              <Card variant="glass" padding="lg" className="border-rose-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500/20 to-red-500/20 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-rose-400" />
                  </div>
                  <h2 className="text-xl font-bold text-text-primary">Panics in Contracts = Lost Gas</h2>
                </div>
                <p className="text-text-secondary leading-relaxed">
                  In most languages, exceptions unwind quietly. In NEAR, a <span className="text-rose-400 font-medium">panic rolls back the entire transaction</span> —
                  and the caller loses all the gas they spent getting there. Every <code className="text-rose-300 bg-black/30 px-1 rounded">.unwrap()</code> is
                  a ticking bomb. Rust gives you <span className="text-rose-400 font-medium">Result&lt;T, E&gt;</span> and <span className="text-rose-400 font-medium">Option&lt;T&gt;</span> to
                  handle failures gracefully at the type level — callers know what can go wrong, and the compiler
                  forces you to handle it.
                </p>
              </Card>

              {/* Interactive Challenge */}
              <div>
                <h3 className="text-lg font-bold text-text-primary mb-2">🎮 Fix the Error Handling</h3>
                <p className="text-sm text-text-muted mb-4">See the same NFT transfer function evolve from panic-prone to production-ready.</p>
                <ErrorFixChallenge />
              </div>

              {/* Code: Option and Result */}
              <div>
                <h3 className="text-lg font-bold text-text-primary mb-3">💻 Option&lt;T&gt; vs Result&lt;T, E&gt;</h3>
                <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-text-secondary border border-border overflow-x-auto">
                  <div className="text-text-muted">{'// Option<T> — value might not exist (like a nullable in other languages)'}</div>
                  <div><span className="text-purple-400">let</span> balance: <span className="text-cyan-400">Option</span>{'<u128>'} = self.balances.get(&account);</div>
                  <div><span className="text-purple-400">let</span> amount = <span className="text-purple-400">match</span> balance {'{'}</div>
                  <div>{'    Some(b) => b,       // value exists'}</div>
                  <div>{'    None => 0,           // use default instead of panic'}</div>
                  <div>{'};'}</div>
                  <div className="mt-2 text-text-muted">{'// Shorthand: .unwrap_or() for simple defaults'}</div>
                  <div><span className="text-purple-400">let</span> amount = self.balances.get(&account).unwrap_or(<span className="text-orange-400">0</span>);</div>
                  <div className="mt-3 text-text-muted">{'// Result<T, E> — operation might fail with a known error'}</div>
                  <div><span className="text-purple-400">fn</span> <span className="text-near-green">parse_account</span>(input: &str) -&gt; <span className="text-cyan-400">Result</span>{'<AccountId, String>'} {'{'}</div>
                  <div>{'    if input.ends_with(".near") || input.ends_with(".testnet") {'}</div>
                  <div>{'        Ok(input.parse().unwrap()) // valid'}</div>
                  <div>{'    } else {'}</div>
                  <div>{'        Err(format!("Invalid account: {}", input))'}</div>
                  <div>{'    }'}</div>
                  <div>{'}'}</div>
                  <div className="mt-2 text-text-muted">{'// ? operator chains Results without nested match'}</div>
                  <div><span className="text-purple-400">fn</span> <span className="text-near-green">process</span>(input: &str) -&gt; <span className="text-cyan-400">Result</span>{'<(), String>'} {'{'}</div>
                  <div>{'    let account = parse_account(input)?; // return Err if failed'}</div>
                  <div>{'    self.whitelist.insert(account);'}</div>
                  <div>{'    Ok(())'}</div>
                  <div>{'}'}</div>
                </div>
              </div>

              {/* Pro Tip */}
              <div className="bg-gradient-to-r from-rose-500/10 to-red-500/5 border border-rose-500/20 rounded-xl p-5">
                <h4 className="font-semibold text-rose-400 text-sm mb-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" /> NEAR Contract Error Strategy
                </h4>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Use <span className="text-rose-400 font-medium">require!(condition, &quot;message&quot;)</span> from near-sdk for
                  access control guards (authorization, fund checks) — these are intentional panics that communicate
                  clearly. Use <span className="text-rose-400 font-medium">Result&lt;T, E&gt;</span> for operations that
                  might legitimately fail in ways callers should handle (parsing, lookups, validation).
                  Reserve <code className="text-rose-300">unwrap()</code> only for values you&apos;re <em>certain</em> are Some/Ok — and
                  document why in a comment.
                </p>
              </div>

              {/* Concept Cards */}
              <div>
                <h3 className="text-lg font-bold text-text-primary mb-4">🧩 Core Concepts</h3>
                <div className="grid grid-cols-1 gap-4">
                  <ConceptCard
                    icon={CheckCircle}
                    title="Option<T> — Maybe a Value"
                    preview="Some(value) or None — Rust's null-safe alternative"
                    details="Option<T> is an enum: Some(T) means a value exists, None means it doesn't. The compiler forces you to handle both cases — no null pointer exceptions. Use .unwrap_or(default) for simple fallbacks, .map(|v| transform(v)) for chaining operations, and match for complex branching. NEAR SDK collection lookups return Option<V>."
                    iconColor="text-emerald-400"
                    bgColor="from-emerald-500/20 to-emerald-500/10"
                    borderColor="border-emerald-500/20"
                  />
                  <ConceptCard
                    icon={XCircle}
                    title="Result<T, E> — Success or Known Failure"
                    preview="Ok(value) or Err(error) — explicit error paths"
                    details="Result<T, E> is an enum: Ok(T) means success with a value, Err(E) means failure with an error. Define your own error enum for rich error information. Use ? to propagate errors up — it's equivalent to `match r { Ok(v) => v, Err(e) => return Err(e.into()) }`. In NEAR contracts, returning Result makes your contract's API honest about what can fail."
                    iconColor="text-rose-400"
                    bgColor="from-rose-500/20 to-rose-500/10"
                    borderColor="border-rose-500/20"
                  />
                  <ConceptCard
                    icon={RefreshCw}
                    title="The ? Operator — Error Propagation"
                    preview="Short-circuit on failure — clean chaining without nested match"
                    details="`value?` is equivalent to: if Ok(v), return v; if Err(e), return Err(e) early. Stacks of ? calls create clean, readable pipelines. The error type must implement From<OriginalError> for the function's error type — Rust's From trait enables automatic conversion. This is the idiomatic way to write error-handling code in Rust."
                    iconColor="text-blue-400"
                    bgColor="from-blue-500/20 to-blue-500/10"
                    borderColor="border-blue-500/20"
                  />
                  <ConceptCard
                    icon={AlertTriangle}
                    title="unwrap, expect, and require!"
                    preview="When panicking is intentional — use these sparingly"
                    details=".unwrap() panics with a generic message if None/Err. .expect('message') panics with your message — better for debugging. require!(condition, 'message') from near-sdk is for access control guards: authorization checks, fund validation, invariant enforcement. All three panic and revert the transaction. Only use them when the panic is intentional and the caller understands the risk."
                    iconColor="text-orange-400"
                    bgColor="from-orange-500/20 to-orange-500/10"
                    borderColor="border-orange-500/20"
                  />
                </div>
              </div>

              {/* Common Mistakes */}
              <Card variant="default" padding="md" className="border-orange-500/20 bg-orange-500/5">
                <h4 className="font-semibold text-orange-400 mb-2">⚠️ Error Handling Pitfalls</h4>
                <ul className="space-y-1 text-sm text-text-secondary">
                  <li>• .unwrap() on user-supplied data — ALWAYS validate input before unwrapping</li>
                  <li>• Using panic!() for normal error conditions — use Result instead, let callers handle it</li>
                  <li>• Forgetting that NEAR panics revert everything — gas is still charged to the caller</li>
                  <li>• Swallowing errors with .unwrap_or(default) when the error matters — log or return it instead</li>
                </ul>
              </Card>

              {/* Quiz */}
              <MiniQuiz />

              {/* Key Takeaways */}
              <Card variant="glass" padding="lg" className="border-rose-500/20">
                <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-rose-400" />
                  Key Takeaways
                </h3>
                <ul className="space-y-2">
                  {[
                    'NEAR panics revert the entire transaction and waste gas — never let user-controlled code reach .unwrap() without validation.',
                    'Option<T> = nullable alternative. Some(v) | None. Compiler forces you to handle both. No null pointer exceptions.',
                    'Result<T,E> = explicit failure path. Ok(v) | Err(e). Use ? to propagate errors cleanly up the call chain.',
                    'require!() for intentional access control guards; Result for operations that legitimately might fail.',
                  ].map((point, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                      <span className="text-rose-400 mt-0.5 font-bold">→</span>
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
                    : 'bg-rose-500/10 text-rose-300 border border-rose-500/30 hover:bg-rose-500/20'
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

export default ErrorHandling;
