'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Globe, ExternalLink, CheckCircle, Layout, Plug, Smartphone } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

interface FrontendIntegrationProps {
  isActive: boolean;
  onToggle: () => void;
}

const FrontendIntegration: React.FC<FrontendIntegrationProps> = ({ isActive, onToggle }) => {
  const [selectedTab, setSelectedTab] = useState<string>('overview');

  return (
    <Card variant="glass" padding="none" className="border-purple-500/20">
      <div
        onClick={onToggle}
        className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Frontend Integration</h3>
            <p className="text-text-muted text-sm">Connect React/Next.js apps to NEAR with near-api-js and Wallet Selector</p>
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
                  <Layout className="w-5 h-5 text-indigo-400" />
                  <h4 className="text-lg font-semibold text-text-primary">What You&apos;ll Learn</h4>
                </div>
                <ul className="space-y-3">
                  {[
                    'Setting up near-api-js to connect your frontend to NEAR',
                    'Wallet Selector — multi-wallet support for your dApp',
                    'Calling view and change methods from React components',
                    'Handling wallet connections, disconnections, and sessions',
                    'Displaying on-chain data and transaction results in your UI',
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
                    <span className="text-blue-400">📦</span> Installing Dependencies
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Set up a React/Next.js project with NEAR integration:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border">
                    <div className="text-text-muted"># Core NEAR libraries</div>
                    <div className="text-near-green">npm install near-api-js @near-wallet-selector/core</div>
                    <div className="text-text-muted mt-3"># Wallet modules (add the wallets you want to support)</div>
                    <div className="text-near-green">npm install @near-wallet-selector/my-near-wallet</div>
                    <div className="text-near-green">npm install @near-wallet-selector/meteor-wallet</div>
                    <div className="text-near-green">npm install @near-wallet-selector/here-wallet</div>
                    <div className="text-text-muted mt-3"># UI component for wallet selection modal</div>
                    <div className="text-near-green">npm install @near-wallet-selector/modal-ui</div>
                  </div>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Plug className="w-5 h-5 text-green-400" />
                    Setting Up Wallet Selector
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Initialize the Wallet Selector with your supported wallets:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border">
                    <div className="text-text-muted">{'// lib/near.ts'}</div>
                    <div><span className="text-purple-400">import</span> {'{'} setupWalletSelector {'}'} <span className="text-purple-400">from</span> <span className="text-yellow-300">&quot;@near-wallet-selector/core&quot;</span>;</div>
                    <div><span className="text-purple-400">import</span> {'{'} setupMyNearWallet {'}'} <span className="text-purple-400">from</span> <span className="text-yellow-300">&quot;@near-wallet-selector/my-near-wallet&quot;</span>;</div>
                    <div><span className="text-purple-400">import</span> {'{'} setupModal {'}'} <span className="text-purple-400">from</span> <span className="text-yellow-300">&quot;@near-wallet-selector/modal-ui&quot;</span>;</div>
                    <div className="mt-2"><span className="text-purple-400">const</span> CONTRACT_ID = <span className="text-yellow-300">&quot;your-contract.testnet&quot;</span>;</div>
                    <div className="mt-2"><span className="text-purple-400">export async function</span> <span className="text-near-green">initNear</span>() {'{'}</div>
                    <div>  <span className="text-purple-400">const</span> selector = <span className="text-purple-400">await</span> setupWalletSelector({'{'}</div>
                    <div>    network: <span className="text-yellow-300">&quot;testnet&quot;</span>,</div>
                    <div>    modules: [setupMyNearWallet()],</div>
                    <div>  {'}'});</div>
                    <div className="mt-2">  <span className="text-purple-400">const</span> modal = setupModal(selector, {'{'}</div>
                    <div>    contractId: CONTRACT_ID,</div>
                    <div>  {'}'});</div>
                    <div className="mt-2">  <span className="text-purple-400">return</span> {'{'} selector, modal {'}'};  </div>
                    <div>{'}'}</div>
                  </div>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <span className="text-purple-400">⚛️</span> React Context Provider
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Wrap your app with a NEAR context so any component can access the wallet:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border">
                    <div className="text-text-muted">{'// context/NearContext.tsx'}</div>
                    <div><span className="text-purple-400">import</span> {'{'} createContext, useContext, useEffect, useState {'}'} <span className="text-purple-400">from</span> <span className="text-yellow-300">&quot;react&quot;</span>;</div>
                    <div className="mt-2"><span className="text-purple-400">const</span> NearContext = createContext&lt;any&gt;(null);</div>
                    <div className="mt-2"><span className="text-purple-400">export function</span> <span className="text-near-green">NearProvider</span>({'{'} children {'}'}) {'{'}</div>
                    <div>  <span className="text-purple-400">const</span> [wallet, setWallet] = useState(null);</div>
                    <div>  <span className="text-purple-400">const</span> [accountId, setAccountId] = useState(<span className="text-yellow-300">&quot;&quot;</span>);</div>
                    <div className="mt-2">  useEffect(() =&gt; {'{'}</div>
                    <div>    <span className="text-text-muted">{'// Initialize wallet selector on mount'}</span></div>
                    <div>    initNear().then(({'{'} selector {'}'}) =&gt; {'{'}</div>
                    <div>      selector.store.observable.subscribe((state) =&gt; {'{'}</div>
                    <div>        <span className="text-purple-400">const</span> accounts = state.accounts;</div>
                    <div>        <span className="text-purple-400">if</span> (accounts.length) setAccountId(accounts[0].accountId);</div>
                    <div>      {'}'});</div>
                    <div>    {'}'});</div>
                    <div>  {'}'}, []);</div>
                    <div className="mt-2">  <span className="text-purple-400">return</span> (</div>
                    <div>    &lt;NearContext.Provider value={'{'}{'{'} wallet, accountId {'}'}{'}'}&gt;</div>
                    <div>      {'{'}children{'}'}</div>
                    <div>    &lt;/NearContext.Provider&gt;</div>
                    <div>  );</div>
                    <div>{'}'}</div>
                  </div>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <span className="text-cyan-400">📡</span> Calling Contract Methods
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Call view and change methods from your frontend:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border">
                    <div className="text-text-muted">{'// View call — free, no wallet needed'}</div>
                    <div><span className="text-purple-400">const</span> provider = <span className="text-purple-400">new</span> providers.JsonRpcProvider({'{'}</div>
                    <div>  url: <span className="text-yellow-300">&quot;https://rpc.testnet.near.org&quot;</span></div>
                    <div>{'}'});</div>
                    <div className="mt-2"><span className="text-purple-400">const</span> result = <span className="text-purple-400">await</span> provider.query({'{'}</div>
                    <div>  request_type: <span className="text-yellow-300">&quot;call_function&quot;</span>,</div>
                    <div>  account_id: CONTRACT_ID,</div>
                    <div>  method_name: <span className="text-yellow-300">&quot;get_greeting&quot;</span>,</div>
                    <div>  args_base64: btoa(JSON.stringify({'{'}{'}'})),</div>
                    <div>  finality: <span className="text-yellow-300">&quot;final&quot;</span>,</div>
                    <div>{'}'});</div>
                    <div className="mt-4 text-text-muted">{'// Change call — requires wallet signature'}</div>
                    <div><span className="text-purple-400">const</span> wallet = <span className="text-purple-400">await</span> selector.wallet();</div>
                    <div><span className="text-purple-400">await</span> wallet.signAndSendTransaction({'{'}</div>
                    <div>  receiverId: CONTRACT_ID,</div>
                    <div>  actions: [{'{'}</div>
                    <div>    type: <span className="text-yellow-300">&quot;FunctionCall&quot;</span>,</div>
                    <div>    params: {'{'}</div>
                    <div>      methodName: <span className="text-yellow-300">&quot;set_greeting&quot;</span>,</div>
                    <div>      args: {'{'} greeting: <span className="text-yellow-300">&quot;Hello from React!&quot;</span> {'}'},</div>
                    <div>      gas: <span className="text-yellow-300">&quot;30000000000000&quot;</span>, <span className="text-text-muted">{'// 30 Tgas'}</span></div>
                    <div>      deposit: <span className="text-yellow-300">&quot;0&quot;</span>,</div>
                    <div>    {'}'},</div>
                    <div>  {'}'}],</div>
                    <div>{'}'});</div>
                  </div>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-green-400" />
                    Building the UI
                  </h4>
                  <p className="text-text-secondary mb-3">
                    A complete React component with wallet connection and contract calls:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border">
                    <div><span className="text-purple-400">function</span> <span className="text-near-green">GreetingApp</span>() {'{'}</div>
                    <div>  <span className="text-purple-400">const</span> [greeting, setGreeting] = useState(<span className="text-yellow-300">&quot;&quot;</span>);</div>
                    <div>  <span className="text-purple-400">const</span> [newGreeting, setNewGreeting] = useState(<span className="text-yellow-300">&quot;&quot;</span>);</div>
                    <div className="mt-2">  <span className="text-text-muted">{'// Fetch greeting on load'}</span></div>
                    <div>  useEffect(() =&gt; {'{'}</div>
                    <div>    fetchGreeting().then(setGreeting);</div>
                    <div>  {'}'}, []);</div>
                    <div className="mt-2">  <span className="text-purple-400">return</span> (</div>
                    <div>    &lt;div&gt;</div>
                    <div>      &lt;h1&gt;{'{'}greeting{'}'}&lt;/h1&gt;</div>
                    <div>      &lt;input</div>
                    <div>        value={'{'}newGreeting{'}'}</div>
                    <div>        onChange={'{'}(e) =&gt; setNewGreeting(e.target.value){'}'}</div>
                    <div>      /&gt;</div>
                    <div>      &lt;button onClick={'{'}() =&gt; updateGreeting(newGreeting){'}'}&gt;</div>
                    <div>        Update</div>
                    <div>      &lt;/button&gt;</div>
                    <div>    &lt;/div&gt;</div>
                    <div>  );</div>
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
                    <h5 className="font-semibold text-text-primary">Create a Greeting dApp</h5>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    Build a React app that connects to your deployed greeting contract. Show the current greeting and let users change it.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-purple-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs font-bold text-purple-400">2</div>
                    <h5 className="font-semibold text-text-primary">Add Wallet Connection UI</h5>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    Implement a &quot;Connect Wallet&quot; button that opens the Wallet Selector modal. Show the connected account ID and a &quot;Disconnect&quot; button.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-purple-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs font-bold text-purple-400">3</div>
                    <h5 className="font-semibold text-text-primary">Handle Transaction Results</h5>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    After a change method call, display the transaction hash, link to NearBlocks, and refresh the displayed data.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-purple-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs font-bold text-purple-400">4</div>
                    <h5 className="font-semibold text-text-primary">Error Handling in UI</h5>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    Add proper error handling: catch rejected transactions, display user-friendly error messages, and show loading states.
                  </p>
                </Card>
              </div>
            )}

            {selectedTab === 'resources' && (
              <div className="space-y-3">
                {[
                  { title: 'near-api-js Docs', url: 'https://docs.near.org/tools/near-api-js/quick-reference', desc: 'JavaScript library for NEAR' },
                  { title: 'Wallet Selector', url: 'https://github.com/near/wallet-selector', desc: 'Multi-wallet support library' },
                  { title: 'NEAR React Example', url: 'https://github.com/near-examples/hello-near-examples', desc: 'Full React frontend example' },
                  { title: 'BOS (Blockchain OS)', url: 'https://docs.near.org/bos', desc: 'Build frontends stored on-chain' },
                  { title: 'NEAR Discovery', url: 'https://near.org/applications', desc: 'Browse existing dApps for inspiration' },
                  { title: 'near-api-js Cookbook', url: 'https://docs.near.org/tools/near-api-js/cookbook', desc: 'Common frontend patterns and recipes' },
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

export default FrontendIntegration;
