'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Cpu, ExternalLink, CheckCircle, Layers, Database, Zap, Network, GitBranch } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

interface NearArchitectureDeepDiveProps {
  isActive: boolean;
  onToggle: () => void;
}

const NearArchitectureDeepDive: React.FC<NearArchitectureDeepDiveProps> = ({ isActive, onToggle }) => {
  const [selectedTab, setSelectedTab] = useState<string>('overview');

  return (
    <Card variant="glass" padding="none" className="border-purple-500/20">
      <div
        onClick={onToggle}
        className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Cpu className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">NEAR Architecture Deep Dive</h3>
            <p className="text-text-muted text-sm">Protocol internals, sharding, consensus, and the runtime layer</p>
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
                  <Cpu className="w-5 h-5 text-purple-400" />
                  <h4 className="text-lg font-semibold text-text-primary">What You&apos;ll Learn</h4>
                </div>
                <ul className="space-y-3">
                  {[
                    'Nightshade sharding architecture — how NEAR splits state and processing across shards',
                    'Doomslug consensus and block production mechanics at the validator level',
                    'The NEAR runtime (nearcore) — how transactions become receipts and receipts become state changes',
                    'Chunk production, gas metering, and the economics of execution',
                    'Epoch management, validator selection, and stake-weighted rotation',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-text-secondary">
                      <CheckCircle className="w-4 h-4 text-near-green mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Card variant="default" padding="md" className="mt-4 border-purple-500/20 bg-purple-500/5">
                  <p className="text-sm text-text-secondary">
                    <span className="text-purple-400 font-semibold">Why this matters:</span> Understanding the protocol internals lets you predict gas costs, design around shard boundaries, and write contracts that work <em>with</em> the architecture instead of against it.
                  </p>
                </Card>
              </div>
            )}

            {selectedTab === 'learn' && (
              <div className="space-y-8">
                {/* Section 1: Nightshade Sharding */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-blue-400" />
                    Nightshade Sharding
                  </h4>
                  <p className="text-text-secondary mb-3">
                    NEAR uses Nightshade, a sharding design where each shard produces a fraction of the next block called a &quot;chunk.&quot; Unlike other sharded chains, NEAR treats the sharded blocks as one logical block — validators don&apos;t need to download the entire state of all shards.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card variant="default" padding="md" className="border-blue-500/20">
                      <h5 className="font-semibold text-blue-400 text-sm mb-2">Chunk Production</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• Each shard has assigned chunk producers per epoch</li>
                        <li>• Chunks contain transactions targeting that shard&apos;s accounts</li>
                        <li>• Chunk producers validate and execute transactions locally</li>
                        <li>• Missing chunks are tolerated — the shard skips that block slot</li>
                      </ul>
                    </Card>
                    <Card variant="default" padding="md" className="border-purple-500/20">
                      <h5 className="font-semibold text-purple-400 text-sm mb-2">State Sharding</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• State is split by account ID prefix across shards</li>
                        <li>• Each account lives on exactly one shard</li>
                        <li>• Cross-shard communication uses async receipts</li>
                        <li>• State sync allows new validators to join without full history</li>
                      </ul>
                    </Card>
                  </div>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border mt-3">
                    <div className="text-text-muted mb-1">{'// Shard assignment is deterministic based on account_id'}</div>
                    <div className="text-near-green">{`// shard_id = hash(account_id) % num_shards`}</div>
                    <div className="text-near-green">{`// With 6 shards (current mainnet):`}</div>
                    <div className="text-near-green">{`// "alice.near" → shard 2`}</div>
                    <div className="text-near-green">{`// "bob.near"   → shard 5`}</div>
                    <div className="text-near-green">{`// Cross-shard calls: alice.near → bob.near`}</div>
                    <div className="text-near-green">{`// generates a receipt routed from shard 2 → shard 5`}</div>
                  </div>
                </section>

                {/* Section 2: Doomslug Consensus */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    Doomslug Consensus
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Doomslug is NEAR&apos;s block production mechanism. It achieves practical finality in ~2 seconds through a two-phase approach: Doomslug consensus for fast block production and BFT finality gadget for irreversibility.
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-text-secondary border border-border">
                    <div className="text-yellow-400 mb-2">{'// Doomslug Block Production Flow:'}</div>
                    <div className="text-text-muted">1. Block producer creates block at height h</div>
                    <div className="text-text-muted">2. Sends to all validators for endorsement</div>
                    <div className="text-text-muted">3. If &gt;50% weight endorses → block is &quot;doomslug final&quot;</div>
                    <div className="text-text-muted">4. BFT finality gadget confirms after ~3 blocks (~3-4s)</div>
                    <div className="text-text-muted">5. Once BFT final → cannot be reverted even with 1/3 malicious</div>
                    <div className="mt-2 text-near-green">{'// Practical implication:'}</div>
                    <div className="text-near-green">{'// - Doomslug finality (~1s): safe for most operations'}</div>
                    <div className="text-near-green">{'// - BFT finality (~4s): safe for high-value transfers'}</div>
                  </div>
                </section>

                {/* Section 3: Runtime and Execution */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Database className="w-5 h-5 text-green-400" />
                    Runtime &amp; Execution Model
                  </h4>
                  <p className="text-text-secondary mb-3">
                    The NEAR runtime executes Wasm contracts in a sandboxed VM. Understanding the execution model is critical for gas optimization.
                  </p>
                  <div className="space-y-3">
                    <Card variant="default" padding="md" className="border-green-500/20">
                      <h5 className="font-semibold text-green-400 text-sm mb-2">Transaction → Receipt Pipeline</h5>
                      <div className="bg-black/40 rounded p-3 font-mono text-xs text-text-muted">
                        <div>Transaction (signed by user)</div>
                        <div className="text-near-green">  → converted to Receipt on signer&apos;s shard</div>
                        <div className="text-near-green">  → Receipt routed to receiver&apos;s shard</div>
                        <div className="text-near-green">  → Runtime executes the Action(s)</div>
                        <div className="text-near-green">  → DataReceipts returned for promises</div>
                        <div className="text-near-green">  → Refund receipt for unused gas</div>
                      </div>
                    </Card>
                    <Card variant="default" padding="md" className="border-cyan-500/20">
                      <h5 className="font-semibold text-cyan-400 text-sm mb-2">Gas Model</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• <strong className="text-text-secondary">Base cost:</strong> Fixed per action type (create account, transfer, function call)</li>
                        <li>• <strong className="text-text-secondary">Wasm execution:</strong> Metered per instruction (~1 gas per basic op, more for crypto)</li>
                        <li>• <strong className="text-text-secondary">Storage:</strong> 10<sup>19</sup> yoctoNEAR per byte (100KB ≈ 1 NEAR staked)</li>
                        <li>• <strong className="text-text-secondary">Max gas per receipt:</strong> 300 TGas (hard limit per receipt execution)</li>
                        <li>• <strong className="text-text-secondary">Cross-contract calls:</strong> Each call creates a new receipt with its own gas budget</li>
                      </ul>
                    </Card>
                  </div>
                </section>

                {/* Section 4: Trie and State Storage */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <GitBranch className="w-5 h-5 text-orange-400" />
                    Trie Structure &amp; State Storage
                  </h4>
                  <p className="text-text-secondary mb-3">
                    NEAR stores all state in a Merkle-Patricia Trie. Every account, contract code, and key-value pair is a node in this trie. Understanding this helps you minimize storage costs.
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-text-secondary border border-border">
                    <div className="text-orange-400 mb-2">{'// State trie key structure:'}</div>
                    <div className="text-text-muted">{`// Account data:    trie[account_id] → { amount, locked, code_hash, storage_usage }`}</div>
                    <div className="text-text-muted">{`// Contract code:   trie[account_id + CONTRACT_CODE] → wasm_bytes`}</div>
                    <div className="text-text-muted">{`// Contract state:  trie[account_id + CONTRACT_DATA + key] → value`}</div>
                    <div className="text-text-muted">{`// Access keys:     trie[account_id + ACCESS_KEY + pk] → permission`}</div>
                    <div className="mt-2 text-near-green">{'// Storage staking cost:'}</div>
                    <div className="text-near-green">{`// Each byte of state requires 0.00001 NEAR staked`}</div>
                    <div className="text-near-green">{`// A typical NFT token entry: ~200 bytes = 0.002 NEAR`}</div>
                    <div className="text-near-green">{`// Freeing storage returns the staked NEAR`}</div>
                  </div>
                </section>

                {/* Section 5: Epoch Management */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Network className="w-5 h-5 text-pink-400" />
                    Epochs &amp; Validator Economics
                  </h4>
                  <p className="text-text-secondary mb-3">
                    An epoch is ~12 hours (~43,200 blocks). At each epoch boundary, the protocol selects validators, assigns them to shards, and calculates rewards.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Card variant="default" padding="md">
                      <h5 className="font-semibold text-text-primary text-sm mb-2">Validator Selection</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• Stake-weighted selection with seat price threshold</li>
                        <li>• Block producers: top N by stake</li>
                        <li>• Chunk producers: larger set, lower threshold</li>
                        <li>• Chunk validators: stateless validation (post Phase 2)</li>
                      </ul>
                    </Card>
                    <Card variant="default" padding="md">
                      <h5 className="font-semibold text-text-primary text-sm mb-2">Reward Distribution</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• ~5% annual inflation target</li>
                        <li>• 90% to validators, 10% to protocol treasury</li>
                        <li>• Rewards proportional to uptime × stake</li>
                        <li>• 70% of gas fees burned (deflationary pressure)</li>
                      </ul>
                    </Card>
                  </div>
                </section>

                {/* Section 6: Stateless Validation */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-indigo-400" />
                    Stateless Validation (Phase 2 Sharding)
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Stateless validation is NEAR&apos;s path to full sharding. Validators don&apos;t need to hold shard state — they validate using state witnesses included with chunks.
                  </p>
                  <Card variant="default" padding="md" className="border-indigo-500/20 bg-indigo-500/5">
                    <ul className="text-sm text-text-secondary space-y-2">
                      <li>• <strong>State witness:</strong> Merkle proof of all state accessed during chunk execution</li>
                      <li>• <strong>Chunk producers:</strong> Execute transactions and produce state witnesses</li>
                      <li>• <strong>Chunk validators:</strong> Verify execution using only the witness (no local state)</li>
                      <li>• <strong>Impact:</strong> Validators can validate any shard without storing its state</li>
                      <li>• <strong>Result:</strong> Lower hardware requirements, more decentralization, unlimited shards</li>
                    </ul>
                  </Card>
                </section>
              </div>
            )}

            {selectedTab === 'practice' && (
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-text-primary">Exercises</h4>

                <Card variant="default" padding="md" className="border-red-500/20">
                  <h5 className="font-semibold text-red-400 text-sm mb-2">🔴 Exercise 1: Trace a Cross-Shard Transaction</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Use NEAR Explorer or nearblocks.io to find a transaction that involves a cross-shard receipt. Trace the full lifecycle: Transaction → Receipt → Execution Outcome → DataReceipt → Refund.
                  </p>
                  <div className="bg-black/40 rounded p-3 font-mono text-xs text-text-muted">
                    <div className="text-near-green"># Use near-cli to inspect a transaction</div>
                    <div className="text-near-green">near tx-status &lt;tx-hash&gt; --accountId your-account.near</div>
                    <div className="mt-1 text-text-muted"># Identify: which shard originated? Which shard executed?</div>
                    <div className="text-text-muted"># How many receipts were generated?</div>
                    <div className="text-text-muted"># What was the total gas burned vs attached?</div>
                  </div>
                </Card>

                <Card variant="default" padding="md" className="border-red-500/20">
                  <h5 className="font-semibold text-red-400 text-sm mb-2">🔴 Exercise 2: Calculate Storage Costs</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Write a script that queries a contract&apos;s state and calculates the exact storage cost. Compare the theoretical cost (bytes × 10^19 yoctoNEAR) with the actual locked balance.
                  </p>
                  <div className="bg-black/40 rounded p-3 font-mono text-xs text-text-muted">
                    <div className="text-near-green"># Query account storage usage</div>
                    <div className="text-near-green">near state &lt;contract-id&gt; --networkId mainnet</div>
                    <div className="mt-1 text-text-muted"># Compare storage_usage with amount locked</div>
                    <div className="text-text-muted"># Calculate: storage_usage * 10^19 yoctoNEAR</div>
                  </div>
                </Card>

                <Card variant="default" padding="md" className="border-red-500/20">
                  <h5 className="font-semibold text-red-400 text-sm mb-2">🔴 Exercise 3: Gas Profiling</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Deploy a contract on testnet that performs various operations. Profile the gas cost of: storage writes, storage reads, cross-contract calls, and crypto operations. Build a gas cost reference table.
                  </p>
                  <div className="bg-black/40 rounded p-3 font-mono text-xs text-text-muted">
                    <div className="text-near-green">{`// Rust contract gas profiler`}</div>
                    <div className="text-near-green">{`pub fn profile_storage_write(&mut self) {`}</div>
                    <div className="text-near-green">{`    let before = env::used_gas();`}</div>
                    <div className="text-near-green">{`    self.data.insert(&"key", &"value");`}</div>
                    <div className="text-near-green">{`    let after = env::used_gas();`}</div>
                    <div className="text-near-green">{`    log!("Storage write cost: {} gas", after - before);`}</div>
                    <div className="text-near-green">{`}`}</div>
                  </div>
                </Card>

                <Card variant="default" padding="md" className="border-red-500/20">
                  <h5 className="font-semibold text-red-400 text-sm mb-2">🔴 Exercise 4: Validator Economics Simulation</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Query the NEAR RPC for current epoch info. Calculate: seat price, total stake, expected rewards for a validator with X stake, and the break-even hardware cost.
                  </p>
                  <div className="bg-black/40 rounded p-3 font-mono text-xs text-text-muted">
                    <div className="text-near-green">{`// Query epoch validators`}</div>
                    <div className="text-near-green">{`curl -s https://rpc.mainnet.near.org -d '{`}</div>
                    <div className="text-near-green">{`  "jsonrpc":"2.0","id":1,`}</div>
                    <div className="text-near-green">{`  "method":"validators",`}</div>
                    <div className="text-near-green">{`  "params":[null]`}</div>
                    <div className="text-near-green">{`}'`}</div>
                  </div>
                </Card>
              </div>
            )}

            {selectedTab === 'resources' && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-text-primary">Resources</h4>
                {[
                  { title: 'NEAR Protocol Specification (Nomicon)', url: 'https://nomicon.io/', desc: 'The official protocol spec — runtime, consensus, economics, and data structures' },
                  { title: 'Nightshade Sharding Paper', url: 'https://near.org/papers/nightshade/', desc: 'Original sharding design paper explaining chunk-based sharding' },
                  { title: 'nearcore GitHub Repository', url: 'https://github.com/near/nearcore', desc: 'The reference implementation — read the source for deep understanding' },
                  { title: 'NEAR Enhancement Proposals (NEPs)', url: 'https://github.com/near/NEPs', desc: 'Protocol change proposals and standards' },
                  { title: 'NEAR RPC API Reference', url: 'https://docs.near.org/api/rpc/introduction', desc: 'Full RPC documentation for querying protocol state' },
                  { title: 'Stateless Validation Overview', url: 'https://docs.near.org/concepts/abstraction/chain-signatures', desc: 'Phase 2 sharding documentation and validator changes' },
                  { title: 'NEAR Gas Reference', url: 'https://docs.near.org/concepts/protocol/gas', desc: 'Detailed gas costs for every action and host function' },
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

export default NearArchitectureDeepDive;
