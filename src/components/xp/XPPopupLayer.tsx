/* ─── XPPopupLayer — Floating "+XP" Popups ────────────────────
 * Reads from XPEventContext and animates popups floating upward.
 * Size scales with XP amount. Void-branded: teal / purple glow.
 * ────────────────────────────────────────────────────────────── */

'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useXPEvents, type XPGain } from '@/contexts/XPEventContext';

// ─── Single popup ─────────────────────────────────────────────

function XPPopup({ gain, onDone }: { gain: XPGain; onDone: () => void }) {
  // Scale text & glow based on XP amount
  const isLarge = gain.amount >= 100;
  const isMed = gain.amount >= 25 && gain.amount < 100;

  const fontSize = isLarge ? 'text-2xl' : isMed ? 'text-lg' : 'text-sm';
  const color = isLarge
    ? 'text-[#00EC97]'
    : isMed
    ? 'text-[#a855f7]'
    : 'text-[#00EC97]/80';

  const glowColor = isLarge
    ? '0 0 20px rgba(0,236,151,0.7)'
    : isMed
    ? '0 0 14px rgba(168,85,247,0.6)'
    : '0 0 8px rgba(0,236,151,0.4)';

  // Slight random x drift for organic feel
  const drift = (Math.random() - 0.5) * 40;

  return (
    <motion.div
      initial={{ opacity: 0, y: 0, x: drift, scale: 0.7 }}
      animate={{ opacity: 1, y: -80, x: drift, scale: 1 }}
      exit={{ opacity: 0, y: -130, x: drift + (Math.random() - 0.5) * 20, scale: 0.8 }}
      transition={{
        duration: isLarge ? 2.2 : isMed ? 1.8 : 1.5,
        ease: [0.22, 1, 0.36, 1],
      }}
      onAnimationComplete={onDone}
      className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none select-none"
      style={{ whiteSpace: 'nowrap' }}
    >
      <span
        className={`font-bold font-mono ${fontSize} ${color}`}
        style={{ textShadow: glowColor }}
      >
        +{gain.amount} XP
      </span>
      {gain.label && (
        <span className="block text-center text-[9px] text-white/40 mt-0.5 tracking-wider uppercase">
          {gain.label}
        </span>
      )}
    </motion.div>
  );
}

// ─── Layer ────────────────────────────────────────────────────

export function XPPopupLayer() {
  const { pendingGains, dismissGain } = useXPEvents();

  if (pendingGains.length === 0) return null;

  return (
    // Positioned fixed at bottom-center, slightly above the XP ribbon area
    <div
      className="fixed pointer-events-none z-[45]"
      style={{ bottom: 120, left: '50%', transform: 'translateX(-50%)', width: 160, height: 0 }}
    >
      <AnimatePresence>
        {pendingGains.map(gain => (
          <XPPopup
            key={gain.id}
            gain={gain}
            onDone={() => dismissGain(gain.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
