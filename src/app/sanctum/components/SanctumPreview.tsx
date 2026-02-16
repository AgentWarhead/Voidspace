'use client';

export function SanctumPreview() {
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="rounded-2xl border border-white/[0.08] bg-void-gray/40 backdrop-blur-sm overflow-hidden shadow-2xl shadow-purple-500/10">
        {/* Window chrome */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-void-black/60">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
          </div>
          <div className="flex-1 text-center">
            <span className="text-[10px] font-mono text-text-muted/50">sanctum — voidspace.io</span>
          </div>
        </div>

        {/* Split pane mockup */}
        <div className="flex min-h-[180px] sm:min-h-[260px]">
          {/* Chat pane */}
          <div className="flex-1 p-3 sm:p-4 border-r border-white/[0.06] flex flex-col gap-2 sm:gap-3 overflow-hidden">
            {/* User message */}
            <div className="preview-msg preview-msg-1 flex justify-end">
              <div className="max-w-[85%] px-3 py-2 rounded-xl bg-purple-500/20 border border-purple-500/15 text-xs text-purple-200">
                Build me an NFT marketplace
              </div>
            </div>

            {/* AI message */}
            <div className="preview-msg preview-msg-2 flex justify-start">
              <div className="max-w-[85%] px-3 py-2 rounded-xl bg-white/[0.05] border border-white/[0.08] text-xs text-text-secondary">
                <span className="text-near-green font-medium">🐧 Shade:</span>{' '}
                I&apos;ll create a NEP-171 contract with listings, escrow &amp; royalties...
              </div>
            </div>

            {/* AI message 2 */}
            <div className="preview-msg preview-msg-3 flex justify-start">
              <div className="max-w-[85%] px-3 py-2 rounded-xl bg-white/[0.05] border border-white/[0.08] text-xs text-text-secondary">
                <span className="text-orange-400 font-medium">🦀 Oxide:</span>{' '}
                Storage optimized. Gas cost: 5 TGas per listing.
              </div>
            </div>
          </div>

          {/* Code pane */}
          <div className="flex-1 p-4 flex flex-col gap-2 hidden sm:flex">
            <div className="text-[10px] font-mono text-text-muted/40 mb-1">contract.rs</div>
            <div className="preview-code preview-code-1 text-[10px] font-mono leading-relaxed">
              <span className="text-purple-400">#[near_bindgen]</span>
              <br />
              <span className="text-cyan-400">impl</span>{' '}
              <span className="text-yellow-300">Marketplace</span>{' '}
              <span className="text-text-muted">{'{'}</span>
            </div>
            <div className="preview-code preview-code-2 text-[10px] font-mono leading-relaxed pl-4">
              <span className="text-cyan-400">pub fn</span>{' '}
              <span className="text-near-green">list_nft</span>
              <span className="text-text-muted">(</span>
              <span className="text-orange-300">&amp;mut self</span>
              <span className="text-text-muted">)</span>
            </div>
            <div className="preview-code preview-code-3 text-[10px] font-mono leading-relaxed pl-8">
              <span className="text-text-muted">self.listings.insert(...);</span>
            </div>

            {/* Deploy button */}
            <div className="mt-auto pt-2">
              <div className="preview-deploy inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-near-green/20 border border-near-green/30 text-[10px] font-medium text-near-green">
                🚀 Deploy to NEAR
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .preview-msg,
        .preview-code,
        .preview-deploy {
          opacity: 0;
          animation-fill-mode: both;
          animation-duration: 0.5s;
          animation-timing-function: ease-out;
          animation-iteration-count: infinite;
        }

        .preview-msg {
          animation-name: previewFadeIn;
          animation-duration: 8s;
        }
        .preview-code {
          animation-name: previewFadeIn;
          animation-duration: 8s;
        }
        .preview-deploy {
          animation-name: previewGlow;
          animation-duration: 8s;
        }

        .preview-msg-1 {
          animation-delay: 0s;
        }
        .preview-msg-2 {
          animation-delay: 1.2s;
        }
        .preview-msg-3 {
          animation-delay: 2.4s;
        }
        .preview-code-1 {
          animation-delay: 1.8s;
        }
        .preview-code-2 {
          animation-delay: 3s;
        }
        .preview-code-3 {
          animation-delay: 4s;
        }
        .preview-deploy {
          animation-delay: 5s;
        }

        @keyframes previewFadeIn {
          0%, 5% {
            opacity: 0;
            transform: translateY(8px);
          }
          12%, 85% {
            opacity: 1;
            transform: translateY(0);
          }
          95%, 100% {
            opacity: 0;
            transform: translateY(0);
          }
        }

        @keyframes previewGlow {
          0%, 60% {
            opacity: 0;
            transform: scale(0.95);
          }
          68%, 82% {
            opacity: 1;
            transform: scale(1);
            box-shadow: 0 0 20px rgba(0, 236, 151, 0.3);
          }
          95%, 100% {
            opacity: 0;
            transform: scale(0.95);
          }
        }
      `}</style>
    </div>
  );
}
