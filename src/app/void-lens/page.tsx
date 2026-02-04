import { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { VoidLens } from '@/components/features/VoidLens';

export const metadata: Metadata = {
  title: 'Void Lens - Wallet Reputation Scoring | Voidspace',
  description: 'Advanced NEAR wallet reputation scoring powered by blockchain analytics and AI. Analyze any NEAR wallet for security and trust indicators.',
  keywords: ['NEAR', 'wallet', 'reputation', 'blockchain', 'analytics', 'security'],
};

export default function VoidLensPage() {
  return (
    <Container className="py-12">
      <VoidLens />
    </Container>
  );
}