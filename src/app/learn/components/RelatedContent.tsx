'use client';

import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';
import { Container } from '@/components/ui';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface RelatedModule {
  title: string;
  track: string;
  trackColor: string;
  readTime: string;
  href: string;
}

// ─── Cross-Track Suggestions ───────────────────────────────────────────────────

const TRACK_SUGGESTIONS: Record<string, RelatedModule[]> = {
  explorer: [
    { title: 'Dev Environment Setup', track: 'Builder', trackColor: 'text-accent-cyan', readTime: '15 min', href: '/learn/builder/dev-environment-setup' },
    { title: 'NEAR Architecture Deep Dive', track: 'Hacker', trackColor: 'text-purple-400', readTime: '20 min', href: '/learn/hacker/near-architecture-deep-dive' },
    { title: 'NEAR Grants & Funding', track: 'Founder', trackColor: 'text-purple-400', readTime: '15 min', href: '/learn/founder/near-grants-funding' },
  ],
  builder: [
    { title: 'Cross-Contract Calls', track: 'Hacker', trackColor: 'text-purple-400', readTime: '18 min', href: '/learn/hacker/cross-contract-calls' },
    { title: 'Chain Signatures', track: 'Hacker', trackColor: 'text-purple-400', readTime: '20 min', href: '/learn/hacker/chain-signatures' },
    { title: 'Building in Public', track: 'Founder', trackColor: 'text-purple-400', readTime: '15 min', href: '/learn/founder/building-in-public' },
  ],
  hacker: [
    { title: 'Tokenomics Design', track: 'Founder', trackColor: 'text-purple-400', readTime: '20 min', href: '/learn/founder/tokenomics-design' },
    { title: 'Security Best Practices', track: 'Builder', trackColor: 'text-accent-cyan', readTime: '18 min', href: '/learn/builder/security-best-practices' },
    { title: 'Pitching Your Project', track: 'Founder', trackColor: 'text-purple-400', readTime: '15 min', href: '/learn/founder/pitching-your-project' },
  ],
  founder: [
    { title: 'What is NEAR?', track: 'Explorer', trackColor: 'text-near-green', readTime: '12 min', href: '/learn/explorer/what-is-near' },
    { title: 'Building a dApp', track: 'Builder', trackColor: 'text-accent-cyan', readTime: '30 min', href: '/learn/builder/building-a-dapp' },
    { title: 'AI Agent Integration', track: 'Hacker', trackColor: 'text-purple-400', readTime: '18 min', href: '/learn/hacker/ai-agent-integration' },
  ],
};

// ─── Component ─────────────────────────────────────────────────────────────────

interface RelatedContentProps {
  currentTrack: 'explorer' | 'builder' | 'hacker' | 'founder';
}

export function RelatedContent({ currentTrack }: RelatedContentProps) {
  const suggestions = TRACK_SUGGESTIONS[currentTrack] || TRACK_SUGGESTIONS.explorer;

  return (
    <div className="border-t border-border bg-surface/20">
      <Container size="lg">
        <div className="py-12">
          <h3 className="text-lg font-semibold text-text-primary mb-6">Continue Learning</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {suggestions.map((mod) => (
              <Link
                key={mod.href}
                href={mod.href}
                className="group p-4 rounded-xl border border-border bg-surface hover:bg-surface-hover transition-all duration-200"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full bg-surface-hover ${mod.trackColor}`}>
                    {mod.track}
                  </span>
                  <span className="text-xs text-text-muted flex items-center gap-1">
                    <BookOpen className="w-3 h-3" />
                    {mod.readTime}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-text-secondary group-hover:text-text-primary transition-colors">
                    {mod.title}
                  </span>
                  <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-near-green group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center">
            <Link
              href="/learn#tracks"
              className="text-sm text-text-muted hover:text-near-green transition-colors"
            >
              ← Back to All Tracks
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
