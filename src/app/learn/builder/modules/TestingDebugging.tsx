'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import {
  ChevronDown, ChevronUp, BookOpen, Clock, CheckCircle2,
  Lightbulb, Zap, TestTube, ArrowRight, Bug, Play, FileSearch,
  Rocket,
} from 'lucide-react';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface TestingDebuggingProps {
  isActive: boolean;
  onToggle?: () => void;
}

// ─── Interactive Visual: Testing Pyramid ───────────────────────────────────────

const testLayers = [
  { id: 'unit', label: 'Unit', desc: '#[cfg(test)] — fast, local, no blockchain needed. Test pure logic: math, validation, state transitions. Runs in milliseconds with cargo test.', icon: '⚡', color: 'from-emerald-500/20 to-emerald-500/10', border: 'border-emerald-500/30' },
  { id: 'integration', label: 'Integration', desc: 'near-workspaces sandbox — real chain simulation. Deploy .wasm, create accounts, test cross-contract calls with actual gas costs.', icon: '🧪', color: 'from-blue-500/20 to-blue-500/10', border: 'border-blue-500/30' },
  { id: 'testnet', label: 'Testnet', desc: 'Deploy to testnet — real network, free tokens. Test with real wallets, real RPC, real block times. Use near-cli: near deploy.', icon: '🌐', color: 'from-purple-500/20 to-purple-500/10', border: 'border-purple-500/30' },
  { id: 'debug', label: 'Debug', desc: 'env::log_str() + transaction receipts + NearBlocks. Trace execution across receipts, inspect gas usage per action, and read log output.', icon: '🔍', color: 'from-orange-500/20 to-orange-500/10', border: 'border-orange-500/30' },
  { id: 'audit', label: 'Audit', desc: 'Security review checklist before mainnet deploy. Check access control, overflow handling, reentrancy guards, storage management, and upgrade paths.', icon: '🛡️', color: 'from-red-500/20 to-red-500/10', border: 'border-red-500/30' },
  { id: 'monitor', label: 'Monitor', desc: 'Post-deploy observability — track contract usage, error rates, and gas consumption via indexer or NEAR Lake. Set alerts for anomalies.', icon: '📊', color: 'from-yellow-500/20 to-yellow-500/10', border: 'border-yellow-500/30' },
];

