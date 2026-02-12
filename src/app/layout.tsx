import type { Metadata, Viewport } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SearchShortcut } from '@/components/layout/SearchShortcut';
import { Providers } from '@/components/providers/Providers';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { PageTransitionWrapper } from '@/components/layout/PageTransitionWrapper';
import { VoidPulseNotifications } from '@/components/effects/VoidPulseNotifications';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://voidspace.io'),
  title: 'Voidspace — NEAR Ecosystem Intelligence',
  description: 'AI-powered NEAR ecosystem intelligence tool. Find voids. Build the future.',
  keywords: ['NEAR', 'blockchain', 'ecosystem', 'gap analysis', 'AI', 'web3', 'intelligence', 'Voidspace'],
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    title: 'Voidspace — NEAR Ecosystem Intelligence',
    description: 'AI-powered NEAR ecosystem intelligence tool. Find voids. Build the future.',
    url: 'https://voidspace.io',
    siteName: 'Voidspace',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Voidspace — NEAR Ecosystem Intelligence',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Voidspace — NEAR Ecosystem Intelligence',
    description: 'AI-powered NEAR ecosystem intelligence tool. Find voids. Build the future.',
    images: ['/twitter-image.jpg'],
    creator: '@VoidSpaceNear',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Voidspace',
    url: 'https://voidspace.io',
    description: 'AI-powered NEAR ecosystem intelligence tool. Find voids. Build the future.',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web',
    image: 'https://voidspace.io/og-image.jpg',
    logo: 'https://voidspace.io/icon-512.png',
    author: {
      '@type': 'Organization',
      name: 'Voidspace',
      url: 'https://voidspace.io',
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  return (
    <html lang="en" className="dark">
      <head>
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-T0WSNESD0W" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-T0WSNESD0W');
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-background text-text-primary antialiased min-h-screen flex flex-col">
        <Providers>
          <SearchShortcut />
          <Header />
          <main className="flex-1">
            <ErrorBoundary>
              <PageTransitionWrapper>{children}</PageTransitionWrapper>
            </ErrorBoundary>
          </main>
          <Footer />
          <VoidPulseNotifications />
        </Providers>
      </body>
    </html>
  );
}
