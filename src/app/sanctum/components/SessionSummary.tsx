'use client';

import { LearnedConcept } from './KnowledgeTracker';

export interface SessionStats {
  duration: number; // ms
  messages: number;
  contracts: number;
  concepts: LearnedConcept[];
  quizScore?: { correct: number; total: number };
  achievements?: string[];
}

interface SessionSummaryProps {
  stats: SessionStats;
  onClose: () => void;
  onContinue: () => void;
}

function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  if (minutes < 1) return 'Less than a minute';
  if (minutes === 1) return '1 minute';
  return `${minutes} minutes`;
}

const CTAs = [
  'Come back to explore Chain Signatures!',
  'Next time: try building a DAO with gasless meta-transactions!',
  'Ready to deploy to mainnet? See you soon!',
  'Your NEAR journey is just beginning — keep building!',
  'Try the Expert mode next time for maximum output!',
];

export function SessionSummary({ stats, onClose, onContinue }: SessionSummaryProps) {
  const cta = CTAs[Math.floor(Math.random() * CTAs.length)];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-void-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md mx-4 rounded-2xl border border-near-green/20 bg-void-gray/95 backdrop-blur-xl shadow-2xl shadow-near-green/10 overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-4 sm:px-6 pt-6 pb-4 text-center">
          <div className="text-4xl mb-3">🎓</div>
          <h2 className="text-lg sm:text-xl font-bold text-text-primary">Session Complete!</h2>
          <p className="text-sm text-text-muted mt-1">Here&apos;s what you accomplished</p>
        </div>

        {/* Stats grid */}
        <div className="px-4 sm:px-6 grid grid-cols-3 gap-2 sm:gap-3 mb-4">
          <div className="text-center p-2 sm:p-3 rounded-lg bg-void-black/30 border border-white/[0.05]">
            <div className="text-sm sm:text-lg font-bold text-near-green">{formatDuration(stats.duration)}</div>
            <div className="text-[10px] text-text-muted uppercase tracking-wider mt-0.5">Duration</div>
          </div>
          <div className="text-center p-2 sm:p-3 rounded-lg bg-void-black/30 border border-white/[0.05]">
            <div className="text-sm sm:text-lg font-bold text-cyan-400">{stats.messages}</div>
            <div className="text-[10px] text-text-muted uppercase tracking-wider mt-0.5">Messages</div>
          </div>
          <div className="text-center p-2 sm:p-3 rounded-lg bg-void-black/30 border border-white/[0.05]">
            <div className="text-sm sm:text-lg font-bold text-purple-400">{stats.contracts}</div>
            <div className="text-[10px] text-text-muted uppercase tracking-wider mt-0.5">Contracts</div>
          </div>
        </div>

        {/* Concepts learned */}
        {stats.concepts.length > 0 && (
          <div className="px-6 mb-4">
            <h3 className="text-sm font-medium text-text-secondary mb-2 flex items-center gap-2">
              <span>🧠</span> Concepts Learned ({stats.concepts.length})
            </h3>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {stats.concepts.map((concept, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <span className="text-near-green">✓</span>
                  <span className="text-text-secondary">{concept.title}</span>
                  <span className="text-xs text-text-muted ml-auto">{concept.category}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quiz score */}
        {stats.quizScore && stats.quizScore.total > 0 && (
          <div className="px-6 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <span>🎯</span>
              <span className="text-text-secondary">
                Quiz Score: <span className="text-near-green font-bold">{stats.quizScore.correct}/{stats.quizScore.total}</span>
                {stats.quizScore.correct === stats.quizScore.total && ' — Perfect! 🌟'}
              </span>
            </div>
          </div>
        )}

        {/* Achievements */}
        {stats.achievements && stats.achievements.length > 0 && (
          <div className="px-6 mb-4">
            <h3 className="text-sm font-medium text-text-secondary mb-2 flex items-center gap-2">
              <span>🏆</span> Achievements Unlocked
            </h3>
            <div className="flex flex-wrap gap-2">
              {stats.achievements.map((ach, i) => (
                <span key={i} className="px-2 py-1 text-xs rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  {ach}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="px-6 py-2">
          <p className="text-sm text-text-muted text-center italic">{cta}</p>
        </div>

        {/* Actions */}
        <div className="px-4 sm:px-6 pb-6 pt-4 flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 min-h-[44px] rounded-lg border border-white/[0.1] bg-void-black/30 text-text-secondary hover:bg-white/[0.05] transition-all text-sm font-medium"
          >
            Back to Home
          </button>
          <button
            onClick={onContinue}
            className="flex-1 px-4 py-2.5 min-h-[44px] rounded-lg bg-near-green/20 text-near-green border border-near-green/30 hover:bg-near-green/30 transition-all text-sm font-medium"
          >
            Keep Building →
          </button>
        </div>
      </div>
    </div>
  );
}
