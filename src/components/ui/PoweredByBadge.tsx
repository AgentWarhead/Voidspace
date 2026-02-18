'use client';

import React from 'react';

interface PoweredByBadgeProps {
  model: 'claude-opus' | 'claude-sonnet' | 'claude-haiku' | 'gemini';
  className?: string;
  size?: 'sm' | 'md';
}

const MODEL_INFO = {
  'claude-opus': { name: 'Claude Opus 4.6', icon: '⚡', color: '#D4A574' },
  'claude-sonnet': { name: 'Claude Sonnet 4.6', icon: '⚡', color: '#00EC97' },
  'claude-haiku': { name: 'Claude Haiku 4.5', icon: '⚡', color: '#60A5FA' },
  'gemini': { name: 'Gemini 3 Pro', icon: '✨', color: '#FBBF24' },
};

export function PoweredByBadge({ model, className = '', size = 'sm' }: PoweredByBadgeProps) {
  const info = MODEL_INFO[model];
  const textSize = size === 'sm' ? 'text-[10px]' : 'text-xs';

  return (
    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 ${className}`}>
      <span className={textSize}>{info.icon}</span>
      <span className={`${textSize} text-white/40 font-medium`}>
        Powered by <span style={{ color: info.color }} className="font-semibold">{info.name}</span>
      </span>
    </div>
  );
}
