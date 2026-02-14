'use client';

import { useState, useCallback } from 'react';
import { Container } from '@/components/ui';
import { GradientText } from '@/components/effects/GradientText';
import { CategoryPicker } from './CategoryPicker';
import { ScratchTemplates, SCRATCH_TEMPLATES } from './ScratchTemplates';
import { PERSONA_LIST } from '../lib/personas';
// @ts-ignore
import { ArrowLeft, Rocket, BookOpen, Hammer, Lightbulb, Wrench, Palette, Flame, Globe, ChevronRight, Sparkles } from 'lucide-react';

export interface WizardConfig {
  mode: 'build' | 'roast' | 'webapp' | 'visual' | 'scratch';
  category?: string | null;
  chatMode?: 'build' | 'learn';
  customPrompt?: string;
  persona?: string;
  scratchDescription?: string;
  scratchTemplate?: string | null;
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
}

type WizardStep = 'goal' | 'details' | 'persona';
type GoalChoice = 'deploy-first' | 'learn' | 'build-specific' | 'idea' | 'existing-code' | 'visual';
type ExistingCodeSub = 'roast' | 'webapp' | null;

export function SanctumWizard({ onComplete, onBack, dispatch, state }: SanctumWizardProps) {
  const [step, setStep] = useState<WizardStep>('goal');
  const [goal, setGoal] = useState<GoalChoice | null>(null);
  const [existingCodeSub, setExistingCodeSub] = useState<ExistingCodeSub>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPersona, setSelectedPersona] = useState<string>('shade');
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');

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
    } else if (choice === 'build-specific') {
      goForward('details');
    } else if (choice === 'idea') {
      goForward('details');
    } else if (choice === 'visual') {
      // Direct launch — visual mode
      onComplete({ mode: 'visual' });
    } else if (choice === 'existing-code') {
      // Show sub-choice inline, don't advance step yet
      setExistingCodeSub(null);
    }
  }, [goForward, onComplete]);

  const handleExistingCodeSub = useCallback((sub: 'roast' | 'webapp') => {
    setExistingCodeSub(sub);
    if (sub === 'roast') {
      // Roast mode — go to persona
      setGoal('existing-code');
      goForward('persona');
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

  const handlePersonaSelect = useCallback((personaId: string) => {
    setSelectedPersona(personaId);
  }, []);

  const handleLaunch = useCallback(() => {
    // Save persona to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('sanctum-chat-persona', selectedPersona);
    }

    const config: WizardConfig = { mode: 'build', persona: selectedPersona };

    if (goal === 'deploy-first') {
      config.mode = 'build';
      config.chatMode = 'learn';
      config.category = selectedCategory || 'meme-tokens';
    } else if (goal === 'learn') {
      config.mode = 'build';
      config.chatMode = 'learn';
      config.category = selectedCategory;
      config.customPrompt = state.customPrompt || undefined;
    } else if (goal === 'build-specific') {
      config.mode = 'build';
      config.chatMode = 'build';
      config.category = selectedCategory;
      config.customPrompt = state.customPrompt || undefined;
    } else if (goal === 'idea') {
      config.mode = 'scratch';
      config.scratchDescription = state.scratchDescription;
      config.scratchTemplate = state.scratchTemplate;
    } else if (goal === 'existing-code' && existingCodeSub === 'roast') {
      config.mode = 'roast';
    }

    onComplete(config);
  }, [goal, selectedCategory, selectedPersona, existingCodeSub, state, onComplete]);

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
            <Container size="xl" className="py-8 px-4">
              <div className="text-center mb-10">
                <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-2">
                  What&apos;s your <GradientText>goal</GradientText>?
                </h2>
                <p className="text-text-muted text-sm">Choose your path into the Sanctum</p>
              </div>

              {/* Main 4 cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto mb-8">
                <GoalCard
                  emoji="🚀"
                  title="Deploy my first contract"
                  description="Fast track for beginners. We'll walk you through everything."
                  color="amber"
                  tag="Beginner Friendly"
                  delay={0}
                  onClick={() => handleGoalSelect('deploy-first')}
                  selected={goal === 'deploy-first'}
                />
                <GoalCard
                  emoji="📚"
                  title="Learn NEAR & Rust"
                  description="Educational path. AI teaches you step by step."
                  color="cyan"
                  delay={80}
                  onClick={() => handleGoalSelect('learn')}
                  selected={goal === 'learn'}
                />
                <GoalCard
                  emoji="🔨"
                  title="Build something specific"
                  description="For developers who know what they want."
                  color="green"
                  delay={160}
                  onClick={() => handleGoalSelect('build-specific')}
                  selected={goal === 'build-specific'}
                />
                <GoalCard
                  emoji="💡"
                  title="I have an idea — build it"
                  description="Describe your vision, we handle the code."
                  color="purple"
                  tag="Most Popular"
                  delay={240}
                  onClick={() => handleGoalSelect('idea')}
                  selected={goal === 'idea'}
                />
              </div>

              {/* Secondary options */}
              <div className="max-w-3xl mx-auto">
                <div className="flex flex-wrap justify-center gap-3">
                  <button
                    onClick={() => handleGoalSelect('existing-code')}
                    className={`group flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all text-sm ${
                      goal === 'existing-code'
                        ? 'border-red-500/40 bg-red-500/10 text-red-300'
                        : 'border-white/[0.08] bg-white/[0.03] text-text-muted hover:border-white/[0.15] hover:text-text-secondary'
                    }`}
                  >
                    <Wrench className="w-4 h-4" />
                    I have existing code
                    <ChevronRight className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleGoalSelect('visual')}
                    className="group flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.03] text-text-muted hover:border-purple-500/30 hover:text-purple-300 transition-all text-sm"
                  >
                    <Palette className="w-4 h-4" />
                    Visual Generator
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                {/* Existing code sub-options (inline) */}
                {goal === 'existing-code' && (
                  <div className="mt-4 flex flex-wrap justify-center gap-3" style={{ animation: 'sanctumSlideUp 0.3s ease-out' }}>
                    <button
                      onClick={() => handleExistingCodeSub('roast')}
                      className="flex items-center gap-2 px-5 py-3 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-300 transition-all text-sm font-medium"
                    >
                      <Flame className="w-4 h-4" />
                      Roast Zone (Audit)
                    </button>
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
              {(goal === 'learn' || goal === 'build-specific') && (
                <>
                  <div className="text-center mb-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-2">
                      Choose a <GradientText>category</GradientText>
                    </h2>
                    <p className="text-text-muted text-sm">
                      {goal === 'learn'
                        ? 'Pick a contract type to learn about'
                        : 'What are you building?'}
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
                        className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-near-green to-emerald-400 text-void-black font-semibold text-lg hover:from-near-green/90 hover:to-emerald-400/90 transition-all shadow-lg shadow-near-green/25 disabled:opacity-40 disabled:cursor-not-allowed"
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

          {/* Step 3: Persona Selector */}
          {step === 'persona' && (
            <Container size="xl" className="py-8 px-4">
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-2">
                  Choose your <GradientText>guide</GradientText>
                </h2>
                <p className="text-text-muted text-sm">
                  Each expert has a unique personality and specialty
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 max-w-4xl mx-auto mb-8">
                {PERSONA_LIST.map((persona, i) => (
                  <button
                    key={persona.id}
                    onClick={() => handlePersonaSelect(persona.id)}
                    className={`group relative p-4 rounded-xl border-2 transition-all duration-200 text-left hover:scale-[1.02] ${
                      selectedPersona === persona.id
                        ? `${persona.borderColor} ${persona.bgColor} shadow-lg`
                        : 'border-white/[0.08] bg-white/[0.02] hover:border-white/[0.15] hover:bg-white/[0.04]'
                    }`}
                    style={{
                      animationDelay: `${i * 50}ms`,
                      animation: 'sanctumFadeInUp 0.4s ease-out backwards',
                    }}
                  >
                    {selectedPersona === persona.id && (
                      <div className={`absolute top-2 right-2 w-5 h-5 rounded-full ${persona.bgColor} flex items-center justify-center`}>
                        <Sparkles className="w-3 h-3 text-near-green" />
                      </div>
                    )}
                    <div className="text-2xl mb-2">{persona.emoji}</div>
                    <h3 className={`text-sm font-bold mb-0.5 ${
                      selectedPersona === persona.id ? persona.color : 'text-text-primary'
                    }`}>
                      {persona.name}
                    </h3>
                    <p className="text-[11px] text-text-muted mb-2">{persona.role}</p>
                    <p className="text-[10px] text-text-muted/70 leading-relaxed line-clamp-2">
                      {persona.description}
                    </p>
                  </button>
                ))}
              </div>

              {/* Launch + Skip */}
              <div className="text-center space-y-3">
                <button
                  onClick={handleLaunch}
                  className="group inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-gradient-to-r from-near-green to-emerald-400 text-void-black font-bold text-xl hover:from-near-green/90 hover:to-emerald-400/90 transition-all shadow-2xl shadow-near-green/30 hover:shadow-near-green/50 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Rocket className="w-6 h-6" />
                  Launch Session
                </button>
                <div>
                  <button
                    onClick={() => {
                      setSelectedPersona('shade');
                      handleLaunch();
                    }}
                    className="text-sm text-text-muted hover:text-text-secondary transition-colors underline underline-offset-2"
                  >
                    Skip — use Shade (default)
                  </button>
                </div>
              </div>
            </Container>
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
  description,
  color,
  tag,
  delay,
  onClick,
  selected,
}: {
  emoji: string;
  title: string;
  description: string;
  color: 'amber' | 'cyan' | 'green' | 'purple';
  tag?: string;
  delay: number;
  onClick: () => void;
  selected: boolean;
}) {
  const colorMap = {
    amber: {
      border: 'border-amber-500/50',
      bg: 'bg-gradient-to-br from-amber-500/15 to-orange-500/10',
      shadow: 'shadow-amber-500/20',
      hover: 'hover:border-amber-500/30 hover:bg-amber-500/5',
      text: 'text-amber-400',
      tagBg: 'bg-amber-500/10 text-amber-400/70',
    },
    cyan: {
      border: 'border-cyan-500/50',
      bg: 'bg-gradient-to-br from-cyan-500/15 to-blue-500/10',
      shadow: 'shadow-cyan-500/20',
      hover: 'hover:border-cyan-500/30 hover:bg-cyan-500/5',
      text: 'text-cyan-400',
      tagBg: 'bg-cyan-500/10 text-cyan-400/70',
    },
    green: {
      border: 'border-near-green/50',
      bg: 'bg-gradient-to-br from-near-green/15 to-emerald-500/10',
      shadow: 'shadow-near-green/20',
      hover: 'hover:border-near-green/30 hover:bg-near-green/5',
      text: 'text-near-green',
      tagBg: 'bg-near-green/10 text-near-green/70',
    },
    purple: {
      border: 'border-purple-500/50',
      bg: 'bg-gradient-to-br from-purple-500/15 to-pink-500/10',
      shadow: 'shadow-purple-500/20',
      hover: 'hover:border-purple-500/30 hover:bg-purple-500/5',
      text: 'text-purple-400',
      tagBg: 'bg-purple-500/10 text-purple-400/70',
    },
  };

  const c = colorMap[color];

  return (
    <button
      onClick={onClick}
      className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 text-left hover:scale-[1.02] ${
        selected
          ? `${c.border} ${c.bg} shadow-lg ${c.shadow}`
          : `border-white/[0.08] bg-void-gray/30 ${c.hover}`
      }`}
      style={{
        animationDelay: `${delay}ms`,
        animation: 'sanctumFadeInUp 0.5s ease-out backwards',
      }}
    >
      <div className="text-3xl mb-3">{emoji}</div>
      <h3 className={`text-base font-bold mb-1.5 transition-colors ${
        selected ? c.text : `text-text-primary group-hover:${c.text}`
      }`}>
        {title}
      </h3>
      <p className="text-sm text-text-muted leading-relaxed">{description}</p>
      {tag && (
        <span className={`inline-block mt-3 text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full ${c.tagBg}`}>
          ✨ {tag}
        </span>
      )}
    </button>
  );
}
