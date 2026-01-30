import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { VoidspaceLogo } from '@/components/brand/VoidspaceLogo';
import { GridPattern } from '@/components/effects/GridPattern';

export function Footer() {
  return (
    <footer className="relative bg-background overflow-hidden">
      {/* Gradient top border */}
      <div className="h-px bg-gradient-to-r from-transparent via-near-green/30 to-transparent" />

      <GridPattern className="opacity-10" />

      <Container>
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 items-center py-8 gap-6">
          {/* Logo + tagline */}
          <div className="flex items-center gap-3">
            <VoidspaceLogo size="sm" animate={false} />
            <div>
              <span className="text-sm font-semibold text-gradient">Voidspace</span>
              <p className="text-[10px] text-text-muted">
                AI-powered ecosystem scanner
              </p>
            </div>
          </div>

          {/* Quick links */}
          <div className="flex items-center justify-center gap-4">
            <Link href="/categories" className="text-xs text-text-muted hover:text-text-secondary transition-colors">
              Categories
            </Link>
            <Link href="/opportunities" className="text-xs text-text-muted hover:text-text-secondary transition-colors">
              Opportunities
            </Link>
            <Link href="/profile" className="text-xs text-text-muted hover:text-text-secondary transition-colors">
              Profile
            </Link>
          </div>

          {/* Competition badge */}
          <div className="flex items-center justify-end gap-2">
            <span className="text-[10px] font-mono text-text-muted">
              &copy; {new Date().getFullYear()}
            </span>
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-near-green/60 bg-near-green/10 px-2 py-0.5 rounded-full border border-near-green/20">
              NEARCON 2026
            </span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
