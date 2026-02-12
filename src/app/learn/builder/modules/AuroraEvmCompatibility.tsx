'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Zap, ExternalLink, CheckCircle, ArrowRightLeft, Wrench, GitCompare } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

interface AuroraEvmCompatibilityProps {
  isActive: boolean;
  onToggle: () => void;
}

const AuroraEvmCompatibility: React.FC<AuroraEvmCompatibilityProps> = ({ isActive, onToggle }) => {
  const [selectedTab, setSelectedTab] = useState<string>('overview');

  return (
    <Card variant="glass" padding="none" className="border-purple-500/20">
      <div
        onClick={onToggle}
        className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Aurora EVM Compatibility</h3>
            <p className="text-text-muted text-sm">Deploy Solidity contracts on NEAR via Aurora&apos;s EVM runtime</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-warning/10 text-warning border-warning/20">Intermediate</Badge>
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
                  <Zap className="w-5 h-5 text-emerald-400" />
                  <h4 className="text-lg font-semibold text-text-primary">What You&apos;ll Learn</h4>
                </div>
                <ul className="space-y-3">
                  {[
                    'What Aurora is: a full EVM running as a smart contract on NEAR Protocol',
                    'Deploying existing Solidity contracts to NEAR without rewriting in Rust',
                    'Rainbow Bridge: bridging assets between Aurora, NEAR, and Ethereum',
                    'When to use Aurora (EVM) vs native NEAR (Rust) for your project',
                    'Dev tooling: Hardhat, Remix, MetaMask, and Ethers.js on Aurora',
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
                    <Zap className="w-5 h-5 text-emerald-400" />
                    What Is Aurora?
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Aurora is an EVM (Ethereum Virtual Machine) implemented as a smart contract on NEAR. It runs at <code className="text-purple-400 bg-purple-500/10 px-1 rounded">aurora</code> on NEAR mainnet. You can deploy any Solidity/Vyper contract to it using standard Ethereum tooling:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border">
                    <div className="text-text-muted">{'// Aurora network config for Hardhat'}</div>
                    <div>{'aurora: {'}</div>
                    <div>  url: <span className="text-yellow-300">&quot;https://mainnet.aurora.dev&quot;</span>,</div>
                    <div>  chainId: <span className="text-cyan-400">1313161554</span>,</div>
                    <div>  accounts: [process.env.PRIVATE_KEY],</div>
                    <div>{'}'}</div>
                    <div className="mt-2 text-text-muted">{'// Testnet'}</div>
                    <div>{'aurora_testnet: {'}</div>
                    <div>  url: <span className="text-yellow-300">&quot;https://testnet.aurora.dev&quot;</span>,</div>
                    <div>  chainId: <span className="text-cyan-400">1313161555</span>,</div>
                    <div>{'}'}</div>
                  </div>
                  <Card variant="default" padding="md" className="mt-3 border-emerald-500/20 bg-emerald-500/5">
                    <p className="text-sm text-text-secondary">
                      <span className="text-emerald-400 font-semibold">Key concept:</span> Aurora inherits NEAR&apos;s speed (~1-2s block times) and low fees while providing full EVM compatibility. Gas is paid in ETH (bridged via Rainbow Bridge), but transactions settle on NEAR&apos;s sharded blockchain.
                    </p>
                  </Card>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <ArrowRightLeft className="w-5 h-5 text-cyan-400" />
                    Rainbow Bridge
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Rainbow Bridge connects Ethereum, NEAR, and Aurora. It&apos;s trustless — secured by light client proofs, not validators:
                  </p>
                  <div className="bg-black/30 rounded-lg p-4 border border-border">
                    <div className="flex flex-col gap-2 text-sm text-text-secondary">
                      <div className="flex items-center gap-2"><span className="text-near-green font-mono">1.</span> <strong>Ethereum → Aurora:</strong> Lock ERC-20 on Ethereum, mint on Aurora (~10 min)</div>
                      <div className="flex items-center gap-2"><span className="text-near-green font-mono">2.</span> <strong>Aurora → NEAR native:</strong> Use aurora engine&apos;s exit_to_near for NEP-141 tokens</div>
                      <div className="flex items-center gap-2"><span className="text-near-green font-mono">3.</span> <strong>NEAR → Aurora:</strong> Use ft_transfer_call to aurora contract</div>
                      <div className="flex items-center gap-2"><span className="text-near-green font-mono">4.</span> <strong>Aurora → Ethereum:</strong> Burn on Aurora, unlock on Ethereum (~16 hrs for finality)</div>
                    </div>
                  </div>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <GitCompare className="w-5 h-5 text-purple-400" />
                    Aurora vs Native NEAR
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Card variant="default" padding="md" className="border-emerald-500/20">
                      <h5 className="font-semibold text-emerald-400 text-sm mb-2">Choose Aurora When</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• You have existing Solidity contracts</li>
                        <li>• Your team knows Ethereum tooling</li>
                        <li>• You need EVM ecosystem compatibility</li>
                        <li>• Porting from Ethereum/Polygon/BSC</li>
                        <li>• Using MetaMask for user onboarding</li>
                      </ul>
                    </Card>
                    <Card variant="default" padding="md" className="border-cyan-500/20">
                      <h5 className="font-semibold text-cyan-400 text-sm mb-2">Choose Native NEAR When</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• You want maximum performance</li>
                        <li>• You need NEAR-specific features (named accounts, access keys)</li>
                        <li>• Building new contracts from scratch</li>
                        <li>• Need cross-contract calls with NEAR dApps</li>
                        <li>• Want the lowest possible gas costs</li>
                      </ul>
                    </Card>
                  </div>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Wrench className="w-5 h-5 text-amber-400" />
                    Dev Tooling for Aurora
                  </h4>
                  <p className="text-text-secondary mb-3">
                    All standard Ethereum dev tools work on Aurora — just point them at Aurora&apos;s RPC:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border">
                    <div className="text-text-muted">{'// Deploy with Hardhat'}</div>
                    <div>npx hardhat run scripts/deploy.js --network aurora_testnet</div>
                    <div className="mt-2 text-text-muted">{'// Verify on Aurora Explorer'}</div>
                    <div>npx hardhat verify --network aurora_testnet DEPLOYED_ADDRESS</div>
                    <div className="mt-2 text-text-muted">{'// MetaMask: Add Aurora network'}</div>
                    <div>RPC: https://mainnet.aurora.dev</div>
                    <div>Chain ID: 1313161554</div>
                    <div>Symbol: ETH</div>
                    <div>Explorer: https://explorer.aurora.dev</div>
                  </div>
                </section>
              </div>
            )}

            {selectedTab === 'practice' && (
              <div className="space-y-6">
                <Card variant="default" padding="md" className="border-purple-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs font-bold text-purple-400">1</div>
                    <h5 className="font-semibold text-text-primary">Deploy a Solidity Contract</h5>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    Take a simple ERC-20 contract and deploy it to Aurora testnet using Hardhat. Configure MetaMask with Aurora testnet and get test ETH from the Aurora faucet.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-purple-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs font-bold text-purple-400">2</div>
                    <h5 className="font-semibold text-text-primary">Use Remix with Aurora</h5>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    Open Remix IDE, connect MetaMask (set to Aurora testnet), and deploy a contract. This is the fastest way to experiment with Solidity on NEAR.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-purple-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs font-bold text-purple-400">3</div>
                    <h5 className="font-semibold text-text-primary">Bridge Tokens</h5>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    Use Rainbow Bridge (<code className="text-purple-400 bg-purple-500/10 px-1 rounded">rainbowbridge.app</code>) to bridge test tokens between NEAR testnet and Aurora testnet. Observe the cross-chain transaction flow.
                  </p>
                  <p className="text-text-muted text-xs mt-2">💡 Rainbow Bridge is trustless — it uses light client proofs, making it one of the most secure bridges in crypto.</p>
                </Card>

                <Card variant="default" padding="md" className="border-purple-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs font-bold text-purple-400">4</div>
                    <h5 className="font-semibold text-text-primary">Compare Gas Costs</h5>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    Deploy the same logic as both a Solidity contract on Aurora and a Rust contract on native NEAR. Compare gas costs and execution times to understand the tradeoffs.
                  </p>
                </Card>
              </div>
            )}

            {selectedTab === 'resources' && (
              <div className="space-y-3">
                {[
                  { title: 'Aurora Developer Docs', url: 'https://doc.aurora.dev', desc: 'Official Aurora documentation and guides' },
                  { title: 'Aurora Explorer', url: 'https://explorer.aurora.dev', desc: 'Block explorer for Aurora transactions and contracts' },
                  { title: 'Rainbow Bridge', url: 'https://rainbowbridge.app', desc: 'Bridge assets between Ethereum, NEAR, and Aurora' },
                  { title: 'Aurora Engine Source', url: 'https://github.com/aurora-is-near/aurora-engine', desc: 'Open-source EVM implementation on NEAR' },
                  { title: 'Hardhat Aurora Plugin', url: 'https://doc.aurora.dev/develop/hardhat', desc: 'Deploy and verify contracts with Hardhat' },
                  { title: 'Aurora vs NEAR Native', url: 'https://doc.aurora.dev/getting-started/aurora-vs-near', desc: 'When to choose Aurora vs native NEAR development' },
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

export default AuroraEvmCompatibility;
