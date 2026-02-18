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
  openGraph: {
    title: 'Certificates — Earn Your NEAR Certification | Voidspace',
    description: 'Complete NEAR learning tracks and earn shareable certificates. Prove your Explorer, Builder, Hacker, or Founder skills.',
    url: 'https://voidspace.io/learn/certificate',
    siteName: 'Voidspace',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Earn Your NEAR Certification | Voidspace',
    description: 'Complete learning tracks and earn shareable certificates for Explorer, Builder, Hacker, or Founder.',
    creator: '@VoidSpaceIO',
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
