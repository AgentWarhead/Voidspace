import { Metadata } from 'next';
import { Container } from '@/components/ui';
import { GridPattern } from '@/components/effects/GridPattern';
import { Certificate } from './Certificate';

export const metadata: Metadata = {
  title: 'Certificates — Earn Your NEAR Certification | Voidspace',
  description:
    'Earn shareable certificates by completing NEAR learning tracks. Prove your Explorer, Builder, Hacker, or Founder skills.',
  alternates: {
    canonical: 'https://voidspace.io/learn/certificate',
  },
};

export default function CertificatePage() {
  return (
    <div className="min-h-screen relative">
      <GridPattern className="opacity-10" />
      <Container size="lg" className="relative z-10 py-8">
        <Certificate />
      </Container>
    </div>
  );
}
