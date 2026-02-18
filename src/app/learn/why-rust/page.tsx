import { Metadata } from 'next';
import { Container } from '@/components/ui';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { WhyRust } from '../components/WhyRust';

export const metadata: Metadata = {
  title: 'Why Rust for Blockchain? — Smart Contract Development | Voidspace',
  description:
    'Discover why Rust is the preferred language for blockchain smart contract development. Memory safety, performance, and the growing Rust ecosystem on NEAR Protocol.',
  alternates: { canonical: 'https://voidspace.io/learn/why-rust' },
  openGraph: {
    title: 'Why Rust for Blockchain? — Smart Contract Development | Voidspace',
    description:
      'Discover why Rust is the preferred language for blockchain smart contract development on NEAR Protocol.',
    url: 'https://voidspace.io/learn/why-rust',
    siteName: 'Voidspace',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Why Rust for Blockchain? — Smart Contract Development | Voidspace',
    description:
      'Why Rust is the language of secure smart contracts on NEAR Protocol.',
    creator: '@VoidSpaceIO',
  },
};

export default function WhyRustPage() {
  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://voidspace.io' },
              { '@type': 'ListItem', position: 2, name: 'Learn', item: 'https://voidspace.io/learn' },
              { '@type': 'ListItem', position: 3, name: 'Why Rust?' },
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
          <span className="text-text-secondary">Why Rust?</span>
        </nav>
      </Container>
      <Container className="pb-20">
        <WhyRust />
      </Container>
    </div>
  );
}
