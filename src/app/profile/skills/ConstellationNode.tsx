'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  TRACK_CONFIG, TIER_SIZES, MAP_WIDTH, MAP_HEIGHT,
  CheckCircle, Lock, Zap,
  type SkillNode, type NodeStatus, type TrackId,
} from './constellation-data';
import { LensFlare, OrbitingSparkles, HudReticle, BeaconRing } from './ConstellationNodeEffects';

/* ─── Individual Constellation Node ────────────────────────── */

interface NodeProps {
  node: SkillNode;
  status: NodeStatus;
  isSelected: boolean;
  onSelect: (id: string) => void;
  x: number;
  y: number;
  index: number;
}

function ConstellationNodeInner({ node, status, isSelected, onSelect, x, y, index }: NodeProps) {
  const track = TRACK_CONFIG[node.track];
  const isCompleted = status === 'completed';
  const isAvailable = status === 'available';
  const isLocked = status === 'locked';

  const pctX = (x / MAP_WIDTH) * 100;
  const pctY = (y / MAP_HEIGHT) * 100;

  const size = TIER_SIZES[node.tier] || 36;
  const iconSize = Math.round(size * 0.4);

  return (
    <motion.div
      className="absolute flex flex-col items-center cursor-pointer z-10 group"
      style={{
        left: `${pctX}%`,
        top: `${pctY}%`,
        transform: 'translate(-50%, -50%)',
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.05 + index * 0.015, type: 'spring', stiffness: 200, damping: 18 }}
      onClick={() => onSelect(node.id)}
    >
      {/* Completed: SVG lens flare + orbiting sparkles */}
      {isCompleted && (
        <>
          <LensFlare size={size} color={track.hex} />
          <OrbitingSparkles size={size} color={track.hex} />
          <motion.div
            className="absolute rounded-full"
            style={{ width: size * 1.8, height: size * 1.8, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
            animate={{
              boxShadow: [
                `0 0 ${size * 0.5}px ${track.glow}, 0 0 ${size}px rgba(0,236,151,0.08)`,
                `0 0 ${size * 0.8}px ${track.glow}, 0 0 ${size * 1.4}px rgba(0,236,151,0.15)`,
                `0 0 ${size * 0.5}px ${track.glow}, 0 0 ${size}px rgba(0,236,151,0.08)`,
              ],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
        </>
      )}

      {/* Available: Pulsing beacon */}
      {isAvailable && <BeaconRing size={size} color={track.glow} />}

      {/* Locked: faint shimmer */}
      {isLocked && (
        <motion.div
          className="absolute rounded-full bg-white/[0.02]"
          style={{ width: size * 1.1, height: size * 1.1, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
          animate={{ opacity: [0.02, 0.07, 0.02] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* Node circle */}
      <motion.div
        className={cn(
          'rounded-full flex items-center justify-center border-2 relative backdrop-blur-sm transition-shadow',
          isCompleted ? 'border-near-green bg-near-green/20' :
          isAvailable ? `${track.border} ${track.bg}` :
          'border-border/30 bg-surface/30',
          isSelected && 'ring-2 ring-near-green/70 ring-offset-2 ring-offset-background',
          isLocked && 'opacity-25',
        )}
        style={{ width: size, height: size }}
        whileHover={{ scale: 1.3, transition: { duration: 0.15 } }}
        whileTap={{ scale: 0.9 }}
      >
        {isLocked ? (
          <Lock style={{ width: iconSize * 0.8, height: iconSize * 0.8 }} className="text-text-muted/30" />
        ) : (
          <node.icon
            style={{ width: iconSize, height: iconSize }}
            className={cn(isCompleted ? 'text-near-green' : track.color)}
          />
        )}

        {/* Completed checkmark badge */}
        {isCompleted && (
          <div
            className="absolute -top-0.5 -right-0.5 rounded-full bg-near-green flex items-center justify-center shadow-lg shadow-near-green/30"
            style={{ width: size * 0.3, height: size * 0.3 }}
          >
            <CheckCircle style={{ width: size * 0.18, height: size * 0.18 }} className="text-background" />
          </div>
        )}

        {/* Available zap indicator */}
        {isAvailable && (
          <motion.div
            className="absolute -top-0.5 -right-0.5 rounded-full bg-accent-cyan flex items-center justify-center"
            style={{ width: size * 0.25, height: size * 0.25 }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Zap style={{ width: size * 0.15, height: size * 0.15 }} className="text-background" />
          </motion.div>
        )}
      </motion.div>

      {/* Label */}
      <span
        className={cn(
          'text-[8px] font-semibold text-center max-w-[80px] leading-tight mt-1 transition-opacity',
          isCompleted ? 'text-near-green opacity-100' :
          isAvailable ? `${track.color} opacity-100` :
          'text-text-muted/30 opacity-0 group-hover:opacity-60',
        )}
      >
        {node.label}
      </span>

      {/* HUD targeting reticle on hover */}
      <HudReticle size={size} color={track.hex} label={node.label} xp={node.xp} />
    </motion.div>
  );
}

export const ConstellationNode = memo(ConstellationNodeInner);
