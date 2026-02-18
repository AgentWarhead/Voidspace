/* ─── XP Utilities — Shared level/XP calculation ──────────────
 * Used by XPRibbon, BuilderProgress, and profile/learn pages.
 * ────────────────────────────────────────────────────────────── */

export const XP_LEVELS = [0, 50, 150, 350, 600, 1000, 1500, 2200, 3000, 4000, 5500];

export const LEVEL_TITLES = [
  'Initiate',
  'Apprentice',
  'Coder',
  'Builder',
  'Architect',
  'Engineer',
  'Artisan',
  'Master',
  'Grandmaster',
  'Legend',
  'Mythic',
];

export interface LevelInfo {
  level: number;
  currentXP: number;   // XP progress within this level
  nextLevelXP: number; // XP needed to advance one level
  totalXP: number;     // raw total XP
  progress: number;    // 0–100 percent within this level
  title: string;
}

export function getLevel(xp: number): LevelInfo {
  let level = 1;
  for (let i = 1; i < XP_LEVELS.length; i++) {
    if (xp >= XP_LEVELS[i]) level = i + 1;
    else break;
  }
  const lvlIdx = Math.min(level - 1, XP_LEVELS.length - 1);
  const nextIdx = Math.min(level, XP_LEVELS.length - 1);
  const currentLevelXP = XP_LEVELS[lvlIdx] ?? 0;
  const nextLevelXP =
    level >= XP_LEVELS.length
      ? XP_LEVELS[XP_LEVELS.length - 1] + 1000
      : XP_LEVELS[nextIdx];
  const range = nextLevelXP - currentLevelXP;
  const progress = range > 0 ? Math.min(((xp - currentLevelXP) / range) * 100, 100) : 100;
  return {
    level,
    currentXP: xp - currentLevelXP,
    nextLevelXP: nextLevelXP - currentLevelXP,
    totalXP: xp,
    progress,
    title: LEVEL_TITLES[level - 1] ?? 'Mythic',
  };
}

/** Activity-based XP from Sanctum session stats */
export function calculateActivityXP(
  messages: number,
  codeGens: number,
  deploys: number,
  conceptsLearned: number,
  quizCorrect: number,
): number {
  return (
    messages * 5 +
    codeGens * 25 +
    deploys * 100 +
    conceptsLearned * 15 +
    quizCorrect * 20
  );
}
