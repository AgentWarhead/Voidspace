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

          {/* Step 3: Meet the Council — Bento Command Grid */}
          {step === 'persona' && (
            <div className="flex flex-col h-full px-4 py-3 max-w-4xl mx-auto w-full" style={{ minHeight: 0 }}>
              {/* Compact edgy header */}
              <div className="text-center mb-3 flex-shrink-0">
                <div className="inline-flex items-center gap-2 mb-2 px-3 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" style={{ animation: 'pulse 2s ease-in-out infinite' }} />
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-purple-400/80">Classified Briefing</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" style={{ animation: 'pulse 2s ease-in-out infinite' }} />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-text-primary leading-tight">
                  Meet the <GradientText>Council</GradientText>
                </h2>
                <p className="text-xs text-text-muted/60 mt-1">
                  Eight specialists. Zero mercy. Auto-deployed as your build evolves.
                </p>
              </div>

              {/* Bento command grid — everything in one viewport */}
              <div
                className="flex-1 grid grid-cols-4 gap-2 min-h-0"
                style={{ gridTemplateRows: '1fr 1fr minmax(88px, 110px)' }}
              >
                {/* ── SHADE — 2×2 command cell ── */}
                {(() => {
                  const shade = PERSONA_LIST.find(p => p.id === 'shade')!;
                  return (
                    <div
                      className="col-span-2 row-span-2 relative rounded-2xl border-2 border-purple-500/40 overflow-hidden flex flex-col justify-between p-5"
                      style={{
                        background: 'linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(109,40,217,0.08) 50%, rgba(0,0,0,0.3) 100%)',
                        boxShadow: '0 0 40px rgba(139,92,246,0.2), inset 0 0 40px rgba(139,92,246,0.05)',
                        animation: 'sanctumFadeInUp 0.4s ease-out backwards',
                      }}
                    >
                      {/* Subtle scanlines */}
                      <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
                        style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,1) 3px, rgba(255,255,255,1) 4px)' }} />

                      {/* LEAD ARCHITECT badge */}
                      <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/25 border border-purple-400/40">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400" style={{ animation: 'pulse 2s ease-in-out infinite' }} />
                        <span className="text-[9px] font-bold uppercase tracking-wider text-purple-300">Lead Architect</span>
                      </div>

                      {/* Top: emoji + class label */}
                      <div>
                        <div
                          className="inline-flex items-center justify-center w-14 h-14 rounded-xl text-3xl border border-purple-500/30"
                          style={{
                            background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, rgba(139,92,246,0.05) 100%)',
                            boxShadow: '0 0 24px rgba(139,92,246,0.5)',
                          }}
                        >
                          {shade.emoji}
                        </div>
                        <div className="mt-2 text-[8px] font-bold uppercase tracking-[0.2em] text-purple-400/50">Class: Mastermind</div>
                      </div>

                      {/* Bottom: name + description + tags */}
                      <div>
                        <h3 className="text-xl font-black text-purple-300 mb-0.5">{shade.name}</h3>
                        <p className="text-[10px] font-mono text-purple-400/70 mb-2">{shade.role}</p>
                        <p className="text-xs text-text-secondary/80 leading-relaxed mb-3 line-clamp-3">{shade.description}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {['Auto-Routes', 'Sees All', 'Full Stack'].map(tag => (
                            <span key={tag} className="text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-purple-400/30 text-purple-300/80 bg-purple-500/10">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Bottom glow line */}
                      <div className="absolute bottom-0 left-0 right-0 h-[2px]"
                        style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.8), transparent)' }} />
                    </div>
                  );
                })()}

                {/* ── SIDE SPECIALISTS — Oxide, Warden, Phantom, Nexus ── */}
                {(['oxide', 'warden', 'phantom', 'nexus'] as const).map((id, i) => {
                  const persona = PERSONA_LIST.find(p => p.id === id)!;
                  const meta = SPECIALIST_META[id] ?? { color: '#ffffff', tags: [], triggers: [] };
                  return (
                    <SpecialistCard
                      key={id}
                      persona={persona}
                      meta={meta}
                      index={i + 1}
                      isHovered={hoveredCard === id}
                      onHover={() => setHoveredCard(id)}
                      onLeave={() => setHoveredCard(null)}
                    />
                  );
                })}

                {/* ── BOTTOM ROW: Prism, Crucible, Ledger (mini) ── */}
                {(['prism', 'crucible', 'ledger'] as const).map((id, i) => {
                  const persona = PERSONA_LIST.find(p => p.id === id)!;
                  const meta = SPECIALIST_META[id] ?? { color: '#ffffff', tags: [], triggers: [] };
                  return (
                    <SpecialistCard
                      key={id}
                      persona={persona}
                      meta={meta}
                      index={i + 5}
                      isHovered={hoveredCard === id}
                      onHover={() => setHoveredCard(id)}
                      onLeave={() => setHoveredCard(null)}
                      mini
                    />
                  );
                })}

                {/* ── LAUNCH BUTTON — 4th cell, bottom row ── */}
                <button
                  onClick={handleLaunch}
                  className="group relative rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.04] active:scale-[0.97] focus:outline-none"
                  style={{
                    background: 'linear-gradient(135deg, #00ec97 0%, #10b981 100%)',
                    boxShadow: '0 0 20px rgba(0,236,151,0.35)',
                    animation: 'sanctumFadeInUp 0.4s ease-out 0.65s backwards',
                  }}
                >
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-200" />
                  <div className="relative flex flex-col items-center justify-center h-full gap-1 p-3">
                    <Rocket className="w-6 h-6 text-void-black drop-shadow" />
                    <span className="text-xs font-black text-void-black uppercase tracking-wider leading-none">Launch</span>
                    <span className="text-[9px] font-semibold text-void-black/60 uppercase tracking-widest leading-none">Session</span>
                  </div>
                  <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ boxShadow: 'inset 0 0 20px rgba(255,255,255,0.1)' }} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
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
  onHover,
  onLeave,
  mini = false,
}: {
  persona: Persona;
  meta: { color: string; tags: string[]; triggers: string[] };
  index: number;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  mini?: boolean;
}) {
  const { color, tags, triggers } = meta;
  const glowSubtle = `${color}26`; // ~15% opacity
  const glowStrong = `${color}55`; // ~33% opacity
  const glowBorder = `${color}66`; // ~40% opacity

  return (
    <div
      className="relative rounded-xl border transition-all duration-300 cursor-default overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${color}0d 0%, rgba(255,255,255,0.02) 100%)`,
        borderColor: isHovered ? glowBorder : `${color}33`,
        boxShadow: isHovered
          ? `0 0 24px ${glowStrong}, 0 0 6px ${glowSubtle}, inset 0 0 12px ${glowSubtle}`
          : `0 0 8px ${glowSubtle}`,
        transform: isHovered ? 'translateY(-4px) scale(1.03)' : 'translateY(0) scale(1)',
        animation: `sanctumFadeInUp 0.45s ease-out ${(index + 1) * 80}ms backwards`,
      }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {/* AUTO-DEPLOYED badge — hidden in mini mode */}
      {!mini && (
        <div
          className="absolute top-2 right-2 text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border"
          style={{
            color,
            borderColor: `${color}55`,
            background: `${color}18`,
          }}
        >
          AUTO
        </div>
      )}

      <div className={mini ? 'p-2.5' : 'p-4 pt-5'}>
        {/* Glowing emoji avatar */}
        <div className={mini ? 'mb-1.5' : 'mb-3'}>
          <div
            className={`inline-flex items-center justify-center rounded-full border transition-all duration-300 ${mini ? 'w-8 h-8 text-lg' : 'w-11 h-11 text-2xl'}`}
            style={{
              background: `radial-gradient(circle, ${color}33 0%, ${color}0d 100%)`,
              borderColor: `${color}44`,
              boxShadow: isHovered ? `0 0 16px ${glowStrong}` : `0 0 6px ${glowSubtle}`,
            }}
          >
            {persona.emoji}
          </div>
        </div>

        {/* Name */}
        <h3 className={`font-bold text-text-primary mb-0.5 ${mini ? 'text-xs pr-0' : 'text-sm pr-8'}`}>{persona.name}</h3>

        {/* Role — hidden in mini mode */}
        {!mini && (
          <p className="text-[11px] font-mono mb-2" style={{ color: `${color}cc` }}>{persona.role}</p>
        )}

        {/* Tagline — hidden in mini mode */}
        {!mini && (
          <p className="text-[11px] text-text-muted/80 leading-relaxed line-clamp-2 mb-3">
            {persona.description}
          </p>
        )}

        {/* Specialty tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {tags.slice(0, mini ? 2 : 3).map(tag => (
            <span
              key={tag}
              className={`${mini ? 'text-[8px]' : 'text-[9px]'} font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border`}
              style={{ color, borderColor: `${color}44`, background: `${color}18` }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Hover reveal — triggers — hidden in mini mode */}
        {!mini && (
          <div
            className="overflow-hidden transition-all duration-300"
            style={{
              maxHeight: isHovered ? '60px' : '0px',
              opacity: isHovered ? 1 : 0,
            }}
          >
            <div className="pt-2 border-t" style={{ borderColor: `${color}33` }}>
              <p className="text-[9px] text-text-muted/60 uppercase tracking-wider font-semibold mb-1">Called in when you say:</p>
              <p className="text-[10px]" style={{ color: `${color}cc` }}>
                {triggers.join(' · ')}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[2px] transition-opacity duration-300"
        style={{
          background: `linear-gradient(90deg, transparent, ${color}88, transparent)`,
          opacity: isHovered ? 1 : 0.3,
        }}
      />
    </div>
  );
}
