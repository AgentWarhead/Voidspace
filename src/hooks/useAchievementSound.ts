/* ─── useAchievementSound — Sound-Ready Achievement Hook ──────
 * Provides per-rarity sound slots for achievement unlocks.
 * Currently implemented with placeholder logic — swap in real
 * audio file paths when assets are ready.
 *
 * Usage:
 *   const { playAchievementSound } = useAchievementSound();
 *   playAchievementSound('legendary');   // plays legendary slot
 *   playAchievementSound(achievement);   // auto-resolves rarity
 * ────────────────────────────────────────────────────────────── */

'use client';

import { useCallback, useRef } from 'react';
import { type AchievementDef, type AchievementRarity } from '@/lib/achievements';

// ─── Sound Slot Config ────────────────────────────────────────
// Set the `src` path when audio files are available.
// Format: public directory relative path, e.g. '/sounds/common.mp3'

interface SoundSlot {
  src: string | null;    // null = placeholder (silent)
  volume: number;        // 0–1
  description: string;  // developer note
}

export const ACHIEVEMENT_SOUNDS: Record<AchievementRarity, SoundSlot> = {
  common: {
    src: null, // TODO: '/sounds/achievements/common.mp3'
    volume: 0.4,
    description: 'Subtle chime — soft notification',
  },
  uncommon: {
    src: null, // TODO: '/sounds/achievements/uncommon.mp3'
    volume: 0.5,
    description: 'Ascending tone with glow — satisfying pop',
  },
  rare: {
    src: null, // TODO: '/sounds/achievements/rare.mp3'
    volume: 0.6,
    description: 'Crystal ping with reverb — distinctly rewarding',
  },
  epic: {
    src: null, // TODO: '/sounds/achievements/epic.mp3'
    volume: 0.7,
    description: 'Power chord hit — cinematic reveal',
  },
  legendary: {
    src: null, // TODO: '/sounds/achievements/legendary.mp3'
    volume: 0.8,
    description: 'Full orchestral hit — dramatic golden fanfare',
  },
};

// ─── Hook ─────────────────────────────────────────────────────

export interface UseAchievementSoundReturn {
  /** Play the sound for a given rarity tier */
  playAchievementSound: (rarityOrAchievement: AchievementRarity | AchievementDef) => void;
  /** Preload a specific rarity tier's audio (call early to avoid latency) */
  preload: (rarity: AchievementRarity) => void;
  /** Check if a rarity tier has a real sound wired up */
  hasSoundFor: (rarity: AchievementRarity) => boolean;
}

export function useAchievementSound(): UseAchievementSoundReturn {
  // Cache AudioElement references so we don't create new ones each play
  const audioCache = useRef<Partial<Record<AchievementRarity, HTMLAudioElement>>>({});

  const getOrCreateAudio = useCallback(
    (rarity: AchievementRarity): HTMLAudioElement | null => {
      const slot = ACHIEVEMENT_SOUNDS[rarity];
      if (!slot.src) return null; // placeholder — no audio yet

      if (!audioCache.current[rarity]) {
        const audio = new Audio(slot.src);
        audio.volume = slot.volume;
        audio.preload = 'auto';
        audioCache.current[rarity] = audio;
      }
      return audioCache.current[rarity]!;
    },
    [],
  );

  const playAchievementSound = useCallback(
    (rarityOrAchievement: AchievementRarity | AchievementDef) => {
      const rarity: AchievementRarity =
        typeof rarityOrAchievement === 'string'
          ? rarityOrAchievement
          : rarityOrAchievement.rarity;

      try {
        const audio = getOrCreateAudio(rarity);
        if (!audio) {
          // Placeholder mode — log in dev so devs know the hook works
          if (process.env.NODE_ENV === 'development') {
            console.debug(
              `[AchievementSound] ${rarity} sound slot triggered (placeholder — no audio src yet).`,
              `Add src to ACHIEVEMENT_SOUNDS.${rarity} in useAchievementSound.ts`,
            );
          }
          return;
        }

        // Rewind if it's already playing (overlapping unlocks)
        audio.currentTime = 0;
        audio.play().catch(() => {
          // Browsers block autoplay without user gesture — silent fail
        });
      } catch {
        // Never throw — audio is enhancement only
      }
    },
    [getOrCreateAudio],
  );

  const preload = useCallback(
    (rarity: AchievementRarity) => {
      // Creating the audio element triggers preload='auto'
      getOrCreateAudio(rarity);
    },
    [getOrCreateAudio],
  );

  const hasSoundFor = useCallback((rarity: AchievementRarity): boolean => {
    return !!ACHIEVEMENT_SOUNDS[rarity].src;
  }, []);

  return { playAchievementSound, preload, hasSoundFor };
}
