'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Sparkles, ExternalLink, CheckCircle, Zap, Globe, Layers, ArrowRight, Binary } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

interface IntentsChainAbstractionProps {
  isActive: boolean;
  onToggle: () => void;
}

const IntentsChainAbstraction: React.FC<IntentsChainAbstractionProps> = ({ isActive, onToggle }) => {
  const [selectedTab, setSelectedTab] = useState<string>('overview');

  return (
    <Card variant="glass" padding="none" className="border-purple-500/20">
      <div
        onClick={onToggle}
        className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Intents &amp; Chain Abstraction</h3>
            <p className="text-text-muted text-sm">Intent-based transactions, relayers, solvers, and the abstracted UX layer</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-red-500/10 text-red-300 border-red-500/20">Advanced</Badge>
          <Badge className="bg-purple-500/10 text-purple-300 border-purple-500/20">55 min</Badge>
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
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                  <h4 className="text-lg font-semibold text-text-primary">What You&apos;ll Learn</h4>
                </div>
                <ul className="space-y-3">
                  {[
                    'Intent-based architecture — users declare outcomes, solvers find the path',
                    'NEAR\'s intent relayer network and how solvers compete to fulfill intents',
                    'NEP-518 (NEAR Intents Standard) — the protocol-level specification',
                    'Building solver bots that compete for intent fulfillment',
                    'Chain abstraction UX: one-click cross-chain operations without bridges',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-text-secondary">
                      <CheckCircle className="w-4 h-4 text-near-green mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Card variant="default" padding="md" className="mt-4 border-cyan-500/20 bg-cyan-500/5">
                  <p className="text-sm text-text-secondary">
                    <span className="text-cyan-400 font-semibold">Why this matters:</span> Intents are the next evolution of blockchain UX. Instead of users constructing transactions manually, they express what they want and the system figures out how. This is how blockchain goes mainstream.
                  </p>
                </Card>
              </div>
            )}

            {selectedTab === 'learn' && (
              <div className="space-y-8">
                {/* Section 1: Intent Architecture */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-blue-400" />
                    Intent Architecture
                  </h4>
                  <p className="text-text-secondary mb-3">
                    In the intents model, the flow inverts: users declare desired outcomes, and a competitive market of solvers fulfills them optimally.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Card variant="default" padding="md" className="border-blue-500/20">
                      <h5 className="font-semibold text-blue-400 text-sm mb-2">1. User Intent</h5>
                      <p className="text-xs text-text-muted">&quot;I want to swap 100 USDC on Ethereum for NEAR tokens&quot; — no routing, no bridge selection, no gas management.</p>
                    </Card>
                    <Card variant="default" padding="md" className="border-purple-500/20">
                      <h5 className="font-semibold text-purple-400 text-sm mb-2">2. Solver Competition</h5>
                      <p className="text-xs text-text-muted">Multiple solvers see the intent and compete to fulfill it with the best rate. They handle all the complexity.</p>
                    </Card>
                    <Card variant="default" padding="md" className="border-green-500/20">
                      <h5 className="font-semibold text-green-400 text-sm mb-2">3. Execution</h5>
                      <p className="text-xs text-text-muted">Winning solver executes the multi-chain transaction. User receives NEAR tokens. One signature, done.</p>
                    </Card>
                  </div>
                </section>

                {/* Section 2: Intent Message Format */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Binary className="w-5 h-5 text-green-400" />
                    Intent Message Format
                  </h4>
                  <p className="text-text-secondary mb-3">
                    NEAR intents follow a structured format that solvers can parse and evaluate:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-text-secondary border border-border">
                    <div className="text-green-400 mb-2">{'// Intent structure (simplified)'}</div>
                    <div className="text-near-green">{'{'}</div>
                    <div className="text-near-green">{'  "intent_id": "unique-uuid",'}</div>
                    <div className="text-near-green">{'  "signer": "alice.near",'}</div>
                    <div className="text-near-green">{'  "intents": [{'}</div>
                    <div className="text-near-green">{'    "intent": "token_diff",'}</div>
                    <div className="text-near-green">{'    "diff": {'}</div>
                    <div className="text-near-green">{'      "token_id": "wrap.near",'}</div>
                    <div className="text-near-green">{'      "chain_id": "near:mainnet",'}</div>
                    <div className="text-near-green">{'      "amount": "+5000000000000000000000000"'}</div>
                    <div className="text-near-green">{'    }'}</div>
                    <div className="text-near-green">{'  }, {'}</div>
                    <div className="text-near-green">{'    "intent": "token_diff",'}</div>
                    <div className="text-near-green">{'    "diff": {'}</div>
                    <div className="text-near-green">{'      "token_id": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",'}</div>
                    <div className="text-near-green">{'      "chain_id": "eip155:1",'}</div>
                    <div className="text-near-green">{'      "amount": "-100000000"'}</div>
                    <div className="text-near-green">{'    }'}</div>
                    <div className="text-near-green">{'  }],'}</div>
                    <div className="text-near-green">{'  "expiry": "2025-12-31T00:00:00Z"'}</div>
                    <div className="text-near-green">{'}'}</div>
                  </div>
                </section>

                {/* Section 3: Solver Architecture */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    Building a Solver
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Solvers are off-chain bots that monitor intent streams, evaluate profitability, and compete to fulfill intents:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-text-secondary border border-border">
                    <div className="text-yellow-400 mb-2">{'// Solver bot architecture (TypeScript)'}</div>
                    <div className="text-near-green">{'class IntentSolver {'}</div>
                    <div className="text-near-green">{'  async monitorIntents() {'}</div>
                    <div className="text-near-green">{'    const stream = await intentRelayer.subscribe();'}</div>
                    <div className="text-near-green">{'    for await (const intent of stream) {'}</div>
                    <div className="text-near-green">{'      const quote = await this.evaluateIntent(intent);'}</div>
                    <div className="text-near-green">{'      if (quote.profitable) {'}</div>
                    <div className="text-near-green">{'        await this.submitSolution(intent, quote);'}</div>
                    <div className="text-near-green">{'      }'}</div>
                    <div className="text-near-green">{'    }'}</div>
                    <div className="text-near-green">{'  }'}</div>
                    <div className="mt-2 text-near-green">{'  async evaluateIntent(intent: Intent) {'}</div>
                    <div className="text-near-green">{'    const sourcePrice = await this.getPrice(intent.source);'}</div>
                    <div className="text-near-green">{'    const destPrice = await this.getPrice(intent.dest);'}</div>
                    <div className="text-near-green">{'    const gasCost = await this.estimateGas(intent);'}</div>
                    <div className="text-near-green">{'    const profit = sourcePrice - destPrice - gasCost;'}</div>
                    <div className="text-near-green">{'    return { profitable: profit > this.minProfit, quote: destPrice };'}</div>
                    <div className="text-near-green">{'  }'}</div>
                    <div className="text-near-green">{'}'}</div>
                  </div>
                </section>

                {/* Section 4: Chain Abstraction Layer */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-purple-400" />
                    Chain Abstraction Layer
                  </h4>
                  <p className="text-text-secondary mb-3">
                    NEAR&apos;s chain abstraction combines intents, chain signatures, and meta-transactions to create a unified experience:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card variant="default" padding="md" className="border-purple-500/20">
                      <h5 className="font-semibold text-purple-400 text-sm mb-2">User-Facing Components</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• <strong className="text-text-secondary">NEAR Account:</strong> Single identity across all chains</li>
                        <li>• <strong className="text-text-secondary">Gas Abstraction:</strong> Pay gas in any token on any chain</li>
                        <li>• <strong className="text-text-secondary">Multi-chain Wallet:</strong> One wallet for all chain assets</li>
                        <li>• <strong className="text-text-secondary">Intent Expression:</strong> Simple UIs for complex operations</li>
                      </ul>
                    </Card>
                    <Card variant="default" padding="md" className="border-blue-500/20">
                      <h5 className="font-semibold text-blue-400 text-sm mb-2">Protocol Components</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• <strong className="text-text-secondary">MPC Network:</strong> Signs for any chain</li>
                        <li>• <strong className="text-text-secondary">Intent Relayer:</strong> Routes intents to solvers</li>
                        <li>• <strong className="text-text-secondary">Meta-Transactions:</strong> Gasless NEAR operations</li>
                        <li>• <strong className="text-text-secondary">Multichain Gas Relayer:</strong> Pay NEAR gas with other tokens</li>
                      </ul>
                    </Card>
                  </div>
                </section>

                {/* Section 5: Meta-Transactions */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <ArrowRight className="w-5 h-5 text-pink-400" />
                    Meta-Transactions (NEP-366)
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Meta-transactions let users submit signed transactions without holding NEAR for gas. A relayer pays the gas and submits on the user&apos;s behalf:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-text-secondary border border-border">
                    <div className="text-pink-400 mb-2">{'// Meta-transaction flow'}</div>
                    <div className="text-near-green">{'// 1. User signs a DelegateAction (off-chain)'}</div>
                    <div className="text-near-green">{'const delegateAction = {'}</div>
                    <div className="text-near-green">{'  senderId: "alice.near",'}</div>
                    <div className="text-near-green">{'  receiverId: "game.near",'}</div>
                    <div className="text-near-green">{'  actions: [functionCall("play", args, gas, deposit)],'}</div>
                    <div className="text-near-green">{'  nonce: currentNonce + 1,'}</div>
                    <div className="text-near-green">{'  maxBlockHeight: currentBlock + 100,'}</div>
                    <div className="text-near-green">{'};'}</div>
                    <div className="mt-1 text-near-green">{'// 2. User signs with their key (no gas needed)'}</div>
                    <div className="text-near-green">{'const signedDelegate = sign(delegateAction, userKey);'}</div>
                    <div className="mt-1 text-near-green">{'// 3. Relayer wraps in a real transaction and pays gas'}</div>
                    <div className="text-near-green">{'const tx = createTransaction(relayerAccount, signedDelegate);'}</div>
                    <div className="text-near-green">{'await relayer.sendTransaction(tx);'}</div>
                  </div>
                </section>
              </div>
            )}

            {selectedTab === 'practice' && (
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-text-primary">Exercises</h4>

                <Card variant="default" padding="md" className="border-red-500/20">
                  <h5 className="font-semibold text-red-400 text-sm mb-2">🔴 Exercise 1: Build a Simple Solver</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Create a TypeScript solver bot that monitors a mock intent stream and responds with quotes. Simulate the auction process where multiple solvers compete on price.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-red-500/20">
                  <h5 className="font-semibold text-red-400 text-sm mb-2">🔴 Exercise 2: Meta-Transaction Relayer</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Build a meta-transaction relayer service. Users submit signed DelegateActions to your API, and you wrap them in real transactions and pay the gas. Run on testnet.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-red-500/20">
                  <h5 className="font-semibold text-red-400 text-sm mb-2">🔴 Exercise 3: Cross-Chain Intent dApp</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Build a frontend where users can express a cross-chain swap intent (e.g., ETH → NEAR). Use mock solvers to demonstrate the intent lifecycle from creation to fulfillment.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-red-500/20">
                  <h5 className="font-semibold text-red-400 text-sm mb-2">🔴 Exercise 4: Gasless Game Session</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Create a simple on-chain game where players never pay gas. Use meta-transactions so the game developer&apos;s relayer covers all gas costs. Implement rate limiting to prevent abuse.
                  </p>
                </Card>
              </div>
            )}

            {selectedTab === 'resources' && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-text-primary">Resources</h4>
                {[
                  { title: 'NEAR Intents Overview', url: 'https://docs.near.org/concepts/abstraction/intents', desc: 'Official documentation on NEAR intent architecture' },
                  { title: 'NEP-366: Meta Transactions', url: 'https://github.com/near/NEPs/blob/master/neps/nep-0366.md', desc: 'The meta-transaction standard specification' },
                  { title: 'Chain Abstraction Architecture', url: 'https://docs.near.org/concepts/abstraction', desc: 'Full chain abstraction stack: signatures, intents, gas relaying' },
                  { title: 'NEAR Multichain Gas Relayer', url: 'https://docs.near.org/concepts/abstraction/relayers', desc: 'Documentation on gas abstraction and relayer setup' },
                  { title: 'Intent-Based Architecture (Research)', url: 'https://www.paradigm.xyz/2023/06/intents', desc: 'Paradigm\'s research paper on intent-based blockchain architectures' },
                  { title: 'Defuse Protocol', url: 'https://defuse.org', desc: 'NEAR-native intent-based DEX using chain abstraction' },
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

export default IntentsChainAbstraction;
