'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import {
  skillNodes, TRACK_CONFIG, getNodeStatus,
  CheckCircle, Lock, Zap, ChevronRight,
  type TrackId, type NodeStatus,
} from './constellation-data';

/* ─── Mobile List View ─────────────────────────────────────── */

interface MobileProps {
  activeTrack: TrackId | 'all';
  completedNodes: Set<string>;
  selectedNode: string | null;
  onSelect: (id: string) => void;
  onToggleComplete: (id: string) => void;
}

export function ConstellationMobile({
  activeTrack, completedNodes, selectedNode, onSelect, onToggleComplete,
}: MobileProps) {
  const trackIds: TrackId[] = ['explorer', 'builder', 'hacker', 'founder'];

  return (
    <div className="lg:hidden space-y-3">
      {trackIds.map(trackId => {
        if (activeTrack !== 'all' && activeTrack !== trackId) return null;
        const cfg = TRACK_CONFIG[trackId];
        const trackNodesList = skillNodes.filter(n => n.track === trackId);
        const Icon = cfg.icon;
        const completedCount = trackNodesList.filter(n => completedNodes.has(n.id)).length;

        return (
          <div key={trackId} className="space-y-2">
            {/* Track header */}
            <div className="flex items-center gap-2 py-2">
              <div className={cn('p-1.5 rounded-lg border', cfg.bg, cfg.border)}>
                <Icon className={cn('w-3.5 h-3.5', cfg.color)} />
              </div>
              <span className={cn('text-xs font-mono font-bold uppercase tracking-widest', cfg.color)}>
                {cfg.label}
              </span>
              <span className="text-[10px] text-text-muted font-mono">
                {completedCount}/{trackNodesList.length}
              </span>
              <div className="flex-1 h-px bg-border/30" />
            </div>

            {/* Progress bar */}
            <div className="h-1.5 bg-surface rounded-full overflow-hidden border border-border/20 mb-2">
              <motion.div
                className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${cfg.glow}, rgba(0,236,151,0.5))` }}
                initial={{ width: 0 }}
                animate={{ width: `${trackNodesList.length > 0 ? (completedCount / trackNodesList.length) * 100 : 0}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>

            {/* Node list */}
            {trackNodesList.map(node => {
              const status = getNodeStatus(node.id, completedNodes);
              const isSelected = selectedNode === node.id;

              return (
                <div key={node.id}>
                  <div
                    className={cn(
                      'flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all',
                      status === 'locked' ? 'opacity-40 border-border/30 bg-surface/30' :
                      isSelected ? 'border-near-green/40 bg-near-green/5' :
                      'border-border/50 bg-surface/50 hover:bg-surface-hover',
                    )}
                    onClick={() => onSelect(node.id)}
                  >
                    <div className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center border',
                      status === 'completed' ? 'border-near-green bg-near-green/15' :
                      status === 'available' ? `${cfg.border} ${cfg.bg}` :
                      'border-border/40 bg-surface/40',
                    )}>
                      {status === 'locked'
                        ? <Lock className="w-3 h-3 text-text-muted/30" />
                        : <node.icon className={cn('w-3.5 h-3.5', status === 'completed' ? 'text-near-green' : cfg.color)} />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={cn(
                        'text-xs font-bold',
                        status === 'completed' ? 'text-near-green' :
                        status === 'available' ? 'text-text-primary' :
                        'text-text-muted/50',
                      )}>
                        {node.label}
                      </h4>
                      <div className="flex items-center gap-2 text-[10px] text-text-muted">
                        <span className="font-mono text-near-green/60">{node.xp} XP</span>
                        <span>•</span>
                        <span>{node.estimatedTime}</span>
                      </div>
                    </div>
                    {status === 'completed' && <CheckCircle className="w-4 h-4 text-near-green flex-shrink-0" />}
                    {status === 'available' && <Zap className="w-3.5 h-3.5 text-accent-cyan flex-shrink-0" />}
                  </div>

                  {/* Expanded detail */}
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-3 space-y-2">
                          <p className="text-xs text-text-secondary">{node.description}</p>
                          <div className="flex gap-2">
                            {status !== 'locked' && (
                              <>
                                <Link href={node.link || '/sanctum'}>
                                  <Button variant="primary" size="sm">
                                    {status === 'completed' ? 'Review' : 'Start'} <ChevronRight className="w-3 h-3 ml-1" />
                                  </Button>
                                </Link>
                                <button
                                  onClick={(e) => { e.stopPropagation(); onToggleComplete(node.id); }}
                                  className={cn(
                                    'text-[10px] font-mono px-2 py-1 rounded border',
                                    status === 'completed' ? 'border-near-green/30 text-near-green bg-near-green/10' : 'border-border text-text-muted',
                                  )}
                                >
                                  {status === 'completed' ? '✓ Done' : 'Mark Done'}
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
