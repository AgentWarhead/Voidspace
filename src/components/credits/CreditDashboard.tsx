'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Zap, TrendingDown, ArrowRight, Clock, Wallet, Sparkles, Rocket, Activity, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { SANCTUM_TIERS, type SanctumTier } from '@/lib/sanctum-tiers';

interface CreditBalance {
  subscriptionCredits: number;
  topupCredits: number;
  totalCredits: number;
  lastReset: string | null;
}

interface CreditTransaction {
  id: string;
  amount: number;
  type: string;
  description: string | null;
  sessionId: string | null;
  tokensInput: number | null;
  tokensOutput: number | null;
  createdAt: string;
}

interface CreditDashboardProps {
  userId: string;
  tier?: string;
  className?: string;
  compact?: boolean;
}

export function CreditDashboard({ userId, tier = 'shade', className, compact = false }: CreditDashboardProps) {
  const [balance, setBalance] = useState<CreditBalance | null>(null);
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  const tierConfig = SANCTUM_TIERS[(tier as SanctumTier) || 'shade'] || SANCTUM_TIERS.shade;

  const fetchData = useCallback(async () => {
    try {
      const [balRes, txRes] = await Promise.all([
        fetch(`/api/credits/balance?userId=${userId}`),
        fetch(`/api/credits/transactions?userId=${userId}&limit=50`),
      ]);

      if (balRes.ok) {
        setBalance(await balRes.json());
      }
      if (txRes.ok) {
        const txData = await txRes.json();
        setTransactions(txData.transactions || []);
      }
    } catch (err) {
      console.error('Failed to fetch credit data:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Computed stats
  const stats = useMemo(() => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const usageTxs = transactions.filter(t => t.type === 'usage');
    const monthlyUsageTxs = usageTxs.filter(t => new Date(t.createdAt) >= monthStart);
    const todayUsageTxs = usageTxs.filter(t => new Date(t.createdAt) > dayAgo);

    // Count unique sessions this month
    const uniqueSessions = new Set(monthlyUsageTxs.map(t => t.sessionId).filter(Boolean));
    const sessionsThisMonth = uniqueSessions.size || monthlyUsageTxs.length;

    const totalMonthlyUsage = monthlyUsageTxs.reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const usedToday = todayUsageTxs.reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const avgPerSession = sessionsThisMonth > 0 ? totalMonthlyUsage / sessionsThisMonth : 0;

    return { usedToday, sessionsThisMonth, avgPerSession, totalMonthlyUsage };
  }, [transactions]);

  if (loading) {
    return (
      <div className={cn('animate-pulse space-y-4', className)}>
        <div className="h-32 bg-surface rounded-xl" />
        <div className="h-24 bg-surface rounded-xl" />
      </div>
    );
  }

  if (!balance) {
    return null;
  }

  const totalCredits = balance.totalCredits;
  const subPct = totalCredits > 0 ? (balance.subscriptionCredits / totalCredits) * 100 : 0;
  const topupPct = totalCredits > 0 ? (balance.topupCredits / totalCredits) * 100 : 0;

  if (compact) {
    return (
      <motion.div
        className={cn('flex items-center gap-3', className)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="flex items-center gap-2 px-3 py-1.5 bg-surface border border-border rounded-lg">
          <Zap className="w-4 h-4 text-near-green" />
          <span className="text-sm font-mono font-medium">
            ${totalCredits.toFixed(2)}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => (window.location.href = '/pricing')}
        >
          Top Up
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={cn('space-y-4', className)}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Tier Badge + Glowing Balance */}
      <Card variant="glass" padding="lg" className="relative overflow-hidden">
        {/* Tier glow background */}
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 30% 20%, ${tierConfig.color}, transparent 70%)`,
          }}
        />

        <div className="relative">
          {/* Tier badge */}
          <div className="flex items-center justify-between mb-4">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border"
              style={{
                color: tierConfig.color,
                borderColor: `${tierConfig.color}33`,
                backgroundColor: `${tierConfig.color}10`,
              }}
            >
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: tierConfig.color }} />
              {tierConfig.name}
            </div>
            <span className="text-xs text-text-muted italic">{tierConfig.tagline}</span>
          </div>

          {/* Big glowing balance */}
          <div className="text-center py-4">
            <p className="text-xs text-text-muted uppercase tracking-widest mb-2">Credit Balance</p>
            <motion.p
              className="text-5xl font-black font-mono"
              style={{
                color: tierConfig.color,
                textShadow: `0 0 30px ${tierConfig.glowColor}, 0 0 60px ${tierConfig.glowColor}`,
              }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, type: 'spring' }}
            >
              ${totalCredits.toFixed(2)}
            </motion.p>
          </div>

          {/* Credit bar — chunky */}
          <div className="h-4 bg-background/60 rounded-full overflow-hidden mb-3 flex border border-white/[0.05]">
            {subPct > 0 && (
              <motion.div
                className="h-full rounded-l-full"
                style={{ backgroundColor: tierConfig.color }}
                initial={{ width: 0 }}
                animate={{ width: `${subPct}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            )}
            {topupPct > 0 && (
              <motion.div
                className="h-full bg-accent-cyan"
                style={{ borderRadius: subPct === 0 ? '9999px 0 0 9999px' : undefined }}
                initial={{ width: 0 }}
                animate={{ width: `${topupPct}%` }}
                transition={{ duration: 1, delay: 0.15, ease: 'easeOut' }}
              />
            )}
          </div>

          <div className="flex items-center gap-4 text-xs text-text-muted">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: tierConfig.color }} />
              Subscription: ${balance.subscriptionCredits.toFixed(2)}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-accent-cyan" />
              Top-up: ${balance.topupCredits.toFixed(2)}
            </div>
          </div>
        </div>
      </Card>

      {/* Usage Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card variant="glass" padding="md" className="text-center">
          <TrendingDown className="w-4 h-4 mx-auto mb-1.5 text-text-muted" />
          <p className="text-lg font-bold font-mono">${stats.usedToday.toFixed(2)}</p>
          <p className="text-[10px] text-text-muted uppercase tracking-wider">Used Today</p>
        </Card>
        <Card variant="glass" padding="md" className="text-center">
          <Activity className="w-4 h-4 mx-auto mb-1.5 text-text-muted" />
          <p className="text-lg font-bold font-mono">{stats.sessionsThisMonth}</p>
          <p className="text-[10px] text-text-muted uppercase tracking-wider">Sessions/mo</p>
        </Card>
        <Card variant="glass" padding="md" className="text-center">
          <BarChart3 className="w-4 h-4 mx-auto mb-1.5 text-text-muted" />
          <p className="text-lg font-bold font-mono">${stats.avgPerSession.toFixed(2)}</p>
          <p className="text-[10px] text-text-muted uppercase tracking-wider">Avg/Session</p>
        </Card>
      </div>

      {/* Power-up Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="secondary"
          size="md"
          className="border-accent-cyan/30 hover:border-accent-cyan/60 hover:shadow-[0_0_20px_rgba(0,212,255,0.15)] transition-all group"
          onClick={() => (window.location.href = '/pricing#topup')}
        >
          <Zap className="w-4 h-4 text-accent-cyan group-hover:animate-pulse" />
          Recharge
        </Button>
        <Button
          variant="secondary"
          size="md"
          className="hover:shadow-[0_0_20px_rgba(0,236,151,0.15)] transition-all group"
          style={{ borderColor: `${tierConfig.color}30` }}
          onClick={() => (window.location.href = '/pricing')}
        >
          <Rocket className="w-4 h-4 group-hover:animate-bounce" style={{ color: tierConfig.color }} />
          Upgrade Plan
        </Button>
      </div>

      {/* Recent Transactions */}
      {transactions.length > 0 && (
        <Card variant="glass" padding="none">
          <div className="px-4 py-3 border-b border-white/[0.05]">
            <p className="text-sm font-medium text-text-secondary">Recent Activity</p>
          </div>
          <div className="divide-y divide-white/[0.03]">
            {transactions.slice(0, 5).map((tx) => (
              <div key={tx.id} className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                      tx.amount < 0
                        ? 'bg-error/10'
                        : tx.type === 'topup'
                          ? 'bg-accent-cyan/10'
                          : 'bg-near-green/10'
                    )}
                  >
                    {tx.amount < 0 ? (
                      <TrendingDown className="w-4 h-4 text-error" />
                    ) : (
                      <ArrowRight
                        className={cn(
                          'w-4 h-4',
                          tx.type === 'topup' ? 'text-accent-cyan' : 'text-near-green'
                        )}
                      />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm truncate">
                      {tx.description || tx.type}
                    </p>
                    <p className="text-xs text-text-muted">
                      {new Date(tx.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
                <span
                  className={cn(
                    'text-sm font-mono font-medium flex-shrink-0',
                    tx.amount < 0 ? 'text-error' : 'text-near-green'
                  )}
                >
                  {tx.amount < 0 ? '-' : '+'}${Math.abs(tx.amount).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </motion.div>
  );
}
