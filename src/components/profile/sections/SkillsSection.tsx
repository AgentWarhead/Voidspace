/* ─── SkillsSection — Skill Constellation link card ──────────
 * Preview card linking to /profile/skills.
 * ────────────────────────────────────────────────────────────── */

'use client';

import Link from 'next/link';
import { BarChart3, ArrowRight, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { GradientText } from '@/components/effects/GradientText';

export function SkillsSection() {
  return (
    <div className="space-y-3 sm:space-y-4 min-w-0 overflow-x-hidden">
      <h2 className="text-base sm:text-lg font-semibold text-text-primary flex items-center gap-2">
        🌟 <GradientText>Skill Constellation</GradientText>
      </h2>

      <Link href="/profile/skills" className="block group min-h-[44px] active:scale-[0.97] transition-transform">
        <Card variant="glass" padding="lg" className="p-4 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <div className="p-2.5 sm:p-3 rounded-xl bg-near-green/10 group-hover:bg-near-green/20 transition-colors flex-shrink-0">
                <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-near-green" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm sm:text-lg font-semibold text-text-primary group-hover:text-near-green transition-colors break-words">
                  Explore Your Constellation
                </h3>
                <p className="text-xs sm:text-sm text-text-muted mt-0.5 break-words">
                  View your learning progress across 66 modules, earn XP, and level up
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-text-muted group-hover:text-near-green group-hover:translate-x-1 transition-all flex-shrink-0" />
          </div>
        </Card>
      </Link>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {[
          { label: 'Modules', value: '66', icon: Sparkles },
          { label: 'Skill Trees', value: '6', icon: BarChart3 },
          { label: 'Max Level', value: '5', icon: ArrowRight },
        ].map(({ label, value, icon: Icon }) => (
          <Card key={label} variant="glass" padding="md" className="text-center p-3 sm:p-4 min-w-0">
            <Icon className="w-4 h-4 text-near-green/60 mx-auto mb-1" />
            <div className="text-lg sm:text-xl font-bold text-text-primary">{value}</div>
            <div className="text-xs text-text-muted">{label}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}
