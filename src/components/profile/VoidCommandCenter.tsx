/* ─── VoidCommandCenter — Left sidebar nav + main content panel
 * Replaces the vertical scroll layout with a command center.
 * Desktop: sidebar + content. Mobile: tab bar + content.
 * ────────────────────────────────────────────────────────────── */

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CommandNav, type CommandSection } from './CommandNav';
import { OverviewSection } from './sections/OverviewSection';
import { ArsenalSection } from './sections/ArsenalSection';
import { AchievementsSection } from './sections/AchievementsSection';
import { SkillsSection } from './sections/SkillsSection';
import { MissionsSection } from './sections/MissionsSection';
import { ActivitySection } from './sections/ActivitySection';
import { VaultSection } from './sections/VaultSection';
import type { TierName, SavedOpportunity } from '@/types';

interface WalletReputation {
  score: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  accountAge: string;
  transactionCount: number;
}

interface VoidCommandCenterProps {
  accountId: string;
  userId: string;
  tier: TierName;
  joinedAt: string;
  stats: {
    voidsExplored: number;
    briefsGenerated: number;
    building: number;
    shipped: number;
    sanctumSessions: number;
    totalTokensUsed: number;
  };
  reputation?: WalletReputation | null;
  missions: SavedOpportunity[];
  missionsLoading: boolean;
  focusedMission: string | null;
  onMissionUpdate: (opportunityId: string, updates: Partial<SavedOpportunity>) => Promise<void>;
  onSetFocus: (opportunityId: string) => void;
}

const sectionVariants = {
  initial: { opacity: 0, x: 12 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -12 },
};

export function VoidCommandCenter({
  accountId,
  userId,
  tier,
  joinedAt,
  stats,
  reputation,
  missions,
  missionsLoading,
  focusedMission,
  onMissionUpdate,
  onSetFocus,
}: VoidCommandCenterProps) {
  const [activeSection, setActiveSection] = useState<CommandSection>('overview');

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <OverviewSection
            accountId={accountId}
            tier={tier}
            joinedAt={joinedAt}
            stats={stats}
            reputation={reputation}
            missions={missions}
          />
        );
      case 'arsenal':
        return <ArsenalSection userId={userId} tier={tier} />;
      case 'achievements':
        return <AchievementsSection />;
      case 'skills':
        return <SkillsSection />;
      case 'missions':
        return (
          <MissionsSection
            missions={missions}
            focusedMission={focusedMission}
            missionsLoading={missionsLoading}
            buildingCount={stats.building}
            onUpdate={onMissionUpdate}
            onSetFocus={onSetFocus}
          />
        );
      case 'activity':
        return <ActivitySection stats={stats} />;
      case 'vault':
        return <VaultSection />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-0 md:gap-0 min-h-[400px] sm:min-h-[600px] bg-surface/30 rounded-xl sm:rounded-2xl border border-border/30 overflow-hidden overflow-x-hidden">
      {/* Sidebar / Tab Bar */}
      <CommandNav
        active={activeSection}
        onNavigate={setActiveSection}
        tier={tier}
        accountId={accountId}
        activeMissionCount={stats.building}
        stats={stats}
      />

      {/* Main Content Panel */}
      <main className="flex-1 min-w-0 p-3 sm:p-4 md:p-6 overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            variants={sectionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {renderSection()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
