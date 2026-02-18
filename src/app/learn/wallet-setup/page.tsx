import { Metadata } from 'next';
import { Container } from '@/components/ui';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { WalletSetup } from '../components/WalletSetup';

export const metadata: Metadata = {
  title: 'Set Up Your NEAR Wallet — Getting Started | Voidspace',
  description:
    'Step-by-step guide to setting up your first NEAR wallet. Learn about NEAR accounts, key management, and wallet options to start building on NEAR Protocol.',
  alternates: { canonical: 'https://voidspace.io/learn/wallet-setup' },
  openGraph: {
    title: 'Set Up Your NEAR Wallet — Getting Started | Voidspace',
    description:
      'Step-by-step guide to setting up your first NEAR wallet. Learn about NEAR accounts, key management, and wallet options.',
    url: 'https://voidspace.io/learn/wallet-setup',
    siteName: 'Voidspace',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Set Up Your NEAR Wallet — Getting Started | Voidspace',
    description:
      'Step-by-step guide to setting up your first NEAR wallet on NEAR Protocol.',
    creator: '@VoidSpaceIO',
  },
};

export default function WalletSetupPage() {
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
              { '@type': 'ListItem', position: 3, name: 'Wallet Setup' },
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
          <span className="text-text-secondary">Wallet Setup</span>
        </nav>
      </Container>
      <Container className="pb-20">
        <WalletSetup />
      </Container>
    </div>
  );
}
