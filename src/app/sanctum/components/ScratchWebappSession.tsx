'use client';

import { useState, useCallback, useMemo } from 'react';
import {
  ChevronLeft,
  Zap,
  Rocket,
  CheckCircle,
  Circle,
  Wallet,
  Smartphone,
  Sparkles,
  Globe,
  Code2,
} from 'lucide-react';
import { ScratchWebappChat, QUICK_ACTIONS } from './ScratchWebappChat';
import { ScratchWebappPreview } from './ScratchWebappPreview';
import { GlassPanel } from './GlassPanel';

// ─── Quick-action toolbar items (sourced from QUICK_ACTIONS) ────────────────
const TOOLBAR_ACTIONS = QUICK_ACTIONS.map((a) => ({
  label: a.icon + ' ' + a.label.replace(/^[^\s]+\s/, ''),
  icon: a.icon,
  shortLabel: a.label.replace(/^[^\s]+\s/, ''),
  value: a.value,
}));

// ─── Feature checklist extraction ───────────────────────────────────────────
function extractFeatures(prompt: string): string[] {
  const features: string[] = [];
  const lower = prompt.toLowerCase();

  if (lower.includes('wallet') || lower.includes('connect'))
    features.push('Wallet connection');
  if (lower.includes('nft') || lower.includes('mint') || lower.includes('collection'))
    features.push('NFT minting');
  if (lower.includes('marketplace') || lower.includes('listing') || lower.includes('trade'))
    features.push('Marketplace listings');
  if (lower.includes('token') || lower.includes('fungible'))
    features.push('Token integration');
  if (lower.includes('transfer') || lower.includes('send') || lower.includes('payment'))
    features.push('Asset transfers');
  if (lower.includes('dao') || lower.includes('vote') || lower.includes('governance'))
    features.push('Governance voting');
  if (lower.includes('staking') || lower.includes('yield') || lower.includes('reward'))
    features.push('Staking rewards');
  if (lower.includes('profile') || lower.includes('user') || lower.includes('account'))
    features.push('User profiles');
  if (lower.includes('chart') || lower.includes('dashboard') || lower.includes('analytics'))
    features.push('Analytics dashboard');
  if (lower.includes('auction') || lower.includes('bid'))
    features.push('Auction system');
  if (lower.includes('social') || lower.includes('feed'))
    features.push('Social feed');

  // Ensure a minimum set
  if (!features.some((f) => f.toLowerCase().includes('wallet'))) {
    features.unshift('NEAR wallet connect');
  }
  if (features.length < 3) {
    features.push('Smart contract calls');
    features.push('Transaction handling');
  }
  if (features.length < 4) {
    features.push('Responsive UI');
  }

  return features.slice(0, 6);
}

// Determine which features are built based on code content
function computeBuiltFeatures(code: string, features: string[]): Set<number> {
  const built = new Set<number>();
  if (!code) return built;

  const lower = code.toLowerCase();

  features.forEach((feature, i) => {
    const f = feature.toLowerCase();
    let matched = false;

    if (f.includes('wallet') || f.includes('connect')) {
      matched = lower.includes('wallet') || lower.includes('nearclient') || lower.includes('near-connect');
    } else if (f.includes('nft')) {
      matched = lower.includes('nft');
    } else if (f.includes('marketplace') || f.includes('listing')) {
      matched = lower.includes('marketplace') || lower.includes('listing');
    } else if (f.includes('token')) {
      matched = lower.includes('token');
    } else if (f.includes('transfer')) {
      matched = lower.includes('transfer');
    } else if (f.includes('governance') || f.includes('voting')) {
      matched = lower.includes('vote') || lower.includes('dao');
    } else if (f.includes('staking')) {
      matched = lower.includes('stak');
    } else if (f.includes('profile')) {
      matched = lower.includes('profile');
    } else if (f.includes('analytics') || f.includes('dashboard')) {
      matched = lower.includes('chart') || lower.includes('graph') || lower.includes('dashboard');
    } else if (f.includes('auction')) {
      matched = lower.includes('auction') || lower.includes('bid');
    } else if (f.includes('social')) {
      matched = lower.includes('feed') || lower.includes('social');
    } else if (f.includes('smart contract')) {
      matched = lower.includes('contract') || lower.includes('near');
    } else if (f.includes('transaction')) {
      matched = lower.includes('transaction') || lower.includes('tx');
    } else {
      // Fallback: progressive unlocking as code grows
      matched = code.length > (i + 1) * 350;
    }

    if (matched) built.add(i);
  });

  return built;
}

