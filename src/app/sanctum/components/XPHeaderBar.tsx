/* ─── XPHeaderBar — Compact XP display for the Sanctum header ──
 * Single-line component: level badge + animated progress bar +
 * XP text + mini session stats. Replaces the full BuilderProgress
 * ribbon below the chat panel.
 *
 * Also owns the XP event emission logic (detect changes → emitXP,
 * triggerLevelUp) so BuilderProgress is no longer needed in Sanctum.
 * ────────────────────────────────────────────────────────────── */

'use client';

import { useEffect, useRef, useState } from 'react';
import { useAchievementContext } from '@/contexts/AchievementContext';
import { useXPEvents } from '@/contexts/XPEventContext';
import { getByCategory } from '@/lib/achievements';
import { calculateActivityXP, getLevel, LEVEL_TITLES } from '@/lib/xp';

// ─── XP-per-action constants (must match calculateActivityXP) ─
const XP_MESSAGE  = 5;
const XP_CODE     = 25;
const XP_DEPLOY   = 100;
const XP_CONCEPT  = 15;
const XP_QUIZ     = 20;

/** Full XP calc: activity XP + sanctum achievement XP */
function calculateTotalXP(
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

// ─── Props ────────────────────────────────────────────────────

export interface XPHeaderBarProps {
  messagesCount: number;
  codeGenerations: number;
  deploysCount: number;
  tokensUsed: number;
  conceptsLearned: number;
  quizScore: { correct: number; total: number };
  sessionStartTime?: number | null;
}

// ─── Animated progress hook ───────────────────────────────────

function useAnimatedProgress(target: number) {
  const [display, setDisplay] = useState(target);
  const rafRef = useRef<number | null>(null);
  const prevTarget = useRef(target);

  useEffect(() => {
    const start = display;
    const diff = target - start;
    if (Math.abs(diff) < 0.1) return;

    prevTarget.current = target;
    let startTime: number | null = null;
    const duration = 600;

    function step(ts: number) {
      if (!startTime) startTime = ts;
      const elapsed = ts - startTime;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(start + diff * eased);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setDisplay(target);
      }
    }
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target]); // eslint-disable-line react-hooks/exhaustive-deps

  return Math.min(Math.max(display, 0), 100);
}

// ─── Component ────────────────────────────────────────────────

