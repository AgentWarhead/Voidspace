import { Metadata } from 'next';
import { ConstellationMap } from '@/components/features/ConstellationMap';

export const metadata: Metadata = {
  title: 'Constellation Map — NEAR Wallet Relationship Visualization | Voidspace',
  description: 'Map wallet-to-wallet connections and trace transaction flows across NEAR Protocol. Interactive graph visualization with filters, clustering, and export.',
  keywords: ['NEAR Protocol', 'blockchain', 'wallet', 'network analysis', 'constellation mapping', 'DeFi', 'transaction graph', 'wallet relationships'],
  alternates: { canonical: 'https://voidspace.io/constellation' },
  openGraph: {
    title: 'Constellation Map — NEAR Wallet Relationship Visualization | Voidspace',
    description: 'Map wallet-to-wallet connections and trace transaction flows across NEAR Protocol. Interactive graph visualization with filters, clustering, and export.',
    url: 'https://voidspace.io/constellation',
    siteName: 'Voidspace',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Constellation Map — NEAR Wallet Relationships | Voidspace',
    description: 'Trace wallet connections and transaction flows on NEAR Protocol. Interactive graph with filters and export.',
    creator: '@VoidSpaceIO',
  },
};

export default function ConstellationPage() {
  return (
    <div className="min-h-screen bg-background">
      <ConstellationMap />
    </div>
  );
}