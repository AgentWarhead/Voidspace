'use client';

import { useEffect, useState } from 'react';
import { PoweredByBadge } from '@/components/ui/PoweredByBadge';

interface SanctumVisualizationProps {
  isGenerating: boolean;
  progress: number; // 0-100
  stage: 'idle' | 'thinking' | 'generating' | 'complete';
}

export function SanctumVisualization({ isGenerating, progress, stage }: SanctumVisualizationProps) {
  const [pulseIntensity, setPulseIntensity] = useState(0);

  useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        setPulseIntensity((prev) => (prev + 1) % 100);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isGenerating]);

  const glowIntensity = isGenerating ? 0.5 + Math.sin(pulseIntensity * 0.1) * 0.3 : 0.2;

  return (
    <div className="relative w-full h-32 flex items-center justify-center overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          background: `radial-gradient(ellipse at center, rgba(0, 236, 151, ${glowIntensity * 0.3}) 0%, transparent 70%)`,
        }}
      />

      {/* Sanctum icon */}
      <div className="relative flex flex-col items-center">
        {/* Animated rings */}
        {isGenerating && (
          <>
            <div
              className="absolute w-24 h-24 rounded-full border border-near-green/30 animate-ping"
              style={{ animationDuration: '2s' }}
            />
            <div
              className="absolute w-20 h-20 rounded-full border border-near-green/40 animate-ping"
              style={{ animationDuration: '1.5s', animationDelay: '0.5s' }}
            />
            <div
              className="absolute w-16 h-16 rounded-full border border-near-green/50 animate-ping"
              style={{ animationDuration: '1s', animationDelay: '0.25s' }}
            />
          </>
        )}

        {/* Main sanctum icon */}
        <div
          className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
            isGenerating ? 'scale-110' : 'scale-100'
          }`}
          style={{
            background: `radial-gradient(circle, rgba(0, 236, 151, ${glowIntensity}) 0%, rgba(0, 236, 151, 0.1) 70%)`,
            boxShadow: isGenerating
              ? `0 0 30px rgba(0, 236, 151, ${glowIntensity}), 0 0 60px rgba(0, 236, 151, ${glowIntensity * 0.5})`
              : 'none',
          }}
        >
          <span className="text-3xl">
            {stage === 'idle' && '🔨'}
            {stage === 'thinking' && '🧠'}
            {stage === 'generating' && '⚡'}
            {stage === 'complete' && '✨'}
          </span>
        </div>

        {/* Status text */}
        <div className="mt-3 text-center">
          <p className={`text-sm font-medium transition-colors ${isGenerating ? 'text-near-green' : 'text-text-muted'}`}>
            {stage === 'idle' && 'Ready to sanctum'}
            {stage === 'thinking' && 'Analyzing requirements...'}
            {stage === 'generating' && 'Forging your contract...'}
            {stage === 'complete' && 'Contract sanctumd!'}
          </p>

          {/* Progress bar */}
          {isGenerating && (
            <div className="mt-2 w-48 h-1.5 bg-void-gray rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-near-green to-emerald-400 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {/* AI model badge — visible when generating or complete */}
          {(isGenerating || stage === 'complete') && (
            <div className="mt-2">
              <PoweredByBadge model="gemini" />
            </div>
          )}
        </div>
      </div>

      {/* Floating code particles */}
      {isGenerating && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute text-near-green/30 text-xs font-mono animate-float"
              style={{
                left: `${10 + i * 12}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: `${2 + Math.random()}s`,
              }}
            >
              {['fn', 'pub', 'struct', 'impl', 'let', 'mut', '#[near]', 'u128'][i]}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
