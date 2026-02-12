'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Terminal, ExternalLink, CheckCircle, Zap, Search, Send } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

interface NearCliMasteryProps {
  isActive: boolean;
  onToggle: () => void;
}

const NearCliMastery: React.FC<NearCliMasteryProps> = ({ isActive, onToggle }) => {
  const [selectedTab, setSelectedTab] = useState<string>('overview');

  return (
    <Card variant="glass" padding="none" className="border-purple-500/20">
      <div
        onClick={onToggle}
        className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
            <Terminal className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">NEAR CLI Mastery</h3>
            <p className="text-text-muted text-sm">Master the command line for accounts, contracts, and transactions</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-warning/10 text-warning border-warning/20">Intermediate</Badge>
          <Badge className="bg-purple-500/10 text-purple-300 border-purple-500/20">35 min</Badge>
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
                  <Terminal className="w-5 h-5 text-emerald-400" />
                  <h4 className="text-lg font-semibold text-text-primary">What You&apos;ll Learn</h4>
                </div>
                <ul className="space-y-3">
                  {[
                    'Account management — create, delete, view accounts and sub-accounts',
                    'Key management — add, delete, and rotate access keys',
                    'Contract operations — deploy, call view/change methods',
                    'Transaction inspection — view receipts, logs, and results',
                    'Network config — switch between testnet, mainnet, and custom RPC',
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
                    <Search className="w-5 h-5 text-blue-400" />
                    Account Operations
                  </h4>
                  <p className="text-text-secondary mb-3">
                    The CLI gives you full control over NEAR accounts:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border space-y-4">
                    <div>
                      <div className="text-text-muted"># View account details</div>
                      <div className="text-near-green">near account view-account-summary alice.testnet \</div>
                      <div className="text-near-green">  network-config testnet now</div>
                    </div>
                    <div>
                      <div className="text-text-muted"># Create a sub-account with initial balance</div>
                      <div className="text-near-green">near account create-account fund-myself \</div>
                      <div className="text-near-green">  app.alice.testnet &apos;5 NEAR&apos; \</div>
                      <div className="text-near-green">  autogenerate-new-keypair save-to-keychain \</div>
                      <div className="text-near-green">  sign-as alice.testnet network-config testnet \</div>
                      <div className="text-near-green">  sign-with-keychain send</div>
                    </div>
                    <div>
                      <div className="text-text-muted"># Delete an account (sends remaining balance to beneficiary)</div>
                      <div className="text-near-green">near account delete-account app.alice.testnet \</div>
                      <div className="text-near-green">  beneficiary-account alice.testnet \</div>
                      <div className="text-near-green">  network-config testnet sign-with-keychain send</div>
                    </div>
                  </div>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Send className="w-5 h-5 text-green-400" />
                    Calling Contract Methods
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Two types of calls: read-only (view) and state-changing (transaction):
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border space-y-4">
                    <div>
                      <div className="text-text-muted"># VIEW call — free, no signature needed</div>
                      <div className="text-near-green">near contract call-function as-read-only \</div>
                      <div className="text-near-green">  wrap.near ft_balance_of \</div>
                      <div className="text-near-green">  json-args &apos;{'{&quot;account_id&quot;: &quot;alice.near&quot;}'}&apos; \</div>
                      <div className="text-near-green">  network-config mainnet now</div>
                    </div>
                    <div>
                      <div className="text-text-muted"># CHANGE call — costs gas, requires signature</div>
                      <div className="text-near-green">near contract call-function as-transaction \</div>
                      <div className="text-near-green">  wrap.near near_deposit json-args &apos;{'{}'}&apos; \</div>
                      <div className="text-near-green">  prepaid-gas &apos;30 Tgas&apos; attached-deposit &apos;1 NEAR&apos; \</div>
                      <div className="text-near-green">  sign-as alice.testnet network-config testnet \</div>
                      <div className="text-near-green">  sign-with-keychain send</div>
                    </div>
                  </div>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    Deploy &amp; Manage Contracts
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Deploy WASM files and manage contract state:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border space-y-4">
                    <div>
                      <div className="text-text-muted"># Deploy a contract</div>
                      <div className="text-near-green">near contract deploy app.alice.testnet \</div>
                      <div className="text-near-green">  use-file ./target/near/my_contract.wasm \</div>
                      <div className="text-near-green">  without-init-call network-config testnet \</div>
                      <div className="text-near-green">  sign-with-keychain send</div>
                    </div>
                    <div>
                      <div className="text-text-muted"># Deploy with init call</div>
                      <div className="text-near-green">near contract deploy app.alice.testnet \</div>
                      <div className="text-near-green">  use-file ./target/near/my_contract.wasm \</div>
                      <div className="text-near-green">  with-init-call new \</div>
                      <div className="text-near-green">  json-args &apos;{'{&quot;owner_id&quot;: &quot;alice.testnet&quot;}'}&apos; \</div>
                      <div className="text-near-green">  prepaid-gas &apos;30 Tgas&apos; attached-deposit &apos;0 NEAR&apos; \</div>
                      <div className="text-near-green">  network-config testnet sign-with-keychain send</div>
                    </div>
                    <div>
                      <div className="text-text-muted"># View contract state (raw key-value pairs)</div>
                      <div className="text-near-green">near contract view-storage app.alice.testnet \</div>
                      <div className="text-near-green">  all as-text network-config testnet now</div>
                    </div>
                  </div>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <span className="text-purple-400">🔧</span> Token Transfers
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Send NEAR tokens between accounts:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border">
                    <div className="text-text-muted"># Transfer NEAR</div>
                    <div className="text-near-green">near tokens alice.testnet send-near bob.testnet \</div>
                    <div className="text-near-green">  &apos;2 NEAR&apos; network-config testnet \</div>
                    <div className="text-near-green">  sign-with-keychain send</div>
                  </div>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <span className="text-cyan-400">🌐</span> Network Configuration
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Switch between networks and configure custom RPC endpoints:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border">
                    <div className="text-text-muted"># Testnet (default for development)</div>
                    <div className="text-near-green">network-config testnet</div>
                    <div className="text-text-muted mt-2"># Mainnet (production)</div>
                    <div className="text-near-green">network-config mainnet</div>
                    <div className="text-text-muted mt-2"># Custom RPC endpoint</div>
                    <div className="text-near-green">near config add-connection --network-name custom \</div>
                    <div className="text-near-green">  --connection-name my-rpc \</div>
                    <div className="text-near-green">  --rpc-url https://rpc.example.com</div>
                  </div>
                </section>
              </div>
            )}

            {selectedTab === 'practice' && (
              <div className="space-y-6">
                <Card variant="default" padding="md" className="border-purple-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs font-bold text-purple-400">1</div>
                    <h5 className="font-semibold text-text-primary">Account Lifecycle</h5>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    Create a sub-account, deploy a contract to it, call a method, then delete the sub-account. Complete the full lifecycle.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-purple-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs font-bold text-purple-400">2</div>
                    <h5 className="font-semibold text-text-primary">Query Popular Contracts</h5>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    Use the CLI to query real mainnet contracts. Try reading the number of pools from <code className="text-purple-400 bg-purple-500/10 px-1 rounded">v2.ref-finance.near</code> or checking your wNEAR balance on <code className="text-purple-400 bg-purple-500/10 px-1 rounded">wrap.near</code>.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-purple-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs font-bold text-purple-400">3</div>
                    <h5 className="font-semibold text-text-primary">Key Rotation</h5>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    Add a new Full Access key to your testnet account, then delete the old one. This simulates key rotation — a security best practice.
                  </p>
                  <p className="text-text-muted text-xs mt-2">⚠️ Make sure the new key is saved before deleting the old one!</p>
                </Card>

                <Card variant="default" padding="md" className="border-purple-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs font-bold text-purple-400">4</div>
                    <h5 className="font-semibold text-text-primary">Inspect Raw Storage</h5>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    Deploy your greeting contract and use <code className="text-purple-400 bg-purple-500/10 px-1 rounded">view-storage</code> to see how the state looks as raw key-value pairs. Change the greeting and see the storage update.
                  </p>
                </Card>
              </div>
            )}

            {selectedTab === 'resources' && (
              <div className="space-y-3">
                {[
                  { title: 'NEAR CLI-RS Documentation', url: 'https://docs.near.org/tools/near-cli-rs', desc: 'Full reference for the Rust-based CLI' },
                  { title: 'NEAR CLI GitHub', url: 'https://github.com/near/near-cli-rs', desc: 'Source code and issue tracker' },
                  { title: 'CLI Interactive Mode', url: 'https://docs.near.org/tools/near-cli-rs', desc: 'Use interactive prompts for complex operations' },
                  { title: 'NEAR RPC API', url: 'https://docs.near.org/api/rpc/introduction', desc: 'What the CLI calls under the hood' },
                  { title: 'NearBlocks Explorer', url: 'https://nearblocks.io', desc: 'Verify transactions made via CLI' },
                  { title: 'NEAR Testnet Faucet', url: 'https://near-faucet.io', desc: 'Get testnet tokens for CLI experiments' },
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

export default NearCliMastery;
