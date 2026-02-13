'use client';

import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import {
  skillNodes, TRACK_CONFIG, getPrerequisiteChain, getUnlocksNext,
  CheckCircle, Lock, Zap, Target, X, ArrowRight,
  type SkillNode, type NodeStatus,
} from './constellation-data';

/* ─── Side Panel ───────────────────────────────────────────── */

interface SidePanelProps {
  nodeId: string | null;
  getStatus: (id: string) => NodeStatus;
  onClose: () => void;
  onToggleComplete: (id: string) => void;
}

export function ConstellationSidePanel({ nodeId, getStatus, onClose, onToggleComplete }: SidePanelProps) {
  const node = nodeId ? skillNodes.find(n => n.id === nodeId) : null;
  const status = node ? getStatus(node.id) : 'locked';

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const prereqs = node ? getPrerequisiteChain(node.id) : [];
  const unlocks = node ? getUnlocksNext(node.id) : [];

  return (
    <AnimatePresence mode="wait">
      {node && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="fixed right-0 top-0 bottom-0 z-50 w-[380px] max-w-[90vw] bg-background/95 backdrop-blur-xl border-l border-border/50 overflow-y-auto"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
          >
            <SidePanelContent
              node={node}
              status={status}
              prereqs={prereqs}
              unlocks={unlocks}
              getStatus={getStatus}
              onClose={onClose}
              onToggleComplete={onToggleComplete}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ─── Panel Content ────────────────────────────────────────── */

function SidePanelContent({
  node, status, prereqs, unlocks, getStatus, onClose, onToggleComplete,
}: {
  node: SkillNode;
  status: NodeStatus;
  prereqs: SkillNode[];
  unlocks: SkillNode[];
  getStatus: (id: string) => NodeStatus;
  onClose: () => void;
  onToggleComplete: (id: string) => void;
}) {
  const track = TRACK_CONFIG[node.track];

  return (
    <div className="p-6 space-y-6">
      {/* Top accent */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-near-green/60 to-transparent" />

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-surface hover:bg-surface-hover border border-border flex items-center justify-center z-10"
      >
        <X className="w-4 h-4 text-text-muted" />
      </button>

      {/* Header */}
      <div className="flex items-start gap-4 pt-2">
        <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center border-2', track.bg, track.border)}>
          <node.icon className={cn('w-6 h-6', track.color)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h2 className="text-lg font-bold text-text-primary">{node.label}</h2>
            <span className={cn('text-[9px] font-mono font-bold uppercase tracking-[0.15em] px-2 py-0.5 rounded-full border', track.bg, track.color, track.border)}>
              {track.label}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-text-muted">
            <span className="font-mono text-near-green">{node.xp} XP</span>
            <span>•</span>
            <span>{node.estimatedTime}</span>
            <span>•</span>
            <span className="capitalize">{node.tier}</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-text-secondary leading-relaxed">{node.description}</p>

      {/* Details */}
      <div className="space-y-2">
        <h3 className="text-xs font-mono text-text-muted uppercase tracking-widest">What You&apos;ll Learn</h3>
        <div className="grid grid-cols-1 gap-1.5">
          {node.details.map((d, i) => (
            <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-surface/50">
              <div className={cn('w-1.5 h-1.5 rounded-full shrink-0', status === 'completed' ? 'bg-near-green' : 'bg-border')} />
              <span className="text-xs text-text-secondary">{d}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Prerequisites chain */}
      {prereqs.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-mono text-text-muted uppercase tracking-widest">Prerequisites</h3>
          <div className="flex flex-wrap gap-2">
            {prereqs.map(p => {
              const ps = getStatus(p.id);
              const pt = TRACK_CONFIG[p.track];
              return (
                <div key={p.id} className={cn('flex items-center gap-1.5 px-2 py-1 rounded-lg border text-xs', ps === 'completed' ? 'border-near-green/30 bg-near-green/5 text-near-green' : `${pt.border} ${pt.bg} ${pt.color}`)}>
                  {ps === 'completed' ? <CheckCircle className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                  {p.label}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Unlocks next */}
      {unlocks.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-mono text-text-muted uppercase tracking-widest">Unlocks Next</h3>
          <div className="flex flex-wrap gap-2">
            {unlocks.map(u => {
              const ut = TRACK_CONFIG[u.track];
              return (
                <div key={u.id} className={cn('flex items-center gap-1.5 px-2 py-1 rounded-lg border text-xs', ut.border, ut.bg, ut.color)}>
                  <ArrowRight className="w-3 h-3" />
                  {u.label}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Rewards */}
      {node.rewards.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-mono text-text-muted uppercase tracking-widest">Rewards</h3>
          <div className="flex flex-wrap gap-2">
            {node.rewards.map((r, i) => (
              <div key={i} className="flex items-center gap-1.5 px-2 py-1 rounded-lg border border-near-green/20 bg-near-green/5 text-xs text-near-green">
                🏆 {r}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3 pt-2">
        {status === 'available' && (
          <Link href={node.link || '/sanctum'} className="flex-1">
            <Button variant="primary" size="sm" className="w-full">
              Start Learning <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </Link>
        )}
        {status === 'completed' && (
          <Link href={node.link || '/sanctum'} className="flex-1">
            <Button variant="secondary" size="sm" className="w-full">Review Module</Button>
          </Link>
        )}
        {status !== 'locked' && (
          <button
            onClick={() => onToggleComplete(node.id)}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2 rounded-lg border text-xs font-medium transition-all',
              status === 'completed'
                ? 'border-near-green/30 bg-near-green/10 text-near-green'
                : 'border-border bg-surface hover:bg-surface-hover text-text-muted',
            )}
          >
            {status === 'completed' ? <><CheckCircle className="w-3 h-3" /> Done</> : <><Target className="w-3 h-3" /> Mark Complete</>}
          </button>
        )}
        {status === 'locked' && (
          <div className="flex-1 text-center py-3 rounded-lg bg-surface/50 border border-border/50">
            <p className="text-xs text-text-muted flex items-center justify-center gap-1">
              <Lock className="w-3 h-3" /> Complete prerequisites first
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
