'use client';

import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';

/* Per-card theming — chain-specific colors and accents */
const CARD_THEMES = [
  {
    // Rust for Blockchain — universal/foundational, warm orange
    gradient: 'from-orange-500/12 via-amber-500/5 to-transparent',
    glow: 'group-hover:shadow-[0_0_35px_rgba(251,146,60,0.12)]',
    borderHover: 'hover:border-orange-400/20',
    accentColor: 'text-orange-400',
    tagBg: 'bg-orange-400/10 text-orange-400 border-orange-400/20',
    tag: 'universal',
  },
  {
    // Solana vs NEAR — comparison, dual-color (Solana purple + NEAR green)
    gradient: 'from-purple-500/12 via-near-green/5 to-transparent',
    glow: 'group-hover:shadow-[0_0_35px_rgba(167,139,250,0.12)]',
    borderHover: 'hover:border-purple-400/20',
    accentColor: 'text-purple-400',
    tagBg: 'bg-purple-400/10 text-purple-400 border-purple-400/20',
    tag: 'comparison',
  },
  {
    // For Solana Developers — welcoming, Solana purple fading to NEAR green
    gradient: 'from-purple-500/10 via-near-green/8 to-transparent',
    glow: 'group-hover:shadow-[0_0_35px_rgba(0,236,151,0.12)]',
    borderHover: 'hover:border-near-green/20',
    accentColor: 'text-near-green',
    tagBg: 'bg-near-green/10 text-near-green border-near-green/20',
    tag: 'migration',
  },
];

interface CrossChainCard {
  emoji: string;
  title: string;
  description: string;
  href: string;
}

export function CrossChainSection({ cards }: { cards: CrossChainCard[] }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <div ref={ref}>
      {/* Section intro with terminal accent */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mb-5">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface/60 border border-white/[0.06] font-mono text-xs text-text-muted flex-shrink-0">
          <span className="text-near-green">$</span>
          <span>your_rust_skills</span>
          <span className="text-near-green animate-pulse">→</span>
          <span className="text-near-green">NEAR</span>
        </div>
        <p className="text-sm text-text-muted">
          Coming from another Rust chain? Your skills transfer directly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
        {cards.map((card, i) => {
          const theme = CARD_THEMES[i];
          return (
            <motion.div
              key={card.href}
              initial={{ opacity: 0, y: 25, scale: 0.96 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{
                duration: 0.5,
                delay: 0.15 + i * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Link href={card.href} className="block group h-full">
                <div
                  className={`
                    relative h-full overflow-hidden rounded-2xl
                    backdrop-blur-sm bg-surface/40 border border-white/[0.06]
                    transition-all duration-500 ease-out
                    group-hover:scale-[1.02] group-hover:border-white/[0.12]
                    ${theme.glow} ${theme.borderHover}
                    p-6
                  `}
                >
                  {/* Background gradient */}
                  <div
                    className={`
                      absolute inset-0 bg-gradient-to-br ${theme.gradient}
                      opacity-60 group-hover:opacity-100 transition-opacity duration-500
                    `}
                  />

                  {/* Code-themed background pattern */}
                  <div
                    className="absolute inset-0 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-500"
                    style={{
                      backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 23px, rgba(255,255,255,0.3) 23px, rgba(255,255,255,0.3) 24px)`,
                    }}
                  />

                  {/* Content */}
                  <div className="relative z-10 flex flex-col h-full">
                    {/* Top row: emoji + tag */}
                    <div className="flex items-start justify-between mb-4">
                      <span className="text-3xl group-hover:scale-110 transition-transform duration-300 inline-block">
                        {card.emoji}
                      </span>
                      <span
                        className={`
                          text-[10px] font-mono uppercase tracking-wider
                          px-2 py-0.5 rounded-full border
                          ${theme.tagBg}
                        `}
                      >
                        {theme.tag}
                      </span>
                    </div>

                    {/* Title — monospace hint for dev feel */}
                    <h3 className="text-lg font-bold text-text-primary group-hover:text-near-green transition-colors duration-300">
                      {card.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-text-muted mt-2 leading-relaxed flex-1">
                      {card.description}
                    </p>

                    {/* CTA with code accent */}
                    <div className="flex items-center gap-2 mt-4 text-sm font-mono text-text-muted group-hover:text-near-green transition-colors duration-300">
                      <span className="text-xs opacity-60 group-hover:opacity-100">{'>'}</span>
                      <span>explore</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
