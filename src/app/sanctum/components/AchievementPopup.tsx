'use client';

import { useEffect, useState } from 'react';
import { X, Sparkles, Zap, Code, Rocket, Star } from 'lucide-react';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: 'trophy' | 'sparkles' | 'zap' | 'code' | 'rocket' | 'star';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xp: number;
}

interface AchievementPopupProps {
  achievement: Achievement | null;
  onClose: () => void;
}

const ICONS = {
  trophy: Star, // Using star as fallback
  sparkles: Sparkles,
  zap: Zap,
  code: Code,
  rocket: Rocket,
  star: Star,
};

const RARITY_STYLES = {
  common: {
    bg: 'from-slate-600/90 to-slate-700/90',
    border: 'border-slate-500',
    glow: 'shadow-slate-500/30',
    text: 'text-slate-200',
  },
  rare: {
    bg: 'from-blue-600/90 to-blue-700/90',
    border: 'border-blue-400',
    glow: 'shadow-blue-500/50',
    text: 'text-blue-200',
  },
  epic: {
    bg: 'from-purple-600/90 to-purple-700/90',
    border: 'border-purple-400',
    glow: 'shadow-purple-500/50',
    text: 'text-purple-200',
  },
  legendary: {
    bg: 'from-amber-500/90 to-orange-600/90',
    border: 'border-amber-400',
    glow: 'shadow-amber-500/50',
    text: 'text-amber-100',
  },
};

export function AchievementPopup({ achievement, onClose }: AchievementPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (achievement) {
      setIsVisible(true);
      setShowConfetti(true);

      // Auto-close after 5 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300);
      }, 5000);

      // Hide confetti after 2 seconds
      const confettiTimer = setTimeout(() => setShowConfetti(false), 2000);

      return () => {
        clearTimeout(timer);
        clearTimeout(confettiTimer);
      };
    }
  }, [achievement, onClose]);

  if (!achievement) return null;

  const IconComponent = ICONS[achievement.icon];
  const styles = RARITY_STYLES[achievement.rarity];

  return (
    <>
      {/* Confetti */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-[60] overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10px',
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${2 + Math.random()}s`,
              }}
            >
              <div
                className="w-2 h-2 rounded-sm"
                style={{
                  backgroundColor: ['#00EC97', '#6366f1', '#f59e0b', '#ef4444', '#ffffff'][Math.floor(Math.random() * 5)],
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Achievement card */}
      <div
        className={`fixed top-20 right-4 z-50 transition-all duration-300 ${
          isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        }`}
      >
        <div
          className={`relative p-4 rounded-xl border ${styles.border} bg-gradient-to-br ${styles.bg} backdrop-blur-xl shadow-2xl ${styles.glow}`}
          style={{ minWidth: '280px' }}
        >
          {/* Close button */}
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4 text-white/60" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center ${
              achievement.rarity === 'legendary' ? 'animate-pulse' : ''
            }`}>
              <IconComponent className={`w-6 h-6 ${styles.text}`} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-white/60 font-medium">
                🏆 Achievement Unlocked!
              </p>
              <h3 className={`text-lg font-bold ${styles.text}`}>
                {achievement.title}
              </h3>
            </div>
          </div>

          {/* Description */}
          <p className="mt-2 text-sm text-white/80">
            {achievement.description}
          </p>

          {/* XP reward */}
          <div className="mt-3 flex items-center justify-between">
            <span className={`text-xs uppercase tracking-wider ${styles.text}`}>
              {achievement.rarity}
            </span>
            <span className="flex items-center gap-1 text-sm font-bold text-near-green">
              <Sparkles className="w-4 h-4" />
              +{achievement.xp} XP
            </span>
          </div>

          {/* Animated border */}
          {achievement.rarity === 'legendary' && (
            <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
              <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// Predefined achievements
export const ACHIEVEMENTS: Record<string, Achievement> = {
  first_message: {
    id: 'first_message',
    title: 'Hello, Sanctum!',
    description: 'Sent your first message to Sanctum',
    icon: 'sparkles',
    rarity: 'common',
    xp: 10,
  },
  first_code: {
    id: 'first_code',
    title: 'Code Conjurer',
    description: 'Generated your first smart contract code',
    icon: 'code',
    rarity: 'common',
    xp: 25,
  },
  first_deploy: {
    id: 'first_deploy',
    title: 'Genesis Deploy',
    description: 'Deployed your first contract to NEAR testnet',
    icon: 'rocket',
    rarity: 'rare',
    xp: 100,
  },
  chain_signatures: {
    id: 'chain_signatures',
    title: 'Chain Master',
    description: 'Built a contract using Chain Signatures',
    icon: 'zap',
    rarity: 'epic',
    xp: 150,
  },
  shade_agent: {
    id: 'shade_agent',
    title: 'Agent Smith',
    description: 'Created an autonomous Shade Agent',
    icon: 'star',
    rarity: 'epic',
    xp: 200,
  },
  speed_demon: {
    id: 'speed_demon',
    title: 'Speed Demon',
    description: 'Built and deployed a contract in under 3 minutes',
    icon: 'zap',
    rarity: 'legendary',
    xp: 500,
  },
  concept_collector_5: {
    id: 'concept_collector_5',
    title: 'Concept Collector',
    description: 'Learned 5 concepts',
    icon: 'sparkles',
    rarity: 'common',
    xp: 50,
  },
  concept_collector_20: {
    id: 'concept_collector_20',
    title: 'Knowledge Hoarder',
    description: 'Learned 20 concepts',
    icon: 'star',
    rarity: 'epic',
    xp: 200,
  },
  quiz_ace: {
    id: 'quiz_ace',
    title: 'Quiz Ace',
    description: 'Got 5 quizzes right in a row',
    icon: 'star',
    rarity: 'rare',
    xp: 100,
  },
  security_aware: {
    id: 'security_aware',
    title: 'Security Minded',
    description: 'Used Sentinel to audit code',
    icon: 'code',
    rarity: 'rare',
    xp: 75,
  },
  three_contracts: {
    id: 'three_contracts',
    title: 'Contract Factory',
    description: 'Built 3 different contracts',
    icon: 'rocket',
    rarity: 'rare',
    xp: 100,
  },
  asked_why: {
    id: 'asked_why',
    title: 'Curious Mind',
    description: 'Asked "why" or "how does this work"',
    icon: 'sparkles',
    rarity: 'common',
    xp: 25,
  },
};
