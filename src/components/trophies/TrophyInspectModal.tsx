/* ─── TrophyInspectModal — Full Detail Achievement Inspector ──
 * Click any trophy to see its full story:
 *   Unlocked → name, desc, rarity, XP, date earned, rarity glow
 *   Locked   → silhouette, hint, "How to unlock" guide
 * ─────────────────────────────────────────────────────────── */

'use client';

import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Sparkles, Calendar, HelpCircle, Star, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RARITY_CONFIG, CATEGORY_CONFIG, type AchievementDef } from '@/lib/achievements';

interface TrophyInspectModalProps {
  achievement: AchievementDef | null;
  isUnlocked: boolean;
  unlockedAt?: number;
  onClose: () => void;
}

// Rarity-specific holographic radial gradient backgrounds
const RARITY_MODAL_BG: Record<string, string> = {
  common:    'radial-gradient(ellipse at 30% 20%, rgba(100,116,139,0.15) 0%, transparent 60%)',
  uncommon:  'radial-gradient(ellipse at 30% 20%, rgba(34,197,94,0.12) 0%, transparent 60%)',
  rare:      'radial-gradient(ellipse at 30% 20%, rgba(0,212,255,0.18) 0%, transparent 60%)',
  epic:      'radial-gradient(ellipse at 30% 20%, rgba(139,92,246,0.20) 0%, transparent 60%)',
  legendary: 'radial-gradient(ellipse at 30% 20%, rgba(245,158,11,0.25) 0%, transparent 60%)',
};

const RARITY_GLOW_STYLE: Record<string, string> = {
  common:    '0 0 30px rgba(100,116,139,0.2)',
  uncommon:  '0 0 35px rgba(34,197,94,0.25)',
  rare:      '0 0 40px rgba(0,212,255,0.35)',
  epic:      '0 0 50px rgba(139,92,246,0.4), 0 0 100px rgba(139,92,246,0.1)',
  legendary: '0 0 60px rgba(245,158,11,0.5), 0 0 120px rgba(245,158,11,0.15)',
};

