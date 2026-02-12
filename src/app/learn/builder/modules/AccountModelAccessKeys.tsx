'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Key, ExternalLink, CheckCircle, Shield, Users, Lock, Fingerprint } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

interface AccountModelAccessKeysProps {
  isActive: boolean;
  onToggle: () => void;
}

const AccountModelAccessKeys: React.FC<AccountModelAccessKeysProps> = ({ isActive, onToggle }) => {
  const [selectedTab, setSelectedTab] = useState<string>('overview');

  return (
    <Card variant="glass" padding="none" className="border-purple-500/20">
      <div
        onClick={onToggle}
        className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
            <Key className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Account Model &amp; Access Keys</h3>
            <p className="text-text-muted text-sm">Understand NEAR&apos;s unique account system and key-based permissions</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-warning/10 text-warning border-warning/20">Intermediate</Badge>
          <Badge className="bg-purple-500/10 text-purple-300 border-purple-500/20">40 min</Badge>
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
                  <Fingerprint className="w-5 h-5 text-yellow-400" />
                  <h4 className="text-lg font-semibold text-text-primary">What You&apos;ll Learn</h4>
                </div>
                <ul className="space-y-3">
                  {[
                    'NEAR\'s human-readable account model (alice.near vs 0x7a3f...)',
                    'Named accounts, sub-accounts, and implicit accounts',
                    'Full Access Keys vs Function Call Access Keys',
                    'How dApps use Function Call keys for seamless UX',
                    'Managing access keys programmatically in your contracts',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-text-secondary">
                      <CheckCircle className="w-4 h-4 text-near-green mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Card variant="default" padding="md" className="mt-4 border-yellow-500/20 bg-yellow-500/5">
                  <p className="text-sm text-text-secondary">
                    <span className="text-yellow-400 font-semibold">Why this matters:</span> NEAR&apos;s account model is one of its biggest differentiators. Understanding it unlocks UX patterns impossible on other chains.
                  </p>
                </Card>
              </div>
            )}

            {selectedTab === 'learn' && (
              <div className="space-y-8">
                {/* Section 1: Account Types */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-400" />
                    Account Types
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Unlike Ethereum&apos;s hex addresses, NEAR uses human-readable account names. There are three types:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Card variant="default" padding="md">
                      <h5 className="font-semibold text-text-primary mb-2 text-sm">Named Accounts</h5>
                      <code className="text-near-green text-xs bg-black/30 px-2 py-1 rounded block mb-2">alice.near</code>
                      <p className="text-xs text-text-muted">Human-readable, registered on-chain. 2-64 characters.</p>
                    </Card>
                    <Card variant="default" padding="md">
                      <h5 className="font-semibold text-text-primary mb-2 text-sm">Sub-accounts</h5>
                      <code className="text-near-green text-xs bg-black/30 px-2 py-1 rounded block mb-2">app.alice.near</code>
                      <p className="text-xs text-text-muted">Created by parent account. Great for contract deployment.</p>
                    </Card>
                    <Card variant="default" padding="md">
                      <h5 className="font-semibold text-text-primary mb-2 text-sm">Implicit Accounts</h5>
                      <code className="text-near-green text-xs bg-black/30 px-2 py-1 rounded block mb-2 truncate">98793cd91a...</code>
                      <p className="text-xs text-text-muted">64-char hex, derived from public key. Like Ethereum addresses.</p>
                    </Card>
                  </div>
                  <Card variant="default" padding="md" className="mt-3 border-cyan-500/20 bg-cyan-500/5">
                    <p className="text-sm text-text-secondary">
                      <span className="text-cyan-400 font-semibold">Sub-account pattern:</span> Deploy contracts to sub-accounts like <code className="text-purple-400 bg-purple-500/10 px-1 rounded">nft.myapp.near</code> or <code className="text-purple-400 bg-purple-500/10 px-1 rounded">ft.myapp.near</code>. Only <code className="text-purple-400 bg-purple-500/10 px-1 rounded">myapp.near</code> can create them.
                    </p>
                  </Card>
                </section>

                {/* Section 2: Access Keys */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Key className="w-5 h-5 text-yellow-400" />
                    Access Key Types
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Each NEAR account can have multiple access keys. This is unique to NEAR and enables powerful UX patterns.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card variant="default" padding="md" className="border-red-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Lock className="w-4 h-4 text-red-400" />
                        <h5 className="font-semibold text-red-400 text-sm">Full Access Key</h5>
                      </div>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• Can do <strong className="text-text-secondary">anything</strong> — deploy, transfer, delete</li>
                        <li>• Like a master password</li>
                        <li>• Usually stored in wallet (browser/hardware)</li>
                        <li>• Can add/remove other keys</li>
                        <li>• Can delete the account entirely</li>
                      </ul>
                    </Card>
                    <Card variant="default" padding="md" className="border-green-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-4 h-4 text-green-400" />
                        <h5 className="font-semibold text-green-400 text-sm">Function Call Access Key</h5>
                      </div>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• Limited to specific contract + methods</li>
                        <li>• Has an allowance (gas budget)</li>
                        <li>• Cannot transfer NEAR or deploy code</li>
                        <li>• Perfect for dApp sessions</li>
                        <li>• Can be created by any Full Access key</li>
                      </ul>
                    </Card>
                  </div>
                </section>

                {/* Section 3: Function Call Keys in Action */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <span className="text-green-400">🔑</span> Function Call Keys in Action
                  </h4>
                  <p className="text-text-secondary mb-3">
                    When a user connects to a dApp, the wallet creates a Function Call key scoped to that app&apos;s contract. This means:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border">
                    <div className="text-text-muted">{'// Adding a Function Call key via CLI'}</div>
                    <div className="text-near-green">near account add-key your-account.testnet \</div>
                    <div className="text-near-green">  grant-function-call-access \</div>
                    <div className="text-near-green">  --allowance &apos;1 NEAR&apos; \</div>
                    <div className="text-near-green">  --receiver-account-id game.example.near \</div>
                    <div className="text-near-green">  --method-names &apos;play,claim_reward&apos; \</div>
                    <div className="text-near-green">  use-manually-provided-public-key &apos;ed25519:...&apos; \</div>
                    <div className="text-near-green">  network-config testnet sign-with-keychain send</div>
                  </div>
                  <div className="mt-3 bg-black/30 rounded-lg p-4 border border-border">
                    <p className="text-sm text-text-secondary mb-2 font-semibold">This key can:</p>
                    <ul className="text-xs text-text-muted space-y-1">
                      <li className="flex items-center gap-2"><span className="text-near-green">✓</span> Call <code className="text-purple-400">play</code> and <code className="text-purple-400">claim_reward</code> on <code className="text-purple-400">game.example.near</code></li>
                      <li className="flex items-center gap-2"><span className="text-near-green">✓</span> Spend up to 1 NEAR in gas</li>
                      <li className="flex items-center gap-2"><span className="text-red-400">✕</span> Cannot transfer NEAR from the account</li>
                      <li className="flex items-center gap-2"><span className="text-red-400">✕</span> Cannot call other contracts</li>
                      <li className="flex items-center gap-2"><span className="text-red-400">✕</span> Cannot deploy code or delete the account</li>
                    </ul>
                  </div>
                </section>

                {/* Section 4: Managing Keys in Contracts */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <span className="text-purple-400">⚙️</span> Managing Keys in Contracts
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Contracts can programmatically add and remove keys using Promises:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border">
                    <div className="text-text-muted">{'// Add a Function Call key from within a contract'}</div>
                    <div><span className="text-purple-400">use</span> near_sdk::{'{'}Promise, PublicKey{'}'};</div>
                    <div className="mt-2"><span className="text-purple-400">pub fn</span> <span className="text-near-green">grant_access</span>(&amp;<span className="text-purple-400">mut</span> self, public_key: PublicKey) {'{'}</div>
                    <div>    Promise::new(env::current_account_id())</div>
                    <div>        .add_access_key_allowance(</div>
                    <div>            public_key,</div>
                    <div>            Allowance::limited(near_sdk::NearToken::from_near(1)).unwrap(),</div>
                    <div>            env::current_account_id(),</div>
                    <div>            <span className="text-yellow-300">&quot;play,claim_reward&quot;</span>.to_string(),</div>
                    <div>        );</div>
                    <div>{'}'}</div>
                  </div>
                </section>

                {/* Section 5: Account Storage */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <span className="text-orange-400">💾</span> Storage &amp; Account Balance
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Every NEAR account pays for its own storage. Each byte costs ~0.00001 NEAR (locked, not spent). This is called the <strong>storage staking</strong> model.
                  </p>
                  <div className="bg-black/30 rounded-lg p-4 border border-border">
                    <div className="flex flex-col gap-2 text-sm text-text-secondary">
                      <div className="flex items-center gap-2"><span className="text-near-green font-mono">→</span> Account name: ~0.1 NEAR locked</div>
                      <div className="flex items-center gap-2"><span className="text-near-green font-mono">→</span> Each access key: ~0.0004 NEAR locked</div>
                      <div className="flex items-center gap-2"><span className="text-near-green font-mono">→</span> Contract code: varies by WASM size</div>
                      <div className="flex items-center gap-2"><span className="text-near-green font-mono">→</span> Contract state: varies by data stored</div>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {selectedTab === 'practice' && (
              <div className="space-y-6">
                <Card variant="default" padding="md" className="border-purple-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs font-bold text-purple-400">1</div>
                    <h5 className="font-semibold text-text-primary">Explore Your Account Keys</h5>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    List all access keys on your testnet account and identify each type:
                  </p>
                  <div className="bg-black/40 rounded-lg p-3 font-mono text-sm text-text-secondary border border-border">
                    <div>near account list-keys your-account.testnet network-config testnet now</div>
                  </div>
                  <p className="text-text-muted text-xs mt-2">💡 Look for &quot;FullAccess&quot; vs &quot;FunctionCall&quot; in the output.</p>
                </Card>

                <Card variant="default" padding="md" className="border-purple-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs font-bold text-purple-400">2</div>
                    <h5 className="font-semibold text-text-primary">Create a Sub-account</h5>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    Create a sub-account and deploy a contract to it:
                  </p>
                  <div className="bg-black/40 rounded-lg p-3 font-mono text-sm text-text-secondary border border-border">
                    <div>near account create-account fund-myself contract.your-account.testnet \</div>
                    <div>  &apos;1 NEAR&apos; autogenerate-new-keypair save-to-keychain \</div>
                    <div>  sign-as your-account.testnet network-config testnet \</div>
                    <div>  sign-with-keychain send</div>
                  </div>
                </Card>

                <Card variant="default" padding="md" className="border-purple-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs font-bold text-purple-400">3</div>
                    <h5 className="font-semibold text-text-primary">Add a Function Call Key</h5>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    Manually add a Function Call key to your account, scoped to your deployed greeting contract. Verify it appears in <code className="text-purple-400 bg-purple-500/10 px-1 rounded">list-keys</code>.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-purple-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs font-bold text-purple-400">4</div>
                    <h5 className="font-semibold text-text-primary">Delete the Full Access Key</h5>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    On a <strong>test sub-account</strong> (NOT your main account!), delete the full access key to make the contract &quot;locked&quot; (immutable).
                  </p>
                  <p className="text-text-muted text-xs mt-2">⚠️ Once removed, you can never deploy new code to that account. This is a real pattern used in production for trust.</p>
                </Card>
              </div>
            )}

            {selectedTab === 'resources' && (
              <div className="space-y-3">
                {[
                  { title: 'NEAR Account Model', url: 'https://docs.near.org/concepts/protocol/account-model', desc: 'Official deep dive into accounts' },
                  { title: 'Access Keys', url: 'https://docs.near.org/concepts/protocol/access-keys', desc: 'Full Access vs Function Call keys' },
                  { title: 'Account ID Rules', url: 'https://docs.near.org/build/smart-contracts/anatomy/anatomy', desc: 'Naming rules and sub-accounts' },
                  { title: 'Storage Staking', url: 'https://docs.near.org/concepts/storage/storage-staking', desc: 'How storage costs work' },
                  { title: 'NEAR CLI Keys Management', url: 'https://docs.near.org/tools/near-cli', desc: 'Managing keys via CLI' },
                  { title: 'Wallet Selector', url: 'https://github.com/near/wallet-selector', desc: 'Connect dApps to NEAR wallets' },
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

export default AccountModelAccessKeys;
