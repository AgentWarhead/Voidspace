'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Briefcase, ExternalLink, CheckCircle, DollarSign, Layers, ArrowRightLeft, Globe, BarChart } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

interface RevenueModelsForDappsProps {
  isActive: boolean;
  onToggle: () => void;
}

const RevenueModelsForDapps: React.FC<RevenueModelsForDappsProps> = ({ isActive, onToggle }) => {
  const [selectedTab, setSelectedTab] = useState<string>('overview');

  return (
    <Card variant="glass" padding="none" className="border-purple-500/20">
      <div
        onClick={onToggle}
        className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Revenue Models for dApps</h3>
            <p className="text-text-muted text-sm">Sustainable business models — protocol fees, subscriptions, freemium, and hybrid approaches</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-emerald-300 border-emerald-500/20 shadow-sm shadow-emerald-500/10">Founder</Badge>
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
                  <Briefcase className="w-5 h-5 text-yellow-400" />
                  <h4 className="text-lg font-semibold text-text-primary">What You&apos;ll Learn</h4>
                </div>
                <ul className="space-y-3">
                  {[
                    'Why "free and decentralized" isn\'t a business model — and what to do instead',
                    'Protocol fee structures: swap fees, listing fees, minting fees, and transaction taxes',
                    'Subscription and SaaS models adapted for Web3 — recurring revenue on-chain',
                    'Freemium strategies that convert free users into paying power users',
                    'Real revenue analysis of NEAR protocols: who\'s actually making money and how',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-text-secondary">
                      <CheckCircle className="w-4 h-4 text-near-green mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Card variant="default" padding="md" className="mt-4 border-yellow-500/20 bg-yellow-500/5">
                  <p className="text-sm text-text-secondary">
                    <span className="text-yellow-400 font-semibold">Why this matters:</span> Grants run out. Token pumps end. The projects that survive long-term have real revenue. This module is about building a dApp that pays for itself — and eventually, pays you.
                  </p>
                </Card>
              </div>
            )}

            {selectedTab === 'learn' && (
              <div className="space-y-8">
                {/* Section 1: Revenue Model Overview */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-emerald-400" />
                    The Revenue Model Spectrum
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Web3 revenue models range from fully on-chain protocol fees to traditional SaaS. Most successful projects use a hybrid.
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 text-xs border border-border space-y-3">
                    <div className="text-emerald-400 font-semibold mb-2">Revenue Models by Type</div>
                    {[
                      { model: 'Protocol Fees', revenue: 'Per-transaction', examples: 'DEX swap fees, marketplace commissions', sustainability: '★★★★★' },
                      { model: 'Subscription / SaaS', revenue: 'Recurring', examples: 'Premium features, API access, analytics', sustainability: '★★★★☆' },
                      { model: 'Freemium + Premium', revenue: 'Conversion-based', examples: 'Free basic, paid advanced features', sustainability: '★★★★☆' },
                      { model: 'Token Value Capture', revenue: 'Indirect', examples: 'Buy-and-burn, staking rewards from fees', sustainability: '★★★☆☆' },
                      { model: 'Data / Analytics', revenue: 'B2B sales', examples: 'On-chain data, API access, dashboards', sustainability: '★★★★☆' },
                      { model: 'Minting / Creation Fees', revenue: 'Per-action', examples: 'NFT minting fees, token creation fees', sustainability: '★★★☆☆' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className="text-yellow-400 font-mono w-8 text-right">{item.sustainability}</span>
                        <div className="flex-1">
                          <span className="text-text-secondary font-semibold">{item.model}</span>
                          <span className="text-text-muted ml-2">({item.revenue})</span>
                          <span className="text-text-muted ml-1">— {item.examples}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Section 2: Protocol Fees */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <ArrowRightLeft className="w-5 h-5 text-blue-400" />
                    Protocol Fee Design
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Protocol fees are the most native Web3 revenue model — your smart contract charges a small fee on every transaction.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card variant="default" padding="md" className="border-blue-500/20">
                      <h5 className="font-semibold text-blue-400 text-sm mb-2">Fee Structures</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• <strong className="text-text-secondary">Percentage fee:</strong> 0.1%-1% per transaction (DEXs, marketplaces)</li>
                        <li>• <strong className="text-text-secondary">Flat fee:</strong> Fixed NEAR per action (minting, listing)</li>
                        <li>• <strong className="text-text-secondary">Tiered fee:</strong> Lower fees for higher volume (loyalty incentive)</li>
                        <li>• <strong className="text-text-secondary">Dynamic fee:</strong> Adjusts based on demand (congestion pricing)</li>
                      </ul>
                    </Card>
                    <Card variant="default" padding="md" className="border-green-500/20">
                      <h5 className="font-semibold text-green-400 text-sm mb-2">Fee Distribution</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• <strong className="text-text-secondary">Treasury:</strong> Fund development and operations</li>
                        <li>• <strong className="text-text-secondary">Token buyback:</strong> Buy and burn to reduce supply</li>
                        <li>• <strong className="text-text-secondary">Staker rewards:</strong> Share revenue with token stakers</li>
                        <li>• <strong className="text-text-secondary">LP rewards:</strong> Incentivize liquidity providers</li>
                      </ul>
                    </Card>
                  </div>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-text-secondary border border-border mt-4">
                    <div className="text-blue-400 mb-2">{'// Example: Protocol fee in a NEAR marketplace contract'}</div>
                    <div className="text-near-green">{'const PROTOCOL_FEE_BPS: u128 = 250; // 2.5%'}</div>
                    <div className="text-near-green">{'const FEE_DENOMINATOR: u128 = 10_000;'}</div>
                    <div className="mt-2 text-near-green">{'// On every sale:'}</div>
                    <div className="text-near-green">{'let fee = sale_price * PROTOCOL_FEE_BPS / FEE_DENOMINATOR;'}</div>
                    <div className="text-near-green">{'let seller_receives = sale_price - fee;'}</div>
                    <div className="mt-2 text-near-green">{'// Fee split: 60% treasury, 40% token buyback'}</div>
                    <div className="text-near-green">{'let treasury_share = fee * 60 / 100;'}</div>
                    <div className="text-near-green">{'let buyback_share = fee * 40 / 100;'}</div>
                  </div>
                </section>

                {/* Section 3: SaaS and Subscriptions */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-purple-400" />
                    Web3 SaaS &amp; Subscriptions
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Recurring revenue is the holy grail. Here&apos;s how to implement subscription models in a decentralized context:
                  </p>
                  <div className="space-y-3">
                    {[
                      { model: 'API Access Tiers', desc: 'Free tier (100 calls/day) → Pro ($49/mo, 10K calls) → Enterprise (unlimited). Example: Indexer APIs, analytics dashboards.', nearExample: 'Pagoda RPC tiers' },
                      { model: 'Token-Gated Features', desc: 'Hold X tokens to access premium features. No recurring payment — just hold. Creates sustained token demand.', nearExample: 'NFT-gated communities on Mintbase' },
                      { model: 'On-Chain Subscriptions', desc: 'Smart contract that charges monthly via allowance. Auto-renews until cancelled. Fully on-chain and transparent.', nearExample: 'Emerging pattern on NEAR' },
                      { model: 'Infrastructure as a Service', desc: 'Charge projects for hosted infrastructure: indexers, relayers, oracles, bridges. B2B recurring revenue.', nearExample: 'Fastnear, Pikespeak' },
                    ].map((item, i) => (
                      <Card key={i} variant="default" padding="md" className="border-purple-500/20">
                        <div className="flex justify-between items-start mb-1">
                          <h5 className="font-semibold text-purple-400 text-sm">{item.model}</h5>
                          <span className="text-xs text-near-green font-mono">{item.nearExample}</span>
                        </div>
                        <p className="text-xs text-text-muted">{item.desc}</p>
                      </Card>
                    ))}
                  </div>
                </section>

                {/* Section 4: NEAR Revenue Case Studies */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <BarChart className="w-5 h-5 text-cyan-400" />
                    NEAR Revenue Case Studies
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Real revenue data from NEAR ecosystem projects — what works in practice:
                  </p>
                  <div className="space-y-3">
                    <Card variant="default" padding="md" className="border-cyan-500/20">
                      <h5 className="font-semibold text-cyan-400 text-sm mb-2">Ref Finance (DEX)</h5>
                      <p className="text-xs text-text-muted">
                        <strong className="text-text-secondary">Model:</strong> 0.3% swap fee on every trade. Split between LPs (0.25%) and protocol treasury (0.05%). <strong className="text-text-secondary">Result:</strong> Consistent fee revenue proportional to trading volume. During peak DeFi seasons, protocol fees can reach $10K+/day. The treasury funds ongoing development without relying on grants.
                      </p>
                    </Card>
                    <Card variant="default" padding="md" className="border-cyan-500/20">
                      <h5 className="font-semibold text-cyan-400 text-sm mb-2">Mintbase (NFT Infrastructure)</h5>
                      <p className="text-xs text-text-muted">
                        <strong className="text-text-secondary">Model:</strong> Marketplace commission (2.5% on sales) + infrastructure services for other NFT platforms. <strong className="text-text-secondary">Result:</strong> Dual revenue stream — B2C marketplace fees and B2B infrastructure licensing. The B2B side provides more stable revenue than volatile marketplace volume.
                      </p>
                    </Card>
                    <Card variant="default" padding="md" className="border-cyan-500/20">
                      <h5 className="font-semibold text-cyan-400 text-sm mb-2">Burrow (Lending)</h5>
                      <p className="text-xs text-text-muted">
                        <strong className="text-text-secondary">Model:</strong> Interest rate spread — borrowers pay interest, lenders receive most of it, protocol keeps the spread. <strong className="text-text-secondary">Result:</strong> Revenue scales with TVL and utilization. Higher utilization = higher rates = higher protocol revenue. Reserve factor ensures the protocol captures value.
                      </p>
                    </Card>
                  </div>
                </section>

                {/* Section 5: Unit Economics */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-orange-400" />
                    Unit Economics for dApps
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Even in Web3, you need to understand your unit economics. How much does each user cost and generate?
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 text-xs border border-border space-y-3">
                    <div className="text-orange-400 font-semibold mb-2">Key Metrics to Track</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div>
                          <span className="text-emerald-400 font-semibold">CAC (Customer Acquisition Cost)</span>
                          <p className="text-text-muted">Total marketing spend ÷ new users. Include gas subsidies, airdrops, and incentives.</p>
                        </div>
                        <div>
                          <span className="text-blue-400 font-semibold">LTV (Lifetime Value)</span>
                          <p className="text-text-muted">Average revenue per user × average lifespan. For DeFi: fees generated per wallet over time.</p>
                        </div>
                        <div>
                          <span className="text-purple-400 font-semibold">LTV:CAC Ratio</span>
                          <p className="text-text-muted">Target: 3:1 or higher. Below 1:1 means you&apos;re losing money on every user.</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <span className="text-orange-400 font-semibold">Monthly Burn Rate</span>
                          <p className="text-text-muted">Infrastructure + team + marketing costs. Know your runway at current burn.</p>
                        </div>
                        <div>
                          <span className="text-cyan-400 font-semibold">Revenue per Transaction</span>
                          <p className="text-text-muted">Average fee × number of transactions. Your most granular revenue metric.</p>
                        </div>
                        <div>
                          <span className="text-yellow-400 font-semibold">Break-Even Analysis</span>
                          <p className="text-text-muted">How many daily active users / transactions to cover monthly costs?</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section 6: Pricing Strategy */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-yellow-400" />
                    Pricing Strategy
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Pricing in Web3 is tricky — users expect &quot;free and decentralized.&quot; Here&apos;s how to charge without losing users:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card variant="default" padding="md" className="border-yellow-500/20">
                      <h5 className="font-semibold text-yellow-400 text-sm mb-2">Pricing Principles</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• <strong className="text-text-secondary">Start low, earn trust:</strong> Launch with 0 or minimal fees</li>
                        <li>• <strong className="text-text-secondary">Transparent fees:</strong> Users see exactly what they pay and why</li>
                        <li>• <strong className="text-text-secondary">Value-aligned:</strong> Charge when users get value, not before</li>
                        <li>• <strong className="text-text-secondary">Governance-adjustable:</strong> Let DAO vote on fee changes</li>
                        <li>• <strong className="text-text-secondary">Competitive:</strong> Check what similar protocols charge</li>
                      </ul>
                    </Card>
                    <Card variant="default" padding="md" className="border-red-500/20">
                      <h5 className="font-semibold text-red-400 text-sm mb-2">Pricing Anti-Patterns</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• Hidden fees that surprise users</li>
                        <li>• Fees higher than centralized alternatives</li>
                        <li>• Charging before proving value (users will fork you)</li>
                        <li>• Extracting too much too early (community backlash)</li>
                        <li>• No fee at all — &quot;we&apos;ll figure it out later&quot; (you won&apos;t)</li>
                      </ul>
                    </Card>
                  </div>
                </section>
              </div>
            )}

            {selectedTab === 'practice' && (
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-text-primary">Exercises</h4>

                <Card variant="default" padding="md" className="border-yellow-500/20">
                  <h5 className="font-semibold text-yellow-400 text-sm mb-2">🟡 Exercise 1: Revenue Model Canvas</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Map out every possible revenue stream for your dApp. For each stream, estimate: revenue per unit, volume potential, implementation complexity, and time to revenue. Pick the top 2-3 to implement first.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-yellow-500/20">
                  <h5 className="font-semibold text-yellow-400 text-sm mb-2">🟡 Exercise 2: Fee Structure Design</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Design a protocol fee for your dApp. Define: fee percentage/amount, what triggers the fee, where fees go (treasury, buyback, stakers), and how fees can be changed (governance, multisig). Write the smart contract logic.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-yellow-500/20">
                  <h5 className="font-semibold text-yellow-400 text-sm mb-2">🟡 Exercise 3: Unit Economics Spreadsheet</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Build a spreadsheet with: CAC, LTV, revenue per transaction, monthly burn rate, and break-even point. Model three scenarios: conservative (100 users), moderate (1K users), and optimistic (10K users). When do you become self-sustaining?
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-yellow-500/20">
                  <h5 className="font-semibold text-yellow-400 text-sm mb-2">🟡 Exercise 4: Competitive Pricing Analysis</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Research 5 protocols similar to yours (on NEAR and other chains). Document their fee structures, revenue numbers (if public), and pricing tiers. Position your pricing relative to them and justify your choice.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-yellow-500/20">
                  <h5 className="font-semibold text-yellow-400 text-sm mb-2">🟡 Exercise 5: Revenue Diversification Plan</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Design a 3-phase revenue plan: Phase 1 (0-6 months) — primary revenue stream, Phase 2 (6-12 months) — add secondary stream, Phase 3 (12-24 months) — full diversification. No single revenue source should be more than 60% of total.
                  </p>
                </Card>
              </div>
            )}

            {selectedTab === 'resources' && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-text-primary">Resources</h4>
                {[
                  { title: 'Token Terminal', url: 'https://tokenterminal.com/', desc: 'Real revenue and financial data for crypto protocols' },
                  { title: 'DeFi Llama', url: 'https://defillama.com/chain/Near', desc: 'TVL, revenue, and protocol metrics for NEAR ecosystem' },
                  { title: 'Ref Finance Analytics', url: 'https://stats.ref.finance/', desc: 'Real-time fee revenue and volume data from NEAR\'s leading DEX' },
                  { title: 'Crypto Business Models (Messari)', url: 'https://messari.io/', desc: 'Research on sustainable crypto business models and revenue analysis' },
                  { title: 'Web3 Business Model Navigator', url: 'https://bmn.wtf/', desc: 'Framework for designing Web3-native business models' },
                  { title: 'NEAR Protocol Economics', url: 'https://near.org/papers/economics-in-sharded-blockchain/', desc: 'Understanding NEAR\'s economic model — fees, storage, and validator economics' },
                  { title: 'Fat Protocols Thesis', url: 'https://www.usv.com/writing/2016/08/fat-protocols/', desc: 'Joel Monegro\'s thesis on value capture in protocol layers' },
                  { title: 'Dune Analytics', url: 'https://dune.com/', desc: 'Build custom dashboards to track your protocol\'s on-chain revenue' },
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

export default RevenueModelsForDapps;
