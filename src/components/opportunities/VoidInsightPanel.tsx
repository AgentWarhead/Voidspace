'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Clock, Coins, Zap, ChevronRight, RefreshCw, Eye, TrendingUp, Shield } from 'lucide-react';
import type { VoidEnrichment } from '@/types';

interface VoidInsightPanelProps {
  opportunityId: string;
  opportunityTitle: string;
}

function PersonaEmoji({ emoji, type }: { emoji: string; type: string }) {
  // Color map by persona type keyword
  const colors: Record<string, { border: string; bg: string; text: string }> = {
    'Weekend': { border: 'border-near-green/30', bg: 'bg-near-green/[0.06]', text: 'text-near-green' },
    'DeFi': { border: 'border-cyan-400/30', bg: 'bg-cyan-400/[0.06]', text: 'text-cyan-400' },
    'NEAR': { border: 'border-violet-400/30', bg: 'bg-violet-400/[0.06]', text: 'text-violet-400' },
    'Indie': { border: 'border-amber-400/30', bg: 'bg-amber-400/[0.06]', text: 'text-amber-400' },
    'Protocol': { border: 'border-rose-400/30', bg: 'bg-rose-400/[0.06]', text: 'text-rose-400' },
    'Web2': { border: 'border-blue-400/30', bg: 'bg-blue-400/[0.06]', text: 'text-blue-400' },
    'NFT': { border: 'border-pink-400/30', bg: 'bg-pink-400/[0.06]', text: 'text-pink-400' },
    'Creative': { border: 'border-pink-400/30', bg: 'bg-pink-400/[0.06]', text: 'text-pink-400' },
  };
  const key = Object.keys(colors).find((k) => type.includes(k)) || 'Weekend';
  return colors[key];
}

