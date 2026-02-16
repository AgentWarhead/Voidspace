'use client';

import { Sparkles, Zap } from 'lucide-react';

interface TokenCounterProps {
  tokensUsed: number;
  tokenBalance: number;
}

export function TokenCounter({ tokensUsed, tokenBalance }: TokenCounterProps) {
  const percentUsed = tokenBalance > 0 ? (tokensUsed / (tokensUsed + tokenBalance)) * 100 : 0;
  const isLow = tokenBalance < 10000;
  const isCritical = tokenBalance < 5000;

  // Estimate cost (Claude Opus pricing approximation)
  const estimatedCost = (tokensUsed * 0.00002).toFixed(4); // ~$20 per 1M tokens blended

  return (
    <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
      {/* Tokens Used */}
      <div className="text-right">
        <div className="flex items-center gap-1.5 text-sm">
          <Sparkles className="w-4 h-4 text-near-green" />
          <span className="text-text-primary font-mono font-medium">
            {tokensUsed.toLocaleString()}
          </span>
          <span className="text-text-muted">used</span>
        </div>
        <div className="text-xs text-text-muted">
          ~${estimatedCost}
        </div>
      </div>

      {/* Divider */}
      <div className="w-px h-8 bg-border-subtle" />

      {/* Balance */}
      <div className="text-right">
        <div className="flex items-center gap-1.5 text-sm">
          <Zap className={`w-4 h-4 ${isCritical ? 'text-red-400' : isLow ? 'text-amber-400' : 'text-near-green'}`} />
          <span className={`font-mono font-medium ${isCritical ? 'text-red-400' : isLow ? 'text-amber-400' : 'text-text-primary'}`}>
            {tokenBalance.toLocaleString()}
          </span>
          <span className="text-text-muted">left</span>
        </div>
        
        {/* Progress bar */}
        <div className="w-24 h-1.5 bg-void-gray rounded-full overflow-hidden mt-1">
          <div 
            className={`h-full transition-all duration-300 ${
              isCritical ? 'bg-red-400' : isLow ? 'bg-amber-400' : 'bg-near-green'
            }`}
            style={{ width: `${100 - percentUsed}%` }}
          />
        </div>
      </div>

      {/* Low balance warning */}
      {isLow && (
        <button className="px-3 py-1.5 min-h-[44px] text-xs bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 rounded-lg border border-amber-500/30 transition-colors">
          Top Up
        </button>
      )}
    </div>
  );
}
