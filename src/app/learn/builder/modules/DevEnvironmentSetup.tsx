'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import {
  ChevronDown, ChevronUp, BookOpen, Clock, CheckCircle2,
  Lightbulb, Zap, Terminal, ArrowRight, FolderOpen, Wrench, Settings,
  Rocket, GitBranch,
} from 'lucide-react';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface DevEnvironmentSetupProps {
  isActive: boolean;
  onToggle: () => void;
}

// ─── Interactive Visual: Toolchain Stack ───────────────────────────────────────

const toolchainLayers = [
  { id: 'rust', label: 'Rust', desc: 'rustup + cargo + wasm32-unknown-unknown target', icon: '🦀', color: 'from-orange-500/20 to-orange-500/10', border: 'border-orange-500/30' },
  { id: 'node', label: 'Node.js', desc: 'nvm install --lts → npm for CLI and frontend tools', icon: '📦', color: 'from-green-500/20 to-green-500/10', border: 'border-green-500/30' },
  { id: 'cli', label: 'NEAR CLI', desc: 'npm i -g near-cli-rs → interactive Rust-based CLI', icon: '⚡', color: 'from-purple-500/20 to-purple-500/10', border: 'border-purple-500/30' },
  { id: 'cargo-near', label: 'cargo-near', desc: 'cargo install cargo-near → scaffold + build projects', icon: '🔧', color: 'from-cyan-500/20 to-cyan-500/10', border: 'border-cyan-500/30' },
  { id: 'editor', label: 'VS Code', desc: 'rust-analyzer + Even Better TOML + Error Lens', icon: '💻', color: 'from-blue-500/20 to-blue-500/10', border: 'border-blue-500/30' },
];

