'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { GradientText } from '@/components/effects/GradientText';
import { GridPattern } from '@/components/effects/GridPattern';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui';
import { Activity, BarChart3, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

// Floating particles for constellation background
function FloatingParticles() {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 10 + 15,
    delay: Math.random() * 5,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-near-green/30"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

// Code lines constant
const CODE_LINES = [
  'use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};',
  'use near_sdk::{env, near_bindgen, AccountId};',
  '',
  '#[near_bindgen]',
  'impl Contract {',
  '    pub fn deploy(&mut self) -> String {',
  '        "Building the future on NEAR".to_string()',
  '    }',
  '}',
];

// Code snippet typing animation
function CodeSnippet() {
  const [visibleLines, setVisibleLines] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);

  useEffect(() => {
    if (visibleLines >= CODE_LINES.length) return;

    const currentLine = CODE_LINES[visibleLines];
    if (currentChar < currentLine.length) {
      const timeout = setTimeout(() => {
        setCurrentChar(currentChar + 1);
      }, 30);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setVisibleLines(visibleLines + 1);
        setCurrentChar(0);
      }, 200);
      return () => clearTimeout(timeout);
    }
  }, [visibleLines, currentChar]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.6 }}
      className="w-full max-w-2xl mx-auto mb-12"
    >
      <div className="bg-[#0d0d0d] border border-near-green/20 rounded-lg p-4 shadow-lg shadow-near-green/5">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
          <span className="ml-2 text-xs text-text-muted font-mono">contract.rs</span>
        </div>
        <div className="font-mono text-xs leading-relaxed">
          {CODE_LINES.slice(0, visibleLines).map((line, i) => (
            <div key={i} className="text-text-secondary">
              {line}
            </div>
          ))}
          {visibleLines < CODE_LINES.length && (
            <div className="text-text-secondary">
              {CODE_LINES[visibleLines].slice(0, currentChar)}
              <span className="inline-block w-2 h-4 bg-near-green/80 animate-pulse" />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Live ecosystem ticker
function EcosystemTicker() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((c) => (c + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { icon: Activity, text: 'NEAR ecosystem is growing', color: 'text-near-green' },
    { icon: BarChart3, text: '6 live data sources syncing', color: 'text-accent-cyan' },
    { icon: TrendingUp, text: '$10M+ in grants available', color: 'text-purple-400' },
    { icon: Activity, text: '200+ active projects building', color: 'text-near-green' },
  ];

  const current = stats[count];
  const Icon = current.icon;

  return (
    <motion.div
      key={count}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-center justify-center gap-2 mb-8"
    >
      <Icon className={cn('w-4 h-4', current.color)} />
      <span className="text-sm text-text-muted">{current.text}</span>
      <motion.div
        className={cn('w-2 h-2 rounded-full', current.color.replace('text-', 'bg-'))}
        animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.div>
  );
}

// Premium stats card with glow
interface StatCardProps {
  value: string;
  label: string;
  delay: number;
}

function StatCard({ value, label, delay }: StatCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [displayValue, setDisplayValue] = useState('0');

  useEffect(() => {
    if (!isInView) return;

    const timeout = setTimeout(() => {
      const numMatch = value.match(/\d+/);
      if (numMatch) {
        const targetNum = parseInt(numMatch[0]);
        const duration = 1500;
        const steps = 30;
        const increment = targetNum / steps;
        let current = 0;

        const interval = setInterval(() => {
          current += increment;
          if (current >= targetNum) {
            setDisplayValue(value);
            clearInterval(interval);
          } else {
            const rounded = Math.floor(current);
            setDisplayValue(value.replace(/\d+/, rounded.toString()));
          }
        }, duration / steps);

        return () => clearInterval(interval);
      } else {
        setDisplayValue(value);
      }
    }, delay);

    return () => clearTimeout(timeout);
  }, [isInView, value, delay]);

  return (
    <motion.div
      ref={ref}
      className="relative group"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.6, delay: delay / 1000, type: 'spring', bounce: 0.4 }}
    >
      {/* Glow effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-near-green/50 to-accent-cyan/50 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-500" />
      
      {/* Card content */}
      <div className="relative bg-surface/80 backdrop-blur-xl border border-near-green/20 rounded-lg p-6 hover:border-near-green/40 transition-all duration-300">
        <div className="text-4xl font-bold text-near-green mb-2 font-mono">{displayValue}</div>
        <div className="text-sm text-text-secondary">{label}</div>
      </div>
    </motion.div>
  );
}

export function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        type: 'spring' as const,
        bounce: 0.4,
      },
    },
  };

  return (
    <section ref={ref} className="relative py-24 md:py-32 overflow-hidden">
      {/* Floating particles constellation */}
      <FloatingParticles />

      {/* Radial gradient background with parallax */}
      <motion.div
        style={{ y, opacity }}
        className="absolute inset-0 opacity-40"
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(0, 236, 151, 0.2), transparent)',
          }}
        />
      </motion.div>

      {/* Grid pattern */}
      <GridPattern className="absolute inset-0 opacity-20" />

      <Container size="lg" className="relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center"
        >
          {/* Ecosystem ticker */}
          <motion.div variants={itemVariants}>
            <EcosystemTicker />
          </motion.div>

          {/* Headline */}
          <motion.div variants={itemVariants}>
            <GradientText as="h1" animated className="text-5xl md:text-7xl font-bold mb-6">
              From Zero to NEAR Builder
            </GradientText>
          </motion.div>

          {/* Subtext */}
          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-text-secondary max-w-3xl mb-8"
          >
            Master the protocol. Build with AI. Ship real dApps. Join the builders filling voids in the NEAR ecosystem.
          </motion.p>

          {/* Code snippet preview */}
          <CodeSnippet />

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 mb-16">
            <Button
              variant="primary"
              size="lg"
              onClick={() => {
                document.getElementById('learning-tracks')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Start Your Journey
            </Button>
            <Button
              variant="ghost"
              size="lg"
              onClick={() => {
                document.getElementById('rust-curriculum')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              I Already Know Crypto →
            </Button>
          </motion.div>

          {/* Premium Stats Bar with glass morphism */}
          <motion.div
            variants={itemVariants}
            className="w-full max-w-5xl"
          >
            <div className="relative">
              {/* Animated border gradient */}
              <motion.div
                className="absolute -inset-1 bg-gradient-to-r from-near-green via-accent-cyan to-purple-500 rounded-xl blur-sm opacity-50"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              
              {/* Stats container */}
              <div className="relative bg-surface/60 backdrop-blur-xl border border-near-green/30 rounded-xl p-8 shadow-2xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <StatCard value="20+" label="Void Categories" delay={500} />
                  <StatCard value="6" label="Live Data Sources" delay={700} />
                  <StatCard value="$10M+" label="in Grants Available" delay={900} />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
