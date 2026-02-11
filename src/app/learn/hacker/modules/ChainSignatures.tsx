'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Key, ExternalLink, CheckCircle, Lock, Shield, Fingerprint, Workflow, Globe } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

interface ChainSignaturesProps {
  isActive: boolean;
  onToggle: () => void;
}

const ChainSignatures: React.FC<ChainSignaturesProps> = ({ isActive, onToggle }) => {
  const [selectedTab, setSelectedTab] = useState<string>('overview');

  return (
    <Card variant="glass" padding="none" className="border-purple-500/20">
      <div
        onClick={onToggle}
        className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-red-500 rounded-xl flex items-center justify-center">
            <Key className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Chain Signatures</h3>
            <p className="text-text-muted text-sm">MPC-based signing, multi-chain key derivation, and cross-chain transactions</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-red-500/10 text-red-300 border-red-500/20">Advanced</Badge>
          <Badge className="bg-purple-500/10 text-purple-300 border-purple-500/20">65 min</Badge>
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
                  <Key className="w-5 h-5 text-yellow-400" />
                  <h4 className="text-lg font-semibold text-text-primary">What You&apos;ll Learn</h4>
                </div>
                <ul className="space-y-3">
                  {[
                    'How NEAR\'s MPC network generates signatures for any blockchain',
                    'Key derivation paths — deriving Bitcoin, Ethereum, and other chain keys from a NEAR account',
                    'Building cross-chain transactions signed by NEAR smart contracts',
                    'The threshold signature scheme and its security guarantees',
                    'Production patterns for chain signature-powered dApps',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-text-secondary">
                      <CheckCircle className="w-4 h-4 text-near-green mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Card variant="default" padding="md" className="mt-4 border-yellow-500/20 bg-yellow-500/5">
                  <p className="text-sm text-text-secondary">
                    <span className="text-yellow-400 font-semibold">Why this matters:</span> Chain signatures let a single NEAR account control assets on Bitcoin, Ethereum, Solana, and any chain. This is the foundation of NEAR&apos;s chain abstraction vision — one account, every chain.
                  </p>
                </Card>
              </div>
            )}

            {selectedTab === 'learn' && (
              <div className="space-y-8">
                {/* Section 1: MPC Network */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-400" />
                    The MPC Signing Network
                  </h4>
                  <p className="text-text-secondary mb-3">
                    NEAR&apos;s chain signatures use a Multi-Party Computation (MPC) network. No single node holds the full private key — it&apos;s split across multiple nodes using threshold cryptography.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card variant="default" padding="md" className="border-blue-500/20">
                      <h5 className="font-semibold text-blue-400 text-sm mb-2">How It Works</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• MPC nodes each hold a key share</li>
                        <li>• Threshold: t-of-n nodes must collaborate to sign</li>
                        <li>• No single node can reconstruct the full key</li>
                        <li>• Signing requests come from NEAR smart contracts</li>
                        <li>• The MPC contract verifies the caller has permission</li>
                      </ul>
                    </Card>
                    <Card variant="default" padding="md" className="border-purple-500/20">
                      <h5 className="font-semibold text-purple-400 text-sm mb-2">Security Model</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• Byzantine fault tolerant (up to 1/3 malicious nodes)</li>
                        <li>• Key resharing: rotate shares without changing public key</li>
                        <li>• Deterministic derivation: same inputs → same derived key</li>
                        <li>• Audit trail: all sign requests recorded on NEAR</li>
                        <li>• Access control via NEAR smart contract logic</li>
                      </ul>
                    </Card>
                  </div>
                </section>

                {/* Section 2: Key Derivation */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Fingerprint className="w-5 h-5 text-green-400" />
                    Key Derivation Paths
                  </h4>
                  <p className="text-text-secondary mb-3">
                    From a single NEAR account, you can derive unique keys for any blockchain. The derivation path determines which key is generated:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-text-secondary border border-border">
                    <div className="text-green-400 mb-2">{'// Key derivation for different chains'}</div>
                    <div className="text-near-green">{'// NEAR account: alice.near'}</div>
                    <div className="text-near-green">{'// MPC contract: v1.signer.near'}</div>
                    <div className="mt-2 text-near-green">{'// Derive an Ethereum key:'}</div>
                    <div className="text-near-green">{'// path: "ethereum-1"'}</div>
                    <div className="text-near-green">{'// → deterministic secp256k1 public key'}</div>
                    <div className="text-near-green">{'// → Ethereum address: 0x7a3f...'}</div>
                    <div className="mt-2 text-near-green">{'// Derive a Bitcoin key:'}</div>
                    <div className="text-near-green">{'// path: "bitcoin-1"'}</div>
                    <div className="text-near-green">{'// → deterministic secp256k1 public key'}</div>
                    <div className="text-near-green">{'// → Bitcoin address: bc1q...'}</div>
                    <div className="mt-2 text-near-green">{'// Same account, different path = different key'}</div>
                    <div className="text-near-green">{'// Different account, same path = different key'}</div>
                  </div>
                </section>

                {/* Section 3: Sign Request Flow */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Workflow className="w-5 h-5 text-orange-400" />
                    Signing Flow
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Here&apos;s the complete flow for signing a cross-chain transaction:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-text-secondary border border-border">
                    <div className="text-orange-400 mb-2">{'// TypeScript: Request a chain signature'}</div>
                    <div className="text-near-green">{'const payload = {'}</div>
                    <div className="text-near-green">{'  to: "0xRecipient...",  '}</div>
                    <div className="text-near-green">{'  value: ethers.parseEther("0.1"),'}</div>
                    <div className="text-near-green">{'  chainId: 1,  // Ethereum mainnet'}</div>
                    <div className="text-near-green">{'  nonce: await provider.getTransactionCount(derivedAddr),'}</div>
                    <div className="text-near-green">{'};'}</div>
                    <div className="mt-2 text-near-green">{'// Hash the unsigned transaction'}</div>
                    <div className="text-near-green">{'const txHash = ethers.keccak256(ethers.Transaction.from(payload).unsignedSerialized);'}</div>
                    <div className="mt-2 text-near-green">{'// Request signature from MPC contract'}</div>
                    <div className="text-near-green">{'const result = await wallet.callMethod({'}</div>
                    <div className="text-near-green">{'  contractId: "v1.signer.near",'}</div>
                    <div className="text-near-green">{'  method: "sign",'}</div>
                    <div className="text-near-green">{'  args: {'}</div>
                    <div className="text-near-green">{'    request: {'}</div>
                    <div className="text-near-green">{'      payload: Array.from(ethers.getBytes(txHash)),'}</div>
                    <div className="text-near-green">{'      path: "ethereum-1",'}</div>
                    <div className="text-near-green">{'      key_version: 0,'}</div>
                    <div className="text-near-green">{'    }'}</div>
                    <div className="text-near-green">{'  },'}</div>
                    <div className="text-near-green">{'  gas: "300000000000000",  // 300 TGas'}</div>
                    <div className="text-near-green">{'  deposit: "1",  // 1 yoctoNEAR for security'}</div>
                    <div className="text-near-green">{'});'}</div>
                  </div>
                </section>

                {/* Section 4: Smart Contract Integration */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Lock className="w-5 h-5 text-red-400" />
                    Contract-Level Signing
                  </h4>
                  <p className="text-text-secondary mb-3">
                    The real power: your NEAR smart contract can request signatures, enabling programmatic cross-chain operations:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-text-secondary border border-border">
                    <div className="text-red-400 mb-2">{'// Rust: Smart contract requesting a chain signature'}</div>
                    <div className="text-near-green">{'#[near]'}</div>
                    <div className="text-near-green">{'impl Contract {'}</div>
                    <div className="text-near-green">{'    pub fn sign_eth_transaction(&mut self, tx_hash: Vec<u8>) -> Promise {'}</div>
                    <div className="text-near-green">{'        // Verify caller has permission'}</div>
                    <div className="text-near-green">{'        require!(self.authorized.contains(&env::predecessor_account_id()));'}</div>
                    <div className="text-near-green">{'        '}</div>
                    <div className="text-near-green">{'        // Request signature from MPC network'}</div>
                    <div className="text-near-green">{'        Promise::new("v1.signer.near".parse().unwrap())'}</div>
                    <div className="text-near-green">{'            .function_call('}</div>
                    <div className="text-near-green">{'                "sign".to_string(),'}</div>
                    <div className="text-near-green">{'                json!({"request": {'}</div>
                    <div className="text-near-green">{'                    "payload": tx_hash,'}</div>
                    <div className="text-near-green">{'                    "path": "ethereum-1",'}</div>
                    <div className="text-near-green">{'                    "key_version": 0'}</div>
                    <div className="text-near-green">{'                }}).to_string().into_bytes(),'}</div>
                    <div className="text-near-green">{'                NearToken::from_yoctonear(1),'}</div>
                    <div className="text-near-green">{'                Gas::from_tgas(250),'}</div>
                    <div className="text-near-green">{'            )'}</div>
                    <div className="text-near-green">{'    }'}</div>
                    <div className="text-near-green">{'}'}</div>
                  </div>
                </section>

                {/* Section 5: Derived Address Computation */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-cyan-400" />
                    Computing Derived Addresses
                  </h4>
                  <p className="text-text-secondary mb-3">
                    To receive funds on a target chain, you need to know the derived address before signing. Here&apos;s how:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-text-secondary border border-border">
                    <div className="text-cyan-400 mb-2">{'// Derive the public key and address client-side'}</div>
                    <div className="text-near-green">{'import { najPublicKeyStrToUncompressedHexPoint } from "near-ca";'}</div>
                    <div className="mt-1 text-near-green">{'// Get the MPC public key'}</div>
                    <div className="text-near-green">{'const mpcPublicKey = await nearView("v1.signer.near", "public_key");'}</div>
                    <div className="mt-1 text-near-green">{'// Derive for specific account + path'}</div>
                    <div className="text-near-green">{'const derivedKey = deriveChildPublicKey('}</div>
                    <div className="text-near-green">{'  mpcPublicKey,'}</div>
                    <div className="text-near-green">{'  "alice.near",    // NEAR account ID'}</div>
                    <div className="text-near-green">{'  "ethereum-1"     // derivation path'}</div>
                    <div className="text-near-green">{');'}</div>
                    <div className="mt-1 text-near-green">{'// Convert to Ethereum address'}</div>
                    <div className="text-near-green">{'const ethAddress = publicKeyToAddress(derivedKey);'}</div>
                  </div>
                </section>
              </div>
            )}

            {selectedTab === 'practice' && (
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-text-primary">Exercises</h4>

                <Card variant="default" padding="md" className="border-red-500/20">
                  <h5 className="font-semibold text-red-400 text-sm mb-2">🔴 Exercise 1: Derive Multi-Chain Addresses</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Using the MPC testnet contract, derive Ethereum, Bitcoin, and Cosmos addresses from a single NEAR testnet account. Verify the addresses are deterministic (same inputs = same output).
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-red-500/20">
                  <h5 className="font-semibold text-red-400 text-sm mb-2">🔴 Exercise 2: Cross-Chain ETH Transfer</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Build a full flow: fund a derived Ethereum Sepolia address, then use chain signatures to sign and broadcast an ETH transfer from that address — all initiated from a NEAR transaction.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-red-500/20">
                  <h5 className="font-semibold text-red-400 text-sm mb-2">🔴 Exercise 3: Contract-Controlled Vault</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Build a NEAR smart contract that acts as a multi-sig vault for an Ethereum address. Require 2-of-3 NEAR accounts to approve before the contract requests a chain signature to move ETH.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-red-500/20">
                  <h5 className="font-semibold text-red-400 text-sm mb-2">🔴 Exercise 4: Bitcoin Inscription via NEAR</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Use chain signatures to create and sign a Bitcoin Ordinals inscription transaction. Build the raw Bitcoin transaction, sign it via the MPC network, and broadcast it to Bitcoin testnet.
                  </p>
                </Card>
              </div>
            )}

            {selectedTab === 'resources' && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-text-primary">Resources</h4>
                {[
                  { title: 'Chain Signatures Documentation', url: 'https://docs.near.org/concepts/abstraction/chain-signatures', desc: 'Official NEAR docs on chain signatures and MPC signing' },
                  { title: 'near-ca SDK', url: 'https://github.com/near/near-ca', desc: 'TypeScript SDK for chain abstraction and derived accounts' },
                  { title: 'Chain Signatures Examples', url: 'https://github.com/near-examples/chain-signatures', desc: 'Example projects using chain signatures for Ethereum, Bitcoin, etc.' },
                  { title: 'MPC Recovery Service', url: 'https://github.com/near/mpc-recovery', desc: 'The MPC node implementation and protocol details' },
                  { title: 'Threshold Cryptography Primer', url: 'https://en.wikipedia.org/wiki/Threshold_cryptosystem', desc: 'Background on threshold signature schemes' },
                  { title: 'NEAR Chain Abstraction Vision', url: 'https://near.org/blog/near-chain-abstraction', desc: 'The broader vision for chain-agnostic experiences' },
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

export default ChainSignatures;
