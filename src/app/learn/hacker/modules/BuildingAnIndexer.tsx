'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import {
  ChevronDown, ChevronUp, CheckCircle2, Lightbulb, Zap,
  AlertTriangle, ArrowRight, Shield, Search, Database,
  Server, Layers, Activity, Filter, FileCode, Radio,
} from 'lucide-react';

// ─── Interactive Visual: Indexer Pipeline ───────────────────────────────────

function IndexerPipeline() {
  const [activeStage, setActiveStage] = useState<number | null>(null);

  const stages = [
    {
      label: 'NEAR Lake',
      sub: 'S3 Bucket',
      icon: '🪣',
      color: 'from-blue-500/20 to-cyan-500/20',
      border: 'border-blue-500/30',
      data: `// Raw S3 object — serialized block
{
  "block": {
    "header": { "height": 109452871, "hash": "3Xjv..." },
    "chunks": [{ "shard_id": 0, "chunk_hash": "7kQ..." }]
  },
  "shards": [{ "shard_id": 0, "chunk": { ... },
    "receipt_execution_outcomes": [ ... ] }]
}`,
    },
    {
      label: 'Block Parser',
      sub: 'Deserialize',
      icon: '⚙️',
      color: 'from-orange-500/20 to-amber-500/20',
      border: 'border-orange-500/30',
      data: `// Parsed receipts & outcomes
{
  "block_height": 109452871,
  "timestamp": "2024-01-15T12:00:01Z",
  "receipts": [
    {
      "receipt_id": "BxR3...",
      "receiver_id": "app.near",
      "actions": [{ "FunctionCall": {
        "method": "ft_transfer",
        "args": "eyJ..." } }]
    }
  ]
}`,
    },
    {
      label: 'Filter',
      sub: 'Transform',
      icon: '🔍',
      color: 'from-purple-500/20 to-pink-500/20',
      border: 'border-purple-500/30',
      data: `// Filtered: only ft_transfer events
{
  "block_height": 109452871,
  "event": "ft_transfer",
  "sender": "alice.near",
  "receiver": "bob.near",
  "amount": "1000000000000000000000000",
  "token": "wrap.near",
  "status": "SUCCESS"
}`,
    },
    {
      label: 'Database',
      sub: 'PostgreSQL',
      icon: '🗄️',
      color: 'from-green-500/20 to-emerald-500/20',
      border: 'border-green-500/30',
      data: `-- Indexed rows in transfers table
INSERT INTO transfers (
  block_height, timestamp, sender,
  receiver, amount, token, status
) VALUES (
  109452871, '2024-01-15 12:00:01',
  'alice.near', 'bob.near',
  '1.0', 'wrap.near', 'SUCCESS'
);
-- Last indexed: 109452871 ✓`,
    },
    {
      label: 'API',
      sub: 'REST/GraphQL',
      icon: '🌐',
      color: 'from-cyan-500/20 to-blue-500/20',
      border: 'border-cyan-500/30',
      data: `// GET /api/transfers?sender=alice.near
{
  "data": [{
    "block": 109452871,
    "time": "2024-01-15T12:00:01Z",
    "from": "alice.near",
    "to": "bob.near",
    "amount": "1.0 NEAR",
    "status": "success"
  }],
  "meta": { "indexer_block": 109452871,
    "chain_block": 109452873, "lag": 2 }
}`,
    },
  ];

  return (
    <div className="relative py-6">
      <div className="flex flex-col gap-3">
        {/* Pipeline stages */}
        <div className="flex flex-col sm:flex-row items-stretch gap-2">
          {stages.map((stage, i) => (
            <React.Fragment key={i}>
              <motion.div
                className={cn(
                  'flex-1 rounded-xl border p-3 cursor-pointer transition-all',
                  activeStage === i
                    ? `bg-gradient-to-br ${stage.color} ${stage.border} shadow-lg`
                    : 'bg-surface border-border hover:border-border-hover'
                )}
                whileHover={{ scale: 1.02 }}
                onClick={() => setActiveStage(activeStage === i ? null : i)}
              >
                <div className="text-center">
                  <span className="text-xl">{stage.icon}</span>
                  <p className="text-xs font-semibold text-text-primary mt-1">{stage.label}</p>
                  <p className="text-[10px] text-text-muted">{stage.sub}</p>
                </div>
              </motion.div>
              {i < stages.length - 1 && (
                <div className="hidden sm:flex items-center justify-center">
                  <ArrowRight className="w-4 h-4 text-orange-400/60" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Detail panel */}
        <AnimatePresence>
          {activeStage !== null && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <Card variant="default" padding="md" className="border-orange-500/20 bg-orange-500/5">
                <p className="text-xs font-semibold text-orange-400 mb-2">
                  Stage {activeStage + 1}: {stages[activeStage].label} — Data Shape
                </p>
                <pre className="text-xs text-text-muted font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto">
                  {stages[activeStage].data}
                </pre>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <p className="text-center text-xs text-text-muted mt-4">
        Click each stage to see how data transforms through the pipeline →
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
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500/20 to-amber-500/20 border border-orange-500/20 flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-orange-400" />
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

  const question = 'What is the primary data source for NEAR Lake indexers?';
  const options = [
    'RPC node WebSocket subscriptions',
    'S3 buckets containing serialized blocks and shards',
    'The NEAR validator network directly',
    'A centralized NEAR Foundation API',
  ];
  const explanation = 'Correct! NEAR Lake streams block data from S3 buckets where validators publish serialized blocks and shards. This is the official and most reliable way to build NEAR indexers.';
  const wrongExplanation = 'Not quite. NEAR Lake uses S3 buckets where serialized blocks and shards are stored — not WebSockets, validators, or centralized APIs. This approach provides reliable, replayable access to all block data.';

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

interface BuildingAnIndexerProps {
  isActive: boolean;
  onToggle: () => void;
}

const BuildingAnIndexer: React.FC<BuildingAnIndexerProps> = ({ isActive, onToggle }) => {
  return (
    <Card variant="glass" padding="none" className="border-orange-500/20">
      {/* Accordion Header */}
      <div onClick={onToggle} className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
            <Search className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Building an Indexer</h3>
            <p className="text-text-muted text-sm">NEAR Lake framework, real-time block streaming, data pipelines, and query optimization</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
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
            <div className="border-t border-orange-500/20 p-6 space-y-8">
              {/* The Big Idea */}
              <Card variant="glass" padding="lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500/20 to-amber-500/20 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-orange-400" />
                  </div>
                  <h4 className="text-lg font-bold text-text-primary">The Big Idea</h4>
                </div>
                <p className="text-text-secondary leading-relaxed">
                  Searching the blockchain directly is like searching a library by opening every book. An indexer is like the
                  library&apos;s <span className="text-orange-400 font-medium">card catalog</span> — it reads every book once,
                  organizes the information, and lets you find anything instantly. Without it, even simple queries would take hours.
                  On NEAR, the <span className="text-near-green font-medium">NEAR Lake framework</span> streams blocks from S3
                  as they&apos;re produced, giving your indexer a firehose of data to organize.
                </p>
              </Card>

              {/* Interactive Visual */}
              <div>
                <h4 className="text-lg font-bold text-text-primary mb-2">🔍 Indexer Pipeline</h4>
                <p className="text-sm text-text-muted mb-4">Data flows from NEAR Lake through parsing, filtering, storage, and finally your API. Each stage transforms raw blockchain data into something queryable.</p>
                <IndexerPipeline />
              </div>

              {/* Security Gotcha */}
              <Card variant="default" padding="md" className="border-orange-500/20 bg-orange-500/5">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-orange-400 text-sm mb-1">⚠️ Security Gotcha</h4>
                    <p className="text-sm text-text-secondary">
                      Indexers can serve <span className="text-orange-400 font-medium">stale data</span> if they fall behind!
                      Always expose a &quot;last indexed block&quot; health endpoint. DApps should check indexer freshness and
                      fall back to RPC for critical operations. A user seeing outdated balances could make costly mistakes.
                    </p>
                  </div>
                </div>
              </Card>

              {/* Core Concepts */}
              <div>
                <h4 className="text-lg font-bold text-text-primary mb-4">🧩 Core Concepts</h4>
                <div className="space-y-3">
                  <ConceptCard
                    icon={Radio}
                    title="NEAR Lake Framework"
                    preview="Streaming blocks from S3 as they're produced — the official indexing approach."
                    details="NEAR Lake reads serialized blocks and shards from AWS S3 buckets maintained by NEAR validators. Unlike RPC polling, you get guaranteed delivery of every block. You specify a starting block height, and the framework streams every subsequent block. It's like subscribing to a newspaper — every issue arrives in order, and you can start from any back issue."
                  />
                  <ConceptCard
                    icon={Layers}
                    title="Block & Chunk Parsing"
                    preview="Extracting transactions, receipts, and execution outcomes from raw block data."
                    details="NEAR blocks contain chunks (one per shard), and each chunk contains transactions, receipts, and execution outcomes. Parsing means deserializing these structures and extracting the data you need. Receipts are especially important — they represent the actual execution results, including cross-contract calls, and contain the events your indexer cares about."
                  />
                  <ConceptCard
                    icon={Filter}
                    title="Receipt Filtering"
                    preview="Efficiently selecting only the events and contracts you care about."
                    details="A raw block can contain thousands of receipts across all shards. Filtering early — by contract ID, method name, or event type — drastically reduces processing load. Think of it as mail sorting: you only open letters addressed to you, not every piece of mail in the building."
                  />
                  <ConceptCard
                    icon={Database}
                    title="State Reconstruction"
                    preview="Building a queryable view of contract state from receipt history."
                    details="Instead of querying contract state via RPC (which gives you a snapshot), indexers reconstruct state by replaying receipts. This gives you historical state at any block height. It's like having every version of a document, not just the latest — essential for analytics, auditing, and debugging."
                  />
                  <ConceptCard
                    icon={Activity}
                    title="Indexer Reliability"
                    preview="Handling restarts, missed blocks, and chain reorganizations gracefully."
                    details="Production indexers must persist their last processed block height and resume cleanly after crashes. You need idempotent processing (re-processing a block doesn't create duplicates) and checkpoint management. Some indexers also handle short chain reorganizations by detecting when the parent hash doesn't match and re-indexing from the fork point."
                  />
                  <ConceptCard
                    icon={FileCode}
                    title="Query Patterns"
                    preview="Designing your database schema for the queries you need."
                    details="Don't mirror the raw block structure in your database — design your schema around your query patterns. If you need 'all transfers for account X', create an index on (account, block_height). If you need 'token price at time T', create a time-series table. The right schema turns a 30-second query into a 5-millisecond lookup."
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
                    <li className="flex items-start gap-2"><span className="text-red-400">•</span> <strong className="text-text-secondary">Data staleness:</strong> Indexer falls behind, serving outdated state to users</li>
                    <li className="flex items-start gap-2"><span className="text-red-400">•</span> <strong className="text-text-secondary">Data poisoning:</strong> Malicious data injection into the indexer database</li>
                    <li className="flex items-start gap-2"><span className="text-red-400">•</span> <strong className="text-text-secondary">DoS via queries:</strong> Crafted queries that overload the indexer service</li>
                    <li className="flex items-start gap-2"><span className="text-red-400">•</span> <strong className="text-text-secondary">Chain reorg:</strong> Short reorg causes incorrect indexed state</li>
                  </ul>
                </Card>
                <Card variant="default" padding="md" className="border-emerald-500/20">
                  <h4 className="font-semibold text-emerald-400 text-sm mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4" /> Defenses
                  </h4>
                  <ul className="text-xs text-text-muted space-y-1.5">
                    <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> Health monitoring with block height lag alerts and auto-fallback</li>
                    <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> Verify all data against on-chain receipts with cryptographic proofs</li>
                    <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> Query rate limiting and complexity caps to prevent resource exhaustion</li>
                    <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> Reorg detection and re-indexing from safe checkpoint</li>
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
                    'NEAR Lake streams blocks from S3 — the standard way to build NEAR indexers.',
                    'Filter early in your pipeline to reduce processing costs and storage.',
                    'Always handle restarts gracefully — persist your last processed block height.',
                    'Expose health endpoints showing indexer lag so DApps can detect staleness.',
                    'Design your database schema around your query patterns, not the raw block structure.',
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

export default BuildingAnIndexer;
