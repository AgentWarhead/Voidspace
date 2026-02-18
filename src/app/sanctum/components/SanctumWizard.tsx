'use client';

import { useState, useCallback } from 'react';
import { Container } from '@/components/ui';
import { GradientText } from '@/components/effects/GradientText';
import { CategoryPicker } from './CategoryPicker';
import { ScratchTemplates, SCRATCH_TEMPLATES } from './ScratchTemplates';
import { VoidBriefCard } from './VoidBriefCard';
import { PERSONA_LIST, type Persona } from '../lib/personas';

// ── Specialist metadata — colors, tags, trigger examples ──
const SPECIALIST_META: Record<string, { color: string; tags: string[]; triggers: string[] }> = {
  oxide:   { color: '#F97316', tags: ['Rust', 'NEAR SDK', 'Smart Contracts'], triggers: ['"write this in Rust"', '"ownership error"'] },
  warden:  { color: '#3B82F6', tags: ['Security', 'Access Control', 'Audits'],  triggers: ['"audit my contract"', '"access control"'] },
  phantom: { color: '#FBBF24', tags: ['Gas Optimization', 'Performance', 'Storage'], triggers: ['"reduce gas costs"', '"optimize performance"'] },
  nexus:   { color: '#14B8A6', tags: ['Cross-Chain', 'NEAR Intents', 'Bridges'],   triggers: ['"cross-chain transfer"', '"NEAR Intents"'] },
  prism:   { color: '#EC4899', tags: ['Frontend', 'Wallet UX', 'TypeScript'],       triggers: ['"build the frontend"', '"wallet integration"'] },
  crucible: { color: '#22C55E', tags: ['Testing', 'Unit Tests', 'Simulation'],      triggers: ['"write tests"', '"QA this contract"'] },
  ledger:  { color: '#EAB308', tags: ['Tokenomics', 'DeFi', 'Economic Design'],     triggers: ['"design the tokenomics"', '"DeFi mechanics"'] },
};
import { storeBriefForSanctum, briefToSanctumPrompt } from '@/lib/brief-to-sanctum';
import type { ProjectBrief } from '@/types';
// @ts-ignore
import { ArrowLeft, Rocket, BookOpen, Hammer, Lightbulb, Wrench, Palette, Flame, Globe, ChevronRight, Sparkles, Search, MessageSquare, Play, Lock } from 'lucide-react';
import { useWallet } from '@/hooks/useWallet';
import { SANCTUM_TIERS, type SanctumTier } from '@/lib/sanctum-tiers';
import Link from 'next/link';

export interface WizardConfig {
  mode: 'build' | 'roast' | 'webapp' | 'visual' | 'scratch';
  category?: string | null;
  chatMode?: 'build' | 'learn';
  customPrompt?: string;
  persona?: string;
  scratchDescription?: string;
  scratchTemplate?: string | null;
}

interface SavedSessionInfo {
  mode?: string;
  selectedCategory?: string;
  messageCount?: number;
  tokensUsed?: number;
}

interface SanctumWizardProps {
  onComplete: (config: WizardConfig) => void;
  onBack: () => void;
  dispatch: (action: { type: string; payload?: unknown }) => void;
  state: {
    customPrompt: string;
    scratchDescription: string;
    scratchTemplate: string | null;
  };
  isConnected?: boolean;
  openModal?: () => void;
  hasSavedSession?: boolean;
  savedSessionInfo?: SavedSessionInfo | null;
  onResumeSession?: () => void;
}

type WizardStep = 'goal' | 'details' | 'persona';
type GoalChoice = 'deploy-first' | 'learn' | 'idea' | 'existing-code' | 'visual' | 'discover';
type ExistingCodeSub = 'roast' | 'webapp' | null;

