'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, BarChart3, ExternalLink, CheckCircle, Activity, Eye, TrendingUp, Database, LineChart } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

interface MetricsThatMatterProps {
  isActive: boolean;
  onToggle: () => void;
}

const MetricsThatMatter: React.FC<MetricsThatMatterProps> = ({ isActive, onToggle }) => {
  const [selectedTab, setSelectedTab] = useState<string>('overview');

  return (
    <Card variant="glass" padding="none" className="border-purple-500/20">
      <div
        onClick={onToggle}
        className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Metrics That Matter</h3>
            <p className="text-text-muted text-sm">DAU/MAU, TVL, on-chain analytics, real vs vanity metrics, and building dashboards</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-emerald-500/10 text-emerald-300 border-emerald-500/20">Founder</Badge>
          <Badge className="bg-purple-500/10 text-purple-300 border-purple-500/20">45 min</Badge>
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
                  <BarChart3 className="w-5 h-5 text-cyan-400" />
                  <h4 className="text-lg font-semibold text-text-primary">What You&apos;ll Learn</h4>
                </div>
                <ul className="space-y-3">
                  {[
                    'Core dApp metrics: DAU/MAU, retention rates, TVL, and transaction volume',
                    'On-chain analytics for measuring real protocol success — not just hype',
                    'Tools of the trade: Dune Analytics, Flipside Crypto, Pikespeak, and NearBlocks',
                    'Vanity metrics vs real metrics — what actually predicts long-term success',
                    'Building dashboards to track your project and impress investors',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-text-secondary">
                      <CheckCircle className="w-4 h-4 text-near-green mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Card variant="default" padding="md" className="mt-4 border-cyan-500/20 bg-cyan-500/5">
                  <p className="text-sm text-text-secondary">
                    <span className="text-cyan-400 font-semibold">Why this matters:</span> &quot;What gets measured gets managed.&quot; Too many Web3 projects track Twitter followers and Discord members while ignoring on-chain engagement. The right metrics tell you if you&apos;re building something real — and help you prove it to investors.
                  </p>
                </Card>
              </div>
            )}

            {selectedTab === 'learn' && (
              <div className="space-y-8">
                {/* Section 1: Core Metrics */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-cyan-400" />
                    Core dApp Metrics
                  </h4>
                  <p className="text-text-secondary mb-3">
                    These are the metrics that matter most for any dApp. Track them weekly at minimum.
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 text-xs border border-border space-y-3">
                    <div className="text-cyan-400 font-semibold mb-2">Essential Metrics Framework</div>
                    {[
                      { metric: 'DAU / MAU', category: 'Engagement', desc: 'Daily/Monthly Active Users — unique wallets interacting with your contract', benchmark: 'DAU/MAU ratio > 20% = strong' },
                      { metric: 'Retention (D1/D7/D30)', category: 'Stickiness', desc: 'Percentage of users who return after 1, 7, and 30 days', benchmark: 'D30 > 15% = good for DeFi' },
                      { metric: 'TVL', category: 'DeFi', desc: 'Total Value Locked — total assets deposited in your protocol', benchmark: 'Track trend, not absolute' },
                      { metric: 'Transaction Volume', category: 'Activity', desc: 'Daily transaction count and value flowing through your contracts', benchmark: 'Growing week-over-week' },
                      { metric: 'Revenue', category: 'Sustainability', desc: 'Actual protocol revenue from fees — the ultimate health metric', benchmark: 'Covering operating costs' },
                      { metric: 'New Wallets', category: 'Growth', desc: 'New unique wallets interacting for the first time per day/week', benchmark: 'Steady organic growth' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className="text-cyan-400 font-mono w-28 text-right flex-shrink-0">{item.metric}</span>
                        <div className="flex-1">
                          <span className="text-text-secondary font-semibold">{item.category}</span>
                          <span className="text-text-muted ml-2">— {item.desc}</span>
                          <div className="text-near-green text-[10px] mt-0.5">{item.benchmark}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Section 2: On-Chain Analytics */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Database className="w-5 h-5 text-blue-400" />
                    On-Chain Analytics
                  </h4>
                  <p className="text-text-secondary mb-3">
                    On-chain data doesn&apos;t lie. Unlike Web2 metrics that can be gamed with bots, on-chain transactions require real value (gas fees).
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card variant="default" padding="md" className="border-blue-500/20">
                      <h5 className="font-semibold text-blue-400 text-sm mb-2">What to Track On-Chain</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• <strong className="text-text-secondary">Contract calls:</strong> Which functions are most used? How often?</li>
                        <li>• <strong className="text-text-secondary">Unique callers:</strong> How many distinct wallets interact per day?</li>
                        <li>• <strong className="text-text-secondary">Token flows:</strong> Where are tokens moving? Concentrated or distributed?</li>
                        <li>• <strong className="text-text-secondary">Gas usage:</strong> Total gas consumed — indicates real computational activity</li>
                      </ul>
                    </Card>
                    <Card variant="default" padding="md" className="border-blue-500/20">
                      <h5 className="font-semibold text-blue-400 text-sm mb-2">NEAR-Specific Analytics</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• <strong className="text-text-secondary">Receipt-level data:</strong> NEAR receipts show cross-contract calls</li>
                        <li>• <strong className="text-text-secondary">Storage staking:</strong> Tracks real on-chain data commitment</li>
                        <li>• <strong className="text-text-secondary">Account creation:</strong> New .near accounts = new users to ecosystem</li>
                        <li>• <strong className="text-text-secondary">Shard activity:</strong> Which shards your contract uses — performance indicator</li>
                      </ul>
                    </Card>
                  </div>
                </section>

                {/* Section 3: Analytics Tools */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <LineChart className="w-5 h-5 text-purple-400" />
                    Analytics Tools
                  </h4>
                  <p className="text-text-secondary mb-3">
                    The right tools turn raw blockchain data into actionable insights. Here are the essential ones for NEAR builders:
                  </p>
                  <div className="space-y-3">
                    {[
                      { tool: 'Pikespeak', desc: 'NEAR-native analytics platform. Real-time data on accounts, contracts, and tokens. Free API access for builders. The go-to tool for NEAR-specific metrics.', strength: 'Best for NEAR-specific data' },
                      { tool: 'NearBlocks', desc: 'NEAR blockchain explorer with analytics. Contract verification, transaction tracking, and token analytics. Essential for debugging and monitoring.', strength: 'Best for transaction-level detail' },
                      { tool: 'Dune Analytics', desc: 'SQL-based analytics platform with NEAR support. Build custom dashboards with SQL queries. Community-shared queries you can fork and customize.', strength: 'Best for custom dashboards' },
                      { tool: 'Flipside Crypto', desc: 'Curated blockchain data with NEAR integration. Pre-built datasets and SQL interface. Bounty programs that pay you to build analytics.', strength: 'Best for earning while analyzing' },
                    ].map((item, i) => (
                      <Card key={i} variant="default" padding="md" className="border-purple-500/20">
                        <div className="flex justify-between items-start mb-1">
                          <h5 className="font-semibold text-purple-400 text-sm">{item.tool}</h5>
                          <span className="text-xs text-near-green font-mono">{item.strength}</span>
                        </div>
                        <p className="text-xs text-text-muted">{item.desc}</p>
                      </Card>
                    ))}
                  </div>
                </section>

                {/* Section 4: Vanity vs Real Metrics */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Eye className="w-5 h-5 text-red-400" />
                    Vanity Metrics vs Real Metrics
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Vanity metrics make you feel good. Real metrics make you money. Know the difference.
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 text-xs border border-border space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-red-400 font-semibold mb-2">❌ Vanity Metrics</div>
                        <ul className="text-text-muted space-y-2">
                          <li>• Twitter followers (easily botted)</li>
                          <li>• Discord member count (inactive members)</li>
                          <li>• Total wallets created (includes bots)</li>
                          <li>• TVL with incentivized liquidity (mercenary capital)</li>
                          <li>• Total transactions (wash trading)</li>
                          <li>• GitHub stars (no correlation to usage)</li>
                        </ul>
                      </div>
                      <div>
                        <div className="text-green-400 font-semibold mb-2">✅ Real Metrics</div>
                        <ul className="text-text-muted space-y-2">
                          <li>• DAU/MAU ratio (actual engagement)</li>
                          <li>• D30 retention (users who stay)</li>
                          <li>• Revenue per user (sustainable value)</li>
                          <li>• Organic TVL (unsubsidized deposits)</li>
                          <li>• Unique contract callers (real users)</li>
                          <li>• Commits + PRs merged (dev activity)</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section 5: Building Dashboards */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                    Building Dashboards for Your Project
                  </h4>
                  <p className="text-text-secondary mb-3">
                    A public dashboard builds trust with your community and impresses investors. Here&apos;s how to build one:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card variant="default" padding="md" className="border-emerald-500/20">
                      <h5 className="font-semibold text-emerald-400 text-sm mb-2">Dashboard Must-Haves</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• <strong className="text-text-secondary">User growth chart:</strong> DAU/MAU over time with trend line</li>
                        <li>• <strong className="text-text-secondary">Volume/TVL chart:</strong> Shows protocol activity and scale</li>
                        <li>• <strong className="text-text-secondary">Revenue tracker:</strong> Cumulative and daily protocol revenue</li>
                        <li>• <strong className="text-text-secondary">Retention cohorts:</strong> Weekly cohort retention curves</li>
                        <li>• <strong className="text-text-secondary">Top users table:</strong> Most active wallets (anonymized)</li>
                      </ul>
                    </Card>
                    <Card variant="default" padding="md" className="border-emerald-500/20">
                      <h5 className="font-semibold text-emerald-400 text-sm mb-2">How to Build It</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• <strong className="text-text-secondary">Quick start:</strong> Dune dashboard with 5-7 SQL queries</li>
                        <li>• <strong className="text-text-secondary">Custom:</strong> Pikespeak API + React frontend for branded analytics</li>
                        <li>• <strong className="text-text-secondary">Embed:</strong> Dune embeds in your docs or website</li>
                        <li>• <strong className="text-text-secondary">Automate:</strong> Weekly metrics email to investors and team</li>
                        <li>• <strong className="text-text-secondary">Share:</strong> Public Dune dashboards build community trust</li>
                      </ul>
                    </Card>
                  </div>
                </section>
              </div>
            )}

            {selectedTab === 'practice' && (
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-text-primary">Exercises</h4>

                <Card variant="default" padding="md" className="border-cyan-500/20">
                  <h5 className="font-semibold text-cyan-400 text-sm mb-2">🔵 Exercise 1: Metrics Framework</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Define the top 5 metrics for your dApp. For each metric, specify: what it measures, how to calculate it, data source, target value, and why it matters. Distinguish between leading and lagging indicators.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-cyan-500/20">
                  <h5 className="font-semibold text-cyan-400 text-sm mb-2">🔵 Exercise 2: Dune Dashboard</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Create a Dune Analytics dashboard for any NEAR protocol (Ref Finance, Burrow, or your own). Write at least 3 SQL queries: daily active users, transaction volume, and one unique metric. Share the public link.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-cyan-500/20">
                  <h5 className="font-semibold text-cyan-400 text-sm mb-2">🔵 Exercise 3: Vanity Metric Audit</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Audit a competitor&apos;s public metrics. Identify which are vanity and which are real. How could their real metrics be different from what they report? Write a 1-page analysis.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-cyan-500/20">
                  <h5 className="font-semibold text-cyan-400 text-sm mb-2">🔵 Exercise 4: Retention Analysis</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Using NearBlocks or Pikespeak, analyze the retention of a NEAR dApp. Track wallets that interacted in Week 1 — what percentage returned in Week 2, 3, and 4? What does this tell you about product-market fit?
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-cyan-500/20">
                  <h5 className="font-semibold text-cyan-400 text-sm mb-2">🔵 Exercise 5: Investor Metrics Deck</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Create a 5-slide metrics presentation for investors: growth story, engagement quality, revenue trajectory, competitive comparison, and projections. Use real data from your dashboards.
                  </p>
                </Card>
              </div>
            )}

            {selectedTab === 'resources' && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-text-primary">Resources</h4>
                {[
                  { title: 'Pikespeak (NEAR Analytics)', url: 'https://pikespeak.ai/', desc: 'NEAR-native analytics — account, contract, and token data with free API access' },
                  { title: 'NearBlocks Explorer', url: 'https://nearblocks.io/', desc: 'NEAR blockchain explorer — transactions, contracts, tokens, and analytics' },
                  { title: 'Dune Analytics (NEAR)', url: 'https://dune.com/browse/dashboards?q=near', desc: 'Community-built NEAR dashboards — fork and customize for your project' },
                  { title: 'Flipside Crypto (NEAR)', url: 'https://flipsidecrypto.xyz/', desc: 'Curated NEAR data with SQL interface and bounty programs' },
                  { title: 'Token Terminal', url: 'https://tokenterminal.com/', desc: 'Protocol revenue and financial metrics — benchmark against the industry' },
                  { title: 'DeFi Llama (NEAR)', url: 'https://defillama.com/chain/Near', desc: 'TVL tracking and DeFi analytics for the NEAR ecosystem' },
                  { title: 'Electric Capital Developer Report', url: 'https://www.developerreport.com/', desc: 'Annual developer activity metrics across chains — see where NEAR stands' },
                  { title: 'Artemis Analytics', url: 'https://www.artemis.xyz/', desc: 'Cross-chain metrics comparison — DAU, transactions, fees, and developer activity' },
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

export default MetricsThatMatter;
