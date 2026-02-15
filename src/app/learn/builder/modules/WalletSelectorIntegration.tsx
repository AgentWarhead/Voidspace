'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Wallet, ExternalLink, CheckCircle, LogIn, Send, Settings } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

interface WalletSelectorIntegrationProps {
  isActive: boolean;
  onToggle: () => void;
}

const WalletSelectorIntegration: React.FC<WalletSelectorIntegrationProps> = ({ isActive, onToggle }) => {
  const [selectedTab, setSelectedTab] = useState<string>('overview');

  return (
    <Card variant="glass" padding="none" className="border-purple-500/20">
      <div
        onClick={onToggle}
        className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Wallet Selector Integration</h3>
            <p className="text-text-muted text-sm">Multi-wallet support with sign-in flows and transaction signing UX</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-warning/10 text-warning border-warning/20">Intermediate</Badge>
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
                  <Wallet className="w-5 h-5 text-orange-400" />
                  <h4 className="text-lg font-semibold text-text-primary">What You&apos;ll Learn</h4>
                </div>
                <ul className="space-y-3">
                  {[
                    'Set up @hot-labs/near-connect — the secure, zero-dependency wallet connector',
                    'Support 9+ NEAR wallets: HOT, Meteor, MyNearWallet, Nightly, OKX, and more',
                    'Implement sign-in and sign-out flows with event-driven state management',
                    'Transaction signing UX patterns for change methods and batch transactions',
                    'Best practices for wallet UX: loading states, error handling, and accessibility',
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
                    <Wallet className="w-5 h-5 text-orange-400" />
                    NEAR Connector Setup
                  </h4>
                  <p className="text-text-secondary mb-3">
                    NEAR Connector is a secure, zero-dependency wallet integration library. Wallet scripts run in isolated sandboxed iframes for maximum security — no single registry of code needed:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border">
                    <div className="text-text-muted">{'// Install — just one package, zero dependencies'}</div>
                    <div className="text-near-green">npm install @hot-labs/near-connect</div>
                    <div className="mt-3 text-text-muted">{'// Initialize connector'}</div>
                    <div><span className="text-purple-400">import</span> {'{'} NearConnector {'}'} <span className="text-purple-400">from</span> <span className="text-yellow-300">&quot;@hot-labs/near-connect&quot;</span>;</div>
                    <div className="mt-2"><span className="text-purple-400">const</span> connector = <span className="text-purple-400">new</span> NearConnector({'{'}</div>
                    <div>  network: <span className="text-yellow-300">&quot;mainnet&quot;</span>,</div>
                    <div>  autoConnect: <span className="text-near-green">true</span>,</div>
                    <div>{'}'});</div>
                    <div className="mt-2 text-text-muted">{'// All wallets auto-discovered from manifest:'}</div>
                    <div className="text-text-muted">{'// HOT, Meteor, MyNearWallet, Nightly, Near Mobile,'}</div>
                    <div className="text-text-muted">{'// Intear, Unity, OKX + any WalletConnect wallet'}</div>
                  </div>
                  <Card variant="default" padding="md" className="mt-3 border-orange-500/20 bg-orange-500/5">
                    <p className="text-sm text-text-secondary">
                      <span className="text-orange-400 font-semibold">Key concept:</span> Unlike wallet-selector, NEAR Connector auto-discovers all supported wallets from a manifest. No per-wallet packages needed. Each wallet runs in a secure sandbox iframe.
                    </p>
                  </Card>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <LogIn className="w-5 h-5 text-green-400" />
                    Sign-In and Sign-Out
                  </h4>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border">
                    <div className="text-text-muted">{'// Show wallet picker and connect'}</div>
                    <div><span className="text-purple-400">const</span> walletId = <span className="text-purple-400">await</span> connector.selectWallet();</div>
                    <div><span className="text-purple-400">await</span> connector.connect(walletId);</div>
                    <div className="mt-3 text-text-muted">{'// Event-driven account tracking'}</div>
                    <div>connector.on(<span className="text-yellow-300">&quot;wallet:signIn&quot;</span>, (payload) =&gt; {'{'}</div>
                    <div>  <span className="text-purple-400">const</span> accountId = payload.accounts[0].accountId;</div>
                    <div>  console.log(<span className="text-yellow-300">&quot;Connected:&quot;</span>, accountId);</div>
                    <div>{'}'});</div>
                    <div className="mt-2">connector.on(<span className="text-yellow-300">&quot;wallet:signOut&quot;</span>, () =&gt; {'{'}</div>
                    <div>  console.log(<span className="text-yellow-300">&quot;Disconnected&quot;</span>);</div>
                    <div>{'}'});</div>
                    <div className="mt-3 text-text-muted">{'// Sign out'}</div>
                    <div><span className="text-purple-400">await</span> connector.disconnect();</div>
                  </div>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Send className="w-5 h-5 text-blue-400" />
                    Signing Transactions
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Once signed in, use the wallet to sign and send transactions to your contract:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border">
                    <div><span className="text-purple-400">const</span> wallet = <span className="text-purple-400">await</span> connector.wallet();</div>
                    <div className="mt-2 text-text-muted">{'// Call a change method'}</div>
                    <div><span className="text-purple-400">await</span> wallet.signAndSendTransaction({'{'}</div>
                    <div>  receiverId: <span className="text-yellow-300">&quot;your-contract.near&quot;</span>,</div>
                    <div>  actions: [{'{'}</div>
                    <div>    type: <span className="text-yellow-300">&quot;FunctionCall&quot;</span>,</div>
                    <div>    params: {'{'}</div>
                    <div>      methodName: <span className="text-yellow-300">&quot;create_post&quot;</span>,</div>
                    <div>      args: {'{'} title: <span className="text-yellow-300">&quot;Hello NEAR&quot;</span> {'}'},</div>
                    <div>      gas: <span className="text-yellow-300">&quot;30000000000000&quot;</span>,</div>
                    <div>      deposit: <span className="text-yellow-300">&quot;0&quot;</span>,</div>
                    <div>    {'}'},</div>
                    <div>  {'}'}],</div>
                    <div>{'}'});</div>
                  </div>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-purple-400" />
                    UX Best Practices
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Card variant="default" padding="md" className="border-orange-500/20">
                      <h5 className="font-semibold text-orange-400 text-sm mb-2">Do</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• Show loading states during wallet interactions</li>
                        <li>• Display clear error messages on tx failure</li>
                        <li>• Support at least 3-4 popular wallets</li>
                        <li>• Persist wallet selection across sessions</li>
                        <li>• Show the connected account name prominently</li>
                      </ul>
                    </Card>
                    <Card variant="default" padding="md" className="border-red-500/20">
                      <h5 className="font-semibold text-red-400 text-sm mb-2">Avoid</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• Forcing users to a single wallet</li>
                        <li>• Silent failures on transaction errors</li>
                        <li>• Requesting full access keys unnecessarily</li>
                        <li>• Blocking UI during transaction confirmation</li>
                        <li>• Hardcoding wallet module versions</li>
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
                    <h5 className="font-semibold text-text-primary">Set Up Wallet Selector</h5>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    Create a new React app with Next.js or Vite. Install wallet selector packages and configure at least 3 wallet modules. Show the modal on a &quot;Connect Wallet&quot; button click.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-purple-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs font-bold text-purple-400">2</div>
                    <h5 className="font-semibold text-text-primary">Build Sign-In Flow</h5>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    Implement the full sign-in/sign-out lifecycle. Display the connected account ID, handle disconnection, and persist the session across page reloads.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-purple-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs font-bold text-purple-400">3</div>
                    <h5 className="font-semibold text-text-primary">Send a Transaction</h5>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    Call a change method on a testnet contract using <code className="text-purple-400 bg-purple-500/10 px-1 rounded">signAndSendTransaction</code>. Show a loading spinner during signing and display the transaction hash on success.
                  </p>
                  <p className="text-text-muted text-xs mt-2">💡 Use the guest-book.testnet contract for testing — it has a simple add_message method.</p>
                </Card>

                <Card variant="default" padding="md" className="border-purple-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs font-bold text-purple-400">4</div>
                    <h5 className="font-semibold text-text-primary">Handle Errors Gracefully</h5>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    Test error scenarios: user rejects the transaction, insufficient balance, contract panics. Implement user-friendly error messages for each case.
                  </p>
                </Card>
              </div>
            )}

            {selectedTab === 'resources' && (
              <div className="space-y-3">
                {[
                  { title: 'NEAR Connector Docs', url: 'https://github.com/azbang/near-connect', desc: 'Official NEAR Connector repository and documentation' },
                  { title: 'NEAR Connector on npm', url: 'https://www.npmjs.com/package/@hot-labs/near-connect', desc: 'Package with API reference and examples' },
                  { title: 'Meteor Wallet', url: 'https://meteorwallet.app', desc: 'Popular NEAR browser extension wallet' },
                  { title: 'HERE Wallet', url: 'https://herewallet.app', desc: 'Mobile-first NEAR wallet with hot storage' },
                  { title: 'MyNearWallet', url: 'https://app.mynearwallet.com', desc: 'Web-based NEAR wallet (successor to wallet.near.org)' },
                  { title: 'NEAR API JS', url: 'https://docs.near.org/tools/near-api-js/quick-reference', desc: 'Low-level JavaScript API for NEAR interactions' },
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

export default WalletSelectorIntegration;
