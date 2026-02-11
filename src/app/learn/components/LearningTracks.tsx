'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Code, Zap, BookOpen, Sparkles, Rocket, Code2, CheckCircle2, Star, TrendingUp, Flame } from 'lucide-react';
import { SectionHeader } from '@/components/effects/SectionHeader';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { Container } from '@/components/ui';
import { cn } from '@/lib/utils';

interface TrackStep {
  label: string;
  icon: React.ElementType;
}

interface TrackCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  difficulty: 1 | 2 | 3;
  duration: string;
  steps: TrackStep[];
  ctaText: string;
  ctaLink: string;
  theme: 'green' | 'cyan' | 'purple';
  popular?: boolean;
  delay?: number;
}

const themeStyles = {
  green: {
    border: 'border-near-green/30',
    borderTop: 'border-t-near-green',
    icon: 'bg-near-green/10 border-near-green/20 text-near-green',
    step: 'border-near-green/20 bg-near-green/5 group-hover:border-near-green/40',
    line: 'bg-near-green/30',
    hover: 'hover:border-near-green/50 hover:shadow-near-green/20',
    glow: 'from-near-green/20 to-near-green/0',
    badge: 'bg-near-green/10 text-near-green border-near-green/30',
  },
  cyan: {
    border: 'border-accent-cyan/30',
    borderTop: 'border-t-accent-cyan',
    icon: 'bg-accent-cyan/10 border-accent-cyan/20 text-accent-cyan',
    step: 'border-accent-cyan/20 bg-accent-cyan/5 group-hover:border-accent-cyan/40',
    line: 'bg-accent-cyan/30',
    hover: 'hover:border-accent-cyan/50 hover:shadow-accent-cyan/20',
    glow: 'from-accent-cyan/20 to-accent-cyan/0',
    badge: 'bg-accent-cyan/10 text-accent-cyan border-accent-cyan/30',
  },
  purple: {
    border: 'border-purple-500/30',
    borderTop: 'border-t-purple-500',
    icon: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
    step: 'border-purple-500/20 bg-purple-500/5 group-hover:border-purple-500/40',
    line: 'bg-purple-500/30',
    hover: 'hover:border-purple-500/50 hover:shadow-purple-500/20',
    glow: 'from-purple-500/20 to-purple-500/0',
    badge: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  },
};

function DifficultyStars({ level }: { level: 1 | 2 | 3 }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3].map((i) => (
        <Star
          key={i}
          className={cn(
            'w-4 h-4',
            i <= level ? 'fill-yellow-400 text-yellow-400' : 'text-text-muted'
          )}
        />
      ))}
    </div>
  );
}

function TrackCard({
  icon,
  title,
  subtitle,
  description,
  difficulty,
  duration,
  steps,
  ctaText,
  ctaLink,
  theme,
  popular = false,
  delay = 0,
}: TrackCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const styles = themeStyles[theme];

  const handleClick = () => {
    if (ctaLink.startsWith('#')) {
      document.getElementById(ctaLink.slice(1))?.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = ctaLink;
    }
  };

  return (
    <ScrollReveal delay={delay}>
      <motion.div
        className="relative h-full"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3, type: 'spring', bounce: 0.4 }}
      >
        {/* Popular badge */}
        {popular && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -top-3 left-1/2 -translate-x-1/2 z-10"
          >
            <div className="bg-gradient-to-r from-near-green to-accent-cyan text-black text-xs font-bold px-4 py-1 rounded-full flex items-center gap-1 shadow-lg">
              <Flame className="w-3 h-3" />
              MOST POPULAR
            </div>
          </motion.div>
        )}

        {/* Glow effect on hover */}
        <motion.div
          className={cn(
            'absolute -inset-1 bg-gradient-to-b rounded-xl blur-lg',
            styles.glow
          )}
          animate={{
            opacity: isHovered ? 0.6 : 0,
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Card content */}
        <div
          className={cn(
            'relative bg-surface border rounded-xl p-6 transition-all duration-300 cursor-pointer group h-full flex flex-col',
            'border-t-4',
            styles.border,
            styles.borderTop,
            styles.hover,
            'hover:shadow-2xl'
          )}
          onClick={handleClick}
        >
          {/* Header section */}
          <div className="mb-6">
            {/* Icon with pulse animation on hover */}
            <motion.div
              className={cn('w-16 h-16 rounded-lg flex items-center justify-center mb-4 border', styles.icon)}
              animate={isHovered ? { scale: [1, 1.1, 1] } : { scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              {icon}
            </motion.div>

            {/* Title and subtitle */}
            <div className="mb-3">
              <h3 className="text-2xl font-bold text-text-primary mb-1">{title}</h3>
              <p className="text-sm text-text-muted uppercase tracking-wider">{subtitle}</p>
            </div>

            {/* Meta info: difficulty + duration */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-text-muted">Difficulty:</span>
                <DifficultyStars level={difficulty} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-text-muted">Time:</span>
                <span className="text-xs font-mono text-text-primary">{duration}</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-text-secondary leading-relaxed">{description}</p>
          </div>

          {/* Progress visualization */}
          <div className="mb-6 flex-1">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-text-muted" />
              <span className="text-xs text-text-muted uppercase tracking-wide font-medium">Learning Path</span>
            </div>
            
            <div className="space-y-2">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: delay + index * 0.1 }}
                  >
                    <div
                      className={cn(
                        'rounded-lg border px-3 py-2.5 text-sm transition-all duration-200',
                        styles.step,
                        'flex items-center gap-3'
                      )}
                    >
                      <StepIcon className="w-4 h-4 text-text-muted flex-shrink-0" />
                      <span className="text-text-secondary flex-1">{step.label}</span>
                      {/* Progress indicator */}
                      <div className="w-5 h-5 rounded-full border-2 border-border flex items-center justify-center flex-shrink-0">
                        <div className="w-2 h-2 rounded-full bg-text-muted opacity-30" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* CTA Button */}
          <motion.button
            className={cn(
              'w-full py-3 px-4 rounded-lg font-semibold transition-all relative overflow-hidden',
              'bg-surface-hover border',
              styles.border,
              'text-text-primary group-hover:text-text-primary'
            )}
            onClick={handleClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              className={cn('absolute inset-0 bg-gradient-to-r', styles.glow)}
              animate={{
                opacity: isHovered ? 0.2 : 0,
              }}
            />
            <span className="relative">{ctaText}</span>
          </motion.button>
        </div>
      </motion.div>
    </ScrollReveal>
  );
}

