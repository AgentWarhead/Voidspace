'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ExternalLink, CheckCircle, ShieldCheck, FlaskConical, Bug, ScanSearch, FileCheck, Binary } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

interface FormalVerificationProps {
  isActive: boolean;
  onToggle: () => void;
}

const FormalVerification: React.FC<FormalVerificationProps> = ({ isActive, onToggle }) => {
  const [selectedTab, setSelectedTab] = useState<string>('overview');

  return (
    <Card variant="glass" padding="none" className="border-purple-500/20">
      <div
        onClick={onToggle}
        className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Formal Verification</h3>
            <p className="text-text-muted text-sm">Property testing, invariants, model checking, and symbolic execution for smart contracts</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-yellow-500/10 text-yellow-300 border-yellow-500/20">Expert</Badge>
          <Badge className="bg-purple-500/10 text-purple-300 border-purple-500/20">75 min</Badge>
          {isActive ? <ChevronUp className="w-5 h-5 text-text-muted" /> : <ChevronDown className="w-5 h-5 text-text-muted" />}
        </div>
      </div>

      {isActive && (
        <div className="border-t border-purple-500/20 p-6">
          <div className="flex gap-2 mb-6 border-b border-border">
            {['overview', 'learn', 'practice', 'resources'].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={cn(
                  'px-4 py-2 font-medium transition-colors text-sm',
                  selectedTab === tab
                    ? 'text-purple-400 border-b-2 border-purple-500'
                    : 'text-text-muted hover:text-text-secondary'
                )}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="space-y-6">
            {selectedTab === 'overview' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="w-5 h-5 text-red-400" />
                  <h4 className="text-lg font-semibold text-text-primary">What You&apos;ll Learn</h4>
                </div>
                <ul className="space-y-3">
                  {[
                    'What formal verification means for smart contracts and why testing isn\'t enough',
                    'Property-based testing with proptest: generating thousands of random test cases',
                    'Invariant testing patterns for stateful smart contract validation',
                    'Model checking approaches: exhaustively verifying all possible states',
                    'Symbolic execution tools: KLEE, Manticore, and their application to Rust/WASM',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-text-secondary">
                      <CheckCircle className="w-4 h-4 text-near-green mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Card variant="default" padding="md" className="mt-4 border-red-500/20 bg-red-500/5">
                  <p className="text-sm text-text-secondary">
                    <span className="text-red-400 font-semibold">Why this matters:</span> Smart contracts are immutable and handle real money. A single bug can drain millions. Formal verification provides mathematical guarantees that your contract behaves correctly under all possible inputs — not just the test cases you thought of.
                  </p>
                </Card>
              </div>
            )}

            {selectedTab === 'learn' && (
              <div className="space-y-8">
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <FlaskConical className="w-5 h-5 text-red-400" />
                    Beyond Unit Tests
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Traditional testing checks specific inputs against expected outputs. Formal verification proves properties hold for all possible inputs. Here&apos;s the verification spectrum:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card variant="default" padding="md" className="border-red-500/20">
                      <h5 className="font-semibold text-red-400 text-sm mb-2">Testing Limitations</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• Unit tests: specific input → expected output</li>
                        <li>• Integration tests: happy paths + known edge cases</li>
                        <li>• Only catches bugs you anticipate</li>
                        <li>• Can&apos;t cover infinite input space</li>
                        <li>• &quot;Testing shows bugs exist, not their absence&quot;</li>
                      </ul>
                    </Card>
                    <Card variant="default" padding="md" className="border-pink-500/20">
                      <h5 className="font-semibold text-pink-400 text-sm mb-2">Formal Verification</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• Property testing: random inputs, verify invariants</li>
                        <li>• Model checking: explore all reachable states</li>
                        <li>• Symbolic execution: analyze all execution paths</li>
                        <li>• Theorem proving: mathematical correctness proofs</li>
                        <li>• Catches bugs you never imagined</li>
                      </ul>
                    </Card>
                  </div>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Bug className="w-5 h-5 text-orange-400" />
                    Property-Based Testing with proptest
                  </h4>
                  <p className="text-text-secondary mb-3">
                    proptest generates thousands of random inputs and checks that properties always hold. When it finds a failure, it automatically shrinks to the minimal failing case.
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-text-secondary border border-border">
                    <div className="text-orange-400 mb-2">{'// Rust: Property-based testing for a token contract'}</div>
                    <div className="text-near-green">{'use proptest::prelude::*;'}</div>
                    <div className="mt-1 text-near-green">{'proptest! {'}</div>
                    <div className="text-near-green">{'    #[test]'}</div>
                    <div className="text-near-green">{'    fn transfer_preserves_total_supply('}</div>
                    <div className="text-near-green">{'        sender_balance in 1u128..1_000_000,'}</div>
                    <div className="text-near-green">{'        transfer_amount in 1u128..1_000_000,'}</div>
                    <div className="text-near-green">{'    ) {'}</div>
                    <div className="text-near-green">{'        let mut contract = setup_contract();'}</div>
                    <div className="text-near-green">{'        contract.set_balance("alice", sender_balance);'}</div>
                    <div className="text-near-green">{'        contract.set_balance("bob", 0);'}</div>
                    <div className="text-near-green">{'        let total_before = contract.total_supply();'}</div>
                    <div className="mt-1 text-near-green">{'        // Transfer may fail — that\'s fine'}</div>
                    <div className="text-near-green">{'        let _ = contract.ft_transfer("alice", "bob", transfer_amount);'}</div>
                    <div className="mt-1 text-near-green">{'        // But total supply must NEVER change'}</div>
                    <div className="text-near-green">{'        assert_eq!(contract.total_supply(), total_before);'}</div>
                    <div className="text-near-green">{'    }'}</div>
                    <div className="text-near-green">{'}'}</div>
                  </div>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-green-400" />
                    Invariant Testing Patterns
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Invariants are properties that must always hold, regardless of the sequence of operations. Define them for your contract and test across random action sequences:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-text-secondary border border-border">
                    <div className="text-green-400 mb-2">{'// Invariant testing: random sequences of actions'}</div>
                    <div className="text-near-green">{'#[derive(Debug, Clone)]'}</div>
                    <div className="text-near-green">{'enum Action {'}</div>
                    <div className="text-near-green">{'    Deposit { user: String, amount: u128 },'}</div>
                    <div className="text-near-green">{'    Withdraw { user: String, amount: u128 },'}</div>
                    <div className="text-near-green">{'    Transfer { from: String, to: String, amount: u128 },'}</div>
                    <div className="text-near-green">{'}'}</div>
                    <div className="mt-1 text-near-green">{'fn check_invariants(contract: &Contract) {'}</div>
                    <div className="text-near-green">{'    // Invariant 1: sum of all balances == total supply'}</div>
                    <div className="text-near-green">{'    let sum: u128 = contract.all_balances().values().sum();'}</div>
                    <div className="text-near-green">{'    assert_eq!(sum, contract.total_supply());'}</div>
                    <div className="mt-1 text-near-green">{'    // Invariant 2: no balance is negative (enforced by u128)'}</div>
                    <div className="text-near-green">{'    // Invariant 3: total supply never exceeds max'}</div>
                    <div className="text-near-green">{'    assert!(contract.total_supply() <= MAX_SUPPLY);'}</div>
                    <div className="text-near-green">{'}'}</div>
                    <div className="mt-1 text-near-green">{'// Run 10,000 random action sequences, check after each'}</div>
                    <div className="text-near-green">{'// proptest generates random Action sequences automatically'}</div>
                  </div>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <ScanSearch className="w-5 h-5 text-purple-400" />
                    Model Checking
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Model checking exhaustively explores all reachable states of your contract to find violations. It&apos;s like testing every possible execution, but automated:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-text-secondary border border-border">
                    <div className="text-purple-400 mb-2">{'// Model checking approach for smart contracts'}</div>
                    <div className="text-near-green">{'// 1. Define state space'}</div>
                    <div className="text-near-green">{'//    - Contract state (balances, mappings, flags)'}</div>
                    <div className="text-near-green">{'//    - Environmental state (caller, block, gas)'}</div>
                    <div className="mt-2 text-near-green">{'// 2. Define transitions (contract methods)'}</div>
                    <div className="text-near-green">{'//    - Each method = state transition function'}</div>
                    <div className="text-near-green">{'//    - Include all possible callers and inputs'}</div>
                    <div className="mt-2 text-near-green">{'// 3. Define properties to verify'}</div>
                    <div className="text-near-green">{'//    - Safety: "bad thing never happens"'}</div>
                    <div className="text-near-green">{'//    - Liveness: "good thing eventually happens"'}</div>
                    <div className="text-near-green">{'//    - Deadlock freedom: no stuck states'}</div>
                    <div className="mt-2 text-near-green">{'// 4. Explore all reachable states via BFS/DFS'}</div>
                    <div className="text-near-green">{'//    Tools: TLA+, Alloy, or custom Rust harness'}</div>
                    <div className="text-near-green">{'//    Output: counterexample trace if property violated'}</div>
                  </div>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Binary className="w-5 h-5 text-cyan-400" />
                    Symbolic Execution
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Symbolic execution treats inputs as symbolic variables and explores all execution paths algebraically, finding exact inputs that trigger bugs:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card variant="default" padding="md" className="border-cyan-500/20">
                      <h5 className="font-semibold text-cyan-400 text-sm mb-2">Tools for Rust/WASM</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• KLEE: symbolic execution engine for LLVM IR</li>
                        <li>• Haybale: symbolic execution for LLVM bitcode in Rust</li>
                        <li>• cargo-fuzz: coverage-guided fuzzing with libFuzzer</li>
                        <li>• Bolero: unified property testing + fuzzing framework</li>
                        <li>• WASM symbolic: emerging tools for WASM analysis</li>
                      </ul>
                    </Card>
                    <Card variant="default" padding="md" className="border-red-500/20">
                      <h5 className="font-semibold text-red-400 text-sm mb-2">What It Finds</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• Integer overflow/underflow</li>
                        <li>• Unreachable code paths</li>
                        <li>• Assertion violations</li>
                        <li>• Panics and unwrap failures</li>
                        <li>• Logic errors in branch conditions</li>
                      </ul>
                    </Card>
                  </div>
                </section>
              </div>
            )}

            {selectedTab === 'practice' && (
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-text-primary">Exercises</h4>

                <Card variant="default" padding="md" className="border-red-500/20">
                  <h5 className="font-semibold text-red-400 text-sm mb-2">🔴 Exercise 1: Property Test a Token</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Add proptest to a NEP-141 fungible token contract. Define and test at least 5 properties: total supply conservation, no negative balances, transfer correctness, allowance limits, and self-transfer idempotency.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-red-500/20">
                  <h5 className="font-semibold text-red-400 text-sm mb-2">🔴 Exercise 2: Invariant Test Suite</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Build a stateful invariant test harness for a DEX contract. Generate random sequences of swaps, liquidity additions, and removals. Verify the constant product formula holds after each action.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-red-500/20">
                  <h5 className="font-semibold text-red-400 text-sm mb-2">🔴 Exercise 3: Fuzz Your Contract</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Set up cargo-fuzz for a NEAR smart contract. Write fuzz targets for each public method. Run for 1 hour and analyze any crashes found. Fix bugs and re-verify.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-red-500/20">
                  <h5 className="font-semibold text-red-400 text-sm mb-2">🔴 Exercise 4: TLA+ State Machine Model</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Model a multi-sig wallet contract in TLA+. Define states, transitions, and safety properties (e.g., no unauthorized withdrawal). Run the TLC model checker to verify all properties hold.
                  </p>
                </Card>
              </div>
            )}

            {selectedTab === 'resources' && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-text-primary">Resources</h4>
                {[
                  { title: 'proptest Crate', url: 'https://github.com/proptest-rs/proptest', desc: 'Property-based testing framework for Rust — hypothesis-inspired' },
                  { title: 'cargo-fuzz', url: 'https://github.com/rust-fuzz/cargo-fuzz', desc: 'Coverage-guided fuzzing for Rust with libFuzzer backend' },
                  { title: 'Bolero', url: 'https://github.com/camshaft/bolero', desc: 'Unified fuzzing and property testing framework for Rust' },
                  { title: 'KLEE Symbolic Execution', url: 'https://klee.github.io/', desc: 'Symbolic execution engine for LLVM-based languages' },
                  { title: 'TLA+ for Engineers', url: 'https://lamport.azurewebsites.net/tla/tla.html', desc: 'Leslie Lamport\'s TLA+ specification language for model checking' },
                  { title: 'Trail of Bits Smart Contract Testing', url: 'https://blog.trailofbits.com/2023/07/21/fuzzing-on-chain-contracts-with-echidna/', desc: 'Advanced smart contract testing techniques from security researchers' },
                ].map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/[0.02] transition-colors group"
                  >
                    <ExternalLink className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-text-primary group-hover:text-purple-400 transition-colors">{link.title}</p>
                      <p className="text-xs text-text-muted">{link.desc}</p>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};

export default FormalVerification;
