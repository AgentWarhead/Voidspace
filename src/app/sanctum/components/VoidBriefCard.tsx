'use client';

import { useState, useCallback, useEffect } from 'react';
import { Sparkles, Info, Loader2, ArrowRight, Rocket, X, Dices, Zap, WandSparkles, PenLine } from 'lucide-react';
import type { ProjectBrief } from '@/types';

// ~20 mystery NEAR ecosystem prompts — randomly picked client-side
const MYSTERY_PROMPTS = [
  'Generate a mystery NEAR project idea in the DeFi/DEX space — something innovative using chain abstraction and intents',
  'Generate a mystery NEAR project idea for an AI agent marketplace where autonomous agents trade services on-chain',
  'Generate a mystery NEAR project idea for a gaming/metaverse platform with on-chain asset ownership',
  'Generate a mystery NEAR project idea for a social/creator economy tool that empowers content creators',
  'Generate a mystery NEAR project idea for cross-chain infrastructure leveraging NEAR chain signatures',
  'Generate a mystery NEAR project idea for a DAO governance tool with novel voting mechanisms',
  'Generate a mystery NEAR project idea for NFT utility beyond art — think memberships, credentials, or access passes',
  'Generate a mystery NEAR project idea for privacy/ZK applications on NEAR',
  'Generate a mystery NEAR project idea for a prediction market or futarchy-based decision platform',
  'Generate a mystery NEAR project idea for a decentralized identity and reputation system',
  'Generate a mystery NEAR project idea for an on-chain music streaming or royalty distribution platform',
  'Generate a mystery NEAR project idea for a real-world asset (RWA) tokenization platform',
  'Generate a mystery NEAR project idea for an AI-powered DeFi yield optimizer using Shade Agents',
  'Generate a mystery NEAR project idea for a decentralized freelancer/gig economy marketplace',
  'Generate a mystery NEAR project idea for a Web3 education platform with learn-to-earn mechanics',
  'Generate a mystery NEAR project idea for a supply chain transparency tool with on-chain verification',
  'Generate a mystery NEAR project idea for a decentralized social media protocol with account abstraction',
  'Generate a mystery NEAR project idea for a cross-chain DEX aggregator using NEAR intents',
  'Generate a mystery NEAR project idea for a health/fitness app with token incentives and on-chain proofs',
  'Generate a mystery NEAR project idea for a decentralized insurance protocol using smart contracts',
];

const LOADING_MESSAGES = [
  'The Void is choosing your destiny...',
  'Scanning the NEAR ecosystem for hidden gems...',
  'Channeling chain abstraction energy...',
  'Decrypting your mystery mission...',
  'Consulting the on-chain oracle...',
  'Assembling your master plan...',
];

interface VoidBriefCardProps {
  isConnected: boolean;
  openModal: () => void;
  onStartBuild?: (brief: ProjectBrief) => void;
}

