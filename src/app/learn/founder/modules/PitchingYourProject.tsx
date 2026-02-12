'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Rocket, ExternalLink, CheckCircle, Presentation, Target, MessageCircle, Lightbulb, Zap } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

interface PitchingYourProjectProps {
  isActive: boolean;
  onToggle: () => void;
}

const PitchingYourProject: React.FC<PitchingYourProjectProps> = ({ isActive, onToggle }) => {
  const [selectedTab, setSelectedTab] = useState<string>('overview');

  return (
    <Card variant="glass" padding="none" className="border-purple-500/20">
      <div
        onClick={onToggle}
        className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
            <Rocket className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Pitching Your Project</h3>
            <p className="text-text-muted text-sm">Craft compelling pitches — from elevator talks to investor decks and hackathon demos</p>
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
                  <Rocket className="w-5 h-5 text-blue-400" />
                  <h4 className="text-lg font-semibold text-text-primary">What You&apos;ll Learn</h4>
                </div>
                <ul className="space-y-3">
                  {[
                    'The anatomy of a pitch that lands — structure, story, and delivery',
                    'Building a pitch deck that VCs and grant committees actually read',
                    'Elevator pitches: how to explain your project in 30 seconds, 2 minutes, or 10 minutes',
                    'Demo day and hackathon presentation techniques that win prizes',
                    'Handling tough questions from investors and technical evaluators',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-text-secondary">
                      <CheckCircle className="w-4 h-4 text-near-green mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Card variant="default" padding="md" className="mt-4 border-blue-500/20 bg-blue-500/5">
                  <p className="text-sm text-text-secondary">
                    <span className="text-blue-400 font-semibold">Why this matters:</span> You can build the best protocol on NEAR, but if you can&apos;t explain why it matters in 2 minutes, nobody will fund it, use it, or contribute to it. Pitching isn&apos;t a nice-to-have — it&apos;s survival.
                  </p>
                </Card>
              </div>
            )}

            {selectedTab === 'learn' && (
              <div className="space-y-8">
                {/* Section 1: Elevator Pitch */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    The 30-Second Elevator Pitch
                  </h4>
                  <p className="text-text-secondary mb-3">
                    You meet a VC at a NEAR conference. They ask &quot;What are you building?&quot; You have 30 seconds. Go.
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 text-xs border border-border space-y-3">
                    <div className="text-yellow-400 font-semibold mb-2">The Formula: Problem → Solution → Why Now → Ask</div>
                    <div className="space-y-2">
                      <div>
                        <span className="text-emerald-400 font-semibold">1. Hook (5 sec):</span>
                        <span className="text-text-muted ml-2">&quot;90% of NFT projects die because creators can&apos;t monetize after the mint.&quot;</span>
                      </div>
                      <div>
                        <span className="text-blue-400 font-semibold">2. Solution (10 sec):</span>
                        <span className="text-text-muted ml-2">&quot;We&apos;re building subscription NFTs on NEAR — holders get ongoing content, and creators earn recurring revenue.&quot;</span>
                      </div>
                      <div>
                        <span className="text-purple-400 font-semibold">3. Traction (10 sec):</span>
                        <span className="text-text-muted ml-2">&quot;We have 200 creators on testnet and $12K MRR in our beta.&quot;</span>
                      </div>
                      <div>
                        <span className="text-orange-400 font-semibold">4. Ask (5 sec):</span>
                        <span className="text-text-muted ml-2">&quot;We&apos;re raising $500K to launch on mainnet. Can I send you our deck?&quot;</span>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section 2: Pitch Deck Structure */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Presentation className="w-5 h-5 text-blue-400" />
                    The 10-Slide Pitch Deck
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Investors see hundreds of decks. Yours needs to be clear, compelling, and under 15 slides. Here&apos;s the proven structure:
                  </p>
                  <div className="space-y-2">
                    {[
                      { num: '01', title: 'Title Slide', desc: 'Project name, one-liner, your name. Clean logo. That\'s it.', color: 'text-blue-400' },
                      { num: '02', title: 'Problem', desc: 'What\'s broken? Use data. "X million users face Y problem, costing Z dollars."', color: 'text-red-400' },
                      { num: '03', title: 'Solution', desc: 'Your product in 2-3 sentences + a screenshot or mockup. Show, don\'t tell.', color: 'text-emerald-400' },
                      { num: '04', title: 'How It Works', desc: 'Simple diagram. User flow. No jargon. A non-crypto person should get it.', color: 'text-purple-400' },
                      { num: '05', title: 'Market Size', desc: 'TAM/SAM/SOM. Be honest. "$500B NFT market" is lazy. What\'s YOUR market?', color: 'text-orange-400' },
                      { num: '06', title: 'Traction', desc: 'Users, revenue, transactions, partnerships. The "why now" slide. Show momentum.', color: 'text-cyan-400' },
                      { num: '07', title: 'Business Model', desc: 'How you make money. Protocol fees, subscriptions, token value capture.', color: 'text-yellow-400' },
                      { num: '08', title: 'Team', desc: 'Founders + key hires. Relevant experience. GitHub profiles. Why YOU can build this.', color: 'text-pink-400' },
                      { num: '09', title: 'Competitive Landscape', desc: '2x2 matrix or comparison table. Show your unique position. Be honest about competition.', color: 'text-indigo-400' },
                      { num: '10', title: 'The Ask', desc: 'How much, what for, what milestones it enables. "Raising $X to achieve Y by Z date."', color: 'text-emerald-400' },
                    ].map((slide, i) => (
                      <div key={i} className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/[0.02]">
                        <span className={cn('font-mono text-sm w-6 flex-shrink-0', slide.color)}>{slide.num}</span>
                        <div>
                          <span className="text-text-secondary text-sm font-semibold">{slide.title}</span>
                          <span className="text-text-muted text-xs ml-2">— {slide.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Section 3: Storytelling */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-green-400" />
                    Storytelling for Founders
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Data informs. Stories persuade. The best pitches weave both together.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card variant="default" padding="md" className="border-green-500/20">
                      <h5 className="font-semibold text-green-400 text-sm mb-2">Story Patterns That Work</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• <strong className="text-text-secondary">Origin story:</strong> &quot;I tried to do X and it was broken. So I built Y.&quot;</li>
                        <li>• <strong className="text-text-secondary">User story:</strong> &quot;Meet Sarah. She&apos;s an artist on NEAR who...&quot;</li>
                        <li>• <strong className="text-text-secondary">Vision story:</strong> &quot;Imagine a world where every creator can...&quot;</li>
                        <li>• <strong className="text-text-secondary">Traction story:</strong> &quot;6 months ago we had 0 users. Today...&quot;</li>
                      </ul>
                    </Card>
                    <Card variant="default" padding="md" className="border-red-500/20">
                      <h5 className="font-semibold text-red-400 text-sm mb-2">Pitch Killers to Avoid</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• Starting with &quot;We&apos;re a blockchain-based...&quot; (lead with the problem)</li>
                        <li>• Reading your slides word-for-word</li>
                        <li>• Saying &quot;we have no competition&quot; (you always do)</li>
                        <li>• 30 slides of architecture diagrams</li>
                        <li>• Unrealistic projections (&quot;$1B revenue by Year 2&quot;)</li>
                      </ul>
                    </Card>
                  </div>
                </section>

                {/* Section 4: Demo Day */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-orange-400" />
                    Hackathon &amp; Demo Day Pitches
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Hackathon demos are different from investor pitches. You have 3-5 minutes to show what you built and why it matters.
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 text-xs border border-border space-y-3">
                    <div className="text-orange-400 font-semibold">The Demo Day Formula (5 minutes)</div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-text-muted font-mono w-12">0:00</span>
                        <span className="text-text-secondary">Hook: Start with the problem or a surprising fact</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-text-muted font-mono w-12">0:30</span>
                        <span className="text-text-secondary">Solution: What you built (one sentence)</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-text-muted font-mono w-12">1:00</span>
                        <span className="text-text-secondary">LIVE DEMO: Show the product working. This is 60% of your time.</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-text-muted font-mono w-12">3:30</span>
                        <span className="text-text-secondary">Technical innovation: What&apos;s novel about your NEAR implementation?</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-text-muted font-mono w-12">4:15</span>
                        <span className="text-text-secondary">What&apos;s next: roadmap, vision, and call-to-action</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-text-muted font-mono w-12">4:45</span>
                        <span className="text-text-secondary">Close: memorable one-liner that sticks</span>
                      </div>
                    </div>
                    <p className="text-yellow-400 mt-2">⚡ Pro tip: Record a backup demo video. Live demos fail. Always have Plan B.</p>
                  </div>
                </section>

                {/* Section 5: Handling Questions */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Target className="w-5 h-5 text-red-400" />
                    Handling Tough Questions
                  </h4>
                  <p className="text-text-secondary mb-3">
                    The Q&amp;A often matters more than the pitch itself. Prepare for these common investor questions:
                  </p>
                  <div className="space-y-3">
                    {[
                      { q: '"Why NEAR and not Ethereum/Solana?"', a: 'Focus on technical advantages relevant to YOUR use case: account abstraction, sub-second finality, low fees, chain signatures. Don\'t trash competitors.' },
                      { q: '"What if NEAR fails?"', a: 'Acknowledge chain risk honestly. Discuss portability of your codebase and multi-chain strategy. Shows maturity.' },
                      { q: '"How do you acquire users?"', a: 'Specific channels and costs. "We\'ll acquire users through X, Y, Z at an estimated CAC of $N." Show you\'ve thought beyond "if we build it they\'ll come."' },
                      { q: '"What\'s your unfair advantage?"', a: 'Team expertise, proprietary tech, first-mover in niche, exclusive partnerships, community. "We\'re the only team with X" is the best answer.' },
                      { q: '"Why should I invest now vs. later?"', a: 'Urgency: "We\'re seeing X traction and this round closes in Y weeks. The NEAR ecosystem is at an inflection point because of Z."' },
                    ].map((item, i) => (
                      <Card key={i} variant="default" padding="md" className="border-red-500/20">
                        <h5 className="font-semibold text-red-400 text-sm mb-1">{item.q}</h5>
                        <p className="text-xs text-text-muted">{item.a}</p>
                      </Card>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {selectedTab === 'practice' && (
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-text-primary">Exercises</h4>

                <Card variant="default" padding="md" className="border-blue-500/20">
                  <h5 className="font-semibold text-blue-400 text-sm mb-2">🔵 Exercise 1: Write Your Elevator Pitch</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Write three versions of your pitch: 30 seconds (Twitter DM), 2 minutes (conference hallway), and 10 minutes (investor meeting). Record yourself delivering each one. Time it. Iterate.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-blue-500/20">
                  <h5 className="font-semibold text-blue-400 text-sm mb-2">🔵 Exercise 2: Build Your Pitch Deck</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Create a 10-slide pitch deck following the structure above. Use Figma, Google Slides, or Canva. Keep text minimal — 6 words per bullet max. Include one real screenshot or mockup of your product.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-blue-500/20">
                  <h5 className="font-semibold text-blue-400 text-sm mb-2">🔵 Exercise 3: Q&amp;A Stress Test</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Find a friend or fellow builder. Pitch them for 5 minutes, then have them grill you with the toughest questions they can think of for 10 minutes. Record it. Watch it back. Fix the weak spots.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-blue-500/20">
                  <h5 className="font-semibold text-blue-400 text-sm mb-2">🔵 Exercise 4: Competitive Positioning</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Create a 2x2 competitive matrix for your project. X-axis and Y-axis should be the two dimensions where you win. Position yourself and 4-6 competitors. This becomes slide 9 of your deck.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-blue-500/20">
                  <h5 className="font-semibold text-blue-400 text-sm mb-2">🔵 Exercise 5: Demo Recording</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Record a 3-minute demo of your product (even if it&apos;s a testnet prototype). Narrate what you&apos;re doing and why it matters. This becomes your backup for live demos and your Twitter content.
                  </p>
                </Card>
              </div>
            )}

            {selectedTab === 'resources' && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-text-primary">Resources</h4>
                {[
                  { title: 'Guy Kawasaki\'s 10/20/30 Rule', url: 'https://guykawasaki.com/the_102030_rule/', desc: '10 slides, 20 minutes, 30pt font — the classic pitch deck framework' },
                  { title: 'YC Pitch Deck Template', url: 'https://www.ycombinator.com/library/2u-how-to-build-your-seed-round-pitch-deck', desc: 'Y Combinator\'s recommended pitch deck structure and tips' },
                  { title: 'NEAR Demo Day Examples', url: 'https://www.youtube.com/@NEARProtocol', desc: 'Watch previous NEAR hackathon demo day presentations' },
                  { title: 'Pitch Deck Hunt', url: 'https://www.pitchdeckhunt.com/', desc: 'Collection of real pitch decks from funded startups' },
                  { title: 'Slidebean Pitch Deck Course', url: 'https://slidebean.com/pitch-deck-course', desc: 'Free course on building investor-ready pitch decks' },
                  { title: 'NEAR Foundation Pitch Guidelines', url: 'https://near.org/ecosystem/get-funding', desc: 'What NEAR Foundation looks for in grant and investment pitches' },
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

export default PitchingYourProject;
