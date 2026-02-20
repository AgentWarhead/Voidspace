'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import {
  ChevronDown, ChevronUp, CheckCircle2, Lightbulb, Zap,
  Shield, AlertTriangle, ArrowRight, Radio, Database,
  Activity, RefreshCw, Eye, Server, Layers, Globe,
} from 'lucide-react';

// ─── Interactive Visual: Oracle Data Flow ───────────────────────────────────

function OracleDataFlowVisual() {
  const [activeNode, setActiveNode] = useState<number | null>(null);

  const [showTimeline, setShowTimeline] = useState(false);

  const dataSources = [
    { label: 'Binance API', price: '$2,847.32' },
    { label: 'Coinbase API', price: '$2,848.10' },
    { label: 'Kraken API', price: '$2,846.95' },
  ];

  const oracleNodes = [
    { id: 0, label: 'Node A', report: '$2,847.32', status: 'healthy' },
    { id: 1, label: 'Node B', report: '$2,847.52', status: 'healthy' },
    { id: 2, label: 'Node C', report: '$2,847.10', status: 'healthy' },
    { id: 3, label: 'Node D', report: '$9,999.99', status: 'outlier' },
    { id: 4, label: 'Node E', report: '$2,846.95', status: 'healthy' },
  ];

  const aggregatedPrice = '$2,847.32';

  const getNodeInfo = (id: number) => {
    const node = oracleNodes[id];
    if (node.status === 'outlier') {
      return 'This node reported a wild outlier! The aggregator uses median filtering to reject this value — it doesn\'t affect the final price.';
    }
    return `Reported ${node.report}. This value is within normal range and contributes to the median calculation.`;
  };

  return (
    <div className="relative py-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-start">
        {/* Data Sources */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">External Sources</p>
          {dataSources.map((src, i) => (
            <div key={i} className="px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs">
              <span className="text-blue-400 font-medium">{src.label}</span>
              <span className="text-text-muted ml-2">{src.price}</span>
            </div>
          ))}
        </div>

        {/* Oracle Nodes */}
        <div className="space-y-2 md:col-span-2">
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Oracle Nodes</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {oracleNodes.map((node) => (
              <motion.div
                key={node.id}
                className={cn(
                  'px-3 py-2 rounded-lg border text-xs cursor-pointer transition-all',
                  activeNode === node.id
                    ? node.status === 'outlier'
                      ? 'bg-red-500/15 border-red-500/50 shadow-[0_0_12px_rgba(239,68,68,0.15)]'
                      : 'bg-emerald-500/15 border-emerald-500/50 shadow-[0_0_12px_rgba(0,236,151,0.15)]'
                    : node.status === 'outlier'
                      ? 'bg-red-500/5 border-red-500/20 hover:border-red-500/40'
                      : 'bg-surface border-border hover:border-border-hover'
                )}
                whileHover={{ scale: 1.03 }}
                onClick={() => setActiveNode(activeNode === node.id ? null : node.id)}
              >
                <div className="flex items-center justify-between">
                  <span className={node.status === 'outlier' ? 'text-red-400 font-medium' : 'text-amber-400 font-medium'}>{node.label}</span>
                  {node.status === 'outlier' && <AlertTriangle className="w-3 h-3 text-red-400" />}
                </div>
                <span className="text-text-muted">{node.report}</span>
              </motion.div>
            ))}
          </div>
          <AnimatePresence>
            {activeNode !== null && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className={cn(
                  'mt-2 p-3 rounded-lg text-xs',
                  oracleNodes[activeNode].status === 'outlier'
                    ? 'bg-red-500/10 border border-red-500/20 text-red-300'
                    : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300'
                )}>
                  {getNodeInfo(activeNode)}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Aggregated Result */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Aggregated</p>
          <div className="px-3 py-3 rounded-lg bg-gradient-to-br from-amber-500/15 to-yellow-500/15 border border-amber-500/30 text-center">
            <p className="text-xs text-text-muted mb-1">Median Price</p>
            <p className="text-lg font-bold text-amber-400">{aggregatedPrice}</p>
            <p className="text-[10px] text-text-muted mt-1">→ Consumer Contracts</p>
          </div>
          <div className="px-3 py-2 rounded-lg bg-surface border border-border text-xs text-center">
            <span className="text-text-muted">Outlier rejected ✓</span>
          </div>
        </div>
      </div>
      {/* Timeline toggle */}
      <div className="mt-4 flex justify-center">
        <button
          onClick={() => setShowTimeline(!showTimeline)}
          className="text-xs text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1"
        >
          {showTimeline ? 'Hide' : 'Show'} update timeline →
        </button>
      </div>
      <AnimatePresence>
        {showTimeline && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 p-3 rounded-lg bg-surface border border-border">
              <p className="text-xs font-semibold text-text-muted mb-2">Oracle Update Timeline</p>
              <div className="space-y-2">
                {[
                  { time: 'T+0s', event: 'Price change detected on exchanges', color: 'text-blue-400' },
                  { time: 'T+2s', event: 'Oracle nodes fetch new prices from APIs', color: 'text-amber-400' },
                  { time: 'T+5s', event: 'Nodes submit reports to aggregator contract', color: 'text-amber-400' },
                  { time: 'T+8s', event: 'Aggregator computes median, rejects outliers', color: 'text-emerald-400' },
                  { time: 'T+10s', event: 'New price available to consumer contracts', color: 'text-emerald-400' },
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs">
                    <span className="font-mono text-text-muted w-12 flex-shrink-0">{step.time}</span>
                    <div className={cn('w-2 h-2 rounded-full flex-shrink-0', step.color.replace('text-', 'bg-'))} />
                    <span className="text-text-secondary">{step.event}</span>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-text-muted mt-2">
                Total latency: ~10 seconds from price change to on-chain availability. Staleness window is critical!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <p className="text-center text-xs text-text-muted mt-4">
        Click oracle nodes to explore how aggregation handles outliers →
      </p>
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

  const question = 'What is the most effective defense against flash loan oracle attacks?';
  const options = [
    'Checking the price once at the start of the transaction',
    'Time-weighted average prices (TWAP) sampled across multiple blocks',
    'Requiring a minimum transaction amount',
    'Using a single trusted oracle with high reputation',
  ];
  const explanation = 'Correct! TWAP samples prices across multiple blocks, making single-block manipulation useless. A flash loan attack happens in one transaction within one block, so multi-block sampling neutralizes it.';
  const wrongExplanation = 'Not quite. Flash loan attacks happen within a single block. The best defense is TWAP — sampling prices across multiple blocks so single-block manipulation has no effect.';

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

interface OracleIntegrationProps {
  isActive: boolean;
  onToggle?: () => void;
}

const OracleIntegration: React.FC<OracleIntegrationProps> = ({ isActive, onToggle }) => {
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    try {
      const progress = JSON.parse(localStorage.getItem('voidspace-hacker-progress') || '{}');
      if (progress['oracle-integration']) setCompleted(true);
    } catch {}
  }, []);

  const handleComplete = () => {
    if (completed) return;
    try {
      const progress = JSON.parse(localStorage.getItem('voidspace-hacker-progress') || '{}');
      progress['oracle-integration'] = true;
      localStorage.setItem('voidspace-hacker-progress', JSON.stringify(progress));
      setCompleted(true);
    } catch {}
  };
  return (
    <Card variant="glass" padding="none" className="border-purple-500/20">
      {/* Accordion Header */}
      <div onClick={onToggle} className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-xl flex items-center justify-center">
            <Radio className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Oracle Integration</h3>
            <p className="text-text-muted text-sm">Price feeds, data verification, oracle design patterns, and manipulation resistance</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-near-green/10 text-near-green border-near-green/20">Module 13 of 16</Badge>
          {completed && <Badge className="bg-emerald-500/10 text-emerald-300 border-emerald-500/20">✓ Done</Badge>}
          <Badge className="bg-red-500/10 text-red-300 border-red-500/20">Advanced</Badge>
          <Badge className="bg-purple-500/10 text-purple-300 border-purple-500/20">50 min</Badge>
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
            <div className="border-t border-purple-500/20 p-6 space-y-8">
              {/* The Big Idea */}
              <Card variant="glass" padding="lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/20 to-yellow-500/20 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-amber-400" />
                  </div>
                  <h4 className="text-lg font-bold text-text-primary">The Big Idea</h4>
                </div>
                <p className="text-text-secondary leading-relaxed">
                  Smart contracts are brilliant but blind — they can&apos;t see the outside world. Oracles are like{' '}
                  <span className="text-amber-400 font-medium">trusted scouts that bring news from outside the castle walls</span>.
                  But here&apos;s the catch: if your scout lies, your entire kingdom makes decisions based on false intelligence.{' '}
                  <span className="text-near-green font-medium">Oracle security is the most critical infrastructure in DeFi.</span>
                </p>
              </Card>

              {/* Interactive Visual */}
              <div>
                <h4 className="text-lg font-bold text-text-primary mb-2">🔍 Oracle Data Flow</h4>
                <p className="text-sm text-text-muted mb-4">External data sources → Oracle nodes → Aggregation → Consumer contracts. See how outlier rejection works.</p>
                <OracleDataFlowVisual />
              </div>

              {/* Security Gotcha */}
              <Card variant="default" padding="md" className="border-orange-500/20 bg-orange-500/5">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-orange-400 text-sm mb-1">⚠️ Security Gotcha</h4>
                    <p className="text-sm text-text-secondary">Flash loan + oracle manipulation is the #1 DeFi attack vector! An attacker borrows millions, manipulates a price feed, exploits your contract&apos;s stale price, and repays — all in one transaction. Always use time-weighted average prices (TWAP) and multi-block sampling.</p>
                  </div>
                </div>
              </Card>

              {/* Core Concepts */}
              <div>
                <h4 className="text-lg font-bold text-text-primary mb-4">🧩 Core Concepts</h4>
                <div className="space-y-3">
                  <ConceptCard icon={Database} title="Price Feed Design" preview="Aggregating multiple data sources for reliable price data." details="Reliable price feeds aggregate data from multiple independent sources and apply median filtering with outlier rejection. A single source can be manipulated, but the median of 5+ sources is extremely robust. Outlier rejection automatically discards values that deviate more than a threshold from the consensus." />
                  <ConceptCard icon={RefreshCw} title="Data Freshness" preview="Staleness detection — how old can data be before it's dangerous?" details="Stale price data is a silent killer. If your oracle hasn't updated in 30 minutes, the price could have moved 10%. Always check the timestamp of oracle data and define a maximum acceptable staleness window. If data is too old, revert the transaction rather than use stale prices." />
                  <ConceptCard icon={Server} title="Oracle Networks" preview="Decentralized oracles like Pyth and Chainlink CCIP on NEAR." details="Decentralized oracle networks like Pyth and Chainlink CCIP deploy multiple independent reporter nodes. Each node fetches data from different sources, reports independently, and the network aggregates results. This eliminates single points of failure — even if several nodes go offline, the price feed continues." />
                  <ConceptCard icon={Layers} title="Push vs Pull Oracles" preview="Different update models with different cost/freshness tradeoffs." details="Push oracles update on-chain at regular intervals regardless of whether anyone reads the data — guaranteeing freshness but burning gas constantly. Pull oracles only update when a consumer requests data on-demand — saving gas but risking staleness. Many modern protocols use a hybrid approach." />
                  <ConceptCard icon={Activity} title="Manipulation Resistance" preview="TWAP, multi-source aggregation, and circuit breakers." details="TWAP (Time-Weighted Average Price) samples prices across multiple blocks, making single-block manipulation useless. Circuit breakers halt price feeds when volatility exceeds thresholds. Multi-source aggregation means an attacker would need to manipulate multiple independent exchanges simultaneously — exponentially harder." />
                  <ConceptCard icon={Eye} title="Oracle-Free Patterns" preview="Designs that avoid oracles entirely for maximum security." details="Some designs eliminate oracle risk entirely: AMM-based pricing uses the pool's own reserves as a price source. Peer-to-peer settlement lets counterparties agree on prices directly. Prediction markets aggregate collective intelligence. These patterns trade flexibility for security — no external dependency means no oracle attack surface." />
                </div>
              </div>

              {/* Gas Costs */}
              <Card variant="default" padding="md" className="border-amber-500/20">
                <h4 className="font-semibold text-amber-400 text-sm mb-2 flex items-center gap-2">
                  <Zap className="w-4 h-4" /> Gas Costs
                </h4>
                <p className="text-xs text-text-muted mb-2">On-chain oracle updates: ~10-20 TGas per price feed update. Pull oracles save gas by only updating when needed. For frequent updates, consider off-chain computation with on-chain verification.</p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="px-2 py-1.5 rounded bg-surface border border-border text-center">
                    <span className="text-text-muted block">Push Update</span>
                    <span className="text-amber-400 font-mono">~15 TGas</span>
                  </div>
                  <div className="px-2 py-1.5 rounded bg-surface border border-border text-center">
                    <span className="text-text-muted block">Pull Request</span>
                    <span className="text-amber-400 font-mono">~8 TGas</span>
                  </div>
                  <div className="px-2 py-1.5 rounded bg-surface border border-border text-center">
                    <span className="text-text-muted block">Verification</span>
                    <span className="text-amber-400 font-mono">~5 TGas</span>
                  </div>
                </div>
              </Card>

              {/* Attack / Defense Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card variant="default" padding="md" className="border-red-500/20">
                  <h4 className="font-semibold text-red-400 text-sm mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> Attack Vectors
                  </h4>
                  <ul className="text-xs text-text-muted space-y-1.5">
                    <li className="flex items-start gap-2"><span className="text-red-400">•</span> Flash loan oracle manipulation — borrow → manipulate price → exploit → repay in one tx</li>
                    <li className="flex items-start gap-2"><span className="text-red-400">•</span> Oracle front-running — seeing oracle update tx in mempool and trading before it settles</li>
                    <li className="flex items-start gap-2"><span className="text-red-400">•</span> Single oracle failure — oracle goes offline or reports bad data</li>
                    <li className="flex items-start gap-2"><span className="text-red-400">•</span> Data source manipulation — compromising the off-chain data source directly</li>
                  </ul>
                </Card>
                <Card variant="default" padding="md" className="border-emerald-500/20">
                  <h4 className="font-semibold text-emerald-400 text-sm mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4" /> Defenses
                  </h4>
                  <ul className="text-xs text-text-muted space-y-1.5">
                    <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> TWAP and multi-block price sampling neutralize single-block manipulation</li>
                    <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> Commit-reveal oracle updates and encrypted submissions prevent front-running</li>
                    <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> Multi-oracle fallbacks with automatic failover ensure continuity</li>
                    <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> Multiple independent data sources with outlier detection resist manipulation</li>
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
                    'Oracles bridge the gap between blockchain and real-world data — they are critical DeFi infrastructure.',
                    'TWAP and multi-source aggregation are essential defenses against price manipulation attacks.',
                    'Flash loan + oracle manipulation is the most common DeFi attack vector — always use multi-block sampling.',
                    'Push oracles provide freshness guarantees; pull oracles save gas — choose based on your use case.',
                    'Always have oracle fallback strategies — no single oracle should be a point of failure.',
                  ].map((point, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                      <ArrowRight className="w-4 h-4 text-near-green flex-shrink-0 mt-0.5" />
                      {point}
                    </li>
                  ))}
                </ul>
              </Card>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default OracleIntegration;
