'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Zap, ExternalLink, CheckCircle, Gauge, HardDrive, Timer } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

interface OptimizationProps {
  isActive: boolean;
  onToggle: () => void;
}

const Optimization: React.FC<OptimizationProps> = ({ isActive, onToggle }) => {
  const [selectedTab, setSelectedTab] = useState<string>('overview');

  return (
    <Card variant="glass" padding="none" className="border-purple-500/20">
      <div
        onClick={onToggle}
        className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-red-500 rounded-xl flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Optimization</h3>
            <p className="text-text-muted text-sm">Reduce gas costs, minimize storage, and shrink WASM binary size</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-error/10 text-error border-error/20">Advanced</Badge>
          <Badge className="bg-purple-500/10 text-purple-300 border-purple-500/20">45 min</Badge>
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
                  <Gauge className="w-5 h-5 text-yellow-400" />
                  <h4 className="text-lg font-semibold text-text-primary">What You&apos;ll Learn</h4>
                </div>
                <ul className="space-y-3">
                  {[
                    'Gas optimization — reduce the cost of every transaction',
                    'Storage optimization — minimize on-chain data costs',
                    'WASM binary size reduction — deploy faster, pay less',
                    'Choosing the right collections for your use case',
                    'Benchmarking and profiling gas usage',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-text-secondary">
                      <CheckCircle className="w-4 h-4 text-near-green mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {selectedTab === 'learn' && (
              <div className="space-y-8">
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Timer className="w-5 h-5 text-orange-400" />
                    Gas Optimization
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Every computation costs gas. On mainnet, gas costs real money. Here&apos;s how to minimize it:
                  </p>
                  <div className="space-y-3">
                    <Card variant="default" padding="md" className="border-green-500/10">
                      <h5 className="text-sm font-semibold text-green-400 mb-2">✅ Do</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• Use <code className="text-purple-400">LookupMap</code> instead of <code className="text-purple-400">UnorderedMap</code> when you don&apos;t need iteration</li>
                        <li>• Batch multiple storage reads into a single method call</li>
                        <li>• Use view methods for read-only queries (free for callers)</li>
                        <li>• Avoid loading entire collections — use pagination</li>
                        <li>• Minimize cross-contract call chains (each hop adds gas)</li>
                      </ul>
                    </Card>
                    <Card variant="default" padding="md" className="border-red-500/10">
                      <h5 className="text-sm font-semibold text-red-400 mb-2">❌ Avoid</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• Iterating over large collections in a single call</li>
                        <li>• Storing data that can be computed</li>
                        <li>• Using <code className="text-purple-400">String</code> where an <code className="text-purple-400">enum</code> would work</li>
                        <li>• Unnecessary serialization/deserialization</li>
                        <li>• Logging in production (use sparingly)</li>
                      </ul>
                    </Card>
                  </div>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <HardDrive className="w-5 h-5 text-blue-400" />
                    Storage Optimization
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Storage costs ~0.00001 NEAR per byte. Optimize what you store:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border">
                    <div className="text-text-muted">// ❌ Wasteful — storing redundant data</div>
                    <div><span className="text-purple-400">pub struct</span> <span className="text-cyan-400">Token</span> {'{'}</div>
                    <div>    owner: AccountId,</div>
                    <div>    owner_str: String,  <span className="text-text-muted">// Same as owner!</span></div>
                    <div>    created_at: String,  <span className="text-text-muted">// Use u64 timestamp instead</span></div>
                    <div>    description: String, <span className="text-text-muted">// Store on IPFS, not on-chain</span></div>
                    <div>{'}'}</div>
                    <div className="mt-3 text-text-muted">// ✅ Optimized — minimal on-chain data</div>
                    <div><span className="text-purple-400">pub struct</span> <span className="text-cyan-400">Token</span> {'{'}</div>
                    <div>    owner: AccountId,</div>
                    <div>    created_at: <span className="text-cyan-400">u64</span>,</div>
                    <div>    metadata_url: String, <span className="text-text-muted">// IPFS/Arweave CID</span></div>
                    <div>{'}'}</div>
                  </div>
                  <div className="bg-black/30 rounded-lg p-4 border border-border mt-3">
                    <h5 className="text-sm font-semibold text-text-primary mb-2">Storage Cost Comparison</h5>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="text-text-muted">AccountId</div>
                      <div className="text-near-green">~64 bytes</div>
                      <div className="text-text-muted">u128</div>
                      <div className="text-near-green">16 bytes</div>
                      <div className="text-text-muted">u64</div>
                      <div className="text-near-green">8 bytes</div>
                      <div className="text-text-muted">bool</div>
                      <div className="text-near-green">1 byte</div>
                      <div className="text-text-muted">String (100 chars)</div>
                      <div className="text-near-green">~104 bytes</div>
                    </div>
                  </div>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <span className="text-purple-400">📦</span> WASM Size Optimization
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Smaller WASM = cheaper deployment. Configure Cargo.toml for production builds:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border">
                    <div className="text-text-muted"># Cargo.toml — add these for smaller builds</div>
                    <div>[profile.release]</div>
                    <div>codegen-units = 1</div>
                    <div>opt-level = <span className="text-yellow-300">&quot;z&quot;</span>       <span className="text-text-muted"># Optimize for size</span></div>
                    <div>lto = <span className="text-purple-400">true</span>              <span className="text-text-muted"># Link-time optimization</span></div>
                    <div>debug = <span className="text-purple-400">false</span>           <span className="text-text-muted"># No debug symbols</span></div>
                    <div>panic = <span className="text-yellow-300">&quot;abort&quot;</span>        <span className="text-text-muted"># Smaller panic handler</span></div>
                    <div>overflow-checks = <span className="text-purple-400">true</span>  <span className="text-text-muted"># Keep for safety!</span></div>
                  </div>
                  <div className="bg-black/40 rounded-lg p-3 font-mono text-sm text-text-secondary border border-border mt-3">
                    <div className="text-text-muted"># Check your WASM size</div>
                    <div className="text-near-green">cargo near build</div>
                    <div className="text-near-green">ls -lh target/near/*.wasm</div>
                    <div className="text-text-muted mt-1"># Goal: Under 200KB for simple contracts</div>
                    <div className="text-text-muted"># Complex contracts: 200KB-500KB</div>
                  </div>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <span className="text-cyan-400">📊</span> Collection Performance
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Choose the right collection for your access pattern:
                  </p>
                  <div className="overflow-x-auto">
                    <div className="bg-black/30 rounded-lg p-4 border border-border min-w-fit">
                      <div className="grid grid-cols-4 gap-4 text-xs text-text-muted font-mono">
                        <div className="font-semibold text-text-primary">Collection</div>
                        <div className="font-semibold text-text-primary">Lookup</div>
                        <div className="font-semibold text-text-primary">Iterate</div>
                        <div className="font-semibold text-text-primary">Storage</div>
                        <div className="text-cyan-400">LookupMap</div><div className="text-near-green">O(1)</div><div className="text-red-400">❌</div><div className="text-near-green">Low</div>
                        <div className="text-cyan-400">UnorderedMap</div><div className="text-near-green">O(1)</div><div className="text-near-green">✅</div><div className="text-yellow-400">Medium</div>
                        <div className="text-cyan-400">Vector</div><div className="text-near-green">O(1)*</div><div className="text-near-green">✅</div><div className="text-near-green">Low</div>
                        <div className="text-cyan-400">LookupSet</div><div className="text-near-green">O(1)</div><div className="text-red-400">❌</div><div className="text-near-green">Lowest</div>
                        <div className="text-cyan-400">UnorderedSet</div><div className="text-near-green">O(1)</div><div className="text-near-green">✅</div><div className="text-yellow-400">Medium</div>
                        <div className="text-cyan-400">TreeMap</div><div className="text-yellow-400">O(log n)</div><div className="text-near-green">✅ sorted</div><div className="text-yellow-400">Medium</div>
                      </div>
                    </div>
                  </div>
                  <p className="text-text-muted text-xs mt-2">* Vector lookup is O(1) by index, but searching by value is O(n).</p>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <span className="text-green-400">⚡</span> Pagination Pattern
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Never return all items at once. Use pagination to keep gas costs predictable:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border">
                    <div><span className="text-purple-400">pub fn</span> <span className="text-near-green">get_polls</span>(&amp;self, from_index: u64, limit: u64) -&gt; Vec&lt;&amp;Poll&gt; {'{'}</div>
                    <div>    self.polls.iter()</div>
                    <div>        .skip(from_index <span className="text-purple-400">as</span> usize)</div>
                    <div>        .take(limit <span className="text-purple-400">as</span> usize)</div>
                    <div>        .collect()</div>
                    <div>{'}'}</div>
                  </div>
                </section>
              </div>
            )}

            {selectedTab === 'practice' && (
              <div className="space-y-6">
                <Card variant="default" padding="md" className="border-purple-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs font-bold text-purple-400">1</div>
                    <h5 className="font-semibold text-text-primary">Measure Gas Usage</h5>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    Call your contract methods and note the gas used in transaction receipts. Identify the most expensive operations.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-purple-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs font-bold text-purple-400">2</div>
                    <h5 className="font-semibold text-text-primary">Shrink Your WASM</h5>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    Apply the Cargo.toml optimizations. Compare the WASM size before and after. Try to get under 200KB.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-purple-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs font-bold text-purple-400">3</div>
                    <h5 className="font-semibold text-text-primary">Add Pagination</h5>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    Refactor any method that returns all items to use <code className="text-purple-400 bg-purple-500/10 px-1 rounded">from_index</code> and <code className="text-purple-400 bg-purple-500/10 px-1 rounded">limit</code> parameters.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-purple-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs font-bold text-purple-400">4</div>
                    <h5 className="font-semibold text-text-primary">Switch Collections</h5>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    Replace an <code className="text-purple-400 bg-purple-500/10 px-1 rounded">UnorderedMap</code> with a <code className="text-purple-400 bg-purple-500/10 px-1 rounded">LookupMap</code> where iteration isn&apos;t needed. Measure the storage savings.
                  </p>
                </Card>
              </div>
            )}

            {selectedTab === 'resources' && (
              <div className="space-y-3">
                {[
                  { title: 'Gas Advanced Concepts', url: 'https://docs.near.org/concepts/protocol/gas', desc: 'Deep dive into gas mechanics' },
                  { title: 'Storage Optimization', url: 'https://docs.near.org/build/smart-contracts/anatomy/storage', desc: 'Minimize on-chain storage costs' },
                  { title: 'WASM Size Tips', url: 'https://rustwasm.github.io/book/reference/code-size.html', desc: 'Rust WASM binary size optimization' },
                  { title: 'SDK Collections Guide', url: 'https://docs.near.org/build/smart-contracts/anatomy/collections', desc: 'Choose the right collection' },
                  { title: 'NEAR Gas Profile', url: 'https://docs.near.org/tools/gas-profile', desc: 'Profile gas usage of your methods' },
                  { title: 'Pagination Pattern', url: 'https://docs.near.org/build/smart-contracts/anatomy/collections#pagination', desc: 'Efficient data retrieval' },
                ].map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg bg-surface/50 border border-border hover:border-purple-500/30 transition-colors group"
                  >
                    <ExternalLink className="w-4 h-4 text-purple-400 group-hover:text-purple-300 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-medium text-text-primary group-hover:text-purple-300">{link.title}</div>
                      <div className="text-xs text-text-muted">{link.desc}</div>
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

export default Optimization;
