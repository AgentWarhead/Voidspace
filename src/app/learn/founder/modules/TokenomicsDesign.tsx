'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, PieChart, ExternalLink, CheckCircle, Coins, BarChart, Lock, Repeat, Shield } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

interface TokenomicsDesignProps {
  isActive: boolean;
  onToggle: () => void;
}

const TokenomicsDesign: React.FC<TokenomicsDesignProps> = ({ isActive, onToggle }) => {
  const [selectedTab, setSelectedTab] = useState<string>('overview');

  return (
    <Card variant="glass" padding="none" className="border-purple-500/20">
      <div
        onClick={onToggle}
        className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <PieChart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Tokenomics Design</h3>
            <p className="text-text-muted text-sm">Design sustainable token economies — supply, distribution, utility, and incentive alignment</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-emerald-300 border-emerald-500/20 shadow-sm shadow-emerald-500/10">Founder</Badge>
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
                  <PieChart className="w-5 h-5 text-purple-400" />
                  <h4 className="text-lg font-semibold text-text-primary">What You&apos;ll Learn</h4>
                </div>
                <ul className="space-y-3">
                  {[
                    'Token supply models — fixed, inflationary, deflationary, and hybrid approaches',
                    'Distribution strategies that align early supporters, team, and community',
                    'Utility design — giving your token real, lasting demand beyond speculation',
                    'Vesting schedules and unlock mechanics that prevent dump dynamics',
                    'Case studies from successful NEAR projects: REF, AURORA, and more',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-text-secondary">
                      <CheckCircle className="w-4 h-4 text-near-green mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Card variant="default" padding="md" className="mt-4 border-purple-500/20 bg-purple-500/5">
                  <p className="text-sm text-text-secondary">
                    <span className="text-purple-400 font-semibold">Why this matters:</span> Bad tokenomics kill good projects. A token that dumps 90% on launch destroys community trust forever. Getting this right is the difference between a thriving ecosystem and a ghost chain.
                  </p>
                </Card>
              </div>
            )}

            {selectedTab === 'learn' && (
              <div className="space-y-8">
                {/* Section 1: Supply Models */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Coins className="w-5 h-5 text-yellow-400" />
                    Token Supply Models
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Your supply model determines long-term economics. Each approach has trade-offs — there&apos;s no one-size-fits-all.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card variant="default" padding="md" className="border-yellow-500/20">
                      <h5 className="font-semibold text-yellow-400 text-sm mb-2">Fixed Supply</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• Total supply set at launch (e.g., 1B tokens)</li>
                        <li>• Scarcity narrative — &quot;digital gold&quot; thesis</li>
                        <li>• <strong className="text-green-400">Pro:</strong> Simple, predictable, deflationary pressure</li>
                        <li>• <strong className="text-red-400">Con:</strong> No new incentives for future participants</li>
                        <li>• Example: Bitcoin (21M cap)</li>
                      </ul>
                    </Card>
                    <Card variant="default" padding="md" className="border-blue-500/20">
                      <h5 className="font-semibold text-blue-400 text-sm mb-2">Inflationary</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• New tokens minted over time (staking rewards, etc.)</li>
                        <li>• Funds ongoing development and participation</li>
                        <li>• <strong className="text-green-400">Pro:</strong> Continuous incentives, ecosystem growth</li>
                        <li>• <strong className="text-red-400">Con:</strong> Dilution if inflation outpaces demand</li>
                        <li>• Example: NEAR (~5% annual inflation, offset by burns)</li>
                      </ul>
                    </Card>
                  </div>
                </section>

                {/* Section 2: Distribution */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <BarChart className="w-5 h-5 text-blue-400" />
                    Token Distribution
                  </h4>
                  <p className="text-text-secondary mb-3">
                    How you distribute tokens signals your values. Community-heavy allocations build trust; insider-heavy ones raise red flags.
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 text-xs border border-border space-y-3">
                    <div className="text-blue-400 font-semibold mb-2">Typical Distribution Framework</div>
                    {[
                      { label: 'Community & Ecosystem', pct: '40-50%', color: 'text-emerald-400', desc: 'Airdrops, liquidity mining, grants, bounties' },
                      { label: 'Team & Advisors', pct: '15-20%', color: 'text-purple-400', desc: '3-4 year vesting with 1 year cliff' },
                      { label: 'Investors', pct: '15-20%', color: 'text-blue-400', desc: 'Seed, private, strategic rounds with vesting' },
                      { label: 'Treasury / DAO', pct: '10-15%', color: 'text-orange-400', desc: 'Protocol-controlled for future development' },
                      { label: 'Liquidity', pct: '5-10%', color: 'text-cyan-400', desc: 'DEX liquidity, market making, exchange listings' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className={cn('font-mono w-16 text-right', item.color)}>{item.pct}</span>
                        <div>
                          <span className="text-text-secondary font-semibold">{item.label}</span>
                          <span className="text-text-muted ml-2">— {item.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Section 3: Utility Design */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Repeat className="w-5 h-5 text-green-400" />
                    Token Utility Design
                  </h4>
                  <p className="text-text-secondary mb-3">
                    A token without utility is a meme. Real utility creates organic demand that survives bear markets.
                  </p>
                  <div className="space-y-3">
                    {[
                      { type: 'Governance', desc: 'Vote on protocol parameters, treasury allocation, feature priorities. Example: REF Finance governance.', strength: 'Medium' },
                      { type: 'Staking / Security', desc: 'Stake tokens to secure the network or protocol. Earn rewards for honest behavior. Example: NEAR staking (~5% APY).', strength: 'High' },
                      { type: 'Fee Payment', desc: 'Required to use the protocol — gas fees, transaction fees, listing fees. Creates constant buy pressure.', strength: 'High' },
                      { type: 'Access / Membership', desc: 'Token-gated features, premium tiers, exclusive content. Works well for social and content platforms.', strength: 'Medium' },
                      { type: 'Revenue Sharing', desc: 'Protocol revenue distributed to token stakers. Most sustainable model but has regulatory implications.', strength: 'Very High' },
                    ].map((item, i) => (
                      <Card key={i} variant="default" padding="md" className="border-green-500/20">
                        <div className="flex justify-between items-start mb-1">
                          <h5 className="font-semibold text-green-400 text-sm">{item.type}</h5>
                          <span className="text-xs text-text-muted">Demand strength: <span className="text-text-secondary">{item.strength}</span></span>
                        </div>
                        <p className="text-xs text-text-muted">{item.desc}</p>
                      </Card>
                    ))}
                  </div>
                </section>

                {/* Section 4: Vesting */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Lock className="w-5 h-5 text-red-400" />
                    Vesting &amp; Unlock Mechanics
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Vesting protects your community from insider dumps. Get it wrong and your token chart becomes a ski slope.
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-text-secondary border border-border">
                    <div className="text-red-400 mb-2">{'// Example vesting schedule'}</div>
                    <div className="text-near-green">{'Team (18%):      |====cliff====|----linear 36mo----|'}</div>
                    <div className="text-near-green">{'                 0            12                   48  months'}</div>
                    <div className="mt-2 text-near-green">{'Investors (17%): |==cliff==|----linear 24mo----|'}</div>
                    <div className="text-near-green">{'                 0         6                     30  months'}</div>
                    <div className="mt-2 text-near-green">{'Community (45%): |--gradual release over 48 months--|'}</div>
                    <div className="text-near-green">{'                 0                                 48  months'}</div>
                    <div className="mt-3 text-yellow-400">{'// ⚠️ Cliff = no tokens unlock until cliff date'}</div>
                    <div className="text-yellow-400">{'// After cliff, tokens unlock linearly (daily/monthly)'}</div>
                    <div className="text-yellow-400">{'// Watch for "cliff dump" — large unlocks can crash price'}</div>
                  </div>
                </section>

                {/* Section 5: NEAR Case Studies */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-cyan-400" />
                    NEAR Ecosystem Case Studies
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Learn from projects that shipped tokenomics on NEAR — what worked and what didn&apos;t:
                  </p>
                  <div className="space-y-3">
                    <Card variant="default" padding="md" className="border-cyan-500/20">
                      <h5 className="font-semibold text-cyan-400 text-sm mb-2">Ref Finance (REF)</h5>
                      <p className="text-xs text-text-muted">
                        NEAR&apos;s leading DEX. Fixed supply of 100M REF. Distribution: 60% community (farming rewards), 20% treasury, 12% team (4yr vesting), 8% strategic. <strong className="text-text-secondary">Key lesson:</strong> Heavy farming rewards drove early adoption but required careful emission reduction to prevent long-term dilution.
                      </p>
                    </Card>
                    <Card variant="default" padding="md" className="border-cyan-500/20">
                      <h5 className="font-semibold text-cyan-400 text-sm mb-2">Aurora (AURORA)</h5>
                      <p className="text-xs text-text-muted">
                        NEAR&apos;s EVM layer. 1B total supply. Introduced staking with governance + revenue sharing. <strong className="text-text-secondary">Key lesson:</strong> Revenue sharing created strong holding incentive. Stakers earn a share of bridge and transaction fees — real yield, not inflationary rewards.
                      </p>
                    </Card>
                    <Card variant="default" padding="md" className="border-cyan-500/20">
                      <h5 className="font-semibold text-cyan-400 text-sm mb-2">NEAR Protocol (NEAR)</h5>
                      <p className="text-xs text-text-muted">
                        1B initial supply, ~5% annual inflation for validator rewards. 70% of transaction fees burned, creating deflationary pressure as usage grows. <strong className="text-text-secondary">Key lesson:</strong> Inflation offset by burns is an elegant model — validators are incentivized, but growing usage reduces effective supply.
                      </p>
                    </Card>
                  </div>
                </section>
              </div>
            )}

            {selectedTab === 'practice' && (
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-text-primary">Exercises</h4>

                <Card variant="default" padding="md" className="border-purple-500/20">
                  <h5 className="font-semibold text-purple-400 text-sm mb-2">🟣 Exercise 1: Design Your Token Model</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Choose a supply model for your project. Define: total supply, inflation rate (if any), burn mechanics, and target circulating supply at 1, 2, and 5 years. Justify each choice.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-purple-500/20">
                  <h5 className="font-semibold text-purple-400 text-sm mb-2">🟣 Exercise 2: Allocation Spreadsheet</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Create a token allocation table with percentages for: community, team, investors, treasury, liquidity, and advisors. Include vesting schedule for each category. Model the circulating supply over 48 months.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-purple-500/20">
                  <h5 className="font-semibold text-purple-400 text-sm mb-2">🟣 Exercise 3: Utility Mapping</h5>
                  <p className="text-xs text-text-muted mb-3">
                    List every way your token creates demand. For each utility, estimate: frequency of use, volume of tokens needed, and whether it creates buy pressure, lock-up, or burns. Identify your strongest demand driver.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-purple-500/20">
                  <h5 className="font-semibold text-purple-400 text-sm mb-2">🟣 Exercise 4: Stress Test Your Tokenomics</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Model three scenarios: (1) Bull market — 10x users in 6 months, (2) Bear market — 80% user drop, (3) Whale dump — largest holder sells everything. How does your token economy survive each?
                  </p>
                </Card>
              </div>
            )}

            {selectedTab === 'resources' && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-text-primary">Resources</h4>
                {[
                  { title: 'NEAR Token Economics', url: 'https://near.org/blog/near-token-economics/', desc: 'How NEAR\'s own tokenomics work — inflation, burns, and staking' },
                  { title: 'Token Engineering Commons', url: 'https://tecommons.org/', desc: 'Community and tools for designing token economies' },
                  { title: 'Ref Finance Tokenomics', url: 'https://guide.ref.finance/tokenomics', desc: 'Deep dive into REF token distribution and utility' },
                  { title: 'Tokenomics 101 (a16z)', url: 'https://a16zcrypto.com/posts/article/tokenomics-101/', desc: 'Foundational framework for token economic design' },
                  { title: 'Machinations (Simulation Tool)', url: 'https://machinations.io/', desc: 'Visual tool for modeling token economies and game theory' },
                  { title: 'Token Unlocks', url: 'https://token.unlocks.app/', desc: 'Track vesting schedules and unlock events for major tokens' },
                  { title: 'Delphi Digital Tokenomics Reports', url: 'https://delphidigital.io/', desc: 'Research and case studies on token design from Delphi Digital' },
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

export default TokenomicsDesign;
