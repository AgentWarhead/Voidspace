'use client';

import { motion } from 'framer-motion';
import { 
  Database, 
  Search, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { SectionHeader } from '@/components/effects/SectionHeader';
import { Container } from '@/components/ui';

const STEPS = [
  {
    title: 'Ecosystem Scan',
    description: 'We ingest real-time data from DefiLlama, NearBlocks, and GitHub to map every active project on NEAR.',
    icon: Database,
    color: 'text-cyan-400',
    bg: 'bg-cyan-400/10',
    border: 'border-cyan-400/20'
  },
  {
    title: 'Gap Analysis',
    description: 'Our engine compares NEAR against mature ecosystems (Solana, Base) to spot missing primitives and tools.',
    icon: Search,
    color: 'text-purple-400',
    bg: 'bg-purple-400/10',
    border: 'border-purple-400/20'
  },
  {
    title: 'AI Verification',
    description: 'We verify that no active project is currently solving the problem before marking it as a verified Void.',
    icon: ShieldCheck,
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    border: 'border-emerald-400/20'
  }
];

export function VoidMethodology() {
  return (
    <section className="py-12 sm:py-20 border-y border-white/[0.02] bg-white/[0.01]">
      <Container size="xl">
        <SectionHeader 
          title="The Methodology" 
          badge="HOW IT WORKS"
        />
        
        <div className="max-w-3xl mx-auto text-center mb-12">
          <p className="text-text-secondary">
            Voids aren't random ideas. They are <span className="text-text-primary font-semibold">calculated gaps</span> derived from cross-chain data and verified against the live NEAR ecosystem.
          </p>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-cyan-400/20 via-purple-400/20 to-emerald-400/20" />

          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative z-10 flex flex-col items-center text-center"
              >
                {/* Icon Circle */}
                <div className={`w-24 h-24 rounded-2xl ${step.bg} ${step.border} border backdrop-blur-sm flex items-center justify-center mb-6 shadow-lg shadow-black/20 group hover:scale-105 transition-transform duration-300`}>
                  <Icon className={`w-10 h-10 ${step.color}`} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-text-primary mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed max-w-xs">
                  {step.description}
                </p>

                {/* Mobile Connector Arrow (except last) */}
                {i < STEPS.length - 1 && (
                  <div className="md:hidden mt-8 mb-2">
                    <ArrowRight className="w-6 h-6 text-white/10 rotate-90" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Trust Badge */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-16 flex justify-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-near-green/5 border border-near-green/10">
            <CheckCircle2 className="w-4 h-4 text-near-green" />
            <span className="text-xs font-mono text-near-green tracking-wide uppercase">
              100% Data-Backed Intelligence
            </span>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
