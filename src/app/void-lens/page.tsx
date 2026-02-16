import { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { VoidLens } from '@/components/features/VoidLens';

export const metadata: Metadata = {
  title: 'Void Lens — AI Wallet Intelligence for NEAR Protocol | Voidspace',
  description: 'Scan any NEAR wallet in 60 seconds. AI-powered reputation scoring, DeFi activity tracking, security profiling, and portfolio valuation — free.',
  keywords: ['NEAR', 'wallet', 'reputation', 'blockchain', 'analytics', 'security', 'AI wallet analysis', 'wallet intelligence'],
  alternates: { canonical: 'https://voidspace.io/void-lens' },
  openGraph: {
    title: 'Void Lens — AI Wallet Intelligence for NEAR Protocol | Voidspace',
    description: 'Scan any NEAR wallet in 60 seconds. AI-powered reputation scoring, DeFi activity tracking, security profiling, and portfolio valuation — free.',
    url: 'https://voidspace.io/void-lens',
    siteName: 'Voidspace',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Void Lens — AI Wallet Intelligence for NEAR Protocol | Voidspace',
    description: 'Scan any NEAR wallet in 60 seconds. Reputation scoring, DeFi tracking, security profiling — free.',
    creator: '@VoidSpaceNear',
  },
};

export default function VoidLensPage() {
  return (
    <Container className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <VoidLens />
    </Container>
  );
}