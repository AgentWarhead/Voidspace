'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Blocks, ExternalLink, CheckCircle, Layers, GitBranch, Rocket } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

interface BuildingADappProps {
  isActive: boolean;
  onToggle: () => void;
}

const BuildingADapp: React.FC<BuildingADappProps> = ({ isActive, onToggle }) => {
  const [selectedTab, setSelectedTab] = useState<string>('overview');

  return (
    <Card variant="glass" padding="none" className="border-purple-500/20">
      <div
        onClick={onToggle}
        className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center">
            <Blocks className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Building a dApp</h3>
            <p className="text-text-muted text-sm">Architect and build a complete decentralized application end-to-end</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-error/10 text-error border-error/20">Advanced</Badge>
          <Badge className="bg-purple-500/10 text-purple-300 border-purple-500/20">90 min</Badge>
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
                  <Layers className="w-5 h-5 text-violet-400" />
                  <h4 className="text-lg font-semibold text-text-primary">What You&apos;ll Learn</h4>
                </div>
                <ul className="space-y-3">
                  {[
                    'dApp architecture — smart contracts, frontend, indexer, and how they connect',
                    'Cross-contract calls with Promises and callbacks',
                    'Building a real project: a simple voting/poll dApp',
                    'Handling async operations and transaction results in the UI',
                    'Project structure best practices for production dApps',
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
                    <Layers className="w-5 h-5 text-violet-400" />
                    dApp Architecture
                  </h4>
                  <p className="text-text-secondary mb-3">
                    A typical NEAR dApp has three layers:
                  </p>
                  <div className="bg-black/30 rounded-lg p-4 border border-border">
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 font-bold text-xs flex-shrink-0">FE</div>
                        <div>
                          <div className="text-text-primary font-semibold">Frontend (React/Next.js)</div>
                          <div className="text-text-muted text-xs">User interface, wallet connection, contract calls via near-api-js</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center text-green-400 font-bold text-xs flex-shrink-0">SC</div>
                        <div>
                          <div className="text-text-primary font-semibold">Smart Contracts (Rust)</div>
                          <div className="text-text-muted text-xs">Business logic, state management, token operations</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center text-purple-400 font-bold text-xs flex-shrink-0">IX</div>
                        <div>
                          <div className="text-text-primary font-semibold">Indexer (Optional)</div>
                          <div className="text-text-muted text-xs">NEAR Lake / The Graph for complex queries and historical data</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <span className="text-orange-400">🔗</span> Cross-Contract Calls
                  </h4>
                  <p className="text-text-secondary mb-3">
                    NEAR contracts communicate via Promises — async calls that execute in the next block:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border">
                    <div><span className="text-purple-400">use</span> near_sdk::{'{'}near, env, Promise, Gas, NearToken{'}'};</div>
                    <div className="mt-2"><span className="text-purple-400">#[near]</span></div>
                    <div><span className="text-purple-400">impl</span> <span className="text-cyan-400">VotingContract</span> {'{'}</div>
                    <div>    <span className="text-text-muted">// Cross-contract call to check user&apos;s token balance</span></div>
                    <div>    <span className="text-purple-400">pub fn</span> <span className="text-near-green">vote</span>(&amp;<span className="text-purple-400">mut</span> self, poll_id: u64, option: u8) -&gt; Promise {'{'}</div>
                    <div>        <span className="text-text-muted">// Step 1: Call the token contract</span></div>
                    <div>        Promise::new(<span className="text-yellow-300">&quot;token.near&quot;</span>.parse().unwrap())</div>
                    <div>            .function_call(</div>
                    <div>                <span className="text-yellow-300">&quot;ft_balance_of&quot;</span>.to_string(),</div>
                    <div>                json!({'{'}<span className="text-yellow-300">&quot;account_id&quot;</span>: env::predecessor_account_id(){'}'}).to_string().into_bytes(),</div>
                    <div>                NearToken::from_near(0),</div>
                    <div>                Gas::from_tgas(5),</div>
                    <div>            )</div>
                    <div>            <span className="text-text-muted">// Step 2: Handle the result in a callback</span></div>
                    <div>            .then(</div>
                    <div>                Promise::new(env::current_account_id())</div>
                    <div>                    .function_call(</div>
                    <div>                        <span className="text-yellow-300">&quot;on_balance_checked&quot;</span>.to_string(),</div>
                    <div>                        json!({'{'}<span className="text-yellow-300">&quot;poll_id&quot;</span>: poll_id, <span className="text-yellow-300">&quot;option&quot;</span>: option{'}'}).to_string().into_bytes(),</div>
                    <div>                        NearToken::from_near(0),</div>
                    <div>                        Gas::from_tgas(10),</div>
                    <div>                    )</div>
                    <div>            )</div>
                    <div>    {'}'}</div>
                    <div>{'}'}</div>
                  </div>
                  <Card variant="default" padding="md" className="mt-3 border-orange-500/20 bg-orange-500/5">
                    <p className="text-sm text-text-secondary">
                      <span className="text-orange-400 font-semibold">Key insight:</span> Cross-contract calls are <strong>async</strong>. The result isn&apos;t available in the same execution. You must use <code className="text-purple-400 bg-purple-500/10 px-1 rounded">.then()</code> callbacks to handle results.
                    </p>
                  </Card>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <GitBranch className="w-5 h-5 text-green-400" />
                    Project: Voting dApp
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Let&apos;s build a real dApp — a decentralized polling/voting system:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border">
                    <div className="text-text-muted">// Contract state</div>
                    <div><span className="text-purple-400">#[near(contract_state)]</span></div>
                    <div><span className="text-purple-400">pub struct</span> <span className="text-cyan-400">VotingApp</span> {'{'}</div>
                    <div>    owner: AccountId,</div>
                    <div>    polls: Vector&lt;Poll&gt;,</div>
                    <div>    votes: LookupMap&lt;(u64, AccountId), u8&gt;, <span className="text-text-muted">// (poll_id, voter) → option</span></div>
                    <div>{'}'}</div>
                    <div className="mt-2"><span className="text-purple-400">#[near(serializers = [borsh, json])]</span></div>
                    <div><span className="text-purple-400">pub struct</span> <span className="text-cyan-400">Poll</span> {'{'}</div>
                    <div>    creator: AccountId,</div>
                    <div>    question: String,</div>
                    <div>    options: Vec&lt;String&gt;,</div>
                    <div>    vote_counts: Vec&lt;<span className="text-cyan-400">u64</span>&gt;,</div>
                    <div>    end_time: <span className="text-cyan-400">u64</span>, <span className="text-text-muted">// nanoseconds timestamp</span></div>
                    <div>{'}'}</div>
                    <div className="mt-2 text-text-muted">// Methods: create_poll, vote, get_poll, get_results</div>
                  </div>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <span className="text-blue-400">📁</span> Project Structure
                  </h4>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border">
                    <div>my-dapp/</div>
                    <div>├── contracts/</div>
                    <div>│   ├── voting/          <span className="text-text-muted"># Main voting contract</span></div>
                    <div>│   │   ├── Cargo.toml</div>
                    <div>│   │   └── src/lib.rs</div>
                    <div>│   └── tests/           <span className="text-text-muted"># Integration tests</span></div>
                    <div>│       └── sandbox.rs</div>
                    <div>├── frontend/</div>
                    <div>│   ├── src/</div>
                    <div>│   │   ├── components/  <span className="text-text-muted"># React components</span></div>
                    <div>│   │   ├── lib/near.ts  <span className="text-text-muted"># NEAR connection</span></div>
                    <div>│   │   └── App.tsx</div>
                    <div>│   └── package.json</div>
                    <div>├── scripts/</div>
                    <div>│   └── deploy.sh        <span className="text-text-muted"># Deployment script</span></div>
                    <div>└── README.md</div>
                  </div>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Rocket className="w-5 h-5 text-cyan-400" />
                    Frontend Integration
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Connect the voting contract to a React frontend:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border">
                    <div className="text-text-muted">// Fetch all polls</div>
                    <div><span className="text-purple-400">async function</span> <span className="text-near-green">getPolls</span>() {'{'}</div>
                    <div>  <span className="text-purple-400">const</span> polls = <span className="text-purple-400">await</span> viewMethod(CONTRACT_ID, <span className="text-yellow-300">&quot;get_polls&quot;</span>, {'{'}{'}'}); </div>
                    <div>  <span className="text-purple-400">return</span> polls;</div>
                    <div>{'}'}</div>
                    <div className="mt-3 text-text-muted">// Cast a vote</div>
                    <div><span className="text-purple-400">async function</span> <span className="text-near-green">castVote</span>(pollId: number, option: number) {'{'}</div>
                    <div>  <span className="text-purple-400">const</span> wallet = <span className="text-purple-400">await</span> selector.wallet();</div>
                    <div>  <span className="text-purple-400">await</span> wallet.signAndSendTransaction({'{'}</div>
                    <div>    receiverId: CONTRACT_ID,</div>
                    <div>    actions: [{'{'}</div>
                    <div>      type: <span className="text-yellow-300">&quot;FunctionCall&quot;</span>,</div>
                    <div>      params: {'{'}</div>
                    <div>        methodName: <span className="text-yellow-300">&quot;vote&quot;</span>,</div>
                    <div>        args: {'{'} poll_id: pollId, option {'}'}, </div>
                    <div>        gas: <span className="text-yellow-300">&quot;30000000000000&quot;</span>,</div>
                    <div>        deposit: <span className="text-yellow-300">&quot;0&quot;</span>,</div>
                    <div>      {'}'},</div>
                    <div>    {'}'}],</div>
                    <div>  {'}'});</div>
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
                    <h5 className="font-semibold text-text-primary">Build the Voting Contract</h5>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    Implement the full voting contract with: <code className="text-purple-400 bg-purple-500/10 px-1 rounded">create_poll</code>, <code className="text-purple-400 bg-purple-500/10 px-1 rounded">vote</code>, <code className="text-purple-400 bg-purple-500/10 px-1 rounded">get_poll</code>, <code className="text-purple-400 bg-purple-500/10 px-1 rounded">get_results</code>. Include checks: one vote per user, poll expiry, valid option index.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-purple-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs font-bold text-purple-400">2</div>
                    <h5 className="font-semibold text-text-primary">Write Integration Tests</h5>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    Test the complete flow: create a poll, vote from multiple accounts, verify results, test duplicate vote prevention.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-purple-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs font-bold text-purple-400">3</div>
                    <h5 className="font-semibold text-text-primary">Build the Frontend</h5>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    Create a React frontend with: poll list, create poll form, voting UI with option buttons, and live results display.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-purple-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs font-bold text-purple-400">4</div>
                    <h5 className="font-semibold text-text-primary">Add Cross-Contract Call</h5>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    Add token-weighted voting: before accepting a vote, call an FT contract to check the voter&apos;s balance. Weight their vote by token holdings.
                  </p>
                  <p className="text-text-muted text-xs mt-2">💡 This combines cross-contract calls with your FT knowledge from the previous modules.</p>
                </Card>
              </div>
            )}

            {selectedTab === 'resources' && (
              <div className="space-y-3">
                {[
                  { title: 'Cross-Contract Calls', url: 'https://docs.near.org/build/smart-contracts/anatomy/crosscontract', desc: 'Promise-based cross-contract communication' },
                  { title: 'NEAR Examples', url: 'https://github.com/near-examples', desc: 'Full dApp examples with frontend + contract' },
                  { title: 'NEAR Discovery', url: 'https://near.org/applications', desc: 'Browse live dApps for inspiration' },
                  { title: 'NEAR Lake Indexer', url: 'https://docs.near.org/tools/indexer-framework', desc: 'Build custom indexers for your dApp' },
                  { title: 'BOS Components', url: 'https://docs.near.org/bos', desc: 'Build composable on-chain frontend components' },
                  { title: 'NEAR Social DB', url: 'https://github.com/nicechute/social-db', desc: 'Decentralized social data layer' },
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

export default BuildingADapp;
