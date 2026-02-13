'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Megaphone, ExternalLink, CheckCircle, Pen, UserCheck, Gift, Twitter, Handshake } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

interface MarketingForWeb3Props {
  isActive: boolean;
  onToggle: () => void;
}

const MarketingForWeb3: React.FC<MarketingForWeb3Props> = ({ isActive, onToggle }) => {
  const [selectedTab, setSelectedTab] = useState<string>('overview');

  return (
    <Card variant="glass" padding="none" className="border-purple-500/20">
      <div
        onClick={onToggle}
        className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center">
            <Megaphone className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Marketing for Web3</h3>
            <p className="text-text-muted text-sm">Content strategy, KOL partnerships, airdrop marketing, X/Twitter, and co-marketing</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-emerald-300 border-emerald-500/20 shadow-sm shadow-emerald-500/10">Founder</Badge>
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
                  <Megaphone className="w-5 h-5 text-pink-400" />
                  <h4 className="text-lg font-semibold text-text-primary">What You&apos;ll Learn</h4>
                </div>
                <ul className="space-y-3">
                  {[
                    'Content strategy for crypto projects — what to post, how often, and where',
                    'KOL (Key Opinion Leader) partnerships — finding, vetting, and working with influencers',
                    'Airdrop marketing and quest platforms: Galxe, Layer3, and Zealy campaigns',
                    'Twitter/X strategy for builders — building a founder brand in crypto',
                    'Partnership playbooks and co-marketing tactics that create mutual growth',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-text-secondary">
                      <CheckCircle className="w-4 h-4 text-near-green mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Card variant="default" padding="md" className="mt-4 border-pink-500/20 bg-pink-500/5">
                  <p className="text-sm text-text-secondary">
                    <span className="text-pink-400 font-semibold">Why this matters:</span> Web3 marketing is a different beast. Traditional playbooks don&apos;t work. Paid ads are restricted, audiences are skeptical, and attention is the scarcest resource. This module teaches what actually works in crypto marketing.
                  </p>
                </Card>
              </div>
            )}

            {selectedTab === 'learn' && (
              <div className="space-y-8">
                {/* Section 1: Content Strategy */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Pen className="w-5 h-5 text-pink-400" />
                    Content Strategy for Crypto Projects
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Content is king in crypto. Your content educates, builds trust, and drives organic discovery. Here&apos;s how to do it right:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 text-xs border border-border space-y-3">
                    <div className="text-pink-400 font-semibold mb-2">Content Pillars Framework</div>
                    {[
                      { pillar: 'Educational', ratio: '40%', examples: 'Tutorials, explainers, how-to threads, technical deep dives', goal: 'Build authority and SEO' },
                      { pillar: 'Product Updates', ratio: '25%', examples: 'Launch announcements, feature reveals, roadmap updates, changelogs', goal: 'Drive feature adoption' },
                      { pillar: 'Community & Culture', ratio: '20%', examples: 'Memes, community highlights, team intros, behind-the-scenes', goal: 'Build brand affinity' },
                      { pillar: 'Industry Commentary', ratio: '15%', examples: 'Market analysis, competitor comparison, trend takes', goal: 'Thought leadership' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className="text-pink-400 font-mono w-8 text-right flex-shrink-0">{item.ratio}</span>
                        <div className="flex-1">
                          <span className="text-text-secondary font-semibold">{item.pillar}</span>
                          <span className="text-text-muted ml-2">— {item.examples}</span>
                          <div className="text-near-green text-[10px] mt-0.5">Goal: {item.goal}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Card variant="default" padding="md" className="mt-4 border-yellow-500/20 bg-yellow-500/5">
                    <p className="text-sm text-text-secondary">
                      <span className="text-yellow-400 font-semibold">Pro tip:</span> Write long-form content on Mirror.xyz — it&apos;s the Medium of Web3. Content is stored on Arweave (permanent), and you can mint articles as NFTs. Great for building a content moat.
                    </p>
                  </Card>
                </section>

                {/* Section 2: KOL Partnerships */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-purple-400" />
                    KOL (Key Opinion Leader) Partnerships
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Influencer marketing is the most powerful (and most dangerous) tool in Web3 marketing. Here&apos;s how to use it wisely:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card variant="default" padding="md" className="border-purple-500/20">
                      <h5 className="font-semibold text-purple-400 text-sm mb-2">KOL Tiers</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• <strong className="text-text-secondary">Nano (1K-10K):</strong> $100-500/post. Highly engaged, niche audiences. Best ROI</li>
                        <li>• <strong className="text-text-secondary">Micro (10K-50K):</strong> $500-2K/post. Good reach with still-engaged followers</li>
                        <li>• <strong className="text-text-secondary">Mid (50K-200K):</strong> $2K-10K/post. Broad reach, decent engagement</li>
                        <li>• <strong className="text-text-secondary">Macro (200K+):</strong> $10K-50K+/post. Maximum reach, often lower engagement</li>
                      </ul>
                    </Card>
                    <Card variant="default" padding="md" className="border-red-500/20">
                      <h5 className="font-semibold text-red-400 text-sm mb-2">KOL Red Flags</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• Fake engagement (check reply quality, not just likes)</li>
                        <li>• Promotes every project — no selectivity = no credibility</li>
                        <li>• Demands payment in your token + immediate listing</li>
                        <li>• History of promoting rugs or scams (check their timeline)</li>
                        <li>• Won&apos;t disclose sponsorship (violates FTC guidelines)</li>
                      </ul>
                    </Card>
                  </div>
                </section>

                {/* Section 3: Airdrop Marketing */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Gift className="w-5 h-5 text-emerald-400" />
                    Airdrop Marketing &amp; Quest Platforms
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Quests and airdrops gamify user acquisition. When designed well, they educate users while onboarding them to your product.
                  </p>
                  <div className="space-y-3">
                    {[
                      { platform: 'Galxe', desc: 'The largest Web3 quest platform. Create campaigns with on-chain and off-chain tasks. Users earn OATs (on-chain achievement tokens). Best for broad reach and complex multi-step campaigns.', strength: 'Largest user base, cross-chain' },
                      { platform: 'Layer3', desc: 'Education-focused quests. Users learn about your protocol by completing interactive tasks. Better for quality over quantity — users actually understand your product after completing quests.', strength: 'Higher quality users, educational' },
                      { platform: 'Zealy', desc: 'Community-focused quest platform (formerly Crew3). Combines social tasks (Twitter, Discord) with on-chain tasks. Leaderboard system drives competition. Good for community building.', strength: 'Community engagement, leaderboards' },
                    ].map((item, i) => (
                      <Card key={i} variant="default" padding="md" className="border-emerald-500/20">
                        <div className="flex justify-between items-start mb-1">
                          <h5 className="font-semibold text-emerald-400 text-sm">{item.platform}</h5>
                          <span className="text-xs text-near-green font-mono">{item.strength}</span>
                        </div>
                        <p className="text-xs text-text-muted">{item.desc}</p>
                      </Card>
                    ))}
                  </div>
                </section>

                {/* Section 4: Twitter/X Strategy */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Twitter className="w-5 h-5 text-blue-400" />
                    Twitter/X Strategy for Builders
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Crypto Twitter (CT) is where attention lives. Your project and founder accounts need a deliberate strategy:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 text-xs border border-border space-y-3">
                    <div className="text-blue-400 font-semibold mb-2">X/Twitter Playbook</div>
                    {[
                      { tactic: 'Posting frequency', detail: '2-3x/day for project account, 1-2x/day for founder. Consistency > virality.' },
                      { tactic: 'Thread game', detail: 'Weekly educational threads (5-10 tweets). Share alpha, tutorials, or analysis. Threads get 3-5x more engagement than single tweets.' },
                      { tactic: 'Engagement before promotion', detail: 'Reply to 20+ tweets/day in your niche BEFORE posting. Build relationships with other founders, VCs, and thought leaders.' },
                      { tactic: 'Build in public', detail: 'Share progress updates, challenges, and milestones. Vulnerability builds trust. "We hit a bug today…" outperforms "We\'re crushing it."' },
                      { tactic: 'Spaces & live content', detail: 'Host weekly Twitter Spaces on relevant topics. Co-host with partners. Live content builds deeper connection than tweets.' },
                      { tactic: 'Visual content', detail: 'Infographics, charts, and product demos get 2x+ engagement. Use Canva or Figma for quick graphics.' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className="text-blue-400">•</span>
                        <div className="flex-1">
                          <span className="text-text-secondary font-semibold">{item.tactic}:</span>
                          <span className="text-text-muted ml-1">{item.detail}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Section 5: Partnerships */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Handshake className="w-5 h-5 text-teal-400" />
                    Partnership Playbooks &amp; Co-Marketing
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Strategic partnerships amplify your reach exponentially. Every partnership should benefit both sides.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card variant="default" padding="md" className="border-teal-500/20">
                      <h5 className="font-semibold text-teal-400 text-sm mb-2">Partnership Types</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• <strong className="text-text-secondary">Integration partners:</strong> Technical integrations (cross-list, composability)</li>
                        <li>• <strong className="text-text-secondary">Co-marketing:</strong> Joint content, AMAs, and campaigns</li>
                        <li>• <strong className="text-text-secondary">Ecosystem grants:</strong> NEAR Foundation, Proximity Labs partnerships</li>
                        <li>• <strong className="text-text-secondary">Liquidity partners:</strong> Shared liquidity pools and incentive programs</li>
                      </ul>
                    </Card>
                    <Card variant="default" padding="md" className="border-teal-500/20">
                      <h5 className="font-semibold text-teal-400 text-sm mb-2">Co-Marketing Tactics</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• <strong className="text-text-secondary">Joint Twitter Spaces:</strong> Share audiences with complementary projects</li>
                        <li>• <strong className="text-text-secondary">Co-authored content:</strong> Blog posts and threads featuring both projects</li>
                        <li>• <strong className="text-text-secondary">Shared quest campaigns:</strong> Galxe/Layer3 quests that involve both protocols</li>
                        <li>• <strong className="text-text-secondary">Cross-community events:</strong> Joint AMAs, hackathons, and contests</li>
                      </ul>
                    </Card>
                  </div>
                </section>
              </div>
            )}

            {selectedTab === 'practice' && (
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-text-primary">Exercises</h4>

                <Card variant="default" padding="md" className="border-pink-500/20">
                  <h5 className="font-semibold text-pink-400 text-sm mb-2">🩷 Exercise 1: Content Calendar</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Create a 4-week content calendar for your project. Plan 3 posts/day across X and Discord. Follow the content pillars framework (40% educational, 25% product, 20% community, 15% commentary). Include one weekly thread.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-pink-500/20">
                  <h5 className="font-semibold text-pink-400 text-sm mb-2">🩷 Exercise 2: KOL Outreach Plan</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Identify 10 KOLs relevant to your project (mix of nano, micro, and mid-tier). For each, document: follower count, engagement rate, content style, estimated cost, and why they&apos;re a good fit. Draft an outreach DM template.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-pink-500/20">
                  <h5 className="font-semibold text-pink-400 text-sm mb-2">🩷 Exercise 3: Quest Campaign Design</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Design a Galxe or Layer3 quest campaign with 5-7 tasks. Each task should teach users one feature of your dApp. Define rewards, budget, expected participants, and success metrics (retention after quest completion).
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-pink-500/20">
                  <h5 className="font-semibold text-pink-400 text-sm mb-2">🩷 Exercise 4: Founder Brand Build</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Audit your personal X/Twitter presence. Post 1x/day for 2 weeks following the builder playbook. Track impressions, engagement, and follower growth. Write a thread about a lesson learned building your project.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-pink-500/20">
                  <h5 className="font-semibold text-pink-400 text-sm mb-2">🩷 Exercise 5: Partnership Pitch</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Identify 3 complementary NEAR ecosystem projects. Draft a partnership proposal for each: what you offer, what you need, joint campaign idea, and expected outcomes for both sides. Send at least one.
                  </p>
                </Card>
              </div>
            )}

            {selectedTab === 'resources' && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-text-primary">Resources</h4>
                {[
                  { title: 'Mirror.xyz', url: 'https://mirror.xyz/', desc: 'Web3-native publishing platform — write content stored permanently on Arweave' },
                  { title: 'Galxe', url: 'https://galxe.com/', desc: 'Largest Web3 quest platform — create on-chain campaigns for user acquisition' },
                  { title: 'Layer3', url: 'https://layer3.xyz/', desc: 'Education-focused quest platform — onboard users while teaching them' },
                  { title: 'Zealy', url: 'https://zealy.io/', desc: 'Community quest platform with leaderboards and gamification' },
                  { title: 'Typefully', url: 'https://typefully.com/', desc: 'Twitter/X scheduling and analytics — essential for consistent posting' },
                  { title: 'LunarCrush', url: 'https://lunarcrush.com/', desc: 'Social media analytics for crypto — track sentiment and influence' },
                  { title: 'Crypto Marketing Guide (Web3 Academy)', url: 'https://www.web3academy.com/', desc: 'Comprehensive Web3 marketing education and community' },
                  { title: 'NEAR Marketing DAO (Archive)', url: 'https://gov.near.org/', desc: 'Historical examples of NEAR ecosystem marketing proposals and campaigns' },
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

export default MarketingForWeb3;
