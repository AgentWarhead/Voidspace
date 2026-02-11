'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Rocket, ExternalLink, CheckCircle, Server, Globe, Settings } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

interface DeploymentProps {
  isActive: boolean;
  onToggle: () => void;
}

const Deployment: React.FC<DeploymentProps> = ({ isActive, onToggle }) => {
  const [selectedTab, setSelectedTab] = useState<string>('overview');

  return (
    <Card variant="glass" padding="none" className="border-purple-500/20">
      <div
        onClick={onToggle}
        className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-lime-500 rounded-xl flex items-center justify-center">
            <Rocket className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Deployment</h3>
            <p className="text-text-muted text-sm">Deploy to testnet and mainnet with confidence</p>
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
                  <Rocket className="w-5 h-5 text-green-400" />
                  <h4 className="text-lg font-semibold text-text-primary">What You&apos;ll Learn</h4>
                </div>
                <ul className="space-y-3">
                  {[
                    'Testnet vs mainnet deployment differences and considerations',
                    'Creating and managing deployment accounts and sub-accounts',
                    'Deployment scripts and CI/CD automation',
                    'Initialization patterns — init methods and default state',
                    'Post-deployment verification and smoke testing',
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
                    <Server className="w-5 h-5 text-blue-400" />
                    Testnet vs Mainnet
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Card variant="default" padding="md" className="border-blue-500/20">
                      <h5 className="font-semibold text-blue-400 text-sm mb-2">🧪 Testnet</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• Free tokens from faucet</li>
                        <li>• Accounts: <code className="text-purple-400">*.testnet</code></li>
                        <li>• RPC: rpc.testnet.near.org</li>
                        <li>• Explorer: testnet.nearblocks.io</li>
                        <li>• Deploy freely, break things, learn</li>
                      </ul>
                    </Card>
                    <Card variant="default" padding="md" className="border-green-500/20">
                      <h5 className="font-semibold text-green-400 text-sm mb-2">🚀 Mainnet</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• Real NEAR tokens (real money)</li>
                        <li>• Accounts: <code className="text-purple-400">*.near</code></li>
                        <li>• RPC: rpc.mainnet.near.org</li>
                        <li>• Explorer: nearblocks.io</li>
                        <li>• Test thoroughly first, deploy carefully</li>
                      </ul>
                    </Card>
                  </div>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <span className="text-yellow-400">📝</span> Deployment Script
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Create a reusable deployment script:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border">
                    <div className="text-text-muted">#!/bin/bash</div>
                    <div className="text-text-muted"># deploy.sh — Deploy to testnet or mainnet</div>
                    <div className="mt-2">NETWORK=${'{'}1:-testnet{'}'}</div>
                    <div>CONTRACT_ACCOUNT=<span className="text-yellow-300">&quot;myapp.$NETWORK&quot;</span></div>
                    <div className="mt-2 text-text-muted"># Build the contract</div>
                    <div className="text-near-green">echo <span className="text-yellow-300">&quot;Building contract...&quot;</span></div>
                    <div className="text-near-green">cargo near build</div>
                    <div className="mt-2 text-text-muted"># Deploy</div>
                    <div className="text-near-green">echo <span className="text-yellow-300">&quot;Deploying to $CONTRACT_ACCOUNT...&quot;</span></div>
                    <div className="text-near-green">near contract deploy $CONTRACT_ACCOUNT \</div>
                    <div className="text-near-green">  use-file ./target/near/my_contract.wasm \</div>
                    <div className="text-near-green">  with-init-call new \</div>
                    <div className="text-near-green">  json-args &apos;{'{&quot;owner_id&quot;: &quot;&apos;$CONTRACT_ACCOUNT&apos;&quot;}'}&apos; \</div>
                    <div className="text-near-green">  prepaid-gas &apos;100 Tgas&apos; attached-deposit &apos;0 NEAR&apos; \</div>
                    <div className="text-near-green">  network-config $NETWORK sign-with-keychain send</div>
                    <div className="mt-2 text-text-muted"># Verify deployment</div>
                    <div className="text-near-green">echo <span className="text-yellow-300">&quot;Verifying...&quot;</span></div>
                    <div className="text-near-green">near contract call-function as-read-only \</div>
                    <div className="text-near-green">  $CONTRACT_ACCOUNT get_greeting json-args &apos;{'{}'}&apos; \</div>
                    <div className="text-near-green">  network-config $NETWORK now</div>
                  </div>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-purple-400" />
                    Initialization Patterns
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Choose the right initialization pattern for your contract:
                  </p>
                  <div className="space-y-3">
                    <Card variant="default" padding="md" className="border-blue-500/10">
                      <h5 className="text-sm font-semibold text-text-primary mb-2">Pattern 1: Default (No Init Required)</h5>
                      <div className="bg-black/40 rounded-lg p-3 font-mono text-xs text-text-secondary border border-border">
                        <div><span className="text-purple-400">impl</span> Default <span className="text-purple-400">for</span> Contract {'{'}</div>
                        <div>  <span className="text-purple-400">fn</span> <span className="text-near-green">default</span>() -&gt; Self {'{'} Self {'{'} greeting: <span className="text-yellow-300">&quot;Hello&quot;</span>.into() {'}'} {'}'}</div>
                        <div>{'}'}</div>
                      </div>
                      <p className="text-xs text-text-muted mt-2">Deploy with <code className="text-purple-400">without-init-call</code>. State initializes on first use.</p>
                    </Card>
                    <Card variant="default" padding="md" className="border-green-500/10">
                      <h5 className="text-sm font-semibold text-text-primary mb-2">Pattern 2: Explicit Init (Required)</h5>
                      <div className="bg-black/40 rounded-lg p-3 font-mono text-xs text-text-secondary border border-border">
                        <div><span className="text-purple-400">#[derive(PanicOnDefault)]</span> <span className="text-text-muted">// ← Prevents use without init</span></div>
                        <div><span className="text-purple-400">#[init]</span></div>
                        <div><span className="text-purple-400">pub fn</span> <span className="text-near-green">new</span>(owner_id: AccountId) -&gt; Self {'{'} ... {'}'}</div>
                      </div>
                      <p className="text-xs text-text-muted mt-2">Deploy with <code className="text-purple-400">with-init-call new</code>. Contract is unusable until initialized.</p>
                    </Card>
                  </div>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-cyan-400" />
                    Frontend Deployment
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Deploy your frontend alongside the smart contract:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border">
                    <div className="text-text-muted"># Environment variables for different networks</div>
                    <div className="text-near-green"># .env.development</div>
                    <div>NEXT_PUBLIC_NETWORK_ID=testnet</div>
                    <div>NEXT_PUBLIC_CONTRACT_ID=myapp.testnet</div>
                    <div className="mt-2 text-near-green"># .env.production</div>
                    <div>NEXT_PUBLIC_NETWORK_ID=mainnet</div>
                    <div>NEXT_PUBLIC_CONTRACT_ID=myapp.near</div>
                    <div className="mt-3 text-text-muted"># Deploy frontend to Vercel/Netlify</div>
                    <div className="text-near-green">vercel --prod</div>
                  </div>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <span className="text-green-400">✅</span> Post-Deployment Checklist
                  </h4>
                  <div className="bg-black/30 rounded-lg p-4 border border-border">
                    <ul className="space-y-2 text-sm text-text-secondary">
                      <li className="flex items-start gap-2"><span className="text-near-green">1.</span> Verify contract code on NearBlocks (compare WASM hash)</li>
                      <li className="flex items-start gap-2"><span className="text-near-green">2.</span> Call each view method to confirm responses</li>
                      <li className="flex items-start gap-2"><span className="text-near-green">3.</span> Execute a test transaction from a test account</li>
                      <li className="flex items-start gap-2"><span className="text-near-green">4.</span> Verify access keys are correct (remove unnecessary full-access keys)</li>
                      <li className="flex items-start gap-2"><span className="text-near-green">5.</span> Check storage usage and account balance</li>
                      <li className="flex items-start gap-2"><span className="text-near-green">6.</span> Test wallet connection from the frontend</li>
                      <li className="flex items-start gap-2"><span className="text-near-green">7.</span> Monitor for errors in the first 24 hours</li>
                    </ul>
                  </div>
                </section>
              </div>
            )}

            {selectedTab === 'practice' && (
              <div className="space-y-6">
                <Card variant="default" padding="md" className="border-purple-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs font-bold text-purple-400">1</div>
                    <h5 className="font-semibold text-text-primary">Write a Deploy Script</h5>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    Create a bash script that builds, deploys, and verifies your contract in one command. Support both testnet and mainnet flags.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-purple-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs font-bold text-purple-400">2</div>
                    <h5 className="font-semibold text-text-primary">Deploy with Initialization</h5>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    Deploy a contract that requires initialization. Use <code className="text-purple-400 bg-purple-500/10 px-1 rounded">PanicOnDefault</code> and <code className="text-purple-400 bg-purple-500/10 px-1 rounded">#[init]</code>. Verify that calling methods before init fails.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-purple-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs font-bold text-purple-400">3</div>
                    <h5 className="font-semibold text-text-primary">Multi-Contract Deployment</h5>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    Deploy your voting dApp: contract to one sub-account, frontend to Vercel/Netlify. Configure environment variables for testnet.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-purple-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs font-bold text-purple-400">4</div>
                    <h5 className="font-semibold text-text-primary">Verify on NearBlocks</h5>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    After deployment, find your contract on NearBlocks. Check the code hash, access keys, storage usage, and recent transactions.
                  </p>
                </Card>
              </div>
            )}

            {selectedTab === 'resources' && (
              <div className="space-y-3">
                {[
                  { title: 'Deployment Guide', url: 'https://docs.near.org/build/smart-contracts/release/deploy', desc: 'Official deployment documentation' },
                  { title: 'cargo-near Deploy', url: 'https://github.com/near/cargo-near', desc: 'Build and deploy in one step' },
                  { title: 'NearBlocks Explorer', url: 'https://nearblocks.io', desc: 'Verify deployments on mainnet' },
                  { title: 'NEAR RPC Providers', url: 'https://docs.near.org/api/rpc/providers', desc: 'List of RPC endpoints' },
                  { title: 'CI/CD with GitHub Actions', url: 'https://docs.near.org/build/smart-contracts/release/deploy#cicd', desc: 'Automate deployments' },
                  { title: 'Testnet Faucet', url: 'https://near-faucet.io', desc: 'Get testnet tokens for deployment' },
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

export default Deployment;
