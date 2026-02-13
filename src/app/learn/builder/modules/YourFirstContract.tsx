'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, FileCode, ExternalLink, CheckCircle, Rocket, Zap, Database } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

interface YourFirstContractProps {
  isActive: boolean;
  onToggle: () => void;
}

const YourFirstContract: React.FC<YourFirstContractProps> = ({ isActive, onToggle }) => {
  const [selectedTab, setSelectedTab] = useState<string>('overview');

  return (
    <Card variant="glass" padding="none" className="border-purple-500/20">
      <div
        onClick={onToggle}
        className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
            <FileCode className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Your First Contract</h3>
            <p className="text-text-muted text-sm">Write, build, deploy, and interact with a real NEAR smart contract</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-400 border-emerald-500/20 shadow-sm shadow-emerald-500/10">Beginner</Badge>
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
                  <Rocket className="w-5 h-5 text-green-400" />
                  <h4 className="text-lg font-semibold text-text-primary">What You&apos;ll Learn</h4>
                </div>
                <ul className="space-y-3">
                  {[
                    'The anatomy of a NEAR smart contract — #[near] macros explained',
                    'Writing a greeting contract with get/set methods',
                    'Building the contract to WASM with cargo near build',
                    'Deploying to NEAR testnet using the CLI',
                    'Calling view and change methods from the command line',
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
                {/* Section 1: Anatomy */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    Contract Anatomy
                  </h4>
                  <p className="text-text-secondary mb-3">
                    A NEAR smart contract is a Rust struct with methods. The <code className="text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded text-sm">#[near(contract_state)]</code> macro tells the SDK this struct holds your on-chain state.
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border">
                    <div><span className="text-purple-400">use</span> near_sdk::{'{'}near, env{'}'};</div>
                    <div className="mt-2"><span className="text-purple-400">#[near(contract_state)]</span></div>
                    <div><span className="text-purple-400">pub struct</span> <span className="text-cyan-400">Greeting</span> {'{'}</div>
                    <div>    greeting: <span className="text-cyan-400">String</span>,</div>
                    <div>{'}'}</div>
                    <div className="mt-2 text-text-muted">{'// Default state when contract is first deployed'}</div>
                    <div><span className="text-purple-400">impl</span> <span className="text-cyan-400">Default</span> <span className="text-purple-400">for</span> <span className="text-cyan-400">Greeting</span> {'{'}</div>
                    <div>    <span className="text-purple-400">fn</span> <span className="text-near-green">default</span>() -&gt; Self {'{'}</div>
                    <div>        Self {'{'} greeting: <span className="text-yellow-300">&quot;Hello, NEAR!&quot;</span>.to_string() {'}'}</div>
                    <div>    {'}'}</div>
                    <div>{'}'}</div>
                  </div>
                </section>

                {/* Section 2: Methods */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <span className="text-blue-400">⚙️</span> View &amp; Change Methods
                  </h4>
                  <p className="text-text-secondary mb-3">
                    NEAR has two types of methods: <strong>view</strong> (read-only, free) and <strong>change</strong> (modifies state, costs gas).
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border">
                    <div><span className="text-purple-400">#[near]</span></div>
                    <div><span className="text-purple-400">impl</span> <span className="text-cyan-400">Greeting</span> {'{'}</div>
                    <div>    <span className="text-text-muted">{'// VIEW method — &amp;self (immutable reference)'}</span></div>
                    <div>    <span className="text-purple-400">pub fn</span> <span className="text-near-green">get_greeting</span>(&amp;self) -&gt; &amp;<span className="text-cyan-400">String</span> {'{'}</div>
                    <div>        &amp;self.greeting</div>
                    <div>    {'}'}</div>
                    <div className="mt-2">    <span className="text-text-muted">{'// CHANGE method — &amp;mut self (mutable reference)'}</span></div>
                    <div>    <span className="text-purple-400">pub fn</span> <span className="text-near-green">set_greeting</span>(&amp;<span className="text-purple-400">mut</span> self, greeting: String) {'{'}</div>
                    <div>        log!(<span className="text-yellow-300">&quot;Changing greeting to {'{'}{'}'}&quot;</span>, greeting);</div>
                    <div>        self.greeting = greeting;</div>
                    <div>    {'}'}</div>
                    <div>{'}'}</div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                    <Card variant="default" padding="md" className="border-green-500/20">
                      <h5 className="text-sm font-semibold text-green-400 mb-1">View Methods</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• Use <code className="text-purple-400">&amp;self</code></li>
                        <li>• Free to call (no gas cost to caller)</li>
                        <li>• Cannot modify state</li>
                        <li>• Return data immediately</li>
                      </ul>
                    </Card>
                    <Card variant="default" padding="md" className="border-orange-500/20">
                      <h5 className="text-sm font-semibold text-orange-400 mb-1">Change Methods</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• Use <code className="text-purple-400">&amp;mut self</code></li>
                        <li>• Require gas (caller pays)</li>
                        <li>• Can modify on-chain state</li>
                        <li>• Can attach NEAR tokens</li>
                      </ul>
                    </Card>
                  </div>
                </section>

                {/* Section 3: Build */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <span className="text-orange-400">🔨</span> Building Your Contract
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Compile your Rust contract to WebAssembly:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border">
                    <div className="text-text-muted"># Build with cargo-near (recommended)</div>
                    <div className="text-near-green">cargo near build</div>
                    <div className="text-text-muted mt-3"># Output location</div>
                    <div>target/near/greeting.wasm</div>
                    <div className="text-text-muted mt-3"># Check the file size (smaller = cheaper)</div>
                    <div className="text-near-green">ls -lh target/near/greeting.wasm</div>
                    <div className="text-text-muted"># → ~100KB is typical for a simple contract</div>
                  </div>
                </section>

                {/* Section 4: Deploy */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Rocket className="w-5 h-5 text-green-400" />
                    Deploying to Testnet
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Deploy your compiled WASM to a testnet account:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border">
                    <div className="text-text-muted"># Deploy the contract</div>
                    <div className="text-near-green">near contract deploy your-account.testnet \</div>
                    <div className="text-near-green">  use-file target/near/greeting.wasm \</div>
                    <div className="text-near-green">  without-init-call \</div>
                    <div className="text-near-green">  network-config testnet \</div>
                    <div className="text-near-green">  sign-with-keychain send</div>
                  </div>
                </section>

                {/* Section 5: Interact */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <span className="text-cyan-400">📡</span> Interacting with Your Contract
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Call your deployed contract methods from the CLI:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border">
                    <div className="text-text-muted"># Call a VIEW method (free)</div>
                    <div className="text-near-green">near contract call-function as-read-only \</div>
                    <div className="text-near-green">  your-account.testnet get_greeting json-args {'\'{}'}\' \</div>
                    <div className="text-near-green">  network-config testnet now</div>
                    <div className="text-text-muted mt-1"># → &quot;Hello, NEAR!&quot;</div>
                    <div className="text-text-muted mt-3"># Call a CHANGE method (costs gas)</div>
                    <div className="text-near-green">near contract call-function as-transaction \</div>
                    <div className="text-near-green">  your-account.testnet set_greeting \</div>
                    <div className="text-near-green">  json-args &apos;{'{'}&quot;greeting&quot;: &quot;Hello, Builder!&quot;{'}'}&apos; \</div>
                    <div className="text-near-green">  prepaid-gas &apos;30 Tgas&apos; attached-deposit &apos;0 NEAR&apos; \</div>
                    <div className="text-near-green">  sign-as your-account.testnet \</div>
                    <div className="text-near-green">  network-config testnet sign-with-keychain send</div>
                  </div>
                </section>

                {/* Section 6: Lifecycle */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Database className="w-5 h-5 text-purple-400" />
                    Contract Lifecycle
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Understanding the full lifecycle of a transaction calling your contract:
                  </p>
                  <div className="bg-black/30 rounded-lg p-4 border border-border">
                    <div className="flex flex-col gap-2 text-sm text-text-secondary">
                      <div className="flex items-center gap-2"><span className="text-near-green font-mono">1.</span> User signs a transaction calling <code className="text-purple-400">set_greeting</code></div>
                      <div className="flex items-center gap-2"><span className="text-near-green font-mono">2.</span> Transaction is sent to NEAR validators</div>
                      <div className="flex items-center gap-2"><span className="text-near-green font-mono">3.</span> Validators load your contract WASM + state from storage</div>
                      <div className="flex items-center gap-2"><span className="text-near-green font-mono">4.</span> WASM executes <code className="text-purple-400">set_greeting</code> in a sandbox</div>
                      <div className="flex items-center gap-2"><span className="text-near-green font-mono">5.</span> New state is written back to storage</div>
                      <div className="flex items-center gap-2"><span className="text-near-green font-mono">6.</span> Transaction receipt is returned with result</div>
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
                    <h5 className="font-semibold text-text-primary">Deploy the Greeting Contract</h5>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    Follow the full flow: create project → write contract → build → deploy → call methods. Verify the greeting changes on-chain.
                  </p>
                  <p className="text-text-muted text-xs mt-2">💡 Use <code className="text-purple-400 bg-purple-500/10 px-1 rounded">near contract call-function as-read-only</code> to verify the change persisted.</p>
                </Card>

                <Card variant="default" padding="md" className="border-purple-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs font-bold text-purple-400">2</div>
                    <h5 className="font-semibold text-text-primary">Add a Counter</h5>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    Extend the greeting contract: add a <code className="text-purple-400 bg-purple-500/10 px-1 rounded">visit_count: u64</code> field that increments every time <code className="text-purple-400 bg-purple-500/10 px-1 rounded">set_greeting</code> is called. Add a <code className="text-purple-400 bg-purple-500/10 px-1 rounded">get_visit_count</code> view method.
                  </p>
                  <p className="text-text-muted text-xs mt-2">💡 Don&apos;t forget to update the Default impl to initialize visit_count to 0.</p>
                </Card>

                <Card variant="default" padding="md" className="border-purple-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs font-bold text-purple-400">3</div>
                    <h5 className="font-semibold text-text-primary">Track the Caller</h5>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    Use <code className="text-purple-400 bg-purple-500/10 px-1 rounded">env::predecessor_account_id()</code> to store <em>who</em> last changed the greeting. Add a <code className="text-purple-400 bg-purple-500/10 px-1 rounded">last_sender: AccountId</code> field and a view method to read it.
                  </p>
                  <p className="text-text-muted text-xs mt-2">💡 Import <code className="text-purple-400 bg-purple-500/10 px-1 rounded">AccountId</code> from <code className="text-purple-400 bg-purple-500/10 px-1 rounded">near_sdk</code>.</p>
                </Card>

                <Card variant="default" padding="md" className="border-purple-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs font-bold text-purple-400">4</div>
                    <h5 className="font-semibold text-text-primary">View on NearBlocks</h5>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    After deploying and calling your contract, look it up on the testnet explorer. Find your transactions and see the method calls.
                  </p>
                  <p className="text-text-muted text-xs mt-2">💡 Visit <code className="text-purple-400 bg-purple-500/10 px-1 rounded">https://testnet.nearblocks.io</code> and search your account.</p>
                </Card>
              </div>
            )}

            {selectedTab === 'resources' && (
              <div className="space-y-3">
                {[
                  { title: 'NEAR Smart Contract Quickstart', url: 'https://docs.near.org/build/smart-contracts/quickstart', desc: 'Official step-by-step guide' },
                  { title: 'Hello NEAR Example', url: 'https://github.com/near-examples/hello-near-examples', desc: 'Template greeting contract' },
                  { title: 'Contract Anatomy', url: 'https://docs.near.org/build/smart-contracts/anatomy', desc: 'How contracts are structured' },
                  { title: 'NEAR Testnet Explorer', url: 'https://testnet.nearblocks.io', desc: 'View your deployed contracts' },
                  { title: 'cargo-near Documentation', url: 'https://github.com/near/cargo-near', desc: 'Build and deploy tool' },
                  { title: 'NEAR SDK API Reference', url: 'https://docs.rs/near-sdk/', desc: 'Full Rust SDK docs' },
                  { title: 'Contract Environment (env)', url: 'https://docs.near.org/build/smart-contracts/anatomy/environment', desc: 'Available runtime info' },
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

export default YourFirstContract;
