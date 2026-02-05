'use client';

import { Zap, Globe, Shield, Sparkles } from 'lucide-react';

interface SocialProofProps {
  variant?: 'banner' | 'compact' | 'inline';
}

// Feature highlights - real facts, no fake numbers
const FEATURES = [
  { icon: <Zap className="w-5 h-5" />, label: 'AI-Powered', desc: 'Build by chatting', color: 'cyan' as const },
  { icon: <Globe className="w-5 h-5" />, label: 'Full Stack', desc: 'Contract + Webapp', color: 'green' as const },
  { icon: <Shield className="w-5 h-5" />, label: 'Gas Optimized', desc: 'Best practices built-in', color: 'purple' as const },
  { icon: <Sparkles className="w-5 h-5" />, label: 'One-Click', desc: 'Deploy to NEAR', color: 'yellow' as const },
];

export function SocialProof({ variant = 'banner' }: SocialProofProps) {
  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-void-cyan" />
          <span className="text-gray-400">
            AI-powered <span className="text-white font-medium">contract building</span>
          </span>
        </div>
        <div className="text-gray-600">•</div>
        <div className="flex items-center gap-1.5">
          <Globe className="w-4 h-4 text-green-400" />
          <span className="text-gray-400">
            Full stack <span className="text-white font-medium">in minutes</span>
          </span>
        </div>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-void-purple/10 border border-void-purple/20 rounded-full text-sm">
        <Sparkles className="w-4 h-4 text-void-cyan" />
        <span className="text-gray-300">
          Build contracts <span className="text-white font-medium">by talking</span>
        </span>
      </div>
    );
  }

  // Banner variant (default) - feature highlights
  return (
    <div className="bg-gradient-to-r from-void-purple/10 via-void-darker to-void-cyan/10 border border-void-purple/20 rounded-xl p-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {FEATURES.map((feature, i) => (
          <FeatureCard
            key={i}
            icon={feature.icon}
            label={feature.label}
            desc={feature.desc}
            color={feature.color}
          />
        ))}
      </div>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  label: string;
  desc: string;
  color: 'purple' | 'cyan' | 'green' | 'yellow';
}

function FeatureCard({ icon, label, desc, color }: FeatureCardProps) {
  const colorClasses = {
    purple: 'text-void-purple bg-void-purple/20',
    cyan: 'text-void-cyan bg-void-cyan/20',
    green: 'text-green-400 bg-green-400/20',
    yellow: 'text-yellow-400 bg-yellow-400/20',
  };

  return (
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-lg ${colorClasses[color]} flex items-center justify-center`}>
        {icon}
      </div>
      <div>
        <span className="text-base font-bold text-white">{label}</span>
        <span className="text-xs text-gray-400 block">{desc}</span>
      </div>
    </div>
  );
}

// Removed LiveBuildersIndicator - no fake numbers
