'use client';

import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

export function BuilderShowcase() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`transition-all duration-700 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      {/* Label */}
      <p className="text-text-muted text-sm text-center mb-4">
        Describe what you want. Get production code.
      </p>

      {/* Glassmorphism container with shimmer border */}
      <div className="relative max-w-4xl mx-auto rounded-2xl overflow-hidden">
        {/* Shimmer border effect */}
        <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-near-green/20 via-purple-500/20 to-near-green/20 animate-pulse-glow" />

        <div className="relative bg-white/[0.03] backdrop-blur-sm border border-white/[0.08] rounded-2xl overflow-hidden">
          {/* Split layout */}
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left: Chat Panel */}
            <div className="p-5 border-b md:border-b-0 md:border-r border-white/[0.08]">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/[0.06]">
                <span className="text-sm">💬</span>
                <span className="text-xs font-medium text-text-muted uppercase tracking-wider">Chat</span>
              </div>

              {/* Chat bubbles */}
              <div className="space-y-3">
                {/* User message */}
                <div className="flex justify-end">
                  <div className="bg-purple-500/15 border border-purple-500/20 rounded-xl rounded-tr-sm px-3.5 py-2.5 max-w-[85%]">
                    <p className="text-sm text-text-primary leading-relaxed">
                      Build me a token with 2% burn on transfers
                    </p>
                  </div>
                </div>

                {/* Sanctum response */}
                <div className="flex justify-start">
                  <div className="bg-near-green/10 border border-near-green/15 rounded-xl rounded-tl-sm px-3.5 py-2.5 max-w-[85%]">
                    <p className="text-sm text-text-primary leading-relaxed">
                      I&apos;ll create a NEP-141 token with automatic burn mechanics. The contract will deduct 2% from every transfer and send it to a burn address…
                    </p>
                  </div>
                </div>

                {/* Typing indicator */}
                <div className="flex justify-start">
                  <div className="bg-near-green/10 border border-near-green/15 rounded-xl rounded-tl-sm px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-near-green/60 animate-bounce [animation-delay:0ms]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-near-green/60 animate-bounce [animation-delay:150ms]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-near-green/60 animate-bounce [animation-delay:300ms]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Code Preview */}
            <div className="p-5">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/[0.06]">
                <span className="text-sm">⚡</span>
                <span className="text-xs font-medium text-text-muted uppercase tracking-wider">Preview</span>
              </div>

              {/* Syntax-highlighted Rust code */}
              <div className="font-mono text-xs sm:text-[13px] leading-relaxed space-y-0.5 overflow-x-auto">
                <div>
                  <span className="text-yellow-400/80">#[near(contract_state)]</span>
                </div>
                <div>
                  <span className="text-purple-400">pub struct </span>
                  <span className="text-cyan-300">Token</span>
                  <span className="text-text-muted"> {'{'}</span>
                </div>
                <div className="pl-4">
                  <span className="text-purple-400">pub </span>
                  <span className="text-text-primary">burn_rate</span>
                  <span className="text-text-muted">: </span>
                  <span className="text-cyan-300">u128</span>
                  <span className="text-text-muted">,</span>
                </div>
                <div className="pl-4">
                  <span className="text-purple-400">pub </span>
                  <span className="text-text-primary">total_supply</span>
                  <span className="text-text-muted">: </span>
                  <span className="text-cyan-300">u128</span>
                  <span className="text-text-muted">,</span>
                </div>
                <div className="pl-4">
                  <span className="text-purple-400">pub </span>
                  <span className="text-text-primary">accounts</span>
                  <span className="text-text-muted">: </span>
                  <span className="text-cyan-300">LookupMap</span>
                  <span className="text-text-muted">{'<'}</span>
                  <span className="text-cyan-300">AccountId</span>
                  <span className="text-text-muted">, </span>
                  <span className="text-cyan-300">u128</span>
                  <span className="text-text-muted">{'>'}</span>
                  <span className="text-text-muted">,</span>
                </div>
                <div className="pl-4">
                  <span className="text-green-400/60">// ...</span>
                </div>
                <div>
                  <span className="text-text-muted">{'}'}</span>
                </div>
              </div>

              {/* File indicator */}
              <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center gap-2 text-xs text-text-muted">
                <span className="w-2 h-2 rounded-full bg-near-green" />
                <span>contract.rs</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Powered by */}
      <p className="text-center text-xs text-text-muted mt-4 flex items-center justify-center gap-1.5">
        <Sparkles className="w-3 h-3 text-near-green/60" />
        Powered by Claude Sonnet 4.6 + Opus 4.6
      </p>
    </div>
  );
}
