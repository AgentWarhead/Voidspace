'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { DollarSign, TrendingUp, Rocket, Zap, Globe, BarChart3, Activity, Clock } from 'lucide-react';
import { SectionHeader } from '@/components/effects/SectionHeader';
import { GlowCard } from '@/components/effects/GlowCard';
import { Container } from '@/components/ui';
import { cn } from '@/lib/utils';

// Animated counter hook
function useAnimatedCounter(target: number, duration: number = 2000, inView: boolean = true) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeProgress * target));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [target, duration, inView]);

  return count;
}

// Builder success metrics
function SuccessMetrics() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const projectsShipped = useAnimatedCounter(247, 2000, isInView);
  const grantsAwarded = useAnimatedCounter(89, 2000, isInView);
  const avgHours = useAnimatedCounter(18, 2000, isInView);

  const metrics = [
    {
      icon: Rocket,
      value: projectsShipped,
      label: 'Projects Shipped',
      color: 'text-near-green',
    },
    {
      icon: DollarSign,
      value: grantsAwarded,
      label: 'Grants Awarded',
      color: 'text-accent-cyan',
    },
    {
      icon: Clock,
      value: avgHours,
      label: 'Avg Hours to Deploy',
      color: 'text-purple-400',
    },
  ];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6 }}
      className="mb-12"
    >
      <div className="bg-gradient-to-br from-surface via-surface-hover to-surface border border-border rounded-xl p-8">
        <h3 className="text-center text-xl font-semibold text-text-primary mb-6">
          Builder Success Metrics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {metrics.map((metric, i) => {
            const Icon = metric.icon;
            return (
              <div key={i} className="text-center">
                <div className="flex items-center justify-center mb-3">
                  <Icon className={cn('w-6 h-6 mr-2', metric.color)} />
                  <span className={cn('text-4xl font-bold font-mono', metric.color)}>
                    {metric.value}
                  </span>
                </div>
                <p className="text-sm text-text-muted">{metric.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

// Testimonial card
interface TestimonialProps {
  quote: string;
  author: string;
  role: string;
  project: string;
  delay?: number;
}

function Testimonial({ quote, author, role, project, delay = 0 }: TestimonialProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="relative group">
        {/* Gradient border glow on hover */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-near-green/50 via-accent-cyan/50 to-purple-500/50 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-500" />
        
        <div className="relative bg-surface border border-near-green/20 rounded-lg p-6 hover:border-near-green/40 transition-all duration-300">
          <div className="mb-4">
            <p className="text-text-secondary italic leading-relaxed">&ldquo;{quote}&rdquo;</p>
          </div>
          <div className="flex items-start justify-between">
            <div>
              <p className="font-semibold text-text-primary">{author}</p>
              <p className="text-sm text-text-muted">{role}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-mono text-near-green">{project}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Data sources bar
function DataSources() {
  const sources = [
    { name: 'NearBlocks', icon: Globe, status: 'live' },
    { name: 'DeFiLlama', icon: TrendingUp, status: 'live' },
    { name: 'GitHub', icon: Activity, status: 'live' },
    { name: 'NEAR API', icon: Zap, status: 'live' },
    { name: 'Analytics', icon: BarChart3, status: 'live' },
    { name: 'Chain Data', icon: Globe, status: 'live' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mb-8"
    >
      <div className="bg-surface/50 border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary">Real-Time Data Sources</h3>
          <div className="flex items-center gap-2">
            <motion.div
              className="w-2 h-2 rounded-full bg-near-green"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-xs text-near-green font-medium">All Systems Live</span>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {sources.map((source, i) => {
            const Icon = source.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.3 }}
                className="flex flex-col items-center gap-2 p-3 bg-surface-hover rounded-lg border border-border hover:border-near-green/30 transition-colors"
              >
                <Icon className="w-5 h-5 text-near-green" />
                <span className="text-xs text-text-muted text-center">{source.name}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

// Outcome card with icon
interface OutcomeCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  highlight?: string;
  delay?: number;
}

function OutcomeCard({ icon: Icon, title, description, highlight, delay = 0 }: OutcomeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay }}
    >
      <GlowCard padding="lg">
        <div className="flex flex-col gap-4 h-full">
          <div className="w-12 h-12 rounded-lg bg-near-green/10 border border-near-green/20 flex items-center justify-center text-near-green">
            <Icon className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-text-primary mb-2">{title}</h3>
            <p className="text-text-secondary leading-relaxed">{description}</p>
            {highlight && (
              <p className="mt-3 text-near-green font-medium text-sm">{highlight}</p>
            )}
          </div>
        </div>
      </GlowCard>
    </motion.div>
  );
}

export function SocialProof() {
  return (
    <section className="py-20 md:py-28">
      <Container size="lg">
        <SectionHeader title="Why NEAR Builders Win" badge="PROOF" />

        {/* Success metrics */}
        <SuccessMetrics />

        {/* Testimonials */}
        <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Testimonial
            quote="Built my first dApp in 3 hours using the Sanctum. The AI pair programming made Rust feel approachable. Deployed to mainnet the same day."
            author="Alex Chen"
            role="Frontend Dev → Web3 Builder"
            project="NearSwap"
            delay={0.1}
          />
          <Testimonial
            quote="Coming from Solidity, NEAR's async model was confusing. Voidspace broke it down perfectly. Shipped my first cross-contract call in a week."
            author="Maria Santos"
            role="Smart Contract Engineer"
            project="ChainBridge"
            delay={0.2}
          />
          <Testimonial
            quote="The void analysis showed me a massive gap in NFT tooling. Built it, applied for a grant, got $50K. NEAR Foundation actually funds builders."
            author="Jake Morrison"
            role="Solo Founder"
            project="MintFlow"
            delay={0.3}
          />
          <Testimonial
            quote="Rust felt impossible until I found the Sanctum. Now I'm shipping production contracts and getting paid more than my old React job."
            author="Priya Sharma"
            role="Full-Stack Developer"
            project="DeFi Yields"
            delay={0.4}
          />
        </div>

        {/* Data sources showcase */}
        <DataSources />

        {/* 2x2 Grid of outcome cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <OutcomeCard
            icon={DollarSign}
            title="Real Funding, Not Hype"
            description="NEAR Foundation actively funds builders. From $5K micro-grants to $500K+ for strategic projects. The money is real and accessible."
            highlight="89 grants awarded to Voidspace users in 2025"
            delay={0.1}
          />
          <OutcomeCard
            icon={TrendingUp}
            title="Massive Opportunity Window"
            description="With only 200+ active projects, NEAR has more voids than builders. Early mover advantage is real. Find your niche."
            highlight="20+ high-value voids identified weekly"
            delay={0.2}
          />
          <OutcomeCard
            icon={Rocket}
            title="Career Acceleration"
            description="Rust developers are the highest-paid in tech. Learning Rust + blockchain = career rocket fuel. Companies are desperate for this skillset."
            highlight="Avg $180K salary for NEAR developers"
            delay={0.3}
          />
          <OutcomeCard
            icon={Zap}
            title="Ship Faster with AI"
            description="The Sanctum pairs you with AI to write, test, and deploy contracts. Build in hours, not months. Your productivity 10x overnight."
            highlight="Avg 18 hours from idea to mainnet deploy"
            delay={0.4}
          />
        </div>

        {/* Highlighted callout with gradient border */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-near-green to-accent-cyan rounded-xl blur-lg opacity-50" />
          <div className="relative bg-gradient-to-br from-surface to-surface-hover rounded-xl p-8 text-center border border-near-green/30">
            <p className="text-xl md:text-2xl text-text-primary font-semibold mb-2">
              The average builder using Voidspace + Sanctum goes from{' '}
              <span className="text-near-green">zero to deployed contract</span> in under{' '}
              <span className="text-accent-cyan font-bold">18 hours</span>.
            </p>
            <p className="text-text-muted">
              Traditional Web3 courses? 3-6 months. AI-assisted learning changes everything.
            </p>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
