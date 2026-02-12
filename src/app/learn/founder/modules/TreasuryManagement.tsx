'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Vault, ExternalLink, CheckCircle, PieChart, Shield, TrendingDown, Lock, BarChart3 } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

interface TreasuryManagementProps {
  isActive: boolean;
  onToggle: () => void;
}

const TreasuryManagement: React.FC<TreasuryManagementProps> = ({ isActive, onToggle }) => {
  const [selectedTab, setSelectedTab] = useState<string>('overview');

  return (
    <Card variant="glass" padding="none" className="border-purple-500/20">
      <div
        onClick={onToggle}
        className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-xl flex items-center justify-center">
            <Vault className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Treasury Management</h3>
            <p className="text-text-muted text-sm">On-chain treasury, diversification, DAO governance, runway planning, and multi-sig</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-emerald-500/10 text-emerald-300 border-emerald-500/20">Founder</Badge>
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
                  <Vault className="w-5 h-5 text-amber-400" />
                  <h4 className="text-lg font-semibold text-text-primary">What You&apos;ll Learn</h4>
                </div>
                <ul className="space-y-3">
                  {[
                    'Managing a project treasury on-chain — wallets, accounting, and transparency',
                    'Diversification strategies: stablecoins, native tokens, BTC/ETH, and yield-bearing positions',
                    'DAO-governed treasury — proposals, voting, and spending accountability',
                    'Runway planning and burn rate management — surviving bear markets',
                    'Multi-sig setup best practices on NEAR using Astro DAO and NEAR multi-sig',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-text-secondary">
                      <CheckCircle className="w-4 h-4 text-near-green mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Card variant="default" padding="md" className="mt-4 border-amber-500/20 bg-amber-500/5">
                  <p className="text-sm text-text-secondary">
                    <span className="text-amber-400 font-semibold">Why this matters:</span> Projects that survive bear markets have disciplined treasury management. Most crypto projects that fail do so because they run out of money — not because of bad tech. Your treasury is your lifeline.
                  </p>
                </Card>
              </div>
            )}

            {selectedTab === 'learn' && (
              <div className="space-y-8">
                {/* Section 1: Treasury Basics */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-amber-400" />
                    On-Chain Treasury Fundamentals
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Your treasury is the financial backbone of your project. On-chain treasuries offer transparency but require careful management.
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 text-xs border border-border space-y-3">
                    <div className="text-amber-400 font-semibold mb-2">Treasury Structure</div>
                    {[
                      { component: 'Operating Wallet', purpose: 'Day-to-day expenses (team, infra, marketing)', allocation: '10-15%', access: 'Multi-sig (2/3)' },
                      { component: 'Strategic Reserve', purpose: 'Partnerships, acquisitions, emergency fund', allocation: '25-35%', access: 'Multi-sig (3/5)' },
                      { component: 'Community Fund', purpose: 'Grants, bounties, ambassador programs', allocation: '20-30%', access: 'DAO governance' },
                      { component: 'Locked Vesting', purpose: 'Team tokens, advisor tokens, future incentives', allocation: '20-30%', access: 'Time-locked smart contract' },
                      { component: 'Yield Positions', purpose: 'Generate passive income on idle treasury', allocation: '5-15%', access: 'Multi-sig with timelock' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className="text-amber-400 font-mono w-12 text-right flex-shrink-0">{item.allocation}</span>
                        <div className="flex-1">
                          <span className="text-text-secondary font-semibold">{item.component}</span>
                          <span className="text-text-muted ml-2">— {item.purpose}</span>
                          <span className="text-near-green ml-2 font-mono text-[10px]">[{item.access}]</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Section 2: Diversification */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-green-400" />
                    Diversification Strategies
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Holding 100% of your treasury in your own token is a recipe for disaster. Diversification ensures you can operate regardless of market conditions.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card variant="default" padding="md" className="border-green-500/20">
                      <h5 className="font-semibold text-green-400 text-sm mb-2">Recommended Allocation</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• <strong className="text-text-secondary">Stablecoins (40-60%):</strong> USDC, USDT on NEAR. Covers 12-24 months of expenses</li>
                        <li>• <strong className="text-text-secondary">Native token (20-30%):</strong> Your own token for governance and ecosystem incentives</li>
                        <li>• <strong className="text-text-secondary">NEAR (10-20%):</strong> Ecosystem alignment and gas reserves</li>
                        <li>• <strong className="text-text-secondary">BTC/ETH (5-10%):</strong> Blue-chip crypto exposure for long-term value</li>
                      </ul>
                    </Card>
                    <Card variant="default" padding="md" className="border-red-500/20">
                      <h5 className="font-semibold text-red-400 text-sm mb-2">Diversification Anti-Patterns</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• <strong className="text-text-secondary">100% own token:</strong> One crash and you can&apos;t pay team or bills</li>
                        <li>• <strong className="text-text-secondary">Market-timing sales:</strong> Don&apos;t try to time token sales — use DCA</li>
                        <li>• <strong className="text-text-secondary">Complex DeFi strategies:</strong> Avoid risky yield farming with treasury funds</li>
                        <li>• <strong className="text-text-secondary">No stablecoin buffer:</strong> Always keep 12+ months of runway in stables</li>
                      </ul>
                    </Card>
                  </div>
                </section>

                {/* Section 3: DAO Treasury */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-purple-400" />
                    DAO-Governed Treasury
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Transitioning treasury control to a DAO builds trust and decentralizes power. But it requires careful governance design.
                  </p>
                  <div className="space-y-3">
                    {[
                      { model: 'Full DAO Control', desc: 'Every expenditure requires a governance vote. Maximum transparency but slow execution. Best for community-owned projects with large treasuries.', example: 'Uniswap Governance, NEAR Community Fund' },
                      { model: 'Council + DAO Hybrid', desc: 'Elected council handles routine expenses (under threshold). Large expenditures require full DAO vote. Balances speed with accountability.', example: 'Astro DAO on NEAR, Gitcoin' },
                      { model: 'Budget Committees', desc: 'DAO allocates quarterly budgets to working groups. Each group manages their own sub-treasury. Scalable and efficient.', example: 'MakerDAO Core Units, NEAR DevHub' },
                    ].map((item, i) => (
                      <Card key={i} variant="default" padding="md" className="border-purple-500/20">
                        <div className="flex justify-between items-start mb-1">
                          <h5 className="font-semibold text-purple-400 text-sm">{item.model}</h5>
                          <span className="text-xs text-near-green font-mono">{item.example}</span>
                        </div>
                        <p className="text-xs text-text-muted">{item.desc}</p>
                      </Card>
                    ))}
                  </div>
                </section>

                {/* Section 4: Runway Planning */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <TrendingDown className="w-5 h-5 text-red-400" />
                    Runway Planning &amp; Burn Rate
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Burn rate is how fast you&apos;re spending. Runway is how long you can survive. In crypto, plan for the worst case.
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 text-xs border border-border space-y-3">
                    <div className="text-red-400 font-semibold mb-2">Runway Calculator</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div>
                          <span className="text-amber-400 font-semibold">Monthly Burn Rate</span>
                          <p className="text-text-muted">Team salaries + infrastructure + marketing + legal + misc. Be brutally honest.</p>
                        </div>
                        <div>
                          <span className="text-green-400 font-semibold">Runway (months)</span>
                          <p className="text-text-muted">= Liquid treasury (stables + reliable assets) ÷ monthly burn. Ignore speculative token value.</p>
                        </div>
                        <div>
                          <span className="text-red-400 font-semibold">Bear Market Scenario</span>
                          <p className="text-text-muted">Assume token drops 80%, DeFi yields drop 90%. Can you still operate for 12 months?</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <span className="text-blue-400 font-semibold">Target: 18-24 Months</span>
                          <p className="text-text-muted">Minimum runway in stablecoins. Bear markets last 12-18 months on average.</p>
                        </div>
                        <div>
                          <span className="text-purple-400 font-semibold">Burn Reduction Levers</span>
                          <p className="text-text-muted">Cut marketing first, renegotiate contracts, reduce team to core contributors, defer non-essential features.</p>
                        </div>
                        <div>
                          <span className="text-cyan-400 font-semibold">Revenue Offset</span>
                          <p className="text-text-muted">Net burn = gross burn - revenue. As revenue grows, effective runway extends automatically.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section 5: Multi-Sig */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Lock className="w-5 h-5 text-cyan-400" />
                    Multi-Sig Setup Best Practices
                  </h4>
                  <p className="text-text-secondary mb-3">
                    A multi-sig wallet requires multiple approvals for transactions. It&apos;s the baseline security for any serious project treasury.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card variant="default" padding="md" className="border-cyan-500/20">
                      <h5 className="font-semibold text-cyan-400 text-sm mb-2">Multi-Sig Configuration</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• <strong className="text-text-secondary">Operating (2/3):</strong> Quick access for routine expenses</li>
                        <li>• <strong className="text-text-secondary">Strategic (3/5):</strong> Major decisions need broader consensus</li>
                        <li>• <strong className="text-text-secondary">Emergency (4/7):</strong> Critical actions like contract upgrades</li>
                        <li>• <strong className="text-text-secondary">Key holders:</strong> Mix of team, advisors, and community members</li>
                      </ul>
                    </Card>
                    <Card variant="default" padding="md" className="border-cyan-500/20">
                      <h5 className="font-semibold text-cyan-400 text-sm mb-2">NEAR Multi-Sig Options</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• <strong className="text-text-secondary">Astro DAO:</strong> Full DAO with multi-sig treasury, proposals, and voting</li>
                        <li>• <strong className="text-text-secondary">NEAR Multi-Sig Contract:</strong> Native multi-sig with configurable thresholds</li>
                        <li>• <strong className="text-text-secondary">Keypom:</strong> Advanced access control and key management on NEAR</li>
                        <li>• <strong className="text-text-secondary">Ledger support:</strong> Hardware wallet signing for maximum security</li>
                      </ul>
                    </Card>
                  </div>
                  <Card variant="default" padding="md" className="mt-4 border-yellow-500/20 bg-yellow-500/5">
                    <p className="text-sm text-text-secondary">
                      <span className="text-yellow-400 font-semibold">Security tip:</span> Never have a single person control treasury access. Use geographically distributed key holders and require hardware wallets. Practice recovery procedures — a multi-sig is useless if signers lose their keys.
                    </p>
                  </Card>
                </section>
              </div>
            )}

            {selectedTab === 'practice' && (
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-text-primary">Exercises</h4>

                <Card variant="default" padding="md" className="border-amber-500/20">
                  <h5 className="font-semibold text-amber-400 text-sm mb-2">🟡 Exercise 1: Treasury Allocation Plan</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Design your treasury allocation across the 5 components (operating, strategic, community, vesting, yield). Define exact percentages, asset types, and access controls for each bucket.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-amber-500/20">
                  <h5 className="font-semibold text-amber-400 text-sm mb-2">🟡 Exercise 2: Burn Rate Spreadsheet</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Create a monthly expense budget: team salaries, infrastructure, marketing, legal, and reserves. Calculate your monthly burn rate and runway at current treasury. Model a 80% token crash — what&apos;s your emergency runway?
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-amber-500/20">
                  <h5 className="font-semibold text-amber-400 text-sm mb-2">🟡 Exercise 3: Multi-Sig Setup</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Set up an Astro DAO on NEAR testnet. Configure a 2/3 multi-sig for your operating wallet. Practice submitting and approving a transfer proposal. Document the process for your team.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-amber-500/20">
                  <h5 className="font-semibold text-amber-400 text-sm mb-2">🟡 Exercise 4: Diversification Strategy</h5>
                  <p className="text-xs text-text-muted mb-3">
                    If you had $500K in treasury (all in your native token), design a diversification plan: what to sell, over what timeline (DCA schedule), target allocations, and which DEXs/OTC desks to use on NEAR.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-amber-500/20">
                  <h5 className="font-semibold text-amber-400 text-sm mb-2">🟡 Exercise 5: DAO Treasury Governance</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Draft a treasury governance framework: spending thresholds, proposal templates, voting periods, and quarterly reporting requirements. Model it after NEAR DevHub or MakerDAO&apos;s governance structure.
                  </p>
                </Card>
              </div>
            )}

            {selectedTab === 'resources' && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-text-primary">Resources</h4>
                {[
                  { title: 'Astro DAO', url: 'https://astrodao.com/', desc: 'NEAR-native DAO platform with built-in treasury management and multi-sig' },
                  { title: 'DeepDAO Treasury Analytics', url: 'https://deepdao.io/', desc: 'Track and compare DAO treasuries across chains — benchmarks and best practices' },
                  { title: 'Open Zeppelin Multi-Sig Guide', url: 'https://blog.openzeppelin.com/', desc: 'Security best practices for multi-sig wallet setup and management' },
                  { title: 'Hasu on Treasury Management', url: 'https://uncommoncore.co/', desc: 'Research on optimal treasury management strategies for crypto protocols' },
                  { title: 'Karpatkey (DAO Treasury Mgmt)', url: 'https://www.karpatkey.com/', desc: 'Professional DAO treasury management — case studies from Gnosis, ENS, and others' },
                  { title: 'DeFi Llama Treasury Dashboard', url: 'https://defillama.com/treasuries', desc: 'Real-time treasury data for major protocols — see how others manage their funds' },
                  { title: 'Messari Governor', url: 'https://messari.io/governor', desc: 'DAO governance analytics — track proposals, voting, and treasury flows' },
                  { title: 'NEAR Wallet (Multi-Sig)', url: 'https://wallet.near.org/', desc: 'NEAR native wallet with multi-sig support for treasury management' },
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

export default TreasuryManagement;
