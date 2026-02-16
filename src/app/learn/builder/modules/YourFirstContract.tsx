'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import {
  ChevronDown, ChevronUp, BookOpen, Clock, CheckCircle2,
  Lightbulb, Zap, FileCode, ArrowRight, Play, Rocket, Code,
  Package,
} from 'lucide-react';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface YourFirstContractProps {
  isActive: boolean;
  onToggle: () => void;
}

// ─── Interactive Visual: Contract Lifecycle ────────────────────────────────────

const lifecycleStages = [
  { id: 'write', label: 'Write', icon: '✍️', desc: 'Define your contract struct, methods, and storage in Rust. Use #[near] macros to expose endpoints.', color: 'from-violet-500 to-purple-500' },
  { id: 'build', label: 'Build', icon: '🔨', desc: 'Run cargo near build to compile Rust into a .wasm binary optimized for the NEAR VM.', color: 'from-blue-500 to-cyan-500' },
  { id: 'deploy', label: 'Deploy', icon: '🚀', desc: 'Use near deploy to upload your .wasm to a NEAR account. The account becomes your contract.', color: 'from-emerald-500 to-green-500' },
  { id: 'interact', label: 'Interact', icon: '🔗', desc: 'Call view methods (free) and change methods (costs gas) via near call or any NEAR client.', color: 'from-amber-500 to-yellow-500' },
];

