/* ─── useAchievementSound — Synthesized Achievement Sounds ────
 * Uses Web Audio API to synthesize per-rarity sounds in-browser.
 * No audio files required — pure synthesis.
 *
 * Usage:
 *   const { playAchievementSound } = useAchievementSound();
 *   playAchievementSound('legendary');   // plays legendary synth fanfare
 *   playAchievementSound(achievement);   // auto-resolves rarity
 *
 * If browsers block autoplay (no user gesture yet), plays silently
 * and never throws — audio is enhancement only.
 * ────────────────────────────────────────────────────────────── */

'use client';

import { useCallback, useRef } from 'react';
import { type AchievementDef, type AchievementRarity } from '@/lib/achievements';

// ─── Note frequency constants ─────────────────────────────────
const NOTE = {
  C4:  261.63, D4:  293.66, E4:  329.63, F4:  349.23,
  G4:  392.00, A4:  440.00, B4:  493.88,
  C5:  523.25, D5:  587.33, E5:  659.25, F5:  698.46,
  G5:  783.99, A5:  880.00, B5:  987.77,
  C6: 1046.50, E6: 1318.51, G6: 1567.98,
};

// ─── Synthesis helpers ────────────────────────────────────────
interface NoteSpec {
  freq: number;
  type?: OscillatorType;
  startTime: number;   // seconds from ctx.currentTime
  duration: number;    // seconds
  gain: number;        // 0–1
  attackTime?: number; // seconds
  filterFreq?: number; // optional low-pass cutoff Hz
}

function scheduleNote(ctx: AudioContext, spec: NoteSpec, masterGain: number): void {
  const { freq, type = 'sine', startTime, duration, gain, attackTime = 0.01, filterFreq } = spec;
  const now = ctx.currentTime;
  const t0 = now + startTime;

  const osc     = ctx.createOscillator();
  const gainNode = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);

  // Attack → sustain → exponential release
  const peakGain = gain * masterGain;
  gainNode.gain.setValueAtTime(0, t0);
  gainNode.gain.linearRampToValueAtTime(peakGain, t0 + attackTime);
  gainNode.gain.setValueAtTime(peakGain, t0 + attackTime);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);

  if (filterFreq) {
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(filterFreq, t0);
    osc.connect(filter);
    filter.connect(gainNode);
  } else {
    osc.connect(gainNode);
  }

  gainNode.connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.05);
}

function playNotes(ctx: AudioContext, notes: NoteSpec[], masterGain = 0.5) {
  notes.forEach(note => scheduleNote(ctx, note, masterGain));
}

// ─── Per-Rarity Sound Synthesis ──────────────────────────────

/** Common: soft single-tone chime — subtle, unobtrusive */
function playCommon(ctx: AudioContext) {
  playNotes(ctx, [
    { freq: NOTE.A5, type: 'sine',     startTime: 0,    duration: 0.4, gain: 0.45, attackTime: 0.008 },
    { freq: NOTE.E6, type: 'sine',     startTime: 0,    duration: 0.25, gain: 0.15, attackTime: 0.01 },
  ], 0.4);
}

/** Uncommon: ascending two-note motif — pleasant "da-dum" */
function playUncommon(ctx: AudioContext) {
  playNotes(ctx, [
    { freq: NOTE.C5, type: 'sine',     startTime: 0,    duration: 0.3, gain: 0.45, attackTime: 0.01 },
    { freq: NOTE.E5, type: 'sine',     startTime: 0.15, duration: 0.4, gain: 0.55, attackTime: 0.01 },
    { freq: NOTE.G5, type: 'sine',     startTime: 0.15, duration: 0.3, gain: 0.25, attackTime: 0.02 },
  ], 0.48);
}

/** Rare: crystalline ping — sparkling, with harmonic overtones */
function playRare(ctx: AudioContext) {
  playNotes(ctx, [
    { freq: NOTE.C6,  type: 'sine',     startTime: 0,     duration: 0.7, gain: 0.55, attackTime: 0.004 },
    { freq: NOTE.G6,  type: 'sine',     startTime: 0,     duration: 0.45, gain: 0.22, attackTime: 0.005 },
    { freq: NOTE.E5,  type: 'triangle', startTime: 0.04,  duration: 0.55, gain: 0.35, attackTime: 0.01 },
    { freq: NOTE.G5,  type: 'triangle', startTime: 0.04,  duration: 0.45, gain: 0.25, attackTime: 0.01 },
    // Tinkle afterglow
    { freq: NOTE.C6,  type: 'sine',     startTime: 0.3,   duration: 0.5, gain: 0.18, attackTime: 0.02 },
  ], 0.55);
}

