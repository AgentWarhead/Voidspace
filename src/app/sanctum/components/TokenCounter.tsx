'use client';

import { useRef, useState } from 'react';
import { Sparkles, Zap } from 'lucide-react';

interface TokenCounterProps {
  tokensUsed: number;
  tokenBalance: number;
}

export function TokenCounter({ tokensUsed, tokenBalance }: TokenCounterProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  // Capture session start values on first render
  const sessionStartRef = useRef<{ tokensUsed: number; tokenBalance: number; time: number } | null>(null);
  if (!sessionStartRef.current) {
    sessionStartRef.current = {
      tokensUsed,
      tokenBalance,
      time: Date.now(),
    };
  }

  const sessionStart = sessionStartRef.current;

  // Credits consumed this session
  const sessionCreditsUsed = tokensUsed - sessionStart.tokensUsed;

  // Burn rate (credits/min) — only meaningful after ≥30s of activity
  const sessionDurationMin = (Date.now() - sessionStart.time) / 60000;
  const burnRate = sessionDurationMin >= 0.5 && sessionCreditsUsed > 0
    ? Math.round(sessionCreditsUsed / sessionDurationMin)
    : 0;

  // Estimated minutes remaining at current pace
  const minutesRemaining = burnRate > 0 ? Math.round(tokenBalance / burnRate) : null;

  // Standard low-balance thresholds
  const percentUsed = tokenBalance > 0 ? (tokensUsed / (tokensUsed + tokenBalance)) * 100 : 0;
  const isLow = tokenBalance < 10000;
  const isCritical = tokenBalance < 5000;

  // Session-relative warning: below 10% of starting balance
  const isSessionLow = tokenBalance < sessionStart.tokenBalance * 0.1;

  // Colour severity: session-low or critical → red, low → amber, else green
  const severity = isCritical || isSessionLow ? 'critical' : isLow ? 'low' : 'ok';
  const zapColour =
    severity === 'critical' ? 'text-red-400' : severity === 'low' ? 'text-amber-400' : 'text-near-green';
  const balanceColour =
    severity === 'critical' ? 'text-red-400' : severity === 'low' ? 'text-amber-400' : 'text-text-primary';
  const barColour =
    severity === 'critical' ? 'bg-red-400' : severity === 'low' ? 'bg-amber-400' : 'bg-near-green';

  // Estimated session cost (Claude Opus pricing ~$20/1M tokens blended)
  const estimatedCost = (tokensUsed * 0.00002).toFixed(4);

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

      {/* Balance + burn rate — hoverable for tooltip */}
      <div className="relative text-right">
        <div
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className="cursor-default"
        >
          <div className="flex items-center gap-1.5 text-sm">
            <Zap className={`w-4 h-4 ${zapColour}`} />
            <span className={`font-mono font-medium ${balanceColour}`}>
              {tokenBalance.toLocaleString()}
            </span>
            <span className="text-text-muted">left</span>
            {minutesRemaining !== null && (
              <span className="text-xs text-text-muted ml-1">
                (~{minutesRemaining}m)
              </span>
            )}
          </div>

          {/* Progress bar */}
          <div className="w-24 h-1.5 bg-void-gray rounded-full overflow-hidden mt-1">
            <div
              className={`h-full transition-all duration-300 ${barColour}`}
              style={{ width: `${100 - percentUsed}%` }}
            />
          </div>
        </div>

        {/* Hover tooltip */}
        {showTooltip && (
          <div className="absolute bottom-full mb-2 right-0 px-3 py-2 rounded-lg bg-void-gray border border-border-subtle text-xs text-text-secondary whitespace-nowrap z-50 shadow-lg pointer-events-none">
            {sessionCreditsUsed > 0 ? (
              <>
                <div>This session: {sessionCreditsUsed.toLocaleString()} credits used</div>
                {burnRate > 0 && <div>Burn rate: ~{burnRate.toLocaleString()}/min</div>}
                {minutesRemaining !== null && <div>~{minutesRemaining} min remaining at this pace</div>}
              </>
            ) : (
              <div>No credits used this session yet</div>
            )}
            <div className="absolute -bottom-1 right-4 w-2 h-2 rotate-45 bg-void-gray border-r border-b border-border-subtle" />
          </div>
        )}
      </div>

      {/* Low balance CTA */}
      {(isLow || isSessionLow) && (
        <button className="px-3 py-1.5 min-h-[44px] text-xs bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 rounded-lg border border-amber-500/30 transition-colors">
          Top Up
        </button>
      )}
    </div>
  );
}