function TestingPyramid() {
  const [activeLayer, setActiveLayer] = useState<number | null>(null);

  return (
    <div className="relative py-4">
      <div className="flex items-center justify-between gap-1">
        {testLayers.map((layer, i) => (
          <React.Fragment key={layer.id}>
            <motion.div
              className={cn(
                'flex-1 cursor-pointer rounded-lg border p-3 transition-all text-center',
                layer.border,
                activeLayer === i ? `bg-gradient-to-b ${layer.color}` : 'bg-black/20'
              )}
              whileHover={{ scale: 1.05, y: -4 }}
              onClick={() => setActiveLayer(activeLayer === i ? null : i)}
            >
              <div className="text-xl mb-1">{layer.icon}</div>
              <div className="text-xs font-bold text-text-primary">{layer.label}</div>
            </motion.div>
            {i < testLayers.length - 1 && (
              <ArrowRight className="w-4 h-4 text-text-muted/40 flex-shrink-0" />
            )}
          </React.Fragment>
        ))}
      </div>
      <AnimatePresence>
        {activeLayer !== null && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-4 bg-black/30 rounded-lg p-3 border border-border">
              <code className="text-sm text-near-green font-mono">{testLayers[activeLayer].desc}</code>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <p className="text-center text-xs text-text-muted mt-4">
        👆 Click each layer to explore the testing pipeline
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
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500/20 to-red-500/20 border border-pink-500/20 flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-pink-400" />
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
    'Unit tests with #[cfg(test)] — they simulate the full blockchain environment',
    'Integration tests with near-workspaces — they spin up a real sandbox blockchain',
    'Console.log statements in the frontend JavaScript code',
    'Deploying directly to mainnet and checking NearBlocks for errors',
  ];
  return (
    <Card variant="glass" padding="lg">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-near-green" />
        <h4 className="font-bold text-text-primary">Quick Check</h4>
      </div>
      <p className="text-text-secondary mb-4">Which testing approach lets you test cross-contract calls with real blockchain behavior?</p>
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
              ? '✓ Correct! near-workspaces spins up a local sandbox that behaves like the real NEAR blockchain — perfect for testing cross-contract calls, gas, and storage.'
              : '✗ Not quite. Unit tests are great for logic but can\'t simulate cross-contract calls. near-workspaces provides a real sandbox blockchain for full integration testing.'}
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

// ─── Main Module ───────────────────────────────────────────────────────────────

const TestingDebugging: React.FC<TestingDebuggingProps> = ({ isActive, onToggle }) => {
  const [completed, setCompleted] = useState(false);

  const handleComplete = () => {
    const progress = JSON.parse(localStorage.getItem('voidspace-builder-progress') || '{}');
    progress['testing-debugging'] = true;
    localStorage.setItem('voidspace-builder-progress', JSON.stringify(progress));
    setCompleted(true);
  };

  return (
    <Card variant="glass" padding="none" className="border-pink-500/20">
      {/* ── Accordion Header ── */}
      <div
        onClick={() => {}} style={{display:"none"}}
        className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
            <TestTube className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Testing &amp; Debugging</h3>
            <p className="text-text-muted text-sm">Unit tests, integration tests, and sandbox testing with near-workspaces</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-pink-500/10 text-pink-400 border-pink-500/20">Builder</Badge>
          <Badge className="bg-purple-500/10 text-purple-300 border-purple-500/20">50 min</Badge>
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
            <div className="border-t border-pink-500/20 p-6 space-y-8">
              {/* Module Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-pink-500/20 bg-pink-500/5 text-xs text-pink-400">
                <BookOpen className="w-3 h-3" />
                Module 12 of 27
                <span className="text-text-muted">•</span>
                <Clock className="w-3 h-3" />
                50 min read
              </div>

              {/* The Big Idea */}
              <Card variant="glass" padding="lg" className="border-pink-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500/20 to-red-500/20 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-pink-400" />
                  </div>
                  <h2 className="text-xl font-bold text-text-primary">The Big Idea</h2>
                </div>
                <p className="text-text-secondary leading-relaxed">
                  Think of testing like a <span className="text-pink-400 font-medium">flight simulator</span>.
                  Unit tests are the <span className="text-pink-400 font-medium">instrument checks</span> — quick, focused, verifying each gauge works.
                  Integration tests are <span className="text-pink-400 font-medium">full flight simulations</span> — the sandbox blockchain runs your contract exactly like mainnet.
                  You wouldn&apos;t fly passengers without simulator hours. Don&apos;t deploy contracts without test hours.
                </p>
              </Card>

              {/* Interactive Visual */}
              <div>
                <h3 className="text-lg font-bold text-text-primary mb-2">🧪 Testing Pipeline</h3>
                <p className="text-sm text-text-muted mb-4">From fast local checks to full deployment — click each stage to see what it covers.</p>
                <TestingPyramid />
              </div>

              {/* Pro Tip: CI/CD */}
              <div className="bg-gradient-to-r from-pink-500/10 to-red-500/5 border border-pink-500/20 rounded-xl p-5">
                <h4 className="font-semibold text-pink-400 text-sm mb-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" /> Pro Tip
                </h4>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Automate your testing pipeline with GitHub Actions. Run cargo test (unit tests) on every
                  push, and near-workspaces integration tests on every PR. Add a cargo clippy step for lint
                  warnings and cargo audit for dependency vulnerabilities. Gate your mainnet deploys behind
                  a &quot;all tests pass&quot; requirement — never merge red builds. For bonus points, add a
                  gas regression check that compares gas usage against the previous commit and flags increases
                  above a threshold.
                </p>
              </div>

              {/* Concept Cards */}
              <div>
                <h3 className="text-lg font-bold text-text-primary mb-4">🧩 Core Concepts</h3>
                <div className="grid grid-cols-1 gap-4">
                  <ConceptCard
                    icon={Play}
                    title="Unit Testing"
                    preview="Fast, local tests for pure contract logic"
                    details="Use #[cfg(test)] mod tests with VMContextBuilder to set up fake blockchain context. Test default state, method behavior, and edge cases. Unit tests run with cargo test in milliseconds — no blockchain needed. Set predecessor_account_id, attached_deposit, and block_timestamp to simulate different callers and conditions."
                  />
                  <ConceptCard
                    icon={TestTube}
                    title="Integration Testing"
                    preview="Real sandbox blockchain with near-workspaces"
                    details="near-workspaces-rs spins up a local NEAR sandbox. Deploy your compiled .wasm, create test accounts with dev_create_account(), call methods with .transact(), and verify results with .view(). This tests real gas costs, storage staking, cross-contract calls, and serialization — everything unit tests can&apos;t cover."
                  />
                  <ConceptCard
                    icon={Bug}
                    title="Common Errors & Fixes"
                    preview="Decode cryptic blockchain errors fast"
                    details="&apos;Exceeded prepaid gas&apos; → increase gas (complex ops need 100-300 Tgas). &apos;Cannot deserialize contract state&apos; → schema changed between deploys, add migration logic. &apos;MethodNotFound&apos; → check spelling and that the method is pub. &apos;Borsh serialization error&apos; → JSON args don&apos;t match Rust types. Always read the full error — NEAR errors are descriptive."
                  />
                  <ConceptCard
                    icon={FileSearch}
                    title="Transaction Debugging"
                    preview="Use logs and receipts to trace execution"
                    details="Add log!() or env::log_str() calls in your contract to emit debug info. In integration tests, check result.logs() after transact(). On testnet, use NearBlocks.io to inspect transaction receipts, see which methods were called, read log output, and trace cross-contract call chains. Every receipt shows gas used and status."
                  />
                  <ConceptCard
                    icon={Zap}
                    title="Test-Driven Development"
                    preview="Write the test first, then make it pass"
                    details="Define expected behavior as a test before writing contract code. Test edge cases: zero amounts, empty strings, unauthorized callers, maximum values. Use #[should_panic(expected = &quot;message&quot;)] for expected failures. Run cargo test on every change — it catches regressions instantly. Integration tests catch what unit tests miss."
                  />
                  <ConceptCard
                    icon={Rocket}
                    title="Gas Profiling & Optimization"
                    preview="Measure and reduce gas consumption during testing"
                    details="Every near-workspaces transaction returns gas_burnt in the outcome. Log it during tests to catch regressions. Common optimizations: use LookupMap instead of UnorderedMap when you don&apos;t need iteration, batch storage writes, avoid unnecessary deserialization with env::storage_read(). Profile before and after changes — a 10% gas reduction at scale saves real NEAR. Use the NEAR Gas Profiler to visualize where Tgas goes across receipts."
                  />
                </div>
              </div>

              {/* Real World Example: near-workspaces Integration Test */}
              <Card variant="glass" padding="lg" className="border-pink-500/20">
                <h3 className="text-lg font-bold text-text-primary mb-3 flex items-center gap-2">
                  <Rocket className="w-5 h-5 text-pink-400" /> Real World Example
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed mb-3">
                  A complete integration test using near-workspaces that deploys a contract, creates test accounts, and verifies behavior.
                </p>
                <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-text-secondary border border-border overflow-x-auto">
                  <pre className="whitespace-pre leading-relaxed">{`// tests/integration.rs
use near_workspaces::{Account, Contract};
use serde_json::json;

#[tokio::test]
async fn test_greeting_contract() -> anyhow::Result<()> {
    // 1. Spin up sandbox and deploy contract
    let worker = near_workspaces::sandbox().await?;
    let wasm = std::fs::read("./target/near/contract.wasm")?;
    let contract = worker.dev_deploy(&wasm).await?;

    // 2. Initialize the contract
    contract
        .call("new")
        .args_json(json!({ "owner_id": contract.id() }))
        .transact()
        .await?
        .into_result()?;

    // 3. Create a test user account
    let alice = worker.dev_create_account().await?;

    // 4. Call a change method as Alice
    let result = alice
        .call(contract.id(), "set_greeting")
        .args_json(json!({ "greeting": "Hello NEAR!" }))
        .deposit(near_workspaces::types::NearToken::from_yoctonear(1))
        .transact()
        .await?;

    // 5. Check logs for debug output
    println!("Logs: {:?}", result.logs());
    println!("Gas burnt: {} TGas",
        result.total_gas_burnt.as_tgas());

    // 6. Verify state with a view call
    let greeting: String = contract
        .view("get_greeting")
        .args_json(json!({}))
        .await?
        .json()?;

    assert_eq!(greeting, "Hello NEAR!");

    // 7. Test unauthorized access (should panic)
    let bob = worker.dev_create_account().await?;
    let fail = bob
        .call(contract.id(), "admin_only_method")
        .transact()
        .await?;
    assert!(fail.is_failure());

    Ok(())
}`}</pre>
                </div>
              </Card>

              {/* Security Gotcha */}
              <Card variant="default" padding="md" className="border-red-500/30 bg-red-500/5">
                <h4 className="font-semibold text-red-400 mb-2">⚠️ Testing Gotcha</h4>
                <ul className="space-y-1 text-sm text-text-secondary">
                  <li>• Unit tests DON&apos;T test real gas costs — a method that passes unit tests can still run out of gas on-chain</li>
                  <li>• VMContextBuilder doesn&apos;t simulate cross-contract calls — use near-workspaces for anything involving Promises</li>
                  <li>• Testnet state persists between deploys — redeploy to a fresh account to avoid &quot;Cannot deserialize&quot; errors</li>
                  <li>• Integration tests need the compiled .wasm — run cargo near build before cargo test on integration tests</li>
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
                    'Unit tests (#[cfg(test)]) are fast and test logic — use VMContextBuilder to simulate callers and deposits.',
                    'Integration tests (near-workspaces) test real blockchain behavior — gas, storage, cross-contract calls.',
                    'Use log!() in contracts and result.logs() in tests to debug execution flow.',
                    'Write tests FIRST — if you can\'t test it, you can\'t trust it on mainnet.',
                    'Profile gas usage in integration tests to catch regressions before they cost real NEAR.',
                  ].map((point, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                      <span className="text-emerald-400 mt-0.5 font-bold">→</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Mark Complete */}
              <motion.button
                onClick={handleComplete}
                disabled={completed}
                whileHover={{ scale: completed ? 1 : 1.02 }}
                whileTap={{ scale: completed ? 1 : 0.98 }}
                className={cn(
                  'w-full py-3 rounded-lg font-semibold text-sm transition-all',
                  completed
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default'
                    : 'bg-pink-500/20 text-pink-400 border border-pink-500/30 hover:bg-pink-500/30'
                )}
              >
                {completed ? '✓ Module Completed' : 'Mark as Complete'}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default TestingDebugging;
