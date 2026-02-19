import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sanctum — AI Builder for NEAR Smart Contracts & dApps | Voidspace',
  description: 'Describe your idea, ship a NEAR dApp. AI writes Rust contracts, builds frontends, and deploys — all through conversation.',
  alternates: { canonical: 'https://voidspace.io/sanctum' },
  openGraph: {
    title: 'Sanctum — AI Builder for NEAR Smart Contracts & dApps | Voidspace',
    description: 'Describe your idea, ship a NEAR dApp. AI writes Rust contracts, builds frontends, and deploys — all through conversation.',
    url: 'https://voidspace.io/sanctum',
    siteName: 'Voidspace',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://voidspace.io/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Sanctum — AI NEAR Smart Contract Builder',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sanctum — AI Builder for NEAR | Voidspace',
    description: 'Describe your idea, ship a NEAR dApp. AI writes Rust contracts, builds frontends, and deploys.',
    creator: '@VoidSpaceIO',
    images: ['https://voidspace.io/og-image.jpg'],
  },
};

export default function SanctumLayout({ children }: { children: React.ReactNode }) {
  return children;
}
