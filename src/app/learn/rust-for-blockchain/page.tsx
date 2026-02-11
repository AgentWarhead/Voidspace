import { Metadata } from 'next';
import { Container } from '@/components/ui';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { RustForBlockchain } from './RustForBlockchain';

export const metadata: Metadata = {
  title: 'Learn Rust for Blockchain — Smart Contract Development on NEAR, Solana & More | Voidspace',
  description:
    'Master Rust for blockchain development. Chain-agnostic modules covering ownership, serialization, testing, gas optimization, and security patterns used on NEAR, Solana, Cosmos, and Polkadot.',
  keywords:
    'learn Rust blockchain, Rust smart contract tutorial, Rust blockchain development, Rust web3, Rust Solana tutorial, Rust NEAR tutorial, Rust Cosmos, Rust Polkadot',
  alternates: { canonical: 'https://voidspace.io/learn/rust-for-blockchain' },
  openGraph: {
    title: 'Learn Rust for Blockchain — Smart Contract Development | Voidspace',
    description:
      'Chain-agnostic Rust modules for NEAR, Solana, Cosmos, and Polkadot developers. Free curriculum with code examples.',
    url: 'https://voidspace.io/learn/rust-for-blockchain',
    siteName: 'Voidspace',
    locale: 'en_US',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Learn Rust for Blockchain — Smart Contract Development | Voidspace',
    description:
      'Chain-agnostic Rust curriculum covering NEAR, Solana, Cosmos, and Polkadot. Free with code examples.',
    creator: '@VoidSpaceNear',
  },
};

export default function RustForBlockchainPage() {
  return (
    <div className="min-h-screen">
      {/* BreadcrumbList + Article structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://voidspace.io' },
              { '@type': 'ListItem', position: 2, name: 'Learn', item: 'https://voidspace.io/learn' },
              { '@type': 'ListItem', position: 3, name: 'Rust for Blockchain' },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Rust: The Language of Secure Blockchains',
            description:
              'Chain-agnostic Rust curriculum for blockchain developers covering NEAR, Solana, Cosmos, and Polkadot.',
            author: {
              '@type': 'Organization',
              name: 'Voidspace',
              url: 'https://voidspace.io',
            },
            publisher: {
              '@type': 'Organization',
              name: 'Voidspace',
              url: 'https://voidspace.io',
            },
            mainEntityOfPage: 'https://voidspace.io/learn/rust-for-blockchain',
            inLanguage: 'en',
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
          <span className="text-text-secondary">Rust for Blockchain</span>
        </nav>
      </Container>
      <Container className="pb-20">
        <RustForBlockchain />
      </Container>
    </div>
  );
}
