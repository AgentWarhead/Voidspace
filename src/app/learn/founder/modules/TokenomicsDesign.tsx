'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronUp,
  Coins,
  PieChart,
  Lock,
  Flame,
  Vote,
  TrendingUp,
  Target,
  Lightbulb,
  CheckCircle,
  AlertTriangle,
  Layers,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

interface TokenomicsDesignProps {
  isActive: boolean;
  onToggle: () => void;
}

const tokenSegments = [
  { label: 'Community & Ecosystem', pct: 30, color: 'from-emerald-400 to-green-500', hex: '#34d399' },
  { label: 'Team & Advisors', pct: 20, color: 'from-cyan-400 to-blue-500', hex: '#22d3ee' },
  { label: 'Treasury', pct: 15, color: 'from-violet-400 to-purple-500', hex: '#a78bfa' },
  { label: 'Investors', pct: 15, color: 'from-amber-400 to-orange-500', hex: '#fbbf24' },
  { label: 'Liquidity', pct: 10, color: 'from-rose-400 to-pink-500', hex: '#fb7185' },
  { label: 'Airdrops', pct: 10, color: 'from-teal-400 to-emerald-500', hex: '#2dd4bf' },
];

function TokenPieChart() {
  const [hovered, setHovered] = useState<number | null>(null);
  const total = tokenSegments.reduce((s, seg) => s + seg.pct, 0);
  let cumulative = 0;

  return (
    <div className="flex flex-col md:flex-row items-center gap-6">
      <div className="relative w-56 h-56 flex-shrink-0">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          {tokenSegments.map((seg, i) => {
            const startAngle = (cumulative / total) * 360;
            const angle = (seg.pct / total) * 360;
            cumulative += seg.pct;
            const r = 40;
            const circ = 2 * Math.PI * r;
            const offset = circ - (angle / 360) * circ;
            const rotation = startAngle;
            const isHov = hovered === i;

            return (
              <motion.circle
                key={seg.label}
                cx="50" cy="50" r={r}
                fill="none"
                stroke={seg.hex}
                strokeWidth={isHov ? 20 : 16}
                strokeDasharray={`${circ}`}
                strokeDashoffset={offset}
                transform={`rotate(${rotation} 50 50)`}
                className="cursor-pointer transition-all"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              />
            );
          })}
        </svg>
        {hovered !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none"
          >
            <span className="text-2xl font-bold text-text-primary">{tokenSegments[hovered].pct}%</span>
            <span className="text-xs text-text-muted max-w-[100px]">{tokenSegments[hovered].label}</span>
          </motion.div>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2 flex-1">
        {tokenSegments.map((seg, i) => (
          <motion.div
            key={seg.label}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            className={cn(
              'flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all border border-transparent',
              hovered === i && 'border-near-green/30 bg-white/[0.03]'
            )}
          >
            <div className={cn('w-3 h-3 rounded-full bg-gradient-to-br', seg.color)} />
            <div>
              <span className="text-xs font-medium text-text-primary">{seg.label}</span>
              <span className="text-xs text-text-muted ml-1">({seg.pct}%)</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
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

function MiniQuiz() {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const correctAnswer = 2;
  const options = [
    'Low trading volume on DEXs',
    'Difficulty getting exchange listings',
    'Price dumps from early unlock selling pressure',
    'Regulatory scrutiny from the SEC',
  ];

  return (
    <div className="border border-border rounded-xl p-5 bg-black/20">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-amber-400" />
        <h4 className="font-semibold text-text-primary">Quick Check</h4>
      </div>
      <p className="text-sm text-text-secondary mb-4">What&apos;s the biggest risk of high initial circulating supply?</p>
      <div className="space-y-2">
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={() => { setSelected(i); setRevealed(true); }}
            className={cn(
              'w-full text-left p-3 rounded-lg border text-sm transition-all',
              revealed && i === correctAnswer
                ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300'
                : revealed && i === selected && i !== correctAnswer
                  ? 'border-red-500/50 bg-red-500/10 text-red-300'
                  : selected === i
                    ? 'border-near-green/50 bg-near-green/10 text-text-primary'
                    : 'border-border hover:border-near-green/30 text-text-secondary hover:text-text-primary'
            )}
          >
            <span className="font-medium mr-2">{String.fromCharCode(65 + i)}.</span>
            {opt}
          </button>
        ))}
      </div>
      <AnimatePresence>
        {revealed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className={cn(
              'mt-4 p-3 rounded-lg border text-sm',
              selected === correctAnswer
                ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-300'
                : 'border-amber-500/30 bg-amber-500/5 text-amber-300'
            )}>
              {selected === correctAnswer ? (
                <p><CheckCircle className="w-4 h-4 inline mr-1" /> Correct! When too many tokens are unlocked at launch, early investors and team members can sell immediately, creating massive downward price pressure that destroys community trust.</p>
              ) : (
                <p><AlertTriangle className="w-4 h-4 inline mr-1" /> Not quite. The biggest risk is selling pressure — when a high percentage of tokens unlock early, insiders often dump on retail, crashing the price and eroding community confidence.</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function TokenomicsDesign({ isActive, onToggle }: TokenomicsDesignProps) {
  return (
    <Card variant="glass" padding="none" className="border-near-green/20">
      <div onClick={onToggle} className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center">
            <Coins className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Tokenomics Design</h3>
            <p className="text-text-muted text-sm">Design sustainable token economies that align incentives</p>
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
            className="bg-gradient-to-br from-emerald-500/10 to-cyan-500/5 border border-emerald-500/20 rounded-xl p-5"
          >
            <h4 className="text-lg font-bold text-text-primary mb-2">💡 The Big Idea</h4>
            <p className="text-sm text-text-secondary leading-relaxed">
              Think of tokenomics like designing a country&apos;s economy — you control the money supply, who gets it, and what it&apos;s used for. 
              Get it right and you build a thriving digital nation. Get it wrong and you get hyperinflation, capital flight, and a ghost town. 
              Every token is a policy decision disguised as a number.
            </p>
          </motion.div>

          {/* Interactive Visual */}
          <div>
            <h4 className="text-base font-semibold text-text-primary mb-4 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-emerald-400" />
              Token Distribution Model
            </h4>
            <div className="border border-border rounded-xl p-5 bg-black/20">
              <TokenPieChart />
              <p className="text-xs text-text-muted mt-4 text-center">Hover over segments to explore a typical allocation model</p>
            </div>
          </div>

          {/* Concept Cards */}
          <div>
            <h4 className="text-base font-semibold text-text-primary mb-4">Core Concepts</h4>
            <div className="grid gap-3">
              <ConceptCard
                icon={TrendingUp}
                title="Supply Models"
                preview="Fixed, inflationary, deflationary — each tells a different economic story"
                details="Fixed supply (like Bitcoin's 21M cap) creates scarcity but limits flexibility. Inflationary models reward ongoing participation but dilute holders. Deflationary models with burns create price pressure but can reduce utility. NEAR uses a hybrid: ~5% annual inflation for validators offset by transaction fee burns, targeting net-zero inflation at scale."
              />
              <ConceptCard
                icon={Target}
                title="Distribution Strategy"
                preview="Who gets tokens and when determines your project's political landscape"
                details="Distribution is power allocation. Ref Finance allocated 60% to community incentives, ensuring users—not VCs—held majority governance power. Key principle: high community allocation builds legitimacy, but vesting prevents dump-and-run. Consider fair launches vs. private sales, retroactive airdrops vs. prospective rewards, and geographic/demographic diversity in distribution."
              />
              <ConceptCard
                icon={Layers}
                title="Token Utility"
                preview="A token without utility is a meme — maybe that's fine, but know the difference"
                details="Utility gives tokens intrinsic demand beyond speculation. Common utilities: governance (voting on proposals), staking (securing the network for yield), access (gating premium features), payment (transaction medium), and collateral (DeFi lending). Aurora's token serves as gas for the EVM chain, creating organic buy pressure from every transaction. Stack multiple utilities for resilient demand."
              />
              <ConceptCard
                icon={Lock}
                title="Vesting Mechanics"
                preview="Lock-ups are promises to the community that insiders believe in the long term"
                details="Standard vesting: 6-12 month cliff, 2-4 year linear unlock for team/investors. NEAR Protocol used a 4-year vesting schedule for team tokens with a 1-year cliff. Advanced techniques include milestone-based vesting (tokens unlock when KPIs are hit), retroactive vesting (rewarding past contributors), and rage-quit mechanisms (allowing early exit at a penalty). The key: align unlock schedules with value creation timelines."
              />
              <ConceptCard
                icon={Flame}
                title="Burn Mechanisms"
                preview="Token burns are monetary policy — reducing supply to increase scarcity"
                details="Burns permanently remove tokens from circulation. NEAR burns 70% of transaction fees, creating deflationary pressure as usage grows. Types: fee burns (automatic per-transaction), buyback-and-burn (protocol revenue buys and destroys tokens), and penalty burns (slashing for bad behavior). The psychological impact is powerful — burns signal that the protocol is generating real value and choosing to share it with holders."
              />
              <ConceptCard
                icon={Vote}
                title="Governance Rights"
                preview="Token-weighted voting is democracy for your protocol — design it carefully"
                details="Governance tokens let holders shape protocol direction. But naive 1-token-1-vote creates plutocracy. Solutions: quadratic voting (cost increases exponentially), conviction voting (longer holding = more weight, used by some NEAR DAOs), delegation (liquid democracy), and time-locked voting (lock tokens longer for more power). Ref Finance uses token governance for fee parameters, liquidity incentives, and treasury allocation."
              />
            </div>
          </div>

          {/* Mini Quiz */}
          <MiniQuiz />

          {/* Tokenomics Design Framework */}
          <div>
            <h4 className="text-base font-semibold text-text-primary mb-4">🧮 Tokenomics Design Framework</h4>
            <div className="border border-border rounded-xl p-5 bg-black/20 space-y-4">
              <p className="text-xs text-text-muted">Use this step-by-step framework to design your token economy from scratch:</p>
              {[
                { step: '1. Define Purpose', desc: 'Why does your token need to exist? If your product works without a token, you don\'t need one. The token should solve a coordination problem that can\'t be solved with fiat.' },
                { step: '2. Choose Supply Model', desc: 'Fixed for scarcity narrative, inflationary for ongoing incentives, or hybrid (NEAR model) for balanced economics. Model your supply curve for 5 years.' },
                { step: '3. Design Distribution', desc: 'Allocate to community (40-60%), team (15-20%), investors (10-20%), treasury (10-15%), liquidity (5-10%). Community-majority signals decentralization.' },
                { step: '4. Layer Utilities', desc: 'Stack 3-5 utility types: governance, staking, fee payment, access gating, and revenue sharing. Each utility creates an independent demand driver.' },
                { step: '5. Set Vesting', desc: 'Team: 4yr vest, 1yr cliff. Investors: 2-3yr vest, 6mo cliff. Community: gradual release tied to milestones. Keep TGE circulating supply under 20%.' },
                { step: '6. Stress Test', desc: 'Model three scenarios: bull (10x users), bear (80% drop), whale dump. If your token economy doesn\'t survive all three, redesign the weak points.' },
              ].map((item, i) => (
                <div key={i} className="flex gap-3">
                  <span className="text-near-green font-mono text-xs font-bold whitespace-nowrap">{item.step}</span>
                  <p className="text-xs text-text-muted">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Case Studies */}
          <div>
            <h4 className="text-base font-semibold text-text-primary mb-4">📚 NEAR Ecosystem Case Studies</h4>
            <div className="space-y-3">
              <div className="border border-border rounded-xl p-4 bg-black/20">
                <h5 className="font-semibold text-emerald-400 text-sm mb-1">Ref Finance — Community-First Distribution</h5>
                <p className="text-xs text-text-muted leading-relaxed">
                  Ref Finance allocated 60% of REF tokens to community rewards and liquidity mining, making it one of the most community-owned DEXs in crypto. 
                  Their vesting schedule for team tokens (4 years, 1-year cliff) signaled long-term commitment. Result: sustained TVL growth and genuine community governance participation.
                </p>
              </div>
              <div className="border border-border rounded-xl p-4 bg-black/20">
                <h5 className="font-semibold text-cyan-400 text-sm mb-1">Aurora — Utility-Driven Demand</h5>
                <p className="text-xs text-text-muted leading-relaxed">
                  AURORA token serves as gas for the Aurora EVM chain, creating constant organic buy pressure. Their staking mechanism offers yield from protocol revenue, 
                  not inflationary emissions — a sustainable model that ties token value directly to network usage. They also implemented a treasury governed by token holders.
                </p>
              </div>
              <div className="border border-border rounded-xl p-4 bg-black/20">
                <h5 className="font-semibold text-violet-400 text-sm mb-1">NEAR Protocol — Hybrid Economic Model</h5>
                <p className="text-xs text-text-muted leading-relaxed">
                  NEAR&apos;s tokenomics balance validator incentives (~5% inflation) with transaction fee burns (70% of fees burned). As network usage grows, 
                  burns approach and potentially exceed inflation, creating net-deflationary dynamics. The 1B total supply with transparent unlock schedules built institutional trust.
                </p>
              </div>
            </div>
          </div>

          {/* Key Takeaways */}
          <div className="bg-gradient-to-br from-emerald-500/5 to-transparent border border-emerald-500/20 rounded-xl p-5">
            <h4 className="font-semibold text-text-primary mb-3">🎯 Key Takeaways</h4>
            <ul className="space-y-2">
              {[
                'Token supply model (fixed/inflationary/deflationary) shapes your entire economic narrative',
                'Distribution is power — allocate majority to community for legitimacy',
                'Vesting schedules signal long-term commitment; cliff + linear unlock is the standard',
                'Stack multiple token utilities to create resilient organic demand',
                'Burn mechanisms create powerful deflationary psychology — tie them to real usage',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Common Mistakes */}
          <div>
            <h4 className="text-base font-semibold text-text-primary mb-4">⚠️ Common Tokenomics Mistakes</h4>
            <div className="space-y-3">
              {[
                { mistake: 'Too much circulating supply at TGE', fix: 'Keep initial circulating below 15-20%. High float on day one means massive sell pressure with no demand yet established.' },
                { mistake: 'No real utility beyond governance', fix: 'Governance alone isn\'t enough demand. Layer in staking, fee payment, access gating, or revenue sharing to create multiple demand drivers.' },
                { mistake: 'Identical vesting for all insiders', fix: 'Differentiate vesting by role. Team should vest longest (4yr), advisors medium (2yr), and early community rewards should be liquid to drive adoption.' },
                { mistake: 'Ignoring token velocity', fix: 'If users earn and immediately sell tokens, price collapses. Design sink mechanisms — staking locks, burn-on-use, or veToken models — to reduce velocity.' },
                { mistake: 'Copying another project\'s tokenomics', fix: 'Every project has unique dynamics. A gaming token needs different mechanics than a DeFi protocol. Design from first principles for your specific use case.' },
              ].map((item, i) => (
                <div key={i} className="border border-red-500/20 rounded-lg p-3 bg-red-500/5">
                  <p className="text-xs text-red-300 font-semibold mb-1">❌ {item.mistake}</p>
                  <p className="text-xs text-text-muted">{item.fix}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Items */}
          <div className="border-l-4 border-amber-500 bg-amber-500/5 rounded-r-xl p-4">
            <h4 className="font-semibold text-amber-300 text-sm mb-1">⚡ Action Item</h4>
            <p className="text-xs text-text-muted leading-relaxed">
              Map out your token distribution on paper before writing any code. Create a spreadsheet with: allocation percentages, vesting schedules, 
              unlock milestones, and a circulating supply projection for months 1, 6, 12, 24, and 48. Compare it to three successful projects in your category. 
              If your circulating supply at TGE exceeds 20%, you need a very good reason.
            </p>
          </div>

          <div className="border-l-4 border-cyan-500 bg-cyan-500/5 rounded-r-xl p-4">
            <h4 className="font-semibold text-cyan-300 text-sm mb-1">📋 Action Item: Token Utility Audit</h4>
            <p className="text-xs text-text-muted leading-relaxed">
              List every way your token creates demand. For each utility, estimate: frequency of use, volume of tokens needed, and whether it creates 
              buy pressure, lock-up, or burns. If you can&apos;t identify at least 3 distinct demand drivers, your tokenomics need more work. The strongest 
              projects have 5+ layered utilities that reinforce each other — staking for governance, burning for fees, locking for access, and earning for participation.
            </p>
          </div>
        </div>
      )}
    </Card>
  );
}
