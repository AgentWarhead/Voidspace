'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, DollarSign, ExternalLink, CheckCircle, Target, FileText, TrendingUp, Users, Award } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

interface NearGrantsFundingProps {
  isActive: boolean;
  onToggle: () => void;
}

const NearGrantsFunding: React.FC<NearGrantsFundingProps> = ({ isActive, onToggle }) => {
  const [selectedTab, setSelectedTab] = useState<string>('overview');

  return (
    <Card variant="glass" padding="none" className="border-purple-500/20">
      <div
        onClick={onToggle}
        className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">NEAR Grants &amp; Funding</h3>
            <p className="text-text-muted text-sm">Navigate the NEAR funding landscape — grants, DAOs, accelerators, and VCs</p>
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
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                  <h4 className="text-lg font-semibold text-text-primary">What You&apos;ll Learn</h4>
                </div>
                <ul className="space-y-3">
                  {[
                    'The complete NEAR funding landscape — from $5K grants to $500K+ venture rounds',
                    'How to write a grant proposal that actually gets funded',
                    'Navigating NEAR ecosystem DAOs (DevHub, Marketing DAO, Creatives DAO)',
                    'Accelerator programs and how to prepare your application',
                    'Building relationships with NEAR-focused VCs and angel investors',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-text-secondary">
                      <CheckCircle className="w-4 h-4 text-near-green mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Card variant="default" padding="md" className="mt-4 border-emerald-500/20 bg-emerald-500/5">
                  <p className="text-sm text-text-secondary">
                    <span className="text-emerald-400 font-semibold">Why this matters:</span> Building on NEAR doesn&apos;t mean bootstrapping alone. The ecosystem has allocated hundreds of millions in funding for builders. Knowing where to apply — and how — can be the difference between a side project and a funded startup.
                  </p>
                </Card>
              </div>
            )}

            {selectedTab === 'learn' && (
              <div className="space-y-8">
                {/* Section 1: Funding Landscape */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Target className="w-5 h-5 text-emerald-400" />
                    The NEAR Funding Landscape
                  </h4>
                  <p className="text-text-secondary mb-3">
                    NEAR&apos;s funding ecosystem has multiple layers. Understanding which tier fits your project saves months of wasted effort.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card variant="default" padding="md" className="border-emerald-500/20">
                      <h5 className="font-semibold text-emerald-400 text-sm mb-2">Grants (Non-Dilutive)</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• <strong className="text-text-secondary">NEAR Foundation Grants:</strong> $5K–$200K for ecosystem projects</li>
                        <li>• <strong className="text-text-secondary">DevHub:</strong> Developer tooling, documentation, education</li>
                        <li>• <strong className="text-text-secondary">Marketing DAO:</strong> Community events, content, outreach</li>
                        <li>• <strong className="text-text-secondary">Creatives DAO:</strong> Art, NFTs, cultural projects</li>
                        <li>• No equity given up — pure ecosystem funding</li>
                      </ul>
                    </Card>
                    <Card variant="default" padding="md" className="border-cyan-500/20">
                      <h5 className="font-semibold text-cyan-400 text-sm mb-2">Venture &amp; Accelerators</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• <strong className="text-text-secondary">NEAR Horizon:</strong> Web3 accelerator with mentorship + funding</li>
                        <li>• <strong className="text-text-secondary">Proximity Labs:</strong> DeFi-focused grants and investments</li>
                        <li>• <strong className="text-text-secondary">MetaWeb Ventures:</strong> NEAR ecosystem VC fund</li>
                        <li>• <strong className="text-text-secondary">Dragonfly, Pantera:</strong> Tier-1 VCs active in NEAR</li>
                        <li>• Equity/token-based — choose wisely</li>
                      </ul>
                    </Card>
                  </div>
                </section>

                {/* Section 2: Grant Proposal Anatomy */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-400" />
                    Anatomy of a Winning Proposal
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Grant committees review hundreds of proposals. Here&apos;s what separates funded projects from rejected ones:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 text-xs text-text-secondary border border-border space-y-3">
                    <div>
                      <span className="text-emerald-400 font-semibold">1. Problem Statement (2-3 sentences)</span>
                      <p className="text-text-muted mt-1">&quot;NEAR developers lack a no-code tool for deploying token-gated communities. Current solutions require 40+ hours of custom development.&quot;</p>
                    </div>
                    <div>
                      <span className="text-emerald-400 font-semibold">2. Solution &amp; Differentiation</span>
                      <p className="text-text-muted mt-1">What you&apos;re building, why it&apos;s better than alternatives, and why NEAR is the right chain for it.</p>
                    </div>
                    <div>
                      <span className="text-emerald-400 font-semibold">3. Milestones &amp; Timeline</span>
                      <p className="text-text-muted mt-1">Break funding into 3-4 milestones with clear deliverables. &quot;Milestone 1 (Month 1-2): MVP with wallet login + token gating — $15K&quot;</p>
                    </div>
                    <div>
                      <span className="text-emerald-400 font-semibold">4. Team &amp; Track Record</span>
                      <p className="text-text-muted mt-1">GitHub profiles, previous projects, relevant experience. A working prototype beats a 50-page whitepaper.</p>
                    </div>
                    <div>
                      <span className="text-emerald-400 font-semibold">5. Budget Breakdown</span>
                      <p className="text-text-muted mt-1">Be specific: developer costs, infrastructure, audits, marketing. Vague budgets get rejected.</p>
                    </div>
                  </div>
                </section>

                {/* Section 3: Ecosystem DAOs */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-400" />
                    Ecosystem DAOs
                  </h4>
                  <p className="text-text-secondary mb-3">
                    NEAR&apos;s community-run DAOs fund specific verticals. Each has its own process and culture:
                  </p>
                  <div className="space-y-3">
                    {[
                      { name: 'NEAR DevHub', focus: 'Developer tooling, SDKs, education, documentation', amount: '$5K–$50K', tip: 'Show working code. DevHub loves prototypes over proposals.' },
                      { name: 'Marketing DAO', focus: 'Events, content creation, community building', amount: '$1K–$20K', tip: 'Quantify reach. How many developers/users will this attract to NEAR?' },
                      { name: 'Creatives DAO', focus: 'Art, music, NFT collections, cultural projects', amount: '$1K–$15K', tip: 'Portfolio matters. Show previous creative work and community engagement.' },
                    ].map((dao, i) => (
                      <Card key={i} variant="default" padding="md" className="border-purple-500/20">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-semibold text-purple-400 text-sm">{dao.name}</h5>
                          <span className="text-xs text-emerald-400 font-mono">{dao.amount}</span>
                        </div>
                        <p className="text-xs text-text-muted mb-1"><strong className="text-text-secondary">Focus:</strong> {dao.focus}</p>
                        <p className="text-xs text-text-muted"><strong className="text-yellow-400">Pro tip:</strong> {dao.tip}</p>
                      </Card>
                    ))}
                  </div>
                </section>

                {/* Section 4: Accelerators */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-orange-400" />
                    Accelerator Programs
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Accelerators offer more than money — mentorship, network, and credibility that open doors to larger rounds.
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 text-xs text-text-secondary border border-border space-y-3">
                    <div>
                      <span className="text-orange-400 font-semibold">NEAR Horizon</span>
                      <p className="text-text-muted mt-1">NEAR&apos;s native accelerator. Access to mentors, legal support, fundraising intros, and technical guidance. Apply with a working MVP and clear go-to-market strategy.</p>
                    </div>
                    <div>
                      <span className="text-orange-400 font-semibold">What Accelerators Look For</span>
                      <ul className="text-text-muted mt-1 space-y-1">
                        <li>• Working product (even if early) — not just an idea</li>
                        <li>• Founding team of 2-4 with complementary skills</li>
                        <li>• Clear market opportunity and target users</li>
                        <li>• Why blockchain? Why NEAR specifically?</li>
                        <li>• Traction signals: users, transactions, community engagement</li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Section 5: VC Fundraising */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Award className="w-5 h-5 text-yellow-400" />
                    Raising from VCs
                  </h4>
                  <p className="text-text-secondary mb-3">
                    When grants aren&apos;t enough, venture capital can fuel rapid growth. But it comes with trade-offs.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card variant="default" padding="md" className="border-green-500/20">
                      <h5 className="font-semibold text-green-400 text-sm mb-2">NEAR-Active VCs</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• <strong className="text-text-secondary">MetaWeb Ventures</strong> — NEAR ecosystem focused</li>
                        <li>• <strong className="text-text-secondary">Proximity Labs</strong> — DeFi on NEAR</li>
                        <li>• <strong className="text-text-secondary">Dragonfly Capital</strong> — Multi-chain, NEAR active</li>
                        <li>• <strong className="text-text-secondary">Pantera Capital</strong> — Early NEAR backer</li>
                        <li>• <strong className="text-text-secondary">Electric Capital</strong> — Developer ecosystem focus</li>
                      </ul>
                    </Card>
                    <Card variant="default" padding="md" className="border-red-500/20">
                      <h5 className="font-semibold text-red-400 text-sm mb-2">Common Pitfalls</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• Raising too much too early (dilution + expectations)</li>
                        <li>• Token warrants without clear vesting schedules</li>
                        <li>• Ignoring token vs equity structure implications</li>
                        <li>• No legal counsel for SAFE/SAFT agreements</li>
                        <li>• Chasing big names over value-add investors</li>
                      </ul>
                    </Card>
                  </div>
                </section>

                {/* Section 6: Funding Strategy */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Target className="w-5 h-5 text-cyan-400" />
                    Building Your Funding Strategy
                  </h4>
                  <p className="text-text-secondary mb-3">
                    The best founders layer their funding: start with grants, build traction, then raise venture when the timing is right.
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 text-xs border border-border space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-emerald-400 font-mono w-20">Phase 1</span>
                      <span className="text-text-secondary">Grants ($5K–$50K) → Build MVP, prove concept</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-blue-400 font-mono w-20">Phase 2</span>
                      <span className="text-text-secondary">Accelerator → Mentorship, network, small check ($50K–$150K)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-purple-400 font-mono w-20">Phase 3</span>
                      <span className="text-text-secondary">Pre-seed/Seed VC → Scale with traction proof ($250K–$2M)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-orange-400 font-mono w-20">Phase 4</span>
                      <span className="text-text-secondary">Token launch / Series A → Full-scale growth</span>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {selectedTab === 'practice' && (
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-text-primary">Exercises</h4>

                <Card variant="default" padding="md" className="border-emerald-500/20">
                  <h5 className="font-semibold text-emerald-400 text-sm mb-2">🟢 Exercise 1: Map Your Funding Path</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Create a funding roadmap for your project. Identify which grants, DAOs, and accelerators align with your project&apos;s stage and vertical. Include timeline, amounts, and what you&apos;ll deliver at each stage.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-emerald-500/20">
                  <h5 className="font-semibold text-emerald-400 text-sm mb-2">🟢 Exercise 2: Draft a Grant Proposal</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Write a complete NEAR Foundation grant proposal for your project. Include: problem statement, solution, 3 milestones with budget breakdown, team background, and success metrics. Keep it under 2 pages.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-emerald-500/20">
                  <h5 className="font-semibold text-emerald-400 text-sm mb-2">🟢 Exercise 3: DAO Funding Research</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Visit NEAR DevHub, Marketing DAO, and Creatives DAO forums. Study 3 funded proposals — note what they did well. Then identify which DAO is the best fit for your project and draft a forum post.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-emerald-500/20">
                  <h5 className="font-semibold text-emerald-400 text-sm mb-2">🟢 Exercise 4: Investor One-Pager</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Create a one-page investor brief: project name, problem, solution, market size, traction, team, and ask. This is what you&apos;d send a VC before a meeting. Practice making every sentence count.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-emerald-500/20">
                  <h5 className="font-semibold text-emerald-400 text-sm mb-2">🟢 Exercise 5: Budget Planning</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Build a 12-month budget for your project: team costs, infrastructure, marketing, legal, and reserves. Calculate your runway at different funding levels ($25K, $50K, $150K). How long can you operate?
                  </p>
                </Card>
              </div>
            )}

            {selectedTab === 'resources' && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-text-primary">Resources</h4>
                {[
                  { title: 'NEAR Ecosystem Funding', url: 'https://near.org/ecosystem/get-funding', desc: 'Official NEAR funding page with all active grant programs' },
                  { title: 'NEAR DevHub', url: 'https://neardevhub.org/', desc: 'Community-driven developer funding and governance' },
                  { title: 'NEAR Horizon', url: 'https://near.org/horizon', desc: 'NEAR\'s Web3 startup accelerator platform' },
                  { title: 'Proximity Labs', url: 'https://proximity.dev/', desc: 'DeFi-focused grants and investments on NEAR' },
                  { title: 'NEAR Foundation Blog', url: 'https://near.foundation/blog', desc: 'Latest funding announcements and ecosystem updates' },
                  { title: 'Web3 Fundraising Guide (a16z)', url: 'https://a16zcrypto.com/content/article/fundraising-guide-for-web3-founders/', desc: 'Comprehensive guide to Web3 fundraising from Andreessen Horowitz' },
                  { title: 'SAFE/SAFT Templates', url: 'https://www.ycombinator.com/documents', desc: 'Y Combinator\'s standard fundraising documents' },
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

export default NearGrantsFunding;
