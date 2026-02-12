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