export function VoidBriefCard({ isConnected, openModal, onStartBuild }: VoidBriefCardProps) {
  const [mode, setMode] = useState<'idle' | 'custom' | 'generating' | 'preview'>('idle');
  const [customIdea, setCustomIdea] = useState('');
  const [brief, setBrief] = useState<ProjectBrief | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(LOADING_MESSAGES[0]);
  const [diceHover, setDiceHover] = useState(false);

  // Cycle loading messages for excitement
  useEffect(() => {
    if (mode !== 'generating') return;
    setLoadingMsg(LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)]);
    const interval = setInterval(() => {
      setLoadingMsg(LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)]);
    }, 3000);
    return () => clearInterval(interval);
  }, [mode]);

  const generateBrief = useCallback(async (idea?: string) => {
    if (!isConnected) {
      openModal();
      return;
    }

    setError(null);
    setMode('generating');

    try {
      const body = idea && idea.trim().length > 0
        ? { customIdea: idea.trim() }
        : { customIdea: 'Suggest a trending NEAR Protocol project idea with high potential for 2025 — something innovative that leverages chain abstraction, AI agents, or DeFi primitives' };

      const res = await fetch('/api/brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.status === 402) {
        setError('Insufficient credits. Top up your Sanctum balance to generate briefs.');
        setMode('idle');
        return;
      }

      if (res.status === 403 || res.status === 429) {
        const data = await res.json();
        setError(data.error || 'Rate limit reached. Try again later.');
        setMode('idle');
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Failed to generate brief. Try again.');
        setMode('idle');
        return;
      }

      const data = await res.json();
      if (data.brief) {
        setBrief(data.brief);
        setMode('preview');
      } else {
        setError('Unexpected response. Try again.');
        setMode('idle');
      }
    } catch {
      setError('Network error. Check your connection and try again.');
      setMode('idle');
    }
  }, [isConnected, openModal]);

  const handleMysteryMission = () => {
    const randomPrompt = MYSTERY_PROMPTS[Math.floor(Math.random() * MYSTERY_PROMPTS.length)];
    generateBrief(randomPrompt);
  };

  const handleCustomGenerate = () => {
    if (customIdea.trim().length > 0) {
      generateBrief(customIdea);
    }
  };

  const resetState = () => {
    setMode('idle');
    setBrief(null);
    setError(null);
    setCustomIdea('');
  };

  // Preview mode — show the generated brief
  if (mode === 'preview' && brief) {
    return (
      <div className="mb-16 max-w-3xl mx-auto">
        <div className="rounded-2xl border border-near-green/20 bg-white/[0.02] backdrop-blur-sm overflow-hidden shadow-[0_0_40px_rgba(0,236,151,0.06)]">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-near-green animate-pulse" />
              <span className="text-sm font-semibold text-text-primary">Mission Brief</span>
            </div>
            <button
              onClick={resetState}
              className="p-1.5 rounded-lg hover:bg-white/[0.06] transition-colors text-text-muted hover:text-text-primary"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Brief content */}
          <div className="p-6 space-y-5">
            {/* Project name */}
            <div>
              <h3 className="text-xl font-bold text-text-primary mb-1">
                {brief.projectNames?.[0] || 'Your Project'}
              </h3>
              <p className="text-sm text-text-muted">
                {brief.buildComplexity?.difficulty && (
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-mono mr-2 ${
                    brief.buildComplexity.difficulty === 'beginner' ? 'bg-green-500/10 text-green-400' :
                    brief.buildComplexity.difficulty === 'intermediate' ? 'bg-amber-500/10 text-amber-400' :
                    'bg-red-500/10 text-red-400'
                  }`}>
                    {brief.buildComplexity.difficulty}
                  </span>
                )}
                {brief.buildComplexity?.estimatedTimeline}
              </p>
            </div>

            {/* Problem & Solution */}
            <div className="space-y-3">
              <div>
                <p className="text-xs font-mono uppercase tracking-wider text-near-green/60 mb-1">Problem</p>
                <p className="text-sm text-text-secondary leading-relaxed">{brief.problemStatement}</p>
              </div>
              <div>
                <p className="text-xs font-mono uppercase tracking-wider text-near-green/60 mb-1">Solution</p>
                <p className="text-sm text-text-secondary leading-relaxed">{brief.solutionOverview}</p>
              </div>
            </div>

            {/* Key Features */}
            {brief.keyFeatures && brief.keyFeatures.length > 0 && (
              <div>
                <p className="text-xs font-mono uppercase tracking-wider text-near-green/60 mb-2">Key Features</p>
                <div className="space-y-1.5">
                  {brief.keyFeatures.slice(0, 4).map((f, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-near-green mt-0.5">▸</span>
                      <span className="text-text-secondary">
                        <span className="text-text-primary font-medium">{f.name}</span>
                        {' — '}{f.description}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* NEAR Stack */}
            {brief.nearTechStack && (
              <div className="flex flex-wrap gap-2">
                {brief.nearTechStack.useShadeAgents && (
                  <span className="px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-mono">Shade Agents</span>
                )}
                {brief.nearTechStack.useIntents && (
                  <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono">Intents</span>
                )}
                {brief.nearTechStack.useChainSignatures && (
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-mono">Chain Signatures</span>
                )}
              </div>
            )}

            {/* Monetization */}
            {brief.monetizationIdeas && brief.monetizationIdeas.length > 0 && (
              <div>
                <p className="text-xs font-mono uppercase tracking-wider text-near-green/60 mb-2">Monetization</p>
                <div className="flex flex-wrap gap-2">
                  {brief.monetizationIdeas.slice(0, 3).map((idea, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs text-text-secondary">
                      {idea}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="px-6 pb-6">
            <button
              onClick={() => onStartBuild?.(brief)}
              className="w-full inline-flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-near-green text-void-black font-semibold text-base hover:shadow-[0_0_30px_rgba(0,236,151,0.4)] transition-all"
            >
              <Rocket className="w-5 h-5" />
              Build This in Sanctum
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={resetState}
              className="w-full mt-2 text-sm text-text-muted hover:text-text-primary transition-colors py-2"
            >
              Generate another brief
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-16 max-w-3xl mx-auto">
      <div className="rounded-2xl border border-near-green/15 bg-white/[0.02] backdrop-blur-xl overflow-hidden shadow-[0_0_60px_rgba(0,236,151,0.05)] transition-shadow duration-500">
        {/* Header row */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-near-green animate-pulse" />
            <span className="text-sm font-semibold text-text-primary tracking-wide">Void Brief</span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-near-green/10 border border-near-green/20 text-[10px] font-mono font-medium text-near-green uppercase tracking-wider">
              Powered by Claude AI
            </span>
            <div className="relative">
              <button
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className="p-1 rounded-md hover:bg-white/[0.06] transition-colors text-text-muted hover:text-text-primary"
              >
                <Info className="w-3.5 h-3.5" />
              </button>
              {showTooltip && (
                <div className="absolute right-0 top-full mt-2 w-64 p-3 rounded-xl bg-void-gray border border-white/[0.1] shadow-xl z-50 text-xs text-text-secondary leading-relaxed">
                  Void Brief generates a comprehensive project plan using AI — including market analysis, technical specs, NEAR integration strategy, and your first week&apos;s action plan. Credits required.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-8">
          {mode === 'generating' ? (
            /* ── Loading State ── */
            <div className="text-center space-y-5 py-4">
              <div className="relative w-16 h-16 mx-auto">
                <div className="absolute inset-0 rounded-full bg-near-green/20 animate-ping" />
                <div className="relative w-16 h-16 rounded-full bg-near-green/10 border border-near-green/30 flex items-center justify-center">
                  <Loader2 className="w-7 h-7 text-near-green animate-spin" />
                </div>
              </div>
              <div>
                <p className="text-lg font-bold text-text-primary">{loadingMsg}</p>
                <p className="text-sm text-text-muted mt-2">
                  Claude is crafting your mission brief with market analysis &amp; technical specs
                </p>
              </div>
              <div className="flex justify-center gap-1.5 pt-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-near-green/60 animate-bounce"
                    style={{ animationDelay: `${i * 150}ms` }}
                  />
                ))}
              </div>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-6 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">
                  {error}
                </div>
              )}

              {/* ── Two Paths Layout ── */}
              <div className="grid gap-5 md:grid-cols-2">

                {/* ── Path 1: Mystery Mission ── */}
                <div className="group relative rounded-xl border border-near-green/20 bg-gradient-to-br from-near-green/[0.04] to-transparent p-6 hover:border-near-green/40 hover:shadow-[0_0_40px_rgba(0,236,151,0.08)] transition-all duration-300">
                  {/* Subtle glow accent */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-near-green/[0.06] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-near-green/[0.1] transition-colors duration-500" />

                  <div className="relative space-y-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-11 h-11 rounded-xl bg-near-green/15 border border-near-green/20 flex items-center justify-center transition-transform duration-300 ${diceHover ? 'rotate-[20deg] scale-110' : ''}`}
                      >
                        <Dices className="w-5 h-5 text-near-green" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-text-primary">Mystery Mission</h3>
                        <p className="text-xs text-near-green/70 font-mono uppercase tracking-wider">Discover</p>
                      </div>
                    </div>

                    <p className="text-sm text-text-secondary leading-relaxed">
                      Not sure what to build on NEAR? Let the Void decide. Get a random mission — discover project ideas you never knew you needed.
                    </p>

                    <button
                      onClick={handleMysteryMission}
                      onMouseEnter={() => setDiceHover(true)}
                      onMouseLeave={() => setDiceHover(false)}
                      disabled={mode === 'generating'}
                      className="w-full inline-flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl bg-near-green text-void-black font-semibold text-sm hover:shadow-[0_0_30px_rgba(0,236,151,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Dices className="w-4.5 h-4.5" />
                      Roll a Mystery Mission
                      <Zap className="w-4 h-4 opacity-70" />
                    </button>

                    <div className="flex items-center gap-2 text-[11px] text-text-muted/50 font-mono">
                      <WandSparkles className="w-3 h-3" />
                      <span>20 categories · Always surprising</span>
                    </div>
                  </div>
                </div>

                {/* ── Path 2: Custom Mission ── */}
                <div className="group relative rounded-xl border border-white/[0.08] bg-white/[0.02] p-6 hover:border-white/[0.15] hover:bg-white/[0.03] transition-all duration-300">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-white/[0.06] border border-white/[0.1] flex items-center justify-center">
                        <PenLine className="w-5 h-5 text-text-secondary" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-text-primary">Custom Mission</h3>
                        <p className="text-xs text-text-muted/60 font-mono uppercase tracking-wider">Your Vision</p>
                      </div>
                    </div>

                    <p className="text-sm text-text-secondary leading-relaxed">
                      Already know what you want to build? Describe your idea and get a tailored mission brief with specs, strategy, and action plan.
                    </p>

                    <textarea
                      value={customIdea}
                      onChange={(e) => setCustomIdea(e.target.value)}
                      placeholder="e.g. A prediction market for AI model benchmarks on NEAR..."
                      className="w-full h-20 px-3.5 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.08] focus:border-near-green/40 focus:bg-white/[0.04] focus:outline-none text-sm text-text-primary placeholder:text-text-muted/40 resize-none transition-all duration-200"
                      maxLength={2000}
                    />

                    <button
                      onClick={handleCustomGenerate}
                      disabled={customIdea.trim().length === 0 || mode === 'generating'}
                      className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white/[0.06] border border-white/[0.1] text-text-primary font-semibold text-sm hover:bg-white/[0.1] hover:border-white/[0.2] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      <Sparkles className="w-4 h-4 text-near-green" />
                      Generate Brief for This Idea
                    </button>
                  </div>
                </div>
              </div>

              {/* Credits note */}
              <p className="text-xs text-text-muted/50 mt-6 text-center font-mono">
                Credits required · Powered by Claude Sonnet
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
