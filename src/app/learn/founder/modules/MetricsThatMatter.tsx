'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronUp,
  BarChart3,
  Activity,
  TrendingUp,
  Users,
  DollarSign,
  Eye,
  Target,
  Layers,
  PieChart,
  Gauge,
  Lightbulb,
  CheckCircle,
  AlertTriangle,
  Star,
  ArrowUpRight,
  ArrowDownRight,
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

const metrics = [
  { key: 'dau', label: 'DAU', value: 12847, prefix: '', suffix: '', icon: Users, trend: 12.4, color: 'text-blue-400', insight: 'Daily Active Users measures unique wallets transacting each day. High DAU with low retention signals mercenary users chasing incentives.' },
  { key: 'tvl', label: 'TVL', value: 48.2, prefix: '$', suffix: 'M', icon: Layers, trend: 8.7, color: 'text-emerald-400', insight: 'Total Value Locked shows capital commitment. Always separate organic TVL from incentivized TVL — only organic tells the truth.' },
  { key: 'revenue', label: 'Revenue', value: 284, prefix: '$', suffix: 'K/mo', icon: DollarSign, trend: -3.2, color: 'text-amber-400', insight: 'Protocol revenue from fees retained by treasury. A declining trend isn\'t always bad — seasonal patterns and market cycles matter.' },
  { key: 'retention', label: 'D30 Retention', value: 34, prefix: '', suffix: '%', icon: Activity, trend: 5.1, color: 'text-purple-400', insight: '30-day retention is the holy grail. If 34% of users return after a month, your product has real stickiness. Above 25% is excellent for DeFi.' },
];

function AnimatedCounter({ value, prefix, suffix, duration = 1.5 }: { value: number; prefix: string; suffix: string; duration?: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = value;
    const stepTime = (duration * 1000) / 60;
    const increment = end / 60;
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start * 10) / 10);
      }
    }, stepTime);
    return () => clearInterval(timer);
  }, [value, duration]);

  const display = Number.isInteger(value) ? Math.floor(count).toLocaleString() : count.toFixed(1);
  return <span>{prefix}{display}{suffix}</span>;
}

interface MetricsThatMatterProps {
  isActive: boolean;
  onToggle: () => void;
}