export function SanctumWizard({ onComplete, onBack, dispatch, state, isConnected = false, openModal = () => {}, hasSavedSession = false, savedSessionInfo, onResumeSession }: SanctumWizardProps) {
  const [step, setStep] = useState<WizardStep>('goal');
  const [goal, setGoal] = useState<GoalChoice | null>(null);
  const [existingCodeSub, setExistingCodeSub] = useState<ExistingCodeSub>(null);
  const { user } = useWallet();
  const userTier: SanctumTier = (user?.tier as SanctumTier) || 'shade';
  const canAudit = SANCTUM_TIERS[userTier].canAudit;
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPersona, setSelectedPersona] = useState<string>('shade');
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const [briefPrompt, setBriefPrompt] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const goForward = useCallback((nextStep: WizardStep) => {
    setDirection('forward');
    setStep(nextStep);
  }, []);

  const goBack = useCallback(() => {
    setDirection('back');
    if (step === 'persona') {
      // If deploy-first, skip back to goal (no details step)
      if (goal === 'deploy-first') {
        setStep('goal');
      } else {
        setStep('details');
      }
    } else if (step === 'details') {
      setStep('goal');
    } else {
      onBack();
    }
  }, [step, goal, onBack]);

  const handleGoalSelect = useCallback((choice: GoalChoice) => {
    setGoal(choice);

    if (choice === 'deploy-first') {
      // Fast track — skip details, go to persona
      setSelectedCategory('meme-tokens');
      goForward('persona');
    } else if (choice === 'learn') {
      goForward('details');
    } else if (choice === 'idea') {
      goForward('details');
    } else if (choice === 'visual') {
      // Direct launch — visual mode
      onComplete({ mode: 'visual' });
    } else if (choice === 'discover') {
      goForward('details');
    } else if (choice === 'existing-code') {
      // Show sub-choice inline, don't advance step yet
      setExistingCodeSub(null);
    }
  }, [goForward, onComplete]);

  const handleExistingCodeSub = useCallback((sub: 'roast' | 'webapp') => {
    setExistingCodeSub(sub);
    if (sub === 'roast') {
      // Roast mode — skip persona, auto-select Warden (security) and launch immediately
      setGoal('existing-code');
      setSelectedPersona('warden');
      if (typeof window !== 'undefined') {
        localStorage.setItem('sanctum-chat-persona', 'warden');
      }
      onComplete({ mode: 'roast', persona: 'warden' });
      return;
    } else {
      // Webapp mode — launch directly (it has its own flow)
      onComplete({ mode: 'webapp' });
    }
  }, [goForward, onComplete]);

  const handleCategorySelect = useCallback((categorySlug: string) => {
    setSelectedCategory(categorySlug);
    goForward('persona');
  }, [goForward]);

  const handleScratchContinue = useCallback(() => {
    if (state.scratchDescription.trim()) {
      goForward('persona');
    }
  }, [goForward, state.scratchDescription]);

  const handleBriefComplete = useCallback((brief: ProjectBrief) => {
    storeBriefForSanctum(brief);
    const prompt = briefToSanctumPrompt(brief);
    setBriefPrompt(prompt);
    goForward('persona');
  }, [goForward]);

  const handlePersonaSelect = useCallback((personaId: string) => {
    setSelectedPersona(personaId);
  }, []);

  const handleLaunch = useCallback(() => {
    // Always start with Shade as Lead Architect — specialists are called in automatically
    if (typeof window !== 'undefined') {
      localStorage.setItem('sanctum-chat-persona', 'shade');
    }

    const config: WizardConfig = { mode: 'build', persona: 'shade' };

    if (goal === 'deploy-first') {
      config.mode = 'build';
      config.chatMode = 'build';
      config.category = selectedCategory || 'meme-tokens';
    } else if (goal === 'learn') {
      config.mode = 'build';
      config.chatMode = 'build';
      config.category = selectedCategory;
      config.customPrompt = state.customPrompt || undefined;
    } else if (goal === 'idea') {
      config.mode = 'scratch';
      config.scratchDescription = state.scratchDescription;
      config.scratchTemplate = state.scratchTemplate;
    } else if (goal === 'discover') {
      config.mode = 'build';
      config.chatMode = 'build';
      config.category = 'custom';
      config.customPrompt = briefPrompt || undefined;
    } else if (goal === 'existing-code' && existingCodeSub === 'roast') {
      config.mode = 'roast';
    }

    onComplete(config);
  }, [goal, selectedCategory, selectedPersona, existingCodeSub, state, onComplete, briefPrompt]);

  const stepIndex = step === 'goal' ? 0 : step === 'details' ? 1 : 2;
  const totalSteps = goal === 'deploy-first' ? 2 : 3;

  return (
    <section className="relative z-10 min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 pt-6 pb-4 px-4">
        <Container size="xl">
          <div className="flex items-center justify-between">
            <button
              onClick={goBack}
              className="flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            {/* Progress dots */}
            <div className="flex items-center gap-2">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === stepIndex
                      ? 'bg-near-green w-6'
                      : i < stepIndex
                      ? 'bg-near-green/50'
                      : 'bg-white/[0.15]'
                  }`}
                />
              ))}
            </div>

            <div className="text-xs font-mono text-text-muted">
              Step {stepIndex + 1}/{totalSteps}
            </div>
          </div>
        </Container>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        <div
          key={step}
          className={direction === 'forward' ? 'wizard-slide-in-right' : 'wizard-slide-in-left'}
        >
          {/* Step 1: Goal */}
          {step === 'goal' && (
            <Container size="xl" className="py-4 sm:py-8 px-4">
              <div className="text-center mb-6 sm:mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-near-green/10 border border-near-green/20 text-near-green text-xs font-mono mb-4" style={{ animation: 'sanctumFadeInUp 0.4s ease-out backwards' }}>
                  <Sparkles className="w-3 h-3" />
                  CHOOSE YOUR PATH
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-3" style={{ animation: 'sanctumFadeInUp 0.4s ease-out 0.05s backwards' }}>
                  What&apos;s your <GradientText>goal</GradientText>?
                </h2>
                <p className="text-text-muted text-base max-w-md mx-auto" style={{ animation: 'sanctumFadeInUp 0.4s ease-out 0.1s backwards' }}>Every great project starts with a single choice</p>
              </div>

              {/* Resume existing session */}
              {hasSavedSession && onResumeSession && (
                <div className="max-w-4xl mx-auto mb-6" style={{ animation: 'sanctumFadeInUp 0.4s ease-out backwards' }}>
                  <button
                    onClick={onResumeSession}
                    className="w-full group relative overflow-hidden rounded-2xl border-2 border-purple-500/30 bg-gradient-to-r from-purple-500/10 via-violet-500/5 to-transparent p-5 text-left transition-all duration-300 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 hover:scale-[1.01] active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-purple-500/15 border border-purple-500/20 flex items-center justify-center">
                        <Play className="w-5 h-5 text-purple-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold text-purple-300 mb-0.5">
                          Continue existing project
                        </h3>
                        <p className="text-sm text-text-muted flex items-center gap-2">
                          {savedSessionInfo?.selectedCategory && (
                            <span className="capitalize">{savedSessionInfo.selectedCategory.replace('-', ' ')}</span>
                          )}
                          {savedSessionInfo?.messageCount ? (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <MessageSquare className="w-3 h-3" />
                                {savedSessionInfo.messageCount} messages
                              </span>
                            </>
                          ) : null}
                          <span>•</span>
                          <span>Pick up where you left off</span>
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-purple-400 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </div>
                  </button>
                </div>
              )}

              {/* 2 goal cards — clean decision architecture */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5 max-w-3xl mx-auto mb-10">
                <GoalCard
                  emoji="🚀"
                  title="Learn & deploy"
                  subtitle="Interactive course with quizzes &amp; milestones"
                  description="Go from zero to deployed. Pick a contract type, learn as you build, and ship your first project."
                  color="cyan"
                  tag="Guided"
                  tagIcon="⚡"
                  featured
                  delay={0}
                  onClick={() => handleGoalSelect('learn')}
                  selected={goal === 'learn'}
                />
                <GoalCard
                  emoji="🧭"
                  title="Help me decide"
                  description="Not sure yet? Explore ecosystem gaps, trending ideas, or let AI craft a project brief for you."
                  color="teal"
                  tag="Explorer"
                  tagIcon="🔍"
                  delay={80}
                  onClick={() => handleGoalSelect('discover')}
                  selected={goal === 'discover'}
                />
              </div>

              {/* Secondary options — sleeker pills */}
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <div className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-transparent to-white/[0.08]" />
                  <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted/50">or</span>
                  <div className="h-px flex-1 max-w-[80px] bg-gradient-to-l from-transparent to-white/[0.08]" />
                </div>
                <div className="flex flex-wrap justify-center gap-3">
                  <button
                    onClick={() => handleGoalSelect('existing-code')}
                    className={`group flex items-center gap-2.5 px-5 py-3 rounded-2xl border-2 transition-all duration-300 text-sm font-medium ${
                      goal === 'existing-code'
                        ? 'border-red-500/40 bg-red-500/10 text-red-300 shadow-lg shadow-red-500/10'
                        : 'border-white/[0.06] bg-white/[0.02] text-text-muted hover:border-red-500/20 hover:bg-red-500/5 hover:text-red-300'
                    }`}
                  >
                    <Wrench className="w-4 h-4" />
                    I have existing code
                    <ChevronRight className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  </button>
                  <button
                    onClick={() => handleGoalSelect('visual')}
                    className="group flex items-center gap-2.5 px-5 py-3 rounded-2xl border-2 border-white/[0.06] bg-white/[0.02] text-text-muted hover:border-purple-500/20 hover:bg-purple-500/5 hover:text-purple-300 transition-all duration-300 text-sm font-medium"
                  >
                    <Palette className="w-4 h-4" />
                    Visual Generator
                    <ChevronRight className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  </button>
                </div>

                {/* Existing code sub-options (inline) */}
                {goal === 'existing-code' && (
                  <div className="mt-4 flex flex-wrap justify-center gap-3" style={{ animation: 'sanctumSlideUp 0.3s ease-out' }}>
                    {canAudit ? (
                      <button
                        onClick={() => handleExistingCodeSub('roast')}
                        className="flex items-center gap-2 px-5 py-3 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-300 transition-all text-sm font-medium"
                      >
                        <Flame className="w-4 h-4" />
                        Roast Zone (Audit)
                      </button>
                    ) : (
                      <Link
                        href="/pricing"
                        className="flex items-center gap-2 px-5 py-3 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400/60 transition-all text-sm font-medium hover:bg-red-500/10"
                      >
                        <Lock className="w-4 h-4" />
                        Roast Zone
                        <span className="text-xs text-near-green ml-1">Specter+</span>
                      </Link>
                    )}
                    <button
                      onClick={() => handleExistingCodeSub('webapp')}
                      className="flex items-center gap-2 px-5 py-3 rounded-xl border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 transition-all text-sm font-medium"
                    >
                      <Globe className="w-4 h-4" />
                      Build a Webapp
                    </button>
                  </div>
                )}
              </div>
            </Container>
          )}

          {/* Step 2: Details */}
          {step === 'details' && (
            <Container size="xl" className="py-8 px-4">
              {/* Build mode — Category Picker */}
              {goal === 'learn' && (
                <>
                  <div className="text-center mb-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-2">
                      Choose a <GradientText>category</GradientText>
                    </h2>
                    <p className="text-text-muted text-sm">
                      Pick a contract type to learn about
                    </p>
                  </div>
                  <CategoryPicker
                    onSelect={handleCategorySelect}
                    customPrompt={state.customPrompt}
                    setCustomPrompt={(prompt) =>
                      dispatch({ type: 'SET_CUSTOM_PROMPT', payload: prompt })
                    }
                    onCustomStart={() => {
                      setSelectedCategory('custom');
                      goForward('persona');
                    }}
                  />
                </>
              )}

              {/* Discover mode — VoidBriefCard */}
              {goal === 'discover' && (
                <>
                  <div className="text-center mb-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-2">
                      Discover your <GradientText>mission</GradientText>
                    </h2>
                    <p className="text-text-muted text-sm">
                      Generate a project brief or browse ecosystem opportunities
                    </p>
                  </div>

                  <VoidBriefCard
                    isConnected={isConnected}
                    openModal={openModal}
                    onStartBuild={(brief) => {
                      handleBriefComplete(brief);
                    }}
                  />

                  {/* Browse opportunities link */}
                  <div className="text-center mt-6">
                    <a
                      href="/opportunities"
                      className="text-sm text-text-muted hover:text-near-green transition-colors"
                    >
                      Or browse all ecosystem opportunities →
                    </a>
                  </div>
                </>
              )}

              {/* Scratch mode — Description + Templates */}
              {goal === 'idea' && (
                <>
                  <div className="text-center mb-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-2">
                      Describe your <GradientText>idea</GradientText>
                    </h2>
                    <p className="text-text-muted text-sm">
                      Full-stack NEAR dApp — React, Tailwind, wallet connect — generated from your description.
                    </p>
                  </div>

                  <div className="max-w-3xl mx-auto">
                    {/* Description input */}
                    <div className="mb-8">
                      <textarea
                        value={state.scratchDescription}
                        onChange={(e) =>
                          dispatch({ type: 'SET_SCRATCH_DESCRIPTION', payload: e.target.value })
                        }
                        placeholder="I want to build an NFT marketplace where users can mint, list, and trade digital art on NEAR..."
                        rows={4}
                        className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-5 py-4 text-text-primary placeholder-text-muted/50 resize-none focus:outline-none focus:border-near-green/50 focus:ring-2 focus:ring-near-green/20 transition-all text-sm leading-relaxed"
                      />
                    </div>

                    {/* Template quick-starts */}
                    <div className="mb-8">
                      <p className="text-xs font-mono uppercase tracking-wider text-text-muted mb-4">
                        Or pick a template to start fast
                      </p>
                      <ScratchTemplates
                        selectedId={state.scratchTemplate}
                        onSelect={(template) => {
                          dispatch({ type: 'SET_SCRATCH_TEMPLATE', payload: template.id });
                          dispatch({ type: 'SET_SCRATCH_DESCRIPTION', payload: template.starterPrompt });
                        }}
                      />
                    </div>

                    {/* Continue button */}
                    <div className="text-center">
                      <button
                        onClick={handleScratchContinue}
                        disabled={!state.scratchDescription.trim()}
                        className="inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-xl bg-gradient-to-r from-near-green to-emerald-400 text-void-black font-semibold text-base sm:text-lg hover:from-near-green/90 hover:to-emerald-400/90 transition-all shadow-lg shadow-near-green/25 disabled:opacity-40 disabled:cursor-not-allowed w-full sm:w-auto max-w-md"
                      >
                        Continue
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </Container>
          )}

          {/* Step 3: Meet the Council — Epic Neon Card Grid */}
          {step === 'persona' && (
            <div className="w-full px-3 sm:px-4 py-2 sm:py-4">
              <div className="max-w-5xl mx-auto flex flex-col gap-2 sm:gap-3">
              {/* Header */}
              <div className="text-center">
                <div className="inline-flex items-center gap-2 mb-2 px-3 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" style={{ animation: 'pulse 2s ease-in-out infinite' }} />
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-purple-400/80">Classified Briefing</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" style={{ animation: 'pulse 2s ease-in-out infinite' }} />
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-text-primary leading-tight tracking-tight">
                  THE <GradientText>COUNCIL</GradientText> <span className="text-white/35 text-2xl sm:text-3xl font-light">NEAR</span>
                </h2>
                <p className="text-[10px] sm:text-xs text-purple-400/70 mt-1 uppercase tracking-[0.25em] font-mono font-bold">
                  Voidspace Sanctum Protocol
                </p>
              </div>

              {/* [4] Mission confirmation banner */}
              {goal && (
                <div
                  className="flex items-center justify-center gap-2 px-4 py-1.5 rounded-lg self-center"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.09)',
                    animation: 'sanctumFadeInUp 0.4s ease-out 0.1s backwards',
                  }}
                >
                  <span style={{ fontSize: '10px', color: 'rgba(0,236,151,0.7)', fontFamily: 'monospace', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 900 }}>
                    ⚡ MISSION
                  </span>
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>
                    {goal === 'deploy-first'
                      ? `Deploy: ${(selectedCategory || 'smart-contract').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}`
                      : goal === 'learn'
                      ? `Learn: ${(selectedCategory || 'NEAR').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}`
                      : goal === 'idea'
                      ? 'Build from Scratch'
                      : goal === 'discover'
                      ? 'Explore Opportunities'
                      : 'Sanctum Build Session'}
                  </span>
                </div>
              )}

              {/* 4×2 neon card grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {([
                  { id: 'shade',    color: '#8B5CF6', tags: ['Auto-Routes', 'Sees All', 'Full Stack'] },
                  { id: 'oxide',    color: '#F97316', tags: ['Rust', 'NEAR SDK', 'Smart Contracts'] },
                  { id: 'warden',   color: '#3B82F6', tags: ['Security', 'Access Control', 'Audits'] },
                  { id: 'phantom',  color: '#FBBF24', tags: ['Gas Optimization', 'Performance', 'Storage'] },
                  { id: 'nexus',    color: '#14B8A6', tags: ['Cross-Chain', 'NEAR Intents', 'Bridges'] },
                  { id: 'prism',    color: '#EC4899', tags: ['Frontend', 'Wallet UX', 'TypeScript'] },
                  { id: 'crucible', color: '#22C55E', tags: ['Testing', 'Unit Tests', 'Simulation'] },
                  { id: 'ledger',   color: '#EAB308', tags: ['Tokenomics', 'DeFi', 'Economic Design'] },
                ] as const).map(({ id, color, tags }, i) => {
                  const persona = PERSONA_LIST.find(p => p.id === id)!;
                  const isHovered = hoveredCard === id;
                  const isShade = id === 'shade';
                  return (
                    <div
                      key={id}
                      className="relative rounded-xl overflow-hidden flex flex-col cursor-default select-none"
                      style={{
                        background: `linear-gradient(155deg, ${color}16 0%, rgba(2,3,8,0.94) 50%, rgba(0,0,0,0.97) 100%)`,
                        border: `2px solid ${isHovered ? color : isShade ? `${color}88` : `${color}50`}`,
                        boxShadow: isHovered
                          ? `0 0 30px ${color}60, 0 0 70px ${color}20, inset 0 0 28px ${color}10`
                          : isShade
                          ? `0 0 20px ${color}40, 0 0 50px ${color}14, inset 0 0 20px ${color}10`
                          : `0 0 10px ${color}20, inset 0 0 12px ${color}06`,
                        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                        animation: isShade
                          ? `sanctumFadeInUp 0.4s ease-out backwards, shadeBorderPulse 3s ease-in-out 0.5s infinite`
                          : `sanctumFadeInUp 0.4s ease-out ${i * 55}ms backwards`,
                      }}
                      onMouseEnter={() => setHoveredCard(id)}
                      onMouseLeave={() => setHoveredCard(null)}
                    >
                      {/* Watermark */}
                      <div
                        className="absolute top-0 right-0 leading-none pointer-events-none select-none"
                        style={{ fontSize: '80px', opacity: isHovered ? 0.12 : 0.05, filter: `drop-shadow(0 0 10px ${color})`, transform: 'translate(12px, -10px)', transition: 'opacity 0.2s' }}
                      >
                        {persona.emoji}
                      </div>

                      {/* Corner dots — bottom only for non-Shade (top-right replaced by badge) */}
                      <div className="absolute top-2 left-2 w-1 h-1 rounded-full" style={{ background: color, opacity: isHovered ? 1 : 0.45 }} />
                      {isShade && <div className="absolute top-2 right-2 w-1 h-1 rounded-full" style={{ background: color, opacity: isHovered ? 1 : 0.7 }} />}
                      <div className="absolute bottom-2 left-2 w-1 h-1 rounded-full" style={{ background: color, opacity: isHovered ? 1 : 0.45 }} />
                      <div className="absolute bottom-2 right-2 w-1 h-1 rounded-full" style={{ background: color, opacity: isHovered ? 1 : 0.45 }} />

                      {/* [1] SHADE: ● ACTIVE badge (top-center) */}
                      {isShade && (
                        <div
                          className="absolute top-2 left-1/2 z-20 flex items-center gap-1 px-2 py-0.5 rounded-full"
                          style={{ transform: 'translateX(-50%)', background: '#8B5CF620', border: '1px solid #8B5CF665' }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#A78BFA', animation: 'pulse 1.5s ease-in-out infinite', boxShadow: '0 0 5px #8B5CF6' }} />
                          <span style={{ fontSize: '8px', color: '#C4B5FD', fontWeight: 900, letterSpacing: '0.18em', textTransform: 'uppercase' }}>ACTIVE</span>
                        </div>
                      )}

                      {/* [2] NON-SHADE: ⚡ AUTO badge (top-right) */}
                      {!isShade && (
                        <div
                          className="absolute top-1.5 right-1.5 z-20 flex items-center gap-0.5 rounded-full"
                          style={{ padding: '2px 6px', background: `${color}14`, border: `1px solid ${color}45` }}
                        >
                          <span style={{ fontSize: '7px', color, fontWeight: 900, letterSpacing: '0.1em', textTransform: 'uppercase' }}>⚡ AUTO</span>
                        </div>
                      )}

                      {/* Scan sweep */}
                      {isHovered && (
                        <div
                          className="absolute inset-y-0 w-[45%] pointer-events-none z-10"
                          style={{ background: `linear-gradient(90deg, transparent, ${color}18, transparent)`, animation: 'scanSweep 0.55s ease-out forwards' }}
                        />
                      )}

                      {/* Card body */}
                      <div className="relative z-10 flex flex-col items-center px-2 pt-4 pb-3 gap-1.5">
                        <div style={{ filter: isHovered ? `drop-shadow(0 0 14px ${color}) drop-shadow(0 0 28px ${color}80)` : `drop-shadow(0 0 8px ${color}80)`, transition: 'filter 0.2s' }}>
                          <span className="text-4xl sm:text-5xl leading-none">{persona.emoji}</span>
                        </div>
                        <h3
                          className="font-black uppercase tracking-wide leading-none text-center"
                          style={{ fontSize: '20px', color, textShadow: isHovered ? `0 0 16px ${color}, 0 0 32px ${color}60` : isShade ? `0 0 12px ${color}88` : `0 0 8px ${color}50`, transition: 'text-shadow 0.2s' }}
                        >
                          {persona.name.toUpperCase()}
                        </h3>
                        <p className="font-mono uppercase text-center" style={{ fontSize: '11px', letterSpacing: '0.12em', color: `${color}99` }}>
                          {persona.role}
                        </p>
                        <p className="italic text-center leading-snug px-1 line-clamp-2" style={{ fontSize: '11px', color: `${color}ee` }}>
                          &quot;{persona.description}&quot;
                        </p>
                        <div className="flex flex-wrap justify-center gap-1">
                          {tags.slice(0, 3).map(tag => (
                            <span key={tag} className="font-black uppercase rounded-full" style={{ fontSize: '10px', letterSpacing: '0.08em', padding: '3px 8px', color, border: `1px solid ${color}55`, background: `${color}18` }}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Bottom chromatic bar */}
                      <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent 5%, ${color} 50%, transparent 95%)`, opacity: isHovered ? 1 : isShade ? 0.75 : 0.55, transition: 'opacity 0.2s' }} />
                    </div>
                  );
                })}
              </div>

              {/* [3] How it works — kills "do I pick one?" confusion */}
              <p className="text-center" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>
                <span style={{ color: '#C4B5FD', fontWeight: 700 }}>Shade</span>
                {' '}leads every build.{' '}
                <span style={{ color: 'rgba(255,255,255,0.45)' }}>Specialists deploy automatically as your project evolves.</span>
              </p>

              {/* [6] Full-width LAUNCH SESSION button — breathing glow */}
              <button
                onClick={handleLaunch}
                className="group relative w-full rounded-xl overflow-hidden focus:outline-none active:scale-[0.99]"
                style={{
                  background: 'rgba(0,236,151,0.08)',
                  border: '2px solid #00ec97',
                  minHeight: '58px',
                  transition: 'background 0.2s',
                  animation: 'sanctumFadeInUp 0.4s ease-out 0.5s backwards, launchGlow 2.5s ease-in-out 1s infinite',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,236,151,0.16)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,236,151,0.08)'; }}
              >
                <div className="absolute inset-y-0 w-[30%] pointer-events-none opacity-0 group-hover:opacity-100" style={{ background: 'linear-gradient(90deg, transparent, rgba(0,236,151,0.10), transparent)', animation: 'scanSweep 1s ease-out forwards' }} />
                {(['top-2 left-3', 'top-2 right-3', 'bottom-2 left-3', 'bottom-2 right-3'] as const).map((pos, idx) => (
                  <div key={idx} className={`absolute ${pos} w-1.5 h-1.5 rounded-full`} style={{ background: '#00ec97', opacity: 0.65 }} />
                ))}
                <div className="relative z-10 flex items-center justify-center gap-3 sm:gap-4 py-3 px-4">
                  <Rocket className="w-5 h-5 sm:w-6 sm:h-6 text-near-green flex-shrink-0" style={{ filter: 'drop-shadow(0 0 8px rgba(0,236,151,1))' }} />
                  <div className="text-center">
                    <div className="text-lg sm:text-xl font-black uppercase tracking-widest leading-none" style={{ color: '#00ec97', textShadow: '0 0 20px rgba(0,236,151,1), 0 0 50px rgba(0,236,151,0.5)' }}>
                      LAUNCH SESSION
                    </div>
                    <div className="text-[9px] font-mono uppercase tracking-[0.2em] text-near-green/50 mt-0.5 hidden sm:block">
                      specialists auto-deployed as your build evolves
                    </div>
                  </div>
                  <Rocket className="w-5 h-5 sm:w-6 sm:h-6 text-near-green flex-shrink-0" style={{ filter: 'drop-shadow(0 0 8px rgba(0,236,151,1))' }} />
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: 'linear-gradient(90deg, transparent 5%, #00ec97 50%, transparent 95%)' }} />
              </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        /* [1] Shade card — breathing border pulse */
        @keyframes shadeBorderPulse {
          0%, 100% { box-shadow: 0 0 20px #8B5CF640, 0 0 50px #8B5CF614, inset 0 0 20px #8B5CF610; }
          50%       { box-shadow: 0 0 38px #8B5CF672, 0 0 90px #8B5CF622, inset 0 0 30px #8B5CF618; }
        }
        /* [6] Launch button — breathing glow */
        @keyframes launchGlow {
          0%, 100% { box-shadow: 0 0 24px rgba(0,236,151,0.48), 0 0 65px rgba(0,236,151,0.14); }
          50%       { box-shadow: 0 0 48px rgba(0,236,151,0.78), 0 0 110px rgba(0,236,151,0.28); }
        }
        @keyframes sanctumFadeInUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes sanctumSlideUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .wizard-slide-in-right {
          animation: wizardSlideRight 0.35s ease-out;
        }
        .wizard-slide-in-left {
          animation: wizardSlideLeft 0.35s ease-out;
        }
        @keyframes wizardSlideRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes wizardSlideLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes scanSweep {
          from { left: -45%; }
          to { left: 145%; }
        }
        @keyframes floatParticle {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.4; }
          50% { transform: translateY(-6px) scale(1.2); opacity: 0.8; }
        }
        @keyframes subtleFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
    </section>
  );
}

