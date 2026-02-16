import { Container } from '@/components/ui/Container';
import { GridPattern } from '@/components/effects/GridPattern';
import Link from 'next/link';

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-void-black relative overflow-hidden">
      <GridPattern className="opacity-[0.07]" />
      
      <Container size="md" className="relative z-10 py-10 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 sm:mb-8 flex items-center gap-2 text-sm text-text-muted">
          <Link href="/" className="hover:text-near-green transition-colors min-h-[44px] min-w-[44px] inline-flex items-center active:scale-[0.97]">Home</Link>
          <span className="text-border-subtle">/</span>
          <span className="text-text-secondary">Legal</span>
        </nav>

        {/* Content card */}
        <div className="rounded-2xl border border-white/[0.08] bg-void-gray/30 backdrop-blur-sm p-4 sm:p-8 lg:p-14">
          {children}
        </div>

        {/* Legal nav */}
        <div className="mt-8 sm:mt-10 pt-6 border-t border-white/[0.06]">
          <p className="text-xs text-text-muted mb-3">Legal Pages</p>
          <div className="flex flex-wrap gap-x-4 sm:gap-x-5 gap-y-1 text-xs sm:text-sm">
            <Link href="/legal/terms" className="text-text-muted hover:text-near-green transition-colors min-h-[44px] inline-flex items-center active:scale-[0.97]">Terms of Service</Link>
            <Link href="/legal/privacy" className="text-text-muted hover:text-near-green transition-colors min-h-[44px] inline-flex items-center active:scale-[0.97]">Privacy Policy</Link>
            <Link href="/legal/disclaimer" className="text-text-muted hover:text-near-green transition-colors min-h-[44px] inline-flex items-center active:scale-[0.97]">Disclaimer</Link>
            <Link href="/legal/cookies" className="text-text-muted hover:text-near-green transition-colors min-h-[44px] inline-flex items-center active:scale-[0.97]">Cookie Policy</Link>
            <Link href="/legal/acceptable-use" className="text-text-muted hover:text-near-green transition-colors min-h-[44px] inline-flex items-center active:scale-[0.97]">Acceptable Use</Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
