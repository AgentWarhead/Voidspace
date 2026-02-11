'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Database, ExternalLink, CheckCircle, HardDrive, Layers, Archive } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

interface StateManagementProps {
  isActive: boolean;
  onToggle: () => void;
}

const StateManagement: React.FC<StateManagementProps> = ({ isActive, onToggle }) => {
  const [selectedTab, setSelectedTab] = useState<string>('overview');

  return (
    <Card variant="glass" padding="none" className="border-purple-500/20">
      <div
        onClick={onToggle}
        className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
            <Database className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">State Management</h3>
            <p className="text-text-muted text-sm">On-chain storage, persistent collections, and the storage staking model</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-warning/10 text-warning border-warning/20">Intermediate</Badge>
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
                  <HardDrive className="w-5 h-5 text-blue-400" />
                  <h4 className="text-lg font-semibold text-text-primary">What You&apos;ll Learn</h4>
                </div>
                <ul className="space-y-3">
                  {[
                    'How NEAR stores contract state in a key-value trie',
                    'NEAR SDK persistent collections: LookupMap, UnorderedMap, Vector, LookupSet',
                    'Storage staking — why you pay for bytes stored on-chain',
                    'Storage management pattern for user-funded storage',
                    'Serialization with Borsh and JSON',
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
                    <HardDrive className="w-5 h-5 text-blue-400" />
                    How State Works on NEAR
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Every smart contract has its own storage — a key-value store backed by a trie data structure. When your contract runs, the SDK automatically serializes your struct to storage and deserializes it when loaded.
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border">
                    <div className="text-text-muted">{'// Your contract state — automatically persisted'}</div>
                    <div><span className="text-purple-400">#[near(contract_state)]</span></div>
                    <div><span className="text-purple-400">pub struct</span> <span className="text-cyan-400">MyContract</span> {'{'}</div>
                    <div>    owner: <span className="text-cyan-400">AccountId</span>,</div>
                    <div>    total_supply: <span className="text-cyan-400">u128</span>,</div>
                    <div>    is_paused: <span className="text-cyan-400">bool</span>,</div>
                    <div>{'}'}</div>
                    <div className="mt-2 text-text-muted">{'// After every change method, the SDK writes this back to storage'}</div>
                    <div className="text-text-muted">{'// After every view method, the state is loaded but NOT written back'}</div>
                  </div>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-purple-400" />
                    Persistent Collections
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Standard Rust collections (<code className="text-purple-400 bg-purple-500/10 px-1 rounded">Vec</code>, <code className="text-purple-400 bg-purple-500/10 px-1 rounded">HashMap</code>) load ALL data into memory at once. NEAR&apos;s persistent collections only load what you access — critical for large datasets.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                    <Card variant="default" padding="md">
                      <h5 className="font-semibold text-cyan-400 text-sm mb-2">LookupMap&lt;K, V&gt;</h5>
                      <p className="text-xs text-text-muted mb-1">Key-value store. Fast O(1) reads. Not iterable.</p>
                      <code className="text-near-green text-xs">balances: LookupMap&lt;AccountId, u128&gt;</code>
                    </Card>
                    <Card variant="default" padding="md">
                      <h5 className="font-semibold text-cyan-400 text-sm mb-2">UnorderedMap&lt;K, V&gt;</h5>
                      <p className="text-xs text-text-muted mb-1">Key-value store. Iterable. Slightly more storage.</p>
                      <code className="text-near-green text-xs">metadata: UnorderedMap&lt;String, String&gt;</code>
                    </Card>
                    <Card variant="default" padding="md">
                      <h5 className="font-semibold text-cyan-400 text-sm mb-2">Vector&lt;T&gt;</h5>
                      <p className="text-xs text-text-muted mb-1">Ordered list. Index-based access. Iterable.</p>
                      <code className="text-near-green text-xs">members: Vector&lt;AccountId&gt;</code>
                    </Card>
                    <Card variant="default" padding="md">
                      <h5 className="font-semibold text-cyan-400 text-sm mb-2">LookupSet&lt;T&gt;</h5>
                      <p className="text-xs text-text-muted mb-1">Unique values. Check membership. Not iterable.</p>
                      <code className="text-near-green text-xs">whitelist: LookupSet&lt;AccountId&gt;</code>
                    </Card>
                  </div>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border">
                    <div><span className="text-purple-400">use</span> near_sdk::store::{'{'}LookupMap, Vector{'}'};</div>
                    <div className="mt-2"><span className="text-purple-400">#[near(contract_state)]</span></div>
                    <div><span className="text-purple-400">pub struct</span> <span className="text-cyan-400">TokenRegistry</span> {'{'}</div>
                    <div>    <span className="text-text-muted">{'// Each collection needs a unique prefix (storage key)'}</span></div>
                    <div>    balances: LookupMap&lt;AccountId, <span className="text-cyan-400">u128</span>&gt;,</div>
                    <div>    holders: Vector&lt;AccountId&gt;,</div>
                    <div>{'}'}</div>
                    <div className="mt-2"><span className="text-purple-400">impl</span> Default <span className="text-purple-400">for</span> <span className="text-cyan-400">TokenRegistry</span> {'{'}</div>
                    <div>    <span className="text-purple-400">fn</span> <span className="text-near-green">default</span>() -&gt; Self {'{'}</div>
                    <div>        Self {'{'}</div>
                    <div>            balances: LookupMap::new(<span className="text-yellow-300">b&quot;b&quot;</span>),</div>
                    <div>            holders: Vector::new(<span className="text-yellow-300">b&quot;h&quot;</span>),</div>
                    <div>        {'}'}</div>
                    <div>    {'}'}</div>
                    <div>{'}'}</div>
                  </div>
                  <p className="text-text-muted text-sm mt-2">
                    ⚠️ Each collection MUST have a unique prefix byte. If two collections share a prefix, they&apos;ll corrupt each other&apos;s data.
                  </p>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <span className="text-yellow-400">💰</span> Storage Staking
                  </h4>
                  <p className="text-text-secondary mb-3">
                    NEAR charges ~0.00001 NEAR per byte stored on-chain. This NEAR is locked (not burned) — you get it back when you delete the data.
                  </p>
                  <div className="bg-black/30 rounded-lg p-4 border border-border">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="text-text-muted">100 bytes</div>
                      <div className="text-near-green">~0.001 NEAR locked</div>
                      <div className="text-text-muted">1 KB</div>
                      <div className="text-near-green">~0.01 NEAR locked</div>
                      <div className="text-text-muted">100 KB</div>
                      <div className="text-near-green">~1 NEAR locked</div>
                      <div className="text-text-muted">1 MB</div>
                      <div className="text-near-green">~10 NEAR locked</div>
                    </div>
                  </div>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Archive className="w-5 h-5 text-orange-400" />
                    Storage Management Pattern
                  </h4>
                  <p className="text-text-secondary mb-3">
                    For contracts where users store data (like NFT or FT contracts), use the Storage Management standard (NEP-145) so users pay for their own storage:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border">
                    <div className="text-text-muted">{'// User registers and deposits NEAR to cover storage'}</div>
                    <div><span className="text-purple-400">#[payable]</span></div>
                    <div><span className="text-purple-400">pub fn</span> <span className="text-near-green">storage_deposit</span>(&amp;<span className="text-purple-400">mut</span> self) {'{'}</div>
                    <div>    <span className="text-purple-400">let</span> account_id = env::predecessor_account_id();</div>
                    <div>    <span className="text-purple-400">let</span> deposit = env::attached_deposit();</div>
                    <div>    <span className="text-text-muted">{'// Register user &amp; lock deposit for storage'}</span></div>
                    <div>    require!(deposit &gt;= STORAGE_COST, <span className="text-yellow-300">&quot;Insufficient deposit&quot;</span>);</div>
                    <div>    self.accounts.insert(&amp;account_id, &amp;0u128);</div>
                    <div>{'}'}</div>
                  </div>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <span className="text-green-400">📦</span> Serialization: Borsh vs JSON
                  </h4>
                  <p className="text-text-secondary mb-3">
                    NEAR supports two serialization formats for method arguments and storage:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Card variant="default" padding="md" className="border-blue-500/20">
                      <h5 className="font-semibold text-blue-400 text-sm mb-2">Borsh (Default)</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• Binary format — compact &amp; fast</li>
                        <li>• Used for contract state storage</li>
                        <li>• Used by default for method args</li>
                        <li>• Not human-readable</li>
                      </ul>
                    </Card>
                    <Card variant="default" padding="md" className="border-green-500/20">
                      <h5 className="font-semibold text-green-400 text-sm mb-2">JSON</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• Human-readable</li>
                        <li>• Better for frontend integration</li>
                        <li>• Enable with <code className="text-purple-400">#[serde(crate = &quot;...&quot;)]</code></li>
                        <li>• Slightly larger than Borsh</li>
                      </ul>
                    </Card>
                  </div>
                </section>
              </div>
            )}

            {selectedTab === 'practice' && (
              <div className="space-y-6">
                <Card variant="default" padding="md" className="border-purple-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs font-bold text-purple-400">1</div>
                    <h5 className="font-semibold text-text-primary">Build a Contact Book</h5>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    Create a contract that stores name→account mappings using <code className="text-purple-400 bg-purple-500/10 px-1 rounded">LookupMap</code>. Add methods: <code className="text-purple-400 bg-purple-500/10 px-1 rounded">add_contact</code>, <code className="text-purple-400 bg-purple-500/10 px-1 rounded">get_contact</code>, <code className="text-purple-400 bg-purple-500/10 px-1 rounded">remove_contact</code>.
                  </p>
                  <p className="text-text-muted text-xs mt-2">💡 Remember: each user should only modify their own contacts. Use <code className="text-purple-400 bg-purple-500/10 px-1 rounded">env::predecessor_account_id()</code>.</p>
                </Card>

                <Card variant="default" padding="md" className="border-purple-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs font-bold text-purple-400">2</div>
                    <h5 className="font-semibold text-text-primary">Measure Storage Costs</h5>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    Deploy your contact book and add entries. Use <code className="text-purple-400 bg-purple-500/10 px-1 rounded">env::storage_usage()</code> before and after each insert to measure bytes used.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-purple-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs font-bold text-purple-400">3</div>
                    <h5 className="font-semibold text-text-primary">Switch Collections</h5>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    Replace <code className="text-purple-400 bg-purple-500/10 px-1 rounded">LookupMap</code> with <code className="text-purple-400 bg-purple-500/10 px-1 rounded">UnorderedMap</code> and add a <code className="text-purple-400 bg-purple-500/10 px-1 rounded">get_all_contacts</code> method that returns all entries. Compare the storage difference.
                  </p>
                </Card>
              </div>
            )}

            {selectedTab === 'resources' && (
              <div className="space-y-3">
                {[
                  { title: 'Contract State & Storage', url: 'https://docs.near.org/build/smart-contracts/anatomy/storage', desc: 'How state works on NEAR' },
                  { title: 'SDK Collections', url: 'https://docs.near.org/build/smart-contracts/anatomy/collections', desc: 'LookupMap, Vector, UnorderedMap, etc.' },
                  { title: 'Storage Staking', url: 'https://docs.near.org/concepts/storage/storage-staking', desc: 'Storage cost model explained' },
                  { title: 'NEP-145 Storage Management', url: 'https://nomicon.io/Standards/StorageManagement', desc: 'Standard for user-funded storage' },
                  { title: 'Borsh Serialization', url: 'https://borsh.io/', desc: 'Binary Object Representation Serializer for Hashing' },
                  { title: 'NEAR SDK store module', url: 'https://docs.rs/near-sdk/latest/near_sdk/store/', desc: 'Full API reference for collections' },
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

export default StateManagement;
