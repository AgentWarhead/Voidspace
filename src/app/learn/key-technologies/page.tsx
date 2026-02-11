import { Metadata } from 'next';
import { Container } from '@/components/ui';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { KeyTechnologies } from '../components/KeyTechnologies';

export const metadata: Metadata = {
  title: 'NEAR Key Technologies — Chain Abstraction, Intents & More | Voidspace',
  description:
    'Explore NEAR Protocol\'s key technologies: Chain Abstraction, Intents, Chain Signatures, Shade Agents, and more. Understand the tech powering the next generation of dApps.',
  alternates: { canonical: 'https://voidspace.io/learn/key-technologies' },
  openGraph: {
    title: 'NEAR Key Technologies — Chain Abstraction, Intents & More | Voidspace',
    description:
      'Explore NEAR Protocol\'s key technologies: Chain Abstraction, Intents, Chain Signatures, and more.',
    url: 'https://voidspace.io/learn/key-technologies',
    siteName: 'Voidspace',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NEAR Key Technologies — Chain Abstraction, Intents & More | Voidspace',
    description:
      'Chain Abstraction, Intents, Chain Signatures — the tech powering NEAR Protocol.',
    creator: '@VoidSpaceNear',
  },
};

export default function KeyTechnologiesPage() {
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
              { '@type': 'ListItem', position: 3, name: 'Key Technologies' },
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
          <span className="text-text-secondary">Key Technologies</span>
        </nav>
      </Container>
      <Container className="pb-20">
        <KeyTechnologies />
      </Container>
    </div>
  );
}
