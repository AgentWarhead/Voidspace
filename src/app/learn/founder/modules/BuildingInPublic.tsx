'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Megaphone, ExternalLink, CheckCircle, Users, Share2, MessageSquare, TrendingUp, Eye } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

interface BuildingInPublicProps {
  isActive: boolean;
  onToggle: () => void;
}

const BuildingInPublic: React.FC<BuildingInPublicProps> = ({ isActive, onToggle }) => {
  const [selectedTab, setSelectedTab] = useState<string>('overview');

  return (
    <Card variant="glass" padding="none" className="border-purple-500/20">
      <div
        onClick={onToggle}
        className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
            <Megaphone className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Building in Public</h3>
            <p className="text-text-muted text-sm">Grow your community by sharing your journey — devlogs, metrics, and transparent development</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-emerald-500/10 text-emerald-300 border-emerald-500/20">Founder</Badge>
          <Badge className="bg-purple-500/10 text-purple-300 border-purple-500/20">35 min</Badge>
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
                  <Megaphone className="w-5 h-5 text-orange-400" />
                  <h4 className="text-lg font-semibold text-text-primary">What You&apos;ll Learn</h4>
                </div>
                <ul className="space-y-3">
                  {[
                    'Why building in public is the most powerful growth strategy in Web3',
                    'Content frameworks that turn development updates into community engagement',
                    'Platform strategies — X/Twitter, NEAR Social, Discord, and dev blogs',
                    'Metrics transparency: sharing the right numbers without exposing vulnerabilities',
                    'Converting followers into contributors, users, and advocates',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-text-secondary">
                      <CheckCircle className="w-4 h-4 text-near-green mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Card variant="default" padding="md" className="mt-4 border-orange-500/20 bg-orange-500/5">
                  <p className="text-sm text-text-secondary">
                    <span className="text-orange-400 font-semibold">Why this matters:</span> In Web3, community IS your moat. The projects that win aren&apos;t just technically superior — they have passionate communities built through transparency and shared journey. Mintbase, Ref Finance, and Aurora all grew through public development.
                  </p>
                </Card>
              </div>
            )}

            {selectedTab === 'learn' && (
              <div className="space-y-8">
                {/* Section 1: Why Build in Public */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Eye className="w-5 h-5 text-orange-400" />
                    Why Build in Public?
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Building in public isn&apos;t just marketing — it&apos;s a founder superpower that compounds over time.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card variant="default" padding="md" className="border-orange-500/20">
                      <h5 className="font-semibold text-orange-400 text-sm mb-2">Benefits</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• <strong className="text-text-secondary">Trust:</strong> Transparency builds credibility in a space full of rugs</li>
                        <li>• <strong className="text-text-secondary">Feedback:</strong> Real-time user input shapes better products</li>
                        <li>• <strong className="text-text-secondary">Hiring:</strong> Talented devs want to join visible projects</li>
                        <li>• <strong className="text-text-secondary">Funding:</strong> VCs notice traction. Public building IS traction</li>
                        <li>• <strong className="text-text-secondary">Accountability:</strong> Public commitments drive follow-through</li>
                      </ul>
                    </Card>
                    <Card variant="default" padding="md" className="border-red-500/20">
                      <h5 className="font-semibold text-red-400 text-sm mb-2">Common Fears (Debunked)</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• <strong className="text-text-secondary">&quot;Competitors will copy me&quot;</strong> — Execution &gt; ideas. Always.</li>
                        <li>• <strong className="text-text-secondary">&quot;I&apos;ll look dumb&quot;</strong> — Vulnerability builds connection</li>
                        <li>• <strong className="text-text-secondary">&quot;It takes too much time&quot;</strong> — 15 min/day max. It compounds.</li>
                        <li>• <strong className="text-text-secondary">&quot;Nobody cares&quot;</strong> — Start at 0. Everyone does. Consistency wins.</li>
                        <li>• <strong className="text-text-secondary">&quot;I&apos;m not ready&quot;</strong> — You never will be. Start messy.</li>
                      </ul>
                    </Card>
                  </div>
                </section>

                {/* Section 2: Content Framework */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Share2 className="w-5 h-5 text-blue-400" />
                    The Build-in-Public Content Framework
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Not every update is interesting. Use this framework to create content people actually want to follow:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 text-xs border border-border space-y-3">
                    {[
                      { day: 'Monday', type: 'Weekly Goals', example: '"This week: ship token-gated access, fix the indexer bug, write docs for v2 API"', color: 'text-blue-400' },
                      { day: 'Tuesday-Thursday', type: 'Dev Updates', example: '"Just shipped chain signatures integration. Here\'s what I learned about MPC key derivation..."', color: 'text-green-400' },
                      { day: 'Wednesday', type: 'Metric Share', example: '"Week 4: 847 unique wallets, 12K transactions, $45K TVL. Up 32% from last week"', color: 'text-purple-400' },
                      { day: 'Friday', type: 'Weekly Recap + Learnings', example: '"Shipped 3/4 goals. The indexer is harder than expected. Here\'s the architecture decision we made..."', color: 'text-orange-400' },
                      { day: 'Anytime', type: 'Behind the Scenes', example: 'Screenshots, architecture diagrams, team discussions, failed experiments, celebrations', color: 'text-cyan-400' },
                    ].map((item, i) => (
                      <div key={i}>
                        <span className={cn('font-semibold', item.color)}>{item.day}: {item.type}</span>
                        <p className="text-text-muted mt-1 italic">{item.example}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Section 3: Platform Strategy */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-purple-400" />
                    Platform Strategy
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Different platforms serve different purposes. Don&apos;t try to be everywhere — pick 2-3 and go deep.
                  </p>
                  <div className="space-y-3">
                    {[
                      { platform: 'X / Twitter', purpose: 'Reach & discovery', strategy: 'Short updates, threads on learnings, engage with NEAR ecosystem accounts. Use #BUIDLonNEAR and #BuildInPublic hashtags.', priority: 'Essential' },
                      { platform: 'Discord / Telegram', purpose: 'Deep community', strategy: 'Create a server for your project. Share dev updates in a #building channel. This is where power users and contributors live.', priority: 'Essential' },
                      { platform: 'NEAR Social', purpose: 'On-chain presence', strategy: 'Native NEAR social platform. Post updates that live on-chain. Great for ecosystem visibility and signaling NEAR alignment.', priority: 'Recommended' },
                      { platform: 'Dev Blog / Mirror', purpose: 'Long-form depth', strategy: 'Technical deep-dives, architecture decisions, postmortems. These become reference material and SEO assets.', priority: 'Nice to have' },
                    ].map((item, i) => (
                      <Card key={i} variant="default" padding="md" className="border-purple-500/20">
                        <div className="flex justify-between items-start mb-1">
                          <h5 className="font-semibold text-purple-400 text-sm">{item.platform}</h5>
                          <span className={cn('text-xs font-mono', item.priority === 'Essential' ? 'text-emerald-400' : item.priority === 'Recommended' ? 'text-blue-400' : 'text-text-muted')}>{item.priority}</span>
                        </div>
                        <p className="text-xs text-text-muted"><strong className="text-text-secondary">{item.purpose}:</strong> {item.strategy}</p>
                      </Card>
                    ))}
                  </div>
                </section>

                {/* Section 4: Metrics Transparency */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    Metrics Transparency
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Sharing numbers builds trust — but be strategic about what you share and how:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card variant="default" padding="md" className="border-green-500/20">
                      <h5 className="font-semibold text-green-400 text-sm mb-2">✅ Share These</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• Unique active wallets / users (growth trends)</li>
                        <li>• Transaction volume (shows product-market fit)</li>
                        <li>• GitHub stars, PRs merged, contributors</li>
                        <li>• Community growth (Discord members, followers)</li>
                        <li>• Milestones hit (launches, partnerships, integrations)</li>
                      </ul>
                    </Card>
                    <Card variant="default" padding="md" className="border-red-500/20">
                      <h5 className="font-semibold text-red-400 text-sm mb-2">⚠️ Be Careful With</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• Exact revenue numbers (competitive intelligence)</li>
                        <li>• Security architecture details (attack surface)</li>
                        <li>• Fundraising specifics before closing</li>
                        <li>• Internal team conflicts or struggles</li>
                        <li>• Exact treasury holdings (whale target)</li>
                      </ul>
                    </Card>
                  </div>
                </section>

                {/* Section 5: Community Conversion */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Users className="w-5 h-5 text-cyan-400" />
                    Converting Followers → Contributors
                  </h4>
                  <p className="text-text-secondary mb-3">
                    The ultimate goal: turn passive followers into active community members who contribute to your project.
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 text-xs border border-border space-y-3">
                    <div>
                      <span className="text-cyan-400 font-semibold">The Engagement Funnel</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-text-muted font-mono w-24">Awareness</span>
                        <div className="flex-1 h-4 bg-cyan-500/20 rounded-full" />
                        <span className="text-text-muted w-32 text-right">Twitter follows, likes</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-text-muted font-mono w-24">Interest</span>
                        <div className="flex-1 h-4 bg-cyan-500/30 rounded-full max-w-[80%]" />
                        <span className="text-text-muted w-32 text-right">Joins Discord, reads blog</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-text-muted font-mono w-24">Trial</span>
                        <div className="flex-1 h-4 bg-cyan-500/40 rounded-full max-w-[50%]" />
                        <span className="text-text-muted w-32 text-right">Uses testnet, gives feedback</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-text-muted font-mono w-24">Adoption</span>
                        <div className="flex-1 h-4 bg-cyan-500/60 rounded-full max-w-[25%]" />
                        <span className="text-text-muted w-32 text-right">Active mainnet user</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-text-muted font-mono w-24">Advocate</span>
                        <div className="flex-1 h-4 bg-cyan-500 rounded-full max-w-[10%]" />
                        <span className="text-text-muted w-32 text-right">Contributes, evangelizes</span>
                      </div>
                    </div>
                    <p className="text-text-muted mt-2">Each stage needs specific content and calls-to-action. Don&apos;t ask for contributions from people who haven&apos;t even tried your product yet.</p>
                  </div>
                </section>
              </div>
            )}

            {selectedTab === 'practice' && (
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-text-primary">Exercises</h4>

                <Card variant="default" padding="md" className="border-orange-500/20">
                  <h5 className="font-semibold text-orange-400 text-sm mb-2">🟠 Exercise 1: Write Your First Build Update</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Write a Twitter/X thread (5-7 tweets) announcing your project and what you&apos;re building. Include: the problem, your approach, a screenshot or diagram, and a call-to-action. Post it. Today.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-orange-500/20">
                  <h5 className="font-semibold text-orange-400 text-sm mb-2">🟠 Exercise 2: Create a Content Calendar</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Plan 2 weeks of build-in-public content using the framework above. Include: platform, content type, and key message for each post. Aim for 4-5 posts per week across your chosen platforms.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-orange-500/20">
                  <h5 className="font-semibold text-orange-400 text-sm mb-2">🟠 Exercise 3: Set Up Your Public Dashboard</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Create a public metrics page or pinned tweet with your project&apos;s key numbers. Update it weekly. Include: users, transactions, TVL (if applicable), GitHub activity, and community size.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-orange-500/20">
                  <h5 className="font-semibold text-orange-400 text-sm mb-2">🟠 Exercise 4: Write a Postmortem</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Pick a mistake or failed experiment from your project. Write a transparent postmortem: what happened, why, what you learned, and what changed. Vulnerability builds the strongest communities.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-orange-500/20">
                  <h5 className="font-semibold text-orange-400 text-sm mb-2">🟠 Exercise 5: Engage the Ecosystem</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Spend 30 minutes engaging with other NEAR builders on Twitter and Discord. Reply to their updates, share their wins, ask genuine questions. Build relationships before you need them.
                  </p>
                </Card>
              </div>
            )}

            {selectedTab === 'resources' && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-text-primary">Resources</h4>
                {[
                  { title: 'NEAR Social', url: 'https://near.social/', desc: 'NEAR\'s on-chain social platform — post updates that live on the blockchain' },
                  { title: 'Build in Public Guide (KP)', url: 'https://www.buildinpublic.xyz/', desc: 'Comprehensive guide and community for building in public' },
                  { title: 'NEAR Developer Twitter List', url: 'https://twitter.com/i/lists/1590722489562251265', desc: 'Curated list of NEAR developers and projects building in public' },
                  { title: 'Mirror.xyz', url: 'https://mirror.xyz/', desc: 'Web3-native publishing platform for long-form dev blogs and updates' },
                  { title: 'Ship 30 for 30', url: 'https://www.ship30for30.com/', desc: 'Framework for consistent writing and building an audience' },
                  { title: 'NEAR Community Discord', url: 'https://near.chat/', desc: 'Official NEAR Discord — share your project and get feedback' },
                  { title: 'Mintbase Build Story', url: 'https://mintbase.xyz/', desc: 'How Mintbase built a thriving NFT infrastructure through public development' },
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

export default BuildingInPublic;
