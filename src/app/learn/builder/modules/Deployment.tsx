'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import {
  ChevronDown, ChevronUp, BookOpen, Clock, CheckCircle2,
  Lightbulb, Zap, Rocket, Server, Globe, Settings, Shield,
} from 'lucide-react';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface DeploymentProps {
  isActive: boolean;
  onToggle?: () => void;
}

// ─── Interactive Visual: Deployment Pipeline ───────────────────────────────────

const pipelineStages = [
  {
    id: 'build',
    label: 'Build',
    icon: '🔨',
    color: 'from-blue-500 to-cyan-500',
    borderColor: 'border-blue-500/40',
    bgColor: 'bg-blue-500/10',
    textColor: 'text-blue-400',
    desc: 'Compile your Rust smart contract to WebAssembly (WASM). Run `cargo near build` to produce an optimized .wasm binary in target/near/. The compiler checks types, lifetimes, and NEAR SDK annotations.',
  },
  {
    id: 'deploy',
    label: 'Deploy',
    icon: '🚀',
    color: 'from-green-500 to-emerald-500',
    borderColor: 'border-green-500/40',
    bgColor: 'bg-green-500/10',
    textColor: 'text-green-400',
    desc: 'Upload the WASM binary to a NEAR account. The contract code is stored on-chain and the account becomes a smart contract. Use `near contract deploy` with your compiled .wasm file.',
  },
  {
    id: 'init',
    label: 'Init',
    icon: '⚡',
    color: 'from-yellow-500 to-orange-500',
    borderColor: 'border-yellow-500/40',
    bgColor: 'bg-yellow-500/10',
    textColor: 'text-yellow-400',
    desc: 'Call the initialization method (#[init]) to set up the contract state. This is a one-time call that configures owner, parameters, and initial data. Without it, contracts using PanicOnDefault will reject all calls.',
  },
  {
    id: 'verify',
    label: 'Verify',
    icon: '✅',
    color: 'from-purple-500 to-pink-500',
    borderColor: 'border-purple-500/40',
    bgColor: 'bg-purple-500/10',
    textColor: 'text-purple-400',
    desc: 'Confirm the deployment was successful. Check the WASM hash on NearBlocks, call view methods to verify responses, execute a test transaction, and review access keys. Always verify before announcing your launch.',
  },
];

