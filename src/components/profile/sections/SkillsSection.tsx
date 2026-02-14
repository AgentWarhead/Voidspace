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
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
        🌟 <GradientText>Skill Constellation</GradientText>
      </h2>

      <Link href="/profile/skills" className="block group">
        <Card variant="glass" padding="lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-near-green/10 group-hover:bg-near-green/20 transition-colors">
                <BarChart3 className="w-6 h-6 text-near-green" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-primary group-hover:text-near-green transition-colors">
                  Explore Your Constellation
                </h3>
                <p className="text-sm text-text-muted mt-0.5">
                  View your learning progress across 66 modules, earn XP, and level up
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-text-muted group-hover:text-near-green group-hover:translate-x-1 transition-all" />
          </div>
        </Card>
      </Link>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Modules', value: '66', icon: Sparkles },
          { label: 'Skill Trees', value: '6', icon: BarChart3 },
          { label: 'Max Level', value: '5', icon: ArrowRight },
        ].map(({ label, value, icon: Icon }) => (
          <Card key={label} variant="glass" padding="md" className="text-center">
            <Icon className="w-4 h-4 text-near-green/60 mx-auto mb-1" />
            <div className="text-xl font-bold text-text-primary">{value}</div>
            <div className="text-xs text-text-muted">{label}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}
