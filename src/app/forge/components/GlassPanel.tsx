'use client';

import { ReactNode } from 'react';

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
  glowColor?: 'green' | 'purple' | 'blue';
  hover?: boolean;
}

export function GlassPanel({ 
  children, 
  className = '', 
  glow = false, 
  glowColor = 'green',
  hover = false 
}: GlassPanelProps) {
  const glowStyles = {
    green: 'shadow-near-green/20 hover:shadow-near-green/40',
    purple: 'shadow-purple-500/20 hover:shadow-purple-500/40',
    blue: 'shadow-blue-500/20 hover:shadow-blue-500/40',
  };

  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl
        bg-gradient-to-br from-white/[0.08] to-white/[0.02]
        backdrop-blur-xl
        border border-white/[0.08]
        ${glow ? `shadow-xl ${glowStyles[glowColor]}` : ''}
        ${hover ? 'transition-all duration-300 hover:scale-[1.01] hover:border-white/[0.15]' : ''}
        ${className}
      `}
    >
      {/* Inner glow effect */}
      <div className="absolute inset-0 opacity-50">
        <div 
          className="absolute top-0 left-1/4 w-1/2 h-px"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
          }}
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
