import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { GridPattern } from '@/components/effects/GridPattern';
import { TrophyVaultPage } from './TrophyVaultPage';

export const metadata: Metadata = {
  title: 'Trophy Vault — Voidspace',
  description: 'Your personal museum of accomplishments. Every achievement you\'ve earned on Voidspace, displayed in holographic glory.',
  openGraph: {
    title: 'Trophy Vault — Voidspace',
    description: 'Browse your achievements in the Voidspace Trophy Vault.',
  },
};

export default function TrophiesPage() {
  return (
    <div className="min-h-screen relative">
      <GridPattern className="opacity-5" />
      <Container size="lg" className="relative z-10 py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
        <TrophyVaultPage />
      </Container>
    </div>
  );
}
