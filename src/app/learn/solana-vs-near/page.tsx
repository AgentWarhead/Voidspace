import { Metadata } from 'next';
import { Container } from '@/components/ui';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { SolanaVsNear } from './SolanaVsNear';

export const metadata: Metadata = {
  title: 'Solana vs NEAR — Honest Developer Comparison | Voidspace',
  description:
    'An honest, technical comparison of Solana and NEAR Protocol for developers. Architecture, costs, finality, developer experience, and cross-chain capabilities compared side-by-side.',
  keywords:
    'Solana vs NEAR, NEAR vs Solana comparison, Solana developer experience, NEAR developer experience, which blockchain to build on, Solana NEAR developers',
  alternates: { canonical: 'https://voidspace.io/learn/solana-vs-near' },
  openGraph: {
    title: 'Solana vs NEAR — Honest Developer Comparison | Voidspace',
    description:
      'Fair, technical comparison of Solana and NEAR Protocol. Architecture, costs, finality, and DX compared side-by-side.',
    url: 'https://voidspace.io/learn/solana-vs-near',
    siteName: 'Voidspace',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Solana vs NEAR — Honest Developer Comparison | Voidspace',
    description:
      'Fair comparison of Solana and NEAR Protocol for blockchain developers.',
    creator: '@VoidSpaceNear',
  },
};

export default function SolanaVsNearPage() {
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
              { '@type': 'ListItem', position: 3, name: 'Solana vs NEAR' },
            ],
          }),
        }}
      />
      {/* FAQPage structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'What is the difference between Solana and NEAR Protocol?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Solana uses a monolithic architecture with Proof of History for high throughput on a single chain. NEAR uses Nightshade sharding to scale horizontally. Both use Rust for smart contracts. NEAR offers human-readable accounts and native cross-chain capabilities, while Solana excels at raw transaction throughput and has a larger DeFi ecosystem.',
                },
              },
              {
                '@type': 'Question',
                name: 'Can I use Rust on both Solana and NEAR?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Yes, both Solana and NEAR use Rust as their primary smart contract language. Solana uses the Anchor framework while NEAR uses near-sdk-rs. Core Rust skills like ownership, error handling, and serialization transfer directly between both chains.',
                },
              },
              {
                '@type': 'Question',
                name: 'Which is cheaper, Solana or NEAR transactions?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Solana transactions cost approximately $0.00025, while NEAR transactions cost approximately $0.001. However, NEAR sends 30% of transaction fees to the contract being called, creating a unique developer revenue model.',
                },
              },
              {
                '@type': 'Question',
                name: 'Which blockchain has faster finality?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Solana produces blocks every ~400ms but true finality takes ~13 seconds. NEAR achieves guaranteed finality in approximately 1.4 seconds. For applications requiring fast irreversible confirmation, NEAR has an advantage.',
                },
              },
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
          <span className="text-text-secondary">Solana vs NEAR</span>
        </nav>
      </Container>
      <Container className="pb-20">
        <SolanaVsNear />
      </Container>
    </div>
  );
}
