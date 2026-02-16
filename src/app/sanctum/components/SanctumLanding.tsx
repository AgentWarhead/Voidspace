'use client';

import { Container } from '@/components/ui';
import { GradientText } from '@/components/effects/GradientText';
import { SocialProof } from './SocialProof';
import { SanctumPreview } from './SanctumPreview';
import { PERSONA_LIST } from '../lib/personas';
// @ts-ignore
import { Sparkles, Zap, Code2, Rocket, ArrowRight, Clock, MessageSquare } from 'lucide-react';

interface SavedSessionInfo {
  mode?: string;
  selectedCategory?: string | null;
  messageCount?: number;
  tokensUsed?: number;
}

interface SanctumLandingProps {
  onEnterSanctum: () => void;
  hasSavedSession: boolean;
  savedSessionInfo?: SavedSessionInfo | null;
  onResumeSession: () => void;
  onNewSession: () => void;
}

export function SanctumLanding({
  onEnterSanctum,
  hasSavedSession,
  savedSessionInfo,
  onResumeSession,
  onNewSession,
}: SanctumLandingProps) {
  return (
    <section className="relative z-10 min-h-screen flex flex-col">
      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center pt-16 pb-8 px-4">
        <Container size="xl" className="text-center">
          {/* Animated badge */}
          <div className="flex items-center justify-center mb-6" style={{ animation: 'sanctumFadeInUp 0.5s ease-out backwards' }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-near-green/10 border border-near-green/20 animate-pulse-glow">
              <Sparkles className="w-4 h-4 text-near-green" />
              <span className="text-near-green text-sm font-mono font-medium">THE SANCTUM</span>
              <span className="text-text-muted text-sm">by Voidspace</span>
            </div>
          </div>

          {/* Title */}
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4"
            style={{ animation: 'sanctumFadeInUp 0.5s ease-out 0.1s backwards' }}
          >
            <span className="text-text-primary">Build on NEAR.</span>
            <br />
            <GradientText className="mt-2">From Idea to Launch.</GradientText>
          </h1>

          {/* Subtitle */}
          <p
            className="text-text-secondary text-lg max-w-2xl mx-auto mb-8"
            style={{ animation: 'sanctumFadeInUp 0.5s ease-out 0.2s backwards' }}
          >
            AI-powered development studio. Contracts, webapps, deployment —{' '}
            <span className="text-near-green">all through conversation.</span>
          </p>

          {/* Animated Preview */}
          <div className="mb-10" style={{ animation: 'sanctumFadeInUp 0.6s ease-out 0.3s backwards' }}>
            <SanctumPreview />
          </div>

          {/* ENTER THE SANCTUM CTA */}
          <div className="mb-8" style={{ animation: 'sanctumFadeInUp 0.5s ease-out 0.5s backwards' }}>
            <button
              onClick={onEnterSanctum}
              className="group relative inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-10 py-4 sm:py-5 rounded-2xl bg-gradient-to-r from-near-green to-emerald-400 text-void-black font-bold text-lg sm:text-xl hover:from-near-green/90 hover:to-emerald-400/90 transition-all shadow-2xl shadow-near-green/30 hover:shadow-near-green/50 hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto max-w-md"
            >
              <Rocket className="w-5 h-5 sm:w-6 sm:h-6" />
              ENTER THE SANCTUM
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />

              {/* Glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-near-green/20 blur-2xl -z-10 group-hover:bg-near-green/30 transition-all" />
            </button>
          </div>

          {/* Resume Session Card */}
          {hasSavedSession && (
            <div
              className="max-w-md mx-auto mb-8"
              style={{ animation: 'sanctumFadeInUp 0.5s ease-out 0.6s backwards' }}
            >
              <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 backdrop-blur-sm p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-text-primary">You have an active session</p>
                    <p className="text-xs text-text-muted flex items-center gap-2">
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
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={onResumeSession}
                    className="flex-1 px-4 py-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 text-sm font-medium text-purple-300 transition-all"
                  >
                    Resume
                  </button>
                  <button
                    onClick={onNewSession}
                    className="flex-1 px-4 py-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.1] text-sm font-medium text-text-muted transition-all"
                  >
                    New Session
                  </button>
                </div>
              </div>
            </div>
          )}
        </Container>
      </div>

      {/* Social Proof Bar */}
      <div className="pb-8" style={{ animation: 'sanctumFadeInUp 0.5s ease-out 0.7s backwards' }}>
        <Container size="xl">
          <SocialProof variant="banner" />
        </Container>
      </div>

      {/* The Sanctum Council */}
      <div className="pb-12" style={{ animation: 'sanctumFadeInUp 0.5s ease-out 0.8s backwards' }}>
        <Container size="xl">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-6">
              <p className="text-[11px] font-mono uppercase tracking-[0.3em] text-purple-400/60">
                The Sanctum Council
              </p>
              <p className="text-sm text-text-muted mt-1">Guided by 8 AI Experts</p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-2.5">
              {PERSONA_LIST.map((persona, i) => (
                <div
                  key={persona.id}
                  className="group relative inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-2 rounded-full bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] hover:border-white/[0.15] transition-all duration-300 hover:bg-white/[0.06] cursor-default"
                  style={{
                    animationDelay: `${900 + i * 80}ms`,
                    animation: 'sanctumFadeInUp 0.5s ease-out backwards',
                  }}
                >
                  <div
                    className={`absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${persona.bgColor} blur-xl -z-10`}
                  />
                  <span className="text-base">{persona.emoji}</span>
                  <span className={`text-sm font-medium ${persona.color}`}>{persona.name}</span>
                  <span className="text-[11px] text-text-muted hidden sm:inline">· {persona.role}</span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </div>

      {/* Features footer */}
      <div className="py-8 border-t border-border-subtle bg-void-black/50 backdrop-blur-sm">
        <Container size="xl">
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-3 sm:gap-8 lg:gap-12 text-sm text-text-muted">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-near-green" />
              <span>Rust Smart Contracts</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Chain Signatures</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Shade Agents</span>
            </div>
            <div className="flex items-center gap-2">
              <Rocket className="w-4 h-4 text-cyan-400" />
              <span>Testnet Ready</span>
            </div>
          </div>
          <p className="text-center text-[11px] text-text-muted/50 mt-4">
            By using Sanctum, you agree to our{' '}
            <a href="/legal/terms" className="text-near-green/50 hover:text-near-green/80 underline underline-offset-2 transition-colors">
              Terms of Service
            </a>
            {' '}and{' '}
            <a href="/legal/acceptable-use" className="text-near-green/50 hover:text-near-green/80 underline underline-offset-2 transition-colors">
              Acceptable Use Policy
            </a>.
          </p>
        </Container>
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
      `}</style>
    </section>
  );
}
