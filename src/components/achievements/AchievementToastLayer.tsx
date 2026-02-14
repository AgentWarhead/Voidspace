/* ─── AchievementToastLayer ─────────────────────────────────
 * Global overlay that shows achievement unlock popups.
 * Renders at the top of the app, reads from AchievementContext.
 * ────────────────────────────────────────────────────────────── */

'use client';

import { useEffect, useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { useAchievementContext } from '@/contexts/AchievementContext';
import { RARITY_CONFIG, type AchievementDef } from '@/lib/achievements';
import { cn } from '@/lib/utils';

export function AchievementToastLayer() {
  const { pendingPopups, dismissPopup } = useAchievementContext();
  const [visible, setVisible] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const current = pendingPopups[0] ?? null;

  useEffect(() => {
    if (!current) {
      setVisible(false);
      return;
    }

    setVisible(true);
    setShowConfetti(true);

    const confettiTimer = setTimeout(() => setShowConfetti(false), 2000);
    const autoClose = setTimeout(() => {
      setVisible(false);
      setTimeout(dismissPopup, 300);
    }, 5000);

    return () => {
      clearTimeout(confettiTimer);
      clearTimeout(autoClose);
    };
  }, [current, dismissPopup]);

  if (!current) return null;

  const rarity = RARITY_CONFIG[current.rarity];

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
                  backgroundColor: ['#00EC97', '#6366f1', '#f59e0b', '#ef4444', '#ffffff'][
                    Math.floor(Math.random() * 5)
                  ],
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Toast card */}
      <div
        className={cn(
          'fixed top-20 right-4 z-50 transition-all duration-300',
          visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        )}
      >
        <div
          className={cn(
            'relative p-4 rounded-xl border backdrop-blur-xl shadow-2xl',
            rarity.border,
            `bg-gradient-to-br ${rarity.bg}`,
            rarity.glow
          )}
          style={{ minWidth: '300px', maxWidth: '360px' }}
        >
          <button
            onClick={() => {
              setVisible(false);
              setTimeout(dismissPopup, 300);
            }}
            className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4 text-white/60" />
          </button>

          <div className="flex items-center gap-3">
            <div
              className={cn(
                'w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center text-3xl',
                current.rarity === 'legendary' && 'animate-pulse'
              )}
            >
              {current.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs uppercase tracking-wider text-white/60 font-medium">
                🏆 Achievement Unlocked!
              </p>
              <h3 className={cn('text-lg font-bold truncate', rarity.textColor)}>
                {current.name}
              </h3>
            </div>
          </div>

          <p className="mt-2 text-sm text-white/80">{current.description}</p>

          <div className="mt-3 flex items-center justify-between">
            <span className={cn('text-xs uppercase tracking-wider', rarity.textColor)}>
              {rarity.label}
            </span>
            <span className="flex items-center gap-1 text-sm font-bold text-near-green">
              <Sparkles className="w-4 h-4" />+{current.xp} XP
            </span>
          </div>

          {current.rarity === 'legendary' && (
            <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
              <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
