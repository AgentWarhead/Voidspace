import { Metadata } from 'next';
import { Container } from '@/components/ui';
import { GridPattern } from '@/components/effects/GridPattern';
import { QuickStart } from './QuickStart';

export const metadata: Metadata = {
  title: 'Quick Start — Your First NEAR Transaction in 3 Minutes | Voidspace',
  description:
    'A hands-on walkthrough to create a NEAR testnet wallet, get tokens, make your first transfer, and verify it on-chain. No code required.',
  alternates: {
    canonical: 'https://voidspace.io/learn/quick-start',
  },
  openGraph: {
    title: 'Quick Start — Your First NEAR Transaction in 3 Minutes | Voidspace',
    description: 'Create a NEAR testnet wallet, get tokens, make your first transfer, and verify it on-chain. No code required.',
    url: 'https://voidspace.io/learn/quick-start',
    siteName: 'Voidspace',
    locale: 'en_US',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Quick Start — First NEAR Transaction in 3 Minutes | Voidspace',
    description: 'Hands-on walkthrough: create a wallet, get tokens, send your first transaction. No code required.',
    creator: '@VoidSpaceIO',
  },
};

export default function QuickStartPage() {
  return (
    <div className="min-h-screen relative">
      <GridPattern className="opacity-10" />
      <Container size="lg" className="relative z-10 py-8">
        <QuickStart />
      </Container>
    </div>
  );
}
