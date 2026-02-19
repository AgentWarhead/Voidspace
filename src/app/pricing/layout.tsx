import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing — Sanctum AI Builder for NEAR | Voidspace',
  description: 'Start free with $2.50 in credits. Scale your NEAR builds with Claude-powered AI. Plans from $0 to $200/mo.',
  alternates: { canonical: 'https://voidspace.io/pricing' },
  openGraph: {
    title: 'Pricing — Sanctum AI Builder for NEAR | Voidspace',
    description: 'Start free with $2.50 in credits. Scale your NEAR builds with Claude-powered AI. Plans from $0 to $200/mo.',
    url: 'https://voidspace.io/pricing',
    siteName: 'Voidspace',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://voidspace.io/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Voidspace Pricing — Sanctum AI Builder Plans',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pricing — Sanctum AI Builder for NEAR | Voidspace',
    description: 'Start free with $2.50 in credits. Scale your NEAR builds. Plans from $0 to $200/mo.',
    creator: '@VoidSpaceIO',
    images: ['https://voidspace.io/og-image.jpg'],
  },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
