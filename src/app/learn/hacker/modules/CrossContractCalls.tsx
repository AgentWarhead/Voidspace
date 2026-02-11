'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Network, ExternalLink, CheckCircle, Zap, AlertTriangle, Code, ArrowRight, Shield } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

interface CrossContractCallsProps {
  isActive: boolean;
  onToggle: () => void;
}

const CrossContractCalls: React.FC<CrossContractCallsProps> = ({ isActive, onToggle }) => {
  const [selectedTab, setSelectedTab] = useState<string>('overview');

  return (
    <Card variant="glass" padding="none" className="border-purple-500/20">
      <div
        onClick={onToggle}
        className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
            <Network className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Cross-Contract Calls</h3>
            <p className="text-text-muted text-sm">Promises, callbacks, gas splitting, and async composition patterns</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-red-500/10 text-red-300 border-red-500/20">Advanced</Badge>
          <Badge className="bg-purple-500/10 text-purple-300 border-purple-500/20">55 min</Badge>
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
                  <Network className="w-5 h-5 text-blue-400" />
                  <h4 className="text-lg font-semibold text-text-primary">What You&apos;ll Learn</h4>
                </div>
                <ul className="space-y-3">
                  {[
                    'The Promise API — low-level cross-contract calls with fine-grained gas control',
                    'High-level #[ext_contract] macro patterns and their tradeoffs',
                    'Gas splitting strategies — how to budget across multi-hop call chains',
                    'Callback patterns — handling success, failure, and partial failures',
                    'Atomic-like guarantees in an async world — saga and compensating patterns',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-text-secondary">
                      <CheckCircle className="w-4 h-4 text-near-green mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Card variant="default" padding="md" className="mt-4 border-blue-500/20 bg-blue-500/5">
                  <p className="text-sm text-text-secondary">
                    <span className="text-blue-400 font-semibold">Why this matters:</span> Cross-contract calls are NEAR&apos;s composability primitive. Every DeFi protocol, DAO, and complex dApp relies on them. Getting the patterns wrong leads to locked funds, reentrancy bugs, and gas-limit failures.
                  </p>
                </Card>
              </div>
            )}

            {selectedTab === 'learn' && (
              <div className="space-y-8">
                {/* Section 1: Promise Fundamentals */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    Promise Fundamentals
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Every cross-contract call on NEAR is a Promise. Unlike JavaScript promises, NEAR promises are on-chain objects that schedule receipt execution across blocks and potentially across shards.
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-text-secondary border border-border">
                    <div className="text-yellow-400 mb-2">{'// Low-level Promise API in Rust'}</div>
                    <div className="text-near-green">{`use near_sdk::{env, Promise, Gas, NearToken};`}</div>
                    <div className="mt-2 text-near-green">{`// Simple cross-contract call`}</div>
                    <div className="text-near-green">{`let promise = Promise::new("target.near".parse().unwrap())`}</div>
                    <div className="text-near-green">{`    .function_call(`}</div>
                    <div className="text-near-green">{`        "method_name".to_string(),`}</div>
                    <div className="text-near-green">{`        json!({ "arg1": "value" })`}</div>
                    <div className="text-near-green">{`            .to_string().into_bytes(),`}</div>
                    <div className="text-near-green">{`        NearToken::from_yoctonear(0),  // attached deposit`}</div>
                    <div className="text-near-green">{`        Gas::from_tgas(10),             // gas for this call`}</div>
                    <div className="text-near-green">{`    );`}</div>
                    <div className="mt-2 text-near-green">{`// Chain a callback on the CURRENT contract`}</div>
                    <div className="text-near-green">{`promise.then(`}</div>
                    <div className="text-near-green">{`    Promise::new(env::current_account_id())`}</div>
                    <div className="text-near-green">{`        .function_call(`}</div>
                    <div className="text-near-green">{`            "on_method_complete".to_string(),`}</div>
                    <div className="text-near-green">{`            vec![],`}</div>
                    <div className="text-near-green">{`            NearToken::from_yoctonear(0),`}</div>
                    <div className="text-near-green">{`            Gas::from_tgas(5),`}</div>
                    <div className="text-near-green">{`        )`}</div>
                    <div className="text-near-green">{`);`}</div>
                  </div>
                </section>

                {/* Section 2: High-Level Patterns */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Code className="w-5 h-5 text-green-400" />
                    High-Level Cross-Contract Patterns
                  </h4>
                  <p className="text-text-secondary mb-3">
                    The <code className="text-purple-400 bg-purple-500/10 px-1 rounded">#[ext_contract]</code> macro generates type-safe cross-contract interfaces. Here&apos;s production-grade usage:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-text-secondary border border-border">
                    <div className="text-green-400 mb-2">{'// Define external contract interface'}</div>
                    <div className="text-near-green">{`#[ext_contract(ext_ft)]`}</div>
                    <div className="text-near-green">{`trait FungibleToken {`}</div>
                    <div className="text-near-green">{`    fn ft_transfer(`}</div>
                    <div className="text-near-green">{`        &mut self,`}</div>
                    <div className="text-near-green">{`        receiver_id: AccountId,`}</div>
                    <div className="text-near-green">{`        amount: U128,`}</div>
                    <div className="text-near-green">{`        memo: Option<String>,`}</div>
                    <div className="text-near-green">{`    );`}</div>
                    <div className="text-near-green">{`    fn ft_balance_of(&self, account_id: AccountId) -> U128;`}</div>
                    <div className="text-near-green">{`}`}</div>
                    <div className="mt-2 text-green-400">{'// Usage in your contract'}</div>
                    <div className="text-near-green">{`ext_ft::ext(token_contract_id)`}</div>
                    <div className="text-near-green">{`    .with_attached_deposit(NearToken::from_yoctonear(1))`}</div>
                    <div className="text-near-green">{`    .with_static_gas(Gas::from_tgas(10))`}</div>
                    <div className="text-near-green">{`    .ft_transfer(receiver, amount, None)`}</div>
                    <div className="text-near-green">{`    .then(`}</div>
                    <div className="text-near-green">{`        Self::ext(env::current_account_id())`}</div>
                    <div className="text-near-green">{`            .with_static_gas(Gas::from_tgas(5))`}</div>
                    <div className="text-near-green">{`            .on_ft_transfer_complete()`}</div>
                    <div className="text-near-green">{`    )`}</div>
                  </div>
                </section>

                {/* Section 3: Gas Splitting */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <ArrowRight className="w-5 h-5 text-orange-400" />
                    Gas Splitting Strategies
                  </h4>
                  <p className="text-text-secondary mb-3">
                    With 300 TGas max per transaction, you must carefully budget gas across call chains. Here&apos;s how the pros do it:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card variant="default" padding="md" className="border-orange-500/20">
                      <h5 className="font-semibold text-orange-400 text-sm mb-2">Static Gas Allocation</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• Pre-calculate gas for each step</li>
                        <li>• Reserve gas for callbacks before making calls</li>
                        <li>• Typical: 5 TGas callback, 10-20 TGas per external call</li>
                        <li>• Leave buffer for refund receipts (~2 TGas)</li>
                      </ul>
                    </Card>
                    <Card variant="default" padding="md" className="border-yellow-500/20">
                      <h5 className="font-semibold text-yellow-400 text-sm mb-2">Dynamic Gas Allocation</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• Use <code className="text-purple-400">env::prepaid_gas()</code> to check budget</li>
                        <li>• Split remaining gas proportionally</li>
                        <li>• Pattern: keep 1/3 for callback, give 2/3 to callee</li>
                        <li>• Use <code className="text-purple-400">Gas::from_tgas(0)</code> to donate all remaining</li>
                      </ul>
                    </Card>
                  </div>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-text-secondary border border-border mt-3">
                    <div className="text-orange-400 mb-2">{'// Dynamic gas splitting pattern'}</div>
                    <div className="text-near-green">{`const CALLBACK_GAS: Gas = Gas::from_tgas(10);`}</div>
                    <div className="text-near-green">{`const BUFFER_GAS: Gas = Gas::from_tgas(5);`}</div>
                    <div className="text-near-green">{``}</div>
                    <div className="text-near-green">{`let remaining = env::prepaid_gas() - env::used_gas();`}</div>
                    <div className="text-near-green">{`let call_gas = remaining - CALLBACK_GAS - BUFFER_GAS;`}</div>
                  </div>
                </section>

                {/* Section 4: Callback Patterns */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-red-400" />
                    Callback Error Handling
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Callbacks ALWAYS execute even if the promise failed. You must check the result and handle rollback manually:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-text-secondary border border-border">
                    <div className="text-red-400 mb-2">{'// Production callback pattern'}</div>
                    <div className="text-near-green">{`#[private]`}</div>
                    <div className="text-near-green">{`pub fn on_transfer_complete(`}</div>
                    <div className="text-near-green">{`    &mut self,`}</div>
                    <div className="text-near-green">{`    #[callback_result] result: Result<U128, PromiseError>,`}</div>
                    <div className="text-near-green">{`) -> bool {`}</div>
                    <div className="text-near-green">{`    match result {`}</div>
                    <div className="text-near-green">{`        Ok(balance) => {`}</div>
                    <div className="text-near-green">{`            log!("Transfer succeeded, balance: {}", balance.0);`}</div>
                    <div className="text-near-green">{`            true`}</div>
                    <div className="text-near-green">{`        }`}</div>
                    <div className="text-near-green">{`        Err(_) => {`}</div>
                    <div className="text-near-green">{`            // CRITICAL: Rollback state changes`}</div>
                    <div className="text-near-green">{`            self.pending_transfers.remove(&env::predecessor_account_id());`}</div>
                    <div className="text-near-green">{`            log!("Transfer failed — state rolled back");`}</div>
                    <div className="text-near-green">{`            false`}</div>
                    <div className="text-near-green">{`        }`}</div>
                    <div className="text-near-green">{`    }`}</div>
                    <div className="text-near-green">{`}`}</div>
                  </div>
                  <Card variant="default" padding="md" className="mt-3 border-red-500/20 bg-red-500/5">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-text-secondary">
                        <strong className="text-red-400">Critical:</strong> Never modify state before a cross-contract call without a rollback plan in the callback. This is the #1 source of fund-loss bugs on NEAR.
                      </p>
                    </div>
                  </Card>
                </section>

                {/* Section 5: Promise Combinators */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-cyan-400" />
                    Promise Combinators: and &amp; then
                  </h4>
                  <p className="text-text-secondary mb-3">
                    NEAR supports two promise combinators for parallel and sequential execution:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card variant="default" padding="md" className="border-cyan-500/20">
                      <h5 className="font-semibold text-cyan-400 text-sm mb-2">.then() — Sequential</h5>
                      <p className="text-xs text-text-muted mb-2">Execute B after A completes. B receives A&apos;s result.</p>
                      <div className="bg-black/30 rounded p-2 font-mono text-xs text-near-green">
                        {`promise_a.then(promise_b)`}
                      </div>
                    </Card>
                    <Card variant="default" padding="md" className="border-purple-500/20">
                      <h5 className="font-semibold text-purple-400 text-sm mb-2">.and() — Parallel</h5>
                      <p className="text-xs text-text-muted mb-2">Execute A and B in parallel. Callback receives both results.</p>
                      <div className="bg-black/30 rounded p-2 font-mono text-xs text-near-green">
                        {`promise_a.and(promise_b).then(callback)`}
                      </div>
                    </Card>
                  </div>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-text-secondary border border-border mt-3">
                    <div className="text-cyan-400 mb-2">{'// Parallel cross-contract calls (fan-out pattern)'}</div>
                    <div className="text-near-green">{`let p1 = ext_oracle::ext(oracle_a.clone())`}</div>
                    <div className="text-near-green">{`    .with_static_gas(Gas::from_tgas(10))`}</div>
                    <div className="text-near-green">{`    .get_price("NEAR/USD".to_string());`}</div>
                    <div className="text-near-green">{``}</div>
                    <div className="text-near-green">{`let p2 = ext_oracle::ext(oracle_b.clone())`}</div>
                    <div className="text-near-green">{`    .with_static_gas(Gas::from_tgas(10))`}</div>
                    <div className="text-near-green">{`    .get_price("NEAR/USD".to_string());`}</div>
                    <div className="text-near-green">{``}</div>
                    <div className="text-near-green">{`// Both calls execute in the same block`}</div>
                    <div className="text-near-green">{`p1.and(p2).then(`}</div>
                    <div className="text-near-green">{`    Self::ext(env::current_account_id())`}</div>
                    <div className="text-near-green">{`        .on_prices_received()`}</div>
                    <div className="text-near-green">{`)`}</div>
                  </div>
                </section>
              </div>
            )}

            {selectedTab === 'practice' && (
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-text-primary">Exercises</h4>

                <Card variant="default" padding="md" className="border-red-500/20">
                  <h5 className="font-semibold text-red-400 text-sm mb-2">🔴 Exercise 1: Multi-Contract Swap</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Build a contract that performs an atomic-style swap: transfer token A from user → pool, transfer token B from pool → user. Handle failure at every step with proper rollback.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-red-500/20">
                  <h5 className="font-semibold text-red-400 text-sm mb-2">🔴 Exercise 2: Oracle Aggregator</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Build a price oracle aggregator that queries 3 oracle contracts in parallel using <code className="text-purple-400 bg-purple-500/10 px-1 rounded">.and()</code>, then computes the median price in the callback. Handle cases where 1 or 2 oracles fail.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-red-500/20">
                  <h5 className="font-semibold text-red-400 text-sm mb-2">🔴 Exercise 3: Gas Budget Calculator</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Write a contract that makes a 4-hop cross-contract call chain (A → B → C → D → callback). Log the gas used at each step and verify your gas budgeting is correct. Push the limits of 300 TGas.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-red-500/20">
                  <h5 className="font-semibold text-red-400 text-sm mb-2">🔴 Exercise 4: Saga Pattern</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Implement a saga pattern: a multi-step workflow where each step has a compensating action. If step 3 of 5 fails, the contract must execute compensating actions for steps 2 and 1 in reverse order.
                  </p>
                </Card>
              </div>
            )}

            {selectedTab === 'resources' && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-text-primary">Resources</h4>
                {[
                  { title: 'Cross-Contract Calls Guide', url: 'https://docs.near.org/build/smart-contracts/anatomy/crosscontract', desc: 'Official guide to cross-contract calls with examples' },
                  { title: 'Promise API Reference', url: 'https://docs.near.org/sdk/rust/promises/intro', desc: 'Low-level promise API docs for Rust SDK' },
                  { title: 'Callback Patterns', url: 'https://docs.near.org/sdk/rust/promises/callbacks', desc: 'Handling results and errors in callbacks' },
                  { title: 'Gas Deep Dive', url: 'https://docs.near.org/concepts/protocol/gas', desc: 'Understanding gas costs and allocation strategies' },
                  { title: 'Ref Finance Contracts', url: 'https://github.com/ref-finance/ref-contracts', desc: 'Production cross-contract patterns from the biggest NEAR DEX' },
                  { title: 'near-sdk-rs Cross-Contract Examples', url: 'https://github.com/near/near-sdk-rs/tree/master/examples', desc: 'Official SDK examples with cross-contract patterns' },
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

export default CrossContractCalls;
