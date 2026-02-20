'use client';

import { useState, useEffect, useCallback, useContext, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Sparkles } from 'lucide-react';
import { useAchievementContext } from '@/contexts/AchievementContext';
import { WalletContext } from '@/contexts/WalletContext';
import {
  STORAGE_KEY,
  loadProgress,
  saveProgress,
  TRACK_CONFIG,
  type TrackId,
} from '@/app/profile/skills/constellation-data';

/* ─── Constants ───────────────────────────────────────────── */

const COMPLETED_KEY = 'voidspace-completed-modules'; // fallback for anon
const TRACK_STAT: Record<TrackId, string> = {
  explorer: 'explorerModules',
  builder: 'builderModules',
  hacker: 'hackerModules',
  founder: 'founderModules',
};

/* ─── Confetti Particle ───────────────────────────────────── */

function ConfettiParticle({ index }: { index: number }) {
  const angle = (index / 12) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
  const distance = 60 + Math.random() * 80;
  const size = 4 + Math.random() * 6;
  const colors = ['#00EC97', '#00D4FF', '#C084FC', '#FB923C', '#FACC15'];
  const color = colors[index % colors.length];
  const rotation = Math.random() * 360;

  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        left: '50%',
        top: '50%',
      }}
      initial={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
      animate={{
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance - 20,
        opacity: 0,
        scale: 0.3,
        rotate: rotation,
      }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2 + Math.random() * 0.6, ease: 'easeOut' }}
    />
  );
}

/* ─── XP Counter ──────────────────────────────────────────── */