export function XPHeaderBar({
  messagesCount,
  codeGenerations,
  deploysCount,
  tokensUsed: _tokensUsed,
  conceptsLearned,
  quizScore,
  sessionStartTime = null,
}: XPHeaderBarProps) {
  const { unlocked } = useAchievementContext();
  const { emitXP, triggerLevelUp, pendingGains } = useXPEvents();

  const totalXP = calculateTotalXP(
    messagesCount,
    codeGenerations,
    deploysCount,
    unlocked,
    conceptsLearned,
    quizScore.correct,
  );

  const { level, currentXP, nextLevelXP, progress, title } = getLevel(totalXP);
  const displayProgress = useAnimatedProgress(progress);

  // ─── Refs to track previous values for XP emission ────────
  const prevMsg      = useRef(messagesCount);
  const prevCode     = useRef(codeGenerations);
  const prevDeploys  = useRef(deploysCount);
  const prevConcepts = useRef(conceptsLearned);
  const prevQuiz     = useRef(quizScore.correct);
  const prevLevel    = useRef(level);
  const isFirstRender = useRef(true);

  // ─── Detect changes and emit XP events ────────────────────
  useEffect(() => {
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

    const msgDelta      = messagesCount     - prevMsg.current;
    const codeDelta     = codeGenerations   - prevCode.current;
    const deployDelta   = deploysCount      - prevDeploys.current;
    const conceptDelta  = conceptsLearned   - prevConcepts.current;
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
    if (isFirstRender.current) return;
    if (level > prevLevel.current) {
      const newTitle = LEVEL_TITLES[level - 1] ?? 'Mythic';
      triggerLevelUp(prevLevel.current, level, newTitle);
    }
    prevLevel.current = level;
  }, [level, triggerLevelUp]);

  // ─── Glow pulse on XP gain ────────────────────────────────
  const [glowing, setGlowing] = useState(false);
  const glowTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (pendingGains.length === 0) return;
    setGlowing(true);
    if (glowTimer.current) clearTimeout(glowTimer.current);
    glowTimer.current = setTimeout(() => setGlowing(false), 1200);
    return () => {
      if (glowTimer.current) clearTimeout(glowTimer.current);
    };
  }, [pendingGains.length]);

  // ─── Session elapsed time ─────────────────────────────────
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (!sessionStartTime) return;
    const update = () => setElapsed(Date.now() - sessionStartTime);
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [sessionStartTime]);

  function formatDuration(ms: number) {
    const totalSec = Math.floor(ms / 1000);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    const pad = (n: number) => String(n).padStart(2, '0');
    if (h > 0) return `${h}:${pad(m)}:${pad(s)}`;
    return `${pad(m)}:${pad(s)}`;
  }

  const pct = displayProgress;

  return (
    <div
      className="flex items-center gap-2 px-2 py-1 rounded-lg transition-all duration-300"
      style={{
        background: glowing
          ? 'rgba(0,236,151,0.06)'
          : 'rgba(255,255,255,0.03)',
        border: `1px solid ${glowing ? 'rgba(0,236,151,0.25)' : 'rgba(255,255,255,0.06)'}`,
        boxShadow: glowing ? '0 0 12px rgba(0,236,151,0.15)' : 'none',
        transition: 'background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease',
      }}
    >
      {/* Level badge */}
      <div
        className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-void-black"
        style={{
          background: 'linear-gradient(135deg, #00EC97 0%, #7B61FF 100%)',
          boxShadow: glowing ? '0 0 10px rgba(0,236,151,0.6)' : '0 0 6px rgba(0,236,151,0.3)',
        }}
      >
        {level}
      </div>

      {/* Title — hidden on small screens */}
      <span className="hidden lg:block text-[10px] font-semibold text-white/60 flex-shrink-0 tracking-wide">
        {title}
      </span>

      {/* Progress bar + XP text */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {/* Bar */}
        <div
          className="h-1.5 rounded-full bg-white/[0.08] overflow-hidden"
          style={{ width: '120px' }}
        >
          <div
            className="h-full rounded-full relative overflow-hidden"
            style={{
              width: `${pct}%`,
              background: 'linear-gradient(90deg, #7B61FF 0%, #00EC97 100%)',
              boxShadow: glowing ? '0 0 8px rgba(0,236,151,0.7)' : '0 0 4px rgba(0,236,151,0.35)',
              transition: 'box-shadow 0.4s ease',
            }}
          >
            {/* Shimmer */}
            <div
              className="absolute inset-0 animate-shimmer"
              style={{
                background:
                  'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%)',
                backgroundSize: '200% 100%',
              }}
            />
          </div>
        </div>

        {/* XP numbers — hidden on small screens */}
        <span className="hidden xl:block text-[9px] font-mono text-white/35 flex-shrink-0">
          {currentXP}/{nextLevelXP}
        </span>
      </div>

      {/* Mini stats — hidden on mobile */}
      <div className="hidden md:flex items-center gap-2 flex-shrink-0 border-l border-white/[0.06] pl-2">
        {/* Messages */}
        <span className="flex items-center gap-0.5 text-[10px] font-mono">
          <span className="text-purple-400/70">💬</span>
          <span className="text-white/50">{messagesCount}</span>
        </span>
        {/* Code */}
        <span className="flex items-center gap-0.5 text-[10px] font-mono">
          <span className="text-cyan-400/70">⚡</span>
          <span className="text-white/50">{codeGenerations}</span>
        </span>
        {/* Deploys */}
        <span className="flex items-center gap-0.5 text-[10px] font-mono">
          <span className="text-near-green/70">🚀</span>
          <span className="text-white/50">{deploysCount}</span>
        </span>

        {/* Session timer — only if running */}
        {sessionStartTime !== null && elapsed > 0 && (
          <span className="hidden lg:block text-[9px] font-mono text-white/25 border-l border-white/[0.06] pl-2">
            {formatDuration(elapsed)}
          </span>
        )}
      </div>
    </div>
  );
}
