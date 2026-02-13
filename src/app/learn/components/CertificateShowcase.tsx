'use client';

import { motion } from 'framer-motion';
// @ts-ignore
import { Award, ArrowRight, Shield, ExternalLink, Compass, Hammer, Crown } from 'lucide-react';
import { SectionHeader } from '@/components/effects/SectionHeader';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { GlowCard } from '@/components/effects/GlowCard';
import { GradientText } from '@/components/effects/GradientText';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

/* ─── Certificate Data ─────────────────────────────────────── */

const CERTIFICATES = [
  {
    track: 'Explorer',
    icon: Compass,
    color: 'emerald',
    borderGradient: 'from-emerald-500/40 via-emerald-400/20 to-emerald-500/40',
    iconColor: 'text-emerald-400',
    bgGlow: 'bg-emerald-500/5',
  },
  {
    track: 'Builder',
    icon: Hammer,
    color: 'cyan',
    borderGradient: 'from-cyan-500/40 via-cyan-400/20 to-cyan-500/40',
    iconColor: 'text-cyan-400',
    bgGlow: 'bg-cyan-500/5',
  },
  {
    track: 'Hacker',
    icon: Shield,
    color: 'violet',
    borderGradient: 'from-violet-500/40 via-violet-400/20 to-violet-500/40',
    iconColor: 'text-violet-400',
    bgGlow: 'bg-violet-500/5',
  },
  {
    track: 'Founder',
    icon: Crown,
    color: 'amber',
    borderGradient: 'from-amber-500/40 via-amber-400/20 to-amber-500/40',
    iconColor: 'text-amber-400',
    bgGlow: 'bg-amber-500/5',
  },
];

/* ─── Certificate Card ─────────────────────────────────────── */

function CertificateCard({
  track,
  icon: Icon,
  borderGradient,
  iconColor,
  bgGlow,
  index,
}: (typeof CERTIFICATES)[number] & { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="relative group">
        {/* Animated border */}
        <div className={cn(
          'absolute -inset-[1px] rounded-xl bg-gradient-to-r opacity-50 group-hover:opacity-100 transition-opacity duration-500 blur-[1px]',
          borderGradient
        )} />

        {/* Card content */}
        <div className={cn(
          'relative rounded-xl p-5 backdrop-blur-sm border border-white/5',
          bgGlow
        )}>
          {/* Mini certificate preview */}
          <div className="bg-background/60 rounded-lg p-4 mb-4 border border-white/5">
            <div className="flex items-center justify-center mb-3">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500/30 to-cyan-500/30 flex items-center justify-center">
                <span className="text-[8px] font-bold text-emerald-400">V</span>
              </div>
            </div>
            <div className="text-center space-y-1.5">
              <p className="text-[9px] uppercase tracking-[0.2em] text-text-muted">Certificate of Completion</p>
              <div className="h-px w-12 mx-auto bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <p className="text-xs font-semibold text-text-primary">NEAR {track} Track</p>
              <p className="text-[9px] text-text-muted">Voidspace Academy</p>
            </div>
          </div>

          {/* Track info */}
          <div className="flex items-center gap-2">
            <Icon className={cn('w-4 h-4', iconColor)} />
            <span className="text-sm font-medium text-text-primary">{track}</span>
          </div>
          <p className="text-[11px] text-text-muted mt-1">
            Shareable credential
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Legend Card ───────────────────────────────────────────── */

function LegendCard() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="md:col-span-2 lg:col-span-4"
    >
      <div className="relative group">
        {/* Gold animated border */}
        <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-yellow-500/50 via-amber-400/30 to-yellow-500/50 opacity-60 group-hover:opacity-100 transition-opacity duration-500 blur-[1px]" />
        <div className="absolute -inset-[2px] rounded-xl bg-gradient-to-r from-yellow-500/20 via-amber-400/10 to-yellow-500/20 opacity-0 group-hover:opacity-60 transition-opacity duration-500 blur-md" />

        {/* Card */}
        <div className="relative rounded-xl p-6 md:p-8 bg-gradient-to-br from-yellow-500/5 via-background to-amber-500/5 border border-yellow-500/10 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Icon */}
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 flex items-center justify-center shadow-lg shadow-yellow-500/10">
                <Award className="w-8 h-8 text-yellow-400" />
              </div>
              {/* Glow ring */}
              <div className="absolute -inset-2 rounded-2xl border border-yellow-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Text */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                <h4 className="text-xl font-bold text-yellow-400">Legend Status</h4>
                <span className="text-xs font-mono text-yellow-500/80 bg-yellow-500/10 px-2 py-0.5 rounded-full border border-yellow-500/20">
                  ULTIMATE
                </span>
              </div>
              <p className="text-sm text-text-secondary max-w-lg">
                Complete all four tracks to earn the <strong className="text-yellow-400">Legend</strong> certificate —
                the ultimate proof that you&apos;ve mastered the NEAR ecosystem from exploration to deployment.
              </p>
              <div className="flex items-center justify-center md:justify-start gap-4 mt-3">
                <span className="text-xs text-text-muted">4 tracks × 66 modules = 1 Legend</span>
              </div>
            </div>

            {/* CTA */}
            <Link href="/learn/certificate" className="flex-shrink-0">
              <Button variant="primary" size="sm" className="group bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 border-yellow-500/30">
                Earn Yours
                <ArrowRight className="w-3 h-3 ml-1.5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Main Component ───────────────────────────────────────── */

export function CertificateShowcase() {
  return (
    <ScrollReveal>
      <div id="certificates">
        <SectionHeader title="Earn Your Certificate" badge="CREDENTIALS" />

        <div className="text-center mb-8">
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Not just a badge — a <GradientText className="font-bold">genuine achievement</GradientText>.
            Prove your NEAR expertise with shareable certificates for every track.
          </p>
        </div>

        {/* Certificate Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {CERTIFICATES.map((cert, i) => (
            <CertificateCard key={cert.track} {...cert} index={i} />
          ))}
        </div>

        {/* Legend Card */}
        <div className="grid grid-cols-1">
          <LegendCard />
        </div>
      </div>
    </ScrollReveal>
  );
}
