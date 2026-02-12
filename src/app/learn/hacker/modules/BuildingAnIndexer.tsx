'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search, ExternalLink, CheckCircle, Database, Zap, Layers, Code, Server } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

interface BuildingAnIndexerProps {
  isActive: boolean;
  onToggle: () => void;
}

const BuildingAnIndexer: React.FC<BuildingAnIndexerProps> = ({ isActive, onToggle }) => {
  const [selectedTab, setSelectedTab] = useState<string>('overview');

  return (
    <Card variant="glass" padding="none" className="border-purple-500/20">
      <div
        onClick={onToggle}
        className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center">
            <Search className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Building an Indexer</h3>
            <p className="text-text-muted text-sm">NEAR Lake, custom indexers, event processing, and real-time data pipelines</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-red-500/10 text-red-300 border-red-500/20">Advanced</Badge>
          <Badge className="bg-purple-500/10 text-purple-300 border-purple-500/20">60 min</Badge>
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
                  <Search className="w-5 h-5 text-teal-400" />
                  <h4 className="text-lg font-semibold text-text-primary">What You&apos;ll Learn</h4>
                </div>
                <ul className="space-y-3">
                  {[
                    'NEAR Lake framework — streaming blocks from S3 for high-throughput indexing',
                    'Building custom indexers that track specific contracts, events, and state changes',
                    'Event-driven architecture: NEP-297 events and how to process them efficiently',
                    'Database design for indexed blockchain data (PostgreSQL, ClickHouse, etc.)',
                    'Production indexer patterns: fault tolerance, catch-up, and real-time APIs',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-text-secondary">
                      <CheckCircle className="w-4 h-4 text-near-green mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Card variant="default" padding="md" className="mt-4 border-teal-500/20 bg-teal-500/5">
                  <p className="text-sm text-text-secondary">
                    <span className="text-teal-400 font-semibold">Why this matters:</span> Every serious dApp needs an indexer. You can&apos;t build a DEX dashboard, NFT marketplace, or analytics platform by querying the RPC directly. Indexers are the backbone of blockchain data infrastructure.
                  </p>
                </Card>
              </div>
            )}

            {selectedTab === 'learn' && (
              <div className="space-y-8">
                {/* Section 1: NEAR Lake Framework */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Database className="w-5 h-5 text-blue-400" />
                    NEAR Lake Framework
                  </h4>
                  <p className="text-text-secondary mb-3">
                    NEAR Lake stores every block as JSON files in AWS S3. The Lake framework streams these blocks to your indexer — no need to run a full node.
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-text-secondary border border-border">
                    <div className="text-blue-400 mb-2">{'// TypeScript: Basic NEAR Lake indexer'}</div>
                    <div className="text-near-green">{'import { startStream, types } from "near-lake-framework";'}</div>
                    <div className="mt-1 text-near-green">{'const lakeConfig: types.LakeConfig = {'}</div>
                    <div className="text-near-green">{'  s3BucketName: "near-lake-data-mainnet",'}</div>
                    <div className="text-near-green">{'  s3RegionName: "eu-central-1",'}</div>
                    <div className="text-near-green">{'  startBlockHeight: 130_000_000,'}</div>
                    <div className="text-near-green">{'};'}</div>
                    <div className="mt-1 text-near-green">{'async function handleBlock('}</div>
                    <div className="text-near-green">{'  block: types.Block'}</div>
                    <div className="text-near-green">{') {'}</div>
                    <div className="text-near-green">{'  const blockHeight = block.blockHeight;'}</div>
                    <div className="text-near-green">{'  '}</div>
                    <div className="text-near-green">{'  for (const shard of block.shards()) {'}</div>
                    <div className="text-near-green">{'    for (const receipt of shard.receiptExecutionOutcomes) {'}</div>
                    <div className="text-near-green">{'      if (receipt.receipt.receiverId === "target-contract.near") {'}</div>
                    <div className="text-near-green">{'        await processReceipt(receipt);'}</div>
                    <div className="text-near-green">{'      }'}</div>
                    <div className="text-near-green">{'    }'}</div>
                    <div className="text-near-green">{'  }'}</div>
                    <div className="text-near-green">{'}'}</div>
                    <div className="mt-1 text-near-green">{'await startStream(lakeConfig, handleBlock);'}</div>
                  </div>
                </section>

                {/* Section 2: NEP-297 Events */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    NEP-297 Events
                  </h4>
                  <p className="text-text-secondary mb-3">
                    NEP-297 defines a standard event format for NEAR contracts. Events are emitted as structured logs that indexers can efficiently parse:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-text-secondary border border-border">
                    <div className="text-yellow-400 mb-2">{'// Rust: Emitting NEP-297 events'}</div>
                    <div className="text-near-green">{'use near_sdk::log;'}</div>
                    <div className="mt-1 text-near-green">{'// Standard event format:'}</div>
                    <div className="text-near-green">{'// EVENT_JSON:{"standard":"nep171","version":"1.0.0",'}</div>
                    <div className="text-near-green">{'//   "event":"nft_mint","data":[{...}]}'}</div>
                    <div className="mt-1 text-near-green">{'fn emit_event(event: &str, data: &str) {'}</div>
                    <div className="text-near-green">{'    log!(format!('}</div>
                    <div className="text-near-green">{'        "EVENT_JSON:{{\"standard\":\"myapp\",\"version\":\"1.0.0\","'}</div>
                    <div className="text-near-green">{'        "\"event\":\"{}\",\"data\":[{}]}}",  event, data'}</div>
                    <div className="text-near-green">{'    ));'}</div>
                    <div className="text-near-green">{'}'}</div>
                    <div className="mt-2 text-yellow-400">{'// TypeScript: Parsing events in indexer'}</div>
                    <div className="text-near-green">{'function parseEvents(logs: string[]) {'}</div>
                    <div className="text-near-green">{'  return logs'}</div>
                    <div className="text-near-green">{'    .filter(log => log.startsWith("EVENT_JSON:"))'}</div>
                    <div className="text-near-green">{'    .map(log => JSON.parse(log.slice("EVENT_JSON:".length)));'}</div>
                    <div className="text-near-green">{'}'}</div>
                  </div>
                </section>

                {/* Section 3: Database Design */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-green-400" />
                    Database Design
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Choosing the right database and schema design is critical for indexer performance:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Card variant="default" padding="md" className="border-blue-500/20">
                      <h5 className="font-semibold text-blue-400 text-sm mb-2">PostgreSQL</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• Best for relational queries</li>
                        <li>• JSONB for flexible event data</li>
                        <li>• Mature tooling and ORMs</li>
                        <li>• Good for: general purpose indexing</li>
                      </ul>
                    </Card>
                    <Card variant="default" padding="md" className="border-green-500/20">
                      <h5 className="font-semibold text-green-400 text-sm mb-2">ClickHouse</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• Columnar storage for analytics</li>
                        <li>• 100x faster aggregation queries</li>
                        <li>• Great compression ratio</li>
                        <li>• Good for: analytics, dashboards</li>
                      </ul>
                    </Card>
                    <Card variant="default" padding="md" className="border-purple-500/20">
                      <h5 className="font-semibold text-purple-400 text-sm mb-2">Redis + PostgreSQL</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• Redis for real-time hot data</li>
                        <li>• PostgreSQL for historical queries</li>
                        <li>• WebSocket push from Redis</li>
                        <li>• Good for: real-time apps, alerts</li>
                      </ul>
                    </Card>
                  </div>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-text-secondary border border-border mt-3">
                    <div className="text-green-400 mb-2">{'-- PostgreSQL schema example for token transfer indexer'}</div>
                    <div className="text-near-green">{'CREATE TABLE token_transfers ('}</div>
                    <div className="text-near-green">{'  id BIGSERIAL PRIMARY KEY,'}</div>
                    <div className="text-near-green">{'  block_height BIGINT NOT NULL,'}</div>
                    <div className="text-near-green">{'  receipt_id TEXT NOT NULL,'}</div>
                    <div className="text-near-green">{'  token_id TEXT NOT NULL,'}</div>
                    <div className="text-near-green">{'  sender TEXT NOT NULL,'}</div>
                    <div className="text-near-green">{'  receiver TEXT NOT NULL,'}</div>
                    <div className="text-near-green">{'  amount NUMERIC NOT NULL,'}</div>
                    <div className="text-near-green">{'  timestamp TIMESTAMPTZ NOT NULL'}</div>
                    <div className="text-near-green">{');'}</div>
                    <div className="text-near-green">{'CREATE INDEX idx_transfers_token ON token_transfers(token_id);'}</div>
                    <div className="text-near-green">{'CREATE INDEX idx_transfers_sender ON token_transfers(sender);'}</div>
                    <div className="text-near-green">{'CREATE INDEX idx_transfers_block ON token_transfers(block_height);'}</div>
                  </div>
                </section>

                {/* Section 4: Production Patterns */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Server className="w-5 h-5 text-orange-400" />
                    Production Indexer Patterns
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Running an indexer in production requires handling restarts, data consistency, and performance:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-text-secondary border border-border">
                    <div className="text-orange-400 mb-2">{'// Production indexer with checkpointing'}</div>
                    <div className="text-near-green">{'class ProductionIndexer {'}</div>
                    <div className="text-near-green">{'  async run() {'}</div>
                    <div className="text-near-green">{'    // Resume from last checkpoint'}</div>
                    <div className="text-near-green">{'    const lastBlock = await db.query('}</div>
                    <div className="text-near-green">{'      "SELECT MAX(block_height) FROM indexer_state"'}</div>
                    <div className="text-near-green">{'    );'}</div>
                    <div className="text-near-green">{'    const startBlock = lastBlock.rows[0].max + 1;'}</div>
                    <div className="mt-1 text-near-green">{'    const lake = new LakeFramework({'}</div>
                    <div className="text-near-green">{'      startBlockHeight: startBlock,'}</div>
                    <div className="text-near-green">{'      network: "mainnet",'}</div>
                    <div className="text-near-green">{'    });'}</div>
                    <div className="mt-1 text-near-green">{'    for await (const block of lake.stream()) {'}</div>
                    <div className="text-near-green">{'      await db.transaction(async (tx) => {'}</div>
                    <div className="text-near-green">{'        // Process all events in this block'}</div>
                    <div className="text-near-green">{'        await this.processBlock(tx, block);'}</div>
                    <div className="text-near-green">{'        // Save checkpoint atomically'}</div>
                    <div className="text-near-green">{'        await tx.query('}</div>
                    <div className="text-near-green">{'          "INSERT INTO indexer_state (block_height) VALUES ($1)",'}</div>
                    <div className="text-near-green">{'          [block.blockHeight]'}</div>
                    <div className="text-near-green">{'        );'}</div>
                    <div className="text-near-green">{'      });'}</div>
                    <div className="text-near-green">{'    }'}</div>
                    <div className="text-near-green">{'  }'}</div>
                    <div className="text-near-green">{'}'}</div>
                  </div>
                </section>

                {/* Section 5: QueryAPI */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Code className="w-5 h-5 text-cyan-400" />
                    NEAR QueryAPI
                  </h4>
                  <p className="text-text-secondary mb-3">
                    NEAR QueryAPI lets you deploy indexing logic as serverless functions — no infrastructure to manage:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-text-secondary border border-border">
                    <div className="text-cyan-400 mb-2">{'// QueryAPI indexer function'}</div>
                    <div className="text-near-green">{'// Deploy to: https://near.org/dataplatform.near/widget/QueryApi.App'}</div>
                    <div className="mt-1 text-near-green">{'import { Block } from "@near-lake/primitives";'}</div>
                    <div className="mt-1 text-near-green">{'async function getBlock(block: Block) {'}</div>
                    <div className="text-near-green">{'  const events = block.events();'}</div>
                    <div className="text-near-green">{'  '}</div>
                    <div className="text-near-green">{'  for (const event of events) {'}</div>
                    <div className="text-near-green">{'    if (event.standard === "nep171" && event.event === "nft_mint") {'}</div>
                    <div className="text-near-green">{'      await context.db.NftMints.insert({'}</div>
                    <div className="text-near-green">{'        token_id: event.data[0].token_ids[0],'}</div>
                    <div className="text-near-green">{'        owner: event.data[0].owner_id,'}</div>
                    <div className="text-near-green">{'        block_height: block.blockHeight,'}</div>
                    <div className="text-near-green">{'      });'}</div>
                    <div className="text-near-green">{'    }'}</div>
                    <div className="text-near-green">{'  }'}</div>
                    <div className="text-near-green">{'}'}</div>
                  </div>
                  <Card variant="default" padding="md" className="mt-3 border-cyan-500/20 bg-cyan-500/5">
                    <p className="text-xs text-text-secondary">
                      <strong className="text-cyan-400">QueryAPI advantage:</strong> Auto-provisioned PostgreSQL, GraphQL API, WebSocket subscriptions — all from a single JavaScript function. Great for prototyping and medium-scale apps.
                    </p>
                  </Card>
                </section>
              </div>
            )}

            {selectedTab === 'practice' && (
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-text-primary">Exercises</h4>

                <Card variant="default" padding="md" className="border-red-500/20">
                  <h5 className="font-semibold text-red-400 text-sm mb-2">🔴 Exercise 1: Token Transfer Indexer</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Build a NEAR Lake indexer that tracks all FT transfers for a specific token. Store in PostgreSQL and build a REST API that returns transfer history by account.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-red-500/20">
                  <h5 className="font-semibold text-red-400 text-sm mb-2">🔴 Exercise 2: NFT Activity Feed</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Create a real-time NFT activity feed: index all NEP-171 events (mint, transfer, burn) and serve them via WebSocket. Build a simple UI that shows live NFT activity.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-red-500/20">
                  <h5 className="font-semibold text-red-400 text-sm mb-2">🔴 Exercise 3: DEX Analytics</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Index Ref Finance swap events. Calculate: 24h volume, top trading pairs, unique traders, and average swap size. Store in ClickHouse and build a dashboard.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-red-500/20">
                  <h5 className="font-semibold text-red-400 text-sm mb-2">🔴 Exercise 4: QueryAPI Deployment</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Deploy an indexer using NEAR QueryAPI. Track contract deployments on mainnet and expose a GraphQL API. Query it from a frontend to show recently deployed contracts.
                  </p>
                </Card>
              </div>
            )}

            {selectedTab === 'resources' && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-text-primary">Resources</h4>
                {[
                  { title: 'NEAR Lake Framework', url: 'https://docs.near.org/concepts/advanced/near-lake-framework', desc: 'Official NEAR Lake documentation for building indexers' },
                  { title: 'NEAR Lake Primitives', url: 'https://github.com/near/near-lake-framework-js', desc: 'JavaScript SDK for NEAR Lake' },
                  { title: 'NEAR QueryAPI', url: 'https://docs.near.org/concepts/advanced/near-indexer-framework', desc: 'Serverless indexing with auto-provisioned infrastructure' },
                  { title: 'NEP-297 Events Standard', url: 'https://nomicon.io/Standards/EventsFormat', desc: 'The standard format for contract events on NEAR' },
                  { title: 'NEAR Indexer Examples', url: 'https://github.com/near-examples/near-lake-indexer', desc: 'Example indexer implementations for reference' },
                  { title: 'nearblocks.io Source', url: 'https://github.com/nearblocks/nearblocks', desc: 'Open-source block explorer built on NEAR indexing' },
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

export default BuildingAnIndexer;
