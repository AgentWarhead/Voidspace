import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Providers } from '@/components/providers/Providers';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { PageTransitionWrapper } from '@/components/layout/PageTransitionWrapper';
import './globals.css';

export const metadata: Metadata = {
  title: 'Voidspace — NEAR Ecosystem Gap Scanner',
  description: 'AI-powered NEAR ecosystem gap scanner. Find voids. Build the future.',
  keywords: ['NEAR', 'blockchain', 'ecosystem', 'gap analysis', 'AI', 'web3'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-text-primary antialiased min-h-screen flex flex-col">
        <Providers>
          <Header />
          <main className="flex-1">
            <ErrorBoundary>
              <PageTransitionWrapper>{children}</PageTransitionWrapper>
            </ErrorBoundary>
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
