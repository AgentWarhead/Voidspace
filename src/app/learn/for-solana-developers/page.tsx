import { Metadata } from 'next';
import { Container } from '@/components/ui';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { ForSolanaDevelopers } from './ForSolanaDevelopers';

export const metadata: Metadata = {
  title: 'NEAR for Solana Developers — Your Rust Skills Already Work Here | Voidspace',
  description:
    'A fast-track guide for Solana developers exploring NEAR Protocol. Concept translator, side-by-side code comparisons, and your first NEAR contract in 10 minutes.',
  keywords:
    'Solana developer NEAR, migrate Solana to NEAR, Solana Rust developer, NEAR for Solana devs, blockchain multi-chain developer, Solana to NEAR migration',
  alternates: { canonical: 'https://voidspace.io/learn/for-solana-developers' },
  openGraph: {
    title: 'NEAR for Solana Developers — Your Rust Skills Already Work Here | Voidspace',
    description:
      'Fast-track guide for Solana devs: concept translator, code comparisons, and deploy your first NEAR contract in 10 minutes.',
    url: 'https://voidspace.io/learn/for-solana-developers',
    siteName: 'Voidspace',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NEAR for Solana Developers — Your Rust Skills Already Work Here | Voidspace',
    description:
      'Solana → NEAR fast-track: concept translator, side-by-side code, first contract in 10 minutes.',
    creator: '@VoidSpaceNear',
  },
};

export default function ForSolanaDevelopersPage() {
  return (
    <div className="min-h-screen">
      {/* BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://voidspace.io' },
              { '@type': 'ListItem', position: 2, name: 'Learn', item: 'https://voidspace.io/learn' },
              { '@type': 'ListItem', position: 3, name: 'For Solana Developers' },
            ],
          }),
        }}
      />
      <Container className="pt-8 pb-4">
        <Link
          href="/learn"
          className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-near-green transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Learn
        </Link>
        <nav className="mt-2 text-xs text-text-muted">
          <Link href="/learn" className="hover:text-near-green">
            Learn
          </Link>
          <span className="mx-1">›</span>
          <span className="text-text-secondary">For Solana Developers</span>
        </nav>
      </Container>
      <Container className="pb-20">
        <ForSolanaDevelopers />
      </Container>
    </div>
  );
}