function ContractLifecycle() {
  const [activeStage, setActiveStage] = useState<number>(0);

  return (
    <div className="relative py-4">
      <div className="flex items-center justify-between mb-6">
        {lifecycleStages.map((stage, i) => (
          <React.Fragment key={stage.id}>
            <motion.button
              onClick={() => setActiveStage(i)}
              className={cn(
                'flex flex-col items-center gap-2 p-3 rounded-xl border transition-all flex-1',
                activeStage === i
                  ? 'border-near-green/40 bg-near-green/5'
                  : 'border-border bg-black/20 hover:border-border-hover'
              )}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              <div className={cn('w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center text-lg', stage.color)}>
                {stage.icon}
              </div>
              <span className={cn('text-xs font-bold', activeStage === i ? 'text-near-green' : 'text-text-muted')}>
                {stage.label}
              </span>
            </motion.button>
            {i < lifecycleStages.length - 1 && (
              <ArrowRight className="w-4 h-4 text-text-muted/40 flex-shrink-0 mx-1" />
            )}
          </React.Fragment>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStage}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="bg-black/30 rounded-lg p-4 border border-border"
        >
          <p className="text-sm text-text-secondary leading-relaxed">{lifecycleStages[activeStage].desc}</p>
        </motion.div>
      </AnimatePresence>
      <p className="text-center text-xs text-text-muted mt-4">
        👆 Click each stage to learn the contract lifecycle
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
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/20 flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-green-400" />
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
    'A standalone binary that runs on your computer',
    'A JavaScript file uploaded to NEAR nodes',
    'A WebAssembly binary deployed to a NEAR account',
    'A Docker container running on NEAR validators',
  ];
  return (
    <Card variant="glass" padding="lg">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-near-green" />
        <h4 className="font-bold text-text-primary">Quick Check</h4>
      </div>
      <p className="text-text-secondary mb-4">What is a NEAR smart contract at the lowest level?</p>
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
              ? '✓ Correct! Rust compiles to WebAssembly (.wasm), which is deployed to a NEAR account. The NEAR runtime executes this Wasm binary when methods are called.'
              : '✗ Not quite. NEAR contracts are compiled from Rust to WebAssembly (.wasm) and deployed to a NEAR account. The VM executes the Wasm binary on-chain.'}
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

// ─── Main Module ───────────────────────────────────────────────────────────────

const YourFirstContract: React.FC<YourFirstContractProps> = ({ isActive, onToggle }) => {
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const progress = JSON.parse(localStorage.getItem('voidspace-builder-progress') || '{}');
      if (progress['your-first-contract']) setCompleted(true);
    }
  }, []);

  const handleComplete = () => {
    if (typeof window !== 'undefined') {
      const progress = JSON.parse(localStorage.getItem('voidspace-builder-progress') || '{}');
      progress['your-first-contract'] = true;
      localStorage.setItem('voidspace-builder-progress', JSON.stringify(progress));
      setCompleted(true);
    }
  };

  return (
    <Card variant="glass" padding="none" className="border-near-green/20">
      {/* ── Accordion Header ── */}
      <div
        onClick={onToggle}
        className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center',
            completed
              ? 'bg-gradient-to-br from-emerald-500 to-green-600'
              : 'bg-gradient-to-br from-green-500 to-emerald-500'
          )}>
            {completed ? <CheckCircle2 className="w-6 h-6 text-white" /> : <FileCode className="w-6 h-6 text-white" />}
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Your First Contract</h3>
            <p className="text-text-muted text-sm">Write, build, and deploy a smart contract on NEAR</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {completed && (
            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">✓ Complete</Badge>
          )}
          <Badge className="bg-near-green/10 text-near-green border-near-green/20">Beginner</Badge>
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
            <div className="border-t border-near-green/20 p-6 space-y-8">
              {/* Module Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-near-green/20 bg-near-green/5 text-xs text-near-green">
                <BookOpen className="w-3 h-3" />
                Module 2 of 22
                <span className="text-text-muted">•</span>
                <Clock className="w-3 h-3" />
                40 min read
              </div>

              {/* The Big Idea */}
              <Card variant="glass" padding="lg" className="border-near-green/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-green-400" />
                  </div>
                  <h2 className="text-xl font-bold text-text-primary">The Big Idea</h2>
                </div>
                <p className="text-text-secondary leading-relaxed">
                  A smart contract is like a <span className="text-near-green font-medium">vending machine</span> — you put money in, press a button,
                  and it does exactly what it&apos;s programmed to do, every time, with no human middleman. On NEAR, your Rust code compiles into a
                  tiny program (<span className="text-near-green font-medium">WebAssembly</span>) that lives on an account and responds to function calls
                  from anyone in the world. Once deployed, it runs exactly as written — no take-backs.
                </p>
              </Card>

              {/* Interactive Visual */}
              <div>
                <h3 className="text-lg font-bold text-text-primary mb-2">🔧 Contract Lifecycle</h3>
                <p className="text-sm text-text-muted mb-4">Follow a contract from code to live on-chain in four stages.</p>
                <ContractLifecycle />
              </div>

              {/* Code Example */}
              <div>
                <h3 className="text-lg font-bold text-text-primary mb-3">💻 Your First Contract</h3>
                <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border overflow-x-auto">
                  <div><span className="text-purple-400">use</span> near_sdk::{'{'}<span className="text-cyan-400">near</span>, <span className="text-cyan-400">env</span>, <span className="text-cyan-400">log</span>{'}'};</div>
                  <div className="mt-2"><span className="text-purple-400">#[near(contract_state)]</span></div>
                  <div><span className="text-purple-400">pub struct</span> <span className="text-cyan-400">HelloNear</span> {'{'}</div>
                  <div>    greeting: <span className="text-cyan-400">String</span>,</div>
                  <div>{'}'}</div>
                  <div className="mt-2"><span className="text-purple-400">impl</span> <span className="text-cyan-400">Default</span> <span className="text-purple-400">for</span> <span className="text-cyan-400">HelloNear</span> {'{'}</div>
                  <div>    <span className="text-purple-400">fn</span> <span className="text-near-green">default</span>() -&gt; <span className="text-cyan-400">Self</span> {'{'}</div>
                  <div>        <span className="text-cyan-400">Self</span> {'{'} greeting: <span className="text-yellow-300">&quot;Hello&quot;</span>.to_string() {'}'}</div>
                  <div>    {'}'}</div>
                  <div>{'}'}</div>
                  <div className="mt-2"><span className="text-purple-400">#[near]</span></div>
                  <div><span className="text-purple-400">impl</span> <span className="text-cyan-400">HelloNear</span> {'{'}</div>
                  <div>    <span className="text-purple-400">pub fn</span> <span className="text-near-green">get_greeting</span>(&amp;self) -&gt; &amp;<span className="text-cyan-400">str</span> {'{'}</div>
                  <div>        &amp;self.greeting</div>
                  <div>    {'}'}</div>
                  <div className="mt-1">    <span className="text-purple-400">pub fn</span> <span className="text-near-green">set_greeting</span>(&amp;<span className="text-purple-400">mut</span> self, greeting: <span className="text-cyan-400">String</span>) {'{'}</div>
                  <div>        log!(<span className="text-yellow-300">&quot;Saving: {'{}'}&quot;</span>, &amp;greeting);</div>
                  <div>        self.greeting = greeting;</div>
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
                  Use <code className="text-emerald-400 bg-emerald-500/10 px-1 rounded">cargo near build --no-docker</code> for
                  faster development builds. The Docker-based build ensures reproducibility for production, but local builds
                  are 3-5x faster for iteration. Also, run <code className="text-emerald-400 bg-emerald-500/10 px-1 rounded">cargo clippy</code> after
                  builds to catch common Rust anti-patterns before they become on-chain bugs.
                </p>
              </div>

              {/* Real World Example */}
              <Card variant="glass" padding="lg" className="border-cyan-500/20">
                <h3 className="text-lg font-bold text-text-primary mb-3 flex items-center gap-2">
                  <Rocket className="w-5 h-5 text-cyan-400" /> Real World Example
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed mb-4">
                  Here&apos;s a counter contract — the &quot;Hello World&quot; of NEAR. It uses{' '}
                  <code className="text-cyan-400">#[init]</code> for custom initialization, shows view vs change methods,
                  and demonstrates the <code className="text-cyan-400">#[payable]</code> attribute.
                </p>
                <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border overflow-x-auto">
                  <div><span className="text-purple-400">use</span> near_sdk::{'{'}<span className="text-cyan-400">near</span>, <span className="text-cyan-400">env</span>, <span className="text-cyan-400">log</span>, <span className="text-cyan-400">NearToken</span>{'}'};</div>
                  <div className="mt-2"><span className="text-purple-400">#[near(contract_state)]</span></div>
                  <div><span className="text-purple-400">pub struct</span> <span className="text-cyan-400">Counter</span> {'{'}</div>
                  <div>    count: <span className="text-cyan-400">i64</span>,</div>
                  <div>    owner: <span className="text-cyan-400">AccountId</span>,</div>
                  <div>{'}'}</div>
                  <div className="mt-2"><span className="text-purple-400">#[near]</span></div>
                  <div><span className="text-purple-400">impl</span> <span className="text-cyan-400">Counter</span> {'{'}</div>
                  <div>    <span className="text-text-muted">// Custom init — replaces Default</span></div>
                  <div>    <span className="text-purple-400">#[init]</span></div>
                  <div>    <span className="text-purple-400">pub fn</span> <span className="text-near-green">new</span>(start: <span className="text-cyan-400">i64</span>) -&gt; <span className="text-cyan-400">Self</span> {'{'}</div>
                  <div>        <span className="text-cyan-400">Self</span> {'{'} count: start, owner: env::predecessor_account_id() {'}'}</div>
                  <div>    {'}'}</div>
                  <div className="mt-2">    <span className="text-text-muted">// View method — free to call</span></div>
                  <div>    <span className="text-purple-400">pub fn</span> <span className="text-near-green">get_count</span>(&amp;self) -&gt; <span className="text-cyan-400">i64</span> {'{'}</div>
                  <div>        self.count</div>
                  <div>    {'}'}</div>
                  <div className="mt-2">    <span className="text-text-muted">// Change method — costs gas</span></div>
                  <div>    <span className="text-purple-400">pub fn</span> <span className="text-near-green">increment</span>(&amp;<span className="text-purple-400">mut</span> self) {'{'}</div>
                  <div>        self.count += 1;</div>
                  <div>        log!(<span className="text-yellow-300">&quot;Count: {'{}'}&quot;</span>, self.count);</div>
                  <div>    {'}'}</div>
                  <div className="mt-2">    <span className="text-text-muted">// Payable — accepts attached NEAR</span></div>
                  <div>    <span className="text-purple-400">#[payable]</span></div>
                  <div>    <span className="text-purple-400">pub fn</span> <span className="text-near-green">increment_by</span>(&amp;<span className="text-purple-400">mut</span> self, amount: <span className="text-cyan-400">i64</span>) {'{'}</div>
                  <div>        <span className="text-purple-400">let</span> deposit = env::attached_deposit();</div>
                  <div>        assert!(deposit &gt;= NearToken::from_yoctonear(1), <span className="text-yellow-300">&quot;Attach NEAR&quot;</span>);</div>
                  <div>        self.count += amount;</div>
                  <div>    {'}'}</div>
                  <div>{'}'}</div>
                </div>
                <p className="text-xs text-text-muted mt-3 leading-relaxed">
                  Deploy with: <code className="text-cyan-400 bg-cyan-500/10 px-1 rounded">near deploy counter.testnet ./target/near/counter.wasm --initFunction new --initArgs &apos;{'{&quot;start&quot;: 0}'}&apos;</code>
                </p>
              </Card>

              {/* Concept Cards */}
              <div>
                <h3 className="text-lg font-bold text-text-primary mb-4">🧩 Core Concepts</h3>
                <div className="grid grid-cols-1 gap-4">
                  <ConceptCard
                    icon={Code}
                    title="#[near(contract_state)]"
                    preview="Marks your struct as the contract's persistent storage"
                    details="This macro tells the NEAR SDK which struct holds your on-chain state. It automatically generates serialization/deserialization code so your data persists between calls. Every contract needs exactly one struct with this attribute. Fields are stored as key-value pairs in the account's storage."
                  />
                  <ConceptCard
                    icon={Play}
                    title="Default Implementation"
                    preview="How your contract initializes when first deployed"
                    details="The Default trait provides the initial state when a contract is deployed without an explicit init call. It's the simplest way to bootstrap. For more complex initialization, use #[init] on a custom function. Without either, calling your contract before initialization will panic."
                  />
                  <ConceptCard
                    icon={Rocket}
                    title="View vs Change Methods"
                    preview="Read for free, write for gas"
                    details="Methods with &self are view methods — they read state without modifying it and are free to call. Methods with &mut self are change methods — they modify state and require a transaction with gas. This is a fundamental design pattern: separate reads (free) from writes (paid) to minimize user costs."
                  />
                  <ConceptCard
                    icon={Zap}
                    title="Deploying with cargo-near"
                    preview="From Rust source to live on NEAR in two commands"
                    details="Run 'cargo near build' to compile your contract into an optimized .wasm file (typically 50-200KB). Then 'near deploy <account> ./target/near/<name>.wasm' uploads it. The contract is now live — anyone can call its public methods. Use --accountId to specify which NEAR account to deploy to."
                  />
                  <ConceptCard
                    icon={Package}
                    title="Cargo.toml Configuration"
                    preview="Essential project settings for NEAR contract compilation"
                    details="Your Cargo.toml needs [lib] crate-type = ['cdylib'] to output a C-compatible dynamic library that compiles to WebAssembly. Add near-sdk as your main dependency. Use [profile.release] with opt-level = 'z' and lto = true to minimize .wasm size — smaller contracts cost less to deploy and execute. The cargo-near tool reads these settings automatically during builds."
                  />
                </div>
              </div>

              {/* Common Mistakes */}
              <Card variant="default" padding="md" className="border-orange-500/20 bg-orange-500/5">
                <h4 className="font-semibold text-orange-400 mb-2">⚠️ Common Mistakes</h4>
                <ul className="space-y-1 text-sm text-text-secondary">
                  <li>• Forgetting Default — without it, your contract panics on first call if no init function is provided</li>
                  <li>• Making change methods &amp;self instead of &amp;mut self — state changes silently don&apos;t persist</li>
                  <li>• Deploying to a non-existent account — create the account first with near create-account</li>
                  <li>• Not reserving enough NEAR for storage — each byte stored costs ~0.00001 NEAR</li>
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
                    'A NEAR contract = Rust struct + methods, compiled to WebAssembly and deployed to an account.',
                    'View methods (&self) are free; change methods (&mut self) cost gas.',
                    'Default provides initial state — every contract needs initialization.',
                    'The lifecycle is Write → Build → Deploy → Interact. Master this loop.',
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
                  disabled={completed}
                  className={cn(
                    'px-8 py-3 rounded-xl font-semibold text-sm transition-all flex items-center gap-2',
                    completed
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default'
                      : 'bg-gradient-to-r from-near-green to-emerald-500 text-white hover:shadow-lg hover:shadow-near-green/20'
                  )}
                  whileHover={completed ? {} : { scale: 1.03, y: -1 }}
                  whileTap={completed ? {} : { scale: 0.97 }}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {completed ? 'Module Completed ✓' : 'Mark as Complete'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default YourFirstContract;
