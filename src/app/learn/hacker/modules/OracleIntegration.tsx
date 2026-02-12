'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ExternalLink, CheckCircle, Radio, Shield, Database, AlertTriangle, Code, Zap } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

interface OracleIntegrationProps {
  isActive: boolean;
  onToggle: () => void;
}

const OracleIntegration: React.FC<OracleIntegrationProps> = ({ isActive, onToggle }) => {
  const [selectedTab, setSelectedTab] = useState<string>('overview');

  return (
    <Card variant="glass" padding="none" className="border-purple-500/20">
      <div
        onClick={onToggle}
        className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
            <Radio className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Oracle Integration</h3>
            <p className="text-text-muted text-sm">Price feeds, custom data oracles, and secure off-chain data on NEAR</p>
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
                  <Radio className="w-5 h-5 text-blue-400" />
                  <h4 className="text-lg font-semibold text-text-primary">What You&apos;ll Learn</h4>
                </div>
                <ul className="space-y-3">
                  {[
                    'What oracles are and why smart contracts need external data feeds',
                    'Integrating Pyth Network on NEAR for high-fidelity price feeds',
                    'Using Seda Protocol (formerly Flux) for custom off-chain data requests',
                    'Building custom oracle patterns with validator-backed data submission',
                    'Oracle security: manipulation prevention, staleness checks, and circuit breakers',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-text-secondary">
                      <CheckCircle className="w-4 h-4 text-near-green mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Card variant="default" padding="md" className="mt-4 border-blue-500/20 bg-blue-500/5">
                  <p className="text-sm text-text-secondary">
                    <span className="text-blue-400 font-semibold">Why this matters:</span> Smart contracts are deterministic and can&apos;t access external data on their own. Oracles bridge the gap between on-chain logic and real-world data — prices, weather, sports scores, random numbers — making DeFi, insurance, and prediction markets possible.
                  </p>
                </Card>
              </div>
            )}

            {selectedTab === 'learn' && (
              <div className="space-y-8">
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Database className="w-5 h-5 text-blue-400" />
                    The Oracle Problem
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Blockchains are isolated by design — they can&apos;t fetch data from APIs or read external state. Oracles solve this by bringing off-chain data on-chain in a verifiable way.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card variant="default" padding="md" className="border-blue-500/20">
                      <h5 className="font-semibold text-blue-400 text-sm mb-2">Push Oracles</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• Data providers push updates on a schedule</li>
                        <li>• Contract reads latest stored value</li>
                        <li>• Pyth, Chainlink use this model</li>
                        <li>• Predictable gas costs for consumers</li>
                        <li>• Trade-off: data may be slightly stale</li>
                      </ul>
                    </Card>
                    <Card variant="default" padding="md" className="border-cyan-500/20">
                      <h5 className="font-semibold text-cyan-400 text-sm mb-2">Pull Oracles</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• Consumer requests data on-demand</li>
                        <li>• Oracle responds with signed data + proof</li>
                        <li>• Seda Protocol uses this model</li>
                        <li>• Always fresh data when needed</li>
                        <li>• Consumer pays for the data request</li>
                      </ul>
                    </Card>
                  </div>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    Pyth Network on NEAR
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Pyth Network provides high-frequency price feeds from institutional market data sources. It&apos;s live on NEAR with sub-second update latency.
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-text-secondary border border-border">
                    <div className="text-yellow-400 mb-2">{'// Rust: Reading Pyth price feeds on NEAR'}</div>
                    <div className="text-near-green">{'use near_sdk::{near, env, Promise};'}</div>
                    <div className="text-near-green">{'use pyth_sdk_near::{PriceIdentifier, Price};'}</div>
                    <div className="mt-1 text-near-green">{'#[near]'}</div>
                    <div className="text-near-green">{'impl DeFiContract {'}</div>
                    <div className="text-near-green">{'    pub fn get_eth_price(&self) -> Price {'}</div>
                    <div className="text-near-green">{'        // ETH/USD price feed ID'}</div>
                    <div className="text-near-green">{'        let feed_id = PriceIdentifier::from_hex('}</div>
                    <div className="text-near-green">{'            "ff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace"'}</div>
                    <div className="text-near-green">{'        );'}</div>
                    <div className="text-near-green">{'        let pyth = "pyth-oracle.near";'}</div>
                    <div className="text-near-green">{'        // Get price no older than 60 seconds'}</div>
                    <div className="text-near-green">{'        self.pyth_contract.get_price_no_older_than('}</div>
                    <div className="text-near-green">{'            feed_id, 60'}</div>
                    <div className="text-near-green">{'        )'}</div>
                    <div className="text-near-green">{'    }'}</div>
                    <div className="text-near-green">{'}'}</div>
                  </div>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Code className="w-5 h-5 text-green-400" />
                    Seda Protocol (formerly Flux)
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Seda Protocol enables custom data requests — any API, any computation, verified by a decentralized network of data providers.
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-text-secondary border border-border">
                    <div className="text-green-400 mb-2">{'// Seda: Custom oracle data request'}</div>
                    <div className="text-near-green">{'// 1. Define a data request program (WASM)'}</div>
                    <div className="text-near-green">{'//    Fetch from any API, process, return result'}</div>
                    <div className="mt-2 text-near-green">{'// 2. Submit request to Seda network'}</div>
                    <div className="text-near-green">{'const request = {'}</div>
                    <div className="text-near-green">{'  dr_binary_id: "oracle_program_hash",'}</div>
                    <div className="text-near-green">{'  dr_inputs: JSON.stringify({ symbol: "NEAR" }),'}</div>
                    <div className="text-near-green">{'  tally_binary_id: "tally_program_hash",'}</div>
                    <div className="text-near-green">{'  replication_factor: 3,  // 3 independent executors'}</div>
                    <div className="text-near-green">{'  consensus_filter: "mode",  // agreement method'}</div>
                    <div className="text-near-green">{'  gas_limit: 300_000,'}</div>
                    <div className="text-near-green">{'};'}</div>
                    <div className="mt-2 text-near-green">{'// 3. Result posted back to NEAR contract'}</div>
                    <div className="text-near-green">{'// Multiple executors verify independently'}</div>
                    <div className="text-near-green">{'// Tally program aggregates and verifies consensus'}</div>
                  </div>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    Oracle Security
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Oracle manipulation is one of the most common DeFi attack vectors. Protect your contracts with these patterns:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card variant="default" padding="md" className="border-red-500/20">
                      <h5 className="font-semibold text-red-400 text-sm mb-2">Common Attacks</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• Flash loan price manipulation</li>
                        <li>• Stale price exploitation</li>
                        <li>• Single oracle point of failure</li>
                        <li>• Front-running oracle updates</li>
                        <li>• Data source compromise</li>
                      </ul>
                    </Card>
                    <Card variant="default" padding="md" className="border-green-500/20">
                      <h5 className="font-semibold text-green-400 text-sm mb-2">Defense Patterns</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• TWAP (Time-Weighted Average Price)</li>
                        <li>• Multi-oracle aggregation with median</li>
                        <li>• Staleness checks (reject old data)</li>
                        <li>• Circuit breakers (pause on volatility)</li>
                        <li>• Confidence intervals (Pyth provides these)</li>
                      </ul>
                    </Card>
                  </div>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-purple-400" />
                    Custom Oracle Patterns
                  </h4>
                  <p className="text-text-secondary mb-3">
                    For specialized data not covered by existing oracle networks, build your own validator-backed oracle:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-text-secondary border border-border">
                    <div className="text-purple-400 mb-2">{'// Rust: Custom oracle with multi-sig verification'}</div>
                    <div className="text-near-green">{'#[near]'}</div>
                    <div className="text-near-green">{'impl CustomOracle {'}</div>
                    <div className="text-near-green">{'    pub fn submit_data(&mut self, value: U128, timestamp: u64) {'}</div>
                    <div className="text-near-green">{'        let reporter = env::predecessor_account_id();'}</div>
                    <div className="text-near-green">{'        require!(self.authorized_reporters.contains(&reporter));'}</div>
                    <div className="text-near-green">{'        self.submissions.entry(timestamp).or_default()'}</div>
                    <div className="text-near-green">{'            .push((reporter, value.0));'}</div>
                    <div className="text-near-green">{'        self.try_finalize(timestamp);'}</div>
                    <div className="text-near-green">{'    }'}</div>
                    <div className="mt-1 text-near-green">{'    fn try_finalize(&mut self, timestamp: u64) {'}</div>
                    <div className="text-near-green">{'        let subs = &self.submissions[&timestamp];'}</div>
                    <div className="text-near-green">{'        if subs.len() >= self.quorum {'}</div>
                    <div className="text-near-green">{'            // Take median of submitted values'}</div>
                    <div className="text-near-green">{'            let median = compute_median(subs);'}</div>
                    <div className="text-near-green">{'            self.latest_value = Some((median, timestamp));'}</div>
                    <div className="text-near-green">{'        }'}</div>
                    <div className="text-near-green">{'    }'}</div>
                    <div className="text-near-green">{'}'}</div>
                  </div>
                </section>
              </div>
            )}

            {selectedTab === 'practice' && (
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-text-primary">Exercises</h4>

                <Card variant="default" padding="md" className="border-blue-500/20">
                  <h5 className="font-semibold text-blue-400 text-sm mb-2">🔵 Exercise 1: Pyth Price Feed Consumer</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Build a NEAR smart contract that reads ETH/USD and NEAR/USD prices from Pyth Network. Include staleness checks and expose the price data via view methods.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-blue-500/20">
                  <h5 className="font-semibold text-blue-400 text-sm mb-2">🔵 Exercise 2: Oracle-Powered Lending</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Create a simple lending contract that uses Pyth price feeds for collateral valuation. Implement liquidation logic triggered when collateral ratio drops below 150%.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-blue-500/20">
                  <h5 className="font-semibold text-blue-400 text-sm mb-2">🔵 Exercise 3: Custom Weather Oracle</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Design a custom oracle that fetches weather data from a public API. Implement multi-reporter submission with median aggregation and a quorum requirement of 3 reporters.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-blue-500/20">
                  <h5 className="font-semibold text-blue-400 text-sm mb-2">🔵 Exercise 4: Oracle Manipulation Simulator</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Build a test environment that simulates oracle manipulation attacks. Implement and test defense mechanisms: TWAP, circuit breakers, and multi-oracle aggregation.
                  </p>
                </Card>
              </div>
            )}

            {selectedTab === 'resources' && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-text-primary">Resources</h4>
                {[
                  { title: 'Pyth Network Documentation', url: 'https://docs.pyth.network/', desc: 'Official docs for Pyth Network — price feeds, SDKs, and integration guides' },
                  { title: 'Pyth on NEAR', url: 'https://docs.pyth.network/price-feeds/contract-addresses/near', desc: 'Pyth contract addresses and feed IDs for NEAR Protocol' },
                  { title: 'Seda Protocol', url: 'https://docs.seda.xyz/', desc: 'Seda (formerly Flux) documentation for custom oracle data requests' },
                  { title: 'Oracle Manipulation Attacks', url: 'https://samczsun.com/so-you-want-to-use-a-price-oracle/', desc: 'Classic article on oracle security by samczsun' },
                  { title: 'NEAR Oracle Examples', url: 'https://github.com/near-examples', desc: 'Official NEAR examples repository with oracle integration patterns' },
                  { title: 'DeFi Oracle Best Practices', url: 'https://blog.openzeppelin.com/secure-smart-contract-guidelines-the-dangers-of-price-oracles', desc: 'OpenZeppelin guide on secure oracle usage in DeFi protocols' },
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

export default OracleIntegration;
