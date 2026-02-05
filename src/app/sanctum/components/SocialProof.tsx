'use client';

import { useState, useEffect } from 'react';
import { Zap, Users, Rocket, TrendingUp } from 'lucide-react';

interface SocialProofProps {
  variant?: 'banner' | 'compact' | 'inline';
}

interface Stats {
  contractsBuilt: number;
  activeBuilders: number;
  deploysThisWeek: number;
  liveContracts: number;
}

// Simulated stats - in production, fetch from backend
const BASE_STATS: Stats = {
  contractsBuilt: 1247,
  activeBuilders: 89,
  deploysThisWeek: 156,
  liveContracts: 432,
};

export function SocialProof({ variant = 'banner' }: SocialProofProps) {
  const [stats, setStats] = useState<Stats>(BASE_STATS);
  const [animatedStats, setAnimatedStats] = useState<Stats>(BASE_STATS);

  // Simulate live activity (increment randomly)
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        contractsBuilt: prev.contractsBuilt + (Math.random() > 0.7 ? 1 : 0),
        activeBuilders: Math.max(50, prev.activeBuilders + (Math.random() > 0.5 ? 1 : -1)),
        deploysThisWeek: prev.deploysThisWeek + (Math.random() > 0.8 ? 1 : 0),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Animate number changes
  useEffect(() => {
    const duration = 1000;
    const steps = 20;
    const stepDuration = duration / steps;
    
    let step = 0;
    const interval = setInterval(() => {
      step++;
      const progress = step / steps;
      
      setAnimatedStats({
        contractsBuilt: Math.round(BASE_STATS.contractsBuilt + (stats.contractsBuilt - BASE_STATS.contractsBuilt) * progress),
        activeBuilders: Math.round(BASE_STATS.activeBuilders + (stats.activeBuilders - BASE_STATS.activeBuilders) * progress),
        deploysThisWeek: Math.round(BASE_STATS.deploysThisWeek + (stats.deploysThisWeek - BASE_STATS.deploysThisWeek) * progress),
        liveContracts: stats.liveContracts,
      });

      if (step >= steps) clearInterval(interval);
    }, stepDuration);

    return () => clearInterval(interval);
  }, [stats]);

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-gray-400">
            <span className="text-white font-semibold">{animatedStats.activeBuilders}</span> builders online
          </span>
        </div>
        <div className="text-gray-600">•</div>
        <div className="flex items-center gap-1.5">
          <Rocket className="w-4 h-4 text-void-purple" />
          <span className="text-gray-400">
            <span className="text-white font-semibold">{animatedStats.contractsBuilt.toLocaleString()}</span> contracts built
          </span>
        </div>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-void-purple/10 border border-void-purple/20 rounded-full text-sm">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        <span className="text-gray-300">
          <span className="text-white font-semibold">{animatedStats.contractsBuilt.toLocaleString()}</span> contracts built
        </span>
      </div>
    );
  }

  // Banner variant (default)
  return (
    <div className="bg-gradient-to-r from-void-purple/10 via-void-darker to-void-cyan/10 border border-void-purple/20 rounded-xl p-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={<Rocket className="w-5 h-5" />}
          value={animatedStats.contractsBuilt.toLocaleString()}
          label="Contracts Built"
          color="purple"
        />
        <StatCard
          icon={<Users className="w-5 h-5" />}
          value={animatedStats.activeBuilders.toString()}
          label="Builders Online"
          color="green"
          live
        />
        <StatCard
          icon={<Zap className="w-5 h-5" />}
          value={animatedStats.deploysThisWeek.toString()}
          label="Deploys This Week"
          color="cyan"
        />
        <StatCard
          icon={<TrendingUp className="w-5 h-5" />}
          value={animatedStats.liveContracts.toString()}
          label="Live on NEAR"
          color="yellow"
        />
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  color: 'purple' | 'cyan' | 'green' | 'yellow';
  live?: boolean;
}

function StatCard({ icon, value, label, color, live }: StatCardProps) {
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
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-white">{value}</span>
          {live && (
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          )}
        </div>
        <span className="text-xs text-gray-400">{label}</span>
      </div>
    </div>
  );
}

// LiveIndicator for header
export function LiveBuildersIndicator() {
  const [count, setCount] = useState(89);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => Math.max(50, prev + (Math.random() > 0.5 ? 1 : -1)));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
      <span className="text-xs text-green-400 font-medium">
        {count} building now
      </span>
    </div>
  );
}
