'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ExternalLink, CheckCircle, Flame, Gauge, HardDrive, Layers, BarChart3, Wrench } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

interface GasOptimizationDeepDiveProps {
  isActive: boolean;
  onToggle: () => void;
}

const GasOptimizationDeepDive: React.FC<GasOptimizationDeepDiveProps> = ({ isActive, onToggle }) => {
  const [selectedTab, setSelectedTab] = useState<string>('overview');

  return (
    <Card variant="glass" padding="none" className="border-purple-500/20">
      <div
        onClick={onToggle}
        className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
            <Flame className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Gas Optimization Deep Dive</h3>
            <p className="text-text-muted text-sm">NEAR gas model, profiling, storage vs compute tradeoffs, and optimization patterns</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-red-500/10 text-red-300 border-red-500/20">Advanced</Badge>
          <Badge className="bg-purple-500/10 text-purple-300 border-purple-500/20">60 min</Badge>
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
                  <Flame className="w-5 h-5 text-orange-400" />
                  <h4 className="text-lg font-semibold text-text-primary">What You&apos;ll Learn</h4>
                </div>
                <ul className="space-y-3">
                  {[
                    'NEAR\'s gas model: gas units, gas price, prepaid gas, and attached gas',
                    'Profiling gas usage in your contracts using near-workspaces and sandbox',
                    'Storage vs compute optimization — when to cache, when to recompute',
                    'Batch action optimization: reducing cross-contract overhead',
                    'Real-world gas optimization case studies from production NEAR dApps',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-text-secondary">
                      <CheckCircle className="w-4 h-4 text-near-green mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Card variant="default" padding="md" className="mt-4 border-orange-500/20 bg-orange-500/5">
                  <p className="text-sm text-text-secondary">
                    <span className="text-orange-400 font-semibold">Why this matters:</span> Gas costs directly impact user experience and protocol economics. A poorly optimized contract can cost 10x more than necessary. Understanding NEAR&apos;s unique gas model — especially prepaid gas and storage staking — is essential for production dApps.
                  </p>
                </Card>
              </div>
            )}

            {selectedTab === 'learn' && (
              <div className="space-y-8">
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Gauge className="w-5 h-5 text-orange-400" />
                    NEAR Gas Model
                  </h4>
                  <p className="text-text-secondary mb-3">
                    NEAR uses gas to meter computation. 1 TGas (teragas) = 10¹² gas units. The current gas price is dynamic but typically around 0.0001 NEAR per TGas.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card variant="default" padding="md" className="border-orange-500/20">
                      <h5 className="font-semibold text-orange-400 text-sm mb-2">Gas Basics</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• Max gas per transaction: 300 TGas</li>
                        <li>• Gas is prepaid by the caller</li>
                        <li>• Unused gas is refunded automatically</li>
                        <li>• 30% of gas fees burned, 70% to contract</li>
                        <li>• Cross-contract calls split gas budget</li>
                      </ul>
                    </Card>
                    <Card variant="default" padding="md" className="border-red-500/20">
                      <h5 className="font-semibold text-red-400 text-sm mb-2">Gas Costs by Operation</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• Base function call: ~2.5 TGas</li>
                        <li>• Storage write (per byte): ~10 Ggas</li>
                        <li>• Storage read (per byte): ~6 Ggas</li>
                        <li>• Cross-contract call overhead: ~5 TGas</li>
                        <li>• WASM execution: varies by instruction</li>
                      </ul>
                    </Card>
                  </div>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-400" />
                    Profiling Gas Usage
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Use near-workspaces-rs to measure exact gas consumption of your contract methods in a sandbox environment:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-text-secondary border border-border">
                    <div className="text-blue-400 mb-2">{'// Rust: Gas profiling with near-workspaces'}</div>
                    <div className="text-near-green">{'use near_workspaces::{sandbox, Account};'}</div>
                    <div className="mt-1 text-near-green">{'#[tokio::test]'}</div>
                    <div className="text-near-green">{'async fn profile_gas_usage() {'}</div>
                    <div className="text-near-green">{'    let worker = sandbox().await.unwrap();'}</div>
                    <div className="text-near-green">{'    let contract = worker.dev_deploy(WASM_BYTES).await.unwrap();'}</div>
                    <div className="mt-1 text-near-green">{'    let result = contract'}</div>
                    <div className="text-near-green">{'        .call("my_method")'}</div>
                    <div className="text-near-green">{'        .args_json(json!({"key": "value"}))'}</div>
                    <div className="text-near-green">{'        .gas(near_gas::NearGas::from_tgas(300))'}</div>
                    <div className="text-near-green">{'        .transact()'}</div>
                    <div className="text-near-green">{'        .await.unwrap();'}</div>
                    <div className="mt-1 text-near-green">{'    // Analyze gas breakdown'}</div>
                    <div className="text-near-green">{'    let gas_burnt = result.total_gas_burnt.as_tgas();'}</div>
                    <div className="text-near-green">{'    println!("Total gas burnt: {} TGas", gas_burnt);'}</div>
                    <div className="text-near-green">{'    for receipt in result.receipt_outcomes() {'}</div>
                    <div className="text-near-green">{'        println!("  Receipt gas: {} TGas",'}</div>
                    <div className="text-near-green">{'            receipt.gas_burnt.as_tgas());'}</div>
                    <div className="text-near-green">{'    }'}</div>
                    <div className="text-near-green">{'}'}</div>
                  </div>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <HardDrive className="w-5 h-5 text-green-400" />
                    Storage vs Compute Tradeoffs
                  </h4>
                  <p className="text-text-secondary mb-3">
                    On NEAR, storage has a staking cost (0.01 NEAR per KB) while compute is paid per-call. Understanding when to store precomputed values vs recompute on-the-fly is key.
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-text-secondary border border-border">
                    <div className="text-green-400 mb-2">{'// Storage optimization patterns'}</div>
                    <div className="text-near-green">{'// ❌ Expensive: storing derived data'}</div>
                    <div className="text-near-green">{'struct UserProfile {'}</div>
                    <div className="text-near-green">{'    balance: u128,'}</div>
                    <div className="text-near-green">{'    total_deposits: u128,  // can be recomputed'}</div>
                    <div className="text-near-green">{'    avg_deposit: u128,     // can be recomputed'}</div>
                    <div className="text-near-green">{'    deposit_count: u64,'}</div>
                    <div className="text-near-green">{'}'}</div>
                    <div className="mt-2 text-near-green">{'// ✅ Cheaper: store minimal, compute on read'}</div>
                    <div className="text-near-green">{'struct UserProfile {'}</div>
                    <div className="text-near-green">{'    balance: u128,'}</div>
                    <div className="text-near-green">{'    deposit_count: u64,'}</div>
                    <div className="text-near-green">{'    total_deposits: u128,'}</div>
                    <div className="text-near-green">{'    // avg computed: total_deposits / deposit_count'}</div>
                    <div className="text-near-green">{'}'}</div>
                    <div className="mt-2 text-near-green">{'// ✅ Use LookupMap instead of UnorderedMap'}</div>
                    <div className="text-near-green">{'// when you don\'t need iteration (saves ~50% gas)'}</div>
                  </div>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-purple-400" />
                    Batch Action Optimization
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Batching multiple operations into a single transaction saves significant gas by reducing cross-contract call overhead:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-text-secondary border border-border">
                    <div className="text-purple-400 mb-2">{'// Rust: Batch actions to save gas'}</div>
                    <div className="text-near-green">{'// ❌ Multiple separate calls: ~15 TGas overhead each'}</div>
                    <div className="text-near-green">{'Promise::new(account.clone()).transfer(amount1);'}</div>
                    <div className="text-near-green">{'Promise::new(account.clone()).transfer(amount2);'}</div>
                    <div className="text-near-green">{'Promise::new(account.clone()).transfer(amount3);'}</div>
                    <div className="mt-2 text-near-green">{'// ✅ Batched: single receipt, one overhead cost'}</div>
                    <div className="text-near-green">{'Promise::new(account.clone())'}</div>
                    <div className="text-near-green">{'    .transfer(amount1)'}</div>
                    <div className="text-near-green">{'    .transfer(amount2)'}</div>
                    <div className="text-near-green">{'    .transfer(amount3);'}</div>
                    <div className="mt-2 text-near-green">{'// ✅ Batch function calls to same contract'}</div>
                    <div className="text-near-green">{'Promise::new(token_contract)'}</div>
                    <div className="text-near-green">{'    .function_call("ft_transfer", args1, deposit, gas / 3)'}</div>
                    <div className="text-near-green">{'    .function_call("ft_transfer", args2, deposit, gas / 3)'}</div>
                    <div className="text-near-green">{'    .function_call("ft_transfer", args3, deposit, gas / 3);'}</div>
                  </div>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Wrench className="w-5 h-5 text-cyan-400" />
                    Advanced Optimization Techniques
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Production-level optimizations used by top NEAR protocols:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card variant="default" padding="md" className="border-cyan-500/20">
                      <h5 className="font-semibold text-cyan-400 text-sm mb-2">Data Structure Choice</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• LookupMap: O(1) get/set, no iteration</li>
                        <li>• UnorderedMap: O(1) + iteration (more storage)</li>
                        <li>• TreeMap: sorted keys, range queries</li>
                        <li>• LazyOption: defer deserialization</li>
                        <li>• Borsh vs JSON: Borsh is 2-5x more compact</li>
                      </ul>
                    </Card>
                    <Card variant="default" padding="md" className="border-orange-500/20">
                      <h5 className="font-semibold text-orange-400 text-sm mb-2">Code-Level Optimization</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• Use #[near(serializers = [borsh])] for internal state</li>
                        <li>• Minimize string allocations in hot paths</li>
                        <li>• Use env::storage_* for raw key-value access</li>
                        <li>• Avoid unnecessary deserialization of large state</li>
                        <li>• WASM binary size affects deployment cost</li>
                      </ul>
                    </Card>
                  </div>
                </section>
              </div>
            )}

            {selectedTab === 'practice' && (
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-text-primary">Exercises</h4>

                <Card variant="default" padding="md" className="border-orange-500/20">
                  <h5 className="font-semibold text-orange-400 text-sm mb-2">🟠 Exercise 1: Gas Profiler</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Write a test suite using near-workspaces that benchmarks every public method of a contract. Create a report showing gas usage per method and identify the most expensive operations.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-orange-500/20">
                  <h5 className="font-semibold text-orange-400 text-sm mb-2">🟠 Exercise 2: Data Structure Benchmark</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Build a contract that stores 1000 items using LookupMap, UnorderedMap, and TreeMap. Compare gas costs for insert, lookup, delete, and iteration. Document the results.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-orange-500/20">
                  <h5 className="font-semibold text-orange-400 text-sm mb-2">🟠 Exercise 3: Optimize a Token Contract</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Take a basic NEP-141 fungible token contract and optimize it. Switch to Borsh serialization, use LookupMap, minimize storage writes. Target: reduce ft_transfer gas by 30%.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-orange-500/20">
                  <h5 className="font-semibold text-orange-400 text-sm mb-2">🟠 Exercise 4: Batch Operation Builder</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Build a multi-send contract that batches up to 50 token transfers into a single transaction. Compare gas usage vs individual transfers and calculate the savings per transfer.
                  </p>
                </Card>
              </div>
            )}

            {selectedTab === 'resources' && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-text-primary">Resources</h4>
                {[
                  { title: 'NEAR Gas Documentation', url: 'https://docs.near.org/concepts/protocol/gas', desc: 'Official documentation on NEAR\'s gas model, pricing, and limits' },
                  { title: 'Storage Staking', url: 'https://docs.near.org/concepts/storage/storage-staking', desc: 'How NEAR\'s storage staking model works and its cost implications' },
                  { title: 'near-sdk-rs Collections', url: 'https://docs.near.org/sdk/rust/contract-structure/collections', desc: 'Guide to choosing the right collection type for gas efficiency' },
                  { title: 'near-workspaces-rs', url: 'https://github.com/near/near-workspaces-rs', desc: 'Rust testing framework with gas profiling capabilities' },
                  { title: 'NEAR Gas Profiler', url: 'https://github.com/nicechute/near-gas-profiler', desc: 'Community tool for visualizing gas consumption in NEAR contracts' },
                  { title: 'Contract Optimization Guide', url: 'https://docs.near.org/sdk/rust/best-practices', desc: 'Official best practices for writing gas-efficient NEAR smart contracts' },
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

export default GasOptimizationDeepDive;
