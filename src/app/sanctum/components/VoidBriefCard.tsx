'use client';

import { useState, useCallback } from 'react';
import { Sparkles, Info, ChevronDown, ChevronUp, Loader2, ArrowRight, Rocket, X } from 'lucide-react';
import type { ProjectBrief } from '@/types';

interface VoidBriefCardProps {
  isConnected: boolean;
  openModal: () => void;
  onStartBuild?: (brief: ProjectBrief) => void;
}

export function VoidBriefCard({ isConnected, openModal, onStartBuild }: VoidBriefCardProps) {
  const [mode, setMode] = useState<'idle' | 'custom' | 'generating' | 'preview'>('idle');
  const [customIdea, setCustomIdea] = useState('');
  const [showCustom, setShowCustom] = useState(false);
  const [brief, setBrief] = useState<ProjectBrief | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);

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

  const handleQuickGenerate = () => generateBrief();
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
    setShowCustom(false);
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
    <div className="mb-16 max-w-2xl mx-auto">
      <div className="rounded-2xl border border-near-green/15 bg-white/[0.02] backdrop-blur-sm overflow-hidden shadow-[0_0_40px_rgba(0,236,151,0.04)] hover:shadow-[0_0_60px_rgba(0,236,151,0.08)] transition-shadow duration-500">
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
        <div className="px-6 py-8 text-center">
          {mode === 'generating' ? (
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-full bg-near-green/10 flex items-center justify-center mx-auto">
                <Loader2 className="w-6 h-6 text-near-green animate-spin" />
              </div>
              <div>
                <p className="text-lg font-semibold text-text-primary">Generating your brief...</p>
                <p className="text-sm text-text-muted mt-1">Claude is analyzing market opportunities and technical requirements</p>
              </div>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-near-green/10 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-near-green" />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-2">Ready to Build?</h3>
              <p className="text-sm text-text-secondary max-w-md mx-auto mb-6 leading-relaxed">
                Generate an AI-powered mission brief with market analysis, technical specs, NEAR integration, monetization strategies, and your first week&apos;s action plan.
              </p>

              {error && (
                <div className="mb-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">
                  {error}
                </div>
              )}

              {/* Quick Generate CTA */}
              <button
                onClick={handleQuickGenerate}
                disabled={mode === 'generating'}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-near-green text-void-black font-semibold text-base hover:shadow-[0_0_30px_rgba(0,236,151,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
              >
                <Sparkles className="w-5 h-5" />
                Generate Your Mission Brief
              </button>

              {/* Toggle custom idea */}
              <button
                onClick={() => setShowCustom(!showCustom)}
                className="flex items-center gap-1.5 mx-auto mt-4 text-sm text-text-muted hover:text-near-green transition-colors"
              >
                {showCustom ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                {showCustom ? 'Hide' : 'Or describe your own idea'}
              </button>

              {/* Custom idea textarea */}
              {showCustom && (
                <div className="mt-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                  <textarea
                    value={customIdea}
                    onChange={(e) => setCustomIdea(e.target.value)}
                    placeholder="Describe your project idea... e.g. 'A prediction market for AI model performance on NEAR'"
                    className="w-full h-24 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] focus:border-near-green/40 focus:outline-none text-sm text-text-primary placeholder:text-text-muted/50 resize-none transition-colors"
                    maxLength={2000}
                  />
                  <button
                    onClick={handleCustomGenerate}
                    disabled={customIdea.trim().length === 0}
                    className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-near-green/20 border border-near-green/30 text-near-green text-sm font-medium hover:bg-near-green/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Sparkles className="w-4 h-4" />
                    Generate Brief for This Idea
                  </button>
                </div>
              )}

              {/* Usage */}
              <p className="text-xs text-text-muted/60 mt-5 font-mono">
                Credits required · Powered by Claude Sonnet
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
