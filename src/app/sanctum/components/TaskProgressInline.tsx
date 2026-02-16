'use client';

import { motion } from 'framer-motion';

export type TaskStatus = 'pending' | 'working' | 'complete' | 'error';

export interface TaskStep {
  id: string;
  label: string;
  status: TaskStatus;
  progress?: number;
  detail?: string;
}

export interface CurrentTask {
  name: string;
  description?: string;
  steps: TaskStep[];
  startedAt?: number;
}

interface TaskProgressInlineProps {
  task: CurrentTask | null;
  isThinking?: boolean;
}

export function TaskProgressInline({ task, isThinking }: TaskProgressInlineProps) {
  // Nothing active - show ready state
  if (!task && !isThinking) {
    return (
      <div className="flex items-center gap-2 text-sm text-text-muted">
        <span className="text-lg">🔮</span>
        <span>Ready to sanctum</span>
      </div>
    );
  }

  // Thinking but no task yet
  if (!task && isThinking) {
    return (
      <div className="flex items-center gap-3">
        <motion.div
          className="w-4 h-4 rounded-full border-2 border-purple-500 border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        <span className="text-sm text-purple-400">Analyzing request...</span>
      </div>
    );
  }

  // Calculate progress
  const completedSteps = task!.steps.filter(s => s.status === 'complete').length;
  const totalSteps = task!.steps.length;
  const overallProgress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;
  const currentStep = task!.steps.find(s => s.status === 'working');

  return (
    <div className="flex items-center gap-2 sm:gap-4 flex-1 overflow-hidden">
      {/* Task name + progress */}
      <div className="flex items-center gap-2">
        <span className="text-lg">🔨</span>
        <span className="text-sm font-medium text-text-primary truncate max-w-[180px]">
          {task!.name}
        </span>
        <span className="text-xs font-mono text-near-green bg-near-green/10 px-1.5 py-0.5 rounded">
          {Math.round(overallProgress)}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="flex-1 max-w-[120px] sm:max-w-[200px] h-1.5 bg-void-black rounded-full overflow-hidden hidden sm:block">
        <motion.div
          className="h-full bg-gradient-to-r from-purple-500 to-near-green"
          initial={{ width: 0 }}
          animate={{ width: `${overallProgress}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>

      {/* Current step */}
      {currentStep && (
        <div className="hidden sm:flex items-center gap-2 text-xs text-text-muted">
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-purple-500"
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <span className="truncate max-w-[150px]">{currentStep.label}</span>
        </div>
      )}

      {/* Step indicators */}
      <div className="flex items-center gap-1">
        {task!.steps.map((step) => (
          <div
            key={step.id}
            className={`w-2 h-2 rounded-full transition-colors ${
              step.status === 'complete' ? 'bg-near-green' :
              step.status === 'working' ? 'bg-purple-500 animate-pulse' :
              step.status === 'error' ? 'bg-red-500' :
              'bg-void-gray'
            }`}
            title={step.label}
          />
        ))}
      </div>
    </div>
  );
}
