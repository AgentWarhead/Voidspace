'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Globe, ExternalLink, CheckCircle, Network, ArrowRight, Layers, Code, Shield } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

interface MultiChainWithNearProps {
  isActive: boolean;
  onToggle: () => void;
}

const MultiChainWithNear: React.FC<MultiChainWithNearProps> = ({ isActive, onToggle }) => {
  const [selectedTab, setSelectedTab] = useState<string>('overview');

  return (
    <Card variant="glass" padding="none" className="border-purple-500/20">
      <div
        onClick={onToggle}
        className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Multi-Chain with NEAR</h3>
            <p className="text-text-muted text-sm">Building cross-chain dApps, bridges, and multi-chain orchestration</p>
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
                  <Globe className="w-5 h-5 text-indigo-400" />
                  <h4 className="text-lg font-semibold text-text-primary">What You&apos;ll Learn</h4>
                </div>
                <ul className="space-y-3">
                  {[
                    'NEAR as a multi-chain orchestration layer — coordinating actions across chains',
                    'Rainbow Bridge architecture — trustless Ethereum ↔ NEAR bridge',
                    'Building with chain signatures for Bitcoin, Ethereum, Solana integration',
                    'Cross-chain state verification and light client patterns',
                    'Designing dApps that abstract away the underlying chains',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-text-secondary">
                      <CheckCircle className="w-4 h-4 text-near-green mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Card variant="default" padding="md" className="mt-4 border-indigo-500/20 bg-indigo-500/5">
                  <p className="text-sm text-text-secondary">
                    <span className="text-indigo-400 font-semibold">Why this matters:</span> The future is multi-chain. Users don&apos;t care which chain their assets are on — they want seamless experiences. NEAR&apos;s chain abstraction stack makes it the ideal orchestration layer.
                  </p>
                </Card>
              </div>
            )}

            {selectedTab === 'learn' && (
              <div className="space-y-8">
                {/* Section 1: Multi-Chain Architecture */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Network className="w-5 h-5 text-blue-400" />
                    Multi-Chain Architecture Patterns
                  </h4>
                  <p className="text-text-secondary mb-3">
                    There are several patterns for building multi-chain applications with NEAR as the coordination layer:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Card variant="default" padding="md" className="border-blue-500/20">
                      <h5 className="font-semibold text-blue-400 text-sm mb-2">Hub-and-Spoke</h5>
                      <p className="text-xs text-text-muted">NEAR as the central hub. All cross-chain messages route through NEAR. Simplest to implement, NEAR pays for coordination gas.</p>
                    </Card>
                    <Card variant="default" padding="md" className="border-purple-500/20">
                      <h5 className="font-semibold text-purple-400 text-sm mb-2">Direct Signing</h5>
                      <p className="text-xs text-text-muted">NEAR contract directly signs transactions for other chains via chain signatures. No bridge needed for outgoing operations.</p>
                    </Card>
                    <Card variant="default" padding="md" className="border-green-500/20">
                      <h5 className="font-semibold text-green-400 text-sm mb-2">Verification</h5>
                      <p className="text-xs text-text-muted">Light clients on NEAR verify other chain state. Trustless proof verification for incoming cross-chain messages.</p>
                    </Card>
                  </div>
                </section>

                {/* Section 2: Rainbow Bridge */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <ArrowRight className="w-5 h-5 text-green-400" />
                    Rainbow Bridge Deep Dive
                  </h4>
                  <p className="text-text-secondary mb-3">
                    The Rainbow Bridge is a trustless bridge between Ethereum and NEAR. It uses light client verification — no trusted third party:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-text-secondary border border-border">
                    <div className="text-green-400 mb-2">{'// Rainbow Bridge architecture'}</div>
                    <div className="text-near-green">{'// ETH → NEAR direction:'}</div>
                    <div className="text-near-green">{'// 1. User locks tokens in Ethereum locker contract'}</div>
                    <div className="text-near-green">{'// 2. Relayer submits ETH block headers to NEAR light client'}</div>
                    <div className="text-near-green">{'// 3. NEAR light client verifies the ETH proof'}</div>
                    <div className="text-near-green">{'// 4. NEAR mints wrapped tokens to user'}</div>
                    <div className="mt-2 text-near-green">{'// NEAR → ETH direction:'}</div>
                    <div className="text-near-green">{'// 1. User burns wrapped tokens on NEAR'}</div>
                    <div className="text-near-green">{'// 2. Relayer submits NEAR block to ETH light client'}</div>
                    <div className="text-near-green">{'// 3. ETH light client verifies NEAR proof (expensive!)'}</div>
                    <div className="text-near-green">{'// 4. ETH locker releases original tokens'}</div>
                    <div className="mt-2 text-near-green">{'// Challenge period: NEAR→ETH takes ~16 hours'}</div>
                    <div className="text-near-green">{'// (optimistic verification with fraud proofs)'}</div>
                  </div>
                </section>

                {/* Section 3: Cross-Chain with Chain Signatures */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-yellow-400" />
                    Cross-Chain via Chain Signatures
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Chain signatures enable a more flexible multi-chain pattern — your NEAR contract can directly control assets on any chain:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-text-secondary border border-border">
                    <div className="text-yellow-400 mb-2">{'// Multi-chain vault contract'}</div>
                    <div className="text-near-green">{'#[near]'}</div>
                    <div className="text-near-green">{'impl MultiChainVault {'}</div>
                    <div className="text-near-green">{'    // Deposit tracking (off-chain monitoring)'}</div>
                    <div className="text-near-green">{'    pub fn register_deposit('}</div>
                    <div className="text-near-green">{'        &mut self, chain: String, tx_proof: Vec<u8>'}</div>
                    <div className="text-near-green">{'    ) {'}</div>
                    <div className="text-near-green">{'        // Verify proof of deposit on source chain'}</div>
                    <div className="text-near-green">{'        // Credit user balance'}</div>
                    <div className="text-near-green">{'    }'}</div>
                    <div className="mt-1 text-near-green">{'    // Withdraw to any chain'}</div>
                    <div className="text-near-green">{'    pub fn withdraw('}</div>
                    <div className="text-near-green">{'        &mut self, chain: String, to: String, amount: U128'}</div>
                    <div className="text-near-green">{'    ) -> Promise {'}</div>
                    <div className="text-near-green">{'        // Debit user balance'}</div>
                    <div className="text-near-green">{'        // Construct transaction for target chain'}</div>
                    <div className="text-near-green">{'        // Request chain signature to sign it'}</div>
                    <div className="text-near-green">{'        let path = format!("{}-withdrawal", chain);'}</div>
                    <div className="text-near-green">{'        self.request_signature(tx_bytes, path)'}</div>
                    <div className="text-near-green">{'    }'}</div>
                    <div className="text-near-green">{'}'}</div>
                  </div>
                </section>

                {/* Section 4: Light Client Verification */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-red-400" />
                    Light Client Verification
                  </h4>
                  <p className="text-text-secondary mb-3">
                    For incoming cross-chain messages, you need trustless verification. NEAR supports light clients for multiple chains:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card variant="default" padding="md" className="border-red-500/20">
                      <h5 className="font-semibold text-red-400 text-sm mb-2">Ethereum Light Client</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• Deployed on NEAR as a smart contract</li>
                        <li>• Verifies Ethereum block headers and receipts</li>
                        <li>• Uses Ethereum consensus (beacon chain) proofs</li>
                        <li>• ~10 minute verification delay</li>
                      </ul>
                    </Card>
                    <Card variant="default" padding="md" className="border-blue-500/20">
                      <h5 className="font-semibold text-blue-400 text-sm mb-2">NEAR Light Client on ETH</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• Deployed on Ethereum as a Solidity contract</li>
                        <li>• Verifies NEAR block headers</li>
                        <li>• Uses Ed25519 signature verification (expensive on ETH)</li>
                        <li>• Optimistic with challenge period (~16 hours)</li>
                      </ul>
                    </Card>
                  </div>
                </section>

                {/* Section 5: Multi-Chain dApp Design */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Code className="w-5 h-5 text-cyan-400" />
                    Multi-Chain dApp Design
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Design patterns for building user-friendly multi-chain applications:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-text-secondary border border-border">
                    <div className="text-cyan-400 mb-2">{'// Frontend multi-chain abstraction'}</div>
                    <div className="text-near-green">{'class MultiChainApp {'}</div>
                    <div className="text-near-green">{'  // Unified balance view across all chains'}</div>
                    <div className="text-near-green">{'  async getPortfolio(nearAccountId: string) {'}</div>
                    <div className="text-near-green">{'    const [nearBalance, ethBalance, btcBalance] = await Promise.all(['}</div>
                    <div className="text-near-green">{'      this.getNearBalance(nearAccountId),'}</div>
                    <div className="text-near-green">{'      this.getEthBalance(derivedEthAddress),'}</div>
                    <div className="text-near-green">{'      this.getBtcBalance(derivedBtcAddress),'}</div>
                    <div className="text-near-green">{'    ]);'}</div>
                    <div className="text-near-green">{'    return { near: nearBalance, eth: ethBalance, btc: btcBalance };'}</div>
                    <div className="text-near-green">{'  }'}</div>
                    <div className="mt-1 text-near-green">{'  // Single function for any cross-chain transfer'}</div>
                    <div className="text-near-green">{'  async transfer(from: ChainAsset, to: ChainAsset, amount: string) {'}</div>
                    <div className="text-near-green">{'    if (from.chain === to.chain) return this.sameChainTransfer(from, to, amount);'}</div>
                    <div className="text-near-green">{'    // Route through NEAR for cross-chain'}</div>
                    <div className="text-near-green">{'    return this.crossChainTransfer(from, to, amount);'}</div>
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
                  <h5 className="font-semibold text-red-400 text-sm mb-2">🔴 Exercise 1: Multi-Chain Balance Viewer</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Build a frontend that takes a NEAR account ID, derives Ethereum and Bitcoin addresses via chain signatures, and shows a unified balance view across all three chains.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-red-500/20">
                  <h5 className="font-semibold text-red-400 text-sm mb-2">🔴 Exercise 2: Cross-Chain NFT</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Create an NFT that can be moved between NEAR and Ethereum. Mint on NEAR, lock on NEAR + mint wrapped on ETH (via chain signatures), and reverse the process.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-red-500/20">
                  <h5 className="font-semibold text-red-400 text-sm mb-2">🔴 Exercise 3: Multi-Chain DeFi Aggregator</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Build a swap aggregator that finds the best price across NEAR DEXs, Ethereum DEXs (Uniswap), and executes the optimal path. Use intents for the cross-chain routing.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-red-500/20">
                  <h5 className="font-semibold text-red-400 text-sm mb-2">🔴 Exercise 4: Cross-Chain Message Verifier</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Build a contract on NEAR that verifies Ethereum event logs. Submit an Ethereum receipt proof and verify that a specific event was emitted on Ethereum using the light client.
                  </p>
                </Card>
              </div>
            )}

            {selectedTab === 'resources' && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-text-primary">Resources</h4>
                {[
                  { title: 'Rainbow Bridge', url: 'https://rainbowbridge.app/', desc: 'The official ETH↔NEAR trustless bridge' },
                  { title: 'Rainbow Bridge Architecture', url: 'https://near.org/blog/eth-near-rainbow-bridge/', desc: 'Technical deep dive into bridge architecture' },
                  { title: 'Chain Signatures for Multi-Chain', url: 'https://docs.near.org/concepts/abstraction/chain-signatures', desc: 'Using chain signatures for cross-chain operations' },
                  { title: 'NEAR Light Client', url: 'https://github.com/near/rainbow-bridge', desc: 'Source code for NEAR/ETH light clients' },
                  { title: 'Cross-Chain Communication Research', url: 'https://arxiv.org/abs/2210.16422', desc: 'Academic survey of cross-chain communication protocols' },
                  { title: 'Aurora (NEAR EVM)', url: 'https://aurora.dev', desc: 'EVM compatibility layer on NEAR for Ethereum dApp migration' },
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

export default MultiChainWithNear;