export default function MetricsThatMatter({ isActive, onToggle }: MetricsThatMatterProps) {
  const [activeMetrics, setActiveMetrics] = useState<Set<string>>(new Set(['dau', 'tvl', 'revenue', 'retention']));
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const toggleMetric = (key: string) => {
    setActiveMetrics(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const quizOptions = [
    'High trading volume on DEX pairs',
    'Large number of unique wallet addresses',
    'Organic TVL growth without incentives',
    'Positive social media sentiment scores',
  ];
  const correctAnswer = 2;

  const handleAnswer = (idx: number) => {
    setSelectedAnswer(idx);
    setShowResult(true);
  };

  return (
    <Card variant="glass" padding="none" className="border-near-green/20">
      <div onClick={onToggle} className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Metrics That Matter</h3>
            <p className="text-text-muted text-sm">On-chain analytics, KPIs & growth indicators</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
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
                  Metrics in Web3 are like a doctor&apos;s vital signs — some look healthy on the surface while hiding
                  critical problems underneath. A protocol with millions in TVL might have zero organic retention, while
                  a small project with loyal users could be the next breakout.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Interactive: Metrics Dashboard */}
          <div>
            <h4 className="text-lg font-bold text-text-primary mb-2">📊 Metrics Dashboard</h4>
            <p className="text-xs text-text-muted mb-4">Toggle metrics to explore what really matters</p>
            {/* Toggle buttons */}
            <div className="flex flex-wrap gap-2 mb-4">
              {metrics.map((m) => (
                <button
                  key={m.key}
                  onClick={() => toggleMetric(m.key)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all',
                    activeMetrics.has(m.key)
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                      : 'border-border bg-black/20 text-text-muted hover:border-border'
                  )}
                >
                  <m.icon className="w-3.5 h-3.5" />
                  {m.label}
                </button>
              ))}
            </div>
            {/* Metric cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <AnimatePresence>
                {metrics.filter(m => activeMetrics.has(m.key)).map((m) => (
                  <motion.div
                    key={m.key}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-black/30 border border-border rounded-xl p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <m.icon className={cn('w-4 h-4', m.color)} />
                      <div className={cn('flex items-center gap-0.5 text-xs', m.trend > 0 ? 'text-emerald-400' : 'text-red-400')}>
                        {m.trend > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {Math.abs(m.trend)}%
                      </div>
                    </div>
                    <div className={cn('text-xl font-bold', m.color)}>
                      <AnimatedCounter value={m.value} prefix={m.prefix} suffix={m.suffix} />
                    </div>
                    <p className="text-xs text-text-muted mt-1">{m.label}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            {/* Metric insight */}
            <AnimatePresence mode="wait">
              {metrics.filter(m => activeMetrics.has(m.key)).length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-3 space-y-2"
                >
                  {metrics.filter(m => activeMetrics.has(m.key)).map((m) => (
                    <div key={`insight-${m.key}`} className="flex items-start gap-2 bg-black/20 rounded-lg p-3 border border-border">
                      <m.icon className={cn('w-3.5 h-3.5 mt-0.5 flex-shrink-0', m.color)} />
                      <div>
                        <span className="text-xs font-semibold text-text-primary">{m.label}: </span>
                        <span className="text-xs text-text-muted">{m.insight}</span>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Red Flags vs Green Flags */}
          <div>
            <h4 className="text-lg font-bold text-text-primary mb-4">🚦 Metrics Red Flags vs Green Flags</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
                <h5 className="font-semibold text-red-400 text-sm mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> Red Flags
                </h5>
                <ul className="space-y-2">
                  {[
                    'TVL drops 50%+ when incentives end',
                    'DAU spikes only on airdrop speculation',
                    'Revenue depends on a single token price',
                    'No organic growth visible on-chain',
                    'Wallet count growing but transactions flat',
                  ].map((flag, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-red-400 text-xs mt-px">✗</span>
                      <span className="text-xs text-text-muted">{flag}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4">
                <h5 className="font-semibold text-emerald-400 text-sm mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Green Flags
                </h5>
                <ul className="space-y-2">
                  {[
                    'Organic TVL growing without incentive programs',
                    'Improving retention curves across cohorts',
                    'Revenue growing faster than token price',
                    'Developer activity increasing month-over-month',
                    'Cross-protocol integrations expanding organically',
                  ].map((flag, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-400 text-xs mt-px">✓</span>
                      <span className="text-xs text-text-muted">{flag}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Concept Cards */}
          <div>
            <h4 className="text-lg font-bold text-text-primary mb-4">📚 Key Concepts</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <ConceptCard
                icon={Eye}
                title="On-chain Analytics"
                preview="Reading the blockchain like a financial statement"
                details="On-chain analytics reveal what dashboards can't hide. Tools like Flipside, Dune Analytics, and NEAR Explorer let you track real user behavior: unique active wallets (not just transactions), contract interactions, token flows, and cross-protocol activity. The key insight: on-chain data is immutable and public, making it impossible to fake. Investors increasingly rely on on-chain data over self-reported metrics."
              />
              <ConceptCard
                icon={AlertTriangle}
                title="Vanity vs Real Metrics"
                preview="Distinguishing signal from noise in Web3 data"
                details="Vanity metrics look impressive but don't indicate health: total wallets created (many are inactive), gross transaction volume (often wash trading), Twitter followers (easily bought), and total TVL during incentive programs. Real metrics: daily active users (unique wallets making transactions), organic TVL (without incentive programs), revenue per user, and D30 retention. A protocol with 1,000 sticky users beats one with 100,000 drive-by addresses."
              />
              <ConceptCard
                icon={PieChart}
                title="Cohort Analysis"
                preview="Tracking user behavior over time, not in snapshots"
                details="Cohort analysis groups users by when they joined and tracks their behavior over time. In DeFi, this means: what percentage of users who deposited in January are still active in March? Healthy protocols show improving retention curves over time — each new cohort retains better than the last. If every cohort churns at the same rate, your product has a leaky bucket problem that growth won't fix."
              />
              <ConceptCard
                icon={DollarSign}
                title="Revenue Metrics"
                preview="Protocol revenue, fee capture, and sustainability"
                details="Revenue in Web3 takes many forms: trading fees, lending spreads, MEV capture, premium features, and protocol-owned liquidity yields. Key metrics: protocol revenue (fees retained by the treasury), fee-to-TVL ratio (efficiency), revenue per active user, and revenue growth rate. Sustainable protocols generate enough revenue to fund development without relying on token inflation. Compare your revenue metrics to benchmarks on Token Terminal."
              />
              <ConceptCard
                icon={TrendingUp}
                title="Growth Indicators"
                preview="Leading metrics that predict future success"
                details="Lagging metrics tell you what happened; leading indicators predict what's coming. Key leading indicators in Web3: developer activity (GitHub commits, new contributors), cross-protocol integrations, governance participation rate, organic social mentions, and new contract deployments on your platform. If developer activity is declining while TVL holds steady, trouble is coming. The best founders track leading indicators weekly."
              />
              <ConceptCard
                icon={Gauge}
                title="Benchmarking"
                preview="How to compare your metrics to the competition"
                details="Benchmarking requires comparing like-for-like: DeFi lending vs lending, DEX vs DEX. Use Token Terminal, DefiLlama, and Dune for comparative data. Key benchmarks: TVL per developer (efficiency), revenue per $1 TVL, user growth rate vs category average, and retention vs comparable protocols. The NEAR ecosystem has specific benchmarks — compare against Ref Finance, Burrow, and other NEAR-native protocols for relevant context."
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
                  <h5 className="font-semibold text-text-primary text-sm">Ref Finance — Metrics Journey</h5>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Ref Finance, NEAR&apos;s leading DEX, demonstrated the classic metrics evolution. Early on, they tracked
                  TVL and volume as primary KPIs. As they matured, they shifted focus to unique traders per day,
                  fee revenue, and LP retention rates. Their key learning: TVL from incentive farming was &quot;rented liquidity&quot;
                  that disappeared when rewards ended. They pivoted to concentrated liquidity and better fee structures,
                  tracking organic TVL separately from incentivized TVL — a practice every DeFi founder should adopt.
                </p>
              </div>
              <div className="bg-black/20 border border-border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-4 h-4 text-amber-400" />
                  <h5 className="font-semibold text-text-primary text-sm">Burrow — Lending Metrics That Matter</h5>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Burrow, NEAR&apos;s lending protocol, focused on metrics that actually indicate lending health:
                  utilization rates (borrowing/supply ratio), liquidation frequency, bad debt ratio, and unique
                  borrowers. They learned that high TVL in lending doesn&apos;t equal success — what matters is efficient
                  capital utilization and a healthy borrow/supply balance. Their dashboards now prominently feature
                  utilization rates and borrower retention alongside traditional TVL figures.
                </p>
              </div>
            </div>
          </div>

          {/* Mini Quiz */}
          <div>
            <h4 className="text-lg font-bold text-text-primary mb-4">🧠 Quick Check</h4>
            <div className="bg-black/30 border border-border rounded-xl p-5">
              <p className="text-sm text-text-primary font-medium mb-4">Which metric best indicates product-market fit for a DeFi protocol?</p>
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
                          <p className="text-emerald-300">Correct! Organic TVL growth — capital flowing in without farming incentives — is the strongest signal of product-market fit. It means users genuinely find value in your protocol, not just chasing yields.</p>
                        </div>
                      ) : (
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                          <p className="text-amber-300">Not quite. Organic TVL growth without incentives is the best indicator. Trading volume can be wash-traded, wallet counts can be sybiled, and social sentiment is easily manipulated. Only organic capital commitment reveals real product-market fit.</p>
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
                'Separate organic metrics from incentivized metrics — only organic numbers tell the truth',
                'Track leading indicators (developer activity, integrations) not just lagging metrics (TVL, volume)',
                'Cohort analysis reveals retention trends that aggregate numbers hide',
                'Revenue sustainability matters more than revenue size — can you fund dev without token inflation?',
                'Benchmark against category peers, not the entire market',
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
              <Target className="w-5 h-5 text-amber-400" />
              <h4 className="font-bold text-text-primary">Action Items</h4>
            </div>
            <ul className="space-y-2">
              {[
                'Build a Dune dashboard that separates organic vs incentivized metrics for your protocol',
                'Set up weekly cohort analysis tracking — group users by first-interaction week',
                'Create an internal metrics scorecard with 5 leading and 5 lagging indicators',
                'Benchmark your top 3 metrics against the closest NEAR ecosystem competitor',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold text-sm mt-px">→</span>
                  <p className="text-sm text-text-secondary">{item}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </Card>
  );
}
