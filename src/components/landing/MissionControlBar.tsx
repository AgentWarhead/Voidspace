// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Layers, GraduationCap, Database, Radio } from 'lucide-react';
import { Container } from '@/components/ui';

const stats = [
  { value: '20+', label: 'CATEGORIES ANALYZED', icon: Layers, delay: '0s' },
  { value: '66', label: 'LEARNING MODULES', icon: GraduationCap, delay: '0.5s' },
  { value: '8', label: 'DATA SOURCES', icon: Database, delay: '1s' },
  { value: 'LIVE', label: 'REAL-TIME INTEL', icon: Radio, delay: '1.5s' },
];

export function MissionControlBar() {
  return (
    <div className="relative overflow-hidden border-y border-near-green/10">
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,236,151,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,236,151,0.5) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(90deg, rgba(0,236,151,0.03) 0%, rgba(0,212,255,0.05) 50%, rgba(0,236,151,0.03) 100%)',
        }}
      />
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

      <Container size="xl" className="relative z-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="group relative text-center py-5 px-3 transition-all duration-300 hover:bg-near-green/[0.03]"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-0 group-hover:w-3/4 bg-gradient-to-r from-transparent via-near-green/50 to-transparent transition-all duration-500" />
              <div className="flex items-center justify-center gap-2 mb-1.5">
                <stat.icon
                  className="w-3.5 h-3.5 text-near-green/60 group-hover:text-near-green transition-colors duration-300"
                  style={{ animation: `pulse 3s ease-in-out ${stat.delay} infinite` }}
                />
                <span
                  className="text-xl sm:text-2xl font-bold font-mono text-text-primary group-hover:text-near-green transition-colors duration-300"
                  style={{ textShadow: '0 0 20px rgba(0,236,151,0.0)', transition: 'text-shadow 0.3s' }}
                >
                  {stat.value}
                </span>
              </div>
              <div className="text-[9px] sm:text-[10px] text-text-muted font-mono tracking-[0.2em] uppercase group-hover:text-text-secondary transition-colors duration-300">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
