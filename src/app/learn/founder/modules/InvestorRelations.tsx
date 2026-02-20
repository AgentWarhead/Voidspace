'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronUp,
  TrendingUp,
  Handshake,
  FileText,
  Coins,
  BarChart3,
  Users,
  Lightbulb,
  CheckCircle,
  CheckCircle2,
  AlertTriangle,
  Target,
  Rocket,
  DollarSign,
  Star,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

function ConceptCard({ icon: Icon, title, preview, details }: {
  icon: React.ElementType; title: string; preview: string; details: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer border border-border rounded-xl p-4 hover:border-near-green/30 transition-all bg-black/20">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
          <Icon className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-semibold text-text-primary text-sm">{title}</h4>
            <motion.div animate={{ rotate: isOpen ? 180 : 0 }}><ChevronDown className="w-4 h-4 text-text-muted" /></motion.div>
          </div>
          <p className="text-xs text-text-secondary">{preview}</p>
          <AnimatePresence>
            {isOpen && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <p className="text-xs text-text-muted mt-3 pt-3 border-t border-border leading-relaxed">{details}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

const milestones = [
  {
    label: 'Pre-seed',
    amount: '$100K–$500K',
    icon: Lightbulb,
    color: 'from-blue-400 to-blue-600',
    desc: 'Idea validation, MVP, founding team',
    details: 'At pre-seed, investors bet on the team and vision. Your pitch should focus on founder-market fit: why are YOU the person to solve this problem? Technical co-founders with relevant blockchain experience dramatically increase close rates. Typical investors: angel syndicates, ecosystem grants, and pre-seed crypto funds.',
    checklist: ['Whitepaper or technical spec', 'Founding team assembled', 'MVP or proof of concept', 'Initial community (Discord, Twitter)'],
  },
  {
    label: 'Seed',
    amount: '$1M–$5M',
    icon: Rocket,
    color: 'from-emerald-400 to-emerald-600',
    desc: 'Product-market fit, early traction, community',
    details: 'Seed rounds require evidence of traction. Show organic user growth, early revenue or TVL, and community engagement metrics. VCs want to see that you can execute — a shipped product with real users is worth more than a perfect deck. This is where your on-chain metrics become your strongest argument.',
    checklist: ['Live product with users', 'Key metrics trending up', 'Community of 1,000+ engaged members', 'Clear go-to-market strategy'],
  },
  {
    label: 'Series A',
    amount: '$5M–$20M',
    icon: TrendingUp,
    color: 'from-purple-400 to-purple-600',
    desc: 'Scaling growth, protocol expansion',
    details: 'Series A is about proving you can scale. Investors expect strong unit economics, a clear path to protocol revenue sustainability, and a defensible market position. At this stage, your governance model and decentralization roadmap become critical — VCs need to understand the long-term token value accrual mechanism.',
    checklist: ['Proven product-market fit', 'Sustainable unit economics', 'Scalable technical architecture', 'Governance framework defined'],
  },
  {
    label: 'Token Launch',
    amount: 'Variable',
    icon: Coins,
    color: 'from-amber-400 to-amber-600',
    desc: 'Decentralization, community ownership, liquidity',
    details: 'Token launches are both a fundraising event and a decentralization milestone. Careful planning around token distribution, vesting schedules, exchange listings, and market-making is essential. The most successful launches create genuine utility and community ownership rather than speculative hype. Consider progressive decentralization over a big-bang launch.',
    checklist: ['Tokenomics audited and published', 'Legal framework established', 'Community governance active', 'Liquidity strategy planned'],
  },
];

interface InvestorRelationsProps {
  isActive: boolean;
  onToggle?: () => void;
}

export default function InvestorRelations({ isActive, onToggle }: InvestorRelationsProps) {
  const [activeMilestone, setActiveMilestone] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    try {
      const progress = JSON.parse(localStorage.getItem('voidspace-founder-progress') || '{}');
      if (progress['investor-relations']) setCompleted(true);
    } catch {}
  }, []);

  const handleComplete = () => {
    if (completed) return;
    try {
      const progress = JSON.parse(localStorage.getItem('voidspace-founder-progress') || '{}');
      progress['investor-relations'] = true;
      localStorage.setItem('voidspace-founder-progress', JSON.stringify(progress));
      setCompleted(true);
    } catch {}
  };

  const quizOptions = [
    'A polished whitepaper and professional website',
    'Strong community traction and technical differentiation',
    'Celebrity endorsements and social media followers',
    'The largest possible total addressable market',
  ];
  const correctAnswer = 1;

  const handleAnswer = (idx: number) => {
    setSelectedAnswer(idx);
    setShowResult(true);
  };

  return (
    <Card variant="glass" padding="none" className="border-near-green/20">
      <div onClick={() => {}} style={{display:"none"}} className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center">
            <Handshake className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Investor Relations</h3>
            <p className="text-text-muted text-sm">Fundraising strategy, VC landscape & term sheets</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-near-green/10 text-near-green border-near-green/20">Module 12 of 12</Badge>
          {completed && <Badge className="bg-emerald-500/10 text-emerald-300 border-emerald-500/20">✓ Done</Badge>}
          <Badge className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-emerald-300 border-emerald-500/20">Founder</Badge>
          {isActive ? <ChevronUp className="w-5 h-5 text-text-muted" /> : <ChevronDown className="w-5 h-5 text-text-muted" />}
        </div>
      </div>

      {isActive && (
        <div className="border-t border-near-green/20 p-6 space-y-8">
          {/* The Big Idea */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-xl p-5"
          >
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-text-primary mb-1">The Big Idea</h4>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Raising crypto funding is like dating — investors are evaluating you long before the first meeting,
                  through your GitHub, Discord, and on-chain activity. Your public footprint <em>is</em> your first pitch.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Interactive: Fundraising Timeline */}
          <div>
            <h4 className="text-lg font-bold text-text-primary mb-4">🚀 Fundraising Journey</h4>
            <div className="relative">
              {/* Timeline bar */}
              <div className="absolute top-6 left-0 right-0 h-1 bg-border rounded-full">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 via-emerald-500 to-amber-500 rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: `${((activeMilestone + 1) / milestones.length) * 100}%` }}
                  transition={{ duration: 0.6 }}
                />
              </div>
              {/* Milestone dots */}
              <div className="flex justify-between relative z-10 mb-4">
                {milestones.map((m, i) => (
                  <button
                    key={m.label}
                    onClick={() => setActiveMilestone(i)}
                    className="flex flex-col items-center gap-2"
                  >
                    <motion.div
                      className={cn(
                        'w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all',
                        i <= activeMilestone
                          ? `bg-gradient-to-br ${m.color} border-transparent`
                          : 'bg-surface border-border'
                      )}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <m.icon className={cn('w-5 h-5', i <= activeMilestone ? 'text-white' : 'text-text-muted')} />
                    </motion.div>
                    <span className={cn('text-xs font-medium', i === activeMilestone ? 'text-emerald-400' : 'text-text-muted')}>{m.label}</span>
                  </button>
                ))}
              </div>
              {/* Details panel */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeMilestone}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-black/30 border border-border rounded-xl p-4 mt-2"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-lg font-bold text-text-primary">{milestones[activeMilestone].label}</span>
                    <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/20">{milestones[activeMilestone].amount}</Badge>
                  </div>
                  <p className="text-sm text-text-secondary mb-3">{milestones[activeMilestone].details}</p>
                  <div className="border-t border-border pt-3">
                    <p className="text-xs font-semibold text-text-primary mb-2">Readiness Checklist:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {milestones[activeMilestone].checklist.map((item, ci) => (
                        <div key={ci} className="flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                          <span className="text-xs text-text-muted">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Concept Cards */}
          <div>
            <h4 className="text-lg font-bold text-text-primary mb-4">📚 Key Concepts</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <ConceptCard
                icon={Target}
                title="VC Landscape"
                preview="Understanding crypto-native vs traditional investors"
                details="The Web3 VC landscape includes crypto-native funds (Paradigm, a16z crypto, Dragonfly), ecosystem funds (NEAR Foundation grants, Proximity Labs), angel syndicates, and traditional VCs entering crypto. Each type has different expectations around token economics, governance participation, and exit timelines. Crypto-native VCs often provide deeper technical guidance but expect token allocations."
              />
              <ConceptCard
                icon={FileText}
                title="Due Diligence Prep"
                preview="What VCs examine before writing a check"
                details="Web3 due diligence goes beyond financials. VCs audit smart contract code, review on-chain metrics, analyze tokenomics models, check GitHub commit history, and assess community health (Discord DAU, governance participation). Have your data room ready: audit reports, team backgrounds, cap table, and on-chain analytics dashboards. First-time founders often underestimate how deep VCs dig into technical architecture."
              />
              <ConceptCard
                icon={FileText}
                title="Term Sheets"
                preview="Navigating equity, tokens, and hybrid deals"
                details="Web3 term sheets often combine traditional equity with token rights. Key terms include token warrants (rights to future tokens), SAFT agreements (Simple Agreement for Future Tokens), vesting schedules (typically 4 years with 1-year cliff for tokens), and liquidation preferences. Watch for anti-dilution clauses and understand the difference between pre-money and post-money SAFE notes in crypto contexts."
              />
              <ConceptCard
                icon={Coins}
                title="Token Warrants"
                preview="Bridging equity and token economics"
                details="Token warrants give investors the right to receive tokens at a future date, usually at launch. They bridge the gap between early equity investment and eventual decentralization. Key considerations: warrant coverage ratios, exercise conditions, token allocation percentages (typically 10-20% for investors across all rounds), and lock-up periods. Poorly structured warrants can create misaligned incentives between investors and community."
              />
              <ConceptCard
                icon={BarChart3}
                title="Investor Updates"
                preview="Keeping investors engaged after the check clears"
                details="Monthly investor updates build trust and unlock follow-on funding. Include: key metrics (users, TVL, revenue), product milestones, hiring updates, treasury status, and specific asks. The best founders are transparent about challenges — VCs respect honesty over spin. Use a consistent template and send on the same day each month. Include on-chain dashboards links for real-time visibility."
              />
              <ConceptCard
                icon={Users}
                title="Strategic vs Financial Investors"
                preview="Choosing partners who add more than capital"
                details="Strategic investors bring ecosystem access, technical resources, and partnership introductions. Financial investors focus on returns and may push harder on valuation terms. The ideal raise combines both: strategic leads who add ecosystem value and financial investors who fill the round. In NEAR ecosystem, strategic partners like Proximity Labs can provide grants, technical support, and protocol integrations that pure financial VCs cannot."
              />
            </div>
          </div>

          {/* Case Studies */}
          <div>
            <h4 className="text-lg font-bold text-text-primary mb-4">🔍 NEAR Ecosystem Case Studies</h4>
            <div className="space-y-3">
              <div className="bg-black/20 border border-border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-4 h-4 text-amber-400" />
                  <h5 className="font-semibold text-text-primary text-sm">NEAR Protocol — $350M Raise</h5>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">
                  NEAR Protocol raised over $350M across multiple rounds from top-tier investors including Tiger Global,
                  a16z, and FTX Ventures. Key to their success: a world-class technical team (ex-Google, ex-Facebook),
                  a differentiated sharding approach (Nightshade), and strong developer adoption metrics before raising
                  the large rounds. They demonstrated product-market fit through ecosystem growth, not just promises.
                </p>
              </div>
              <div className="bg-black/20 border border-border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-4 h-4 text-amber-400" />
                  <h5 className="font-semibold text-text-primary text-sm">Aurora Labs — EVM Compatibility Play</h5>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Aurora raised funding by identifying a critical gap: Ethereum developers wanted NEAR&apos;s speed but didn&apos;t
                  want to rewrite contracts. Their EVM compatibility layer made migration trivial. Investors valued the
                  clear market positioning and immediate utility. The lesson: solve a specific, painful problem for a
                  defined user group rather than building generic infrastructure.
                </p>
              </div>
              <div className="bg-black/20 border border-border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-4 h-4 text-amber-400" />
                  <h5 className="font-semibold text-text-primary text-sm">Proximity Labs — Ecosystem Fund Model</h5>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Proximity Labs operates as a NEAR ecosystem fund and DeFi research lab. Their model shows how ecosystem
                  funds work: they receive protocol-level allocation, then deploy capital to promising projects building on
                  NEAR. For founders, this means your pitch to ecosystem funds should emphasize how your project grows the
                  overall ecosystem, not just your own metrics. Ecosystem alignment unlocks non-dilutive grant funding.
                </p>
              </div>
            </div>
          </div>

          {/* Mini Quiz */}
          <div>
            <h4 className="text-lg font-bold text-text-primary mb-4">🧠 Quick Check</h4>
            <div className="bg-black/30 border border-border rounded-xl p-5">
              <p className="text-sm text-text-primary font-medium mb-4">What do Web3 VCs value most in early-stage projects?</p>
              <div className="space-y-2">
                {quizOptions.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    disabled={showResult}
                    className={cn(
                      'w-full text-left p-3 rounded-lg border text-sm transition-all',
                      showResult && i === correctAnswer
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                        : showResult && i === selectedAnswer && i !== correctAnswer
                        ? 'border-red-500 bg-red-500/10 text-red-300'
                        : 'border-border hover:border-near-green/30 text-text-secondary hover:text-text-primary'
                    )}
                  >
                    <span className="font-medium mr-2">{String.fromCharCode(65 + i)}.</span> {opt}
                  </button>
                ))}
              </div>
              <AnimatePresence>
                {showResult && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 overflow-hidden"
                  >
                    <div className={cn(
                      'p-3 rounded-lg text-sm',
                      selectedAnswer === correctAnswer ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-amber-500/10 border border-amber-500/20'
                    )}>
                      {selectedAnswer === correctAnswer ? (
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                          <p className="text-emerald-300">Correct! Web3 VCs prioritize genuine community engagement and unique technical architecture over polished marketing. They can see through vanity metrics — real traction and differentiated technology are what matter.</p>
                        </div>
                      ) : (
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                          <p className="text-amber-300">Not quite. Web3 VCs look for strong community traction and technical differentiation. They value organic growth signals and unique protocol design over surface-level marketing or broad market claims.</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Key Takeaways */}
          <div>
            <h4 className="text-lg font-bold text-text-primary mb-4">💡 Key Takeaways</h4>
            <div className="space-y-2">
              {[
                'Your on-chain activity and GitHub history are your real pitch deck',
                'Combine strategic ecosystem investors with financial VCs for the best cap table',
                'Token warrants require careful structuring to align investor and community incentives',
                'Monthly investor updates build trust and unlock follow-on funding',
                'Ecosystem funds like Proximity Labs value ecosystem growth over individual project metrics',
              ].map((t, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-text-secondary">{t}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Items */}
          <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="w-5 h-5 text-amber-400" />
              <h4 className="font-bold text-text-primary">Action Items</h4>
            </div>
            <ul className="space-y-2">
              {[
                'Audit your public presence: GitHub, Discord, Twitter — what story do they tell?',
                'Build a data room with audit reports, tokenomics model, and on-chain metrics dashboard',
                'Map 20 target investors by type (strategic, financial, ecosystem) and warm intro paths',
                'Draft your first monthly investor update template — even before you have investors',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold text-sm mt-px">→</span>
                  <p className="text-sm text-text-secondary">{item}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Mark Complete */}
          <div className="flex justify-center pt-4 mt-4 border-t border-white/5">
            <motion.button
              onClick={handleComplete}
              disabled={completed}
              className={cn(
                'px-8 py-3 rounded-xl font-semibold text-sm transition-all flex items-center gap-2',
                completed
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default'
                  : 'bg-gradient-to-r from-near-green to-emerald-500 text-white hover:shadow-lg hover:shadow-near-green/20'
              )}
              whileHover={completed ? {} : { scale: 1.03, y: -1 }}
              whileTap={completed ? {} : { scale: 0.97 }}
            >
              <CheckCircle2 className="w-4 h-4" />
              {completed ? 'Module Completed ✓' : 'Mark as Complete'}
            </motion.button>
          </div>
        </div>
      )}
    </Card>
  );
}
