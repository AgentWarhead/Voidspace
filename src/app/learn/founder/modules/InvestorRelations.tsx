'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Landmark, ExternalLink, CheckCircle, Search, Presentation, FileSignature, Calendar, Target } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

interface InvestorRelationsProps {
  isActive: boolean;
  onToggle: () => void;
}

const InvestorRelations: React.FC<InvestorRelationsProps> = ({ isActive, onToggle }) => {
  const [selectedTab, setSelectedTab] = useState<string>('overview');

  return (
    <Card variant="glass" padding="none" className="border-purple-500/20">
      <div
        onClick={onToggle}
        className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-indigo-500 rounded-xl flex items-center justify-center">
            <Landmark className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Investor Relations</h3>
            <p className="text-text-muted text-sm">VC landscape, pitch decks, term sheets, SAFE/SAFT, and fundraising strategy</p>
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
                  <Landmark className="w-5 h-5 text-violet-400" />
                  <h4 className="text-lg font-semibold text-text-primary">What You&apos;ll Learn</h4>
                </div>
                <ul className="space-y-3">
                  {[
                    'The crypto VC landscape — a16z, Paradigm, Dragonfly, and NEAR ecosystem funds',
                    'Preparing a pitch deck that crypto investors actually want to see',
                    'Term sheets and cap tables — understanding what you\'re signing',
                    'SAFE vs SAFT agreements — when to use each and key terms to negotiate',
                    'Fundraising timeline and milestones — from pre-seed to Series A in crypto',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-text-secondary">
                      <CheckCircle className="w-4 h-4 text-near-green mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Card variant="default" padding="md" className="mt-4 border-violet-500/20 bg-violet-500/5">
                  <p className="text-sm text-text-secondary">
                    <span className="text-violet-400 font-semibold">Why this matters:</span> Fundraising in crypto is fundamentally different from traditional startups. VCs move faster, check sizes are larger, and they evaluate tokenomics alongside equity. Understanding the landscape gives you a massive advantage at the negotiating table.
                  </p>
                </Card>
              </div>
            )}

            {selectedTab === 'learn' && (
              <div className="space-y-8">
                {/* Section 1: VC Landscape */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Search className="w-5 h-5 text-violet-400" />
                    The Crypto VC Landscape
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Crypto VCs operate differently from traditional VCs. They invest in tokens, not just equity. Understanding the tiers helps you target the right investors.
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 text-xs border border-border space-y-3">
                    <div className="text-violet-400 font-semibold mb-2">VC Tiers in Crypto</div>
                    {[
                      { tier: 'Tier 1 (Mega Funds)', firms: 'a16z Crypto, Paradigm, Polychain Capital', check: '$5M-50M+', focus: 'Infrastructure, L1/L2, DeFi blue chips' },
                      { tier: 'Tier 2 (Crypto-Native)', firms: 'Dragonfly, Multicoin, Framework, Delphi Ventures', check: '$1M-10M', focus: 'DeFi, infrastructure, consumer crypto' },
                      { tier: 'Tier 3 (Ecosystem Funds)', firms: 'Proximity Labs (NEAR), NEAR Foundation, MetaWeb', check: '$100K-2M', focus: 'NEAR ecosystem projects, early stage' },
                      { tier: 'Tier 4 (Angel/Syndicates)', firms: 'Individual angels, The LAO, Seed Club', check: '$25K-500K', focus: 'Pre-seed, idea stage, community-driven' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className="text-violet-400 font-mono w-20 text-right flex-shrink-0">{item.check}</span>
                        <div className="flex-1">
                          <span className="text-text-secondary font-semibold">{item.tier}</span>
                          <div className="text-text-muted">{item.firms}</div>
                          <div className="text-near-green text-[10px]">Focus: {item.focus}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Card variant="default" padding="md" className="mt-4 border-near-green/20 bg-near-green/5">
                    <p className="text-sm text-text-secondary">
                      <span className="text-near-green font-semibold">NEAR Ecosystem:</span> Proximity Labs is the primary ecosystem fund supporting NEAR builders. The NEAR Foundation provides grants. MetaWeb Ventures focuses on NEAR ecosystem investments. Start with ecosystem funds — they provide the most hands-on support.
                    </p>
                  </Card>
                </section>

                {/* Section 2: Pitch Deck */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Presentation className="w-5 h-5 text-blue-400" />
                    The Crypto Pitch Deck
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Crypto investors see hundreds of decks. Yours needs to stand out while covering the essentials in 15-20 slides.
                  </p>
                  <div className="space-y-3">
                    {[
                      { slide: 'Problem (1-2 slides)', desc: 'What\'s broken? Be specific. "DeFi is hard to use" is too vague. "88% of new DeFi users abandon after their first failed transaction" is compelling.' },
                      { slide: 'Solution (2-3 slides)', desc: 'Your product and how it solves the problem. Demo screenshot or video link. Show, don\'t tell.' },
                      { slide: 'Market (1-2 slides)', desc: 'TAM/SAM/SOM for your specific niche. Crypto VCs love bottom-up market sizing based on on-chain data.' },
                      { slide: 'Traction (2-3 slides)', desc: 'Users, TVL, revenue, growth rate. On-chain metrics are gold. Link to your public Dune dashboard.' },
                      { slide: 'Tokenomics (2-3 slides)', desc: 'Token utility, supply distribution, vesting schedules, value accrual mechanism. This is crypto-specific and crucial.' },
                      { slide: 'Team (1-2 slides)', desc: 'Founders\' crypto experience, previous exits, GitHub profiles. Anon founders need extra strong traction.' },
                      { slide: 'Ask & Use of Funds (1 slide)', desc: 'How much you\'re raising, at what valuation, and exactly how you\'ll spend it. Be specific — "40% engineering, 30% growth, 20% ops, 10% legal."' },
                    ].map((item, i) => (
                      <Card key={i} variant="default" padding="md" className="border-blue-500/20">
                        <h5 className="font-semibold text-blue-400 text-sm mb-1">{item.slide}</h5>
                        <p className="text-xs text-text-muted">{item.desc}</p>
                      </Card>
                    ))}
                  </div>
                </section>

                {/* Section 3: Term Sheets */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <FileSignature className="w-5 h-5 text-amber-400" />
                    Term Sheets &amp; Cap Tables
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Crypto term sheets are more complex because they often include both equity and token rights. Understanding the key terms protects you.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card variant="default" padding="md" className="border-amber-500/20">
                      <h5 className="font-semibold text-amber-400 text-sm mb-2">Key Terms to Negotiate</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• <strong className="text-text-secondary">Valuation:</strong> Pre-money vs post-money. Token warrants affect dilution</li>
                        <li>• <strong className="text-text-secondary">Token allocation:</strong> What % of tokens do investors get? (typically 10-20%)</li>
                        <li>• <strong className="text-text-secondary">Vesting:</strong> Investor token vesting (12mo cliff, 24-36mo linear is standard)</li>
                        <li>• <strong className="text-text-secondary">Liquidation preference:</strong> 1x non-participating is founder-friendly</li>
                        <li>• <strong className="text-text-secondary">Board seats:</strong> Resist giving board control at seed/pre-seed</li>
                      </ul>
                    </Card>
                    <Card variant="default" padding="md" className="border-amber-500/20">
                      <h5 className="font-semibold text-amber-400 text-sm mb-2">Cap Table Management</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• <strong className="text-text-secondary">Founders:</strong> Should retain 20-30% of tokens post-all-rounds</li>
                        <li>• <strong className="text-text-secondary">Team pool:</strong> Reserve 15-20% for future hires</li>
                        <li>• <strong className="text-text-secondary">Community/Ecosystem:</strong> 30-50% for airdrops, grants, and incentives</li>
                        <li>• <strong className="text-text-secondary">Investors (all rounds):</strong> Typically 15-25% total across all rounds</li>
                        <li>• <strong className="text-text-secondary">Treasury:</strong> 10-20% for protocol operations</li>
                      </ul>
                    </Card>
                  </div>
                </section>

                {/* Section 4: SAFE/SAFT */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Target className="w-5 h-5 text-green-400" />
                    SAFE vs SAFT Agreements
                  </h4>
                  <p className="text-text-secondary mb-3">
                    SAFEs and SAFTs are the most common investment instruments in crypto. They serve different purposes:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 text-xs border border-border space-y-4">
                    <div>
                      <div className="text-green-400 font-semibold mb-2">SAFE (Simple Agreement for Future Equity)</div>
                      <p className="text-text-muted mb-2">Converts to equity at a future priced round. Standard Y Combinator instrument. Use when you&apos;re raising for equity in your company (the legal entity), not for tokens directly.</p>
                      <div className="text-text-muted">
                        <strong className="text-text-secondary">Key terms:</strong> Valuation cap, discount rate, MFN clause. <strong className="text-text-secondary">When to use:</strong> Pre-seed/seed when token isn&apos;t live yet and you&apos;re raising for the company.
                      </div>
                    </div>
                    <div className="border-t border-border pt-4">
                      <div className="text-blue-400 font-semibold mb-2">SAFT (Simple Agreement for Future Tokens)</div>
                      <p className="text-text-muted mb-2">Investors receive rights to tokens at a future date (usually at token launch or network launch). Designed specifically for crypto projects. Must comply with securities regulations in your jurisdiction.</p>
                      <div className="text-text-muted">
                        <strong className="text-text-secondary">Key terms:</strong> Token price/discount, delivery date, lockup/vesting schedule, network launch conditions. <strong className="text-text-secondary">When to use:</strong> When investors want token exposure, not equity.
                      </div>
                    </div>
                    <div className="border-t border-border pt-4">
                      <div className="text-purple-400 font-semibold mb-2">SAFE + Token Warrant (Most Common)</div>
                      <p className="text-text-muted">
                        The hybrid approach: SAFE for equity in the company + a token warrant giving the right to purchase tokens at a discount when they launch. This is the most common structure in 2024-2025 crypto fundraising. Gives investors both equity upside and token exposure.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Section 5: Fundraising Timeline */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-cyan-400" />
                    Fundraising Timeline &amp; Milestones
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Crypto fundraising moves fast but still follows a progression. Here&apos;s the typical path:
                  </p>
                  <div className="space-y-3">
                    {[
                      { stage: 'Pre-Seed', raise: '$100K-500K', valuation: '$2M-5M', milestone: 'Idea + team + early prototype', timeline: '2-4 weeks', source: 'Angels, ecosystem funds, grants' },
                      { stage: 'Seed', raise: '$500K-3M', valuation: '$5M-15M', milestone: 'Working product + initial users + early traction', timeline: '4-8 weeks', source: 'Crypto-native VCs, ecosystem funds' },
                      { stage: 'Series A', raise: '$3M-15M', valuation: '$15M-50M', milestone: 'Product-market fit + growing metrics + revenue', timeline: '6-12 weeks', source: 'Tier 1-2 crypto VCs' },
                      { stage: 'Token Launch', raise: 'Varies', valuation: 'Market-determined', milestone: 'Decentralized protocol + strong community + real usage', timeline: '3-12 months post-Series A', source: 'Public market, launchpads' },
                    ].map((item, i) => (
                      <Card key={i} variant="default" padding="md" className="border-cyan-500/20">
                        <div className="flex justify-between items-start mb-1">
                          <h5 className="font-semibold text-cyan-400 text-sm">{item.stage}</h5>
                          <span className="text-xs text-near-green font-mono">{item.raise}</span>
                        </div>
                        <p className="text-xs text-text-muted">
                          <strong className="text-text-secondary">Valuation:</strong> {item.valuation} · <strong className="text-text-secondary">Timeline:</strong> {item.timeline} · <strong className="text-text-secondary">Source:</strong> {item.source}
                        </p>
                        <p className="text-xs text-text-muted mt-1"><strong className="text-text-secondary">Milestone needed:</strong> {item.milestone}</p>
                      </Card>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {selectedTab === 'practice' && (
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-text-primary">Exercises</h4>

                <Card variant="default" padding="md" className="border-violet-500/20">
                  <h5 className="font-semibold text-violet-400 text-sm mb-2">🟣 Exercise 1: Investor Target List</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Build a list of 20 potential investors for your project. Include: fund name, partner to contact, check size, portfolio overlap, thesis alignment, and warm intro path. Prioritize NEAR ecosystem funds first.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-violet-500/20">
                  <h5 className="font-semibold text-violet-400 text-sm mb-2">🟣 Exercise 2: Pitch Deck Draft</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Create a 15-slide pitch deck following the framework above. Include real traction data (even if early). Get feedback from 3 people — at least one crypto founder and one non-crypto person (for clarity testing).
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-violet-500/20">
                  <h5 className="font-semibold text-violet-400 text-sm mb-2">🟣 Exercise 3: Cap Table Model</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Build a cap table model showing token distribution across: founders, team, investors (seed + Series A), community, ecosystem, and treasury. Model the dilution across 3 fundraising rounds. What do founders retain after Series A?
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-violet-500/20">
                  <h5 className="font-semibold text-violet-400 text-sm mb-2">🟣 Exercise 4: SAFE/SAFT Comparison</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Read a real SAFE template (YC) and SAFT template (Cooley). List the key differences in a comparison table. For your project, decide which structure (or hybrid) makes sense and write a 1-page justification.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-violet-500/20">
                  <h5 className="font-semibold text-violet-400 text-sm mb-2">🟣 Exercise 5: Fundraising Roadmap</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Map your fundraising journey from now to 18 months out. Define milestones for each stage, target raise amounts, target valuations, and what you need to achieve before each raise. Include specific dates.
                  </p>
                </Card>
              </div>
            )}

            {selectedTab === 'resources' && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-text-primary">Resources</h4>
                {[
                  { title: 'Proximity Labs', url: 'https://proximity.dev/', desc: 'NEAR ecosystem fund supporting DeFi and infrastructure projects on NEAR' },
                  { title: 'NEAR Foundation Grants', url: 'https://near.org/ecosystem', desc: 'NEAR Foundation ecosystem page — grants and funding opportunities' },
                  { title: 'Y Combinator SAFE Templates', url: 'https://www.ycombinator.com/documents', desc: 'Standard SAFE agreement templates — the starting point for most early-stage fundraising' },
                  { title: 'SAFT Project (Cooley)', url: 'https://saftproject.com/', desc: 'SAFT agreement framework and templates for compliant token sales' },
                  { title: 'Crunchbase (Crypto VCs)', url: 'https://www.crunchbase.com/', desc: 'Research VC funds — portfolio companies, check sizes, and partner info' },
                  { title: 'Messari Fundraising Data', url: 'https://messari.io/research', desc: 'Crypto fundraising trends, round sizes, and valuation benchmarks' },
                  { title: 'Pitch Deck Examples (Crypto)', url: 'https://www.pitch.com/gallery', desc: 'Gallery of startup pitch decks including crypto projects for inspiration' },
                  { title: 'The Block (Funding Tracker)', url: 'https://www.theblock.co/data/crypto-markets/funding', desc: 'Real-time crypto funding data — see who\'s raising and at what valuations' },
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

export default InvestorRelations;
