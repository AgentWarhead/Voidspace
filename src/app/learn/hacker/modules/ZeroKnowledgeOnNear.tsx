'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ExternalLink, CheckCircle, Eye, EyeOff, Shield, Lock, Cpu, Code } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

interface ZeroKnowledgeOnNearProps {
  isActive: boolean;
  onToggle: () => void;
}

const ZeroKnowledgeOnNear: React.FC<ZeroKnowledgeOnNearProps> = ({ isActive, onToggle }) => {
  const [selectedTab, setSelectedTab] = useState<string>('overview');

  return (
    <Card variant="glass" padding="none" className="border-purple-500/20">
      <div
        onClick={onToggle}
        className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <EyeOff className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Zero Knowledge on NEAR</h3>
            <p className="text-text-muted text-sm">ZK proofs, privacy-preserving computation, and NEAR&apos;s ZK roadmap</p>
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
                  <EyeOff className="w-5 h-5 text-purple-400" />
                  <h4 className="text-lg font-semibold text-text-primary">What You&apos;ll Learn</h4>
                </div>
                <ul className="space-y-3">
                  {[
                    'What zero-knowledge proofs are and how they prove statements without revealing data',
                    'NEAR\'s ZK roadmap including zkWASM and on-chain ZK-SNARK verification',
                    'Building ZK-enabled applications on NEAR for privacy and scalability',
                    'Privacy-preserving computations: private voting, confidential transfers, hidden state',
                    'Tools and libraries for ZK development on NEAR (snarkjs, circom, halo2)',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-text-secondary">
                      <CheckCircle className="w-4 h-4 text-near-green mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Card variant="default" padding="md" className="mt-4 border-purple-500/20 bg-purple-500/5">
                  <p className="text-sm text-text-secondary">
                    <span className="text-purple-400 font-semibold">Why this matters:</span> Zero-knowledge proofs unlock privacy and scalability on public blockchains. NEAR&apos;s WASM runtime is uniquely positioned for ZK verification, enabling private DeFi, anonymous credentials, and ZK rollup settlement.
                  </p>
                </Card>
              </div>
            )}

            {selectedTab === 'learn' && (
              <div className="space-y-8">
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Eye className="w-5 h-5 text-purple-400" />
                    ZK Proofs Fundamentals
                  </h4>
                  <p className="text-text-secondary mb-3">
                    A zero-knowledge proof lets a prover convince a verifier that a statement is true without revealing any information beyond the truth of the statement itself.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card variant="default" padding="md" className="border-purple-500/20">
                      <h5 className="font-semibold text-purple-400 text-sm mb-2">ZK-SNARKs</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• Succinct: proof is tiny regardless of computation size</li>
                        <li>• Non-interactive: single message from prover to verifier</li>
                        <li>• Trusted setup required (ceremony generates parameters)</li>
                        <li>• Constant-time verification (~milliseconds)</li>
                        <li>• Used by Zcash, zkSync, and Tornado Cash</li>
                      </ul>
                    </Card>
                    <Card variant="default" padding="md" className="border-pink-500/20">
                      <h5 className="font-semibold text-pink-400 text-sm mb-2">ZK-STARKs</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• No trusted setup (transparent)</li>
                        <li>• Larger proof size than SNARKs</li>
                        <li>• Post-quantum secure (hash-based)</li>
                        <li>• Faster proving for large computations</li>
                        <li>• Used by StarkNet and StarkEx</li>
                      </ul>
                    </Card>
                  </div>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-400" />
                    NEAR&apos;s ZK Roadmap
                  </h4>
                  <p className="text-text-secondary mb-3">
                    NEAR Protocol is building native ZK capabilities to support privacy applications and ZK rollup verification directly on-chain.
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-text-secondary border border-border">
                    <div className="text-purple-400 mb-2">{'// NEAR ZK capabilities roadmap'}</div>
                    <div className="text-near-green">{'// 1. zkWASM — ZK proofs for WASM execution'}</div>
                    <div className="text-near-green">{'//    Prove that a WASM program executed correctly'}</div>
                    <div className="text-near-green">{'//    without re-running the computation on-chain'}</div>
                    <div className="mt-2 text-near-green">{'// 2. On-chain SNARK verification'}</div>
                    <div className="text-near-green">{'//    Precompiled host functions for efficient'}</div>
                    <div className="text-near-green">{'//    elliptic curve operations (bn254, bls12-381)'}</div>
                    <div className="mt-2 text-near-green">{'// 3. ZK Light Clients'}</div>
                    <div className="text-near-green">{'//    Succinct proofs of NEAR state for bridges'}</div>
                    <div className="text-near-green">{'//    Verify NEAR consensus without running a full node'}</div>
                    <div className="mt-2 text-near-green">{'// 4. Privacy-preserving smart contracts'}</div>
                    <div className="text-near-green">{'//    Encrypted inputs, private state transitions'}</div>
                    <div className="text-near-green">{'//    Only proofs published on-chain'}</div>
                  </div>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Lock className="w-5 h-5 text-green-400" />
                    Building ZK Applications on NEAR
                  </h4>
                  <p className="text-text-secondary mb-3">
                    You can build ZK-enabled dApps on NEAR today by generating proofs off-chain and verifying them in smart contracts.
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-text-secondary border border-border">
                    <div className="text-green-400 mb-2">{'// Rust: On-chain ZK-SNARK verifier (Groth16)'}</div>
                    <div className="text-near-green">{'use near_sdk::{near, env};'}</div>
                    <div className="text-near-green">{'use ark_groth16::{Groth16, Proof, VerifyingKey};'}</div>
                    <div className="text-near-green">{'use ark_bn254::Bn254;'}</div>
                    <div className="mt-1 text-near-green">{'#[near]'}</div>
                    <div className="text-near-green">{'impl ZkVerifier {'}</div>
                    <div className="text-near-green">{'    pub fn verify_proof(&self, proof: Vec<u8>, public_inputs: Vec<u8>) -> bool {'}</div>
                    <div className="text-near-green">{'        let proof: Proof<Bn254> = deserialize(&proof);'}</div>
                    <div className="text-near-green">{'        let inputs = deserialize_inputs(&public_inputs);'}</div>
                    <div className="text-near-green">{'        let vk: VerifyingKey<Bn254> = self.verification_key.clone();'}</div>
                    <div className="text-near-green">{'        Groth16::<Bn254>::verify(&vk, &inputs, &proof)'}</div>
                    <div className="text-near-green">{'            .expect("Verification failed")'}</div>
                    <div className="text-near-green">{'    }'}</div>
                    <div className="text-near-green">{'}'}</div>
                  </div>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-cyan-400" />
                    Privacy-Preserving Patterns
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Common patterns for building private applications using ZK proofs on NEAR:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card variant="default" padding="md" className="border-cyan-500/20">
                      <h5 className="font-semibold text-cyan-400 text-sm mb-2">Private Voting</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• Commit vote hash on-chain</li>
                        <li>• Generate ZK proof of valid vote</li>
                        <li>• Prove eligibility without revealing identity</li>
                        <li>• Tally results without exposing individual votes</li>
                      </ul>
                    </Card>
                    <Card variant="default" padding="md" className="border-purple-500/20">
                      <h5 className="font-semibold text-purple-400 text-sm mb-2">Confidential Transfers</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• Hide transfer amounts using Pedersen commitments</li>
                        <li>• Range proofs ensure no negative balances</li>
                        <li>• Nullifiers prevent double-spending</li>
                        <li>• Merkle tree tracks commitment set</li>
                      </ul>
                    </Card>
                  </div>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Code className="w-5 h-5 text-orange-400" />
                    ZK Tooling for NEAR
                  </h4>
                  <p className="text-text-secondary mb-3">
                    The ZK ecosystem provides powerful tools that integrate with NEAR&apos;s WASM runtime:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-text-secondary border border-border">
                    <div className="text-orange-400 mb-2">{'// ZK development workflow for NEAR'}</div>
                    <div className="text-near-green">{'// 1. Write circuit (circom or halo2)'}</div>
                    <div className="text-near-green">{'//    circom: DSL for arithmetic circuits'}</div>
                    <div className="text-near-green">{'//    halo2: Rust library, no trusted setup'}</div>
                    <div className="mt-2 text-near-green">{'// 2. Generate proving/verification keys'}</div>
                    <div className="text-near-green">{'//    snarkjs setup circuit.r1cs pot12.ptau'}</div>
                    <div className="mt-2 text-near-green">{'// 3. Generate proof off-chain'}</div>
                    <div className="text-near-green">{'//    snarkjs groth16 prove circuit.zkey witness.wtns'}</div>
                    <div className="mt-2 text-near-green">{'// 4. Verify proof on NEAR smart contract'}</div>
                    <div className="text-near-green">{'//    Contract deserializes proof + public inputs'}</div>
                    <div className="text-near-green">{'//    Runs pairing check using bn254 curve ops'}</div>
                    <div className="mt-2 text-near-green">{'// 5. arkworks-rs: Rust ZK library ecosystem'}</div>
                    <div className="text-near-green">{'//    Compiles to WASM for on-chain verification'}</div>
                  </div>
                </section>
              </div>
            )}

            {selectedTab === 'practice' && (
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-text-primary">Exercises</h4>

                <Card variant="default" padding="md" className="border-purple-500/20">
                  <h5 className="font-semibold text-purple-400 text-sm mb-2">🟣 Exercise 1: Build a Circom Circuit</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Write a circom circuit that proves knowledge of a preimage to a hash (hash(x) = H without revealing x). Compile it and generate a Groth16 proof using snarkjs.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-purple-500/20">
                  <h5 className="font-semibold text-purple-400 text-sm mb-2">🟣 Exercise 2: On-Chain Verifier Contract</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Deploy a NEAR smart contract that verifies Groth16 proofs. Use the arkworks-rs library compiled to WASM. Accept a proof and public inputs, return true/false.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-purple-500/20">
                  <h5 className="font-semibold text-purple-400 text-sm mb-2">🟣 Exercise 3: Private Voting dApp</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Build a private voting system where users prove membership in a voter set via a Merkle proof, cast encrypted votes, and verify the tally — all without revealing who voted for what.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-purple-500/20">
                  <h5 className="font-semibold text-purple-400 text-sm mb-2">🟣 Exercise 4: ZK Credential Verification</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Create a ZK proof that verifies a user is over 18 using a signed credential, without revealing their actual age or any other personal data to the smart contract.
                  </p>
                </Card>
              </div>
            )}

            {selectedTab === 'resources' && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-text-primary">Resources</h4>
                {[
                  { title: 'NEAR ZK Documentation', url: 'https://docs.near.org/concepts/abstraction/signatures', desc: 'NEAR\'s documentation on cryptographic primitives and ZK support' },
                  { title: 'circom Language', url: 'https://docs.circom.io/', desc: 'Circuit compiler for ZK-SNARKs — write arithmetic circuits in a DSL' },
                  { title: 'snarkjs', url: 'https://github.com/iden3/snarkjs', desc: 'JavaScript library for zkSNARK proof generation and verification' },
                  { title: 'arkworks-rs', url: 'https://github.com/arkworks-rs', desc: 'Rust ecosystem for ZK-SNARKs — compiles to WASM for NEAR contracts' },
                  { title: 'halo2', url: 'https://github.com/zcash/halo2', desc: 'ZK proving system without trusted setup, developed by Zcash' },
                  { title: 'ZK Whiteboard Sessions', url: 'https://zkhack.dev/whiteboard/', desc: 'Free educational series explaining ZK proof systems from fundamentals' },
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

export default ZeroKnowledgeOnNear;
