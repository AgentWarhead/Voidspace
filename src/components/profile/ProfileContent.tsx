'use client';

import { useEffect, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { User } from 'lucide-react';

const XPRibbonProfile = dynamic(
  () => import('@/components/xp/XPRibbonProfile').then(m => ({ default: m.XPRibbonProfile })),
  { ssr: false },
);
import { Card, Button, VoidEmptyState } from '@/components/ui';
import { PageTransition } from '@/components/effects/PageTransition';
import { GradientText } from '@/components/effects/GradientText';
import { VoidCommandCenter } from './VoidCommandCenter';
import { useWallet } from '@/hooks/useWallet';
import { useUser } from '@/hooks/useUser';
import type { TierName, SavedOpportunity } from '@/types';

interface UsageStats {
  briefsThisMonth: number;
  previewsToday: number;
  savedCount: number;
}

export function ProfileContent() {
  const { isConnected, accountId, openModal } = useWallet();
  const { user, isLoading } = useUser();
  const [usage, setUsage] = useState<UsageStats | null>(null);
  const [missions, setMissions] = useState<SavedOpportunity[]>([]);
  const [missionsLoading, setMissionsLoading] = useState(false);
  const [focusedMission, setFocusedMission] = useState<string | null>(null);
  const [reputation, setReputation] = useState<{
    score: number;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    accountAge: string;
    transactionCount: number;
  } | null>(null);

  // Fetch data
  useEffect(() => {
    if (user?.id) {
      fetch('/api/usage')
        .then((r) => r.json())
        .then(setUsage)
        .catch(() => {});

      setMissionsLoading(true);
      fetch('/api/saved')
        .then((r) => r.json())
        .then((data) => {
          const savedMissions = (data.saved || []).map((m: SavedOpportunity) => ({
            ...m,
            health: m.health || 'green',
            progress: m.progress || 0,
          }));
          setMissions(savedMissions);

          const buildingMission = savedMissions.find(
            (m: SavedOpportunity) => m.status === 'building',
          );
          if (buildingMission) {
            setFocusedMission(buildingMission.opportunity_id);
          }
        })
        .catch(() => {})
        .finally(() => setMissionsLoading(false));

      if (accountId) {
        fetch('/api/void-lens', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address: accountId }),
        })
          .then((r) => r.json())
          .then((data) => {
            if (data.analysis) {
              setReputation({
                score: data.analysis.score,
                riskLevel: data.analysis.riskLevel,
                accountAge: data.walletData?.stats?.first_transaction || '',
                transactionCount: data.walletData?.stats?.total_transactions || 0,
              });
            }
          })
          .catch(() => {});
      }
    }
  }, [user?.id, accountId]);

  const handleMissionUpdate = useCallback(
    async (opportunityId: string, updates: Partial<SavedOpportunity>) => {
      setMissions((prev) =>
        prev.map((m) => (m.opportunity_id === opportunityId ? { ...m, ...updates } : m)),
      );
      try {
        const res = await fetch('/api/saved', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ opportunityId, ...updates }),
        });
        if (!res.ok) {
          const data = await fetch('/api/saved').then((r) => r.json());
          setMissions(data.saved || []);
        }
      } catch {
        const data = await fetch('/api/saved').then((r) => r.json());
        setMissions(data.saved || []);
      }
    },
    [],
  );

  const handleSetFocus = useCallback((opportunityId: string) => {
    setFocusedMission(opportunityId);
  }, []);

  const stats = {
    voidsExplored: missions.length,
    briefsGenerated: usage?.briefsThisMonth || 0,
    building: missions.filter((m) => m.status === 'building').length,
    shipped: missions.filter((m) => m.status === 'shipped').length,
    sanctumSessions: 0,
    totalTokensUsed: 0,
  };

  if (!isConnected) {
    return (
      <Card variant="glass" padding="lg" className="mx-auto">
        <VoidEmptyState
          icon={User}
          title="Enter the Void"
          description="Connect your NEAR wallet to access your Void Command — your personal builder headquarters."
          action={
            <Button
              variant="primary"
              size="lg"
              onClick={openModal}
              className="hover:shadow-[0_0_24px_rgba(0,236,151,0.4)] min-h-[44px] min-w-[44px] active:scale-[0.97]"
            >
              Connect Wallet
            </Button>
          }
        />
      </Card>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="h-48 sm:h-64 bg-surface rounded-2xl animate-pulse" />
        <div className="h-12 sm:h-16 bg-surface rounded-xl animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 sm:h-80 bg-surface rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const tier = (user?.tier as TierName) || 'shade';

  return (
    <PageTransition className="space-y-4 sm:space-y-6 overflow-x-hidden">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <GradientText as="h1" className="text-2xl sm:text-3xl font-bold">
          Void Command
        </GradientText>
        <div className="text-xs sm:text-sm text-text-muted font-mono flex-shrink-0">🐧 Your Builder HQ</div>
      </div>

      {/* XP Ribbon */}
      <XPRibbonProfile className="w-full" />

      {/* Command Center */}
      <VoidCommandCenter
        accountId={accountId || ''}
        userId={user?.id || ''}
        tier={tier}
        joinedAt={user?.created_at || new Date().toISOString()}
        stats={stats}
        reputation={reputation}
        missions={missions}
        missionsLoading={missionsLoading}
        focusedMission={focusedMission}
        onMissionUpdate={handleMissionUpdate}
        onSetFocus={handleSetFocus}
      />
    </PageTransition>
  );
}
