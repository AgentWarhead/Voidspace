'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Rocket, ExternalLink, CheckCircle, Target, Zap, Users, TrendingUp, Gift } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

interface GoToMarketProps {
  isActive: boolean;
  onToggle: () => void;
}

const GoToMarket: React.FC<GoToMarketProps> = ({ isActive, onToggle }) => {
  const [selectedTab, setSelectedTab] = useState<string>('overview');

  return (
    <Card variant="glass" padding="none" className="border-purple-500/20">
      <div
        onClick={onToggle}
        className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
            <Rocket className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Go-to-Market Strategy</h3>
            <p className="text-text-muted text-sm">Launch strategies, user acquisition, growth hacking, and case studies from NEAR</p>
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
                  <Rocket className="w-5 h-5 text-green-400" />
                  <h4 className="text-lg font-semibold text-text-primary">What You&apos;ll Learn</h4>
                </div>
                <ul className="space-y-3">
                  {[
                    'dApp launch strategy — from pre-launch hype to sustained growth post-launch',
                    'User acquisition channels in Web3: airdrops, quests, referrals, and partnerships',
                    'Growth hacking techniques specific to crypto — what works and what\'s just noise',
                    'Building a waitlist and running effective beta programs for early traction',
                    'Case studies from successful NEAR project launches: what they did right',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-text-secondary">
                      <CheckCircle className="w-4 h-4 text-near-green mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Card variant="default" padding="md" className="mt-4 border-green-500/20 bg-green-500/5">
                  <p className="text-sm text-text-secondary">
                    <span className="text-green-400 font-semibold">Why this matters:</span> Building a great product isn&apos;t enough. Most dApps fail not because of bad tech, but because of bad distribution. Your go-to-market strategy determines whether anyone actually uses what you build.
                  </p>
                </Card>
              </div>
            )}

            {selectedTab === 'learn' && (
              <div className="space-y-8">
                {/* Section 1: Launch Strategy */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Target className="w-5 h-5 text-green-400" />
                    dApp Launch Strategy
                  </h4>
                  <p className="text-text-secondary mb-3">
                    A Web3 launch has unique dynamics — you&apos;re building hype, managing expectations, and often coordinating token events simultaneously.
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 text-xs border border-border space-y-3">
                    <div className="text-green-400 font-semibold mb-2">Launch Timeline</div>
                    {[
                      { phase: 'T-90 days', action: 'Brand & Narrative', details: 'Establish brand, publish vision, start building community on Discord/Telegram' },
                      { phase: 'T-60 days', action: 'Waitlist & Testnet', details: 'Launch waitlist, deploy to testnet, recruit beta testers from community' },
                      { phase: 'T-30 days', action: 'Pre-Launch Hype', details: 'KOL partnerships, X/Twitter campaign, teaser content, launch countdown' },
                      { phase: 'T-7 days', action: 'Final Push', details: 'Security audit results published, demo video, press outreach, community AMAs' },
                      { phase: 'Launch Day', action: 'Go Live', details: 'Mainnet deploy, initial liquidity, real-time community support war room' },
                      { phase: 'T+30 days', action: 'Retention Phase', details: 'Feature drops, community events, user feedback loops, growth campaigns' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className="text-green-400 font-mono w-20 text-right flex-shrink-0">{item.phase}</span>
                        <div className="flex-1">
                          <span className="text-text-secondary font-semibold">{item.action}</span>
                          <span className="text-text-muted ml-2">— {item.details}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Section 2: User Acquisition */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Users className="w-5 h-5 text-teal-400" />
                    User Acquisition in Web3
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Web3 user acquisition is fundamentally different from Web2. Wallets are your users, on-chain actions are your conversions.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card variant="default" padding="md" className="border-teal-500/20">
                      <h5 className="font-semibold text-teal-400 text-sm mb-2">High-Quality Channels</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• <strong className="text-text-secondary">Quest platforms:</strong> Galxe, Layer3, Zealy — gamified onboarding</li>
                        <li>• <strong className="text-text-secondary">Referral programs:</strong> On-chain referral tracking with rewards</li>
                        <li>• <strong className="text-text-secondary">Builder partnerships:</strong> Integrate with complementary dApps</li>
                        <li>• <strong className="text-text-secondary">Developer relations:</strong> Hackathons, grants, SDKs</li>
                      </ul>
                    </Card>
                    <Card variant="default" padding="md" className="border-orange-500/20">
                      <h5 className="font-semibold text-orange-400 text-sm mb-2">Channels to Use Carefully</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• <strong className="text-text-secondary">Airdrops:</strong> Great for awareness, but attracts farmers. Use sybil filters</li>
                        <li>• <strong className="text-text-secondary">Paid ads:</strong> Limited on X/Google for crypto. Focus on organic first</li>
                        <li>• <strong className="text-text-secondary">Exchange listings:</strong> Drives token volume, not necessarily product users</li>
                        <li>• <strong className="text-text-secondary">Influencer shills:</strong> Short-term spikes, poor retention. Vet carefully</li>
                      </ul>
                    </Card>
                  </div>
                </section>

                {/* Section 3: Growth Hacking */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    Crypto-Native Growth Hacking
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Growth in Web3 follows patterns that don&apos;t exist in Web2. Here are proven techniques:
                  </p>
                  <div className="space-y-3">
                    {[
                      { tactic: 'Points Programs', desc: 'Pre-token points systems that reward early users. Blur pioneered this — users earn points for activity, convertible to tokens later. Creates sustained engagement without immediate sell pressure.', example: 'Blur, EigenLayer, Hyperliquid' },
                      { tactic: 'NFT-Based Onboarding', desc: 'Free mint NFTs as entry tickets. Users claim an NFT to join your ecosystem, creating on-chain identity and FOMO for latecomers.', example: 'ShardDog on NEAR, Pudgy Penguins' },
                      { tactic: 'Composability Hooks', desc: 'Build on top of existing protocols so their users become yours. Integrate with popular DeFi protocols, wallets, and aggregators.', example: 'Ref Finance integrations on NEAR' },
                      { tactic: 'Gas Subsidies via Relayers', desc: 'NEAR\'s meta-transactions let you pay gas for users. Zero-friction onboarding — users don\'t need NEAR tokens to start.', example: 'NEAR meta-transactions, Fastauth' },
                    ].map((item, i) => (
                      <Card key={i} variant="default" padding="md" className="border-yellow-500/20">
                        <div className="flex justify-between items-start mb-1">
                          <h5 className="font-semibold text-yellow-400 text-sm">{item.tactic}</h5>
                          <span className="text-xs text-near-green font-mono">{item.example}</span>
                        </div>
                        <p className="text-xs text-text-muted">{item.desc}</p>
                      </Card>
                    ))}
                  </div>
                </section>

                {/* Section 4: Waitlist & Beta */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Gift className="w-5 h-5 text-purple-400" />
                    Waitlists &amp; Beta Programs
                  </h4>
                  <p className="text-text-secondary mb-3">
                    A waitlist isn&apos;t just a list — it&apos;s your first growth engine and feedback loop.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card variant="default" padding="md" className="border-purple-500/20">
                      <h5 className="font-semibold text-purple-400 text-sm mb-2">Waitlist Best Practices</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• <strong className="text-text-secondary">Connect wallet to join:</strong> Filters to real crypto users</li>
                        <li>• <strong className="text-text-secondary">Referral leaderboard:</strong> Move up by inviting friends</li>
                        <li>• <strong className="text-text-secondary">Weekly updates:</strong> Keep waitlisters engaged with dev progress</li>
                        <li>• <strong className="text-text-secondary">Early access tiers:</strong> Top referrers get first access</li>
                      </ul>
                    </Card>
                    <Card variant="default" padding="md" className="border-purple-500/20">
                      <h5 className="font-semibold text-purple-400 text-sm mb-2">Beta Program Structure</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• <strong className="text-text-secondary">Closed beta:</strong> 50-200 power users, high-touch feedback</li>
                        <li>• <strong className="text-text-secondary">Bug bounty:</strong> Reward beta testers who find issues</li>
                        <li>• <strong className="text-text-secondary">Feedback channels:</strong> Dedicated Discord channel + weekly surveys</li>
                        <li>• <strong className="text-text-secondary">OG rewards:</strong> Beta testers get special NFTs or early token allocation</li>
                      </ul>
                    </Card>
                  </div>
                </section>

                {/* Section 5: NEAR Case Studies */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-near-green" />
                    NEAR Launch Case Studies
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Real launches from the NEAR ecosystem — what worked and what we can learn:
                  </p>
                  <div className="space-y-3">
                    <Card variant="default" padding="md" className="border-near-green/20">
                      <h5 className="font-semibold text-near-green text-sm mb-2">Ref Finance</h5>
                      <p className="text-xs text-text-muted">
                        <strong className="text-text-secondary">Strategy:</strong> Launched as the first AMM DEX on NEAR with aggressive liquidity mining incentives. Partnered with Proximity Labs for initial liquidity. <strong className="text-text-secondary">Result:</strong> Became NEAR&apos;s leading DEX with millions in TVL. Key lesson: being first mover on a chain with strong ecosystem support creates lasting advantage.
                      </p>
                    </Card>
                    <Card variant="default" padding="md" className="border-near-green/20">
                      <h5 className="font-semibold text-near-green text-sm mb-2">Mintbase</h5>
                      <p className="text-xs text-text-muted">
                        <strong className="text-text-secondary">Strategy:</strong> Pivoted from Ethereum to NEAR for lower costs and better UX. Focused on developer tooling and infrastructure, not just a marketplace. <strong className="text-text-secondary">Result:</strong> Built the leading NFT infrastructure on NEAR. Key lesson: solving real developer pain points creates organic B2B growth.
                      </p>
                    </Card>
                    <Card variant="default" padding="md" className="border-near-green/20">
                      <h5 className="font-semibold text-near-green text-sm mb-2">NEAR.ai</h5>
                      <p className="text-xs text-text-muted">
                        <strong className="text-text-secondary">Strategy:</strong> Leveraged NEAR&apos;s chain abstraction narrative and AI + blockchain intersection. Built developer tools for AI agents interacting with NEAR Protocol. <strong className="text-text-secondary">Result:</strong> Captured the AI x crypto narrative with real infrastructure. Key lesson: timing your launch with a strong industry narrative amplifies reach.
                      </p>
                    </Card>
                  </div>
                </section>
              </div>
            )}

            {selectedTab === 'practice' && (
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-text-primary">Exercises</h4>

                <Card variant="default" padding="md" className="border-green-500/20">
                  <h5 className="font-semibold text-green-400 text-sm mb-2">🟢 Exercise 1: Launch Timeline</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Create a 90-day launch timeline for your dApp. Map every milestone: community setup, testnet deploy, beta program, marketing push, and mainnet launch. Include specific dates, owners, and dependencies.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-green-500/20">
                  <h5 className="font-semibold text-green-400 text-sm mb-2">🟢 Exercise 2: User Acquisition Funnel</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Map your user acquisition funnel: Awareness → Interest → Wallet Connect → First Transaction → Retention. For each stage, identify 2-3 channels and estimate conversion rates. What&apos;s your target CAC?
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-green-500/20">
                  <h5 className="font-semibold text-green-400 text-sm mb-2">🟢 Exercise 3: Quest Campaign Design</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Design a quest campaign on Galxe or Layer3: 5 tasks that onboard users to your dApp. Each task should teach one feature. Calculate the reward budget and expected user acquisition numbers.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-green-500/20">
                  <h5 className="font-semibold text-green-400 text-sm mb-2">🟢 Exercise 4: Referral Program</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Design an on-chain referral program: referral link structure, reward tiers (referrer + referee), anti-gaming measures, and smart contract logic. What percentage of new users should come from referrals?
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-green-500/20">
                  <h5 className="font-semibold text-green-400 text-sm mb-2">🟢 Exercise 5: Competitive Launch Analysis</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Analyze 3 successful dApp launches (on any chain). Document their timeline, channels, growth metrics, and what made them work. Apply 2-3 tactics to your own launch plan.
                  </p>
                </Card>
              </div>
            )}

            {selectedTab === 'resources' && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-text-primary">Resources</h4>
                {[
                  { title: 'Galxe', url: 'https://galxe.com/', desc: 'Leading Web3 quest and credential platform for user acquisition campaigns' },
                  { title: 'Layer3', url: 'https://layer3.xyz/', desc: 'Quest platform focused on education and onboarding — great for dApp discovery' },
                  { title: 'Zealy (formerly Crew3)', url: 'https://zealy.io/', desc: 'Community quest platform with leaderboards and XP systems' },
                  { title: 'NEAR FastAuth', url: 'https://near.org/fastauth', desc: 'Frictionless onboarding — email-based wallet creation for new users' },
                  { title: 'a16z Crypto GTM Guide', url: 'https://a16zcrypto.com/', desc: 'Go-to-market frameworks from Andreessen Horowitz for crypto startups' },
                  { title: 'Delphi Digital Research', url: 'https://delphidigital.io/', desc: 'In-depth research on crypto growth strategies and market trends' },
                  { title: 'NEAR Ecosystem Hub', url: 'https://near.org/ecosystem', desc: 'Discover NEAR ecosystem projects and partnership opportunities' },
                  { title: 'Product-Led Growth for Web3', url: 'https://www.lennysnewsletter.com/', desc: 'Lenny Rachitsky\'s newsletter — applicable growth frameworks for any product' },
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

export default GoToMarket;
