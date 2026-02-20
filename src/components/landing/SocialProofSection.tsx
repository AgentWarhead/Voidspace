import { Cpu, BookOpen, Search, BarChart3 } from 'lucide-react';

interface SocialProofSectionProps {
  totalProjects: number;
  totalOpportunities: number;
}

const signals = [
  'The only AI-native intelligence platform built for NEAR Protocol',
  'Powered by Claude AI · DexScreener · NEAR Protocol data',
  '66 free learning modules — the most complete NEAR dev curriculum available',
];

export function SocialProofSection({ totalProjects, totalOpportunities }: SocialProofSectionProps) {
  const stats = [
    { value: totalProjects > 0 ? `${totalProjects}+` : '300+', label: 'Projects Analyzed', icon: Search },
    { value: totalOpportunities > 0 ? String(totalOpportunities) : '70+', label: 'Voids Detected', icon: Cpu },
    { value: '66', label: 'Learning Modules', icon: BookOpen },
    { value: '150+', label: 'Tokens Tracked', icon: BarChart3 },
  ];

  return (
    <section>
      <div className="relative overflow-hidden rounded-2xl border border-border/40">
        {/* Subtle background */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 50% 50%, rgba(0,236,151,0.04) 0%, transparent 70%)',
          }}
        />
        <div className="absolute inset-0 bg-surface/20" />

        <div className="relative z-10 py-8 sm:py-10 px-4 sm:px-6 md:px-10">
          {/* Stats bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-8 max-w-3xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center group">
                <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-1">
                  <stat.icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-near-green/50" />
                  <span className="text-lg sm:text-xl md:text-2xl font-bold font-mono text-text-primary">
                    {stat.value}
                  </span>
                </div>
                <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-border/60 to-transparent mb-8" />

          {/* Builder signals */}
          <div className="flex flex-col items-center justify-center gap-3 sm:gap-4">
            {signals.map((signal, i) => (
              <div key={i} className="flex items-center gap-3">
                {i > 0 && (
                  <span className="hidden sm:block w-1 h-1 rounded-full bg-near-green/30 shrink-0" />
                )}
                <p className="text-[10px] sm:text-xs text-text-muted font-mono text-center leading-relaxed">
                  {signal}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
