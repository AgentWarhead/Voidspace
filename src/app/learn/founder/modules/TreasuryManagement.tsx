'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronUp,
  Landmark,
  PieChart,
  Shield,
  DollarSign,
  TrendingUp,
  Lock,
  FileText,
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  Target,
  Coins,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

interface TreasuryManagementProps {
  isActive: boolean;
  onToggle: () => void;
}

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

const treasurySegments = [
  { label: 'Stablecoins', percentage: 35, color: 'from-green-400 to-emerald-500', offset: 0 },
  { label: 'Native Token', percentage: 25, color: 'from-cyan-400 to-blue-500', offset: 35 },
  { label: 'ETH / BTC', percentage: 20, color: 'from-purple-400 to-violet-500', offset: 60 },
  { label: 'Yield Strategies', percentage: 12, color: 'from-amber-400 to-orange-500', offset: 80 },
  { label: 'Operations', percentage: 8, color: 'from-rose-400 to-pink-500', offset: 92 },
];

const segmentColors = [
  'bg-gradient-to-r from-green-400 to-emerald-500',
  'bg-gradient-to-r from-cyan-400 to-blue-500',
  'bg-gradient-to-r from-purple-400 to-violet-500',
  'bg-gradient-to-r from-amber-400 to-orange-500',
  'bg-gradient-to-r from-rose-400 to-pink-500',
];

