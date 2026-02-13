'use client';

import { useState, useCallback } from 'react';
import { ChevronLeft, Zap } from 'lucide-react';
import { ScratchWebappChat } from './ScratchWebappChat';
import { ScratchWebappPreview } from './ScratchWebappPreview';
import { GlassPanel } from './GlassPanel';
import { GradientText } from '@/components/effects/GradientText';
import { TokenCounter } from './TokenCounter';

interface ScratchWebappSessionProps {
  initialPrompt: string;
  templateName?: string;
  onBack: () => void;
}

export function ScratchWebappSession({ initialPrompt, templateName, onBack }: ScratchWebappSessionProps) {
  const [generatedCode, setGeneratedCode] = useState('');
  const [tokensUsed, setTokensUsed] = useState(0);
  const [tokenBalance] = useState(50000);
  const [activePanel, setActivePanel] = useState<'chat' | 'code'>('chat');

  const handleCodeUpdate = useCallback((code: string) => {
    setGeneratedCode(code);
  }, []);

  const handleTokensUsed = useCallback((input: number, output: number) => {
    setTokensUsed(prev => prev + input + output);
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

  return (
    <div className="fixed inset-0 z-50 bg-void-black flex flex-col">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 via-void-black to-orange-900/10" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative z-10 flex-shrink-0 px-4 py-3 border-b border-white/[0.08] bg-void-black/50 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 rounded-lg hover:bg-white/[0.05] transition-colors group"
            >
              <ChevronLeft className="w-5 h-5 text-text-muted group-hover:text-amber-400 transition-colors" />
            </button>
            <div>
              <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                <span className="text-2xl">🚀</span>
                <GradientText className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                  {templateName || 'Vibe Code'}
                </GradientText>
              </h2>
              <p className="text-sm text-text-muted">Building your webapp from scratch</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-amber-400/60">
              <Zap className="w-3.5 h-3.5" />
              <span>Scratch Mode</span>
            </div>
            <TokenCounter tokensUsed={tokensUsed} tokenBalance={tokenBalance} />
          </div>
        </div>
      </div>

      {/* Mobile Tab Bar */}
      <div className="md:hidden relative z-10 flex-shrink-0 bg-void-black/80 backdrop-blur-sm border-b border-white/[0.08]">
        <div className="flex">
          <button
            onClick={() => setActivePanel('chat')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium transition-all ${
              activePanel === 'chat'
                ? 'text-amber-400 border-b-2 border-amber-500 bg-amber-500/10'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            💬 Chat
          </button>
          <button
            onClick={() => setActivePanel('code')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium transition-all ${
              activePanel === 'code'
                ? 'text-amber-400 border-b-2 border-amber-500 bg-amber-500/10'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            ⚡ Code
          </button>
        </div>
      </div>

      {/* Desktop: Split Panel */}
      <div className="hidden md:flex relative z-10 flex-1 gap-3 p-3 overflow-hidden">
        <div className="w-1/2 flex flex-col h-full">
          <GlassPanel className="flex-1 flex flex-col overflow-hidden" glow glowColor="purple">
            <ScratchWebappChat
              initialPrompt={initialPrompt}
              onCodeUpdate={handleCodeUpdate}
              onTokensUsed={handleTokensUsed}
            />
          </GlassPanel>
        </div>
        <div className="w-1/2 flex flex-col h-full">
          <GlassPanel className="flex-1 flex flex-col overflow-hidden" glow glowColor="green">
            <ScratchWebappPreview code={generatedCode} onDownload={handleDownload} />
          </GlassPanel>
        </div>
      </div>

      {/* Mobile: Tabbed panels */}
      <div className="md:hidden relative z-10 flex-1 flex flex-col overflow-hidden">
        {activePanel === 'chat' && (
          <div className="flex-1 p-3 overflow-hidden">
            <GlassPanel className="flex-1 flex flex-col overflow-hidden" glow glowColor="purple">
              <ScratchWebappChat
                initialPrompt={initialPrompt}
                onCodeUpdate={handleCodeUpdate}
                onTokensUsed={handleTokensUsed}
              />
            </GlassPanel>
          </div>
        )}
        {activePanel === 'code' && (
          <div className="flex-1 p-3 overflow-hidden">
            <GlassPanel className="flex-1 flex flex-col overflow-hidden" glow glowColor="green">
              <ScratchWebappPreview code={generatedCode} onDownload={handleDownload} />
            </GlassPanel>
          </div>
        )}
      </div>
    </div>
  );
}
