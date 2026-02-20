'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import {
  ChevronDown, ChevronUp, CheckCircle2, Lightbulb, Zap,
  Shield, AlertTriangle, ArrowRight, Code, TrendingUp,
  Droplets, Sprout, Layers, Ban, BarChart3,
  CircleDollarSign, Activity, BookOpen, Clock,
} from 'lucide-react';

// ─── Interactive AMM Curve Visual ───────────────────────────────────────────

function AmmCurveVisual() {
  const [tokenA, setTokenA] = useState(50);
  const k = 10000; // constant product
  const tokenB = k / tokenA;
  const price = tokenB / tokenA;

  // Calculate points for the curve
  const curvePoints: string[] = [];
  for (let x = 5; x <= 195; x += 2) {
    const realX = (x / 200) * 190 + 5;
    const y = k / realX;
    const svgX = (realX / 200) * 280 + 10;
    const svgY = 150 - (y / 200) * 140;
    if (svgY > 5 && svgY < 150) {
      curvePoints.push(`${svgX},${svgY}`);
    }
  }

  const currentSvgX = (tokenA / 200) * 280 + 10;
  const currentSvgY = 150 - (tokenB / 200) * 140;

  // Slippage: price impact of swapping 10 token A
  const newTokenA = tokenA + 10;
  const newTokenB = k / newTokenA;
  const tokensReceived = tokenB - newTokenB;
  const idealReceived = 10 * price;
  const slippage = idealReceived > 0 ? ((idealReceived - tokensReceived) / idealReceived * 100) : 0;

  return (
    <div className="relative py-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* SVG Curve */}
        <div className="flex-1">
          <svg viewBox="0 0 300 170" className="w-full h-auto" style={{ maxHeight: 200 }}>
            {/* Grid */}
            <defs>
              <linearGradient id="curveGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#eab308" stopOpacity="0.8" />
              </linearGradient>
            </defs>
            {/* Axes */}
            <line x1="10" y1="150" x2="290" y2="150" stroke="#374151" strokeWidth="1" />
            <line x1="10" y1="5" x2="10" y2="150" stroke="#374151" strokeWidth="1" />
            <text x="150" y="167" fill="#6b7280" fontSize="9" textAnchor="middle">Token A Reserve</text>
            <text x="5" y="80" fill="#6b7280" fontSize="9" textAnchor="middle" transform="rotate(-90,5,80)">Token B Reserve</text>

            {/* Curve */}
            {curvePoints.length > 1 && (
              <polyline
                points={curvePoints.join(' ')}
                fill="none"
                stroke="url(#curveGrad)"
                strokeWidth="2.5"
              />
            )}

            {/* Current position dot */}
            {currentSvgY > 5 && currentSvgY < 150 && (
              <>
                <line x1={currentSvgX} y1={currentSvgY} x2={currentSvgX} y2="150" stroke="#f59e0b" strokeWidth="0.5" strokeDasharray="3,3" opacity="0.5" />
                <line x1="10" y1={currentSvgY} x2={currentSvgX} y2={currentSvgY} stroke="#f59e0b" strokeWidth="0.5" strokeDasharray="3,3" opacity="0.5" />
                <circle cx={currentSvgX} cy={currentSvgY} r="5" fill="#f59e0b" stroke="#1f2937" strokeWidth="2" />
              </>
            )}

            {/* Formula label */}
            <text x="200" y="25" fill="#f59e0b" fontSize="11" fontFamily="monospace" fontWeight="bold">x × y = k</text>
            <text x="200" y="40" fill="#6b7280" fontSize="8" fontFamily="monospace">{tokenA.toFixed(0)} × {tokenB.toFixed(1)} = {k}</text>
          </svg>
        </div>

        {/* Controls & Stats */}
        <div className="md:w-48 space-y-3">
          <div>
            <label className="text-xs text-text-muted font-mono block mb-1">Token A Amount: {tokenA}</label>
            <input
              type="range"
              min="10"
              max="190"
              value={tokenA}
              onChange={(e) => setTokenA(Number(e.target.value))}
              className="w-full accent-amber-500"
            />
          </div>
          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-text-muted">Token A:</span>
              <span className="text-amber-400">{tokenA.toFixed(1)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Token B:</span>
              <span className="text-yellow-400">{tokenB.toFixed(1)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Price (B/A):</span>
              <span className="text-text-primary">{price.toFixed(3)}</span>
            </div>
            <div className="pt-2 border-t border-border">
              <div className="flex justify-between">
                <span className="text-text-muted">Swap 10 A →</span>
                <span className="text-emerald-400">{tokensReceived.toFixed(2)} B</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Slippage:</span>
                <span className={cn(slippage > 5 ? 'text-red-400' : slippage > 2 ? 'text-orange-400' : 'text-emerald-400')}>
                  {slippage.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 p-3 rounded-lg bg-surface border border-border">
        <p className="text-[10px] text-text-muted font-mono leading-relaxed">
          💡 Drag the slider to see how the constant product formula maintains balance. Notice: extreme ratios = massive slippage.
          This is why deep liquidity pools give better prices for traders.
        </p>
      </div>
    </div>
  );
}

// ─── DeFi Protocol Comparison Grid ──────────────────────────────────────────

function ProtocolGrid() {
  const protocols = [
    { name: 'Ref Finance', type: 'AMM / DEX', color: 'text-emerald-400', bg: 'from-emerald-500/20 to-emerald-600/10', desc: 'Multi-pool DEX with concentrated liquidity, stable swaps, and farming. The Uniswap of NEAR.' },
    { name: 'Burrow', type: 'Lending', color: 'text-blue-400', bg: 'from-blue-500/20 to-blue-600/10', desc: 'Decentralized lending/borrowing protocol. Supply assets to earn yield, borrow against collateral.' },
    { name: 'Meta Pool', type: 'Liquid Staking', color: 'text-purple-400', bg: 'from-purple-500/20 to-purple-600/10', desc: 'Liquid staking for NEAR. Stake NEAR → receive stNEAR (liquid token usable across DeFi).' },
    { name: 'Orderly', type: 'Orderbook', color: 'text-amber-400', bg: 'from-amber-500/20 to-amber-600/10', desc: 'On-chain orderbook infrastructure. Provides CEX-like trading with DEX-level custody.' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {protocols.map((p) => (
        <Card key={p.name} variant="default" padding="md" className="hover:border-border-hover transition-all">
          <div className="flex items-center gap-2 mb-2">
            <div className={cn('w-8 h-8 rounded-md bg-gradient-to-br flex items-center justify-center', p.bg)}>
              <CircleDollarSign className={cn('w-4 h-4', p.color)} />
            </div>
            <div>
              <span className="text-sm font-bold text-text-primary">{p.name}</span>
              <Badge className="ml-2 text-[10px]">{p.type}</Badge>
            </div>
          </div>
          <p className="text-xs text-text-muted leading-relaxed">{p.desc}</p>
        </Card>
      ))}
    </div>
  );
}

// ─── Concept Card ───────────────────────────────────────────────────────────

function ConceptCard({ icon: Icon, title, preview, details }: {
  icon: React.ElementType;
  title: string;
  preview: string;
  details: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Card variant="default" padding="md" className="cursor-pointer hover:border-border-hover transition-all" onClick={() => setIsOpen(!isOpen)}>
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500/20 to-yellow-500/20 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-amber-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-semibold text-text-primary text-sm">{title}</h4>
            <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown className="w-4 h-4 text-text-muted" />
            </motion.div>
          </div>
          <p className="text-sm text-text-secondary">{preview}</p>
          <AnimatePresence>
            {isOpen && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <p className="text-sm text-text-muted mt-3 pt-3 border-t border-border leading-relaxed">{details}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Card>
  );
}

// ─── Mini Quiz ──────────────────────────────────────────────────────────────

function MiniQuiz() {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const correctAnswer = 1;

  const question = 'In a constant product AMM (x × y = k), what happens to the price of Token B when a large amount of Token A is added to the pool?';
  const options = [
    'Token B price stays the same because k is constant',
    'Token B becomes more expensive relative to Token A (price increases)',
    'Token B becomes cheaper because there is more total value in the pool',
    'The pool automatically rebalances to maintain equal token values',
  ];
  const explanation = 'Correct! When you add Token A to the pool, the pool must maintain x × y = k. So Token B reserves decrease, making B scarcer and more expensive relative to A. This is exactly how AMMs discover prices — through supply and demand within the constant product formula.';
  const wrongExplanation = 'Not quite. In x × y = k, adding Token A increases x, so y (Token B) must decrease to keep k constant. Fewer Token B in the pool means B is scarcer and more expensive. This is the fundamental price discovery mechanism of constant product AMMs.';

  return (
    <Card variant="glass" padding="lg">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-near-green" />
        <h4 className="font-bold text-text-primary">Quick Check</h4>
      </div>
      <p className="text-text-secondary mb-4">{question}</p>
      <div className="space-y-2">
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={() => { setSelected(i); setRevealed(true); }}
            className={cn(
              'w-full text-left px-4 py-3 rounded-lg border text-sm transition-all',
              revealed && i === correctAnswer
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                : revealed && i === selected && i !== correctAnswer
                  ? 'bg-red-500/10 border-red-500/30 text-red-400'
                  : selected === i
                    ? 'bg-surface-hover border-border-hover text-text-primary'
                    : 'bg-surface border-border text-text-secondary hover:border-border-hover'
            )}
          >
            <span className="font-mono text-xs mr-2 opacity-50">{String.fromCharCode(65 + i)}.</span>
            {opt}
          </button>
        ))}
      </div>
      <AnimatePresence>
        {revealed && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={cn('mt-4 p-3 rounded-lg text-sm', selected === correctAnswer ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-orange-500/10 text-orange-400 border border-orange-500/20')}>
            {selected === correctAnswer ? `✓ ${explanation}` : `✕ ${wrongExplanation}`}
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

// ─── Main Module ────────────────────────────────────────────────────────────

interface DefiContractPatternsProps {
  isActive: boolean;
  onToggle?: () => void;
}

export default function DefiContractPatterns({ isActive, onToggle }: DefiContractPatternsProps) {
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    try {
      const progress = JSON.parse(localStorage.getItem('voidspace-builder-progress') || '{}');
      if (progress['defi-contract-patterns']) setCompleted(true);
    } catch {}
  }, []);

  const handleComplete = () => {
    if (completed) return;
    try {
      const progress = JSON.parse(localStorage.getItem('voidspace-builder-progress') || '{}');
      progress['defi-contract-patterns'] = true;
      localStorage.setItem('voidspace-builder-progress', JSON.stringify(progress));
      setCompleted(true);
    } catch {}
  };

  return (
    <Card variant="glass" padding="none" className="border-amber-500/20">
      {/* Accordion Header */}
      <div onClick={() => {}} style={{display:"none"}} className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">DeFi Contract Patterns</h3>
            <p className="text-text-muted text-sm">AMMs, lending pools, yield farming, and composability on NEAR</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {completed && <Badge className="bg-emerald-500/10 text-emerald-300 border-emerald-500/20">✓ Done</Badge>}
          <Badge className="bg-red-500/10 text-red-300 border-red-500/20">Advanced</Badge>
          <Badge className="bg-amber-500/10 text-amber-300 border-amber-500/20">50 min</Badge>
          {isActive ? <ChevronUp className="w-5 h-5 text-text-muted" /> : <ChevronDown className="w-5 h-5 text-text-muted" />}
        </div>
      </div>

      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="border-t border-amber-500/20 p-6 space-y-8">
              {/* Module Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/20 bg-amber-500/5 text-xs text-amber-400">
                <BookOpen className="w-3 h-3" />
                Module 24 of 27
                <span className="text-text-muted">•</span>
                <Clock className="w-3 h-3" />
                50 min read
              </div>

              {/* The Big Idea */}
              <Card variant="glass" padding="lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/20 to-yellow-500/20 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-amber-400" />
                  </div>
                  <h4 className="text-lg font-bold text-text-primary">The Big Idea</h4>
                </div>
                <p className="text-text-secondary leading-relaxed">
                  DeFi contracts replace financial intermediaries with <span className="text-amber-400 font-medium">deterministic code</span>.
                  An AMM lets you swap tokens without an orderbook. A lending pool lets you borrow without a bank.
                  On NEAR, DeFi contracts benefit from <span className="text-yellow-400 font-medium">sub-second finality</span>,
                  human-readable accounts, and the ability to compose protocols via cross-contract calls — creating
                  <span className="text-amber-300 font-medium"> money legos</span> that snap together programmatically.
                </p>
              </Card>

              {/* Interactive AMM Curve */}
              <div>
                <h4 className="text-lg font-bold text-text-primary mb-2">📈 AMM Curve Explorer</h4>
                <p className="text-sm text-text-muted mb-4">Drag the slider to see how the constant product formula x × y = k determines prices and slippage in real-time.</p>
                <AmmCurveVisual />
              </div>

              {/* Protocol Comparison */}
              <div>
                <h4 className="text-lg font-bold text-text-primary mb-2">🏗️ NEAR DeFi Protocols</h4>
                <p className="text-sm text-text-muted mb-4">The NEAR ecosystem has mature DeFi infrastructure. Here are the key protocols builders integrate with:</p>
                <ProtocolGrid />
              </div>

              {/* Code Example */}
              <Card variant="default" padding="md" className="border-amber-500/20">
                <div className="flex items-center gap-2 mb-3">
                  <Code className="w-4 h-4 text-amber-400" />
                  <h4 className="font-semibold text-text-primary text-sm">Simple AMM Swap Logic</h4>
                </div>
                <pre className="text-xs text-text-secondary font-mono bg-surface rounded-lg p-4 overflow-x-auto leading-relaxed">
{`#[near(contract_state)]
pub struct AmmPool {
    token_a_reserve: u128,
    token_b_reserve: u128,
    total_shares: u128, // LP token supply
    shares: LookupMap<AccountId, u128>,
    fee_bps: u128,      // e.g., 30 = 0.3%
}

#[near]
impl AmmPool {
    /// Swap token_a for token_b using x*y=k
    pub fn swap_a_for_b(&mut self, amount_in: u128)
        -> u128 {
        assert!(amount_in > 0, "Zero input");
        // Apply fee
        let fee = amount_in * self.fee_bps / 10_000;
        let net_in = amount_in - fee;
        // Constant product: new_a * new_b = k
        let k = self.token_a_reserve
            * self.token_b_reserve;
        let new_a = self.token_a_reserve + net_in;
        let new_b = k / new_a;
        let amount_out = self.token_b_reserve - new_b;
        assert!(amount_out > 0, "Insufficient output");
        // Update reserves
        self.token_a_reserve = new_a;
        self.token_b_reserve = new_b;
        // Transfer tokens via ft_transfer calls...
        amount_out
    }
}`}
                </pre>
              </Card>

              {/* Security Gotcha */}
              <Card variant="default" padding="md" className="border-orange-500/20 bg-orange-500/5">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-orange-400 text-sm mb-1">⚠️ Security Gotcha: Oracle Manipulation</h4>
                    <p className="text-sm text-text-secondary">
                      Never use a single AMM pool as your price oracle! An attacker can <span className="text-orange-300 font-medium">sandwich</span> your
                      transaction — manipulate the pool price before your trade, exploit the wrong price, then reverse.
                      On NEAR, use time-weighted average prices (TWAP) from multiple sources, or dedicated oracle contracts
                      like Pyth or Flux. Any protocol that reads price from a single pool in the same transaction is vulnerable
                      to atomic price manipulation.
                    </p>
                  </div>
                </div>
              </Card>

              {/* Core Concepts */}
              <div>
                <h4 className="text-lg font-bold text-text-primary mb-4">🧩 Core Concepts</h4>
                <div className="space-y-3">
                  <ConceptCard
                    icon={Droplets}
                    title="Automated Market Makers (AMMs)"
                    preview="Algorithmic pricing using liquidity pools instead of orderbooks."
                    details="AMMs use mathematical formulas (usually x*y=k) to price assets. Liquidity providers deposit token pairs into pools and earn fees from every swap. The constant product formula ensures the pool always has liquidity — but at the cost of slippage on large trades. Concentrated liquidity (Uniswap v3 style) lets LPs focus capital in price ranges for better efficiency. Ref Finance on NEAR supports both classic and concentrated liquidity pools."
                  />
                  <ConceptCard
                    icon={CircleDollarSign}
                    title="Lending Pools"
                    preview="Supply assets to earn interest, borrow against collateral with liquidation mechanics."
                    details="Lending protocols (like Burrow on NEAR) pool supplied assets and lend them to borrowers who post collateral. Interest rates adjust algorithmically based on utilization — high demand = higher rates. Key mechanics: collateral factor (how much you can borrow against your deposit), liquidation threshold (when your position gets liquidated), and health factor (your proximity to liquidation). Liquidators earn a bonus for closing unhealthy positions."
                  />
                  <ConceptCard
                    icon={Sprout}
                    title="Yield Farming"
                    preview="Earning additional token rewards for providing liquidity or staking LP tokens."
                    details="Yield farming incentivizes liquidity by distributing governance or reward tokens to participants. Provide liquidity to a pool → receive LP tokens → stake LP tokens in a farm → earn reward tokens. The APY comes from: trading fees (real yield) + token emissions (inflationary rewards). Sustainable farms rely more on fees than emissions. On NEAR, Ref Finance farms distribute REF tokens to incentivize specific pools."
                  />
                  <ConceptCard
                    icon={Layers}
                    title="Composability (Money Legos)"
                    preview="Chaining DeFi protocols together via cross-contract calls for complex strategies."
                    details="NEAR's cross-contract calls enable DeFi composability: swap on Ref → deposit into Burrow → stake the receipt on Meta Pool — all in a few transactions. Each protocol exposes standard interfaces (NEP-141 for tokens, NEP-145 for storage) that enable seamless integration. Building composable contracts means: follow token standards, emit events, keep interfaces simple, and handle partial failures gracefully in callbacks."
                  />
                  <ConceptCard
                    icon={Ban}
                    title="Flash Loan Prevention"
                    preview="NEAR's async model naturally prevents single-block flash loan attacks."
                    details="Unlike Ethereum where everything executes atomically in one block, NEAR's cross-contract calls are async — each step executes in a separate block. This means an attacker cannot borrow, manipulate, and repay in a single atomic transaction. However, NEAR has its own risks: callback manipulation, cross-shard timing attacks, and oracle staleness. Don't assume you're immune — design for safety regardless."
                  />
                  <ConceptCard
                    icon={BarChart3}
                    title="Impermanent Loss"
                    preview="The hidden cost of providing liquidity when token prices diverge."
                    details="When you provide liquidity to an AMM and the price of one token changes relative to the other, you end up with fewer of the appreciating token than if you'd just held. This 'loss' is impermanent because it reverses if prices return to the original ratio. Formula: IL = 2*sqrt(price_ratio)/(1+price_ratio) - 1. At 2x price change, IL ≈ 5.7%. At 5x, IL ≈ 25.5%. Trading fees offset IL — profitable LPing requires fees earned > impermanent loss."
                  />
                </div>
              </div>

              {/* Attack / Defense Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card variant="default" padding="md" className="border-red-500/20">
                  <h4 className="font-semibold text-red-400 text-sm mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> Attack Vectors
                  </h4>
                  <ul className="text-xs text-text-muted space-y-1.5">
                    <li className="flex items-start gap-2"><span className="text-red-400">•</span> Oracle manipulation — using a single pool&apos;s spot price lets attackers sandwich and extract value</li>
                    <li className="flex items-start gap-2"><span className="text-red-400">•</span> Reentrancy via token callbacks — malicious ft_on_transfer can re-enter your swap logic mid-execution</li>
                    <li className="flex items-start gap-2"><span className="text-red-400">•</span> LP token inflation — attacker donates tokens directly to pool to manipulate share price for new depositors</li>
                  </ul>
                </Card>
                <Card variant="default" padding="md" className="border-emerald-500/20">
                  <h4 className="font-semibold text-emerald-400 text-sm mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4" /> Defenses
                  </h4>
                  <ul className="text-xs text-text-muted space-y-1.5">
                    <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> Use TWAP or multi-source oracles — never price from a single pool in the same transaction</li>
                    <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> Minimum output checks — require slippage tolerance on every swap (assert amount_out &gt;= min_out)</li>
                    <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> Initial LP lock — mint minimum shares on first deposit to prevent share price manipulation</li>
                  </ul>
                </Card>
              </div>

              {/* Mini Quiz */}
              <MiniQuiz />

              {/* Key Takeaways */}
              <Card variant="glass" padding="lg" className="border-near-green/20">
                <h4 className="font-bold text-text-primary mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-near-green" />
                  Key Takeaways
                </h4>
                <ul className="space-y-2">
                  {[
                    'AMMs use x × y = k to price swaps — larger trades relative to pool size cause more slippage',
                    'NEAR\'s async execution prevents atomic flash loans but introduces callback-based risks',
                    'Never use a single AMM pool as a price oracle — always use TWAP or multi-source oracles',
                    'Impermanent loss is the hidden cost of LPing — fees must exceed IL for profitable liquidity provision',
                    'Composability via cross-contract calls creates money legos — but handle partial failures in callbacks',
                    'Follow NEP-141 (fungible token) and NEP-145 (storage) standards for seamless DeFi integration',
                  ].map((point, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                      <ArrowRight className="w-4 h-4 text-near-green flex-shrink-0 mt-0.5" />
                      {point}
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Mark Complete */}
              {!completed && (
                <motion.button
                  onClick={handleComplete}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 text-white font-bold text-sm hover:brightness-110 transition-all"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  ✓ Mark as Complete
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
