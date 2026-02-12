'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Zap, TrendingDown, ArrowRight, Clock, Wallet, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

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

export function CreditDashboard({ userId, tier = 'free', className, compact = false }: CreditDashboardProps) {
  const [balance, setBalance] = useState<CreditBalance | null>(null);
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [balRes, txRes] = await Promise.all([
        fetch(`/api/credits/balance?userId=${userId}`),
        fetch(`/api/credits/transactions?userId=${userId}&limit=10`),
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

  if (loading) {
    return (
      <div className={cn('animate-pulse space-y-4', className)}>
        <div className="h-24 bg-surface rounded-lg" />
        <div className="h-32 bg-surface rounded-lg" />
      </div>
    );
  }

  if (!balance) {
    return null;
  }

  const totalCredits = balance.totalCredits;
  const subPct = totalCredits > 0 ? (balance.subscriptionCredits / totalCredits) * 100 : 0;
  const topupPct = totalCredits > 0 ? (balance.topupCredits / totalCredits) * 100 : 0;

  // Usage in last 24h
  const recentUsage = transactions
    .filter((t) => {
      const txDate = new Date(t.createdAt);
      const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return t.type === 'usage' && txDate > dayAgo;
    })
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

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
      {/* Balance Card */}
      <Card variant="glass" padding="lg">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-text-muted text-sm mb-1">Credit Balance</p>
            <p className="text-3xl font-bold font-mono">${totalCredits.toFixed(2)}</p>
          </div>
          <div className="p-2 rounded-lg bg-near-green/10">
            <Wallet className="w-5 h-5 text-near-green" />
          </div>
        </div>

        {/* Credit bar */}
        <div className="h-3 bg-background rounded-full overflow-hidden mb-3 flex">
          {subPct > 0 && (
            <motion.div
              className="h-full bg-near-green rounded-l-full"
              initial={{ width: 0 }}
              animate={{ width: `${subPct}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          )}
          {topupPct > 0 && (
            <motion.div
              className="h-full bg-accent-cyan"
              style={{ borderRadius: subPct === 0 ? '9999px 0 0 9999px' : undefined }}
              initial={{ width: 0 }}
              animate={{ width: `${topupPct}%` }}
              transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
            />
          )}
        </div>

        <div className="flex items-center gap-4 text-xs text-text-muted">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-near-green" />
            Subscription: ${balance.subscriptionCredits.toFixed(2)}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-accent-cyan" />
            Top-up: ${balance.topupCredits.toFixed(2)}
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-white/5">
          <div className="flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-text-muted" />
            <div>
              <p className="text-xs text-text-muted">Used today</p>
              <p className="text-sm font-medium font-mono">${recentUsage.toFixed(2)}</p>
            </div>
          </div>
          {balance.lastReset && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-text-muted" />
              <div>
                <p className="text-xs text-text-muted">Last reset</p>
                <p className="text-sm font-medium">
                  {new Date(balance.lastReset).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="secondary"
          size="md"
          className="border-near-green/20"
          onClick={() => (window.location.href = '/pricing')}
        >
          <Sparkles className="w-4 h-4 text-near-green" />
          Upgrade
        </Button>
        <Button
          variant="secondary"
          size="md"
          className="border-accent-cyan/20"
          onClick={() => (window.location.href = '/pricing#topup')}
        >
          <Zap className="w-4 h-4 text-accent-cyan" />
          Top Up
        </Button>
      </div>

      {/* Recent Transactions */}
      {transactions.length > 0 && (
        <Card padding="none">
          <div className="px-4 py-3 border-b border-border">
            <p className="text-sm font-medium">Recent Activity</p>
          </div>
          <div className="divide-y divide-border/50">
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