const RARITY_BORDER_GLOW: Record<string, string> = {
  common:    'rgba(100,116,139,0.3)',
  uncommon:  'rgba(34,197,94,0.4)',
  rare:      'rgba(0,212,255,0.5)',
  epic:      'rgba(139,92,246,0.6)',
  legendary: 'rgba(245,158,11,0.7)',
};

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatTimeAgo(ts: number): string {
  const seconds = Math.floor((Date.now() - ts) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days !== 1 ? 's' : ''} ago`;
  return formatDate(ts);
}

export function TrophyInspectModal({
  achievement,
  isUnlocked,
  unlockedAt,
  onClose,
}: TrophyInspectModalProps) {
  // Close on Escape
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  // Prevent body scroll when modal open
  useEffect(() => {
    if (achievement) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [achievement]);

  return (
    <AnimatePresence>
      {achievement && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal panel */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.85, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 16 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[71] flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className={cn(
                'relative w-full max-w-md pointer-events-auto rounded-2xl border overflow-hidden',
                'backdrop-blur-2xl',
                RARITY_CONFIG[achievement.rarity].border,
              )}
              style={{
                background: `${RARITY_MODAL_BG[achievement.rarity]}, rgba(10,10,10,0.95)`,
                boxShadow: RARITY_GLOW_STYLE[achievement.rarity],
                borderColor: RARITY_BORDER_GLOW[achievement.rarity],
              }}
            >
              {/* Shimmer overlay for legendary */}
              {achievement.rarity === 'legendary' && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
                  <div
                    className="absolute inset-0 animate-shimmer opacity-20"
                    style={{
                      background: 'linear-gradient(105deg, transparent 40%, rgba(245,158,11,0.4) 50%, transparent 60%)',
                      backgroundSize: '200% 100%',
                    }}
                  />
                </div>
              )}

              {/* Epic pulse border */}
              {achievement.rarity === 'epic' && (
                <div
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  style={{
                    background: 'linear-gradient(135deg, rgba(139,92,246,0.1), transparent)',
                    animation: 'pulse 3s ease-in-out infinite',
                  }}
                />
              )}

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4 text-white/70" />
              </button>

              {/* Header */}
              <div className="p-6 pb-4">
                {/* Category badge */}
                <div className="flex items-center gap-2 mb-4">
                  <span className={cn('text-xs uppercase tracking-widest font-semibold', CATEGORY_CONFIG[achievement.category].color)}>
                    {CATEGORY_CONFIG[achievement.category].emoji} {CATEGORY_CONFIG[achievement.category].label}
                  </span>
                </div>

                {/* Trophy icon + rarity */}
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className={cn(
                      'relative flex-shrink-0 w-20 h-20 rounded-2xl flex items-center justify-center',
                      'border',
                      RARITY_CONFIG[achievement.rarity].border,
                      isUnlocked ? 'bg-white/10' : 'bg-white/5',
                    )}
                    style={{
                      boxShadow: isUnlocked ? `0 0 24px ${RARITY_BORDER_GLOW[achievement.rarity]}` : 'none',
                    }}
                  >
                    {achievement.secret && !isUnlocked ? (
                      <HelpCircle className="w-8 h-8 text-text-muted" />
                    ) : isUnlocked ? (
                      <span className="text-4xl">{achievement.emoji}</span>
                    ) : (
                      <Lock className="w-8 h-8 text-text-muted" />
                    )}

                    {/* Legendary pedestal glow */}
                    {achievement.rarity === 'legendary' && isUnlocked && (
                      <div
                        className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-2 rounded-full blur-md"
                        style={{ background: 'rgba(245,158,11,0.6)' }}
                      />
                    )}
                  </div>

                  {/* Title block */}
                  <div className="flex-1 min-w-0">
                    <h2 className={cn(
                      'text-xl font-bold leading-tight mb-1',
                      achievement.secret && !isUnlocked ? 'text-text-muted' : 'text-text-primary',
                    )}>
                      {achievement.secret && !isUnlocked ? '???' : achievement.name}
                    </h2>

                    {/* Rarity pill */}
                    <span className={cn(
                      'inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border font-semibold uppercase tracking-wider',
                      RARITY_CONFIG[achievement.rarity].color,
                      RARITY_CONFIG[achievement.rarity].border,
                      'bg-white/5',
                    )}>
                      <Star className="w-3 h-3" />
                      {RARITY_CONFIG[achievement.rarity].label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div
                className="h-px mx-6"
                style={{ background: `linear-gradient(90deg, transparent, ${RARITY_BORDER_GLOW[achievement.rarity]}, transparent)` }}
              />

              {/* Body */}
              <div className="p-6 pt-4 space-y-4">
                {/* Description */}
                <div>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {achievement.secret && !isUnlocked
                      ? (achievement.hint || 'A mystery awaits the worthy...')
                      : achievement.description}
                  </p>
                </div>

                {/* XP reward */}
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-near-green" />
                  <span className="text-sm font-bold text-near-green">+{achievement.xp} XP</span>
                  <span className="text-xs text-text-muted">reward</span>
                </div>

                {/* If unlocked — show earned date */}
                {isUnlocked && unlockedAt && (
                  <div
                    className="flex items-start gap-3 p-3 rounded-xl border"
                    style={{
                      background: `rgba(0,236,151,0.05)`,
                      borderColor: 'rgba(0,236,151,0.2)',
                    }}
                  >
                    <Calendar className="w-4 h-4 text-near-green flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-near-green">Earned</p>
                      <p className="text-sm text-text-primary">{formatDate(unlockedAt)}</p>
                      <p className="text-xs text-text-muted">{formatTimeAgo(unlockedAt)}</p>
                    </div>
                  </div>
                )}

                {/* If unlocked but no timestamp */}
                {isUnlocked && !unlockedAt && (
                  <div
                    className="flex items-center gap-2 p-3 rounded-xl border"
                    style={{ background: 'rgba(0,236,151,0.05)', borderColor: 'rgba(0,236,151,0.2)' }}
                  >
                    <Trophy className="w-4 h-4 text-near-green" />
                    <span className="text-sm text-near-green font-semibold">Achievement Unlocked ✓</span>
                  </div>
                )}

                {/* If locked — show how to unlock */}
                {!isUnlocked && (
                  <div
                    className="p-3 rounded-xl border"
                    style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.1)' }}
                  >
                    <p className="text-xs font-semibold text-text-muted mb-1.5 flex items-center gap-1.5">
                      <Lock className="w-3 h-3" />
                      How to unlock
                    </p>
                    {achievement.secret ? (
                      <p className="text-sm text-text-muted italic">
                        {achievement.hint || 'Keep exploring the Void...'}
                      </p>
                    ) : achievement.trigger?.stat ? (
                      <p className="text-sm text-text-secondary">
                        {getStatDescription(achievement)}
                      </p>
                    ) : (
                      <p className="text-sm text-text-secondary">
                        {achievement.description}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Legendary special footer */}
              {achievement.rarity === 'legendary' && (
                <div
                  className="px-6 pb-6"
                >
                  <div
                    className="text-center py-2 rounded-xl text-xs font-bold uppercase tracking-widest"
                    style={{
                      background: 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(251,191,36,0.05))',
                      border: '1px solid rgba(245,158,11,0.3)',
                      color: '#f59e0b',
                    }}
                  >
                    ✦ Legendary Achievement ✦
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function getStatDescription(achievement: AchievementDef): string {
  const { stat, threshold } = achievement.trigger ?? {};
  if (!stat || threshold === undefined) return achievement.description;

  const statLabels: Record<string, string> = {
    voidsExplored: `Explore ${threshold} projects`,
    uniqueCategoriesExplored: `Explore projects in ${threshold} different categories`,
    categoriesFullyExplored: `Explore every project in ${threshold} category(ies)`,
    observatoryVisits: `Visit the Observatory ${threshold} times`,
    pulseStreamsRead: `Read ${threshold} Pulse Streams entries`,
    briefsGenerated: `Generate ${threshold} opportunity briefs`,
    opportunitiesSaved: `Save ${threshold} opportunities`,
    walletsAnalyzed: `Analyze ${threshold} unique wallets`,
    bubblesVisits: `Visit Void Bubbles ${threshold} times`,
    bubblesMinutesSpent: `Spend ${threshold}+ minutes in Void Bubbles`,
    bubblesClicked: `Click ${threshold} different bubbles`,
    constellationVisits: `Open the Constellation Map ${threshold} times`,
    nodesExpanded: `Expand ${threshold} nodes in the Constellation`,
    maxDepthReached: `Reach ${threshold}+ levels deep in a constellation`,
    screenshotsTaken: `Take ${threshold} constellation screenshot(s)`,
    sanctumMessages: `Send ${threshold} messages in Sanctum`,
    codeGenerations: `Generate ${threshold} smart contract code snippets`,
    contractsDeployed: `Deploy ${threshold} contract(s) to NEAR testnet`,
    contractsBuilt: `Build ${threshold} different contracts`,
    uniquePersonasUsed: `Talk to ${threshold} different Sanctum Council personas`,
    tokensUsed: `Use ${threshold.toLocaleString()}+ tokens in Sanctum`,
    nightBuilds: `Build a contract between midnight and 5 AM`,
    longestSessionMinutes: `Have a single Sanctum session lasting ${threshold}+ minutes`,
    conceptsLearned: `Learn ${threshold} concepts in Sanctum Learn mode`,
    maxQuizStreak: `Get ${threshold} quizzes right in a row`,
    modulesCompleted: `Complete ${threshold} learning module(s)`,
    explorerModules: `Complete ${threshold} Explorer track modules`,
    builderModules: `Complete ${threshold} Builder track modules`,
    hackerModules: `Complete ${threshold} Hacker track modules`,
    founderModules: `Complete ${threshold} Founder track modules`,
    certificatesEarned: `Earn ${threshold} track certificate(s)`,
    totalSpent: `Spend $${threshold}+ on Voidspace`,
    topUpsCount: `Buy ${threshold} credit top-ups`,
    profileShares: `Share your Void Command profile ${threshold} time(s)`,
    contractsShared: `Share ${threshold} deployed contract link(s)`,
    referrals: `Refer ${threshold} user(s) to Voidspace`,
    currentStreak: `Be active ${threshold} consecutive days`,
    longestStreak: `Achieve a ${threshold}-day streak`,
    accountAgeDays: `Account older than ${threshold} days`,
    bubblesClickedInSession: `Click ${threshold} bubbles in one Void Bubbles session`,
    logoClicks: `Click the Voidspace logo ${threshold} times rapidly`,
  };

  return statLabels[stat] ?? achievement.description;
}
