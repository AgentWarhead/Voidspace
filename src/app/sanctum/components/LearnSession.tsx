'use client';

import { useState } from 'react';
import {
  ChevronLeft,
  BookOpen,
  Rocket,
  CheckCircle,
  RefreshCw,
} from 'lucide-react';
import { SanctumChat } from './SanctumChat';
import { CodePreview } from './CodePreview';
import { GlassPanel } from './GlassPanel';

// ─── Types mirrored from SanctumChat internals ─────────────────────────────
interface TaskStep {
  id: string;
  label: string;
  status: 'pending' | 'working' | 'complete' | 'error';
  progress?: number;
  detail?: string;
}

interface CurrentTask {
  name: string;
  description?: string;
  steps: TaskStep[];
  startedAt?: number;
}

// ─── Learning progress steps ────────────────────────────────────────────────
const LEARN_STEPS = [
  { id: 1, label: 'Understand the concept' },
  { id: 2, label: 'Write your first contract' },
  { id: 3, label: 'Test & iterate' },
  { id: 4, label: 'Deploy to testnet' },
  { id: 5, label: 'Ship it' },
];

function computeLearnStep(
  messagesCount: number,
  hasCode: boolean,
  deployCount: number,
): number {
  if (deployCount > 0) return 5;
  if (hasCode && messagesCount >= 6) return 4;
  if (hasCode && messagesCount >= 3) return 3;
  if (messagesCount >= 2) return 2;
  return 1;
}

// ─── Props ──────────────────────────────────────────────────────────────────
interface LearnSessionProps {
  category: string | null;
  personaId: string;
  customPrompt: string;
  generatedCode: string;
  messagesCount: number;
  contractsBuilt: number;
  deployCount: number;
  isThinking: boolean;
  onBack: () => void;
  onNewSession: () => void;
  onDeploy?: () => void;
  onCodeGenerated: (code: string) => void;
  onTokensUsed: (input: number, output: number) => void;
  onTaskUpdate?: (task: CurrentTask | null) => void;
  onThinkingChange?: (thinking: boolean) => void;
  onPersonaChange: (id: string) => void;
  onQuizAnswer: (correct: boolean) => void;
  onConceptLearned: (concept: {
    title: string;
    category: string;
    difficulty: string;
  }) => void;
  onUserMessage?: (text: string) => void;
  sessionReset?: number;
  externalMessage?: string;
  externalMessageSeq?: number;
  loadedProjectMessages?: Array<{ role: string; content: string }>;
  loadedProjectSeq?: number;
}

