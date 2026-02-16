'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronUp,
  CircleDollarSign,
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  Target,
  Zap,
  CreditCard,
  Gift,
  Flame,
  ArrowRightLeft,
  Building2,
  Layers,
  TrendingUp,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

interface RevenueModelsForDappsProps {
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

const revenueModels = [
  {
    id: 'fees',
    name: 'Transaction Fees',
    icon: ArrowRightLeft,
    color: 'from-emerald-400 to-green-500',
    sustainability: 85,
    complexity: 30,
    pros: ['Scales with usage automatically', 'Aligned with user value', 'Predictable with volume'],
    cons: ['Race to zero with competitors', 'Users feel the cost directly', 'Volume-dependent — no users, no revenue'],
    example: 'Ref Finance charges 0.3% per swap, split between LPs and protocol treasury',
  },
  {
    id: 'subscriptions',
    name: 'Subscriptions / SaaS',
    icon: CreditCard,
    color: 'from-blue-400 to-indigo-500',
    sustainability: 90,
    complexity: 60,
    pros: ['Predictable recurring revenue', 'Higher retention incentive', 'Works for B2B and premium features'],
    cons: ['Harder to implement on-chain', 'Users resist recurring crypto payments', 'Requires clear premium value'],
    example: 'Mintbase offers API access tiers for developers building NFT experiences',
  },
  {
    id: 'freemium',
    name: 'Freemium Tiers',
    icon: Gift,
    color: 'from-purple-400 to-violet-500',
    sustainability: 70,
    complexity: 50,
    pros: ['Low barrier to entry', 'Large user base for network effects', 'Upsell path to premium'],
    cons: ['Most users never pay', 'Must fund free tier somehow', 'Feature gating can fragment UX'],
    example: 'Paras offers free minting with premium analytics and promotion tools',
  },
  {
    id: 'burns',
    name: 'Token Burns / Buybacks',
    icon: Flame,
    color: 'from-orange-400 to-red-500',
    sustainability: 55,
    complexity: 40,
    pros: ['Reduces supply (deflationary pressure)', 'Aligns protocol with token holders', 'Simple to implement'],
    cons: ['Not direct revenue — relies on price', 'Regulatory scrutiny (looks like dividends)', 'Unsustainable without other revenue'],
    example: 'Protocols like Ref Finance can implement fee-based buyback and burn mechanisms',
  },
  {
    id: 'protocol',
    name: 'Protocol Fees',
    icon: CircleDollarSign,
    color: 'from-cyan-400 to-teal-500',
    sustainability: 92,
    complexity: 45,
    pros: ['Aligns incentives long-term', 'Distributed to stakeholders', 'Compounds with TVL growth'],
    cons: ['Must balance fee vs. competitiveness', 'Governance overhead for fee changes', 'Requires significant volume'],
    example: 'Burrow takes a spread between lending and borrowing rates as protocol revenue',
  },
];

function RevenueModelChart() {
  const [activeModel, setActiveModel] = useState<string | null>(null);
  const active = revenueModels.find(m => m.id === activeModel);

  return (
    <div className="space-y-4">
      {/* Model selector buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {revenueModels.map((model) => {
          const Icon = model.icon;
          const isSelected = activeModel === model.id;
          return (
            <motion.button
              key={model.id}
              onClick={() => setActiveModel(isSelected ? null : model.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                'flex flex-col items-center gap-2 p-3 rounded-xl border transition-all',
                isSelected
                  ? 'border-near-green/50 bg-near-green/10'
                  : 'border-border bg-black/20 hover:border-near-green/20'
              )}
            >
              <div className={cn('w-9 h-9 rounded-lg bg-gradient-to-br flex items-center justify-center', model.color)}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <span className="text-[11px] font-medium text-text-primary text-center leading-tight">{model.name}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Detail panel */}
      <AnimatePresence mode="wait">
        {active && (
          <motion.div
            key={active.id}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-black/30 border border-border rounded-xl p-4 space-y-4">
              {/* Metrics bars */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-text-muted">Sustainability</span>
                    <span className="text-xs font-mono text-emerald-400">{active.sustainability}%</span>
                  </div>
                  <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${active.sustainability}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-text-muted">Complexity</span>
                    <span className="text-xs font-mono text-amber-400">{active.complexity}%</span>
                  </div>
                  <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${active.complexity}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              </div>

              {/* Pros and Cons */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <ThumbsUp className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-xs font-semibold text-emerald-400">Pros</span>
                  </div>
                  {active.pros.map((pro, i) => (
                    <p key={i} className="text-[11px] text-text-secondary mb-1 flex items-start gap-1.5">
                      <span className="text-emerald-500 mt-0.5">+</span> {pro}
                    </p>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <ThumbsDown className="w-3.5 h-3.5 text-red-400" />
                    <span className="text-xs font-semibold text-red-400">Cons</span>
                  </div>
                  {active.cons.map((con, i) => (
                    <p key={i} className="text-[11px] text-text-secondary mb-1 flex items-start gap-1.5">
                      <span className="text-red-500 mt-0.5">−</span> {con}
                    </p>
                  ))}
                </div>
              </div>

              {/* NEAR Example */}
              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-3">
                <p className="text-xs text-text-secondary">
                  <span className="text-emerald-400 font-medium">NEAR Example:</span> {active.example}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const quizOptions = [
  { id: 'a', text: 'Token burns that create scarcity' },
  { id: 'b', text: 'One-time NFT sale revenue' },
  { id: 'c', text: 'Protocol fees distributed to stakeholders' },
  { id: 'd', text: 'Venture capital funding rounds' },
];

export default function RevenueModelsForDapps({ isActive, onToggle }: RevenueModelsForDappsProps) {
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const correctAnswer = 'c';

  return (
    <Card variant="glass" padding="none" className="border-near-green/20">
      <div onClick={onToggle} className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center">
            <CircleDollarSign className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Revenue Models for dApps</h3>
            <p className="text-text-muted text-sm">Build sustainable income streams for your Web3 product</p>
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
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-xl p-5"
          >
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-text-primary mb-1">The Big Idea</h4>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Revenue in Web3 is like <span className="text-emerald-400 font-medium">electricity</span> — it needs to flow through the system to keep everything running, and the best models make users <span className="text-cyan-400 font-medium">barely notice the meter</span>. The magic is capturing value without creating friction.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Interactive Revenue Model Chart */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              Revenue Model Comparison
            </h4>
            <div className="bg-black/30 rounded-xl p-5 border border-border">
              <RevenueModelChart />
              <p className="text-xs text-text-muted mt-3 text-center">Click a model to explore sustainability, complexity, pros/cons, and NEAR examples.</p>
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
                icon={ArrowRightLeft}
                title="Transaction Fee Models"
                preview="The bread and butter of DeFi — taking a small cut of every transaction."
                details="Transaction fees are the most common revenue model in DeFi. DEXs charge 0.1-0.3% per swap, lending protocols take a spread between lend/borrow rates, and NFT marketplaces charge 1-5% on sales. On NEAR, gas costs are extremely low (~$0.001 per transaction), so protocol fees can be competitive while still generating meaningful revenue at scale. Key metrics to track: daily volume, fee revenue, and fee/TVL ratio. The challenge: as competition increases, there's downward pressure on fees."
              />
              <ConceptCard
                icon={CreditCard}
                title="Subscription / SaaS Models"
                preview="Recurring revenue through premium access — the Web2 model, Web3-adapted."
                details="While subscriptions are rare in DeFi, they work well for developer tools, analytics platforms, and infrastructure services on NEAR. Charge monthly/yearly for API access, advanced analytics, or premium features. Implementation options: off-chain payment with on-chain access tokens, or smart contract-based subscriptions with auto-renewal. The key advantage is predictable revenue that doesn't depend on transaction volume. Challenge: crypto users expect things to be free, so the premium tier must deliver clear, measurable value."
              />
              <ConceptCard
                icon={Gift}
                title="Freemium Tiers"
                preview="Free for everyone, premium for power users — growth through accessibility."
                details="Freemium works by offering core functionality for free while charging for advanced features. In Web3: free trading with premium analytics, free minting with promotional tools, or free storage with enhanced API limits. The conversion funnel matters: typically 2-5% of free users upgrade to paid tiers. On NEAR, low gas costs make free-tier subsidization feasible. Design your free tier to create network effects (more users = more valuable platform) while ensuring the premium tier has clear ROI for paying users."
              />
              <ConceptCard
                icon={Zap}
                title="Protocol-Owned Liquidity (POL)"
                preview="Own the liquidity instead of renting it — a paradigm shift in DeFi economics."
                details="Instead of paying liquidity providers with token emissions (which dilute your token), Protocol-Owned Liquidity means the protocol itself provides liquidity using treasury funds and earns trading fees. Pioneered by OlympusDAO, this model reduces dependency on mercenary capital and creates a sustainable revenue stream. On NEAR, protocols can deploy treasury stablecoins as liquidity on Ref Finance, earning fees while maintaining protocol stability. The downside: requires significant upfront capital and smart contract risk management."
              />
              <ConceptCard
                icon={Building2}
                title="B2B Revenue"
                preview="Enterprise and protocol-to-protocol services — the hidden goldmine."
                details="B2B revenue in Web3 includes: white-label infrastructure licensing (let other projects use your technology), data API access for analytics providers, integration fees for cross-protocol composability, and consulting/implementation services. Mintbase generates B2B revenue by providing NFT infrastructure to other projects. On NEAR, the low-cost chain operation makes B2B services particularly competitive. This model is often overlooked but provides the most stable revenue because business customers have longer retention and higher willingness to pay."
              />
              <ConceptCard
                icon={Layers}
                title="Hybrid Models"
                preview="The best protocols combine multiple revenue streams for resilience."
                details="No single revenue model is perfect. The most successful dApps combine 2-3 models: base transaction fees + premium subscriptions, or freemium user tier + B2B API revenue + protocol-owned liquidity earnings. On NEAR, Ref Finance combines swap fees with potential premium analytics tools. Burrow combines lending spreads with liquidation fees. The key is ensuring revenue streams don't conflict — each should serve a different user segment or use case. Start with one model, prove it works, then layer additional streams."
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
                <h5 className="font-semibold text-text-primary text-sm mb-2">Ref Finance — Fee Model</h5>
                <p className="text-xs text-text-secondary leading-relaxed mb-2">
                  NEAR&apos;s leading DEX charges a 0.3% fee per swap, with the split between liquidity providers and the protocol treasury governed by the DAO. During high-volume periods, the protocol earns thousands in daily fees. Their model proves that even with NEAR&apos;s low gas costs, meaningful protocol revenue is achievable through volume. They&apos;re exploring additional revenue through concentrated liquidity and cross-chain routing.
                </p>
                <Badge className="text-[10px] bg-emerald-500/20 text-emerald-300 border-emerald-500/20">Model: Transaction Fees + DAO Treasury</Badge>
              </div>
              <div className="bg-black/30 rounded-xl p-4 border border-border">
                <h5 className="font-semibold text-text-primary text-sm mb-2">Mintbase — Marketplace Royalties</h5>
                <p className="text-xs text-text-secondary leading-relaxed mb-2">
                  Mintbase earns revenue through marketplace fees on NFT sales plus B2B revenue from their infrastructure-as-a-service model. Creators set royalty percentages enforced by smart contracts, and Mintbase takes a platform fee. Their dual model (consumer marketplace + developer infrastructure) provides revenue diversification that pure-play marketplaces lack.
                </p>
                <Badge className="text-[10px] bg-cyan-500/20 text-cyan-300 border-cyan-500/20">Model: Marketplace Fees + B2B Infrastructure</Badge>
              </div>
              <div className="bg-black/30 rounded-xl p-4 border border-border sm:col-span-2">
                <h5 className="font-semibold text-text-primary text-sm mb-2">Burrow — Lending Spreads</h5>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Burrow generates revenue through the interest rate spread between lenders and borrowers — the protocol takes a portion of the interest paid by borrowers before distributing to lenders. Additional revenue comes from liquidation fees when under-collateralized positions are liquidated. This dual-stream model (spreads + liquidations) means Burrow earns more during both calm markets (steady lending) and volatile markets (liquidation events), creating natural revenue hedging.
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
            <p className="text-sm text-text-secondary mb-4">Which revenue model is most sustainable for DeFi protocols?</p>
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
                          <span className="text-emerald-300 font-medium">Correct!</span> Protocol fees distributed to stakeholders create a flywheel: users generate fees → stakeholders earn revenue → stakeholders promote the protocol → more users. This aligns incentives long-term and creates sustainable growth, unlike one-time sales or unsustainable token emissions.
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                        <p className="text-text-secondary">
                          <span className="text-amber-300 font-medium">Not quite.</span> The answer is <span className="text-emerald-300">C</span> — protocol fees distributed to stakeholders. This model aligns incentives between protocol, token holders, and users. Token burns rely on price appreciation, one-time sales aren&apos;t recurring, and VC funding eventually runs out. Sustainable revenue comes from ongoing value capture.
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
                'Protocol fees distributed to stakeholders are the most sustainable DeFi revenue model',
                'Combine 2-3 revenue streams for resilience — don\'t depend on a single source',
                'NEAR\'s low gas costs make it feasible to subsidize free tiers while charging for premium',
                'B2B revenue is often overlooked but provides the most stable, predictable income',
                'Design revenue capture to be invisible to users — value extraction should feel like value exchange',
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
                Map your current and potential revenue streams — identify which models fit your dApp
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">2.</span>
                Calculate your break-even volume — how many daily transactions/users to cover costs?
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">3.</span>
                Research how 3 successful NEAR dApps monetize — adapt their strategies to your context
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">4.</span>
                Design a revenue model that creates a stakeholder flywheel — fees → rewards → growth → more fees
              </li>
            </ul>
          </motion.div>
        </div>
      )}
    </Card>
  );
}
