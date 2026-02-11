'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Database, ExternalLink, CheckCircle, HardDrive, Layers, Zap, BarChart3, AlertTriangle } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

interface AdvancedStorageProps {
  isActive: boolean;
  onToggle: () => void;
}

const AdvancedStorage: React.FC<AdvancedStorageProps> = ({ isActive, onToggle }) => {
  const [selectedTab, setSelectedTab] = useState<string>('overview');

  return (
    <Card variant="glass" padding="none" className="border-purple-500/20">
      <div
        onClick={onToggle}
        className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
            <Database className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Advanced Storage Patterns</h3>
            <p className="text-text-muted text-sm">Trie optimization, lazy loading, storage staking, and data architecture</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-red-500/10 text-red-300 border-red-500/20">Advanced</Badge>
          <Badge className="bg-purple-500/10 text-purple-300 border-purple-500/20">50 min</Badge>
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
                  <Database className="w-5 h-5 text-green-400" />
                  <h4 className="text-lg font-semibold text-text-primary">What You&apos;ll Learn</h4>
                </div>
                <ul className="space-y-3">
                  {[
                    'NEAR storage internals — trie keys, node structure, and proof generation',
                    'Collection types deep dive — when to use LookupMap vs UnorderedMap vs TreeMap',
                    'Lazy loading with LazyOption and custom patterns for large data structures',
                    'Storage staking economics and how to design storage-efficient contracts',
                    'Advanced patterns: upgradeable storage schemas, data migration, and versioning',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-text-secondary">
                      <CheckCircle className="w-4 h-4 text-near-green mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Card variant="default" padding="md" className="mt-4 border-green-500/20 bg-green-500/5">
                  <p className="text-sm text-text-secondary">
                    <span className="text-green-400 font-semibold">Why this matters:</span> Storage is the most expensive resource on NEAR. A poorly designed data structure can make your contract 10x more expensive. Senior NEAR developers optimize storage first, compute second.
                  </p>
                </Card>
              </div>
            )}

            {selectedTab === 'learn' && (
              <div className="space-y-8">
                {/* Section 1: Storage Internals */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <HardDrive className="w-5 h-5 text-blue-400" />
                    Storage Internals
                  </h4>
                  <p className="text-text-secondary mb-3">
                    NEAR stores contract state as key-value pairs in a Merkle-Patricia Trie. Each key-value pair is a trie node with overhead for the Merkle proof path.
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-text-secondary border border-border">
                    <div className="text-blue-400 mb-2">{'// How NEAR SDK collections map to trie keys'}</div>
                    <div className="text-near-green">{`// LookupMap with prefix "m":`}</div>
                    <div className="text-near-green">{`// Key "alice" → trie key: "m" + borsh(b"alice")`}</div>
                    <div className="text-near-green">{`// Key "bob"   → trie key: "m" + borsh(b"bob")`}</div>
                    <div className="mt-2 text-near-green">{`// UnorderedMap with prefix "u" adds an index:`}</div>
                    <div className="text-near-green">{`// "u" + borsh(key)   → value       (lookup)`}</div>
                    <div className="text-near-green">{`// "u" + INDEX_PREFIX + borsh(idx)  → key (enumeration)`}</div>
                    <div className="text-near-green">{`// "u" + LENGTH_PREFIX → u64          (length tracking)`}</div>
                    <div className="mt-2 text-text-muted">{`// Storage cost per entry:`}</div>
                    <div className="text-text-muted">{`// ~= key_bytes + value_bytes + 40 bytes trie overhead`}</div>
                    <div className="text-text-muted">{`// × 10^19 yoctoNEAR per byte`}</div>
                  </div>
                </section>

                {/* Section 2: Collection Selection Guide */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-purple-400" />
                    Collection Selection Guide
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Choosing the right collection type can reduce storage costs by 30-60%. Here&apos;s the decision matrix:
                  </p>
                  <div className="grid grid-cols-1 gap-3">
                    <Card variant="default" padding="md" className="border-green-500/20">
                      <h5 className="font-semibold text-green-400 text-sm mb-2">LookupMap — Lowest Overhead</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• <strong className="text-text-secondary">Use when:</strong> You only need get/set/remove by key</li>
                        <li>• <strong className="text-text-secondary">Overhead:</strong> Just key + value (no index)</li>
                        <li>• <strong className="text-text-secondary">Cannot:</strong> Iterate, count entries, or list keys</li>
                        <li>• <strong className="text-text-secondary">Best for:</strong> Balances, user settings, one-to-one mappings</li>
                      </ul>
                    </Card>
                    <Card variant="default" padding="md" className="border-blue-500/20">
                      <h5 className="font-semibold text-blue-400 text-sm mb-2">UnorderedMap — Enumerable</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• <strong className="text-text-secondary">Use when:</strong> You need iteration or pagination</li>
                        <li>• <strong className="text-text-secondary">Overhead:</strong> 2× storage per entry (value + index)</li>
                        <li>• <strong className="text-text-secondary">Trade-off:</strong> O(1) remove via swap-and-pop (order not preserved)</li>
                        <li>• <strong className="text-text-secondary">Best for:</strong> Token registries, enumerable NFT ownership</li>
                      </ul>
                    </Card>
                    <Card variant="default" padding="md" className="border-yellow-500/20">
                      <h5 className="font-semibold text-yellow-400 text-sm mb-2">TreeMap — Ordered</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• <strong className="text-text-secondary">Use when:</strong> You need sorted keys, range queries, min/max</li>
                        <li>• <strong className="text-text-secondary">Overhead:</strong> ~3× storage (AVL tree nodes)</li>
                        <li>• <strong className="text-text-secondary">Trade-off:</strong> O(log n) operations, highest overhead</li>
                        <li>• <strong className="text-text-secondary">Best for:</strong> Order books, leaderboards, priority queues</li>
                      </ul>
                    </Card>
                  </div>
                </section>

                {/* Section 3: Lazy Loading */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    Lazy Loading Patterns
                  </h4>
                  <p className="text-text-secondary mb-3">
                    By default, NEAR deserializes your entire contract state on every function call. For large contracts, this burns massive gas. Lazy loading defers deserialization until access.
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-text-secondary border border-border">
                    <div className="text-yellow-400 mb-2">{'// LazyOption: load only when needed'}</div>
                    <div className="text-near-green">{`use near_sdk::store::LazyOption;`}</div>
                    <div className="mt-1 text-near-green">{`#[near(contract_state)]`}</div>
                    <div className="text-near-green">{`pub struct Contract {`}</div>
                    <div className="text-near-green">{`    pub owner: AccountId,`}</div>
                    <div className="text-near-green">{`    // Always loaded (small)`}</div>
                    <div className="text-near-green">{`    pub config: Config,`}</div>
                    <div className="text-near-green">{`    // Only loaded when accessed (large)`}</div>
                    <div className="text-near-green">{`    pub metadata: LazyOption<ContractMetadata>,`}</div>
                    <div className="text-near-green">{`    // Collections are already lazy by default`}</div>
                    <div className="text-near-green">{`    pub tokens: LookupMap<TokenId, Token>,`}</div>
                    <div className="text-near-green">{`}`}</div>
                    <div className="mt-2 text-yellow-400">{'// Custom lazy pattern for versioned data'}</div>
                    <div className="text-near-green">{`impl Contract {`}</div>
                    <div className="text-near-green">{`    fn get_metadata(&self) -> ContractMetadata {`}</div>
                    <div className="text-near-green">{`        self.metadata.get().expect("Metadata not set")`}</div>
                    <div className="text-near-green">{`    }`}</div>
                    <div className="text-near-green">{`}`}</div>
                  </div>
                </section>

                {/* Section 4: Storage Staking Economics */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-cyan-400" />
                    Storage Staking Economics
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Every byte of storage costs 0.00001 NEAR in staked balance. This has profound implications for contract design:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Card variant="default" padding="md">
                      <h5 className="font-semibold text-text-primary text-sm mb-2">Cost Examples</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• 1 KB data = 0.01 NEAR staked</li>
                        <li>• 100 KB = 1 NEAR staked</li>
                        <li>• 1 MB = 10 NEAR staked</li>
                        <li>• NFT metadata (~500 bytes) = 0.005 NEAR</li>
                        <li>• FT balance entry (~100 bytes) = 0.001 NEAR</li>
                      </ul>
                    </Card>
                    <Card variant="default" padding="md">
                      <h5 className="font-semibold text-text-primary text-sm mb-2">Who Pays?</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• The account whose storage usage increases pays</li>
                        <li>• For contracts: the contract account pays</li>
                        <li>• Pattern: charge users <code className="text-purple-400">storage_deposit()</code></li>
                        <li>• NEP-145 Storage Management standard</li>
                        <li>• Freeing data → refund staked NEAR</li>
                      </ul>
                    </Card>
                  </div>
                </section>

                {/* Section 5: Data Migration */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-400" />
                    Storage Schema Migration
                  </h4>
                  <p className="text-text-secondary mb-3">
                    When you upgrade a contract, the old state must be compatible with the new schema. Here&apos;s the production pattern:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-text-secondary border border-border">
                    <div className="text-orange-400 mb-2">{'// Versioned state migration pattern'}</div>
                    <div className="text-near-green">{`#[derive(BorshDeserialize)]`}</div>
                    <div className="text-near-green">{`pub struct ContractV1 {`}</div>
                    <div className="text-near-green">{`    pub owner: AccountId,`}</div>
                    <div className="text-near-green">{`    pub tokens: UnorderedMap<TokenId, TokenV1>,`}</div>
                    <div className="text-near-green">{`}`}</div>
                    <div className="mt-2 text-near-green">{`#[near(contract_state)]`}</div>
                    <div className="text-near-green">{`pub struct Contract {  // V2`}</div>
                    <div className="text-near-green">{`    pub owner: AccountId,`}</div>
                    <div className="text-near-green">{`    pub tokens: UnorderedMap<TokenId, TokenV2>,`}</div>
                    <div className="text-near-green">{`    pub admin_list: LookupSet<AccountId>, // new field`}</div>
                    <div className="text-near-green">{`}`}</div>
                    <div className="mt-2 text-near-green">{`#[private]`}</div>
                    <div className="text-near-green">{`#[init(ignore_state)]`}</div>
                    <div className="text-near-green">{`pub fn migrate() -> Self {`}</div>
                    <div className="text-near-green">{`    let old: ContractV1 = env::state_read().expect("failed");`}</div>
                    <div className="text-near-green">{`    Self {`}</div>
                    <div className="text-near-green">{`        owner: old.owner,`}</div>
                    <div className="text-near-green">{`        tokens: old.tokens,  // same prefix = no migration`}</div>
                    <div className="text-near-green">{`        admin_list: LookupSet::new(b"a"),`}</div>
                    <div className="text-near-green">{`    }`}</div>
                    <div className="text-near-green">{`}`}</div>
                  </div>
                </section>
              </div>
            )}

            {selectedTab === 'practice' && (
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-text-primary">Exercises</h4>

                <Card variant="default" padding="md" className="border-red-500/20">
                  <h5 className="font-semibold text-red-400 text-sm mb-2">🔴 Exercise 1: Storage Benchmark</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Deploy a contract that writes 1000 entries using LookupMap, UnorderedMap, and TreeMap. Compare: total storage bytes, gas per insert, gas per lookup, and gas per iteration.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-red-500/20">
                  <h5 className="font-semibold text-red-400 text-sm mb-2">🔴 Exercise 2: Storage-Optimized NFT</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Design an NFT contract that stores metadata off-chain (IPFS) and only stores a hash on-chain. Calculate the storage savings vs storing full metadata. Implement NEP-145 storage deposits.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-red-500/20">
                  <h5 className="font-semibold text-red-400 text-sm mb-2">🔴 Exercise 3: Live Migration</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Deploy a V1 contract, populate it with data, then deploy V2 with a new field and a migration function. Verify all old data is preserved and new fields are initialized correctly. Do this on testnet.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-red-500/20">
                  <h5 className="font-semibold text-red-400 text-sm mb-2">🔴 Exercise 4: Paginated State Cleanup</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Write a contract function that cleans up expired entries from an UnorderedMap in batches (to avoid gas limits). Implement pagination and verify NEAR is refunded as storage is freed.
                  </p>
                </Card>
              </div>
            )}

            {selectedTab === 'resources' && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-text-primary">Resources</h4>
                {[
                  { title: 'NEAR Storage Staking', url: 'https://docs.near.org/concepts/storage/storage-staking', desc: 'Official docs on storage economics and staking model' },
                  { title: 'near-sdk Collections Guide', url: 'https://docs.near.org/sdk/rust/contract-structure/collections', desc: 'Complete guide to SDK storage collections' },
                  { title: 'NEP-145 Storage Management', url: 'https://nomicon.io/Standards/StorageManagement', desc: 'Standard for managing storage deposits in contracts' },
                  { title: 'Contract Upgrade & Migration', url: 'https://docs.near.org/sdk/rust/building/prototyping', desc: 'Patterns for upgrading contracts with state migration' },
                  { title: 'NEAR State Viewer', url: 'https://github.com/near/nearcore/tree/master/tools/state-viewer', desc: 'Tool for inspecting raw trie state' },
                  { title: 'Storage Optimization Techniques', url: 'https://docs.near.org/sdk/rust/contract-structure/nesting', desc: 'Nested collections and prefix optimization' },
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

export default AdvancedStorage;
