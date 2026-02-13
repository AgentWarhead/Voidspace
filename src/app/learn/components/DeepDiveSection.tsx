'use client';

import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';

const CARD_GRADIENTS = [
  'from-near-green/15 via-emerald-500/5 to-transparent',   // Wallet Setup
  'from-cyan-400/15 via-blue-500/5 to-transparent',        // Key Technologies
  'from-orange-400/15 via-red-500/5 to-transparent',       // Why Rust
  'from-purple-400/15 via-indigo-500/5 to-transparent',    // Rust Curriculum
];

const CARD_GLOW_COLORS = [
  'group-hover:shadow-[0_0_40px_rgba(0,236,151,0.15)]',
  'group-hover:shadow-[0_0_40px_rgba(34,211,238,0.15)]',
  'group-hover:shadow-[0_0_40px_rgba(251,146,60,0.15)]',
  'group-hover:shadow-[0_0_40px_rgba(167,139,250,0.15)]',
];

const CARD_BORDER_HOVER = [
  'hover:border-near-green/20',
  'hover:border-cyan-400/20',
  'hover:border-orange-400/20',
  'hover:border-purple-400/20',
];

interface DeepDiveCard {
  emoji: string;
  title: string;
  description: string;
  href: string;
}

export function DeepDiveSection({ cards }: { cards: DeepDiveCard[] }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
      {cards.map((card, i) => {
        const isLarge = i < 2; // First two cards are featured (bigger)
        return (
          <motion.div
            key={card.href}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{
              duration: 0.5,
              delay: i * 0.1,
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
                  ${CARD_GLOW_COLORS[i]} ${CARD_BORDER_HOVER[i]}
                  ${isLarge ? 'p-7 md:p-8' : 'p-6 md:p-7'}
                `}
              >
                {/* Background gradient overlay */}
                <div
                  className={`
                    absolute inset-0 bg-gradient-to-br ${CARD_GRADIENTS[i]}
                    opacity-50 group-hover:opacity-80 transition-opacity duration-500
                  `}
                />

                {/* Subtle grid pattern */}
                <div
                  className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-500"
                  style={{
                    backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)`,
                    backgroundSize: '24px 24px',
                  }}
                />

                {/* Content */}
                <div className="relative z-10 flex flex-col h-full">
                  {/* Emoji */}
                  <span
                    className={`
                      ${isLarge ? 'text-4xl md:text-5xl' : 'text-3xl md:text-4xl'}
                      mb-4 block
                      group-hover:scale-110 transition-transform duration-300 origin-left
                    `}
                  >
                    {card.emoji}
                  </span>

                  {/* Title */}
                  <h3
                    className={`
                      ${isLarge ? 'text-xl md:text-2xl' : 'text-lg md:text-xl'}
                      font-bold text-text-primary
                      group-hover:text-near-green transition-colors duration-300
                    `}
                  >
                    {card.title}
                  </h3>

                  {/* Description */}
                  <p
                    className={`
                      ${isLarge ? 'text-sm md:text-base' : 'text-sm'}
                      text-text-muted mt-2 leading-relaxed flex-1
                    `}
                  >
                    {card.description}
                  </p>

                  {/* CTA */}
                  <div className="flex items-center gap-2 mt-4 text-sm text-text-muted group-hover:text-near-green transition-colors duration-300">
                    <span className="font-medium">Explore</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