// Comparison matrix
function ComparisonMatrix() {
  const features = [
    { name: 'Blockchain Basics', explorer: true, builder: true, hacker: false },
    { name: 'Wallet Setup', explorer: true, builder: true, hacker: false },
    { name: 'Rust Programming', explorer: false, builder: true, hacker: true },
    { name: 'Smart Contracts', explorer: false, builder: true, hacker: true },
    { name: 'AI-Assisted Coding', explorer: false, builder: true, hacker: true },
    { name: 'Advanced Patterns', explorer: false, builder: false, hacker: true },
    { name: 'Cross-Chain Dev', explorer: false, builder: false, hacker: true },
    { name: 'Void Analysis', explorer: false, builder: true, hacker: true },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mt-16"
    >
      <h3 className="text-2xl font-bold text-text-primary mb-6 text-center">
        What&apos;s Included in Each Track
      </h3>
      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        {/* Header row */}
        <div className="grid grid-cols-4 gap-4 p-4 bg-surface-hover border-b border-border">
          <div className="text-sm font-semibold text-text-muted">Feature</div>
          <div className="text-sm font-semibold text-near-green text-center">Explorer</div>
          <div className="text-sm font-semibold text-accent-cyan text-center">Builder</div>
          <div className="text-sm font-semibold text-purple-400 text-center">Hacker</div>
        </div>
        {/* Feature rows */}
        {features.map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className={cn(
              'grid grid-cols-4 gap-4 p-4',
              i !== features.length - 1 && 'border-b border-border'
            )}
          >
            <div className="text-sm text-text-secondary">{feature.name}</div>
            <div className="flex justify-center">
              {feature.explorer ? (
                <CheckCircle2 className="w-5 h-5 text-near-green" />
              ) : (
                <div className="w-5 h-5 rounded-full bg-surface-hover" />
              )}
            </div>
            <div className="flex justify-center">
              {feature.builder ? (
                <CheckCircle2 className="w-5 h-5 text-accent-cyan" />
              ) : (
                <div className="w-5 h-5 rounded-full bg-surface-hover" />
              )}
            </div>
            <div className="flex justify-center">
              {feature.hacker ? (
                <CheckCircle2 className="w-5 h-5 text-purple-400" />
              ) : (
                <div className="w-5 h-5 rounded-full bg-surface-hover" />
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export function LearningTracks() {
  return (
    <section id="learning-tracks" className="py-20 md:py-28">
      <Container size="lg">
        <SectionHeader title="Choose Your Character Class" badge="PATHS" />

        <p className="text-center text-text-secondary text-lg mb-12 max-w-3xl mx-auto">
          Every legendary builder started somewhere. Pick the path that matches where you are now.
          You can always level up later.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <TrackCard
            icon={<Globe className="w-8 h-8" />}
            title="Explorer"
            subtitle="New to crypto"
            description="You're curious about Web3 but don't know where to start. This path introduces you to blockchain, NEAR Protocol, and the ecosystem. No coding required."
            difficulty={1}
            duration="~2 hours"
            steps={[
              { label: 'What is Blockchain?', icon: BookOpen },
              { label: 'Understanding NEAR', icon: Rocket },
              { label: 'Create Your Wallet', icon: Sparkles },
              { label: 'First Transaction', icon: CheckCircle2 },
            ]}
            ctaText="Start Exploring →"
            ctaLink="#near-overview"
            theme="green"
            delay={0.1}
          />

          <TrackCard
            icon={<Code className="w-8 h-8" />}
            title="Builder"
            subtitle="Ready to code"
            description="You know some programming. This path teaches you Rust from scratch, smart contract development, and gets you deploying to NEAR mainnet with AI assistance."
            difficulty={2}
            duration="~1 week"
            popular={true}
            steps={[
              { label: 'Rust Fundamentals', icon: BookOpen },
              { label: 'Smart Contract Basics', icon: Code },
              { label: 'Build with Sanctum AI', icon: Rocket },
              { label: 'Deploy to Mainnet', icon: CheckCircle2 },
            ]}
            ctaText="Start Building →"
            ctaLink="#rust-curriculum"
            theme="cyan"
            delay={0.2}
          />

          <TrackCard
            icon={<Zap className="w-8 h-8" />}
            title="Hacker"
            subtitle="Experienced dev"
            description="You're a seasoned developer. Skip the basics. Learn NEAR-specific architecture, advanced contract patterns, cross-chain development, and how to fill high-value voids."
            difficulty={3}
            duration="~2 days"
            steps={[
              { label: 'NEAR Architecture Deep-Dive', icon: Terminal },
              { label: 'Advanced Contract Patterns', icon: Code },
              { label: 'Cross-Chain Development', icon: Rocket },
              { label: 'Identify & Fill Voids', icon: TrendingUp },
            ]}
            ctaText="Start Hacking →"
            ctaLink="/opportunities"
            theme="purple"
            delay={0.3}
          />
        </div>

        {/* Comparison matrix */}
        <ComparisonMatrix />
      </Container>
    </section>
  );
}