// ─── Props ───────────────────────────────────────────────────────────────────
interface ScratchWebappSessionProps {
  initialPrompt: string;
  templateName?: string;
  onBack: () => void;
}

// ─── Component ───────────────────────────────────────────────────────────────
export function ScratchWebappSession({
  initialPrompt,
  templateName,
  onBack,
}: ScratchWebappSessionProps) {
  const [generatedCode, setGeneratedCode] = useState('');
  const [tokensUsed, setTokensUsed] = useState(0);
  const [activePanel, setActivePanel] = useState<'chat' | 'code'>('chat');
  const [externalChatMessage, setExternalChatMessage] = useState('');
  const [externalChatSeq, setExternalChatSeq] = useState(0);

  // Derive features from the initial prompt (stable reference)
  const features = useMemo(() => extractFeatures(initialPrompt), [initialPrompt]);
  const builtFeatures = useMemo(
    () => computeBuiltFeatures(generatedCode, features),
    [generatedCode, features],
  );

  const handleCodeUpdate = useCallback((code: string) => {
    setGeneratedCode(code);
  }, []);

  const handleTokensUsed = useCallback((input: number, output: number) => {
    setTokensUsed((prev) => prev + input + output);
  }, []);

  const handleDownload = useCallback(() => {
    if (!generatedCode) return;
    const blob = new Blob([generatedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${templateName || 'webapp'}.tsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [generatedCode, templateName]);

  // Toolbar quick-action → inject into chat
  const handleQuickAction = useCallback((message: string) => {
    setExternalChatMessage(message);
    setExternalChatSeq((prev) => prev + 1);
    // Switch to chat panel on mobile so user sees the action being taken
    setActivePanel('chat');
  }, []);

  const builtCount = builtFeatures.size;
  const totalCount = features.length;

  return (
    <div className="fixed inset-0 z-50 bg-void-black flex flex-col">
      {/* ── Green/Emerald ambient background ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-void-black to-green-900/10" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-500/8 rounded-full blur-3xl" />
      </div>

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="relative z-10 flex-shrink-0 bg-void-black/60 backdrop-blur-xl border-b border-white/[0.06]">
        {/* Green accent gradient line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />

        <div className="flex items-center justify-between px-4 py-3 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={onBack}
              className="p-2 rounded-lg hover:bg-white/[0.06] transition-colors group flex-shrink-0"
            >
              <ChevronLeft className="w-5 h-5 text-text-muted group-hover:text-emerald-400 transition-colors" />
            </button>

            {/* Build Mode badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex-shrink-0">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-300 text-xs font-semibold tracking-wide">
                ⚡ Build Mode
              </span>
            </div>

            <div className="hidden sm:block min-w-0">
              <p className="text-sm font-semibold text-text-primary truncate max-w-[200px]">
                {templateName || 'Vibe Studio'}
              </p>
              <p className="text-xs text-text-muted">AI pair programmer</p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Progress pill */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs text-text-muted">
              <CheckCircle className="w-3 h-3 text-emerald-400" />
              <span>
                {builtCount}/{totalCount} features
              </span>
            </div>

            {/* Deploy CTA — shown once code is generated */}
            {generatedCode && (
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-400 text-void-black text-sm font-bold hover:from-emerald-400 hover:to-green-300 transition-all shadow-lg shadow-emerald-500/20"
              >
                <Rocket className="w-4 h-4" />
                <span className="hidden sm:inline">🚀 Deploy to NEAR</span>
                <span className="sm:hidden">Deploy</span>
              </button>
            )}

            {/* Token counter */}
            {tokensUsed > 0 && (
              <span className="hidden md:block text-xs text-emerald-400/50 font-mono">
                {tokensUsed.toLocaleString()} tokens
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Quick-action toolbar (always visible above preview) ──────────── */}
      <div className="relative z-10 flex-shrink-0 bg-void-black/40 backdrop-blur-sm border-b border-white/[0.05] px-4 py-2">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          <span className="text-[10px] text-text-muted/50 font-mono uppercase tracking-wider flex-shrink-0 pr-1">
            ⚡ Quick actions:
          </span>
          {TOOLBAR_ACTIONS.map((action) => (
            <button
              key={action.label}
              onClick={() => handleQuickAction(action.value)}
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-white/[0.04] border border-white/[0.07] text-text-muted hover:text-emerald-300 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all whitespace-nowrap"
            >
              <span>{action.icon}</span>
              {action.shortLabel}
            </button>
          ))}
        </div>
      </div>

      {/* ── Mobile Tab Bar ───────────────────────────────────────────────── */}
      <div className="md:hidden relative z-10 flex-shrink-0 bg-void-black/80 backdrop-blur-sm border-b border-white/[0.08]">
        <div className="flex">
          <button
            onClick={() => setActivePanel('chat')}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-4 min-h-[48px] text-sm font-medium transition-all ${
              activePanel === 'chat'
                ? 'text-emerald-400 border-b-2 border-emerald-500 bg-emerald-500/10'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            <Zap className="w-4 h-4" />
            Chat
          </button>
          <button
            onClick={() => setActivePanel('code')}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-4 min-h-[48px] text-sm font-medium transition-all ${
              activePanel === 'code'
                ? 'text-emerald-400 border-b-2 border-emerald-500 bg-emerald-500/10'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            <Globe className="w-4 h-4" />
            Preview
          </button>
        </div>
      </div>

      {/* ── Desktop: 30/70 split ─────────────────────────────────────────── */}
      <div className="hidden md:flex relative z-10 flex-1 gap-3 p-3 overflow-hidden">
        {/* Left 30% — Feature checklist + compact chat */}
        <div className="w-[30%] min-w-[240px] max-w-[340px] flex flex-col h-full gap-3">
          {/* Feature Checklist card */}
          <div className="flex-shrink-0">
            <div className="rounded-xl bg-white/[0.04] border border-white/[0.07] p-3">
              <h3 className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
                <CheckCircle className="w-3 h-3" />
                Feature Checklist
                <span className="ml-auto text-text-muted/60 font-normal tracking-normal normal-case">
                  {builtCount}/{totalCount}
                </span>
              </h3>
              <div className="space-y-1.5">
                {features.map((feature, i) => {
                  const done = builtFeatures.has(i);
                  return (
                    <div
                      key={i}
                      className={`flex items-center gap-2 text-xs transition-all duration-500 ${
                        done ? 'text-emerald-400' : 'text-text-muted/60'
                      }`}
                    >
                      {done ? (
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      ) : (
                        <Circle className="w-3.5 h-3.5 flex-shrink-0 opacity-30" />
                      )}
                      <span className={done ? 'line-through opacity-70' : ''}>
                        {feature}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Progress bar */}
              <div className="mt-3 h-1 rounded-full bg-white/[0.06] overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-green-400 transition-all duration-700"
                  style={{
                    width: `${totalCount > 0 ? (builtCount / totalCount) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Chat sidebar (compact) */}
          <div className="flex-1 min-h-0">
            <GlassPanel
              className="h-full flex flex-col overflow-hidden"
              glow
              glowColor="green"
            >
              {/* Thin emerald accent */}
              <div className="flex-shrink-0 h-0.5 bg-gradient-to-r from-emerald-500/60 via-green-500/30 to-transparent rounded-t-2xl" />
              <ScratchWebappChat
                initialPrompt={initialPrompt}
                onCodeUpdate={handleCodeUpdate}
                onTokensUsed={handleTokensUsed}
                compact
                externalMessage={externalChatMessage}
                externalMessageSeq={externalChatSeq}
              />
            </GlassPanel>
          </div>
        </div>

        {/* Right 70% — Live preview (the product IS the preview) */}
        <div className="flex-1 flex flex-col h-full">
          <GlassPanel
            className="flex-1 flex flex-col overflow-hidden"
            glow
            glowColor="green"
          >
            {/* Thin green accent */}
            <div className="flex-shrink-0 h-0.5 bg-gradient-to-r from-green-500/60 via-emerald-500/30 to-transparent rounded-t-2xl" />

            {/* Preview header with inline deploy CTA */}
            <div className="flex-shrink-0 px-4 py-2.5 border-b border-white/[0.08] bg-void-black/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full transition-colors ${
                    generatedCode ? 'bg-emerald-400 animate-pulse' : 'bg-white/[0.2]'
                  }`}
                />
                <span className="text-xs font-mono text-emerald-400/80">
                  {generatedCode ? 'Live Preview' : 'Waiting for code…'}
                </span>
                {generatedCode && (
                  <span className="text-xs text-text-muted/50">
                    · {generatedCode.split('\n').length} lines
                  </span>
                )}
              </div>

              {generatedCode && (
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-green-400 text-void-black text-xs font-bold hover:from-emerald-400 hover:to-green-300 transition-all shadow-lg shadow-emerald-500/20"
                >
                  <Rocket className="w-3.5 h-3.5" />
                  🚀 Deploy to NEAR
                </button>
              )}
            </div>

            {/* The preview itself — dominant and large */}
            <div className="flex-1 min-h-0 overflow-hidden">
              <ScratchWebappPreview
                code={generatedCode}
                onDownload={handleDownload}
              />
            </div>
          </GlassPanel>
        </div>
      </div>

      {/* ── Mobile: Tabbed panels ────────────────────────────────────────── */}
      <div className="md:hidden relative z-10 flex-1 flex flex-col overflow-hidden">
        {/* Chat panel */}
        {activePanel === 'chat' && (
          <div className="flex-1 flex flex-col p-3 gap-3 overflow-hidden">
            {/* Mobile feature pills */}
            <div className="flex-shrink-0 flex gap-1.5 overflow-x-auto scrollbar-hide pb-0.5">
              {features.map((feature, i) => {
                const done = builtFeatures.has(i);
                return (
                  <span
                    key={i}
                    className={`flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] border transition-all ${
                      done
                        ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                        : 'bg-white/[0.04] border-white/[0.08] text-text-muted/50'
                    }`}
                  >
                    {done ? '✓' : '○'} {feature}
                  </span>
                );
              })}
            </div>

            <GlassPanel
              className="flex-1 min-h-0 flex flex-col overflow-hidden"
              glow
              glowColor="green"
            >
              <div className="flex-shrink-0 h-0.5 bg-gradient-to-r from-emerald-500/60 via-green-500/30 to-transparent rounded-t-2xl" />
              <ScratchWebappChat
                initialPrompt={initialPrompt}
                onCodeUpdate={handleCodeUpdate}
                onTokensUsed={handleTokensUsed}
                compact
                externalMessage={externalChatMessage}
                externalMessageSeq={externalChatSeq}
              />
            </GlassPanel>
          </div>
        )}

        {/* Preview panel */}
        {activePanel === 'code' && (
          <div className="flex-1 p-3 overflow-hidden">
            <GlassPanel
              className="flex-1 h-full flex flex-col overflow-hidden"
              glow
              glowColor="green"
            >
              <div className="flex-shrink-0 h-0.5 bg-gradient-to-r from-green-500/60 via-emerald-500/30 to-transparent rounded-t-2xl" />

              {/* Deploy CTA in preview header (mobile) */}
              <div className="flex-shrink-0 px-4 py-2.5 border-b border-white/[0.08] bg-void-black/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      generatedCode ? 'bg-emerald-400 animate-pulse' : 'bg-white/[0.2]'
                    }`}
                  />
                  <span className="text-xs font-mono text-emerald-400/80">
                    {generatedCode ? 'Live Preview' : 'Waiting…'}
                  </span>
                </div>
                {generatedCode && (
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold hover:bg-emerald-500/30 transition-all"
                  >
                    <Rocket className="w-3 h-3" />
                    🚀 Deploy
                  </button>
                )}
              </div>

              <div className="flex-1 min-h-0 overflow-hidden">
                <ScratchWebappPreview
                  code={generatedCode}
                  onDownload={handleDownload}
                />
              </div>
            </GlassPanel>
          </div>
        )}
      </div>
    </div>
  );
}
