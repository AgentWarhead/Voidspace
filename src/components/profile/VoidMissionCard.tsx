'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Zap, 
  Rocket, 
  Pause, 
  Bookmark,
  FileText,
  Code2,
  Target
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
import { cn } from '@/lib/utils';
import type { SavedOpportunity, MissionStatus, MissionHealth } from '@/types';

interface VoidMissionCardProps {
  mission: SavedOpportunity;
  onUpdate: (opportunityId: string, updates: Partial<SavedOpportunity>) => Promise<void>;
  onSetFocus?: (opportunityId: string) => void;
  isFocused?: boolean;
}

const STATUS_CONFIG: Record<MissionStatus, { icon: typeof Search; label: string; color: string }> = {
  saved: { icon: Bookmark, label: 'Saved', color: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30' },
  researching: { icon: Search, label: 'Researching', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
  building: { icon: Zap, label: 'Building', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  shipped: { icon: Rocket, label: 'Shipped', color: 'bg-near-green/20 text-near-green border-near-green/30' },
  paused: { icon: Pause, label: 'Paused', color: 'bg-zinc-500/20 text-zinc-500 border-zinc-500/30' },
};

const HEALTH_COLORS: Record<MissionHealth, string> = {
  green: 'bg-near-green',
  yellow: 'bg-amber-400',
  red: 'bg-red-500',
};

export function VoidMissionCard({ mission, onUpdate, onSetFocus, isFocused }: VoidMissionCardProps) {
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notes, setNotes] = useState(mission.notes || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const status = mission.status || 'saved';
  const health = mission.health || 'green';
  const progress = mission.progress || 0;
  const statusConfig = STATUS_CONFIG[status];
  const StatusIcon = statusConfig.icon;

  const handleStatusChange = async (newStatus: MissionStatus) => {
    setIsUpdating(true);
    await onUpdate(mission.opportunity_id, { status: newStatus });
    setIsUpdating(false);
  };

  const handleHealthChange = async (newHealth: MissionHealth) => {
    setIsUpdating(true);
    await onUpdate(mission.opportunity_id, { health: newHealth });
    setIsUpdating(false);
  };

  const handleProgressChange = async (newProgress: number) => {
    setIsUpdating(true);
    await onUpdate(mission.opportunity_id, { progress: newProgress });
    setIsUpdating(false);
  };

  const handleNotesBlur = async () => {
    setIsEditingNotes(false);
    if (notes !== mission.notes) {
      await onUpdate(mission.opportunity_id, { notes: notes || null });
    }
  };

  const timeAgo = (date: string) => {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <Card 
      className={cn(
        'relative overflow-hidden transition-all duration-300',
        isFocused && 'ring-2 ring-near-green border-near-green',
        isUpdating && 'opacity-70 pointer-events-none'
      )}
      padding="none"
    >
      {/* Focus Badge */}
      {isFocused && (
        <div className="absolute top-0 right-0 bg-near-green text-background text-xs font-bold px-2 py-0.5 rounded-bl-lg">
          🎯 FOCUS
        </div>
      )}

      <div className="p-4">
        {/* Header: Health + Category + Status */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            {/* Health Indicator */}
            <div className="flex gap-1">
              {(['green', 'yellow', 'red'] as const).map((h) => (
                <button
                  key={h}
                  onClick={() => handleHealthChange(h)}
                  className={cn(
                    'w-2.5 h-2.5 rounded-full transition-all',
                    HEALTH_COLORS[h],
                    health === h ? 'ring-2 ring-white ring-offset-1 ring-offset-background scale-110' : 'opacity-30 hover:opacity-60'
                  )}
                  title={`Set health: ${h}`}
                />
              ))}
            </div>
            
            {/* Category */}
            {mission.opportunity?.category && (
              <Badge variant="default" className="text-xs">
                {mission.opportunity.category.icon} {mission.opportunity.category.name}
              </Badge>
            )}
          </div>

          {/* Status Badge */}
          <Badge className={cn('text-xs font-medium border', statusConfig.color)}>
            <StatusIcon className="w-3 h-3 mr-1" />
            {statusConfig.label}
          </Badge>
        </div>

        {/* Title & Description */}
        <Link href={`/opportunities/${mission.opportunity_id}`} className="group">
          <h3 className="font-semibold text-text-primary group-hover:text-near-green transition-colors line-clamp-1">
            {mission.opportunity?.title || 'Untitled Void'}
          </h3>
          {mission.opportunity?.description && (
            <p className="text-sm text-text-muted line-clamp-2 mt-1">
              {mission.opportunity.description}
            </p>
          )}
        </Link>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-text-muted">Progress</span>
            <span className="font-mono text-text-primary">{progress}%</span>
          </div>
          <Progress value={progress} size="sm" color={progress === 100 ? 'green' : 'auto'} />
          
          {/* Quick Progress Buttons */}
          <div className="flex gap-1 mt-2">
            {[0, 25, 50, 75, 100].map((pct) => (
              <button
                key={pct}
                onClick={() => handleProgressChange(pct)}
                className={cn(
                  'flex-1 text-xs py-1 rounded transition-colors',
                  progress === pct
                    ? 'bg-near-green/20 text-near-green border border-near-green/30'
                    : 'bg-surface-hover text-text-muted hover:text-text-secondary'
                )}
              >
                {pct}%
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="bg-surface-hover rounded-lg p-2 text-center">
            <div className="text-lg font-bold text-text-primary">{mission.briefs_count || 0}</div>
            <div className="text-xs text-text-muted flex items-center justify-center gap-1">
              <FileText className="w-3 h-3" /> Briefs
            </div>
          </div>
          <div className="bg-surface-hover rounded-lg p-2 text-center">
            <div className="text-lg font-bold text-text-primary">{mission.sanctum_sessions || 0}</div>
            <div className="text-xs text-text-muted flex items-center justify-center gap-1">
              <Code2 className="w-3 h-3" /> Sanctum
            </div>
          </div>
          <div className="bg-surface-hover rounded-lg p-2 text-center">
            <div className="text-lg font-bold text-text-primary">
              {status === 'shipped' ? '✓' : '—'}
            </div>
            <div className="text-xs text-text-muted flex items-center justify-center gap-1">
              <Rocket className="w-3 h-3" /> Deploy
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="mt-4 pt-3 border-t border-border">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-text-muted">Notes</span>
            {!isEditingNotes && (
              <button 
                onClick={() => setIsEditingNotes(true)}
                className="text-xs text-near-green/70 hover:text-near-green"
              >
                Edit
              </button>
            )}
          </div>
          {isEditingNotes ? (
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={handleNotesBlur}
              className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text-secondary placeholder:text-text-muted resize-none focus:outline-none focus:border-near-green/50"
              rows={2}
              placeholder="Add notes about this mission..."
              autoFocus
            />
          ) : (
            <p className="text-sm text-text-secondary italic">
              {mission.notes || 'No notes yet...'}
            </p>
          )}
        </div>

        {/* Timestamps */}
        <div className="flex items-center justify-between text-xs text-text-muted mt-3">
          <span>Started {timeAgo(mission.created_at)}</span>
          {mission.updated_at && mission.updated_at !== mission.created_at && (
            <span>Updated {timeAgo(mission.updated_at)}</span>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="border-t border-border bg-surface/50 p-3 flex items-center gap-2">
        {/* Status Selector */}
        <select
          value={status}
          onChange={(e) => handleStatusChange(e.target.value as MissionStatus)}
          className="flex-1 bg-surface border border-border rounded-lg px-2 py-1.5 text-xs text-text-secondary focus:outline-none focus:border-near-green/50"
        >
          <option value="saved">📑 Saved</option>
          <option value="researching">🔍 Researching</option>
          <option value="building">🔨 Building</option>
          <option value="shipped">🚀 Shipped</option>
          <option value="paused">⏸️ Paused</option>
        </select>

        {/* Quick Actions */}
        <Link href={`/opportunities/${mission.opportunity_id}`}>
          <Button variant="ghost" size="sm" className="text-xs">
            <FileText className="w-3.5 h-3.5" />
          </Button>
        </Link>
        <Link href={`/sanctum?void=${mission.opportunity_id}`}>
          <Button variant="ghost" size="sm" className="text-xs">
            <Code2 className="w-3.5 h-3.5" />
          </Button>
        </Link>
        {onSetFocus && !isFocused && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs"
            onClick={() => onSetFocus(mission.opportunity_id)}
          >
            <Target className="w-3.5 h-3.5" />
          </Button>
        )}
      </div>
    </Card>
  );
}
