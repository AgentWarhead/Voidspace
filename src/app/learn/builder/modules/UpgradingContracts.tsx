'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, RefreshCw, ExternalLink, CheckCircle, ArrowUpCircle, Database, AlertTriangle } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

interface UpgradingContractsProps {
  isActive: boolean;
  onToggle: () => void;
}

const UpgradingContracts: React.FC<UpgradingContractsProps> = ({ isActive, onToggle }) => {
  const [selectedTab, setSelectedTab] = useState<string>('overview');

  return (
    <Card variant="glass" padding="none" className="border-purple-500/20">
      <div
        onClick={onToggle}
        className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
            <RefreshCw className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Upgrading Contracts</h3>
            <p className="text-text-muted text-sm">State migration, versioning, and safe upgrade patterns</p>
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
                  <ArrowUpCircle className="w-5 h-5 text-cyan-400" />
                  <h4 className="text-lg font-semibold text-text-primary">What You&apos;ll Learn</h4>
                </div>
                <ul className="space-y-3">
                  {[
                    'Why contracts need upgrades and how NEAR handles redeployment',
                    'State migration — updating your struct without losing data',
                    'The versioned state pattern for smooth migrations',
                    'Using #[init(ignore_state)] for migration methods',
                    'Locking contracts — when and how to remove upgrade capability',
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
                    <span className="text-blue-400">🔄</span> How Contract Upgrades Work
                  </h4>
                  <p className="text-text-secondary mb-3">
                    On NEAR, you can redeploy new WASM code to an existing account. The code changes, but the state (stored data) remains. This is powerful but dangerous:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Card variant="default" padding="md" className="border-green-500/20">
                      <h5 className="text-sm font-semibold text-green-400 mb-2">✅ Safe to Change</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• Add new methods</li>
                        <li>• Add new fields (with migration)</li>
                        <li>• Fix bugs in existing methods</li>
                        <li>• Add new events/logging</li>
                      </ul>
                    </Card>
                    <Card variant="default" padding="md" className="border-red-500/20">
                      <h5 className="text-sm font-semibold text-red-400 mb-2">❌ Will Break</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• Remove existing fields</li>
                        <li>• Change field types</li>
                        <li>• Reorder fields (Borsh is order-dependent)</li>
                        <li>• Change collection prefixes</li>
                      </ul>
                    </Card>
                  </div>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Database className="w-5 h-5 text-purple-400" />
                    State Migration Pattern
                  </h4>
                  <p className="text-text-secondary mb-3">
                    When you need to change the contract struct, use a migration method:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border">
                    <div className="text-text-muted">// Old contract state (v1)</div>
                    <div><span className="text-purple-400">pub struct</span> <span className="text-cyan-400">ContractV1</span> {'{'}</div>
                    <div>    owner: AccountId,</div>
                    <div>    greeting: String,</div>
                    <div>{'}'}</div>
                    <div className="mt-3 text-text-muted">// New contract state (v2) — added a field</div>
                    <div><span className="text-purple-400">#[near(contract_state)]</span></div>
                    <div><span className="text-purple-400">pub struct</span> <span className="text-cyan-400">Contract</span> {'{'}</div>
                    <div>    owner: AccountId,</div>
                    <div>    greeting: String,</div>
                    <div>    visit_count: <span className="text-cyan-400">u64</span>,  <span className="text-text-muted">// ← new field</span></div>
                    <div>{'}'}</div>
                    <div className="mt-3 text-text-muted">// Migration method — called once after redeployment</div>
                    <div><span className="text-purple-400">#[near]</span></div>
                    <div><span className="text-purple-400">impl</span> <span className="text-cyan-400">Contract</span> {'{'}</div>
                    <div>    <span className="text-purple-400">#[init(ignore_state)]</span></div>
                    <div>    <span className="text-purple-400">pub fn</span> <span className="text-near-green">migrate</span>() -&gt; Self {'{'}</div>
                    <div>        <span className="text-text-muted">// Load old state</span></div>
                    <div>        <span className="text-purple-400">let</span> old: ContractV1 = env::state_read().unwrap();</div>
                    <div>        <span className="text-text-muted">// Return new state with migrated data</span></div>
                    <div>        Self {'{'}</div>
                    <div>            owner: old.owner,</div>
                    <div>            greeting: old.greeting,</div>
                    <div>            visit_count: 0, <span className="text-text-muted">// Initialize new field</span></div>
                    <div>        {'}'}</div>
                    <div>    {'}'}</div>
                    <div>{'}'}</div>
                  </div>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <span className="text-green-400">📦</span> Versioned State Pattern
                  </h4>
                  <p className="text-text-secondary mb-3">
                    For contracts that will undergo multiple upgrades, use an enum-based versioning pattern:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border">
                    <div><span className="text-purple-400">#[near(contract_state)]</span></div>
                    <div><span className="text-purple-400">enum</span> <span className="text-cyan-400">VersionedContract</span> {'{'}</div>
                    <div>    V1(ContractV1),</div>
                    <div>    V2(ContractV2),</div>
                    <div>    V3(ContractV3), <span className="text-text-muted">// Latest</span></div>
                    <div>{'}'}</div>
                    <div className="mt-2"><span className="text-purple-400">impl</span> <span className="text-cyan-400">VersionedContract</span> {'{'}</div>
                    <div>    <span className="text-purple-400">fn</span> <span className="text-near-green">migrate_to_latest</span>(self) -&gt; ContractV3 {'{'}</div>
                    <div>        <span className="text-purple-400">match</span> self {'{'}</div>
                    <div>            Self::V1(v1) =&gt; v1.upgrade_to_v2().upgrade_to_v3(),</div>
                    <div>            Self::V2(v2) =&gt; v2.upgrade_to_v3(),</div>
                    <div>            Self::V3(v3) =&gt; v3,</div>
                    <div>        {'}'}</div>
                    <div>    {'}'}</div>
                    <div>{'}'}</div>
                  </div>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <span className="text-orange-400">🚀</span> Deploy &amp; Migrate
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Deploy the new code and call the migration method:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border">
                    <div className="text-text-muted"># Deploy new code WITH init call to migrate</div>
                    <div className="text-near-green">near contract deploy your-contract.testnet \</div>
                    <div className="text-near-green">  use-file ./target/near/contract_v2.wasm \</div>
                    <div className="text-near-green">  with-init-call migrate json-args &apos;{'{}'}&apos; \</div>
                    <div className="text-near-green">  prepaid-gas &apos;100 Tgas&apos; attached-deposit &apos;0 NEAR&apos; \</div>
                    <div className="text-near-green">  network-config testnet sign-with-keychain send</div>
                  </div>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    Locking a Contract
                  </h4>
                  <p className="text-text-secondary mb-3">
                    To make a contract permanently immutable, delete all full access keys:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border">
                    <div className="text-text-muted"># ⚠️ IRREVERSIBLE — no more code updates possible</div>
                    <div className="text-near-green">near account delete-key your-contract.near \</div>
                    <div className="text-near-green">  public-key ed25519:YOUR_FULL_ACCESS_KEY \</div>
                    <div className="text-near-green">  network-config mainnet sign-with-keychain send</div>
                  </div>
                  <p className="text-text-muted text-sm mt-2">
                    This is done on production contracts to prove to users that the code cannot be changed. Many DeFi protocols do this after thorough auditing.
                  </p>
                </section>
              </div>
            )}

            {selectedTab === 'practice' && (
              <div className="space-y-6">
                <Card variant="default" padding="md" className="border-purple-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs font-bold text-purple-400">1</div>
                    <h5 className="font-semibold text-text-primary">Perform a Migration</h5>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    Deploy your greeting contract (v1), add some state, then deploy v2 with a new field and a migrate method. Verify old data is preserved.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-purple-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs font-bold text-purple-400">2</div>
                    <h5 className="font-semibold text-text-primary">Break a Migration (On Purpose)</h5>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    Deploy v2 WITHOUT a migration method. See the &quot;Cannot deserialize&quot; error. Understand why migration methods are essential.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-purple-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs font-bold text-purple-400">3</div>
                    <h5 className="font-semibold text-text-primary">Implement Versioned State</h5>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    Refactor your contract to use the versioned enum pattern. Add V1 and V2 variants with automatic migration.
                  </p>
                </Card>
              </div>
            )}

            {selectedTab === 'resources' && (
              <div className="space-y-3">
                {[
                  { title: 'Contract Upgrades Guide', url: 'https://docs.near.org/build/smart-contracts/release/upgrade', desc: 'Official upgrade documentation' },
                  { title: 'State Migration', url: 'https://docs.near.org/build/smart-contracts/release/upgrade#state-migration', desc: 'How to migrate contract state' },
                  { title: 'Locking Contracts', url: 'https://docs.near.org/build/smart-contracts/release/lock', desc: 'Making contracts immutable' },
                  { title: 'Versioned State Example', url: 'https://github.com/near-examples', desc: 'Real-world versioned state patterns' },
                  { title: 'Borsh Serialization', url: 'https://borsh.io/', desc: 'Why field order matters' },
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

export default UpgradingContracts;
