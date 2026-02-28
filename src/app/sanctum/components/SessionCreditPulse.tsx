/* ─── SessionCreditPulse — Compact real-time credit indicator ──
 * Shows remaining credits vs monthly allocation as a colored pill
 * in the Sanctum header. Reduces subscription anxiety for paid users
 * by making credit burn visible at all times.
 *
 * Color coding:
 *   > 50% remaining  → near-green (healthy)
 *   20–50% remaining → amber (watch out)
 *   < 20% remaining  → red (running low)
 *
 * Updates every 30 seconds. Only renders when user is connected.
 * ────────────────────────────────────────────────────────────── */

'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// @ts-ignore
import { Zap, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import { useWallet } from '@/hooks/useWallet';
import { SANCTUM_TIERS, type SanctumTier } from '@/lib/sanctum-tiers';

// ─── Types ────────────────────────────────────────────────────

interface CreditBalance {
  subscriptionCredits: number;
  topupCredits: number;
  totalCredits: number;
  lastReset: string | null;
}

// ─── Helpers ─────────────────────────────────────────────────

function getStatusColor(pct: number): { bar: string; text: string; glow: string } {
  if (pct > 50) {
    return {
      bar: 'linear-gradient(90deg, #00b86e 0%, #00EC97 100%)',
      text: '#00EC97',
      glow: 'rgba(0,236,151,0.25)',
    };
  }
  if (pct > 20) {
    return {
      bar: 'linear-gradient(90deg, #d97706 0%, #fbbf24 100%)',
      text: '#fbbf24',
      glow: 'rgba(251,191,36,0.2)',
    };
  }
  return {
    bar: 'linear-gradient(90deg, #b91c1c 0%, #f87171 100%)',
    text: '#f87171',
    glow: 'rgba(248,113,113,0.2)',
  };
}

function formatCredits(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

// ─── Skeleton ─────────────────────────────────────────────────

function PulseSkeleton() {
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] animate-pulse">
      <div className="w-3 h-3 rounded-full bg-white/10" />
      <div className="w-14 h-2 rounded bg-white/10" />
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────

export function SessionCreditPulse() {
  const { isConnected } = useWallet();
  const { user } = useUser();
  const [balance, setBalance] = useState<CreditBalance | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const userId = user?.id ?? null;
  const tier = (user?.tier ?? 'shade') as SanctumTier;
  const tierConfig = SANCTUM_TIERS[tier] ?? SANCTUM_TIERS.shade;

  // Monthly allocation — shade has a one-time $2.50 grant (~250 credits at $0.01/credit)
  const monthlyAllocation =
    tier === 'shade' ? 250 : tierConfig.creditsPerMonth * 100; // tiers store in $ units

  const fetchBalance = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await fetch(`/api/credits/balance?userId=${userId}`);
      if (res.ok) {
        const data: CreditBalance = await res.json();
        setBalance(data);
      }
    } catch {
      // silently ignore — non-critical UI
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Initial fetch + 30s polling
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchBalance();
    intervalRef.current = setInterval(fetchBalance, 30_000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [userId, fetchBalance]);

  // Don't render if not connected or no user
  if (!isConnected || !userId) return null;
  if (loading) return <PulseSkeleton />;
  if (!balance) return null;

  const total = balance.totalCredits;
  const pct = monthlyAllocation > 0 ? Math.min(100, (total / monthlyAllocation) * 100) : 0;
  const colors = getStatusColor(pct);
  const isOut = total <= 0;

  return (
    <div className="relative">
      {/* Main pill */}
      <button
        onClick={() => setExpanded(prev => !prev)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all duration-200 hover:bg-white/[0.06]"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: `1px solid ${isOut ? 'rgba(248,113,113,0.3)' : 'rgba(255,255,255,0.07)'}`,
          boxShadow: isOut ? '0 0 8px rgba(248,113,113,0.15)' : 'none',
        }}
        title="Sanctum credits remaining"
      >
        {/* Icon */}
        <Zap
          className="w-3 h-3 flex-shrink-0"
          style={{ color: isOut ? '#f87171' : colors.text }}
        />

        {/* Credit amount */}
        <span
          className="text-[10px] font-mono font-semibold flex-shrink-0"
          style={{ color: isOut ? '#f87171' : colors.text }}
        >
          {isOut ? 'Out' : formatCredits(total)}
        </span>

        {/* Mini bar */}
        {!isOut && (
          <div className="w-[36px] h-1 rounded-full bg-white/[0.08] overflow-hidden flex-shrink-0">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${Math.max(2, pct)}%`,
                background: colors.bar,
                boxShadow: `0 0 4px ${colors.glow}`,
              }}
            />
          </div>
        )}

        {/* Chevron */}
        <span className="text-white/25 flex-shrink-0">
          {expanded
            ? <ChevronUp className="w-2.5 h-2.5" />
            : <ChevronDown className="w-2.5 h-2.5" />}
        </span>
      </button>

      {/* Expanded breakdown dropdown */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 top-full mt-2 z-50 min-w-[200px] rounded-xl border border-white/[0.08] overflow-hidden"
            style={{ background: '#0f0f0f', boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }}
          >
            {/* Header */}
            <div className="px-3 py-2 border-b border-white/[0.06] flex items-center gap-2">
              <Sparkles className="w-3 h-3 text-near-green" />
              <span className="text-[11px] font-semibold text-white/80 tracking-wide">
                {tierConfig.name} Credits
              </span>
            </div>

            {/* Rows */}
            <div className="px-3 py-2.5 space-y-2">
              {/* Full bar */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] text-white/40">Total remaining</span>
                  <span
                    className="text-[11px] font-mono font-bold"
                    style={{ color: colors.text }}
                  >
                    {total.toLocaleString()}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-white/[0.07] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${Math.max(2, pct)}%`,
                      background: colors.bar,
                    }}
                  />
                </div>
                <div className="flex justify-between mt-0.5">
                  <span className="text-[9px] font-mono text-white/20">0</span>
                  <span className="text-[9px] font-mono text-white/20">
                    {monthlyAllocation.toLocaleString()} alloc
                  </span>
                </div>
              </div>

              {/* Breakdown */}
              <div className="space-y-1 pt-1 border-t border-white/[0.05]">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-white/40">Subscription</span>
                  <span className="text-[10px] font-mono text-white/70">
                    {balance.subscriptionCredits.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-white/40">Top-up pack</span>
                  <span className="text-[10px] font-mono text-white/70">
                    {balance.topupCredits.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* CTA when low or out */}
              {(isOut || pct < 20) && (
                <a
                  href="/pricing"
                  className="block mt-1 w-full text-center text-[10px] font-semibold py-1.5 rounded-lg transition-colors"
                  style={{
                    background: isOut
                      ? 'rgba(248,113,113,0.15)'
                      : 'rgba(251,191,36,0.1)',
                    color: isOut ? '#f87171' : '#fbbf24',
                    border: `1px solid ${isOut ? 'rgba(248,113,113,0.2)' : 'rgba(251,191,36,0.15)'}`,
                  }}
                >
                  {isOut ? 'Recharge credits →' : 'Top up before you run out →'}
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