function DeploymentPipeline() {
  const [activeStage, setActiveStage] = useState<string | null>(null);

  return (
    <div className="py-4">
      <div className="flex items-center justify-between gap-2 mb-4">
        {pipelineStages.map((stage, i) => (
          <React.Fragment key={stage.id}>
            <motion.div
              className={cn(
                'flex-1 rounded-lg border p-3 cursor-pointer transition-all text-center',
                activeStage === stage.id
                  ? `${stage.borderColor} ${stage.bgColor}`
                  : 'border-border bg-black/20 hover:border-border-hover'
              )}
              onClick={() => setActiveStage(activeStage === stage.id ? null : stage.id)}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              <div className="text-2xl mb-1">{stage.icon}</div>
              <div className={cn(
                'text-xs font-semibold',
                activeStage === stage.id ? stage.textColor : 'text-text-muted'
              )}>
                {stage.label}
              </div>
            </motion.div>
            {i < pipelineStages.length - 1 && (
              <motion.div
                className="text-text-muted text-xs"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
              >
                →
              </motion.div>
            )}
          </React.Fragment>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {activeStage && (
          <motion.div
            key={activeStage}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            {pipelineStages
              .filter((s) => s.id === activeStage)
              .map((stage) => (
                <div
                  key={stage.id}
                  className={cn(
                    'rounded-lg border p-4 text-sm leading-relaxed',
                    stage.borderColor, stage.bgColor
                  )}
                >
                  <span className={cn('font-semibold', stage.textColor)}>
                    {stage.label}:
                  </span>{' '}
                  <span className="text-text-secondary">{stage.desc}</span>
                </div>
              ))}
          </motion.div>
        )}
      </AnimatePresence>
      <p className="text-center text-xs text-text-muted mt-3">
        👆 Click each stage to see what happens
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
    <Card
      variant="glass"
      padding="md"
      className="cursor-pointer"
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500/20 to-lime-500/20 border border-green-500/20 flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-green-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-semibold text-text-primary">{title}</h4>
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
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
    'The contract works normally with default values',
    'The contract panics on every method call if it uses #[derive(PanicOnDefault)]',
    'The contract automatically initializes itself on the first transaction',
    'The deploy transaction itself will fail and be reverted',
  ];

  return (
    <Card variant="glass" padding="lg">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-near-green" />
        <h4 className="font-bold text-text-primary">Quick Check</h4>
      </div>
      <p className="text-text-secondary mb-4">
        What happens if you deploy a contract with <code className="text-green-400 bg-green-500/10 px-1 rounded">#[init]</code> but don&apos;t call the init method?
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
              ? '✓ Correct! When a contract derives PanicOnDefault, any method call before initialization will panic with "The contract is not initialized". The deploy itself succeeds, but the contract is unusable until you call the #[init] method.'
              : '✗ Not quite. The deploy succeeds fine — the WASM uploads to the account. But if the contract uses #[derive(PanicOnDefault)], every subsequent method call will panic until you explicitly call the init function. The contract does NOT auto-initialize.'}
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

// ─── Main Module ───────────────────────────────────────────────────────────────

const Deployment: React.FC<DeploymentProps> = ({ isActive, onToggle }) => {
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const progress = JSON.parse(localStorage.getItem('voidspace-builder-progress') || '{}');
      if (progress['deployment']) setCompleted(true);
    }
  }, []);

  const handleComplete = () => {
    if (typeof window !== 'undefined') {
      const progress = JSON.parse(localStorage.getItem('voidspace-builder-progress') || '{}');
      progress['deployment'] = true;
      localStorage.setItem('voidspace-builder-progress', JSON.stringify(progress));
      setCompleted(true);
    }
  };

  return (
    <Card variant="glass" padding="none" className="border-green-500/20">
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
              : 'bg-gradient-to-br from-green-500 to-lime-500'
          )}>
            {completed ? <CheckCircle2 className="w-6 h-6 text-white" /> : <Rocket className="w-6 h-6 text-white" />}
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Deployment</h3>
            <p className="text-text-muted text-sm">Deploy to testnet and mainnet with confidence</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {completed && (
            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">✓ Complete</Badge>
          )}
          <Badge className="bg-warning/10 text-warning border-warning/20">Intermediate</Badge>
          <Badge className="bg-purple-500/10 text-purple-300 border-purple-500/20">40 min</Badge>
          {isActive ? (
            <ChevronUp className="w-5 h-5 text-text-muted" />
          ) : (
            <ChevronDown className="w-5 h-5 text-text-muted" />
          )}
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
            <div className="border-t border-green-500/20 p-6 space-y-8">
              {/* Module Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-green-500/20 bg-green-500/5 text-xs text-green-400">
                <BookOpen className="w-3 h-3" />
                Module 19 of 27
                <span className="text-text-muted">•</span>
                <Clock className="w-3 h-3" />
                40 min read
              </div>

              {/* The Big Idea */}
              <Card variant="glass" padding="lg" className="border-green-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500/20 to-lime-500/20 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-green-400" />
                  </div>
                  <h2 className="text-xl font-bold text-text-primary">The Big Idea</h2>
                </div>
                <p className="text-text-secondary leading-relaxed">
                  Think of deploying a smart contract like{' '}
                  <span className="text-green-400 font-medium">launching a satellite</span>.
                  You build it carefully in the lab (<code className="text-green-400">cargo near build</code>),
                  test it in a simulator (testnet), then launch it into orbit (mainnet). Once in
                  orbit you can still send commands (call methods), but you can&apos;t physically
                  grab it back. If you forgot to flip a switch during initialization, your
                  satellite just floats there useless. That&apos;s why the{' '}
                  <span className="text-green-400 font-medium">Build → Deploy → Init → Verify</span>{' '}
                  pipeline matters — each stage catches mistakes before they become permanent.
                </p>
              </Card>

              {/* Interactive Visual */}
              <div>
                <h3 className="text-lg font-bold text-text-primary mb-2">
                  🚀 Deployment Pipeline
                </h3>
                <p className="text-sm text-text-muted mb-4">
                  Follow the four stages every NEAR contract goes through from code to production.
                </p>
                <DeploymentPipeline />
              </div>

              {/* Testnet vs Mainnet */}
              <div>
                <h3 className="text-lg font-bold text-text-primary mb-3 flex items-center gap-2">
                  <Server className="w-5 h-5 text-blue-400" />
                  Testnet vs Mainnet
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Card variant="default" padding="md" className="border-blue-500/20">
                    <h5 className="font-semibold text-blue-400 text-sm mb-2">🧪 Testnet</h5>
                    <ul className="text-xs text-text-muted space-y-1">
                      <li>• Free tokens from faucet</li>
                      <li>• Accounts: <code className="text-green-400">*.testnet</code></li>
                      <li>• RPC: rpc.testnet.near.org</li>
                      <li>• Explorer: testnet.nearblocks.io</li>
                      <li>• Deploy freely, break things, learn</li>
                    </ul>
                  </Card>
                  <Card variant="default" padding="md" className="border-green-500/20">
                    <h5 className="font-semibold text-green-400 text-sm mb-2">🚀 Mainnet</h5>
                    <ul className="text-xs text-text-muted space-y-1">
                      <li>• Real NEAR tokens (real money)</li>
                      <li>• Accounts: <code className="text-green-400">*.near</code></li>
                      <li>• RPC: rpc.mainnet.near.org</li>
                      <li>• Explorer: nearblocks.io</li>
                      <li>• Test thoroughly first, deploy carefully</li>
                    </ul>
                  </Card>
                </div>
              </div>

              {/* Code Example: Deploy Script */}
              <div>
                <h3 className="text-lg font-bold text-text-primary mb-3">💻 Deployment Script</h3>
                <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border overflow-x-auto">
                  <div className="text-text-muted">#!/bin/bash</div>
                  <div className="text-text-muted"># deploy.sh — Build, deploy, and verify in one step</div>
                  <div className="mt-2">NETWORK=${'{'}1:-testnet{'}'}</div>
                  <div>CONTRACT_ACCOUNT=<span className="text-yellow-300">&quot;myapp.$NETWORK&quot;</span></div>
                  <div className="mt-2 text-text-muted"># Step 1: Build the contract</div>
                  <div><span className="text-near-green">echo</span> <span className="text-yellow-300">&quot;🔨 Building contract...&quot;</span></div>
                  <div><span className="text-near-green">cargo near build</span></div>
                  <div className="mt-2 text-text-muted"># Step 2: Deploy with initialization</div>
                  <div><span className="text-near-green">echo</span> <span className="text-yellow-300">&quot;🚀 Deploying to $CONTRACT_ACCOUNT...&quot;</span></div>
                  <div><span className="text-near-green">near contract deploy $CONTRACT_ACCOUNT \</span></div>
                  <div><span className="text-near-green">  use-file ./target/near/my_contract.wasm \</span></div>
                  <div><span className="text-near-green">  with-init-call new \</span></div>
                  <div><span className="text-near-green">  json-args &apos;{'{&quot;owner_id&quot;: &quot;&apos;$CONTRACT_ACCOUNT&apos;&quot;}'}&apos; \</span></div>
                  <div><span className="text-near-green">  prepaid-gas &apos;100 Tgas&apos; attached-deposit &apos;0 NEAR&apos; \</span></div>
                  <div><span className="text-near-green">  network-config $NETWORK sign-with-keychain send</span></div>
                  <div className="mt-2 text-text-muted"># Step 3: Verify deployment</div>
                  <div><span className="text-near-green">echo</span> <span className="text-yellow-300">&quot;✅ Verifying...&quot;</span></div>
                  <div><span className="text-near-green">near contract call-function as-read-only \</span></div>
                  <div><span className="text-near-green">  $CONTRACT_ACCOUNT get_greeting json-args &apos;{'{}'}&apos; \</span></div>
                  <div><span className="text-near-green">  network-config $NETWORK now</span></div>
                </div>
              </div>

              {/* Pro Tip */}
              <div className="bg-gradient-to-r from-green-500/10 to-lime-500/5 border border-green-500/20 rounded-xl p-5">
                <h4 className="font-semibold text-green-400 text-sm mb-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" /> Pro Tip
                </h4>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Always deploy to a <span className="text-green-400 font-medium">sub-account</span> rather than your main account.
                  Deploy to <code className="text-green-400 bg-green-500/10 px-1 rounded">contract.myapp.near</code> instead of{' '}
                  <code className="text-green-400 bg-green-500/10 px-1 rounded">myapp.near</code>. This keeps your main account
                  clean for managing keys and funds, while the sub-account is dedicated to the contract. If you ever need to
                  redeploy a completely new contract, you can create a new sub-account like{' '}
                  <code className="text-green-400 bg-green-500/10 px-1 rounded">v2.myapp.near</code> without losing access to
                  anything on the original.
                </p>
              </div>

              {/* Concept Cards */}
              <div>
                <h3 className="text-lg font-bold text-text-primary mb-4">🧩 Core Concepts</h3>
                <div className="grid grid-cols-1 gap-4">
                  <ConceptCard
                    icon={Settings}
                    title="Initialization Patterns"
                    preview="Choose between Default trait and #[init] methods for contract setup"
                    details="Pattern 1: Implement the Default trait — the contract auto-initializes with default values on first use. Deploy with `without-init-call`. Pattern 2: Use #[init] with #[derive(PanicOnDefault)] — the contract MUST be explicitly initialized before any method call works. Use this when you need constructor parameters like owner_id or configuration values. The init method can only be called once — subsequent calls panic."
                  />
                  <ConceptCard
                    icon={Globe}
                    title="Frontend Configuration"
                    preview="Connect your UI to the correct network with environment variables"
                    details="Use separate .env files for each network: .env.development points to testnet, .env.production points to mainnet. Key variables: NEXT_PUBLIC_NETWORK_ID (testnet/mainnet), NEXT_PUBLIC_CONTRACT_ID (myapp.testnet/myapp.near). Your wallet selector and RPC calls automatically route to the right network. Deploy frontend to Vercel or Netlify with the production env vars set in the dashboard."
                  />
                  <ConceptCard
                    icon={Shield}
                    title="Access Key Management"
                    preview="Secure your deployed contract by managing Full Access keys"
                    details="After deployment, review your contract account's keys. Remove unnecessary Full Access keys for production contracts to prevent unauthorized code changes. Keep at least one Full Access key if you plan to upgrade. For maximum trust, delete ALL Full Access keys to make the contract permanently immutable — users can verify no one can change the code. Use `near account list-keys` to audit."
                  />
                  <ConceptCard
                    icon={Server}
                    title="CI/CD Automation"
                    preview="Automate deployments with GitHub Actions for consistent releases"
                    details="Set up a GitHub Actions workflow that builds and deploys on every push to main. Store your NEAR credentials as GitHub Secrets. The workflow runs cargo near build, then deploys to testnet on PR merges and to mainnet on tagged releases. This eliminates manual deploy errors and creates an audit trail of every deployment. Use the near-cli-rs Docker image for reproducible builds."
                  />
                </div>
              </div>

              {/* Common Mistakes */}
              <Card variant="default" padding="md" className="border-orange-500/20 bg-orange-500/5">
                <h4 className="font-semibold text-orange-400 mb-2">⚠️ Common Mistakes</h4>
                <ul className="space-y-1 text-sm text-text-secondary">
                  <li>• Deploying to mainnet before thorough testnet testing — real NEAR is at stake</li>
                  <li>• Forgetting to call the init method after deploying a contract that requires initialization</li>
                  <li>• Using <code className="text-orange-400">without-init-call</code> on a contract that has <code className="text-orange-400">#[derive(PanicOnDefault)]</code></li>
                  <li>• Not verifying the WASM hash on NearBlocks after deployment</li>
                  <li>• Leaving Full Access keys on production contracts that should be locked</li>
                  <li>• Hardcoding testnet contract IDs in frontend code instead of using environment variables</li>
                </ul>
              </Card>

              {/* Mini Quiz */}
              <MiniQuiz />

              {/* Key Takeaways */}
              <Card variant="glass" padding="lg" className="border-green-500/20">
                <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-near-green" />
                  Key Takeaways
                </h3>
                <ul className="space-y-2">
                  {[
                    'The deployment pipeline is Build → Deploy → Init → Verify — each stage catches different failure modes',
                    'Always test on testnet before mainnet — testnet tokens are free, mainnet mistakes cost real money',
                    'Use #[init] with PanicOnDefault when you need constructor parameters; use Default when the contract can self-initialize',
                    'Deploy to sub-accounts (contract.myapp.near) to keep your main account clean and enable versioned upgrades',
                    'Verify every deployment: check WASM hash, call view methods, test a transaction, audit access keys',
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

export default Deployment;
