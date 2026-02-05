'use client';

import { motion, AnimatePresence } from 'framer-motion';

export type TaskStatus = 'pending' | 'working' | 'complete' | 'error';

export interface TaskStep {
  id: string;
  label: string;
  status: TaskStatus;
  progress?: number; // 0-100 for working status
  detail?: string;   // Optional detail text
}

export interface CurrentTask {
  name: string;
  description?: string;
  steps: TaskStep[];
  startedAt?: number;
}

interface TaskTrackerProps {
  task: CurrentTask | null;
  isThinking?: boolean;
}

const StatusIcon = ({ status, progress }: { status: TaskStatus; progress?: number }) => {
  switch (status) {
    case 'complete':
      return (
        <div className="w-5 h-5 rounded-full bg-near-green/20 border border-near-green flex items-center justify-center">
          <svg className="w-3 h-3 text-near-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      );
    case 'working':
      return (
        <div className="w-5 h-5 rounded-full bg-purple-500/20 border border-purple-500 flex items-center justify-center relative">
          <motion.div
            className="w-2 h-2 rounded-full bg-purple-500"
            animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          {progress !== undefined && (
            <svg className="absolute inset-0 w-5 h-5 -rotate-90">
              <circle
                cx="10"
                cy="10"
                r="8"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-purple-500/30"
              />
              <circle
                cx="10"
                cy="10"
                r="8"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray={`${(progress / 100) * 50.27} 50.27`}
                className="text-purple-500"
              />
            </svg>
          )}
        </div>
      );
    case 'error':
      return (
        <div className="w-5 h-5 rounded-full bg-red-500/20 border border-red-500 flex items-center justify-center">
          <svg className="w-3 h-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      );
    default:
      return (
        <div className="w-5 h-5 rounded-full bg-void-black border border-border-subtle flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-text-muted/50" />
        </div>
      );
  }
};

export function TaskTracker({ task, isThinking }: TaskTrackerProps) {
  if (!task && !isThinking) {
    return (
      <div className="px-4 py-6 text-center">
        <div className="text-4xl mb-2">🔮</div>
        <p className="text-sm text-text-muted">Ready to sanctum</p>
        <p className="text-xs text-text-muted/70 mt-1">
          Describe what you want to build
        </p>
      </div>
    );
  }

  // Thinking state without task
  if (!task && isThinking) {
    return (
      <div className="px-4 py-4">
        <div className="flex items-center gap-3 mb-3">
          <motion.div
            className="w-6 h-6 rounded-full bg-purple-500/20 border border-purple-500"
            animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <div>
            <div className="text-sm font-medium text-text-primary">Analyzing request...</div>
            <div className="text-xs text-text-muted">Understanding what you need</div>
          </div>
        </div>
      </div>
    );
  }

  const completedSteps = task!.steps.filter(s => s.status === 'complete').length;
  const totalSteps = task!.steps.length;
  const overallProgress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;
  const currentStep = task!.steps.find(s => s.status === 'working');

  return (
    <div className="px-4 py-3">
      {/* Task Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-lg">🔨</span>
            <h3 className="text-sm font-semibold text-text-primary">{task!.name}</h3>
          </div>
          {task!.description && (
            <p className="text-xs text-text-muted mt-0.5 ml-7">{task!.description}</p>
          )}
        </div>
        <div className="text-xs font-mono text-near-green bg-near-green/10 px-2 py-0.5 rounded">
          {Math.round(overallProgress)}%
        </div>
      </div>

      {/* Overall Progress Bar */}
      <div className="h-1.5 bg-void-black rounded-full overflow-hidden mb-4">
        <motion.div
          className="h-full bg-gradient-to-r from-purple-500 to-near-green"
          initial={{ width: 0 }}
          animate={{ width: `${overallProgress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      {/* Steps List */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {task!.steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-start gap-2 ${
                step.status === 'pending' ? 'opacity-50' : ''
              }`}
            >
              {/* Connector line */}
              <div className="flex flex-col items-center">
                <StatusIcon status={step.status} progress={step.progress} />
                {index < task!.steps.length - 1 && (
                  <div className={`w-px h-4 mt-1 ${
                    step.status === 'complete' ? 'bg-near-green/30' : 'bg-border-subtle'
                  }`} />
                )}
              </div>

              {/* Step content */}
              <div className="flex-1 pb-2">
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${
                    step.status === 'complete' ? 'text-text-secondary' :
                    step.status === 'working' ? 'text-text-primary font-medium' :
                    'text-text-muted'
                  }`}>
                    {step.label}
                  </span>
                  {step.status === 'working' && step.progress !== undefined && (
                    <span className="text-xs font-mono text-purple-400">
                      {step.progress}%
                    </span>
                  )}
                </div>
                {step.detail && step.status === 'working' && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-text-muted mt-0.5"
                  >
                    {step.detail}
                  </motion.p>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Current action highlight */}
      {currentStep && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 pt-3 border-t border-border-subtle"
        >
          <div className="flex items-center gap-2 text-xs">
            <motion.div
              className="w-2 h-2 rounded-full bg-purple-500"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <span className="text-purple-400">
              {currentStep.detail || `Working on: ${currentStep.label}`}
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