// ─── Component ──────────────────────────────────────────────────────────────
export function LearnSession({
  category,
  personaId,
  customPrompt,
  generatedCode,
  messagesCount,
  contractsBuilt: _contractsBuilt,
  deployCount,
  isThinking: _isThinking,
  onBack,
  onNewSession,
  onDeploy,
  onCodeGenerated,
  onTokensUsed,
  onTaskUpdate,
  onThinkingChange,
  onPersonaChange,
  onQuizAnswer,
  onConceptLearned,
  onUserMessage,
  sessionReset,
  externalMessage,
  externalMessageSeq,
  loadedProjectMessages,
  loadedProjectSeq,
}: LearnSessionProps) {
  const [activePanel, setActivePanel] = useState<'chat' | 'code'>('chat');

  const hasCode = !!generatedCode;
  const currentStep = computeLearnStep(messagesCount, hasCode, deployCount);

  return (
    <div className="fixed inset-0 z-50 bg-void-black flex flex-col">
      {/* ── Indigo/Blue ambient background ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/25 via-void-black to-blue-900/15" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="relative z-10 flex-shrink-0 bg-void-black/70 backdrop-blur-xl border-b border-white/[0.06]">
        {/* Accent gradient line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

        {/* Row 1: nav + badge + new-session */}
        <div className="flex items-center justify-between px-4 py-3 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={onBack}
              className="p-2 rounded-lg hover:bg-white/[0.06] transition-colors group flex-shrink-0"
            >
              <ChevronLeft className="w-5 h-5 text-text-muted group-hover:text-indigo-400 transition-colors" />
            </button>

            {/* Learning Mode badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 flex-shrink-0">
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-indigo-300 text-xs font-semibold tracking-wide">
                📚 Learning Mode
              </span>
            </div>

            {/* Category label (desktop only) */}
            {category && (
              <span className="hidden md:block text-sm text-text-muted capitalize truncate max-w-[160px]">
                {category.replace(/-/g, ' ')}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Deploy CTA — visible from step 4 */}
            {hasCode && currentStep >= 4 && (
              <button
                onClick={onDeploy}
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 text-white text-xs font-bold hover:from-indigo-400 hover:to-blue-400 transition-all shadow-lg shadow-indigo-500/25"
              >
                <Rocket className="w-3.5 h-3.5" />
                Deploy to Testnet
              </button>
            )}

            <button
              onClick={onNewSession}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-text-muted hover:text-indigo-300 rounded-lg hover:bg-white/[0.06] border border-white/[0.06] hover:border-indigo-500/20 transition-all"
              title="Start new session"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New</span>
            </button>
          </div>
        </div>

        {/* ── 5-step progress tracker ─────────────────────────────────── */}
        <div className="px-4 pb-4">
          <div className="flex items-center max-w-3xl mx-auto">
            {LEARN_STEPS.map((step, i) => {
              const isComplete = step.id < currentStep;
              const isActive = step.id === currentStep;
              const isLast = i === LEARN_STEPS.length - 1;

              return (
                <div key={step.id} className="flex items-center flex-1 min-w-0">
                  {/* Circle + label */}
                  <div className="flex flex-col items-center gap-1 flex-shrink-0">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                        isComplete
                          ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                          : isActive
                          ? 'bg-indigo-500/20 text-indigo-300 border-2 border-indigo-500 ring-2 ring-indigo-500/20'
                          : 'bg-white/[0.06] text-text-muted border border-white/[0.1]'
                      }`}
                    >
                      {isComplete ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        step.id
                      )}
                    </div>
                    <span
                      className={`text-[9px] font-medium hidden sm:block text-center max-w-[72px] leading-tight transition-colors ${
                        isActive
                          ? 'text-indigo-300'
                          : isComplete
                          ? 'text-indigo-400/70'
                          : 'text-text-muted/40'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>

                  {/* Connector line */}
                  {!isLast && (
                    <div
                      className={`flex-1 h-0.5 mx-1.5 rounded-full transition-all duration-500 ${
                        step.id < currentStep
                          ? 'bg-indigo-500/60'
                          : 'bg-white/[0.08]'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Mobile Tab Bar ─────────────────────────────────────────────── */}
      <div className="md:hidden relative z-10 flex-shrink-0 bg-void-black/80 backdrop-blur-sm border-b border-white/[0.08]">
        <div className="flex">
          <button
            onClick={() => setActivePanel('chat')}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-4 min-h-[48px] text-sm font-medium transition-all ${
              activePanel === 'chat'
                ? 'text-indigo-400 border-b-2 border-indigo-500 bg-indigo-500/10'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Learn
          </button>
          <button
            onClick={() => setActivePanel('code')}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-4 min-h-[48px] text-sm font-medium transition-all ${
              activePanel === 'code'
                ? 'text-blue-400 border-b-2 border-blue-500 bg-blue-500/10'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            <span>📝</span>
            Code
          </button>
        </div>
      </div>

      {/* ── Main content ────────────────────────────────────────────────── */}
      <div className="relative z-10 flex-1 flex min-h-0 overflow-hidden">
        {/* Desktop: true 50/50 split */}
        <div className="hidden md:flex flex-1 gap-3 p-3 overflow-hidden">
          {/* Left — Learning Chat */}
          <div className="w-1/2 flex flex-col h-full">
            <GlassPanel
              className="flex-1 flex flex-col overflow-hidden"
              glow
              glowColor="blue"
            >
              {/* Thin indigo accent top */}
              <div className="flex-shrink-0 h-0.5 bg-gradient-to-r from-indigo-500/60 via-blue-500/40 to-transparent rounded-t-2xl" />

              <SanctumChat
                category={category}
                customPrompt={customPrompt}
                onCodeGenerated={onCodeGenerated}
                onTokensUsed={onTokensUsed}
                onTaskUpdate={onTaskUpdate}
                onThinkingChange={onThinkingChange}
                chatMode="learn"
                personaId={personaId}
                onPersonaChange={onPersonaChange}
                onQuizAnswer={onQuizAnswer}
                onConceptLearned={onConceptLearned}
                onUserMessage={onUserMessage}
                sessionReset={sessionReset}
                externalMessage={externalMessage}
                externalMessageSeq={externalMessageSeq}
                loadedProjectMessages={loadedProjectMessages}
                loadedProjectSeq={loadedProjectSeq}
              />
            </GlassPanel>
          </div>

          {/* Right — Code Preview with annotations */}
          <div className="w-1/2 flex flex-col h-full">
            <GlassPanel
              className="flex-1 flex flex-col overflow-hidden"
              glow
              glowColor="blue"
            >
              {/* Thin blue accent top */}
              <div className="flex-shrink-0 h-0.5 bg-gradient-to-r from-blue-500/60 via-indigo-500/40 to-transparent rounded-t-2xl" />

              {/* Code panel header */}
              <div className="flex-shrink-0 px-4 py-3 border-b border-white/[0.08] bg-void-black/40">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-text-primary flex items-center gap-2">
                    <span className="text-base">📝</span>
                    <span className="text-indigo-300">Contract</span>&nbsp;Code
                  </h2>
                  {hasCode && currentStep >= 4 && (
                    <button
                      onClick={onDeploy}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs hover:bg-indigo-500/30 transition-all"
                    >
                      <Rocket className="w-3 h-3" />
                      Deploy to Testnet
                    </button>
                  )}
                </div>
              </div>

              {/* Annotations-on code preview */}
              <div className="flex-1 min-h-0 overflow-hidden">
                <CodePreview
                  code={generatedCode}
                  mode="learn"
                  contractName={category || 'my-contract'}
                />
              </div>
            </GlassPanel>
          </div>
        </div>

        {/* Mobile: tabbed panels */}
        <div className="md:hidden flex-1 flex flex-col overflow-hidden">
          {activePanel === 'chat' && (
            <div className="flex-1 p-3 overflow-hidden flex flex-col">
              <GlassPanel
                className="flex-1 flex flex-col overflow-hidden"
                glow
                glowColor="blue"
              >
                <div className="flex-shrink-0 h-0.5 bg-gradient-to-r from-indigo-500/60 via-blue-500/40 to-transparent rounded-t-2xl" />
                <SanctumChat
                  category={category}
                  customPrompt={customPrompt}
                  onCodeGenerated={onCodeGenerated}
                  onTokensUsed={onTokensUsed}
                  onTaskUpdate={onTaskUpdate}
                  onThinkingChange={onThinkingChange}
                  chatMode="learn"
                  personaId={personaId}
                  onPersonaChange={onPersonaChange}
                  onQuizAnswer={onQuizAnswer}
                  onConceptLearned={onConceptLearned}
                  onUserMessage={onUserMessage}
                  sessionReset={sessionReset}
                  externalMessage={externalMessage}
                  externalMessageSeq={externalMessageSeq}
                  loadedProjectMessages={loadedProjectMessages}
                  loadedProjectSeq={loadedProjectSeq}
                />
              </GlassPanel>
            </div>
          )}
          {activePanel === 'code' && (
            <div className="flex-1 p-3 overflow-hidden flex flex-col">
              <GlassPanel
                className="flex-1 flex flex-col overflow-hidden"
                glow
                glowColor="blue"
              >
                <div className="flex-shrink-0 h-0.5 bg-gradient-to-r from-blue-500/60 via-indigo-500/40 to-transparent rounded-t-2xl" />
                {hasCode && currentStep >= 4 && (
                  <div className="flex-shrink-0 px-4 py-2.5 border-b border-white/[0.08] bg-void-black/40 flex items-center justify-end">
                    <button
                      onClick={onDeploy}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs hover:bg-indigo-500/30 transition-all"
                    >
                      <Rocket className="w-3 h-3" />
                      Deploy to Testnet
                    </button>
                  </div>
                )}
                <div className="flex-1 min-h-0 overflow-hidden">
                  <CodePreview
                    code={generatedCode}
                    mode="learn"
                    contractName={category || 'my-contract'}
                  />
                </div>
              </GlassPanel>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
