'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Brain, ExternalLink, CheckCircle, Code, Zap, Database, Globe, Lock } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

interface AiAgentIntegrationProps {
  isActive: boolean;
  onToggle: () => void;
}

const AiAgentIntegration: React.FC<AiAgentIntegrationProps> = ({ isActive, onToggle }) => {
  const [selectedTab, setSelectedTab] = useState<string>('overview');

  return (
    <Card variant="glass" padding="none" className="border-purple-500/20">
      <div
        onClick={onToggle}
        className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">AI Agent Integration</h3>
            <p className="text-text-muted text-sm">Connecting LLMs to smart contracts, tool-use patterns, and verifiable AI</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-red-500/10 text-red-300 border-red-500/20">Advanced</Badge>
          <Badge className="bg-purple-500/10 text-purple-300 border-purple-500/20">55 min</Badge>
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
                  <Brain className="w-5 h-5 text-pink-400" />
                  <h4 className="text-lg font-semibold text-text-primary">What You&apos;ll Learn</h4>
                </div>
                <ul className="space-y-3">
                  {[
                    'Connecting LLMs to NEAR smart contracts as tool-use backends',
                    'Building AI-powered dApps where LLMs decide on-chain actions',
                    'Verifiable AI: proving that an AI agent made a specific decision',
                    'Oracle patterns for bringing off-chain AI inference on-chain',
                    'Production patterns for AI + blockchain integration',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-text-secondary">
                      <CheckCircle className="w-4 h-4 text-near-green mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Card variant="default" padding="md" className="mt-4 border-pink-500/20 bg-pink-500/5">
                  <p className="text-sm text-text-secondary">
                    <span className="text-pink-400 font-semibold">Why this matters:</span> AI agents need to interact with blockchains to manage assets, execute trades, and coordinate. This module teaches you how to build the bridge between AI reasoning and on-chain execution.
                  </p>
                </Card>
              </div>
            )}

            {selectedTab === 'learn' && (
              <div className="space-y-8">
                {/* Section 1: LLM Tool Use for NEAR */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Code className="w-5 h-5 text-blue-400" />
                    LLM Tool Use for NEAR
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Modern LLMs support tool/function calling. You can expose NEAR contract methods as tools that the LLM can invoke:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-text-secondary border border-border">
                    <div className="text-blue-400 mb-2">{'// Define NEAR contract methods as LLM tools'}</div>
                    <div className="text-near-green">{'const nearTools = ['}</div>
                    <div className="text-near-green">{'  {'}</div>
                    <div className="text-near-green">{'    name: "check_balance",'}</div>
                    <div className="text-near-green">{'    description: "Check token balance for an account",'}</div>
                    <div className="text-near-green">{'    parameters: {'}</div>
                    <div className="text-near-green">{'      account_id: { type: "string", description: "NEAR account ID" },'}</div>
                    <div className="text-near-green">{'      token_id: { type: "string", description: "Token contract ID" },'}</div>
                    <div className="text-near-green">{'    },'}</div>
                    <div className="text-near-green">{'    execute: async (args) => {'}</div>
                    <div className="text-near-green">{'      return nearView(args.token_id, "ft_balance_of", {'}</div>
                    <div className="text-near-green">{'        account_id: args.account_id'}</div>
                    <div className="text-near-green">{'      });'}</div>
                    <div className="text-near-green">{'    }'}</div>
                    <div className="text-near-green">{'  },'}</div>
                    <div className="text-near-green">{'  {'}</div>
                    <div className="text-near-green">{'    name: "swap_tokens",'}</div>
                    <div className="text-near-green">{'    description: "Swap tokens on a DEX",'}</div>
                    <div className="text-near-green">{'    parameters: {'}</div>
                    <div className="text-near-green">{'      token_in: { type: "string" },'}</div>
                    <div className="text-near-green">{'      token_out: { type: "string" },'}</div>
                    <div className="text-near-green">{'      amount: { type: "string" },'}</div>
                    <div className="text-near-green">{'    },'}</div>
                    <div className="text-near-green">{'    execute: async (args) => {'}</div>
                    <div className="text-near-green">{'      return nearCall("dex.near", "swap", args);'}</div>
                    <div className="text-near-green">{'    }'}</div>
                    <div className="text-near-green">{'  }'}</div>
                    <div className="text-near-green">{'];'}</div>
                  </div>
                </section>

                {/* Section 2: AI Decision Pipeline */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    AI Decision Pipeline
                  </h4>
                  <p className="text-text-secondary mb-3">
                    The core pattern: observe on-chain state → reason with LLM → execute on-chain action → verify result:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-text-secondary border border-border">
                    <div className="text-yellow-400 mb-2">{'// AI decision pipeline'}</div>
                    <div className="text-near-green">{'async function aiDecisionLoop() {'}</div>
                    <div className="text-near-green">{'  // 1. Observe: gather on-chain state'}</div>
                    <div className="text-near-green">{'  const prices = await nearView("oracle.near", "get_prices");'}</div>
                    <div className="text-near-green">{'  const portfolio = await nearView("vault.near", "get_holdings");'}</div>
                    <div className="text-near-green">{'  const events = await indexer.getRecentEvents();'}</div>
                    <div className="mt-1 text-near-green">{'  // 2. Reason: LLM analyzes and decides'}</div>
                    <div className="text-near-green">{'  const decision = await llm.complete({'}</div>
                    <div className="text-near-green">{'    system: "You are a DeFi portfolio manager...",'}</div>
                    <div className="text-near-green">{'    tools: nearTools,'}</div>
                    <div className="text-near-green">{'    messages: [{ role: "user", content: `'}</div>
                    <div className="text-near-green">{'      Current prices: ${JSON.stringify(prices)}'}</div>
                    <div className="text-near-green">{'      Portfolio: ${JSON.stringify(portfolio)}'}</div>
                    <div className="text-near-green">{'      Recent events: ${JSON.stringify(events)}'}</div>
                    <div className="text-near-green">{'      What actions should we take?`'}</div>
                    <div className="text-near-green">{'    }]'}</div>
                    <div className="text-near-green">{'  });'}</div>
                    <div className="mt-1 text-near-green">{'  // 3. Execute: run the decided tools'}</div>
                    <div className="text-near-green">{'  for (const toolCall of decision.tool_calls) {'}</div>
                    <div className="text-near-green">{'    await executeWithSafetyChecks(toolCall);'}</div>
                    <div className="text-near-green">{'  }'}</div>
                    <div className="text-near-green">{'}'}</div>
                  </div>
                </section>

                {/* Section 3: Verifiable AI */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Lock className="w-5 h-5 text-red-400" />
                    Verifiable AI Decisions
                  </h4>
                  <p className="text-text-secondary mb-3">
                    How do you prove an AI agent made a specific decision? Verifiable AI combines on-chain logging with cryptographic attestations:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card variant="default" padding="md" className="border-red-500/20">
                      <h5 className="font-semibold text-red-400 text-sm mb-2">On-Chain Audit Trail</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• Log every decision with input hash + output hash</li>
                        <li>• Store model version and prompt hash on-chain</li>
                        <li>• Anyone can verify: same inputs → same outputs</li>
                        <li>• Dispute resolution via re-execution</li>
                      </ul>
                    </Card>
                    <Card variant="default" padding="md" className="border-green-500/20">
                      <h5 className="font-semibold text-green-400 text-sm mb-2">TEE Attestation</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• Run inference in Trusted Execution Environment</li>
                        <li>• TEE produces hardware attestation of computation</li>
                        <li>• Attestation verifiable on-chain</li>
                        <li>• Proves AI ran specific model with specific inputs</li>
                      </ul>
                    </Card>
                  </div>
                </section>

                {/* Section 4: AI Oracle Pattern */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Database className="w-5 h-5 text-purple-400" />
                    AI Oracle Pattern
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Bring AI inference results on-chain through an oracle pattern:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-text-secondary border border-border">
                    <div className="text-purple-400 mb-2">{'// Rust: AI Oracle contract'}</div>
                    <div className="text-near-green">{'#[near]'}</div>
                    <div className="text-near-green">{'impl AiOracle {'}</div>
                    <div className="text-near-green">{'    // Off-chain AI computes, authorized relayer submits result'}</div>
                    <div className="text-near-green">{'    pub fn submit_inference('}</div>
                    <div className="text-near-green">{'        &mut self,'}</div>
                    <div className="text-near-green">{'        request_id: String,'}</div>
                    <div className="text-near-green">{'        result: String,'}</div>
                    <div className="text-near-green">{'        model_hash: String,'}</div>
                    <div className="text-near-green">{'        input_hash: String,'}</div>
                    <div className="text-near-green">{'    ) {'}</div>
                    <div className="text-near-green">{'        require!(self.authorized_relayers'}</div>
                    <div className="text-near-green">{'            .contains(&env::predecessor_account_id()));'}</div>
                    <div className="text-near-green">{'        '}</div>
                    <div className="text-near-green">{'        self.results.insert(&request_id, &InferenceResult {'}</div>
                    <div className="text-near-green">{'            result,'}</div>
                    <div className="text-near-green">{'            model_hash,'}</div>
                    <div className="text-near-green">{'            input_hash,'}</div>
                    <div className="text-near-green">{'            timestamp: env::block_timestamp(),'}</div>
                    <div className="text-near-green">{'            relayer: env::predecessor_account_id(),'}</div>
                    <div className="text-near-green">{'        });'}</div>
                    <div className="text-near-green">{'    }'}</div>
                    <div className="text-near-green">{'}'}</div>
                  </div>
                </section>

                {/* Section 5: Production Considerations */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-cyan-400" />
                    Production Considerations
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Building production AI-blockchain integrations requires careful attention to:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Card variant="default" padding="md">
                      <h5 className="font-semibold text-text-primary text-sm mb-2">Latency</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• LLM inference: 1-30 seconds</li>
                        <li>• NEAR transaction: ~1 second</li>
                        <li>• Pre-compute decisions when possible</li>
                        <li>• Use smaller models for time-sensitive ops</li>
                      </ul>
                    </Card>
                    <Card variant="default" padding="md">
                      <h5 className="font-semibold text-text-primary text-sm mb-2">Cost</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• Batch inferences to reduce API costs</li>
                        <li>• Cache frequent queries</li>
                        <li>• Use tiered models (fast/cheap → slow/smart)</li>
                        <li>• Gas budget per AI decision</li>
                      </ul>
                    </Card>
                    <Card variant="default" padding="md">
                      <h5 className="font-semibold text-text-primary text-sm mb-2">Safety</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• Rate limits on AI-initiated transactions</li>
                        <li>• Maximum value per decision</li>
                        <li>• Human-in-the-loop for high-value ops</li>
                        <li>• Kill switch via access key revocation</li>
                      </ul>
                    </Card>
                  </div>
                </section>
              </div>
            )}

            {selectedTab === 'practice' && (
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-text-primary">Exercises</h4>

                <Card variant="default" padding="md" className="border-red-500/20">
                  <h5 className="font-semibold text-red-400 text-sm mb-2">🔴 Exercise 1: LLM-Powered Contract Interaction</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Build a TypeScript app that takes natural language instructions (&quot;transfer 5 NEAR to bob.near&quot;) and uses an LLM with tool-use to construct and execute the correct NEAR transaction.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-red-500/20">
                  <h5 className="font-semibold text-red-400 text-sm mb-2">🔴 Exercise 2: AI Oracle Service</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Deploy an AI oracle contract on testnet. Build an off-chain service that receives inference requests, runs them through an LLM, and submits results on-chain with proper attestation.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-red-500/20">
                  <h5 className="font-semibold text-red-400 text-sm mb-2">🔴 Exercise 3: AI-Governed DAO</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Create a DAO where an AI agent has a council seat. The agent analyzes proposals using an LLM, votes based on predefined criteria, and publishes reasoning on-chain. Test with various proposal types.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-red-500/20">
                  <h5 className="font-semibold text-red-400 text-sm mb-2">🔴 Exercise 4: Verifiable AI Decision Logger</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Build a system that logs every AI decision on-chain with input hash, model hash, and output hash. Create a verification tool that can replay any decision and confirm the output matches.
                  </p>
                </Card>
              </div>
            )}

            {selectedTab === 'resources' && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-text-primary">Resources</h4>
                {[
                  { title: 'NEAR AI Agent Framework', url: 'https://docs.near.ai', desc: 'Official framework for building AI agents on NEAR' },
                  { title: 'OpenAI Function Calling', url: 'https://platform.openai.com/docs/guides/function-calling', desc: 'LLM tool-use pattern used in AI-blockchain integration' },
                  { title: 'LangChain NEAR Integration', url: 'https://github.com/langchain-ai/langchain', desc: 'LangChain tools for blockchain interaction' },
                  { title: 'Verifiable Computation Research', url: 'https://eprint.iacr.org/2023/1741', desc: 'Academic research on verifiable AI inference' },
                  { title: 'TEE Attestation', url: 'https://docs.near.org/concepts/ai', desc: 'Trusted Execution Environments for verifiable AI' },
                  { title: 'AI Agent Design Patterns', url: 'https://www.anthropic.com/research/building-effective-agents', desc: 'Best practices for building reliable AI agents' },
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

export default AiAgentIntegration;