function XPCounter({ xp }: { xp: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let frame = 0;
    const totalFrames = 30;
    const step = () => {
      frame++;
      setCount(Math.round((frame / totalFrames) * xp));
      if (frame < totalFrames) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [xp]);

  return (
    <motion.div
      className="text-near-green font-bold text-lg"
      initial={{ y: 0, opacity: 0, scale: 0.5 }}
      animate={{ y: -40, opacity: 1, scale: 1 }}
      exit={{ y: -60, opacity: 0 }}
      transition={{ duration: 2, ease: 'easeOut' }}
    >
      +{count} XP
    </motion.div>
  );
}

/* ─── Main Component ──────────────────────────────────────── */

interface Props {
  moduleSlug: string;
  track: TrackId;
}

export function ModuleCompletionTracker({ moduleSlug, track }: Props) {
  const { trackStat, isConnected: achievementsConnected } = useAchievementContext();
  const { accountId, isConnected } = useContext(WalletContext);
  const [completed, setCompleted] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const [mounted, setMounted] = useState(false);

  const xp = TRACK_CONFIG[track]?.xpPerModule ?? 75;

  /* ── Check completion on mount ── */
  useEffect(() => {
    setMounted(true);

    // Check localStorage first (fast path for all users)
    const constellationProgress = loadProgress();
    if (constellationProgress.has(moduleSlug)) {
      setCompleted(true);
      return;
    }

    // Check anon fallback
    try {
      const anon = localStorage.getItem(COMPLETED_KEY);
      if (anon) {
        const set: string[] = JSON.parse(anon);
        if (set.includes(moduleSlug)) {
          setCompleted(true);
          return;
        }
      }
    } catch { /* silent */ }

    // If signed in, also check server (handles cross-device progress)
    if (accountId) {
      fetch(`/api/progress?moduleSlug=${encodeURIComponent(moduleSlug)}`)
        .then(r => r.ok ? r.json() : null)
        .then(data => {
          if (data?.completed) {
            setCompleted(true);
            // Also save to localStorage so it's fast next time
            const progress = loadProgress();
            progress.add(moduleSlug);
            saveProgress(progress);
          }
        })
        .catch(() => { /* offline — localStorage is source of truth */ });
    }
  }, [moduleSlug, accountId]);

  /* ── Merge anon progress when wallet connects ── */
  useEffect(() => {
    if (!isConnected || !accountId) return;
    try {
      const anon = localStorage.getItem(COMPLETED_KEY);
      if (!anon) return;
      const anonModules: string[] = JSON.parse(anon);
      if (anonModules.length === 0) return;

      // Merge into constellation progress
      const progress = loadProgress();
      let merged = false;
      for (const slug of anonModules) {
        if (!progress.has(slug)) {
          progress.add(slug);
          merged = true;
        }
      }
      if (merged) {
        saveProgress(progress);
        // Track stats for merged modules (best-effort)
        trackStat('modulesCompleted', anonModules.length);
      }
      // Clear anon storage after merge
      localStorage.removeItem(COMPLETED_KEY);
    } catch { /* silent */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, accountId]);

  /* ── Mark Complete Handler ── */
  const handleComplete = useCallback(async () => {
    if (completed) return;

    // 1. Update UI immediately — this must happen FIRST
    setCompleted(true);
    setCelebrating(true);
    setTimeout(() => setCelebrating(false), 3000);

    // 2. Persist to localStorage (Skill Constellation — works without wallet)
    const progress = loadProgress();
    progress.add(moduleSlug);
    saveProgress(progress);

    // 3. Persist to server if signed in
    if (accountId) {
      try {
        await fetch('/api/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ moduleSlug, track }),
        });
      } catch {
        // Offline — localStorage is the fallback
      }
    } else {
      // Save to anon fallback if no wallet
      try {
        const anon = localStorage.getItem(COMPLETED_KEY);
        const set: string[] = anon ? JSON.parse(anon) : [];
        if (!set.includes(moduleSlug)) set.push(moduleSlug);
        localStorage.setItem(COMPLETED_KEY, JSON.stringify(set));
      } catch { /* silent */ }
    }

    // 4. Track achievement stats (wallet-gated internally) — LAST, non-blocking
    const trackKey = TRACK_STAT[track];
    if (trackKey) {
      trackStat('modulesCompleted');
      trackStat(trackKey as any);
    }
  }, [completed, moduleSlug, track, accountId, isConnected, trackStat]);

  const confettiParticles = useMemo(
    () => Array.from({ length: 16 }, (_, i) => i),
    []
  );

  if (!mounted) return null;

  return (
    <div className="flex flex-col items-center gap-4 py-8">
      <div className="relative">
        {/* Confetti burst */}
        <AnimatePresence>
          {celebrating && confettiParticles.map(i => (
            <ConfettiParticle key={i} index={i} />
          ))}
        </AnimatePresence>

        {/* XP float */}
        <AnimatePresence>
          {celebrating && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <XPCounter xp={xp} />
            </div>
          )}
        </AnimatePresence>

        {/* Button */}
        <motion.button
          onClick={handleComplete}
          disabled={completed && !celebrating}
          className={`
            relative px-8 py-3 rounded-xl font-semibold text-sm
            border backdrop-blur-md transition-all duration-300
            ${completed
              ? 'bg-near-green/15 border-near-green/40 text-near-green cursor-default shadow-[0_0_20px_rgba(0,236,151,0.2)]'
              : 'bg-white/5 border-white/10 text-text-secondary hover:bg-near-green/10 hover:border-near-green/30 hover:text-near-green hover:shadow-[0_0_20px_rgba(0,236,151,0.15)] cursor-pointer'
            }
          `}
          whileHover={!completed ? { scale: 1.03 } : {}}
          whileTap={!completed ? { scale: 0.97 } : {}}
        >
          <span className="flex items-center gap-2">
            {completed ? (
              <>
                <CheckCircle className="w-5 h-5" />
                Completed ✓
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Mark Complete ✓
              </>
            )}
          </span>
        </motion.button>
      </div>

      {completed && !celebrating && (
        <motion.p
          className="text-xs text-text-muted"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          +{xp} XP earned
        </motion.p>
      )}
    </div>
  );
}
