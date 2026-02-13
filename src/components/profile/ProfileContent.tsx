'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { User, Search as SearchIcon, Filter, Bookmark, BarChart3, ArrowRight } from 'lucide-react';
import { Card, Button, VoidEmptyState } from '@/components/ui';
import { PageTransition } from '@/components/effects/PageTransition';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { SectionHeader } from '@/components/effects/SectionHeader';
import { GradientText } from '@/components/effects/GradientText';
import { BuilderProfileCard } from './BuilderProfileCard';
import { VoidMissionCard } from './VoidMissionCard';
import { QuickActionsBar } from './QuickActionsBar';
import { useWallet } from '@/hooks/useWallet';
import { useUser } from '@/hooks/useUser';
import type { TierName, SavedOpportunity, MissionStatus } from '@/types';

interface UsageStats {
  briefsThisMonth: number;
  previewsToday: number;
  savedCount: number;
}

type FilterStatus = 'all' | MissionStatus;

export function ProfileContent() {
  const { isConnected, accountId, openModal } = useWallet();
  const { user, isLoading } = useUser();
  const [usage, setUsage] = useState<UsageStats | null>(null);
  const [missions, setMissions] = useState<SavedOpportunity[]>([]);
  const [missionsLoading, setMissionsLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
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
      // Fetch usage
      fetch('/api/usage')
        .then((r) => r.json())
        .then(setUsage)
        .catch(() => {});

      // Fetch saved opportunities (missions)
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
          
          // Set focus to first "building" mission or most recent
          const buildingMission = savedMissions.find((m: SavedOpportunity) => m.status === 'building');
          if (buildingMission) {
            setFocusedMission(buildingMission.opportunity_id);
          }
        })
        .catch(() => {})
        .finally(() => setMissionsLoading(false));

      // Fetch wallet reputation if we have accountId
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

  // Update mission handler
  const handleMissionUpdate = useCallback(async (opportunityId: string, updates: Partial<SavedOpportunity>) => {
    // Optimistic update
    setMissions(prev => prev.map(m => 
      m.opportunity_id === opportunityId ? { ...m, ...updates } : m
    ));

    try {
      const res = await fetch('/api/saved', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ opportunityId, ...updates }),
      });

      if (!res.ok) {
        // Revert on error
        const data = await fetch('/api/saved').then(r => r.json());
        setMissions(data.saved || []);
      }
    } catch {
      // Revert on error
      const data = await fetch('/api/saved').then(r => r.json());
      setMissions(data.saved || []);
    }
  }, []);

  // Set focus handler
  const handleSetFocus = useCallback((opportunityId: string) => {
    setFocusedMission(opportunityId);
  }, []);

  // Filter missions
  const filteredMissions = missions.filter(m => 
    filterStatus === 'all' || m.status === filterStatus
  );

  // Sort: focused first, then by updated_at
  const sortedMissions = [...filteredMissions].sort((a, b) => {
    if (a.opportunity_id === focusedMission) return -1;
    if (b.opportunity_id === focusedMission) return 1;
    return new Date(b.updated_at || b.created_at).getTime() - new Date(a.updated_at || a.created_at).getTime();
  });

  // Calculate stats
  const stats = {
    voidsExplored: missions.length,
    briefsGenerated: usage?.briefsThisMonth || 0,
    building: missions.filter(m => m.status === 'building').length,
    shipped: missions.filter(m => m.status === 'shipped').length,
    sanctumSessions: 0, // TODO: track this
    totalTokensUsed: 0, // TODO: track this
  };

  // Find last building mission for quick actions
  const lastBuildingMission = missions.find(m => m.status === 'building');

  if (!isConnected) {
    return (
      <Card variant="glass" padding="lg">
        <VoidEmptyState
          icon={User}
          title="Enter the Void"
          description="Connect your NEAR wallet to access your Void Command — your personal builder headquarters."
          action={
            <Button 
              variant="primary" 
              size="lg" 
              onClick={openModal} 
              className="hover:shadow-[0_0_24px_rgba(0,236,151,0.4)]"
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
      <div className="space-y-6">
        <div className="h-64 bg-surface rounded-2xl animate-pulse" />
        <div className="h-16 bg-surface rounded-xl animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-80 bg-surface rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const tier = (user?.tier as TierName) || 'shade';

  return (
    <PageTransition className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <GradientText as="h1" className="text-3xl font-bold">
          Void Command
        </GradientText>
        <div className="text-sm text-text-muted font-mono">
          🐧 Your Builder HQ
        </div>
      </div>

      {/* Builder Profile Card */}
      <ScrollReveal>
        <BuilderProfileCard
          accountId={accountId || ''}
          tier={tier}
          joinedAt={user?.created_at || new Date().toISOString()}
          stats={stats}
          reputation={reputation}
          missions={missions}
        />
      </ScrollReveal>

      {/* Quick Actions */}
      <ScrollReveal delay={0.05}>
        <QuickActionsBar
          hasActiveMission={!!lastBuildingMission}
          lastSanctumVoid={lastBuildingMission?.opportunity_id}
          accountId={accountId || ''}
        />
      </ScrollReveal>

      {/* Skill Constellation Link */}
      <ScrollReveal delay={0.07}>
        <Link href="/profile/skills" className="block group" id="skills">
          <Card variant="glass" padding="lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-near-green/10 group-hover:bg-near-green/20 transition-colors">
                  <BarChart3 className="w-6 h-6 text-near-green" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text-primary group-hover:text-near-green transition-colors">
                    🌟 Skill Constellation
                  </h3>
                  <p className="text-sm text-text-muted mt-0.5">
                    View your learning progress across 71 modules, earn XP, and level up
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-text-muted group-hover:text-near-green group-hover:translate-x-1 transition-all" />
            </div>
          </Card>
        </Link>
      </ScrollReveal>

      {/* Missions Section */}
      <ScrollReveal delay={0.1}>
        <div className="flex items-center justify-between mb-4">
          <SectionHeader 
            title="Void Missions" 
            count={missions.length} 
            badge={stats.building > 0 ? `${stats.building} ACTIVE` : undefined}
          />
          
          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-text-muted" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
              className="bg-surface border border-border rounded-lg px-3 py-1.5 text-sm text-text-secondary focus:outline-none focus:border-near-green/50"
            >
              <option value="all">All Missions</option>
              <option value="saved">📑 Saved</option>
              <option value="researching">🔍 Researching</option>
              <option value="building">🔨 Building</option>
              <option value="shipped">🚀 Shipped</option>
              <option value="paused">⏸️ Paused</option>
            </select>
          </div>
        </div>

        {missionsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 bg-surface rounded-xl animate-pulse" />
            ))}
          </div>
        ) : sortedMissions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedMissions.map((mission) => (
              <VoidMissionCard
                key={mission.id}
                mission={mission}
                onUpdate={handleMissionUpdate}
                onSetFocus={handleSetFocus}
                isFocused={mission.opportunity_id === focusedMission}
              />
            ))}
          </div>
        ) : (
          <Card variant="glass" padding="lg">
            <VoidEmptyState
              icon={filterStatus === 'all' ? Bookmark : SearchIcon}
              title={filterStatus === 'all' ? "No saved opportunities yet" : `No ${filterStatus} missions`}
              description={filterStatus === 'all' 
                ? "Browse voids and save the ones that interest you"
                : "Change the filter to see other missions, or explore new voids."
              }
              actionLabel="Explore Voids"
              actionHref="/opportunities"
            />
          </Card>
        )}
      </ScrollReveal>

      {/* Footer Stats */}
      {missions.length > 0 && (
        <ScrollReveal delay={0.15}>
          <Card variant="glass" padding="md" className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-6">
              <span className="text-text-muted">
                Total Missions: <span className="text-text-primary font-mono">{missions.length}</span>
              </span>
              <span className="text-text-muted">
                Completion Rate: <span className="text-near-green font-mono">
                  {missions.length > 0 
                    ? Math.round((stats.shipped / missions.length) * 100) 
                    : 0}%
                </span>
              </span>
            </div>
            <Link 
              href="/opportunities" 
              className="text-near-green/70 hover:text-near-green transition-colors"
            >
              + Add Mission
            </Link>
          </Card>
        </ScrollReveal>
      )}
    </PageTransition>
  );
}
