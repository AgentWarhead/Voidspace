'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Flame, ExternalLink, CheckCircle, AlertTriangle, BarChart3, Shield, Zap, Eye } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

interface MevTransactionOrderingProps {
  isActive: boolean;
  onToggle: () => void;
}

const MevTransactionOrdering: React.FC<MevTransactionOrderingProps> = ({ isActive, onToggle }) => {
  const [selectedTab, setSelectedTab] = useState<string>('overview');

  return (
    <Card variant="glass" padding="none" className="border-purple-500/20">
      <div
        onClick={onToggle}
        className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
            <Flame className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">MEV &amp; Transaction Ordering</h3>
            <p className="text-text-muted text-sm">Maximal extractable value, frontrunning, and MEV protection on NEAR</p>
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
                  <Flame className="w-5 h-5 text-orange-400" />
                  <h4 className="text-lg font-semibold text-text-primary">What You&apos;ll Learn</h4>
                </div>
                <ul className="space-y-3">
                  {[
                    'What MEV is and how it manifests differently on NEAR vs Ethereum',
                    'Transaction ordering in NEAR — chunk producers and their role in ordering',
                    'Frontrunning, sandwich attacks, and back-running on sharded chains',
                    'MEV protection techniques: commit-reveal, private transactions, and time-locks',
                    'NEAR-specific MEV vectors: cross-shard arbitrage and receipt ordering',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-text-secondary">
                      <CheckCircle className="w-4 h-4 text-near-green mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Card variant="default" padding="md" className="mt-4 border-orange-500/20 bg-orange-500/5">
                  <p className="text-sm text-text-secondary">
                    <span className="text-orange-400 font-semibold">Why this matters:</span> MEV is a $600M+ annual market on Ethereum. As NEAR DeFi grows, understanding MEV vectors helps you protect your users and potentially build profitable MEV strategies.
                  </p>
                </Card>
              </div>
            )}

            {selectedTab === 'learn' && (
              <div className="space-y-8">
                {/* Section 1: MEV on NEAR */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Eye className="w-5 h-5 text-blue-400" />
                    MEV on NEAR vs Ethereum
                  </h4>
                  <p className="text-text-secondary mb-3">
                    NEAR&apos;s sharded architecture changes the MEV landscape significantly. The async receipt model adds complexity but also new opportunities:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card variant="default" padding="md" className="border-blue-500/20">
                      <h5 className="font-semibold text-blue-400 text-sm mb-2">Ethereum MEV</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• Block builders have full transaction ordering power</li>
                        <li>• Mempool is publicly visible → frontrunning</li>
                        <li>• Flashbots/MEV-Boost create an MEV marketplace</li>
                        <li>• Atomic transactions enable sandwich attacks</li>
                      </ul>
                    </Card>
                    <Card variant="default" padding="md" className="border-green-500/20">
                      <h5 className="font-semibold text-green-400 text-sm mb-2">NEAR MEV</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• Chunk producers order transactions per shard</li>
                        <li>• Cross-shard calls are async (multi-block)</li>
                        <li>• No public mempool (transactions go to RPC nodes)</li>
                        <li>• Receipt ordering across shards adds uncertainty</li>
                      </ul>
                    </Card>
                  </div>
                </section>

                {/* Section 2: Transaction Ordering */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-purple-400" />
                    Transaction Ordering Mechanics
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Understanding how NEAR orders transactions within a chunk is key to analyzing MEV:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-text-secondary border border-border">
                    <div className="text-purple-400 mb-2">{'// Transaction ordering within a chunk'}</div>
                    <div className="text-near-green">{'// 1. Chunk producer receives transactions from pool'}</div>
                    <div className="text-near-green">{'// 2. Transactions sorted by:'}</div>
                    <div className="text-near-green">{'//    a) Account nonce (sequential per account)'}</div>
                    <div className="text-near-green">{'//    b) Among different accounts: chunk producer decides'}</div>
                    <div className="text-near-green">{'// 3. Receipts from previous blocks are processed FIRST'}</div>
                    <div className="text-near-green">{'// 4. New transactions converted to receipts AFTER'}</div>
                    <div className="mt-2 text-purple-400">{'// This means:'}</div>
                    <div className="text-near-green">{'// - Cross-shard receipts have priority over new txns'}</div>
                    <div className="text-near-green">{'// - Chunk producer can reorder between accounts'}</div>
                    <div className="text-near-green">{'// - Same-account txns are always ordered by nonce'}</div>
                  </div>
                </section>

                {/* Section 3: MEV Vectors */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    NEAR-Specific MEV Vectors
                  </h4>
                  <p className="text-text-secondary mb-3">
                    These are the primary MEV opportunities and risks on NEAR:
                  </p>
                  <div className="space-y-3">
                    <Card variant="default" padding="md" className="border-red-500/20">
                      <h5 className="font-semibold text-red-400 text-sm mb-2">DEX Arbitrage</h5>
                      <p className="text-xs text-text-muted">Price discrepancies between NEAR DEXs (Ref Finance, etc.) can be exploited. The async nature means arbitrage is less atomic than on Ethereum — you may need to handle partial fills.</p>
                    </Card>
                    <Card variant="default" padding="md" className="border-orange-500/20">
                      <h5 className="font-semibold text-orange-400 text-sm mb-2">Liquidation Bots</h5>
                      <p className="text-xs text-text-muted">Monitoring lending protocols for undercollateralized positions. First to submit liquidation tx wins. NEAR&apos;s ~1s blocks make this extremely competitive.</p>
                    </Card>
                    <Card variant="default" padding="md" className="border-yellow-500/20">
                      <h5 className="font-semibold text-yellow-400 text-sm mb-2">Cross-Shard Receipt Racing</h5>
                      <p className="text-xs text-text-muted">When a cross-shard receipt is pending, observing it and front-running on the destination shard. This is unique to NEAR&apos;s architecture.</p>
                    </Card>
                  </div>
                </section>

                {/* Section 4: Protection Patterns */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-400" />
                    MEV Protection Techniques
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Protect your users and contracts from MEV extraction:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-text-secondary border border-border">
                    <div className="text-green-400 mb-2">{'// Commit-Reveal pattern for MEV protection'}</div>
                    <div className="text-near-green">{'#[near]'}</div>
                    <div className="text-near-green">{'impl MevProtectedSwap {'}</div>
                    <div className="text-near-green">{'    // Phase 1: User commits hash of their order'}</div>
                    <div className="text-near-green">{'    pub fn commit_order(&mut self, order_hash: String) {'}</div>
                    <div className="text-near-green">{'        self.commitments.insert('}</div>
                    <div className="text-near-green">{'            &env::predecessor_account_id(),'}</div>
                    <div className="text-near-green">{'            &Commitment {'}</div>
                    <div className="text-near-green">{'                hash: order_hash,'}</div>
                    <div className="text-near-green">{'                block: env::block_height(),'}</div>
                    <div className="text-near-green">{'            }'}</div>
                    <div className="text-near-green">{'        );'}</div>
                    <div className="text-near-green">{'    }'}</div>
                    <div className="mt-1 text-near-green">{'    // Phase 2: After N blocks, reveal and execute'}</div>
                    <div className="text-near-green">{'    pub fn reveal_order(&mut self, token_in: AccountId,'}</div>
                    <div className="text-near-green">{'        amount: U128, min_out: U128, salt: String) {'}</div>
                    <div className="text-near-green">{'        let commitment = self.commitments'}</div>
                    <div className="text-near-green">{'            .get(&env::predecessor_account_id()).unwrap();'}</div>
                    <div className="text-near-green">{'        // Verify reveal matches commitment'}</div>
                    <div className="text-near-green">{'        let hash = env::sha256('}</div>
                    <div className="text-near-green">{'            format!("{}{}{}{}", token_in, amount.0, min_out.0, salt)'}</div>
                    <div className="text-near-green">{'                .as_bytes());'}</div>
                    <div className="text-near-green">{'        require!(hex::encode(hash) == commitment.hash);'}</div>
                    <div className="text-near-green">{'        // Must wait at least 3 blocks'}</div>
                    <div className="text-near-green">{'        require!(env::block_height() >= commitment.block + 3);'}</div>
                    <div className="text-near-green">{'        // Execute swap...'}</div>
                    <div className="text-near-green">{'    }'}</div>
                    <div className="text-near-green">{'}'}</div>
                  </div>
                </section>

                {/* Section 5: Building MEV Bots */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    Building MEV Bots on NEAR
                  </h4>
                  <p className="text-text-secondary mb-3">
                    If you want to build MEV bots (for arbitrage, liquidations), here&apos;s the architecture:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-text-secondary border border-border">
                    <div className="text-yellow-400 mb-2">{'// MEV bot architecture'}</div>
                    <div className="text-near-green">{'class NearMevBot {'}</div>
                    <div className="text-near-green">{'  // 1. Stream blocks from NEAR Lake framework'}</div>
                    <div className="text-near-green">{'  async monitor() {'}</div>
                    <div className="text-near-green">{'    const lake = new LakeFramework({ network: "mainnet" });'}</div>
                    <div className="text-near-green">{'    for await (const block of lake.stream()) {'}</div>
                    <div className="text-near-green">{'      for (const shard of block.shards) {'}</div>
                    <div className="text-near-green">{'        for (const receipt of shard.receipt_execution_outcomes) {'}</div>
                    <div className="text-near-green">{'          if (this.isArbitrageable(receipt)) {'}</div>
                    <div className="text-near-green">{'            await this.executeArbitrage(receipt);'}</div>
                    <div className="text-near-green">{'          }'}</div>
                    <div className="text-near-green">{'        }'}</div>
                    <div className="text-near-green">{'      }'}</div>
                    <div className="text-near-green">{'    }'}</div>
                    <div className="text-near-green">{'  }'}</div>
                    <div className="mt-1 text-near-green">{'  // 2. Send transactions to multiple RPC nodes'}</div>
                    <div className="text-near-green">{'  async executeArbitrage(opp: Opportunity) {'}</div>
                    <div className="text-near-green">{'    const tx = buildArbitrageTx(opp);'}</div>
                    <div className="text-near-green">{'    // Broadcast to multiple RPCs for speed'}</div>
                    <div className="text-near-green">{'    await Promise.race(['}</div>
                    <div className="text-near-green">{'      rpc1.sendTransaction(tx),'}</div>
                    <div className="text-near-green">{'      rpc2.sendTransaction(tx),'}</div>
                    <div className="text-near-green">{'      rpc3.sendTransaction(tx),'}</div>
                    <div className="text-near-green">{'    ]);'}</div>
                    <div className="text-near-green">{'  }'}</div>
                    <div className="text-near-green">{'}'}</div>
                  </div>
                </section>
              </div>
            )}

            {selectedTab === 'practice' && (
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-text-primary">Exercises</h4>

                <Card variant="default" padding="md" className="border-red-500/20">
                  <h5 className="font-semibold text-red-400 text-sm mb-2">🔴 Exercise 1: MEV Detection</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Build a tool that analyzes NEAR blocks for potential MEV activity. Look for: back-to-back DEX trades by the same account, large swaps followed by opposing swaps, and liquidation transactions.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-red-500/20">
                  <h5 className="font-semibold text-red-400 text-sm mb-2">🔴 Exercise 2: Commit-Reveal Swap</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Implement a commit-reveal swap contract on testnet. Users commit a hash of their swap parameters, wait 3 blocks, then reveal and execute. Verify that the swap cannot be frontrun.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-red-500/20">
                  <h5 className="font-semibold text-red-400 text-sm mb-2">🔴 Exercise 3: Arbitrage Bot</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Build a simple arbitrage bot that monitors price differences between two testnet DEX contracts. When the spread exceeds gas costs, execute the arbitrage. Measure profitability.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-red-500/20">
                  <h5 className="font-semibold text-red-400 text-sm mb-2">🔴 Exercise 4: Receipt Ordering Analysis</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Using NEAR Lake, analyze 1000 blocks and map how receipts are ordered within chunks. Determine if there are predictable patterns that could be exploited.
                  </p>
                </Card>
              </div>
            )}

            {selectedTab === 'resources' && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-text-primary">Resources</h4>
                {[
                  { title: 'Flash Boys 2.0 Paper', url: 'https://arxiv.org/abs/1904.05234', desc: 'Seminal MEV research paper applicable across chains' },
                  { title: 'Flashbots Research', url: 'https://writings.flashbots.net/', desc: 'MEV research and mitigation strategies' },
                  { title: 'NEAR Transaction Ordering', url: 'https://nomicon.io/ChainSpec/Transactions', desc: 'Protocol spec for how transactions are ordered in chunks' },
                  { title: 'NEAR Lake Framework', url: 'https://docs.near.org/concepts/advanced/near-lake-framework', desc: 'Stream blocks for MEV detection and bot building' },
                  { title: 'Ref Finance Contracts', url: 'https://github.com/ref-finance/ref-contracts', desc: 'Study DEX contracts for understanding swap mechanics' },
                  { title: 'MEV on L2s Research', url: 'https://timroughgarden.org/papers/mev.pdf', desc: 'Tim Roughgarden\'s research on MEV in different architectures' },
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

export default MevTransactionOrdering;
