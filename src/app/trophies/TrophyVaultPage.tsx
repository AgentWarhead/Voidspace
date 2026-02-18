/* ─── TrophyVaultPage — Client wrapper for the vault ─────────
 * Handles the page header/hero section and wraps the client
 * TrophyVault component. This is a server-compatible wrapper.
 * ─────────────────────────────────────────────────────────── */

'use client';

import { motion } from 'framer-motion';
import { Trophy, Sparkles } from 'lucide-react';
import { TrophyVault } from '@/components/trophies/TrophyVault';

export function TrophyVaultPage() {
  return (
    <div className="space-y-6">
      {/* Page header — Museum entrance */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="text-center pb-2"
      >
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div
            className="relative w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(0,212,255,0.1))',
              border: '1px solid rgba(245,158,11,0.3)',
              boxShadow: '0 0 40px rgba(245,158,11,0.2), 0 0 80px rgba(0,212,255,0.1)',
            }}
          >
            <Trophy className="w-8 h-8 text-amber-400" />
            {/* Sparkle accents */}
            <Sparkles
              className="absolute -top-1 -right-1 w-4 h-4 text-cyan-400 opacity-70"
              style={{ animation: 'pulse 2s ease-in-out infinite' }}
            />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">
          <span
            style={{
              background: 'linear-gradient(135deg, #f59e0b, #fcd34d, #00D4FF)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Trophy Vault
          </span>
        </h1>

        <p className="text-text-secondary text-sm sm:text-base max-w-lg mx-auto">
          Your museum of accomplishments. Every trophy is a chapter in your Void story.
        </p>

        {/* Decorative divider */}
        <div className="flex items-center gap-3 mt-5 max-w-xs mx-auto">
          <div
            className="flex-1 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.4))' }}
          />
          <span className="text-amber-500/50 text-xs">✦</span>
          <div
            className="flex-1 h-px"
            style={{ background: 'linear-gradient(90deg, rgba(0,212,255,0.4), transparent)' }}
          />
        </div>
      </motion.div>

      {/* The vault itself */}
      <TrophyVault />
    </div>
  );
}