/** Epic: dramatic power chord — cinematic hit with bass presence */
function playEpic(ctx: AudioContext) {
  playNotes(ctx, [
    // Bass punch
    { freq: NOTE.C4,  type: 'sawtooth', startTime: 0,    duration: 0.9, gain: 0.38, attackTime: 0.015, filterFreq: 800 },
    { freq: NOTE.G4,  type: 'sawtooth', startTime: 0,    duration: 0.85, gain: 0.30, attackTime: 0.015, filterFreq: 1200 },
    // Main chord voicing
    { freq: NOTE.C5,  type: 'sawtooth', startTime: 0,    duration: 0.8, gain: 0.28, attackTime: 0.018 },
    { freq: NOTE.E5,  type: 'sawtooth', startTime: 0,    duration: 0.8, gain: 0.24, attackTime: 0.018 },
    { freq: NOTE.G5,  type: 'sawtooth', startTime: 0,    duration: 0.8, gain: 0.22, attackTime: 0.018 },
    // Sparkle high sine
    { freq: NOTE.C6,  type: 'sine',     startTime: 0.05, duration: 0.7, gain: 0.45, attackTime: 0.01 },
    // Trailing shimmer
    { freq: NOTE.G6,  type: 'sine',     startTime: 0.12, duration: 0.6, gain: 0.20, attackTime: 0.02 },
  ], 0.5);
}

/** Legendary: orchestral fanfare — ascending notes into full chord with shimmer */
function playLegendary(ctx: AudioContext) {
  playNotes(ctx, [
    // Rising fanfare: C5 → E5 → G5 → C6
    { freq: NOTE.C5,  type: 'sine',     startTime: 0,    duration: 0.35, gain: 0.60, attackTime: 0.01 },
    { freq: NOTE.E5,  type: 'sine',     startTime: 0.22, duration: 0.35, gain: 0.65, attackTime: 0.01 },
    { freq: NOTE.G5,  type: 'sine',     startTime: 0.40, duration: 0.38, gain: 0.70, attackTime: 0.01 },
    { freq: NOTE.C6,  type: 'sine',     startTime: 0.58, duration: 1.1,  gain: 0.80, attackTime: 0.015 },

    // Sustained bass foundation (enters with final note)
    { freq: NOTE.C4,  type: 'triangle', startTime: 0.55, duration: 1.4, gain: 0.35, attackTime: 0.06, filterFreq: 600 },
    { freq: NOTE.G4,  type: 'triangle', startTime: 0.55, duration: 1.4, gain: 0.28, attackTime: 0.06 },

    // Inner voices
    { freq: NOTE.E5,  type: 'triangle', startTime: 0.58, duration: 1.2, gain: 0.30, attackTime: 0.05 },
    { freq: NOTE.G5,  type: 'triangle', startTime: 0.58, duration: 1.2, gain: 0.25, attackTime: 0.05 },

    // High golden shimmer (the "sparkle")
    { freq: NOTE.E6,  type: 'sine',     startTime: 0.62, duration: 1.0, gain: 0.22, attackTime: 0.07 },
    { freq: NOTE.G6,  type: 'sine',     startTime: 0.70, duration: 0.85, gain: 0.15, attackTime: 0.08 },
  ], 0.52);
}

// ─── Sound dispatch table ─────────────────────────────────────
const SOUND_PLAYERS: Record<AchievementRarity, (ctx: AudioContext) => void> = {
  common:    playCommon,
  uncommon:  playUncommon,
  rare:      playRare,
  epic:      playEpic,
  legendary: playLegendary,
};

// ─── Hook ─────────────────────────────────────────────────────
export interface UseAchievementSoundReturn {
  /** Play the synthesized sound for a given rarity tier */
  playAchievementSound: (rarityOrAchievement: AchievementRarity | AchievementDef) => void;
  /** No-op for Web Audio (synthesis is instant, no preload needed) */
  preload: (rarity: AchievementRarity) => void;
  /** Whether sound is available (always true if Web Audio API exists) */
  hasSoundFor: (rarity: AchievementRarity) => boolean;
}

export function useAchievementSound(): UseAchievementSoundReturn {
  const audioCtxRef = useRef<AudioContext | null>(null);

  const getAudioCtx = useCallback((): AudioContext | null => {
    if (typeof window === 'undefined') return null;
    try {
      if (!audioCtxRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const AudioContextClass = window.AudioContext ?? (window as any).webkitAudioContext;
        if (!AudioContextClass) return null;
        audioCtxRef.current = new AudioContextClass();
      }
      // Resume if suspended (browser autoplay policy blocks audio until user gesture)
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume().catch(() => { /* silent */ });
      }
      return audioCtxRef.current;
    } catch {
      return null;
    }
  }, []);

  const playAchievementSound = useCallback(
    (rarityOrAchievement: AchievementRarity | AchievementDef) => {
      const rarity: AchievementRarity =
        typeof rarityOrAchievement === 'string'
          ? rarityOrAchievement
          : rarityOrAchievement.rarity;
      try {
        const ctx = getAudioCtx();
        if (!ctx) {
          if (process.env.NODE_ENV === 'development') {
            console.debug(`[AchievementSound] Web Audio unavailable — ${rarity} sound skipped`);
          }
          return;
        }
        SOUND_PLAYERS[rarity](ctx);
      } catch {
        // Never throw — audio is enhancement only
      }
    },
    [getAudioCtx],
  );

  // Web Audio API synthesis is instant — no preloading needed
  const preload = useCallback((_rarity: AchievementRarity) => {
    // Eagerly create the AudioContext to avoid first-play latency
    getAudioCtx();
  }, [getAudioCtx]);

  const hasSoundFor = useCallback((_rarity: AchievementRarity): boolean => {
    if (typeof window === 'undefined') return false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return !!(window.AudioContext ?? (window as any).webkitAudioContext);
  }, []);

  return { playAchievementSound, preload, hasSoundFor };
}
