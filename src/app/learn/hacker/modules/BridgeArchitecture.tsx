'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ExternalLink, CheckCircle, GitBranch, Shield, Layers, AlertTriangle, Send, Lock } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

interface BridgeArchitectureProps {
  isActive: boolean;
  onToggle: () => void;
}

const BridgeArchitecture: React.FC<BridgeArchitectureProps> = ({ isActive, onToggle }) => {
  const [selectedTab, setSelectedTab] = useState<string>('overview');

  return (
    <Card variant="glass" padding="none" className="border-purple-500/20">
      <div
        onClick={onToggle}
        className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
            <GitBranch className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Bridge Architecture</h3>
            <p className="text-text-muted text-sm">Rainbow Bridge, light clients, cross-chain messaging, and bridge security</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-red-500/10 text-red-300 border-red-500/20">Advanced</Badge>
          <Badge className="bg-purple-500/10 text-purple-300 border-purple-500/20">70 min</Badge>
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
                  <GitBranch className="w-5 h-5 text-green-400" />
                  <h4 className="text-lg font-semibold text-text-primary">What You&apos;ll Learn</h4>
                </div>
                <ul className="space-y-3">
                  {[
                    'Rainbow Bridge deep dive: trustless NEAR ↔ Ethereum asset transfers',
                    'Light client verification: how bridges prove state across chains',
                    'Wormhole and other bridge protocols operating on NEAR',
                    'Building cross-chain messaging applications',
                    'Bridge security: trust assumptions, risks, and mitigation strategies',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-text-secondary">
                      <CheckCircle className="w-4 h-4 text-near-green mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Card variant="default" padding="md" className="mt-4 border-green-500/20 bg-green-500/5">
                  <p className="text-sm text-text-secondary">
                    <span className="text-green-400 font-semibold">Why this matters:</span> Bridges are the highways of the multi-chain world. Understanding how they work — and how they fail — is critical for building secure cross-chain applications. Over $2B has been lost to bridge exploits, making security knowledge essential.
                  </p>
                </Card>
              </div>
            )}

            {selectedTab === 'learn' && (
              <div className="space-y-8">
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-green-400" />
                    Rainbow Bridge Architecture
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Rainbow Bridge is a trustless, permissionless bridge between NEAR and Ethereum. It uses light clients on each chain to verify the other chain&apos;s state — no multisig or trusted relayers required.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card variant="default" padding="md" className="border-green-500/20">
                      <h5 className="font-semibold text-green-400 text-sm mb-2">NEAR → Ethereum</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• NEAR light client contract on Ethereum</li>
                        <li>• Relayers submit NEAR block headers</li>
                        <li>• Ethereum verifies NEAR validator signatures</li>
                        <li>• Proof of inclusion via Merkle Patricia trie</li>
                        <li>• ~16 hour finality (optimistic challenge window)</li>
                      </ul>
                    </Card>
                    <Card variant="default" padding="md" className="border-teal-500/20">
                      <h5 className="font-semibold text-teal-400 text-sm mb-2">Ethereum → NEAR</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• Ethereum light client contract on NEAR</li>
                        <li>• Tracks Ethereum block headers (PoS sync committee)</li>
                        <li>• Verifies receipts and storage proofs</li>
                        <li>• ~12 minutes (Ethereum finality)</li>
                        <li>• Fully trustless — anyone can relay headers</li>
                      </ul>
                    </Card>
                  </div>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-400" />
                    Light Client Verification
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Light clients are the core security mechanism. They verify state proofs without downloading the full blockchain:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-text-secondary border border-border">
                    <div className="text-blue-400 mb-2">{'// How light client verification works'}</div>
                    <div className="text-near-green">{'// 1. NEAR Light Client on Ethereum (Solidity)'}</div>
                    <div className="text-near-green">{'//    - Stores NEAR block headers'}</div>
                    <div className="text-near-green">{'//    - Validates Ed25519 signatures from NEAR validators'}</div>
                    <div className="text-near-green">{'//    - Checks ≥2/3 stake signed the block'}</div>
                    <div className="mt-2 text-near-green">{'// 2. Proof Submission'}</div>
                    <div className="text-near-green">{'//    User submits:'}</div>
                    <div className="text-near-green">{'//    a) Block header containing the transaction'}</div>
                    <div className="text-near-green">{'//    b) Merkle proof of receipt inclusion'}</div>
                    <div className="text-near-green">{'//    c) The receipt proving the action happened'}</div>
                    <div className="mt-2 text-near-green">{'// 3. Ethereum Light Client on NEAR (Rust/WASM)'}</div>
                    <div className="text-near-green">{'//    - Follows Ethereum sync committee (512 validators)'}</div>
                    <div className="text-near-green">{'//    - Verifies BLS12-381 aggregate signatures'}</div>
                    <div className="text-near-green">{'//    - Validates Merkle Patricia trie proofs'}</div>
                    <div className="text-near-green">{'//    - Uses NEAR precompiles for BLS operations'}</div>
                  </div>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Send className="w-5 h-5 text-purple-400" />
                    Cross-Chain Messaging
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Beyond asset transfers, bridges enable general cross-chain messaging — smart contracts on one chain triggering actions on another:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-text-secondary border border-border">
                    <div className="text-purple-400 mb-2">{'// Wormhole: Cross-chain message passing on NEAR'}</div>
                    <div className="text-near-green">{'// 1. Publish message on source chain'}</div>
                    <div className="text-near-green">{'const message = {'}</div>
                    <div className="text-near-green">{'  payload: encode(["uint256", "address"], [amount, recipient]),'}</div>
                    <div className="text-near-green">{'  nonce: 0,'}</div>
                    <div className="text-near-green">{'  consistency_level: 1,  // finalized'}</div>
                    <div className="text-near-green">{'};'}</div>
                    <div className="mt-2 text-near-green">{'// 2. Wormhole Guardians observe and sign (19 validators)'}</div>
                    <div className="text-near-green">{'// VAA (Verifiable Action Approval) = signed attestation'}</div>
                    <div className="text-near-green">{'// Requires 13/19 guardian signatures'}</div>
                    <div className="mt-2 text-near-green">{'// 3. Submit VAA to destination chain contract'}</div>
                    <div className="text-near-green">{'await nearContract.call("submit_vaa", {'}</div>
                    <div className="text-near-green">{'  vaa: serializedVAA,  // includes signatures + payload'}</div>
                    <div className="text-near-green">{'});'}</div>
                    <div className="mt-2 text-near-green">{'// 4. NEAR contract verifies guardian signatures'}</div>
                    <div className="text-near-green">{'//    and executes the encoded action'}</div>
                  </div>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    Bridge Security
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Bridges are high-value targets. Understanding their trust assumptions and attack surfaces is critical:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card variant="default" padding="md" className="border-red-500/20">
                      <h5 className="font-semibold text-red-400 text-sm mb-2">Attack Vectors</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• Validator/guardian key compromise</li>
                        <li>• Smart contract bugs (Wormhole 2022: $320M)</li>
                        <li>• Light client header manipulation</li>
                        <li>• Replay attacks across chains</li>
                        <li>• Relay censorship or DoS</li>
                      </ul>
                    </Card>
                    <Card variant="default" padding="md" className="border-green-500/20">
                      <h5 className="font-semibold text-green-400 text-sm mb-2">Security Measures</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• Light client verification (Rainbow Bridge)</li>
                        <li>• Optimistic challenge periods</li>
                        <li>• Rate limiting on withdrawals</li>
                        <li>• Multi-sig guardian sets (Wormhole)</li>
                        <li>• Bug bounties and formal audits</li>
                      </ul>
                    </Card>
                  </div>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Lock className="w-5 h-5 text-yellow-400" />
                    Trust Spectrum
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Different bridges make different trust tradeoffs. Understand where each falls on the spectrum:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-text-secondary border border-border">
                    <div className="text-yellow-400 mb-2">{'// Bridge trust spectrum (most → least trust required)'}</div>
                    <div className="mt-1 text-near-green">{'// 1. Custodial bridges (centralized)'}</div>
                    <div className="text-near-green">{'//    Trust: single entity holds locked funds'}</div>
                    <div className="text-near-green">{'//    Risk: rug pull, hack, regulatory seizure'}</div>
                    <div className="mt-2 text-near-green">{'// 2. Multi-sig bridges (Wormhole, Axelar)'}</div>
                    <div className="text-near-green">{'//    Trust: m-of-n guardians/validators'}</div>
                    <div className="text-near-green">{'//    Risk: collusion, key compromise'}</div>
                    <div className="mt-2 text-near-green">{'// 3. Optimistic bridges (Nomad-style)'}</div>
                    <div className="text-near-green">{'//    Trust: at least 1 honest watcher'}</div>
                    <div className="text-near-green">{'//    Risk: watcher liveness, challenge window exploits'}</div>
                    <div className="mt-2 text-near-green">{'// 4. Light client bridges (Rainbow Bridge) ⭐'}</div>
                    <div className="text-near-green">{'//    Trust: underlying chain consensus'}</div>
                    <div className="text-near-green">{'//    Risk: consensus attack on source chain'}</div>
                    <div className="text-near-green">{'//    This is the gold standard for trustlessness'}</div>
                  </div>
                </section>
              </div>
            )}

            {selectedTab === 'practice' && (
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-text-primary">Exercises</h4>

                <Card variant="default" padding="md" className="border-green-500/20">
                  <h5 className="font-semibold text-green-400 text-sm mb-2">🟢 Exercise 1: Rainbow Bridge Token Transfer</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Use the Rainbow Bridge SDK to transfer an ERC-20 token from Ethereum Goerli to NEAR testnet. Track the proof submission and finalization on both chains.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-green-500/20">
                  <h5 className="font-semibold text-green-400 text-sm mb-2">🟢 Exercise 2: Light Client State Proof</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Construct a Merkle proof that verifies a NEAR receipt was included in a specific block. Submit it to the NEAR light client contract on Ethereum testnet.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-green-500/20">
                  <h5 className="font-semibold text-green-400 text-sm mb-2">🟢 Exercise 3: Cross-Chain Messaging dApp</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Build a simple cross-chain messaging app using Wormhole on NEAR testnet. Send a message from NEAR that triggers an action on another testnet chain.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-green-500/20">
                  <h5 className="font-semibold text-green-400 text-sm mb-2">🟢 Exercise 4: Bridge Monitor</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Build a monitoring tool that watches Rainbow Bridge relayer activity. Track block header submissions, proof verifications, and detect anomalies like missed headers or delayed proofs.
                  </p>
                </Card>
              </div>
            )}

            {selectedTab === 'resources' && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-text-primary">Resources</h4>
                {[
                  { title: 'Rainbow Bridge', url: 'https://rainbowbridge.app/', desc: 'Official Rainbow Bridge for NEAR ↔ Ethereum trustless asset transfers' },
                  { title: 'Rainbow Bridge Architecture', url: 'https://near.org/blog/eth-near-rainbow-bridge/', desc: 'Technical deep dive into Rainbow Bridge\'s light client design' },
                  { title: 'Wormhole Documentation', url: 'https://docs.wormhole.com/', desc: 'Wormhole cross-chain messaging protocol — SDKs, APIs, and integration guides' },
                  { title: 'Aurora Engine', url: 'https://doc.aurora.dev/', desc: 'EVM on NEAR — run Ethereum dApps natively with Rainbow Bridge integration' },
                  { title: 'Bridge Security Research', url: 'https://blog.li.fi/bridge-exploits-2022-a-retrospective-2b0a3ff7e0f6', desc: 'Comprehensive analysis of bridge exploits and security lessons' },
                  { title: 'NEAR Light Client', url: 'https://github.com/near/nearcore/tree/master/core/primitives-core', desc: 'NEAR core primitives used for light client proof verification' },
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

export default BridgeArchitecture;