// --- Sub-components ---

function GoalCard({
  emoji,
  title,
  subtitle,
  description,
  color,
  tag,
  tagIcon,
  delay,
  onClick,
  selected,
  featured,
  wide,
}: {
  emoji: string;
  title: string;
  subtitle?: string;
  description: string;
  color: 'amber' | 'cyan' | 'green' | 'purple' | 'teal';
  tag?: string;
  tagIcon?: string;
  delay: number;
  onClick: () => void;
  selected: boolean;
  featured?: boolean;
  wide?: boolean;
}) {
  const colorMap = {
    amber: {
      border: 'border-amber-500/50',
      bg: 'bg-gradient-to-br from-amber-500/15 via-orange-500/8 to-transparent',
      shadow: 'shadow-amber-500/25',
      hover: 'hover:border-amber-500/30',
      text: 'text-amber-400',
      tagBg: 'bg-amber-500/15 text-amber-300 border-amber-500/20',
      glow: 'rgba(245,158,11,0.15)',
      iconBg: 'bg-amber-500/15 border-amber-500/20',
      ring: 'ring-amber-500/30',
    },
    cyan: {
      border: 'border-cyan-500/50',
      bg: 'bg-gradient-to-br from-cyan-500/15 via-blue-500/8 to-transparent',
      shadow: 'shadow-cyan-500/25',
      hover: 'hover:border-cyan-500/30',
      text: 'text-cyan-400',
      tagBg: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/20',
      glow: 'rgba(6,182,212,0.15)',
      iconBg: 'bg-cyan-500/15 border-cyan-500/20',
      ring: 'ring-cyan-500/30',
    },
    green: {
      border: 'border-near-green/50',
      bg: 'bg-gradient-to-br from-near-green/15 via-emerald-500/8 to-transparent',
      shadow: 'shadow-near-green/25',
      hover: 'hover:border-near-green/30',
      text: 'text-near-green',
      tagBg: 'bg-near-green/15 text-near-green border-near-green/20',
      glow: 'rgba(0,236,151,0.15)',
      iconBg: 'bg-near-green/15 border-near-green/20',
      ring: 'ring-near-green/30',
    },
    purple: {
      border: 'border-purple-500/50',
      bg: 'bg-gradient-to-br from-purple-500/15 via-violet-500/8 to-transparent',
      shadow: 'shadow-purple-500/25',
      hover: 'hover:border-purple-500/30',
      text: 'text-purple-400',
      tagBg: 'bg-purple-500/15 text-purple-300 border-purple-500/20',
      glow: 'rgba(168,85,247,0.15)',
      iconBg: 'bg-purple-500/15 border-purple-500/20',
      ring: 'ring-purple-500/30',
    },
    teal: {
      border: 'border-teal-500/50',
      bg: 'bg-gradient-to-br from-teal-500/15 via-emerald-500/8 to-transparent',
      shadow: 'shadow-teal-500/25',
      hover: 'hover:border-teal-500/30',
      text: 'text-teal-400',
      tagBg: 'bg-teal-500/15 text-teal-300 border-teal-500/20',
      glow: 'rgba(20,184,166,0.15)',
      iconBg: 'bg-teal-500/15 border-teal-500/20',
      ring: 'ring-teal-500/30',
    },
  };

  const c = colorMap[color];

  return (
    <button
      onClick={onClick}
      className={`goal-card group relative overflow-hidden rounded-2xl border-2 transition-all duration-300 text-left ${
        wide ? 'p-7 sm:p-8' : 'p-6'
      } ${
        selected
          ? `${c.border} ${c.bg} shadow-xl ${c.shadow} ring-1 ${c.ring}`
          : `border-white/[0.06] bg-white/[0.02] ${c.hover}`
      } hover:scale-[1.015] active:scale-[0.99]`}
      style={{
        animationDelay: `${delay}ms`,
        animation: 'sanctumFadeInUp 0.5s ease-out backwards',
      }}
    >
      {/* Hover glow overlay */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${c.glow}, transparent 40%)` }}
      />

      {/* Selected corner accent */}
      {selected && (
        <div className="absolute top-0 right-0 w-20 h-20 pointer-events-none">
          <div className={`absolute top-3 right-3 w-3 h-3 rounded-full ${c.text} animate-pulse`} style={{ boxShadow: `0 0 12px ${c.glow}` }}>
            <div className="w-full h-full rounded-full bg-current" />
          </div>
        </div>
      )}

      {/* Content */}
      <div className={`relative z-10 ${wide ? 'flex items-start gap-6 sm:gap-8' : ''}`}>
        {/* Emoji icon with background */}
        <div className={`${wide ? 'flex-shrink-0' : 'mb-4'}`}>
          <div className={`inline-flex items-center justify-center ${wide ? 'w-14 h-14' : 'w-12 h-12'} rounded-xl border ${c.iconBg} backdrop-blur-sm transition-transform duration-300 group-hover:scale-110`}>
            <span className={`${wide ? 'text-2xl' : 'text-xl'}`}>{emoji}</span>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          {/* Title */}
          <h3 className={`${wide ? 'text-lg' : 'text-base'} font-bold mb-1 transition-colors duration-200 ${
            selected ? c.text : 'text-text-primary'
          } group-hover:${c.text}`}>
            {title}
            {featured && !selected && (
              <span className="inline-block ml-2 align-middle">
                <ChevronRight className={`w-4 h-4 inline ${c.text} opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300`} />
              </span>
            )}
          </h3>

          {/* Subtitle — mode tagline */}
          {subtitle && (
            <p className={`text-[11px] font-mono mb-2 ${c.text} opacity-70`}>
              {subtitle}
            </p>
          )}

          {/* Description */}
          <p className={`${wide ? 'text-sm sm:text-base' : 'text-sm'} text-text-muted leading-relaxed ${wide ? 'max-w-xl' : ''}`}>
            {description}
          </p>

          {/* Tag pill */}
          {tag && (
            <span className={`inline-flex items-center gap-1.5 mt-3 text-[10px] font-semibold uppercase tracking-widest px-3 py-1 rounded-full border backdrop-blur-sm ${c.tagBg}`}>
              {tagIcon || '✨'} {tag}
            </span>
          )}
        </div>
      </div>

      {/* Bottom gradient line for selected */}
      {selected && (
        <div className="absolute bottom-0 left-4 right-4 h-[2px] rounded-full" style={{ background: `linear-gradient(90deg, transparent, ${c.glow.replace('0.15', '0.6')}, transparent)` }} />
      )}
    </button>
  );
}

// ── SpecialistCard — Legendary Council member card ──
function SpecialistCard({
  persona,
  meta,
  index,
  isHovered,
  isDimmed,
  onHover,
  onLeave,
  mini = false,
}: {
  persona: Persona;
  meta: { color: string; tags: string[]; triggers: string[] };
  index: number;
  isHovered: boolean;
  isDimmed: boolean;
  onHover: () => void;
  onLeave: () => void;
  mini?: boolean;
}) {
  const { color, tags, triggers } = meta;
  const glowSubtle = `${color}20`;
  const glowMed = `${color}44`;
  const glowStrong = `${color}66`;
  const borderIdle = `${color}30`;
  const borderHover = `${color}88`;

  return (
    <div
      className="relative rounded-xl border overflow-hidden cursor-default"
      style={{
        background: `linear-gradient(135deg, ${color}0e 0%, rgba(0,0,0,0.4) 100%)`,
        borderColor: isHovered ? borderHover : borderIdle,
        boxShadow: isHovered
          ? `0 0 32px ${glowStrong}, 0 4px 16px rgba(0,0,0,0.4), inset 0 0 20px ${glowSubtle}`
          : `0 0 8px ${glowSubtle}, 0 2px 8px rgba(0,0,0,0.3)`,
        transform: isHovered
          ? 'translateY(-5px) scale(1.04) perspective(600px) rotateY(1.5deg)'
          : 'translateY(0) scale(1)',
        opacity: isDimmed ? 0.45 : 1,
        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        animation: `sanctumFadeInUp 0.45s ease-out ${(index + 1) * 75}ms backwards`,
      }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {/* Scan sweep on hover */}
      {isHovered && (
        <div
          className="absolute inset-y-0 w-[45%] pointer-events-none z-10"
          style={{
            background: `linear-gradient(90deg, transparent, ${color}18, transparent)`,
            animation: 'scanSweep 0.55s ease-out forwards',
          }}
        />
      )}

      {/* Ambient corner glow */}
      <div
        className="absolute top-0 right-0 w-16 h-16 pointer-events-none rounded-bl-full transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at top right, ${color}22, transparent 70%)`,
          opacity: isHovered ? 1 : 0.4,
        }}
      />

      {/* COUNCIL MEMBER badge */}
      {!mini && (
        <div
          className="absolute top-2 right-2 flex items-center gap-1 text-[7px] font-black uppercase tracking-[0.18em] px-2 py-0.5 rounded-full border"
          style={{
            color,
            borderColor: `${color}44`,
            background: `${color}14`,
          }}
        >
          <span
            className="w-1 h-1 rounded-full"
            style={{ background: color, boxShadow: `0 0 4px ${color}`, animation: 'pulse 2s ease-in-out infinite' }}
          />
          ON CALL
        </div>
      )}

      <div className={mini ? 'p-2.5' : 'p-4'}>
        {/* Emoji avatar with glow ring */}
        <div className={mini ? 'mb-1.5' : 'mb-2.5'}>
          <div
            className={`inline-flex items-center justify-center rounded-xl transition-all duration-300 ${mini ? 'w-8 h-8 text-base' : 'w-10 h-10 text-xl'}`}
            style={{
              background: `radial-gradient(circle, ${color}2e 0%, ${color}0a 100%)`,
              border: `1px solid ${color}44`,
              boxShadow: isHovered
                ? `0 0 20px ${glowStrong}, 0 0 8px ${glowMed}`
                : `0 0 8px ${glowSubtle}`,
            }}
          >
            {persona.emoji}
          </div>
        </div>

        {/* Name */}
        <h3
          className={`font-black text-white leading-none ${mini ? 'text-xs mb-1' : 'text-sm mb-0.5'}`}
          style={{ textShadow: isHovered ? `0 0 12px ${color}88` : 'none', transition: 'text-shadow 0.3s' }}
        >
          {persona.name}
        </h3>

        {/* Role — full only */}
        {!mini && (
          <p
            className="text-[10px] font-mono mb-2 font-semibold uppercase tracking-wider"
            style={{ color: `${color}bb` }}
          >
            {persona.role}
          </p>
        )}

        {/* Tagline — shown in BOTH full and mini */}
        <p
          className={`font-mono leading-snug italic ${mini ? 'text-[8px] mb-1.5 line-clamp-2' : 'text-[10px] mb-2 line-clamp-2'}`}
          style={{ color: `${color}cc` }}
        >
          &quot;{persona.description}&quot;
        </p>

        {/* Bio — full mode only, always visible */}
        {!mini && (
          <p className="text-[10px] text-white/50 leading-relaxed mb-3 line-clamp-3">
            {persona.bio ?? persona.description}
          </p>
        )}

        {/* Tags */}
        <div className={`flex flex-wrap gap-1 ${!mini ? 'mb-2' : ''}`}>
          {tags.slice(0, mini ? 2 : 3).map(tag => (
            <span
              key={tag}
              className={`font-bold uppercase tracking-wider rounded-full border ${mini ? 'text-[7px] px-1.5 py-0.5' : 'text-[8px] px-2 py-0.5'}`}
              style={{
                color,
                borderColor: `${color}40`,
                background: `${color}14`,
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Triggers hover reveal — full only */}
        {!mini && (
          <div
            className="overflow-hidden transition-all duration-300"
            style={{
              maxHeight: isHovered ? '48px' : '0px',
              opacity: isHovered ? 1 : 0,
              marginTop: isHovered ? '8px' : '0px',
            }}
          >
            <div className="pt-2 border-t" style={{ borderColor: `${color}28` }}>
              <p className="text-[8px] text-white/30 uppercase tracking-[0.15em] font-bold mb-0.5">Deploys when you say:</p>
              <p className="text-[9px] leading-relaxed" style={{ color: `${color}bb` }}>
                {triggers.join(' · ')}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom chromatic line — always visible, intensifies on hover */}
      <div
        className="absolute bottom-0 left-0 right-0 transition-all duration-300"
        style={{
          height: isHovered ? '2px' : '1px',
          background: `linear-gradient(90deg, transparent 5%, ${color}${isHovered ? 'cc' : '55'} 50%, transparent 95%)`,
        }}
      />
    </div>
  );
}
