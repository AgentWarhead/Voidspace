'use client';

import { useState } from 'react';
import { Zap, Rocket, Code2 } from 'lucide-react';
import { useAchievementContext } from '@/contexts/AchievementContext';
import { ACHIEVEMENTS as GLOBAL_ACHIEVEMENTS, getByCategory } from '@/lib/achievements';

// Inline SVG icons
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

// Map global achievement IDs to display emojis (sanctum category subset)
const ACHIEVEMENT_ICONS: Record<string, string> = {
  hello_sanctum:      '💬',
  code_conjurer:      '📝',
  genesis_deploy:     '🚀',
  chain_master:       '🔗',
  agent_smith:        '🤖',
  speed_demon:        '⚡',
  concept_collector:  '📚',
  knowledge_hoarder:  '🧠',
  quiz_ace:           '🎯',
  security_minded:    '🛡️',
  contract_factory:   '🏭',
  curious_mind:       '❓',
  conversationalist:  '💬',
  test_runner:        '🧪',
  mainnet_pioneer:    '🌍',
  optimizer:          '⚙️',
  mass_production:    '🔨',
  assembly_line:      '⚙️',
  night_builder:      '🌙',
  marathon_session:   '⏰',
  council_awaits:     '👥',
  council_completionist: '🎭',
  defi_architect:     '💰',
  nft_creator:        '🎨',
  meme_lord:          '🪙',
  game_designer:      '🎮',
  intent_weaver:      '🔗',
  privacy_phantom:    '🔒',
  category_conqueror: '🏆',
};

export interface BuilderProgressProps {
  messagesCount: number;
  codeGenerations: number;
  deploysCount: number;
  tokensUsed: number;
  conceptsLearned: number;
  quizScore: { correct: number; total: number };
  sessionMinutes?: number;
}

// Calculate level from XP
function getLevel(xp: number): { level: number; currentXP: number; nextLevelXP: number; progress: number; title: string } {
  const levels = [0, 50, 150, 350, 600, 1000, 1500, 2200, 3000, 4000, 5500];
  const titles = ['Initiate', 'Apprentice', 'Coder', 'Builder', 'Architect', 'Engineer', 'Artisan', 'Master', 'Grandmaster', 'Legend', 'Mythic'];
  let level = 1;
  for (let i = 1; i < levels.length; i++) {
    if (xp >= levels[i]) level = i + 1;
    else break;
  }
  const currentLevelXP = levels[level - 1] || 0;
  const nextLevelXP = levels[level] || levels[levels.length - 1] + 1000;
  const progress = ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
  return { level, currentXP: xp - currentLevelXP, nextLevelXP: nextLevelXP - currentLevelXP, progress, title: titles[level - 1] || 'Mythic' };
}

// Calculate Sanctum session XP from activity (achievement XP handled by global context)
export function calculateTotalXP(
  messages: number,
  codeGens: number,
  deploys: number,
  unlockedSanctumAchievements: Set<string>,
  conceptsLearned: number,
  quizCorrect: number,
): number {
  // Activity XP
  const messageXP = messages * 5;          // 5 XP per message
  const codeXP = codeGens * 25;            // 25 XP per code generation
  const deployXP = deploys * 100;          // 100 XP per deploy
  const conceptXP = conceptsLearned * 15;  // 15 XP per concept learned
  const quizXP = quizCorrect * 20;         // 20 XP per correct quiz answer

  // Achievement XP from global registry (sanctum category only)
  const sanctumAchievements = getByCategory('sanctum');
  let achievementXP = 0;
  for (const ach of sanctumAchievements) {
    if (unlockedSanctumAchievements.has(ach.id)) achievementXP += ach.xp;
  }

  return messageXP + codeXP + deployXP + conceptXP + quizXP + achievementXP;
}

