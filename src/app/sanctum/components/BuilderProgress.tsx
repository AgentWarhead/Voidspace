'use client';

import { useState } from 'react';
import { Zap, Rocket, Code2 } from 'lucide-react';

// Inline SVG icons for ones not exporting properly
const ChevronDown = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6"/>
  </svg>
);

const ChevronUp = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m18 15-6-6-6 6"/>
  </svg>
);

const Trophy = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
    <path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
  </svg>
);

const MessageSquare = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);

const Flame = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
  </svg>
);

interface BuilderProgressProps {
  messagesCount: number;
  codeGenerations: number;
  deploysCount: number;
  tokensUsed: number;
  unlockedAchievements: Set<string>;
  sessionMinutes?: number;
}

// Achievement definitions with icons and descriptions
const ACHIEVEMENT_DEFS = {
  first_message: { icon: '💬', name: 'First Words', desc: 'Sent your first message' },
  first_code: { icon: '📝', name: 'Code Conjurer', desc: 'Generated your first contract' },
  first_deploy: { icon: '🚀', name: 'Launcher', desc: 'Deployed your first contract' },
  chain_signatures: { icon: '🔗', name: 'Chain Master', desc: 'Explored Chain Signatures' },
  shade_agent: { icon: '🤖', name: 'Agent Smith', desc: 'Built an AI Agent' },
  ten_messages: { icon: '🗣️', name: 'Conversationalist', desc: 'Sent 10 messages' },
  three_deploys: { icon: '🎯', name: 'Serial Deployer', desc: 'Deployed 3 contracts' },
  speed_demon: { icon: '⚡', name: 'Speed Demon', desc: 'Deploy in under 5 minutes' },
};

// Calculate level from XP
function getLevel(xp: number): { level: number; currentXP: number; nextLevelXP: number; progress: number } {
  const levels = [0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500, 5500];
  let level = 1;
  for (let i = 1; i < levels.length; i++) {
    if (xp >= levels[i]) level = i + 1;
    else break;
  }
  const currentLevelXP = levels[level - 1] || 0;
  const nextLevelXP = levels[level] || levels[levels.length - 1] + 1000;
  const progress = ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
  return { level, currentXP: xp - currentLevelXP, nextLevelXP: nextLevelXP - currentLevelXP, progress };
}

// Calculate XP from actions
function calculateXP(messages: number, codeGens: number, deploys: number, achievements: number): number {
  return (messages * 10) + (codeGens * 50) + (deploys * 200) + (achievements * 100);
}

export function BuilderProgress({
  messagesCount,
  codeGenerations,
  deploysCount,
  tokensUsed,
  unlockedAchievements,
  sessionMinutes = 0,
}: BuilderProgressProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  
  const xp = calculateXP(messagesCount, codeGenerations, deploysCount, unlockedAchievements.size);
  const { level, currentXP, nextLevelXP, progress } = getLevel(xp);
  
  const achievementsList = Object.entries(ACHIEVEMENT_DEFS);
  const unlockedCount = unlockedAchievements.size;
  const totalAchievements = achievementsList.length;

  return (
    <div className="bg-void-gray/50 border border-border-subtle rounded-xl overflow-hidden">
      {/* Header - always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-near-green flex items-center justify-center text-lg font-bold text-white">
            {level}
          </div>
          <div className="text-left">
            <div className="text-sm font-semibold text-text-primary flex items-center gap-2">
              Builder Progress
              <span className="text-xs text-near-green">{xp} XP</span>
            </div>
            <div className="text-xs text-text-muted">
              {unlockedCount}/{totalAchievements} achievements
            </div>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-text-muted" />
        ) : (
          <ChevronDown className="w-4 h-4 text-text-muted" />
        )}
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4">
          {/* XP Progress Bar */}
          <div>
            <div className="flex justify-between text-xs text-text-muted mb-1">
              <span>Level {level}</span>
              <span>{currentXP}/{nextLevelXP} XP</span>
            </div>
            <div className="h-2 bg-void-black rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-near-green transition-all duration-500"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-void-black/50 rounded-lg p-2 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-purple-400" />
              <div>
                <div className="text-sm font-semibold text-text-primary">{messagesCount}</div>
                <div className="text-xs text-text-muted">Messages</div>
              </div>
            </div>
            <div className="bg-void-black/50 rounded-lg p-2 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-cyan-400" />
              <div>
                <div className="text-sm font-semibold text-text-primary">{codeGenerations}</div>
                <div className="text-xs text-text-muted">Contracts</div>
              </div>
            </div>
            <div className="bg-void-black/50 rounded-lg p-2 flex items-center gap-2">
              <Rocket className="w-4 h-4 text-near-green" />
              <div>
                <div className="text-sm font-semibold text-text-primary">{deploysCount}</div>
                <div className="text-xs text-text-muted">Deployed</div>
              </div>
            </div>
            <div className="bg-void-black/50 rounded-lg p-2 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <div>
                <div className="text-sm font-semibold text-text-primary">{(tokensUsed / 1000).toFixed(1)}k</div>
                <div className="text-xs text-text-muted">Tokens</div>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div>
            <div className="text-xs text-text-muted mb-2 flex items-center gap-1">
              <Trophy className="w-3 h-3" />
              Achievements
            </div>
            <div className="flex flex-wrap gap-1.5">
              {achievementsList.map(([id, def]) => {
                const unlocked = unlockedAchievements.has(id);
                return (
                  <div
                    key={id}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-all ${
                      unlocked
                        ? 'bg-gradient-to-br from-purple-500/20 to-near-green/20 border border-near-green/30'
                        : 'bg-void-black/50 border border-border-subtle opacity-40'
                    }`}
                    title={unlocked ? `${def.name}: ${def.desc}` : '???'}
                  >
                    {unlocked ? def.icon : '?'}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Session time */}
          {sessionMinutes > 0 && (
            <div className="text-xs text-text-muted flex items-center gap-1">
              <Flame className="w-3 h-3 text-orange-400" />
              Building for {sessionMinutes} min{sessionMinutes !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
