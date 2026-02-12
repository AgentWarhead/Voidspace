'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Rocket, ExternalLink, CheckCircle, Shield, Zap, Server, AlertTriangle, BarChart3, Lock } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

interface ProductionPatternsProps {
  isActive: boolean;
  onToggle: () => void;
}

const ProductionPatterns: React.FC<ProductionPatternsProps> = ({ isActive, onToggle }) => {
  const [selectedTab, setSelectedTab] = useState<string>('overview');

  return (
    <Card variant="glass" padding="none" className="border-purple-500/20">
      <div
        onClick={onToggle}
        className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
            <Rocket className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Production Patterns</h3>
            <p className="text-text-muted text-sm">Security hardening, upgrade strategies, monitoring, and battle-tested patterns</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-red-500/10 text-red-300 border-red-500/20">Advanced</Badge>
          <Badge className="bg-purple-500/10 text-purple-300 border-purple-500/20">60 min</Badge>
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
                  <Rocket className="w-5 h-5 text-amber-400" />
                  <h4 className="text-lg font-semibold text-text-primary">What You&apos;ll Learn</h4>
                </div>
                <ul className="space-y-3">
                  {[
                    'Security hardening — common attack vectors and how to prevent them',
                    'Upgradeable contract patterns — proxy, DAO-governed, and time-locked upgrades',
                    'Monitoring and alerting — building observability for on-chain contracts',
                    'Gas optimization at scale — techniques used by top NEAR protocols',
                    'Incident response — what to do when things go wrong in production',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-text-secondary">
                      <CheckCircle className="w-4 h-4 text-near-green mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Card variant="default" padding="md" className="mt-4 border-amber-500/20 bg-amber-500/5">
                  <p className="text-sm text-text-secondary">
                    <span className="text-amber-400 font-semibold">Why this matters:</span> The difference between a hobby project and a production protocol is in these details. This module covers everything you need to ship contracts that handle real money safely.
                  </p>
                </Card>
              </div>
            )}

            {selectedTab === 'learn' && (
              <div className="space-y-8">
                {/* Section 1: Security Hardening */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-red-400" />
                    Security Hardening
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Common NEAR contract vulnerabilities and their mitigations:
                  </p>
                  <div className="space-y-3">
                    <Card variant="default" padding="md" className="border-red-500/20">
                      <h5 className="font-semibold text-red-400 text-sm mb-2">1. Reentrancy via Callbacks</h5>
                      <p className="text-xs text-text-muted mb-2">NEAR&apos;s async model doesn&apos;t have Ethereum-style reentrancy, but callback ordering can cause similar issues:</p>
                      <div className="bg-black/40 rounded p-3 font-mono text-xs text-near-green">
                        {'// BAD: State modified before callback'}<br/>
                        {'pub fn withdraw(&mut self, amount: U128) {'}<br/>
                        {'    self.balances.insert(&sender, &(balance - amount)); // state change'}<br/>
                        {'    Promise::new(sender).transfer(amount); // may fail!'}<br/>
                        {'}'}<br/>
                        <br/>
                        {'// GOOD: Optimistic state + rollback in callback'}<br/>
                        {'pub fn withdraw(&mut self, amount: U128) -> Promise {'}<br/>
                        {'    self.pending_withdrawals.insert(&sender, &amount);'}<br/>
                        {'    Promise::new(sender).transfer(amount)'}<br/>
                        {'        .then(Self::ext(current).on_withdraw(sender, amount))'}<br/>
                        {'}'}
                      </div>
                    </Card>
                    <Card variant="default" padding="md" className="border-orange-500/20">
                      <h5 className="font-semibold text-orange-400 text-sm mb-2">2. Integer Overflow/Underflow</h5>
                      <p className="text-xs text-text-muted mb-2">Rust panics on overflow in debug mode but wraps in release. Always use checked arithmetic:</p>
                      <div className="bg-black/40 rounded p-3 font-mono text-xs text-near-green">
                        {'// BAD: Can underflow in release'}<br/>
                        {'let new_balance = balance - amount;'}<br/>
                        <br/>
                        {'// GOOD: Checked arithmetic'}<br/>
                        {'let new_balance = balance.checked_sub(amount)'}<br/>
                        {'    .expect("Insufficient balance");'}
                      </div>
                    </Card>
                    <Card variant="default" padding="md" className="border-yellow-500/20">
                      <h5 className="font-semibold text-yellow-400 text-sm mb-2">3. Access Control Gaps</h5>
                      <p className="text-xs text-text-muted mb-2">Always verify who is calling your function:</p>
                      <div className="bg-black/40 rounded p-3 font-mono text-xs text-near-green">
                        {'// Use #[private] for callbacks'}<br/>
                        {'#[private]'}<br/>
                        {'pub fn on_callback(&mut self) { /* only self can call */ }'}<br/>
                        <br/>
                        {'// Explicit owner checks for admin functions'}<br/>
                        {'pub fn set_config(&mut self, config: Config) {'}<br/>
                        {'    require!(env::predecessor_account_id() == self.owner,'}<br/>
                        {'        "Only owner can call this");'}<br/>
                        {'}'}
                      </div>
                    </Card>
                  </div>
                </section>

                {/* Section 2: Upgrade Strategies */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    Upgrade Strategies
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Production contracts need upgrade paths. Here are the battle-tested patterns:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Card variant="default" padding="md" className="border-blue-500/20">
                      <h5 className="font-semibold text-blue-400 text-sm mb-2">Owner-Controlled</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• Owner account deploys new code</li>
                        <li>• Simplest pattern</li>
                        <li>• Risk: single point of failure</li>
                        <li>• Good for: early stage, internal tools</li>
                      </ul>
                    </Card>
                    <Card variant="default" padding="md" className="border-purple-500/20">
                      <h5 className="font-semibold text-purple-400 text-sm mb-2">DAO-Governed</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• DAO proposal + vote to upgrade</li>
                        <li>• Multi-sig or token-weighted voting</li>
                        <li>• Time-lock between approval and execution</li>
                        <li>• Good for: mature protocols</li>
                      </ul>
                    </Card>
                    <Card variant="default" padding="md" className="border-green-500/20">
                      <h5 className="font-semibold text-green-400 text-sm mb-2">Immutable + Factory</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• Core contract is immutable</li>
                        <li>• New versions deployed as new contracts</li>
                        <li>• Factory pattern for migration</li>
                        <li>• Good for: maximum trust, DeFi</li>
                      </ul>
                    </Card>
                  </div>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-text-secondary border border-border mt-3">
                    <div className="text-yellow-400 mb-2">{'// DAO-governed upgrade with time-lock'}</div>
                    <div className="text-near-green">{'#[near]'}</div>
                    <div className="text-near-green">{'impl UpgradeableContract {'}</div>
                    <div className="text-near-green">{'    pub fn propose_upgrade(&mut self, code_hash: String) {'}</div>
                    <div className="text-near-green">{'        require!(self.dao_members.contains(&env::predecessor_account_id()));'}</div>
                    <div className="text-near-green">{'        self.pending_upgrade = Some(PendingUpgrade {'}</div>
                    <div className="text-near-green">{'            code_hash,'}</div>
                    <div className="text-near-green">{'            proposed_at: env::block_timestamp(),'}</div>
                    <div className="text-near-green">{'            approvals: vec![env::predecessor_account_id()],'}</div>
                    <div className="text-near-green">{'        });'}</div>
                    <div className="text-near-green">{'    }'}</div>
                    <div className="mt-1 text-near-green">{'    pub fn execute_upgrade(&mut self) {'}</div>
                    <div className="text-near-green">{'        let upgrade = self.pending_upgrade.as_ref().unwrap();'}</div>
                    <div className="text-near-green">{'        require!(upgrade.approvals.len() >= 3, "Need 3 approvals");'}</div>
                    <div className="text-near-green">{'        require!('}</div>
                    <div className="text-near-green">{'            env::block_timestamp() > upgrade.proposed_at + DAY_NS * 2,'}</div>
                    <div className="text-near-green">{'            "48h time-lock not elapsed"'}</div>
                    <div className="text-near-green">{'        );'}</div>
                    <div className="text-near-green">{'        // Deploy new code via promise'}</div>
                    <div className="text-near-green">{'        Promise::new(env::current_account_id())'}</div>
                    <div className="text-near-green">{'            .deploy_contract(self.staged_code.take().unwrap());'}</div>
                    <div className="text-near-green">{'    }'}</div>
                    <div className="text-near-green">{'}'}</div>
                  </div>
                </section>

                {/* Section 3: Monitoring */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-cyan-400" />
                    Monitoring &amp; Observability
                  </h4>
                  <p className="text-text-secondary mb-3">
                    You can&apos;t fix what you can&apos;t see. Build monitoring into your protocol from day one:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card variant="default" padding="md" className="border-cyan-500/20">
                      <h5 className="font-semibold text-cyan-400 text-sm mb-2">On-Chain Monitoring</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• Index contract events (NEP-297) for dashboards</li>
                        <li>• Track TVL, user counts, transaction volume</li>
                        <li>• Monitor gas usage per method</li>
                        <li>• Alert on unusual patterns (large withdrawals, etc.)</li>
                      </ul>
                    </Card>
                    <Card variant="default" padding="md" className="border-orange-500/20">
                      <h5 className="font-semibold text-orange-400 text-sm mb-2">Off-Chain Infrastructure</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• RPC endpoint health checks</li>
                        <li>• Indexer lag monitoring</li>
                        <li>• Relayer balance and activity</li>
                        <li>• Grafana + Prometheus for metrics</li>
                      </ul>
                    </Card>
                  </div>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-text-secondary border border-border mt-3">
                    <div className="text-cyan-400 mb-2">{'// Alert bot example (Node.js)'}</div>
                    <div className="text-near-green">{'async function monitorContract() {'}</div>
                    <div className="text-near-green">{'  const tvl = await nearView("protocol.near", "get_tvl");'}</div>
                    <div className="text-near-green">{'  const prevTvl = await redis.get("protocol:tvl");'}</div>
                    <div className="text-near-green">{'  '}</div>
                    <div className="text-near-green">{'  const change = Math.abs(tvl - prevTvl) / prevTvl;'}</div>
                    <div className="text-near-green">{'  if (change > 0.1) { // >10% change'}</div>
                    <div className="text-near-green">{'    await slack.alert(`TVL changed ${(change*100).toFixed(1)}%!`);'}</div>
                    <div className="text-near-green">{'  }'}</div>
                    <div className="text-near-green">{'  await redis.set("protocol:tvl", tvl);'}</div>
                    <div className="text-near-green">{'}'}</div>
                  </div>
                </section>

                {/* Section 4: Gas Optimization */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-green-400" />
                    Advanced Gas Optimization
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Techniques used by top NEAR protocols to minimize gas costs:
                  </p>
                  <div className="space-y-3">
                    <Card variant="default" padding="md">
                      <h5 className="font-semibold text-text-primary text-sm mb-2">Batch Operations</h5>
                      <p className="text-xs text-text-muted">Combine multiple operations into a single transaction. Process lists in batches. Use pagination to avoid gas limits.</p>
                    </Card>
                    <Card variant="default" padding="md">
                      <h5 className="font-semibold text-text-primary text-sm mb-2">Minimize Storage Reads</h5>
                      <p className="text-xs text-text-muted">Cache frequently accessed data. Use <code className="text-purple-400 bg-purple-500/10 px-1 rounded">env::storage_read</code> directly for hot paths instead of SDK collections.</p>
                    </Card>
                    <Card variant="default" padding="md">
                      <h5 className="font-semibold text-text-primary text-sm mb-2">Borsh Optimization</h5>
                      <p className="text-xs text-text-muted">Use compact types: <code className="text-purple-400 bg-purple-500/10 px-1 rounded">u32</code> instead of <code className="text-purple-400 bg-purple-500/10 px-1 rounded">u64</code> when possible. Pack related fields into structs for single storage reads.</p>
                    </Card>
                    <Card variant="default" padding="md">
                      <h5 className="font-semibold text-text-primary text-sm mb-2">Avoid JSON Serialization</h5>
                      <p className="text-xs text-text-muted">Internal state uses Borsh (binary). Only use JSON for external interfaces. JSON encoding/decoding costs 2-5x more gas than Borsh.</p>
                    </Card>
                  </div>
                </section>

                {/* Section 5: Incident Response */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    Incident Response
                  </h4>
                  <p className="text-text-secondary mb-3">
                    When things go wrong in production, you need a plan:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-text-secondary border border-border">
                    <div className="text-red-400 mb-2">{'// Emergency pause pattern'}</div>
                    <div className="text-near-green">{'#[near]'}</div>
                    <div className="text-near-green">{'impl Contract {'}</div>
                    <div className="text-near-green">{'    pub fn emergency_pause(&mut self) {'}</div>
                    <div className="text-near-green">{'        require!('}</div>
                    <div className="text-near-green">{'            self.guardians.contains(&env::predecessor_account_id()),'}</div>
                    <div className="text-near-green">{'            "Only guardians can pause"'}</div>
                    <div className="text-near-green">{'        );'}</div>
                    <div className="text-near-green">{'        self.paused = true;'}</div>
                    <div className="text-near-green">{'        log!("CONTRACT PAUSED by {}", env::predecessor_account_id());'}</div>
                    <div className="text-near-green">{'    }'}</div>
                    <div className="mt-1 text-near-green">{'    // All user-facing methods check this'}</div>
                    <div className="text-near-green">{'    fn assert_not_paused(&self) {'}</div>
                    <div className="text-near-green">{'        require!(!self.paused, "Contract is paused");'}</div>
                    <div className="text-near-green">{'    }'}</div>
                    <div className="text-near-green">{'}'}</div>
                  </div>
                  <Card variant="default" padding="md" className="mt-3 border-red-500/20 bg-red-500/5">
                    <div className="flex items-start gap-2">
                      <Lock className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                      <div className="text-xs text-text-secondary">
                        <strong className="text-red-400">Incident playbook:</strong>
                        <ol className="mt-1 space-y-1 list-decimal list-inside">
                          <li>Detect: monitoring alerts fire</li>
                          <li>Triage: assess severity and impact</li>
                          <li>Pause: activate emergency pause if funds at risk</li>
                          <li>Investigate: analyze transactions and state</li>
                          <li>Fix: deploy patched contract</li>
                          <li>Verify: confirm fix on testnet, then mainnet</li>
                          <li>Resume: unpause and monitor closely</li>
                          <li>Post-mortem: document learnings</li>
                        </ol>
                      </div>
                    </div>
                  </Card>
                </section>

                {/* Section 6: Audit Checklist */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Server className="w-5 h-5 text-purple-400" />
                    Production Audit Checklist
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Card variant="default" padding="md">
                      <h5 className="font-semibold text-text-primary text-sm mb-2">Security</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>☐ All callbacks use #[private]</li>
                        <li>☐ Owner/admin checks on privileged functions</li>
                        <li>☐ No unchecked arithmetic</li>
                        <li>☐ State rollback in failed callbacks</li>
                        <li>☐ Emergency pause mechanism</li>
                        <li>☐ Formal audit by reputable firm</li>
                      </ul>
                    </Card>
                    <Card variant="default" padding="md">
                      <h5 className="font-semibold text-text-primary text-sm mb-2">Operations</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>☐ Migration function for upgrades</li>
                        <li>☐ Monitoring and alerting setup</li>
                        <li>☐ Runbook for common incidents</li>
                        <li>☐ Multi-sig on owner account</li>
                        <li>☐ Rate limiting on sensitive methods</li>
                        <li>☐ Integration tests on testnet</li>
                      </ul>
                    </Card>
                  </div>
                </section>
              </div>
            )}

            {selectedTab === 'practice' && (
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-text-primary">Exercises</h4>

                <Card variant="default" padding="md" className="border-red-500/20">
                  <h5 className="font-semibold text-red-400 text-sm mb-2">🔴 Exercise 1: Security Audit</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Take a smart contract you built earlier in this track and perform a security audit. Check for: callback safety, access control, arithmetic overflow, storage costs, and gas limits. Document all findings.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-red-500/20">
                  <h5 className="font-semibold text-red-400 text-sm mb-2">🔴 Exercise 2: Emergency Pause System</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Add an emergency pause system with a guardian multi-sig to a contract. Test: pause, verify all functions blocked, unpause with 2-of-3 guardian approval. Deploy on testnet.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-red-500/20">
                  <h5 className="font-semibold text-red-400 text-sm mb-2">🔴 Exercise 3: DAO-Governed Upgrade</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Implement a full DAO-governed upgrade flow: propose upgrade → vote → time-lock → execute. Stage new code, verify the hash matches the proposal, and migrate state. Test the entire flow.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-red-500/20">
                  <h5 className="font-semibold text-red-400 text-sm mb-2">🔴 Exercise 4: Monitoring Dashboard</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Build a monitoring dashboard for a deployed contract. Track: method call frequency, gas usage per method, unique users per day, and total value locked. Set up alerts for anomalies.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-red-500/20">
                  <h5 className="font-semibold text-red-400 text-sm mb-2">🔴 Exercise 5: Gas Optimization Challenge</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Take a working contract and reduce its gas usage by 50%+. Techniques: batch operations, efficient storage patterns, minimize cross-contract calls, and use Borsh over JSON. Benchmark before and after.
                  </p>
                </Card>
              </div>
            )}

            {selectedTab === 'resources' && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-text-primary">Resources</h4>
                {[
                  { title: 'NEAR Security Best Practices', url: 'https://docs.near.org/sdk/rust/best-practices', desc: 'Official security guidelines for NEAR smart contracts' },
                  { title: 'NEAR Contract Upgrades', url: 'https://docs.near.org/sdk/rust/building/prototyping', desc: 'Guide to upgrading contracts with state migration' },
                  { title: 'Auditing NEAR Contracts', url: 'https://docs.near.org/sdk/rust/testing/audit', desc: 'Audit preparation and common vulnerability patterns' },
                  { title: 'BlockSec NEAR Audits', url: 'https://blocksec.com/', desc: 'Professional smart contract auditing firm' },
                  { title: 'NEAR Gas Optimization', url: 'https://docs.near.org/concepts/protocol/gas', desc: 'Deep dive into gas costs and optimization techniques' },
                  { title: 'Sputnik DAO', url: 'https://github.com/near-daos/sputnik-dao-contract', desc: 'Production DAO contract — study governance patterns' },
                  { title: 'NEAR Post-Mortems', url: 'https://near.org/blog', desc: 'Learn from past incidents on NEAR protocols' },
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

export default ProductionPatterns;
