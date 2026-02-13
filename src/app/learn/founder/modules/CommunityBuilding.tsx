'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Users, ExternalLink, CheckCircle, MessageCircle, Shield, Heart, Award, Megaphone } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

interface CommunityBuildingProps {
  isActive: boolean;
  onToggle: () => void;
}

const CommunityBuilding: React.FC<CommunityBuildingProps> = ({ isActive, onToggle }) => {
  const [selectedTab, setSelectedTab] = useState<string>('overview');

  return (
    <Card variant="glass" padding="none" className="border-purple-500/20">
      <div
        onClick={onToggle}
        className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Community Building</h3>
            <p className="text-text-muted text-sm">Discord &amp; Telegram growth, ambassador programs, incentive design, and governance</p>
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
                  <Users className="w-5 h-5 text-blue-400" />
                  <h4 className="text-lg font-semibold text-text-primary">What You&apos;ll Learn</h4>
                </div>
                <ul className="space-y-3">
                  {[
                    'Discord and Telegram community growth strategies — from 0 to 10K engaged members',
                    'Ambassador and contributor programs that attract genuine builders, not airdrop farmers',
                    'Incentive design that drives participation without creating unsustainable token dumps',
                    'Community governance and moderation frameworks that scale with growth',
                    'Real examples from NEAR ecosystem communities: NEAR Crowd, ShardDog, and Proximity Labs',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-text-secondary">
                      <CheckCircle className="w-4 h-4 text-near-green mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Card variant="default" padding="md" className="mt-4 border-blue-500/20 bg-blue-500/5">
                  <p className="text-sm text-text-secondary">
                    <span className="text-blue-400 font-semibold">Why this matters:</span> In Web3, community IS your product&apos;s moat. Protocols with strong communities survive bear markets, attract developers, and create organic growth. No amount of marketing replaces an engaged community.
                  </p>
                </Card>
              </div>
            )}

            {selectedTab === 'learn' && (
              <div className="space-y-8">
                {/* Section 1: Platform Strategy */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-blue-400" />
                    Discord &amp; Telegram Growth Strategies
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Discord is your hub for builders and power users. Telegram is for broader community and announcements. Most successful NEAR projects run both.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card variant="default" padding="md" className="border-blue-500/20">
                      <h5 className="font-semibold text-blue-400 text-sm mb-2">Discord Best Practices</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• <strong className="text-text-secondary">Channel structure:</strong> Start with 5-7 channels max — #general, #announcements, #dev, #support, #governance</li>
                        <li>• <strong className="text-text-secondary">Onboarding flow:</strong> Verification + role selection. Collab.Land for token-gated access</li>
                        <li>• <strong className="text-text-secondary">Engagement hooks:</strong> Weekly AMAs, builder showcases, community calls</li>
                        <li>• <strong className="text-text-secondary">Bots:</strong> MEE6 for moderation, Combot for analytics, Guild.xyz for roles</li>
                      </ul>
                    </Card>
                    <Card variant="default" padding="md" className="border-cyan-500/20">
                      <h5 className="font-semibold text-cyan-400 text-sm mb-2">Telegram Best Practices</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• <strong className="text-text-secondary">Group vs Channel:</strong> Channel for announcements, Group for discussion</li>
                        <li>• <strong className="text-text-secondary">Anti-spam:</strong> Captcha bots, slow mode during hype events</li>
                        <li>• <strong className="text-text-secondary">Regional groups:</strong> Localized communities for non-English speakers</li>
                        <li>• <strong className="text-text-secondary">Mini-apps:</strong> Telegram bots for quick interactions and engagement</li>
                      </ul>
                    </Card>
                  </div>
                </section>

                {/* Section 2: Ambassador Programs */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Award className="w-5 h-5 text-purple-400" />
                    Ambassador &amp; Contributor Programs
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Ambassador programs scale your community efforts. The key is attracting genuine advocates, not mercenaries chasing tokens.
                  </p>
                  <div className="space-y-3">
                    {[
                      { tier: 'Contributor', desc: 'Entry level — content creation, translations, bug reports. Earn reputation points and small token rewards. Open application.', reward: '50-200 tokens/month' },
                      { tier: 'Ambassador', desc: 'Mid level — host community calls, write tutorials, represent at events. Curated selection based on contribution history.', reward: '500-1,500 tokens/month' },
                      { tier: 'Regional Lead', desc: 'Top level — manage local communities, coordinate events, mentor new ambassadors. Interview + track record required.', reward: '2,000-5,000 tokens/month' },
                    ].map((item, i) => (
                      <Card key={i} variant="default" padding="md" className="border-purple-500/20">
                        <div className="flex justify-between items-start mb-1">
                          <h5 className="font-semibold text-purple-400 text-sm">{item.tier}</h5>
                          <span className="text-xs text-near-green font-mono">{item.reward}</span>
                        </div>
                        <p className="text-xs text-text-muted">{item.desc}</p>
                      </Card>
                    ))}
                  </div>
                  <Card variant="default" padding="md" className="mt-4 border-yellow-500/20 bg-yellow-500/5">
                    <p className="text-sm text-text-secondary">
                      <span className="text-yellow-400 font-semibold">NEAR Example:</span> NEAR&apos;s own ambassador program (Community Fund DAO) funded hundreds of regional communities worldwide, with contributor guilds earning NEAR tokens for verified deliverables tracked through Astro DAO proposals.
                    </p>
                  </Card>
                </section>

                {/* Section 3: Incentive Design */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-pink-400" />
                    Incentive Design Without Token Dumps
                  </h4>
                  <p className="text-text-secondary mb-3">
                    The biggest risk in community incentives is creating mercenary behavior — people who farm and dump. Here&apos;s how to avoid it:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 text-xs border border-border space-y-3">
                    <div className="text-pink-400 font-semibold mb-2">Incentive Framework</div>
                    {[
                      { strategy: 'Vesting Schedules', desc: 'Token rewards vest over 6-12 months. Immediate sell pressure eliminated.', risk: 'Low' },
                      { strategy: 'Reputation Points (Non-Transferable)', desc: 'Soul-bound reputation that unlocks access. Can\'t be sold or gamed.', risk: 'Very Low' },
                      { strategy: 'Retroactive Rewards', desc: 'Reward past contributions, not future promises. Eliminates farming.', risk: 'Low' },
                      { strategy: 'Tiered Access', desc: 'Higher contribution = access to better opportunities (early features, governance).', risk: 'Low' },
                      { strategy: 'Quadratic Funding', desc: 'Match community donations quadratically. More supporters = more matching.', risk: 'Medium' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className={cn(
                          'font-mono w-16 text-right text-xs',
                          item.risk === 'Very Low' ? 'text-emerald-400' : item.risk === 'Low' ? 'text-green-400' : 'text-yellow-400'
                        )}>{item.risk} risk</span>
                        <div className="flex-1">
                          <span className="text-text-secondary font-semibold">{item.strategy}</span>
                          <span className="text-text-muted ml-2">— {item.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Section 4: Governance & Moderation */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-400" />
                    Community Governance &amp; Moderation
                  </h4>
                  <p className="text-text-secondary mb-3">
                    As your community grows, you need clear governance and moderation structures. The goal: empower members while preventing chaos.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card variant="default" padding="md" className="border-green-500/20">
                      <h5 className="font-semibold text-green-400 text-sm mb-2">Governance Framework</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• <strong className="text-text-secondary">Community proposals:</strong> Let members suggest features, partnerships, and changes</li>
                        <li>• <strong className="text-text-secondary">Voting mechanisms:</strong> Token-weighted, quadratic, or conviction voting via Astro DAO</li>
                        <li>• <strong className="text-text-secondary">Working groups:</strong> Delegate specific areas (marketing, dev, events) to elected leads</li>
                        <li>• <strong className="text-text-secondary">Transparency:</strong> Public treasury, open meeting notes, on-chain decisions</li>
                      </ul>
                    </Card>
                    <Card variant="default" padding="md" className="border-red-500/20">
                      <h5 className="font-semibold text-red-400 text-sm mb-2">Moderation Rules</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• <strong className="text-text-secondary">Code of conduct:</strong> Published, enforced, and accessible to all members</li>
                        <li>• <strong className="text-text-secondary">Mod team:</strong> 1 mod per 500-1K members, with clear escalation paths</li>
                        <li>• <strong className="text-text-secondary">Anti-scam:</strong> Block DM scams, flag impersonation, educate members</li>
                        <li>• <strong className="text-text-secondary">Progressive enforcement:</strong> Warning → mute → temp ban → permanent ban</li>
                      </ul>
                    </Card>
                  </div>
                </section>

                {/* Section 5: NEAR Ecosystem Examples */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Megaphone className="w-5 h-5 text-near-green" />
                    NEAR Community Case Studies
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Real examples from the NEAR ecosystem of effective community building:
                  </p>
                  <div className="space-y-3">
                    <Card variant="default" padding="md" className="border-near-green/20">
                      <h5 className="font-semibold text-near-green text-sm mb-2">ShardDog</h5>
                      <p className="text-xs text-text-muted">
                        <strong className="text-text-secondary">Strategy:</strong> Free NFT minting for community engagement. Built a loyal community through collectible NFTs tied to real NEAR ecosystem events and milestones. <strong className="text-text-secondary">Result:</strong> Thousands of engaged users minting and collecting, creating organic word-of-mouth growth with zero token incentives.
                      </p>
                    </Card>
                    <Card variant="default" padding="md" className="border-near-green/20">
                      <h5 className="font-semibold text-near-green text-sm mb-2">NEAR DevHub</h5>
                      <p className="text-xs text-text-muted">
                        <strong className="text-text-secondary">Strategy:</strong> Developer-focused community with funded working groups. Contributors earn through proposals approved by community moderators. <strong className="text-text-secondary">Result:</strong> Sustainable contributor ecosystem where developers fund their own projects through community governance on Astro DAO.
                      </p>
                    </Card>
                    <Card variant="default" padding="md" className="border-near-green/20">
                      <h5 className="font-semibold text-near-green text-sm mb-2">Ref Finance Community</h5>
                      <p className="text-xs text-text-muted">
                        <strong className="text-text-secondary">Strategy:</strong> Active governance via REF token holders. Community votes on fee structures, new pools, and protocol upgrades. Regular AMAs and transparent treasury reporting. <strong className="text-text-secondary">Result:</strong> High governance participation and community trust through open decision-making.
                      </p>
                    </Card>
                  </div>
                </section>
              </div>
            )}

            {selectedTab === 'practice' && (
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-text-primary">Exercises</h4>

                <Card variant="default" padding="md" className="border-blue-500/20">
                  <h5 className="font-semibold text-blue-400 text-sm mb-2">🔵 Exercise 1: Community Platform Setup</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Set up a Discord server for your project with: verification flow, 5-7 channels, role system, and at least 2 bots (moderation + analytics). Document your channel structure and why each channel exists.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-blue-500/20">
                  <h5 className="font-semibold text-blue-400 text-sm mb-2">🔵 Exercise 2: Ambassador Program Design</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Design a 3-tier ambassador program for your project. Define: application criteria, deliverables per tier, reward structure (with vesting), and KPIs for measuring ambassador effectiveness.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-blue-500/20">
                  <h5 className="font-semibold text-blue-400 text-sm mb-2">🔵 Exercise 3: Incentive Anti-Dump Analysis</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Take your planned token incentives and stress-test them: What happens if 80% of reward recipients sell immediately? Design vesting, lockups, or non-transferable rewards that maintain token health.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-blue-500/20">
                  <h5 className="font-semibold text-blue-400 text-sm mb-2">🔵 Exercise 4: Community Governance Charter</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Write a community governance charter: proposal process, voting mechanism, quorum requirements, and working group structure. Set up a test DAO on Astro DAO and submit your first proposal.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-blue-500/20">
                  <h5 className="font-semibold text-blue-400 text-sm mb-2">🔵 Exercise 5: 90-Day Community Growth Plan</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Create a 90-day community growth roadmap: Week 1-4 (foundation), Week 5-8 (growth), Week 9-12 (engagement). Set targets for members, daily active users, and governance participation at each milestone.
                  </p>
                </Card>
              </div>
            )}

            {selectedTab === 'resources' && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-text-primary">Resources</h4>
                {[
                  { title: 'Astro DAO', url: 'https://astrodao.com/', desc: 'NEAR-native DAO platform for community governance and treasury management' },
                  { title: 'Guild.xyz', url: 'https://guild.xyz/', desc: 'Token-gated community platform — roles based on on-chain activity' },
                  { title: 'Collab.Land', url: 'https://collab.land/', desc: 'Token-gated access for Discord and Telegram communities' },
                  { title: 'NEAR Community Fund DAO', url: 'https://near.org/ecosystem', desc: 'How NEAR funds community initiatives through decentralized governance' },
                  { title: 'Orbit Model (Community Growth)', url: 'https://orbit.love/', desc: 'Framework for measuring community engagement — love over reach' },
                  { title: 'Discord Community Best Practices', url: 'https://discord.com/community', desc: 'Official Discord guide for building and managing communities' },
                  { title: 'Bankless DAO Governance Manual', url: 'https://www.bankless.community/', desc: 'Real-world example of DAO governance at scale' },
                  { title: 'NEAR Governance Forum', url: 'https://gov.near.org/', desc: 'NEAR\'s governance forum — see how proposals and discussions work in practice' },
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

export default CommunityBuilding;