export function BuilderProgress({
  messagesCount,
  codeGenerations,
  deploysCount,
  tokensUsed,
  conceptsLearned,
  quizScore,
  sessionMinutes = 0,
}: BuilderProgressProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Use global achievement context instead of local prop
  const { unlocked: unlockedAchievements } = useAchievementContext();

  const xp = calculateTotalXP(messagesCount, codeGenerations, deploysCount, unlockedAchievements, conceptsLearned, quizScore.correct);
  const { level, currentXP, nextLevelXP, progress, title } = getLevel(xp);

  // Show only sanctum-category achievements in this widget
  const sanctumAchievements = getByCategory('sanctum');
  const unlockedCount = sanctumAchievements.filter(a => unlockedAchievements.has(a.id)).length;
  const totalAchievements = sanctumAchievements.length;

  return (
    <div className="bg-void-gray/50 border border-border-subtle rounded-xl overflow-hidden">
      {/* Header - always visible, compact */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-3 py-2.5 min-h-[44px] flex items-center justify-between hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-near-green flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-purple-500/20">
            {level}
          </div>
          <div className="text-left">
            <div className="text-xs font-semibold text-text-primary flex items-center gap-2">
              {title}
              <span className="text-[10px] font-mono text-near-green bg-near-green/10 px-1.5 py-0.5 rounded">{xp} XP</span>
            </div>
            {/* Mini progress bar */}
            <div className="w-24 h-1 bg-void-black rounded-full overflow-hidden mt-1">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-near-green transition-all duration-500"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-text-muted">{unlockedCount}/{totalAchievements}</span>
          {isExpanded ? (
            <ChevronUp className="w-3.5 h-3.5 text-text-muted" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-text-muted" />
          )}
        </div>
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="px-3 pb-3 space-y-3 border-t border-white/[0.05]">
          {/* XP Progress Bar — larger */}
          <div className="pt-2">
            <div className="flex justify-between text-[10px] text-text-muted mb-1">
              <span>Level {level} → {level + 1}</span>
              <span>{currentXP}/{nextLevelXP} XP</span>
            </div>
            <div className="h-2 bg-void-black rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-near-green transition-all duration-500"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>

          {/* Stats Grid — compact */}
          <div className="grid grid-cols-3 gap-1.5">
            <div className="bg-void-black/50 rounded-lg p-2 text-center">
              <MessageSquare className="w-3.5 h-3.5 text-purple-400 mx-auto mb-0.5" />
              <div className="text-sm font-semibold text-text-primary">{messagesCount}</div>
              <div className="text-[9px] text-text-muted">Messages</div>
            </div>
            <div className="bg-void-black/50 rounded-lg p-2 text-center">
              <Code2 className="w-3.5 h-3.5 text-cyan-400 mx-auto mb-0.5" />
              <div className="text-sm font-semibold text-text-primary">{codeGenerations}</div>
              <div className="text-[9px] text-text-muted">Contracts</div>
            </div>
            <div className="bg-void-black/50 rounded-lg p-2 text-center">
              <Rocket className="w-3.5 h-3.5 text-near-green mx-auto mb-0.5" />
              <div className="text-sm font-semibold text-text-primary">{deploysCount}</div>
              <div className="text-[9px] text-text-muted">Deployed</div>
            </div>
          </div>

          {/* Learn stats if any */}
          {(conceptsLearned > 0 || quizScore.total > 0) && (
            <div className="flex gap-3 text-xs text-text-muted">
              {conceptsLearned > 0 && (
                <span className="flex items-center gap-1">📚 {conceptsLearned} concepts</span>
              )}
              {quizScore.total > 0 && (
                <span className="flex items-center gap-1">🎯 {quizScore.correct}/{quizScore.total} quizzes</span>
              )}
            </div>
          )}

          {/* Achievements */}
          <div>
            <div className="text-[10px] text-text-muted mb-1.5 flex items-center gap-1">
              <Trophy className="w-3 h-3" />
              Achievements ({unlockedCount}/{totalAchievements})
            </div>
            <div className="flex flex-wrap gap-1">
              {sanctumAchievements.map((ach) => {
                const isUnlocked = unlockedAchievements.has(ach.id);
                const icon = ACHIEVEMENT_ICONS[ach.id] || ach.emoji || '⭐';
                return (
                  <div
                    key={ach.id}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-all ${
                      isUnlocked
                        ? 'bg-gradient-to-br from-purple-500/20 to-near-green/20 border border-near-green/30'
                        : 'bg-void-black/50 border border-border-subtle opacity-30 grayscale'
                    }`}
                    title={isUnlocked ? `${ach.name}: ${ach.description} (+${ach.xp} XP)` : '???'}
                  >
                    {isUnlocked ? icon : '?'}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Session time */}
          {sessionMinutes > 0 && (
            <div className="text-[10px] text-text-muted flex items-center gap-1">
              <Flame className="w-3 h-3 text-orange-400" />
              Building for {sessionMinutes} min{sessionMinutes !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