function ToolchainDiagram() {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  return (
    <div className="relative py-4">
      <div className="flex items-center justify-between gap-1">
        {toolchainLayers.map((step, i) => (
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
            {i < toolchainLayers.length - 1 && (
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
              <code className="text-sm text-near-green font-mono">{toolchainLayers[activeStep].desc}</code>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <p className="text-center text-xs text-text-muted mt-4">
        👆 Click each tool to see what it does in your dev stack
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
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-purple-400" />
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
    'You can write NEAR contracts in any language — Rust is just a suggestion',
    'The wasm32-unknown-unknown target compiles Rust to WebAssembly, the format NEAR runs on-chain',
    'near-cli-rs requires Python 3.10+ to run on your machine',
    'cargo-near is only used for deployment — you create projects manually',
  ];
  return (
    <Card variant="glass" padding="lg">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-near-green" />
        <h4 className="font-bold text-text-primary">Quick Check</h4>
      </div>
      <p className="text-text-secondary mb-4">Which statement about the NEAR dev environment is correct?</p>
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
              ? '✓ Correct! NEAR runs WebAssembly on-chain. The wasm32-unknown-unknown Rust target compiles your contract code into a .wasm binary that NEAR validators execute.'
              : '✗ Not quite. The wasm32-unknown-unknown target is essential — it compiles Rust into WebAssembly format that NEAR runs on-chain. Without it, your code can\'t be deployed.'}
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

// ─── Main Module ───────────────────────────────────────────────────────────────

const DevEnvironmentSetup: React.FC<DevEnvironmentSetupProps> = ({ isActive, onToggle }) => {
  const [completed, setCompleted] = useState(false);

  const handleComplete = () => {
    setCompleted(true);
    const progress = JSON.parse(localStorage.getItem('voidspace-builder-progress') || '{}');
    progress['dev-environment-setup'] = true;
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
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Terminal className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Dev Environment Setup</h3>
            <p className="text-text-muted text-sm">Install tools, configure your workspace, and get ready to build</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-near-green/10 text-near-green border-near-green/20">Beginner</Badge>
          <Badge className="bg-purple-500/10 text-purple-300 border-purple-500/20">30 min</Badge>
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
                Module 1 of 27
                <span className="text-text-muted">•</span>
                <Clock className="w-3 h-3" />
                30 min read
              </div>

              {/* The Big Idea */}
              <Card variant="glass" padding="lg" className="border-near-green/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-purple-400" />
                  </div>
                  <h2 className="text-xl font-bold text-text-primary">The Big Idea</h2>
                </div>
                <p className="text-text-secondary leading-relaxed">
                  Setting up your dev environment is like building a <span className="text-near-green font-medium">workshop before crafting furniture</span>.
                  You need the right <span className="text-near-green font-medium">power tools</span> (Rust compiler, Node.js),
                  a <span className="text-near-green font-medium">workbench</span> (VS Code with extensions),
                  and <span className="text-near-green font-medium">blueprints</span> (cargo-near templates).
                  Skipping setup leads to fighting tools instead of writing code. Invest 30 minutes now, save hours later.
                </p>
              </Card>

              {/* Interactive Visual */}
              <div>
                <h3 className="text-lg font-bold text-text-primary mb-2">🔧 Your Toolchain Stack</h3>
                <p className="text-sm text-text-muted mb-4">Each tool builds on the last — install them in order from left to right.</p>
                <ToolchainDiagram />
              </div>

              {/* Code Example — Full Setup Script */}
              <div>
                <h3 className="text-lg font-bold text-text-primary mb-3">💻 Quick Setup Script</h3>
                <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border overflow-x-auto">
                  <div className="text-text-muted">{'# Step 1: Install Rust via rustup'}</div>
                  <div><span className="text-near-green">curl</span> --proto <span className="text-yellow-300">&apos;=https&apos;</span> --tlsv1.2 -sSf https://sh.rustup.rs | sh</div>
                  <div><span className="text-near-green">source</span> $HOME/.cargo/env</div>
                  <div className="mt-2 text-text-muted">{'# Step 2: Add WebAssembly compilation target'}</div>
                  <div><span className="text-near-green">rustup</span> target add wasm32-unknown-unknown</div>
                  <div className="mt-2 text-text-muted">{'# Step 3: Install Node.js (needed for NEAR CLI)'}</div>
                  <div><span className="text-near-green">curl</span> -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash</div>
                  <div><span className="text-near-green">nvm</span> install --lts</div>
                  <div className="mt-2 text-text-muted">{'# Step 4: Install NEAR CLI and cargo-near'}</div>
                  <div><span className="text-near-green">npm</span> i -g near-cli-rs</div>
                  <div><span className="text-near-green">cargo</span> install cargo-near</div>
                  <div className="mt-2 text-text-muted">{'# Step 5: Scaffold your first project'}</div>
                  <div><span className="text-near-green">cargo</span> near new my-first-contract</div>
                  <div><span className="text-near-green">cd</span> my-first-contract</div>
                  <div className="mt-2 text-text-muted">{'# Step 6: Verify everything works'}</div>
                  <div><span className="text-near-green">rustc</span> --version    <span className="text-text-muted">{'# should show 1.7x+'}</span></div>
                  <div><span className="text-near-green">near</span> --version     <span className="text-text-muted">{'# should show near-cli-rs'}</span></div>
                  <div><span className="text-near-green">cargo</span> near build   <span className="text-text-muted">{'# compiles to .wasm ✓'}</span></div>
                </div>
              </div>

              {/* Pro Tip */}
              <div className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/5 border border-emerald-500/20 rounded-xl p-5">
                <h4 className="font-semibold text-emerald-400 text-sm mb-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" /> Pro Tip
                </h4>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Run <span className="text-emerald-400 font-medium">cargo near build</span> after every setup step to catch issues early.
                  If it fails on the WASM target, run <span className="text-emerald-400 font-medium">rustup target list --installed</span> to
                  verify wasm32-unknown-unknown is present. Also, add <span className="text-emerald-400 font-medium">rust-analyzer.cargo.target:
                  &quot;wasm32-unknown-unknown&quot;</span> to your VS Code settings so the language server analyzes your code
                  against the same target you&apos;re compiling for — this catches platform-specific errors in real time.
                </p>
              </div>

              {/* Concept Cards */}
              <div>
                <h3 className="text-lg font-bold text-text-primary mb-4">🧩 Core Concepts</h3>
                <div className="grid grid-cols-1 gap-4">
                  <ConceptCard
                    icon={Wrench}
                    title="Rust & WASM Target"
                    preview="Install Rust via rustup, then add the wasm32 compilation target"
                    details="Run curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh to install Rust. Then add the WASM target with rustup target add wasm32-unknown-unknown. This target compiles your Rust code into WebAssembly — the binary format that NEAR validators execute on-chain. Without it, cargo near build will fail."
                  />
                  <ConceptCard
                    icon={Terminal}
                    title="NEAR CLI (near-cli-rs)"
                    preview="Your command-line Swiss Army knife for NEAR development"
                    details="Install with npm i -g near-cli-rs. The Rust-based CLI is faster than the legacy JS version and has interactive prompts that guide you through complex operations. Use it to create accounts, deploy contracts, call methods, manage keys, and inspect transactions. Run near --help to explore all subcommands."
                  />
                  <ConceptCard
                    icon={FolderOpen}
                    title="Project Scaffolding"
                    preview="cargo near new creates a complete project template in seconds"
                    details="Run cargo near new my-contract to generate a project with Cargo.toml (dependencies configured), src/lib.rs (contract boilerplate), and tests/ (integration test template). The Cargo.toml includes near-sdk and sets crate-type = ['cdylib'] which tells Rust to produce a dynamic library suitable for WASM compilation."
                  />
                  <ConceptCard
                    icon={Settings}
                    title="VS Code Extensions"
                    preview="Four extensions that transform VS Code into a Rust IDE"
                    details="rust-analyzer provides autocomplete, inline type hints, and real-time error detection. Even Better TOML adds syntax highlighting for Cargo.toml. CodeLLDB enables Rust debugging. Error Lens shows errors inline next to the offending code. Together they catch most mistakes before you even try to compile."
                  />
                  <ConceptCard
                    icon={Zap}
                    title="Testnet Account"
                    preview="Create a free testnet account for development and testing"
                    details="Use near account create-account fund-later use-auto-generation save-to-folder ~/.near-credentials/testnet or visit testnet.mynearwallet.com. Fund it from near-faucet.io with free testnet NEAR. This account is your sandbox — deploy contracts, send transactions, and break things without spending real money."
                  />
                  <ConceptCard
                    icon={GitBranch}
                    title="Git & Version Control"
                    preview="Track changes and collaborate with proper project structure"
                    details="Initialize git in your project with git init, then add a .gitignore that excludes target/, *.wasm, and ~/.near-credentials. Commit after each working milestone. Use branches for experiments — if a contract change breaks things, you can always revert. The cargo near new template already includes a sensible .gitignore to get you started."
                  />
                </div>
              </div>

              {/* Real World Example */}
              <Card variant="glass" padding="lg" className="border-cyan-500/20">
                <h3 className="text-lg font-bold text-text-primary mb-3 flex items-center gap-2">
                  <Rocket className="w-5 h-5 text-cyan-400" /> Real World Example
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed mb-3">
                  Here&apos;s a typical workflow after setup is complete. You scaffold a project, write your contract,
                  build the WASM binary, deploy to testnet, and call methods — all from the terminal. This is the
                  loop you&apos;ll repeat hundreds of times during development.
                </p>
                <div className="bg-black/40 rounded-lg p-3 font-mono text-xs text-text-secondary border border-border">
                  <div><span className="text-text-muted">{'# Create and build'}</span></div>
                  <div><span className="text-near-green">cargo</span> near new token-contract</div>
                  <div><span className="text-near-green">cd</span> token-contract</div>
                  <div><span className="text-text-muted">{'# ... edit src/lib.rs ...'}</span></div>
                  <div><span className="text-near-green">cargo</span> near build</div>
                  <div className="mt-1"><span className="text-text-muted">{'# Deploy to your testnet account'}</span></div>
                  <div><span className="text-near-green">near</span> contract deploy myaccount.testnet \</div>
                  <div>  use-file ./target/near/token_contract.wasm</div>
                  <div className="mt-1"><span className="text-text-muted">{'# Call a method to verify it works'}</span></div>
                  <div><span className="text-near-green">near</span> contract call-function as-transaction \</div>
                  <div>  myaccount.testnet set_greeting \</div>
                  <div>  json-args <span className="text-yellow-300">&apos;{'{'}&quot;greeting&quot;:&quot;Hello NEAR!&quot;{'}'}&apos;</span></div>
                </div>
              </Card>

              {/* Security Gotcha */}
              <Card variant="default" padding="md" className="border-red-500/20 bg-red-500/5">
                <h4 className="font-semibold text-red-400 mb-2">⚠️ Security Gotcha</h4>
                <ul className="space-y-1 text-sm text-text-secondary">
                  <li>• Never pipe install scripts to sh without reviewing them first — check rustup.rs and nvm.sh are legit</li>
                  <li>• Store credentials in ~/.near-credentials, not in your project repo — add it to .gitignore</li>
                  <li>• Don&apos;t mix testnet and mainnet credentials in the same directory — use separate folders</li>
                  <li>• Keep your Rust toolchain updated — run rustup update regularly for security patches</li>
                </ul>
              </Card>

              {/* Mini Quiz */}
              <MiniQuiz />

              {/* Key Takeaways */}
              <Card variant="glass" padding="lg" className="border-emerald-500/20">
                <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  Key Takeaways
                </h3>
                <ul className="space-y-2">
                  {[
                    'Install in order: Rust → wasm32 target → Node.js → near-cli-rs → cargo-near → VS Code extensions.',
                    'The wasm32-unknown-unknown target is what makes Rust compile to WebAssembly for NEAR.',
                    'cargo near new gives you a complete project template — don\'t start from scratch.',
                    'Create a testnet account with free tokens to experiment safely before touching mainnet.',
                  ].map((point, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                      <span className="text-near-green mt-0.5 font-bold">→</span>
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
                    : 'bg-near-green/10 text-near-green border border-near-green/30 hover:bg-near-green/20'
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

export default DevEnvironmentSetup;