function TreasuryPieChart() {
  const [activeSegment, setActiveSegment] = useState<number | null>(null);
  const radius = 80;
  const cx = 100;
  const cy = 100;

  function getArc(startPct: number, endPct: number) {
    const startAngle = (startPct / 100) * 360 - 90;
    const endAngle = (endPct / 100) * 360 - 90;
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    const largeArc = endPct - startPct > 50 ? 1 : 0;
    const x1 = cx + radius * Math.cos(startRad);
    const y1 = cy + radius * Math.sin(startRad);
    const x2 = cx + radius * Math.cos(endRad);
    const y2 = cy + radius * Math.sin(endRad);
    return `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
  }

  const sliceColors = ['#34d399', '#22d3ee', '#a78bfa', '#fbbf24', '#fb7185'];

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div className="relative">
        <svg width="200" height="200" viewBox="0 0 200 200">
          {treasurySegments.map((seg, i) => {
            const isHovered = activeSegment === i;
            const endPct = seg.offset + seg.percentage;
            return (
              <motion.path
                key={seg.label}
                d={getArc(seg.offset, endPct)}
                fill={sliceColors[i]}
                stroke="rgba(0,0,0,0.3)"
                strokeWidth={1}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: activeSegment === null || isHovered ? 1 : 0.4,
                  scale: isHovered ? 1.05 : 1,
                }}
                transition={{ delay: i * 0.12, duration: 0.4 }}
                style={{ transformOrigin: `${cx}px ${cy}px` }}
                onMouseEnter={() => setActiveSegment(i)}
                onMouseLeave={() => setActiveSegment(null)}
                className="cursor-pointer"
              />
            );
          })}
          <circle cx={cx} cy={cy} r={35} fill="rgba(0,0,0,0.6)" />
          <text x={cx} y={cy - 6} textAnchor="middle" className="fill-white text-[10px] font-bold">
            {activeSegment !== null ? `${treasurySegments[activeSegment].percentage}%` : 'Treasury'}
          </text>
          <text x={cx} y={cy + 8} textAnchor="middle" className="fill-gray-400 text-[7px]">
            {activeSegment !== null ? treasurySegments[activeSegment].label : 'Hover to explore'}
          </text>
        </svg>
      </div>
      <div className="flex flex-col gap-2">
        {treasurySegments.map((seg, i) => (
          <motion.div
            key={seg.label}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.08 }}
            onMouseEnter={() => setActiveSegment(i)}
            onMouseLeave={() => setActiveSegment(null)}
            className={cn(
              'flex items-center gap-2 text-xs cursor-pointer px-2 py-1 rounded-lg transition-colors',
              activeSegment === i ? 'bg-white/10' : 'hover:bg-white/5'
            )}
          >
            <div className={cn('w-3 h-3 rounded-sm', segmentColors[i])} />
            <span className="text-text-secondary">{seg.label}</span>
            <span className="text-text-muted ml-auto font-mono">{seg.percentage}%</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

const quizOptions = [
  { id: 'a', text: 'Not having a treasury multisig wallet' },
  { id: 'b', text: 'Holding 100% of treasury in native token' },
  { id: 'c', text: 'Paying team salaries in crypto' },
  { id: 'd', text: 'Not publishing quarterly reports' },
];

export default function TreasuryManagement({ isActive, onToggle }: TreasuryManagementProps) {
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const correctAnswer = 'b';

  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    try {
      const progress = JSON.parse(localStorage.getItem('voidspace-founder-progress') || '{}');
      if (progress['treasury-management']) setCompleted(true);
    } catch {}
  }, []);

  const handleComplete = () => {
    if (completed) return;
    try {
      const progress = JSON.parse(localStorage.getItem('voidspace-founder-progress') || '{}');
      progress['treasury-management'] = true;
      localStorage.setItem('voidspace-founder-progress', JSON.stringify(progress));
      setCompleted(true);
    } catch {}
  };

  return (
    <Card variant="glass" padding="none" className="border-near-green/20">
      <div onClick={onToggle} className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center">
            <Landmark className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Treasury Management</h3>
            <p className="text-text-muted text-sm">Safeguard and grow your project&apos;s financial reserves</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-near-green/10 text-near-green border-near-green/20">Module 9 of 12</Badge>
          {completed && <Badge className="bg-emerald-500/10 text-emerald-300 border-emerald-500/20">✓ Done</Badge>}
          <Badge className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-emerald-300 border-emerald-500/20">Founder</Badge>
          {isActive ? <ChevronUp className="w-5 h-5 text-text-muted" /> : <ChevronDown className="w-5 h-5 text-text-muted" />}
        </div>
      </div>

      {isActive && (
        <div className="border-t border-near-green/20 p-6 space-y-8">
          {/* The Big Idea */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-xl p-5"
          >
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-text-primary mb-1">The Big Idea</h4>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Managing a crypto treasury is like sailing — you need enough <span className="text-emerald-400 font-medium">ballast (stablecoins)</span> to survive storms, but enough <span className="text-cyan-400 font-medium">sail (native tokens)</span> to catch the wind. Too much ballast and you go nowhere. Too much sail and one gust can capsize you.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Interactive Pie Chart */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-emerald-400" />
              Recommended Treasury Allocation
            </h4>
            <div className="bg-black/30 rounded-xl p-6 border border-border">
              <TreasuryPieChart />
              <p className="text-xs text-text-muted mt-4 text-center">Hover segments to explore. This is a sample allocation — adjust based on your project&apos;s stage and risk tolerance.</p>
            </div>
          </motion.div>

          {/* Concept Cards */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="text-lg font-bold text-text-primary mb-4">Core Concepts</h4>
            <div className="grid gap-3">
              <ConceptCard
                icon={TrendingUp}
                title="Asset Diversification"
                preview="Don't put all your eggs in one volatile basket."
                details="A healthy treasury mixes stablecoins (USDC, USDT, DAI) for runway certainty, blue-chip crypto (ETH, BTC) for long-term appreciation, and native tokens for ecosystem alignment. The NEAR Foundation maintains reserves across multiple asset classes to ensure operational continuity regardless of market conditions. Aim for at least 40-50% in stable assets during early stages."
              />
              <ConceptCard
                icon={DollarSign}
                title="Runway Calculation"
                preview="How many months can you survive at current burn rate?"
                details="Runway = Total Liquid Assets ÷ Monthly Burn Rate. Track this weekly. Most successful Web3 projects maintain 18-24 months of runway in stablecoins alone. Factor in worst-case scenarios: if your native token drops 80%, can you still pay the team for 12 months? If not, you need more stables. Include salaries, infrastructure, audits, legal, and marketing in burn calculations."
              />
              <ConceptCard
                icon={Coins}
                title="Stablecoin Strategy"
                preview="Not all stablecoins are created equal — diversify your stability."
                details="Spread stablecoin holdings across multiple issuers: USDC (Circle — regulated, US-based), USDT (Tether — highest liquidity), and DAI (decentralized, crypto-backed). Consider on-chain yield strategies for a portion — lending on platforms like Burrow on NEAR can earn 3-8% APY on stables. But never put more than 20% of stablecoin reserves into yield strategies; the rest should stay liquid."
              />
              <ConceptCard
                icon={Shield}
                title="DAO Treasuries & Sputnik"
                preview="On-chain governance for transparent fund management."
                details="Sputnik DAO on NEAR enables transparent, on-chain treasury governance. Set up councils for different spending categories — development, marketing, partnerships — each with their own approval thresholds. The NEAR ecosystem uses Sputnik extensively: AstroDAO provides a user-friendly interface for proposal creation, voting, and fund disbursement. Key benefit: every transaction is publicly auditable."
              />
              <ConceptCard
                icon={Lock}
                title="Multisig Security"
                preview="No single person should control project funds. Period."
                details="Use a multisig wallet requiring 3-of-5 or 4-of-7 signatures for treasury transactions. On NEAR, Sputnik DAO provides built-in multisig functionality. Distribute signers across different time zones and jurisdictions. Implement tiered approval: small operational expenses (< $5K) need 2 signatures, medium ($5K-$50K) need 3, and large (> $50K) need 4+. Never store all signer keys on the same infrastructure."
              />
              <ConceptCard
                icon={FileText}
                title="Reporting Transparency"
                preview="Regular treasury reports build trust and attract investors."
                details="Publish quarterly treasury reports covering: total holdings by asset type, burn rate trends, runway projection, significant expenditures, and upcoming financial commitments. The NEAR Foundation publishes regular transparency reports. Use on-chain analytics tools to make reports verifiable. Open treasury management correlates with stronger community trust, higher governance participation, and easier fundraising for future rounds."
              />
            </div>
          </motion.div>

          {/* Case Studies */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-cyan-400" />
              NEAR Ecosystem Case Studies
            </h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="bg-black/30 rounded-xl p-4 border border-border">
                <h5 className="font-semibold text-text-primary text-sm mb-2">NEAR Foundation Treasury</h5>
                <p className="text-xs text-text-secondary leading-relaxed">
                  The NEAR Foundation maintains a diversified treasury with stablecoin reserves covering multi-year operations. They publish regular transparency reports, use multisig for all significant transactions, and separate operational funds from ecosystem grant pools. Their approach of maintaining substantial stablecoin reserves allowed them to continue funding ecosystem development through the 2022-2023 bear market.
                </p>
              </div>
              <div className="bg-black/30 rounded-xl p-4 border border-border">
                <h5 className="font-semibold text-text-primary text-sm mb-2">Sputnik DAO Treasury Tools</h5>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Sputnik DAO (AstroDAO) provides NEAR projects with on-chain treasury management including proposal-based spending, role-based access control, and automatic fund disbursement. Projects like Ref Finance and Mintbase use Sputnik for transparent budget allocation, allowing token holders to verify every expense and vote on major financial decisions.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Quiz */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-black/30 rounded-xl p-5 border border-border"
          >
            <h4 className="text-lg font-bold text-text-primary mb-1">Quick Quiz</h4>
            <p className="text-sm text-text-secondary mb-4">What&apos;s the biggest treasury management mistake for Web3 projects?</p>
            <div className="grid gap-2">
              {quizOptions.map((option) => {
                const isSelected = quizAnswer === option.id;
                const isCorrect = option.id === correctAnswer;
                const showResult = quizAnswer !== null;
                return (
                  <button
                    key={option.id}
                    onClick={() => !quizAnswer && setQuizAnswer(option.id)}
                    disabled={quizAnswer !== null}
                    className={cn(
                      'text-left p-3 rounded-lg border text-sm transition-all',
                      !showResult && 'border-border hover:border-near-green/30 hover:bg-white/5',
                      showResult && isCorrect && 'border-emerald-500/50 bg-emerald-500/10',
                      showResult && isSelected && !isCorrect && 'border-red-500/50 bg-red-500/10',
                      showResult && !isSelected && !isCorrect && 'border-border opacity-50'
                    )}
                  >
                    <span className="text-text-muted mr-2 font-mono">{option.id.toUpperCase()}.</span>
                    <span className={cn(
                      showResult && isCorrect ? 'text-emerald-300' : 'text-text-secondary',
                      showResult && isSelected && !isCorrect && 'text-red-300'
                    )}>{option.text}</span>
                  </button>
                );
              })}
            </div>
            <AnimatePresence>
              {quizAnswer && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className={cn(
                    'mt-4 p-4 rounded-lg border text-sm',
                    quizAnswer === correctAnswer
                      ? 'border-emerald-500/30 bg-emerald-500/10'
                      : 'border-amber-500/30 bg-amber-500/10'
                  )}>
                    {quizAnswer === correctAnswer ? (
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                        <p className="text-text-secondary">
                          <span className="text-emerald-300 font-medium">Correct!</span> Holding 100% of treasury in your native token means one market crash can wipe out years of runway overnight. Projects like Terra/Luna proved this catastrophically. Always diversify into stablecoins and blue-chip assets.
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                        <p className="text-text-secondary">
                          <span className="text-amber-300 font-medium">Not quite.</span> The answer is <span className="text-emerald-300">B</span> — holding 100% in native token. While multisig security, salary payments, and reporting are all important, a concentrated native token position is an existential risk. One crash can eliminate your entire runway.
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Key Takeaways */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h4 className="text-lg font-bold text-text-primary mb-3">Key Takeaways</h4>
            <div className="space-y-2">
              {[
                'Maintain 18-24 months of runway in stablecoins — this is non-negotiable',
                'Use multisig wallets (3-of-5 minimum) for all treasury operations',
                'Diversify across asset types: stables, native token, ETH/BTC, and yield',
                'Publish quarterly treasury reports to build community trust',
                'Leverage Sputnik DAO on NEAR for transparent on-chain governance',
              ].map((takeaway, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-text-secondary">{takeaway}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Action Items */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl p-5"
          >
            <h4 className="font-bold text-text-primary mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Action Items
            </h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">1.</span>
                Calculate your current runway — divide stable assets by monthly burn rate
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">2.</span>
                Set up a Sputnik DAO with multisig for your project treasury
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">3.</span>
                Create a diversification plan: target allocation percentages for each asset class
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">4.</span>
                Draft your first treasury transparency report — even a simple one builds trust
              </li>
            </ul>
          </motion.div>

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
