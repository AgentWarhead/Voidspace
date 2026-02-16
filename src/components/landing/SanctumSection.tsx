'use client';

import Link from 'next/link';
import { Sparkles, ChevronRight, BookOpen, Zap } from 'lucide-react';
import { PERSONA_LIST } from '@/app/sanctum/lib/personas';

export function SanctumSection() {
  return (
    <section>
      <div className="relative overflow-hidden rounded-2xl border border-purple-500/20">
        {/* Dramatic purple background */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 60% 40%, rgba(147,51,234,0.15) 0%, rgba(109,40,217,0.08) 40%, transparent 80%)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-violet-500/5" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(147,51,234,0.3) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <div className="relative z-10 p-5 sm:p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-mono mb-4">
              <Sparkles className="w-3 h-3" />
              THE ONLY CRYPTO VIBE-CODING PLATFORM
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-300 via-violet-300 to-purple-400 bg-clip-text text-transparent">
              The Sanctum
            </h2>
            <p className="text-text-secondary text-base sm:text-lg mt-3 max-w-2xl mx-auto leading-relaxed">
              <span className="text-purple-300 font-medium">Describe it. Deploy it.</span><br />
              AI-powered development studio for NEAR Protocol — entirely through conversation.
            </p>
            <p className="text-text-muted text-sm mt-2 max-w-xl mx-auto">
              Build like you have a team. You do. 8 expert AI personas handle Rust, security, DeFi, testing, and deployment — so you don&apos;t have to.
            </p>
          </div>

          {/* Terminal Preview */}
          <div className="max-w-2xl mx-auto mb-10">
            <div className="rounded-lg border border-purple-500/20 bg-[#0d0d0d] overflow-hidden shadow-2xl shadow-purple-500/10">
              {/* Terminal header */}
              <div className="flex items-center gap-2 px-4 py-2 bg-[#161616] border-b border-purple-500/10">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                </div>
                <span className="text-[10px] font-mono text-text-muted ml-2">sanctum — vibe-coding session</span>
              </div>
              {/* Terminal content */}
              <div className="p-3 sm:p-4 font-mono text-[10px] sm:text-xs leading-relaxed space-y-2 overflow-x-auto max-w-full">
                <p><span className="text-purple-400">you:</span> <span className="text-text-secondary">Build me a token staking contract on NEAR</span></p>
                <p><span className="text-near-green">sanctum:</span> <span className="text-text-secondary">Let&apos;s build it step by step. First, I&apos;ll create the</span></p>
                <p className="text-text-secondary pl-[4.5rem]">contract struct with staking pools and reward tracking...</p>
                <div className="mt-2 p-2 rounded bg-purple-500/5 border border-purple-500/10">
                  <p className="text-purple-300/80">{`#[near(contract_state)]`}</p>
                  <p className="text-purple-300/80">{`pub struct StakingPool {`}</p>
                  <p className="text-text-muted pl-4">{`total_staked: Balance,`}</p>
                  <p className="text-text-muted pl-4">{`reward_rate: u128,`}</p>
                  <p className="text-text-muted pl-4">{`stakers: UnorderedMap<AccountId, StakeInfo>,`}</p>
                  <p className="text-purple-300/80">{`}`}</p>
                </div>
                <p><span className="text-near-green">sanctum:</span> <span className="text-text-secondary">Here&apos;s what each field does and why we need it...</span></p>
                <p className="text-text-muted animate-pulse">▊</p>
              </div>
            </div>
          </div>

          {/* Two Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 max-w-4xl mx-auto">
            {/* Build */}
            <div className="group relative p-6 rounded-xl bg-surface/50 border border-near-green/20 hover:border-near-green/40 transition-all duration-300">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-near-green/0 to-near-green/0 group-hover:from-near-green/5 group-hover:to-emerald-500/5 transition-all duration-300" />
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-lg bg-near-green/10 border border-near-green/20 flex items-center justify-center mb-4">
                  <Zap className="w-5 h-5 text-near-green" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">Build NEAR Projects</h3>
                <p className="text-sm text-text-secondary leading-relaxed mb-3">
                  Describe what you want to build. AI walks you through creating Rust smart contracts and web frontends — step by step, from idea to deployment.
                </p>
                <ul className="space-y-1.5 mb-4">
                  {[
                    'AI explains every line of code',
                    'Smart contracts → tested → deployed',
                    'Full-stack dApps with React frontends',
                    'From zero to mainnet in hours',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs text-text-secondary">
                      <span className="text-near-green mt-0.5">▸</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-2">
                  {['Smart Contracts', 'Web Apps', 'Code Audit', 'Deploy'].map((tag) => (
                    <span key={tag} className="text-[10px] font-mono px-2 py-0.5 rounded bg-near-green/10 text-near-green/80 border border-near-green/10">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Learn */}
            <div className="group relative p-6 rounded-xl bg-surface/50 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500/0 to-purple-500/0 group-hover:from-purple-500/5 group-hover:to-violet-500/5 transition-all duration-300" />
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4">
                  <BookOpen className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">Learn Rust as You Build</h3>
                <p className="text-sm text-text-secondary leading-relaxed mb-3">
                  No Rust experience? No problem. The AI teaches you as you create — explaining every pattern, every NEAR concept in real time.
                </p>
                <ul className="space-y-1.5 mb-4">
                  {[
                    '66 modules of structured learning',
                    'AI explains every concept interactively',
                    'Hands-on projects, not toy examples',
                    'Earn completion certificates',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs text-text-secondary">
                      <span className="text-purple-400 mt-0.5">▸</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-2">
                  {['Rust', 'NEAR SDK', 'Testing', 'Best Practices'].map((tag) => (
                    <span key={tag} className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-400/80 border border-purple-500/10">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Council Strip */}
          <div className="flex flex-col items-center gap-3 mb-10">
            <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-purple-400/50">
              Meet the Council
            </p>
            <div className="flex items-center gap-1 flex-wrap justify-center">
              {PERSONA_LIST.map((persona) => (
                <div
                  key={persona.id}
                  className="group relative"
                >
                  <div className={`w-10 h-10 sm:w-9 sm:h-9 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-base hover:border-white/[0.2] hover:bg-white/[0.08] transition-all duration-200 cursor-default hover:scale-110`}>
                    {persona.emoji}
                  </div>
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 rounded-md bg-void-black/90 border border-white/[0.1] backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-20">
                    <span className={`text-xs font-medium ${persona.color}`}>{persona.name}</span>
                    <span className="text-[10px] text-text-muted ml-1">· {persona.role}</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-text-muted">8 Expert AI Personas</p>
          </div>

          {/* How it works */}
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 mb-10 text-sm text-text-muted">
            {[
              { step: '1', text: 'Describe your idea' },
              { step: '2', text: 'AI builds with you' },
              { step: '3', text: 'Learn as you create' },
              { step: '4', text: 'Deploy to NEAR' },
            ].map((item) => (
              <div key={item.step} className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-mono flex items-center justify-center">{item.step}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link
              href="/sanctum"
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 rounded-lg text-sm sm:text-base font-semibold bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 active:scale-[0.98] hover:scale-[1.02] transition-all duration-300 min-h-[44px]"
            >
              <Sparkles className="w-4 h-4" />
              Start Vibe-Coding on NEAR
              <ChevronRight className="w-4 h-4" />
            </Link>
            <p className="text-xs text-text-muted font-mono mt-3">
              Powered by Claude Opus · 8 Expert AI Personas · Free credits to start
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