// Loading skeleton
function InsightSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Hook skeleton */}
      <div className="h-8 bg-white/[0.06] rounded-lg w-3/4 mx-auto" />
      <div className="h-4 bg-white/[0.04] rounded w-full" />
      <div className="h-4 bg-white/[0.04] rounded w-5/6" />
      {/* Persona skeletons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-28 bg-white/[0.04] rounded-xl border border-white/[0.06]" />
        ))}
      </div>
    </div>
  );
}

export function VoidInsightPanel({ opportunityId, opportunityTitle }: VoidInsightPanelProps) {
  const [enrichment, setEnrichment] = useState<VoidEnrichment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchEnrichment = async (force = false) => {
    if (force) setIsRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const url = `/api/voids/${opportunityId}/enrich${force ? '?force=1' : ''}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to load insights');
      const data = await res.json();
      setEnrichment(data.enrichment);
    } catch {
      setError('Could not load AI insights. The void is still valid — insights are decorative enrichment.');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEnrichment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opportunityId]);

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#070c12]/80 backdrop-blur-xl overflow-hidden">
      {/* Header bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06] bg-gradient-to-r from-[#00EC97]/[0.04] to-transparent">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-near-green" />
          <span className="text-xs font-mono uppercase tracking-[0.18em] text-near-green font-semibold">AI Void Intelligence</span>
          <span className="text-[10px] font-mono text-text-muted/50 hidden sm:inline">· Powered by Claude</span>
        </div>
        {!loading && enrichment && (
          <button
            onClick={() => fetchEnrichment(true)}
            disabled={isRefreshing}
            className="flex items-center gap-1 text-[10px] font-mono text-text-muted/50 hover:text-text-muted transition-colors disabled:opacity-40"
          >
            <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        )}
      </div>

      <div className="p-5 sm:p-6 space-y-6">
        {loading && <InsightSkeleton />}

        {error && (
          <p className="text-xs text-text-muted text-center py-4">{error}</p>
        )}

        {!loading && enrichment && (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {/* ── HOOK + VISION ── */}
            <div className="text-center space-y-2">
              <p className="text-lg sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00EC97] via-cyan-300 to-[#00D4FF] leading-tight">
                &ldquo;{enrichment.hook}&rdquo;
              </p>
              <p className="text-sm text-text-secondary leading-relaxed max-w-2xl mx-auto">
                {enrichment.vision}
              </p>
            </div>

            {/* ── WHO SHOULD BUILD THIS ── */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Eye className="w-4 h-4 text-text-muted/60" />
                <h3 className="text-xs font-mono uppercase tracking-[0.18em] text-text-muted/70 font-semibold">Who Should Build This</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {enrichment.personas.map((persona, i) => {
                  const colors = PersonaEmoji({ emoji: persona.emoji, type: persona.type });
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className={`rounded-xl border ${colors.border} ${colors.bg} p-4 space-y-2`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{persona.emoji}</span>
                        <span className={`text-xs font-bold font-mono ${colors.text}`}>{persona.type}</span>
                      </div>
                      <p className="text-xs text-text-secondary leading-snug">{persona.fit}</p>
                      <div className="flex items-center gap-1.5 pt-1 flex-wrap">
                        <Clock className="w-3 h-3 text-text-muted/50 shrink-0" />
                        <span className="text-[10px] font-mono text-text-muted/60">{persona.timeToMVP}</span>
                        <span className="text-text-muted/20 text-[10px]">·</span>
                        <span className="text-[10px] text-text-muted/50 truncate">{persona.skillsNeeded}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* ── BUILD ANGLES ── */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-4 h-4 text-text-muted/60" />
                <h3 className="text-xs font-mono uppercase tracking-[0.18em] text-text-muted/70 font-semibold">How to Build It</h3>
              </div>
              <div className="space-y-3">
                {enrichment.buildAngles.map((angle, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.07 }}
                    className="flex items-start gap-4 p-4 rounded-xl border border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                  >
                    <div className="shrink-0 w-6 h-6 rounded-full bg-near-green/15 border border-near-green/25 flex items-center justify-center mt-0.5">
                      <span className="text-[11px] font-bold text-near-green">{i + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-text-primary">{angle.title}</span>
                        <span className="text-[10px] font-mono text-near-green/70 bg-near-green/[0.08] px-2 py-0.5 rounded-full shrink-0">
                          {angle.timeToMVP}
                        </span>
                      </div>
                      <p className="text-xs text-text-secondary leading-relaxed">{angle.description}</p>
                      <div className="flex items-center gap-1 text-[10px] font-mono text-cyan-400/60">
                        <ChevronRight className="w-3 h-3" />
                        <span className="italic">{angle.inspiration}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* ── REVENUE + MOAT ── row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Revenue */}
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="p-4 rounded-xl border border-amber-400/15 bg-amber-400/[0.04] space-y-2"
              >
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-mono uppercase tracking-[0.15em] text-amber-400/70 font-semibold">Revenue Model</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-bold text-amber-300">{enrichment.revenue.model}</span>
                  <span className="text-xs font-mono text-amber-400/60">{enrichment.revenue.potential}</span>
                </div>
                <p className="text-xs text-text-secondary leading-snug">{enrichment.revenue.howTo}</p>
              </motion.div>

              {/* Moat */}
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="p-4 rounded-xl border border-violet-400/15 bg-violet-400/[0.04] space-y-2"
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-violet-400" />
                  <span className="text-xs font-mono uppercase tracking-[0.15em] text-violet-400/70 font-semibold">Your Moat</span>
                </div>
                <p className="text-sm text-text-secondary leading-snug">{enrichment.moat}</p>
              </motion.div>
            </div>

            {/* ── QUICK START ── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="p-4 rounded-xl border border-cyan-400/15 bg-cyan-400/[0.03]"
            >
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-mono uppercase tracking-[0.18em] text-cyan-400/70 font-semibold">Your First 30 Days</h3>
              </div>
              <ol className="space-y-2">
                {enrichment.quickStart.map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="shrink-0 w-5 h-5 rounded-full bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center mt-0.5">
                      <span className="text-[10px] font-bold text-cyan-400">{i + 1}</span>
                    </span>
                    <span className="text-xs text-text-secondary leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
