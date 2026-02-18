/* ─── BuilderProgress — Sanctum XP HUD ────────────────────────
 * Always-visible ribbon: level badge + animated XP bar + session
 * stats. Emits XP gain events and triggers level-up celebration.
 * Replaces the old collapsible accordion.
 * ────────────────────────────────────────────────────────────── */

'use client';

import { useEffect, useRef } from 'react';
import { useAchievementContext } from '@/contexts/AchievementContext';
import { useXPEvents } from '@/contexts/XPEventContext';
import { getByCategory } from '@/lib/achievements';
import { calculateActivityXP, getLevel, LEVEL_TITLES } from '@/lib/xp';
import { XPRibbon } from '@/components/xp/XPRibbon';
import { SessionStatsBar } from '@/components/xp/SessionStatsBar';

export interface BuilderProgressProps {
  messagesCount: number;
  codeGenerations: number;
  deploysCount: number;
  tokensUsed: number;
  conceptsLearned: number;
  quizScore: { correct: number; total: number };
  sessionMinutes?: number;
  sessionStartTime?: number | null;
}

/** Full XP calc: activity XP + sanctum achievement XP */
export function calculateTotalXP(
  messages: number,
  codeGens: number,
  deploys: number,
  unlockedAchievements: Set<string>,
  conceptsLearned: number,
  quizCorrect: number,
): number {
  const activityXP = calculateActivityXP(messages, codeGens, deploys, conceptsLearned, quizCorrect);
  const sanctumAchs = getByCategory('sanctum');
  const achievementXP = sanctumAchs.reduce(
    (sum, a) => sum + (unlockedAchievements.has(a.id) ? a.xp : 0),
    0,
  );
  return activityXP + achievementXP;
}

// ─── XP-per-action constants (must match calculateActivityXP) ─
const XP_MESSAGE  = 5;
const XP_CODE     = 25;
const XP_DEPLOY   = 100;
const XP_CONCEPT  = 15;
const XP_QUIZ     = 20;

export function BuilderProgress({
  messagesCount,
  codeGenerations,
  deploysCount,
  tokensUsed: _tokensUsed,
  conceptsLearned,
  quizScore,
  sessionMinutes: _sessionMinutes,
  sessionStartTime = null,
}: BuilderProgressProps) {
  const { unlocked } = useAchievementContext();
  const { emitXP, triggerLevelUp } = useXPEvents();

  const totalXP = calculateTotalXP(
    messagesCount,
    codeGenerations,
    deploysCount,
    unlocked,
    conceptsLearned,
    quizScore.correct,
  );

  const { level, title } = getLevel(totalXP);

  // ─── Refs to track previous values ────────────────────────
  const prevMsg      = useRef(messagesCount);
  const prevCode     = useRef(codeGenerations);
  const prevDeploys  = useRef(deploysCount);
  const prevConcepts = useRef(conceptsLearned);
  const prevQuiz     = useRef(quizScore.correct);
  const prevLevel    = useRef(level);
  const isFirstRender = useRef(true);

  // ─── Detect changes and emit XP events ────────────────────
  useEffect(() => {
    // Skip on first mount — don't emit for existing session state
    if (isFirstRender.current) {
      isFirstRender.current = false;
      prevMsg.current      = messagesCount;
      prevCode.current     = codeGenerations;
      prevDeploys.current  = deploysCount;
      prevConcepts.current = conceptsLearned;
      prevQuiz.current     = quizScore.correct;
      prevLevel.current    = level;
      return;
    }

    const msgDelta      = messagesCount    - prevMsg.current;
    const codeDelta     = codeGenerations  - prevCode.current;
    const deployDelta   = deploysCount     - prevDeploys.current;
    const conceptDelta  = conceptsLearned  - prevConcepts.current;
    const quizDelta     = quizScore.correct - prevQuiz.current;

    if (msgDelta > 0)     emitXP(msgDelta     * XP_MESSAGE, 'Message');
    if (codeDelta > 0)    emitXP(codeDelta    * XP_CODE,    'Code generated');
    if (deployDelta > 0)  emitXP(deployDelta  * XP_DEPLOY,  'Deployed! 🚀');
    if (conceptDelta > 0) emitXP(conceptDelta * XP_CONCEPT, 'Concept');
    if (quizDelta > 0)    emitXP(quizDelta    * XP_QUIZ,    'Quiz correct');

    prevMsg.current      = messagesCount;
    prevCode.current     = codeGenerations;
    prevDeploys.current  = deploysCount;
    prevConcepts.current = conceptsLearned;
    prevQuiz.current     = quizScore.correct;
  }, [messagesCount, codeGenerations, deploysCount, conceptsLearned, quizScore.correct, emitXP]);

  // ─── Detect level-up ──────────────────────────────────────
  useEffect(() => {
    if (isFirstRender.current) return; // already guarded above
    if (level > prevLevel.current) {
      const newTitle = LEVEL_TITLES[level - 1] ?? 'Mythic';
      triggerLevelUp(prevLevel.current, level, newTitle);
    }
    prevLevel.current = level;
  }, [level, triggerLevelUp]);

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: 'rgba(4,0,14,0.55)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* XP Ribbon — always visible, never collapsible */}
      <XPRibbon totalXP={totalXP} showNext />

      {/* Divider */}
      <div className="h-px bg-white/[0.05] mx-3" />

      {/* Session stats row */}
      <SessionStatsBar
        messagesCount={messagesCount}
        codeGenerations={codeGenerations}
        deploysCount={deploysCount}
        sessionStartTime={sessionStartTime}
      />
    </div>
  );
}
