'use client';

import { useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import {
  Rocket, Sparkles, ArrowRight, Zap, Users, Target,
  BookOpen, Eye,
} from 'lucide-react';
import { GradientText } from '@/components/effects/GradientText';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

/* ─── Constellation Background ─────────────────────────────── */

function ConstellationBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  interface Star {
    x: number;
    y: number;
    size: number;
    speed: number;
    alpha: number;
    color: string;
  }

  const starsRef = useRef<Star[]>([]);

  const init = useCallback(() => {
    const colors = [
      'rgba(0,236,151,',
      'rgba(0,212,255,',
      'rgba(192,132,252,',
      'rgba(255,255,255,',
    ];
    const stars: Star[] = [];
    for (let i = 0; i < 80; i++) {
      stars.push({
        x: Math.random(),
        y: Math.random(),
        size: 0.5 + Math.random() * 2,
        speed: 0.0002 + Math.random() * 0.0008,
        alpha: 0.2 + Math.random() * 0.6,
        color: colors[i % colors.length],
      });
    }
    starsRef.current = stars;
  }, []);

  useEffect(() => {
    init();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    let frame = 0;
    const draw = () => {
      frame++;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      const stars = starsRef.current;

      // Draw connections between nearby stars
      ctx.lineWidth = 0.3;
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const dx = (stars[i].x - stars[j].x) * w;
          const dy = (stars[i].y - stars[j].y) * h;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            const alpha = (1 - dist / 100) * 0.08;
            ctx.strokeStyle = `rgba(0, 236, 151, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(stars[i].x * w, stars[i].y * h);
            ctx.lineTo(stars[j].x * w, stars[j].y * h);
            ctx.stroke();
          }
        }
      }

      // Draw and move stars
      for (const star of stars) {
        const pulse = Math.sin(frame * 0.02 + star.x * 10) * 0.3;
        const alpha = Math.max(0.1, star.alpha + pulse);

        ctx.beginPath();
        ctx.arc(star.x * w, star.y * h, star.size, 0, Math.PI * 2);
        ctx.fillStyle = star.color + `${alpha})`;
        ctx.fill();

        // Subtle drift
        star.y -= star.speed;
        if (star.y < -0.01) star.y = 1.01;
      }

      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animRef.current);
    };
  }, [init]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}

/* ─── Animated Stats Ticker ────────────────────────────────── */

function StatsTicker() {
  const stats = [
    { icon: Target, value: '47+', label: 'voids discovered today', color: 'text-near-green' },
    { icon: Users, value: '380+', label: 'builders active this week', color: 'text-accent-cyan' },
    { icon: Zap, value: '12', label: 'briefs generated today', color: 'text-purple-400' },
  ];

  return (
    <motion.div
      className="flex items-center justify-center gap-6 flex-wrap"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.5 }}
    >
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            className="flex items-center gap-2 text-sm"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3, delay: i * 1, repeat: Infinity }}
          >
            <Icon className={cn('w-3.5 h-3.5', stat.color)} />
            <span className={cn('font-bold font-mono', stat.color)}>{stat.value}</span>
            <span className="text-text-muted">{stat.label}</span>
            {i < stats.length - 1 && (
              <span className="text-border ml-4 hidden sm:inline">|</span>
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
}

/* ─── Pulsing CTA Button ───────────────────────────────────── */

function PulsingButton({
  children,
  href,
  variant,
}: {
  children: React.ReactNode;
  href: string;
  variant: 'primary' | 'secondary' | 'ghost';
}) {
  const styles = {
    primary: {
      bg: 'bg-near-green',
      text: 'text-background',
      shadow: 'shadow-[0_0_30px_rgba(0,236,151,0.3)]',
      pulse: 'rgba(0, 236, 151, 0.4)',
      buttonVariant: 'primary' as const,
    },
    secondary: {
      bg: 'bg-surface',
      text: 'text-text-primary',
      shadow: 'shadow-[0_0_20px_rgba(0,212,255,0.2)]',
      pulse: 'rgba(0, 212, 255, 0.3)',
      buttonVariant: 'secondary' as const,
    },
    ghost: {
      bg: 'bg-transparent',
      text: 'text-text-secondary',
      shadow: '',
      pulse: 'rgba(168, 85, 247, 0.2)',
      buttonVariant: 'ghost' as const,
    },
  };

  const s = styles[variant];

  return (
    <Link href={href}>
      <motion.div
        className="relative"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {variant === 'primary' && (
          <motion.div
            className="absolute -inset-1 rounded-lg opacity-50"
            style={{ background: s.pulse }}
            animate={{
              opacity: [0.15, 0.4, 0.15],
              scale: [1, 1.05, 1],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
        <Button
          variant={s.buttonVariant}
          size="lg"
          className={cn(
            'relative font-bold text-base px-8 py-4',
            variant === 'primary' && cn(s.bg, s.text, s.shadow),
            variant === 'ghost' && 'border border-border/50 hover:border-near-green/30',
          )}
        >
          {children}
        </Button>
      </motion.div>
    </Link>
  );
}

/* ─── Main BottomCTA ───────────────────────────────────────── */

export default function BottomCTA() {
  return (
    <section id="cta" className="relative py-32 md:py-40 overflow-hidden">
      {/* Multi-layer background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-surface to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,rgba(0,236,151,0.08),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_30%_60%,rgba(0,212,255,0.04),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_70%_40%,rgba(168,85,247,0.04),transparent)]" />
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(0,236,151,0.06), transparent)',
              'radial-gradient(ellipse 90% 60% at 50% 50%, rgba(0,236,151,0.12), transparent)',
              'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(0,236,151,0.06), transparent)',
            ],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Constellation particles */}
      <ConstellationBg />

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-4xl mx-auto text-center px-6"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        {/* Badge */}
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-near-green/10 border border-near-green/20 text-near-green text-sm font-medium mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          >
            <Zap className="w-4 h-4" />
          </motion.div>
          The Final Push
        </motion.div>

        {/* Headline */}
        <GradientText as="h2" animated className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          The Void Won&apos;t Fill Itself
        </GradientText>

        {/* Subtext */}
        <motion.p
          className="text-text-secondary text-lg md:text-xl leading-relaxed mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <span className="text-near-green font-semibold">380+ builders</span> are already shipping on NEAR.
          Every day you wait, someone else fills your void. The tools are ready. The AI is standing by.
          The only missing piece is <span className="text-text-primary font-semibold">you</span>.
        </motion.p>

        {/* Stats Ticker */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <StatsTicker />
        </motion.div>

        {/* Three CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <PulsingButton href="#tracks" variant="primary">
            <BookOpen className="w-5 h-5 mr-1.5" />
            Start Learning
          </PulsingButton>

          <PulsingButton href="/opportunities" variant="secondary">
            <Eye className="w-5 h-5 mr-1.5" />
            Explore Opportunities
            <ArrowRight className="w-5 h-5 ml-1" />
          </PulsingButton>

          <PulsingButton href="/sanctum" variant="ghost">
            <Sparkles className="w-5 h-5 mr-1.5" />
            Enter the Sanctum
          </PulsingButton>
        </motion.div>

        {/* Fine print */}
        <motion.p
          className="mt-8 text-xs text-text-muted/60"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7 }}
        >
          Free to start · 3 Void Briefs per month · No credit card required · AI-powered by Claude
        </motion.p>
      </motion.div>
    </section>
  );
}
