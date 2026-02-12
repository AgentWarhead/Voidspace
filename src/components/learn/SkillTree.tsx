'use client';


import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { SectionHeader } from '@/components/effects/SectionHeader';

const SKILL_NODES = [
  // Row 1 - Foundation
  {
    id: 'near-basics',
    title: 'NEAR Basics',
    icon: '🌐',
    status: 'available',
    xp: 50,
    row: 0,
    description: 'Understand what NEAR is and why it matters',
  },
  {
    id: 'wallet-setup',
    title: 'Wallet Setup',
    icon: '👛',
    status: 'available',
    xp: 75,
    row: 0,
    description: 'Create wallet, get testnet tokens',
  },
  {
    id: 'first-tx',
    title: 'First Transaction',
    icon: '⚡',
    status: 'available',
    xp: 100,
    row: 0,
    description: 'Send your first on-chain transaction',
  },
  // Row 2 - Rust
  {
    id: 'rust-basics',
    title: 'Rust Fundamentals',
    icon: '🦀',
    status: 'locked',
    xp: 200,
    row: 1,
    description: 'Variables, ownership, structs, enums',
  },
  {
    id: 'smart-contracts',
    title: 'Smart Contracts 101',
    icon: '📜',
    status: 'locked',
    xp: 300,
    row: 1,
    description: 'Write and deploy your first contract',
  },
  // Row 3 - Building
  {
    id: 'build-token',
    title: 'Build a Token',
    icon: '🪙',
    status: 'locked',
    xp: 400,
    row: 2,
    description: 'Create NEP-141 fungible token',
  },
  {
    id: 'build-dapp',
    title: 'Build a dApp',
    icon: '🚀',
    status: 'locked',
    xp: 500,
    row: 2,
    description: 'Full-stack NEAR application',
  },
  // Row 4 - Mastery
  {
    id: 'fill-void',
    title: 'Fill a Void',
    icon: '🕳️',
    status: 'locked',
    xp: 750,
    row: 3,
    description: 'Ship a project that fills an ecosystem void',
  },
  {
    id: 'launch',
    title: 'Launch',
    icon: '🏆',
    status: 'locked',
    xp: 1000,
    row: 3,
    description: 'Deploy to mainnet, get users, apply for grants',
  },
];

const ACHIEVEMENTS = [
  { icon: '🌱', title: 'First Steps', description: 'Complete the Explorer track', xp: 100, rarity: 'COMMON', color: 'border-green-500/30 bg-green-500/5' },
  { icon: '🦀', title: 'Rustacean', description: 'Complete all Rust lessons', xp: 300, rarity: 'RARE', color: 'border-blue-500/30 bg-blue-500/5' },
  { icon: '⚡', title: 'Speed Builder', description: 'Deploy a contract in under 24 hours', xp: 500, rarity: 'EPIC', color: 'border-purple-500/30 bg-purple-500/5' },
  { icon: '🕳️', title: 'Void Filler', description: 'Ship a project that fills an ecosystem void', xp: 1000, rarity: 'LEGENDARY', color: 'border-amber-500/30 bg-amber-500/5' },
  { icon: '💰', title: 'Grant Winner', description: 'Receive a NEAR Foundation grant', xp: 2000, rarity: 'LEGENDARY', color: 'border-amber-500/30 bg-amber-500/5' },
  { icon: '🔥', title: 'On Fire', description: '7-day learning streak', xp: 150, rarity: 'RARE', color: 'border-blue-500/30 bg-blue-500/5' },
];

const RARITY_COLORS: Record<string, string> = {
  COMMON: 'text-green-400',
  RARE: 'text-blue-400',
  EPIC: 'text-purple-400',
  LEGENDARY: 'text-amber-400',
};

export function SkillTree() {
  const rows = [0, 1, 2, 3];

  return (
    <ScrollReveal>
      <SectionHeader title="Skill Tree" badge="PROGRESSION" />
      <p className="text-text-secondary mb-8 max-w-2xl">
        Every concept you master earns XP and unlocks the next stage. Track your journey from
        newcomer to NEAR builder with a visual skill tree.
      </p>

      {/* Skill Tree Visualization */}
      <div className="relative mb-12 p-6 rounded-2xl bg-surface/30 border border-border overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(0,236,151,0.03) 0%, transparent 70%)',
        }} />

        <div className="relative space-y-4">
          {rows.map((row) => {
            const nodes = SKILL_NODES.filter((n) => n.row === row);
            return (
              <div key={row} className="flex items-center justify-center gap-3 md:gap-4">
                {row > 0 && (
                  <div className="absolute left-1/2 -translate-x-1/2 w-px h-4 bg-near-green/20 -mt-4 hidden md:block" />
                )}
                {nodes.map((node) => (
                  <div
                    key={node.id}
                    className={`group relative flex flex-col items-center p-4 rounded-xl border transition-all cursor-default ${
                      node.status === 'available'
                        ? 'bg-surface border-near-green/30 hover:border-near-green/50 hover:-translate-y-1'
                        : node.status === 'completed'
                        ? 'bg-near-green/10 border-near-green/40'
                        : 'bg-surface/30 border-border/30 opacity-60'
                    }`}
                    style={{ minWidth: '120px', maxWidth: '160px' }}
                  >
                    {/* Node icon */}
                    <div className="text-2xl mb-2">{node.icon}</div>
                    <h4 className="text-xs font-semibold text-text-primary text-center leading-tight">{node.title}</h4>
                    <p className="text-[10px] text-text-muted text-center mt-1 leading-tight hidden sm:block">{node.description}</p>
                    
                    {/* XP badge */}
                    <div className={`mt-2 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      node.status === 'available' ? 'text-near-green bg-near-green/10' : 'text-text-muted bg-surface-hover'
                    }`}>
                      +{node.xp} XP
                    </div>

                    {/* Lock overlay */}
                    {node.status === 'locked' && (
                      <div className="absolute top-2 right-2">
                        <span className="text-[10px] text-text-muted">🔒</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        {/* Connection lines - decorative vertical */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-near-green/20 via-near-green/10 to-transparent pointer-events-none hidden md:block" />
      </div>

      {/* Achievements */}
      <h3 className="text-sm font-mono text-text-muted uppercase tracking-wider mb-4">Achievements to Unlock</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {ACHIEVEMENTS.map((achievement) => (
          <div
            key={achievement.title}
            className={`flex items-center gap-3 p-3 rounded-xl border ${achievement.color} transition-all hover:-translate-y-0.5`}
          >
            <div className="text-2xl shrink-0">{achievement.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold text-text-primary">{achievement.title}</h4>
                <span className={`text-[9px] font-mono font-bold uppercase tracking-wider ${RARITY_COLORS[achievement.rarity]}`}>
                  {achievement.rarity}
                </span>
              </div>
              <p className="text-[11px] text-text-muted truncate">{achievement.description}</p>
            </div>
            <div className="text-[11px] font-mono font-bold text-near-green shrink-0">+{achievement.xp} XP</div>
          </div>
        ))}
      </div>
    </ScrollReveal>
  );
}
