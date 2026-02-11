'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shield, ChevronRight } from 'lucide-react';
import { SectionHeader } from '@/components/effects/SectionHeader';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

type DifficultyLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

interface Lesson {
  number: number;
  title: string;
  description: string;
  difficulty: DifficultyLevel;
  locked: boolean;
}

const lessons: Lesson[] = [
  {
    number: 1,
    title: 'Variables & Types',
    description: 'Start with the basics. Integers, strings, booleans — with NEAR context (accounts are strings, balances are u128).',
    difficulty: 'BEGINNER',
    locked: false,
  },
  {
    number: 2,
    title: 'Ownership & Borrowing',
    description: "Rust's superpower. Understand why values have one owner and how to share data safely.",
    difficulty: 'BEGINNER',
    locked: false,
  },
  {
    number: 3,
    title: 'Structs & Enums',
    description: 'Build your first data models. Every smart contract starts with a struct.',
    difficulty: 'BEGINNER',
    locked: false,
  },
  {
    number: 4,
    title: 'Functions & Error Handling',
    description: 'Result, Option, and why Rust forces you to handle edge cases. Your contracts will thank you.',
    difficulty: 'BEGINNER',
    locked: false,
  },
  {
    number: 5,
    title: 'Collections & Iterators',
    description: 'Vectors, HashMaps, and the iterator pattern. Essential for managing contract state.',
    difficulty: 'INTERMEDIATE',
    locked: true,
  },
  {
    number: 6,
    title: 'Your First NEAR Contract',
    description: 'Put it all together. Build a simple storage contract with near-sdk-rs.',
    difficulty: 'INTERMEDIATE',
    locked: true,
  },
  {
    number: 7,
    title: 'Token Standards (NEP-141)',
    description: 'Build a fungible token from scratch. Understand the NEAR token standard.',
    difficulty: 'INTERMEDIATE',
    locked: true,
  },
  {
    number: 8,
    title: 'Cross-Contract Calls',
    description: 'Make your contracts talk to each other. Promises, callbacks, and async patterns on NEAR.',
    difficulty: 'ADVANCED',
    locked: true,
  },
  {
    number: 9,
    title: 'Testing & Deployment',
    description: 'Write unit tests, integration tests, and deploy to testnet. Production-ready practices.',
    difficulty: 'ADVANCED',
    locked: true,
  },
  {
    number: 10,
    title: 'Advanced Patterns',
    description: 'Upgradeable contracts, access control, storage optimization, and gas efficiency.',
    difficulty: 'ADVANCED',
    locked: true,
  },
];

const difficultyColors: Record<DifficultyLevel, { bg: string; text: string; border: string }> = {
  BEGINNER: {
    bg: 'bg-near-green/10',
    text: 'text-near-green',
    border: 'border-near-green/20',
  },
  INTERMEDIATE: {
    bg: 'bg-accent-cyan/10',
    text: 'text-accent-cyan',
    border: 'border-accent-cyan/20',
  },
  ADVANCED: {
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
    border: 'border-purple-500/20',
  },
};

export function RustCurriculum() {
  return (
    <div className="w-full space-y-6" id="rust-curriculum">
      <SectionHeader title="Rust for NEAR: The Curriculum" badge="10 LESSONS" />

      {/* Intro text */}
      <p className="text-text-secondary leading-relaxed max-w-3xl">
        A structured path from zero Rust knowledge to deploying production smart contracts. Each lesson builds on the last, with hands-on exercises in the Sanctum.
      </p>

      {/* Lesson cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {lessons.map((lesson, idx) => {
          const colors = difficultyColors[lesson.difficulty];
          
          return (
            <motion.div
              key={lesson.number}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.4 }}
            >
              <Link
                href="/sanctum"
                className={cn(
                  'block group',
                  lesson.locked && 'pointer-events-none'
                )}
              >
                <Card
                  variant="glass"
                  padding="lg"
                  hover={!lesson.locked}
                  className={cn(
                    'relative h-full transition-all duration-300',
                    lesson.locked && 'opacity-50'
                  )}
                >
                  {/* Lesson number (large, dimmed background) */}
                  <div className="absolute top-4 right-4 text-6xl font-bold text-border select-none">
                    {lesson.number.toString().padStart(2, '0')}
                  </div>

                  <div className="relative space-y-3">
                    {/* Header row */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-text-primary group-hover:text-near-green transition-colors">
                          {lesson.title}
                        </h3>
                      </div>

                      {/* Lock icon for locked lessons */}
                      {lesson.locked && (
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center">
                          <Shield className="w-4 h-4 text-text-muted" />
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-sm text-text-secondary leading-relaxed pr-12">
                      {lesson.description}
                    </p>

                    {/* Footer: difficulty tag + CTA */}
                    <div className="flex items-center justify-between pt-3">
                      <span
                        className={cn(
                          'text-[10px] font-mono font-semibold uppercase tracking-widest px-2 py-1 rounded-full border',
                          colors.bg,
                          colors.text,
                          colors.border
                        )}
                      >
                        {lesson.difficulty}
                      </span>

                      {!lesson.locked && (
                        <span className="flex items-center gap-2 text-sm text-text-muted group-hover:text-near-green transition-colors">
                          <span className="hidden sm:inline">Start in Sanctum</span>
                          <ChevronRight className="w-4 h-4" />
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Hover glow effect for unlocked lessons */}
                  {!lesson.locked && (
                    <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-near-green/5 to-transparent" />
                    </div>
                  )}
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="pt-6 text-center"
      >
        <p className="text-sm text-text-muted mb-4">
          Lessons unlock as you progress. Complete challenges to level up.
        </p>
        <Link href="/sanctum">
          <motion.button
            className="inline-flex items-center gap-2 px-6 py-3 bg-near-green text-background font-semibold rounded-lg hover:bg-near-green/90 transition-all shadow-[0_0_20px_rgba(0,236,151,0.3)] hover:shadow-[0_0_30px_rgba(0,236,151,0.5)]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Start Your Journey
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}
