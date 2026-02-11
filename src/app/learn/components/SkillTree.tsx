'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Eye, 
  ArrowRight, 
  Code, 
  Star, 
  Coins, 
  Rocket, 
  Sparkles 
} from 'lucide-react';
import { SectionHeader } from '@/components/effects/SectionHeader';
import { cn } from '@/lib/utils';

interface SkillNode {
  id: number;
  label: string;
  icon: React.ElementType;
  description: string;
  completed: boolean;
  locked: boolean;
}

const skillNodes: SkillNode[] = [
  {
    id: 1,
    label: 'NEAR Basics',
    icon: BookOpen,
    description: 'Understand blockchain fundamentals and the NEAR ecosystem',
    completed: true,
    locked: false,
  },
  {
    id: 2,
    label: 'Wallet Setup',
    icon: Eye,
    description: 'Create and secure your NEAR wallet',
    completed: false,
    locked: false,
  },
  {
    id: 3,
    label: 'First Transaction',
    icon: ArrowRight,
    description: 'Send your first NEAR transaction',
    completed: false,
    locked: false,
  },
  {
    id: 4,
    label: 'Rust Fundamentals',
    icon: Code,
    description: 'Learn Rust programming basics',
    completed: false,
    locked: true,
  },
  {
    id: 5,
    label: 'Smart Contracts',
    icon: Star,
    description: 'Build your first smart contract',
    completed: false,
    locked: true,
  },
  {
    id: 6,
    label: 'Build a Token',
    icon: Coins,
    description: 'Create a fungible token (NEP-141)',
    completed: false,
    locked: true,
  },
  {
    id: 7,
    label: 'Build a dApp',
    icon: Rocket,
    description: 'Deploy a full decentralized application',
    completed: false,
    locked: true,
  },
  {
    id: 8,
    label: 'Fill a Void',
    icon: Sparkles,
    description: 'Ship your project to production',
    completed: false,
    locked: true,
  },
];

export function SkillTree() {
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);

  return (
    <div className="w-full">
      <SectionHeader title="Your Learning Roadmap" badge="PROGRESSION" />

      {/* Desktop: Horizontal layout */}
      <div className="hidden md:block relative py-16 px-8 overflow-x-auto">
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ minWidth: '100%' }}
        >
          {/* Connecting lines with gradient animation */}
          {skillNodes.slice(0, -1).map((node, idx) => {
            const x1 = `${(idx / (skillNodes.length - 1)) * 100}%`;
            const x2 = `${((idx + 1) / (skillNodes.length - 1)) * 100}%`;
            const locked = skillNodes[idx + 1].locked;

            return (
              <g key={`line-${node.id}`}>
                <defs>
                  <linearGradient id={`gradient-${node.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={locked ? '#333333' : '#00EC97'} stopOpacity="0.3" />
                    <stop offset="50%" stopColor={locked ? '#333333' : '#00EC97'} stopOpacity="0.6">
                      {!locked && (
                        <animate
                          attributeName="offset"
                          values="0;1;0"
                          dur="3s"
                          repeatCount="indefinite"
                        />
                      )}
                    </stop>
                    <stop offset="100%" stopColor={locked ? '#333333' : '#00EC97'} stopOpacity="0.3" />
                  </linearGradient>
                </defs>
                <line
                  x1={x1}
                  y1="50%"
                  x2={x2}
                  y2="50%"
                  stroke={`url(#gradient-${node.id})`}
                  strokeWidth="2"
                  strokeDasharray={locked ? '4 4' : '0'}
                />
              </g>
            );
          })}
        </svg>

        {/* Skill nodes */}
        <div className="relative flex justify-between items-center min-w-max gap-4">
          {skillNodes.map((node, idx) => (
            <motion.div
              key={node.id}
              className="flex flex-col items-center gap-3 relative"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
            >
              {/* Node circle */}
              <div className="relative">
                <motion.div
                  className={cn(
                    'w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all duration-300',
                    node.completed
                      ? 'bg-near-green/20 border-near-green shadow-[0_0_20px_rgba(0,236,151,0.4)]'
                      : node.locked
                      ? 'bg-surface/50 border-border/50'
                      : 'bg-surface border-border hover:border-near-green/50'
                  )}
                  animate={
                    node.completed
                      ? {
                          boxShadow: [
                            '0 0 20px rgba(0,236,151,0.4)',
                            '0 0 30px rgba(0,236,151,0.6)',
                            '0 0 20px rgba(0,236,151,0.4)',
                          ],
                        }
                      : {}
                  }
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <node.icon
                    className={cn(
                      'w-7 h-7',
                      node.completed
                        ? 'text-near-green'
                        : node.locked
                        ? 'text-text-muted/50'
                        : 'text-text-secondary'
                    )}
                  />
                </motion.div>

                {/* Tooltip */}
                {hoveredNode === node.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 bg-surface border border-border rounded-lg p-3 shadow-xl z-10"
                  >
                    <p className="text-xs text-text-secondary">{node.description}</p>
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-surface border-r border-b border-border rotate-45" />
                  </motion.div>
                )}
              </div>

              {/* Label */}
              <div className="text-center max-w-[100px]">
                <p
                  className={cn(
                    'text-sm font-medium',
                    node.completed
                      ? 'text-near-green'
                      : node.locked
                      ? 'text-text-muted/50'
                      : 'text-text-secondary'
                  )}
                >
                  {node.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mobile: Vertical layout */}
      <div className="md:hidden relative py-8 px-4">
        <svg
          className="absolute left-8 top-0 w-0.5 h-full pointer-events-none"
        >
          {/* Vertical connecting line */}
          <defs>
            <linearGradient id="mobile-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00EC97" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#00EC97" stopOpacity="0.6">
                <animate
                  attributeName="offset"
                  values="0;1;0"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="100%" stopColor="#333333" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="100%"
            stroke="url(#mobile-gradient)"
            strokeWidth="2"
          />
        </svg>

        {/* Skill nodes */}
        <div className="space-y-6 relative">
          {skillNodes.map((node, idx) => (
            <motion.div
              key={node.id}
              className="flex items-start gap-4 relative"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
            >
              {/* Node circle */}
              <motion.div
                className={cn(
                  'w-12 h-12 rounded-full flex items-center justify-center border-2 flex-shrink-0 transition-all duration-300',
                  node.completed
                    ? 'bg-near-green/20 border-near-green shadow-[0_0_20px_rgba(0,236,151,0.4)]'
                    : node.locked
                    ? 'bg-surface/50 border-border/50'
                    : 'bg-surface border-border'
                )}
                animate={
                  node.completed
                    ? {
                        boxShadow: [
                          '0 0 20px rgba(0,236,151,0.4)',
                          '0 0 30px rgba(0,236,151,0.6)',
                          '0 0 20px rgba(0,236,151,0.4)',
                        ],
                      }
                    : {}
                }
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <node.icon
                  className={cn(
                    'w-5 h-5',
                    node.completed
                      ? 'text-near-green'
                      : node.locked
                      ? 'text-text-muted/50'
                      : 'text-text-secondary'
                  )}
                />
              </motion.div>

              {/* Content */}
              <div className="flex-1 pt-2">
                <h3
                  className={cn(
                    'text-base font-semibold mb-1',
                    node.completed
                      ? 'text-near-green'
                      : node.locked
                      ? 'text-text-muted/50'
                      : 'text-text-primary'
                  )}
                >
                  {node.label}
                </h3>
                <p
                  className={cn(
                    'text-sm',
                    node.locked ? 'text-text-muted/50' : 'text-text-secondary'
                  )}
                >
                  {node.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
