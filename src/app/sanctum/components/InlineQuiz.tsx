'use client';

import { useState } from 'react';

export interface QuizData {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface InlineQuizProps {
  quiz: QuizData;
  onAnswer?: (correct: boolean) => void;
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

export function InlineQuiz({ quiz, onAnswer }: InlineQuizProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  const isAnswered = selectedIndex !== null;
  const isCorrect = selectedIndex === quiz.correctIndex;

  function handleSelect(index: number) {
    if (isAnswered) return;
    setSelectedIndex(index);

    const correct = index === quiz.correctIndex;
    if (correct) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 1500);
    }

    onAnswer?.(correct);
  }

  return (
    <div className="mt-3 rounded-xl border border-purple-500/20 bg-purple-500/5 backdrop-blur-sm p-4 relative overflow-hidden">
      {/* Celebration overlay */}
      {showCelebration && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="text-4xl animate-bounce">🎉</div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">🧠</span>
        <span className="text-sm font-medium text-purple-400">Quick Check</span>
      </div>

      {/* Question */}
      <p className="text-sm text-text-primary font-medium mb-3 leading-relaxed">
        {quiz.question}
      </p>

      {/* Options */}
      <div className="space-y-2">
        {quiz.options.map((option, idx) => {
          let buttonStyle = 'border-white/[0.08] bg-void-black/30 hover:bg-white/[0.05] text-text-secondary';

          if (isAnswered) {
            if (idx === quiz.correctIndex) {
              buttonStyle = 'border-green-500/50 bg-green-500/10 text-green-400';
            } else if (idx === selectedIndex && !isCorrect) {
              buttonStyle = 'border-red-500/50 bg-red-500/10 text-red-400';
            } else {
              buttonStyle = 'border-white/[0.05] bg-void-black/20 text-text-muted opacity-60';
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={isAnswered}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border text-sm text-left transition-all ${buttonStyle} disabled:cursor-default`}
            >
              <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs font-bold flex-shrink-0">
                {OPTION_LETTERS[idx]}
              </span>
              <span>{option}</span>
              {isAnswered && idx === quiz.correctIndex && (
                <span className="ml-auto text-green-400">✓</span>
              )}
              {isAnswered && idx === selectedIndex && !isCorrect && idx !== quiz.correctIndex && (
                <span className="ml-auto text-red-400">✗</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation (shown after answering) */}
      {isAnswered && (
        <div className={`mt-3 px-3 py-2 rounded-lg border text-sm leading-relaxed ${
          isCorrect
            ? 'border-green-500/20 bg-green-500/5 text-green-300'
            : 'border-red-500/20 bg-red-500/5 text-text-secondary'
        }`}>
          <span className="font-medium">{isCorrect ? '✅ Correct! ' : '❌ Not quite. '}</span>
          {quiz.explanation}
        </div>
      )}
    </div>
  );
}
