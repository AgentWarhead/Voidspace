'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Bot, ExternalLink, CheckCircle, Brain, Cpu, Shield, Workflow, Zap } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

interface ShadeAgentsProps {
  isActive: boolean;
  onToggle: () => void;
}

const ShadeAgents: React.FC<ShadeAgentsProps> = ({ isActive, onToggle }) => {
  const [selectedTab, setSelectedTab] = useState<string>('overview');

  return (
    <Card variant="glass" padding="none" className="border-purple-500/20">
      <div
        onClick={onToggle}
        className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">NEAR AI &amp; Shade Agents</h3>
            <p className="text-text-muted text-sm">Autonomous on-chain agents, NEAR AI infrastructure, and the agent economy</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-red-500/10 text-red-300 border-red-500/20">Advanced</Badge>
          <Badge className="bg-purple-500/10 text-purple-300 border-purple-500/20">50 min</Badge>
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
                  <Bot className="w-5 h-5 text-violet-400" />
                  <h4 className="text-lg font-semibold text-text-primary">What You&apos;ll Learn</h4>
                </div>
                <ul className="space-y-3">
                  {[
                    'NEAR AI infrastructure — decentralized compute, model hosting, and agent runtime',
                    'Building autonomous agents that operate on-chain with their own NEAR accounts',
                    'Agent-to-agent communication and the emerging agent economy',
                    'Shade agent architecture — how agents manage keys, sign transactions, and maintain state',
                    'Trust frameworks and safety: how to constrain agent behavior on-chain',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-text-secondary">
                      <CheckCircle className="w-4 h-4 text-near-green mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Card variant="default" padding="md" className="mt-4 border-violet-500/20 bg-violet-500/5">
                  <p className="text-sm text-text-secondary">
                    <span className="text-violet-400 font-semibold">Why this matters:</span> AI agents are the next wave of on-chain users. NEAR is positioning as the chain for AI with native agent infrastructure. Developers who understand agent architecture will build the next generation of autonomous applications.
                  </p>
                </Card>
              </div>
            )}

            {selectedTab === 'learn' && (
              <div className="space-y-8">
                {/* Section 1: NEAR AI Infrastructure */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-blue-400" />
                    NEAR AI Infrastructure
                  </h4>
                  <p className="text-text-secondary mb-3">
                    NEAR AI provides decentralized infrastructure for running AI models and agents. Unlike centralized APIs, NEAR AI runs inference on a distributed network of compute providers.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card variant="default" padding="md" className="border-blue-500/20">
                      <h5 className="font-semibold text-blue-400 text-sm mb-2">Compute Layer</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• Decentralized GPU providers run inference</li>
                        <li>• Model marketplace for open-source models</li>
                        <li>• Pay-per-inference with NEAR tokens</li>
                        <li>• Verifiable inference (proof of computation)</li>
                      </ul>
                    </Card>
                    <Card variant="default" padding="md" className="border-purple-500/20">
                      <h5 className="font-semibold text-purple-400 text-sm mb-2">Agent Runtime</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• Agents run as NEAR accounts with function-call keys</li>
                        <li>• Sandboxed execution environments</li>
                        <li>• On-chain state persistence</li>
                        <li>• Cross-agent communication via NEAR transactions</li>
                      </ul>
                    </Card>
                  </div>
                </section>

                {/* Section 2: Agent Architecture */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Brain className="w-5 h-5 text-green-400" />
                    Agent Architecture
                  </h4>
                  <p className="text-text-secondary mb-3">
                    A NEAR AI agent consists of an LLM brain, on-chain identity, tools, and memory:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-text-secondary border border-border">
                    <div className="text-green-400 mb-2">{'// Agent architecture (conceptual)'}</div>
                    <div className="text-near-green">{'class NearAgent {'}</div>
                    <div className="text-near-green">{'  identity: AccountId;      // agent.near — on-chain identity'}</div>
                    <div className="text-near-green">{'  keys: AccessKey[];         // function-call keys with scoped permissions'}</div>
                    <div className="text-near-green">{'  model: LLM;               // reasoning engine (NEAR AI hosted)'}</div>
                    <div className="text-near-green">{'  memory: VectorStore;       // persistent memory (on-chain or IPFS)'}</div>
                    <div className="text-near-green">{'  tools: Tool[];             // on-chain actions the agent can take'}</div>
                    <div className="text-near-green">{'  constraints: Policy[];     // safety rails and spending limits'}</div>
                    <div className="text-near-green">{'}'}</div>
                    <div className="mt-2 text-green-400">{'// Agent lifecycle'}</div>
                    <div className="text-near-green">{'// 1. Observe: Monitor on-chain events, messages, triggers'}</div>
                    <div className="text-near-green">{'// 2. Reason: Use LLM to decide action based on context + memory'}</div>
                    <div className="text-near-green">{'// 3. Act: Execute on-chain transactions via function-call keys'}</div>
                    <div className="text-near-green">{'// 4. Learn: Update memory with results and outcomes'}</div>
                  </div>
                </section>

                {/* Section 3: On-Chain Agent Safety */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-red-400" />
                    Agent Safety &amp; Constraints
                  </h4>
                  <p className="text-text-secondary mb-3">
                    NEAR&apos;s access key model provides natural guardrails for agent behavior:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-text-secondary border border-border">
                    <div className="text-red-400 mb-2">{'// Constraining agent behavior with access keys'}</div>
                    <div className="text-near-green">{'// Give agent a function-call key limited to specific methods'}</div>
                    <div className="text-near-green">{'near account add-key agent.near \\'}</div>
                    <div className="text-near-green">{'  grant-function-call-access \\'}</div>
                    <div className="text-near-green">{'  --allowance "5 NEAR" \\'}</div>
                    <div className="text-near-green">{'  --receiver-account-id game.near \\'}</div>
                    <div className="text-near-green">{'  --method-names "play,claim" \\'}</div>
                    <div className="text-near-green">{'  use-manually-provided-public-key "ed25519:..." \\'}</div>
                    <div className="text-near-green">{'  network-config mainnet sign-with-keychain send'}</div>
                    <div className="mt-2 text-red-400">{'// The agent CANNOT:'}</div>
                    <div className="text-text-muted">{'// - Transfer NEAR directly (no full access)'}</div>
                    <div className="text-text-muted">{'// - Call methods not in the allowlist'}</div>
                    <div className="text-text-muted">{'// - Spend more than 5 NEAR in gas'}</div>
                    <div className="text-text-muted">{'// - Interact with contracts outside game.near'}</div>
                  </div>
                  <Card variant="default" padding="md" className="mt-3 border-red-500/20 bg-red-500/5">
                    <p className="text-xs text-text-secondary">
                      <strong className="text-red-400">Key insight:</strong> NEAR&apos;s function-call access keys act as a natural capability-based security model for agents. Each key is a scoped permission that expires when its allowance is exhausted.
                    </p>
                  </Card>
                </section>

                {/* Section 4: Agent-to-Agent Communication */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Workflow className="w-5 h-5 text-cyan-400" />
                    Agent-to-Agent Economy
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Agents can discover, negotiate with, and pay other agents using NEAR&apos;s native payment rails:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card variant="default" padding="md" className="border-cyan-500/20">
                      <h5 className="font-semibold text-cyan-400 text-sm mb-2">Discovery</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• Agent registry contracts list capabilities</li>
                        <li>• Reputation scores from on-chain interaction history</li>
                        <li>• Skill attestations from other agents</li>
                        <li>• Service-level agreements as smart contracts</li>
                      </ul>
                    </Card>
                    <Card variant="default" padding="md" className="border-orange-500/20">
                      <h5 className="font-semibold text-orange-400 text-sm mb-2">Payment</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• Pay-per-call: agents charge per invocation</li>
                        <li>• Subscription: recurring payments via smart contract</li>
                        <li>• Revenue sharing: output-based compensation</li>
                        <li>• Escrow: trustless payment for multi-step tasks</li>
                      </ul>
                    </Card>
                  </div>
                </section>

                {/* Section 5: Building with NEAR AI */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    Building with NEAR AI SDK
                  </h4>
                  <p className="text-text-secondary mb-3">
                    The NEAR AI SDK provides tools for building, deploying, and managing agents:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-text-secondary border border-border">
                    <div className="text-yellow-400 mb-2">{'// Creating a NEAR AI agent'}</div>
                    <div className="text-near-green">{'pip install nearai'}</div>
                    <div className="mt-1 text-near-green">{'nearai login'}</div>
                    <div className="text-near-green">{'nearai agent create --name "my-trader-agent"'}</div>
                    <div className="mt-2 text-yellow-400">{'// agent.py — Agent entry point'}</div>
                    <div className="text-near-green">{'from nearai.agents import Agent'}</div>
                    <div className="text-near-green">{'from nearai.tools import near_call, near_view'}</div>
                    <div className="mt-1 text-near-green">{'class TraderAgent(Agent):'}</div>
                    <div className="text-near-green">{'    async def run(self, message: str):'}</div>
                    <div className="text-near-green">{'        # Check current prices'}</div>
                    <div className="text-near-green">{'        price = await near_view("oracle.near", "get_price", {"asset": "NEAR"})'}</div>
                    <div className="text-near-green">{'        '}</div>
                    <div className="text-near-green">{'        # Decide action using LLM reasoning'}</div>
                    <div className="text-near-green">{'        decision = await self.think(f"Price is {price}. Should I buy or sell?")'}</div>
                    <div className="text-near-green">{'        '}</div>
                    <div className="text-near-green">{'        if decision.action == "buy":'}</div>
                    <div className="text-near-green">{'            await near_call("dex.near", "swap", {"amount": decision.amount})'}</div>
                  </div>
                </section>
              </div>
            )}

            {selectedTab === 'practice' && (
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-text-primary">Exercises</h4>

                <Card variant="default" padding="md" className="border-red-500/20">
                  <h5 className="font-semibold text-red-400 text-sm mb-2">🔴 Exercise 1: Deploy a Simple Agent</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Create and deploy a NEAR AI agent that monitors a specific contract for events and responds by calling another contract. Use function-call keys for scoped permissions.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-red-500/20">
                  <h5 className="font-semibold text-red-400 text-sm mb-2">🔴 Exercise 2: Agent with Memory</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Build an agent that maintains persistent memory using on-chain storage. The agent should learn from past interactions and improve its responses over time.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-red-500/20">
                  <h5 className="font-semibold text-red-400 text-sm mb-2">🔴 Exercise 3: Multi-Agent System</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Create two agents that interact: a &quot;market maker&quot; agent and a &quot;trader&quot; agent. They should discover each other, negotiate prices, and execute trades via smart contracts.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-red-500/20">
                  <h5 className="font-semibold text-red-400 text-sm mb-2">🔴 Exercise 4: Safety-Constrained Agent</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Build an agent with multiple levels of access keys: read-only for monitoring, limited write for routine operations, and time-locked full access for emergency actions. Test that each constraint works.
                  </p>
                </Card>
              </div>
            )}

            {selectedTab === 'resources' && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-text-primary">Resources</h4>
                {[
                  { title: 'NEAR AI Documentation', url: 'https://docs.near.ai', desc: 'Official NEAR AI platform documentation and agent SDK' },
                  { title: 'NEAR AI Hub', url: 'https://app.near.ai', desc: 'Deploy and manage AI agents on NEAR infrastructure' },
                  { title: 'NEAR AI Agent Examples', url: 'https://github.com/nearai', desc: 'Example agents and templates on GitHub' },
                  { title: 'Agent Protocol Specification', url: 'https://docs.near.org/concepts/ai', desc: 'Protocol-level specification for AI agents on NEAR' },
                  { title: 'NEAR AI Research', url: 'https://near.ai', desc: 'Research and vision for user-owned AI on NEAR' },
                  { title: 'Autonomous Agents Paper', url: 'https://arxiv.org/abs/2308.11432', desc: 'Research on LLM-based autonomous agents' },
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

export default ShadeAgents;
