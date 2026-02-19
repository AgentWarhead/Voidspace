'use client';

import { useState, useRef, useEffect } from 'react';
import { Sparkles, Download, Loader2, AlertCircle } from 'lucide-react';

const VISUAL_TYPES = [
  { id: 'architecture', label: 'Architecture Diagram', desc: 'System design & component layouts', icon: '🏗️' },
  { id: 'flow', label: 'User Flow', desc: 'Process diagrams & user journeys', icon: '🔀' },
  { id: 'infographic', label: 'Infographic', desc: 'Educational blockchain visuals', icon: '📊' },
  { id: 'social', label: 'Social Graphic', desc: 'Announcement & promo images', icon: '📣' },
] as const;

type VisualType = typeof VISUAL_TYPES[number]['id'];

export function VisualMode() {
  const [prompt, setPrompt] = useState('');
  const [type, setType] = useState<VisualType>('architecture');
  const [projectContext, setProjectContext] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ mimeType: string; data: string } | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (result && resultRef.current) {
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [result]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setIsDemo(false);

    try {
      const res = await fetch('/api/sanctum/visual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          type,
          ...(projectContext.trim() ? { projectContext: projectContext.trim() } : {}),
        }),
      });

      if (res.status === 401) {
        setError('Connect your NEAR wallet to use Visual Generator.');
        return;
      }
      if (res.status === 402) {
        setError('Insufficient credits. Top up your Sanctum balance to generate visuals.');
        return;
      }
      if (res.status === 429) {
        setError('Too many requests. Wait a moment and try again.');
        return;
      }

      const data = await res.json();

      if (data.isDemo) {
        setIsDemo(true);
        return;
      }

      if (data.success && data.image) {
        setResult(data.image);
      } else {
        setError(data.error || 'Failed to generate image. Try a different prompt.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const link = document.createElement('a');
    link.href = `data:${result.mimeType};base64,${result.data}`;
    link.download = `voidspace-${type}-${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Type selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 mb-6 sm:mb-8">
        {VISUAL_TYPES.map((t) => (
          <button
            key={t.id}
            onClick={() => setType(t.id)}
            className={`p-3 sm:p-4 rounded-xl border-2 text-center transition-all hover:scale-[1.02] min-h-[44px] ${
              type === t.id
                ? 'border-purple-500/50 bg-purple-500/10 shadow-lg shadow-purple-500/20'
                : 'border-border-subtle bg-void-gray/30 hover:border-purple-500/30'
            }`}
          >
            <div className="text-xl sm:text-2xl mb-1 sm:mb-2">{t.icon}</div>
            <div className={`text-sm font-semibold ${type === t.id ? 'text-purple-400' : 'text-text-primary'}`}>
              {t.label}
            </div>
            <div className="text-xs text-text-muted mt-1">{t.desc}</div>
          </button>
        ))}
      </div>

      {/* Prompt input */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm text-text-secondary mb-2">Describe what you want to visualize</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. A NEAR Protocol DeFi architecture showing token swaps, liquidity pools, and staking..."
            className="w-full h-24 sm:h-32 bg-void-gray/50 border border-border-subtle rounded-xl p-3 sm:p-4 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 resize-none"
            maxLength={1000}
          />
          <div className="text-xs text-text-muted text-right mt-1">{prompt.length}/1000</div>
        </div>

        <div>
          <label className="block text-sm text-text-secondary mb-2">Project context <span className="text-text-muted">(optional)</span></label>
          <input
            value={projectContext}
            onChange={(e) => setProjectContext(e.target.value)}
            placeholder="e.g. NFT marketplace on NEAR with Rust smart contracts"
            className="w-full bg-void-gray/50 border border-border-subtle rounded-xl p-3 min-h-[44px] text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30"
          />
        </div>
      </div>

      {/* Generate button */}
      <button
        onClick={handleGenerate}
        disabled={loading || !prompt.trim()}
        className="w-full py-4 min-h-[44px] rounded-xl font-semibold text-base sm:text-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Generate Visual — $0.05
          </>
        )}
      </button>

      {/* Cost notice */}
      <p className="text-xs text-text-muted text-center mt-2">
        Each generation costs $0.05 in Sanctum credits
      </p>

      {/* Error */}
      {error && (
        <div className="mt-6 p-4 rounded-xl border border-red-500/30 bg-red-500/10 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      {/* Demo notice */}
      {isDemo && (
        <div className="mt-6 p-4 rounded-xl border border-yellow-500/30 bg-yellow-500/10">
          <p className="text-sm text-yellow-300">
            Visual generation is in demo mode. Configure the Gemini API to enable full image generation.
          </p>
        </div>
      )}

      {/* Result */}
      {result && (
        <div ref={resultRef} className="mt-8">
          <div className="rounded-2xl overflow-hidden border border-border-subtle bg-void-gray/30">
            <img
              src={`data:${result.mimeType};base64,${result.data}`}
              alt="Generated visual"
              className="w-full"
            />
          </div>
          <button
            onClick={handleDownload}
            className="mt-4 mx-auto flex items-center gap-2 px-6 py-3 rounded-xl border border-purple-500/30 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition-all"
          >
            <Download className="w-4 h-4" />
            Download Image
          </button>
        </div>
      )}
    </div>
  );
}
