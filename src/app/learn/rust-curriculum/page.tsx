import { Metadata } from 'next';
import { Container } from '@/components/ui';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { RustLearningPathway } from './RustLearningPathway';

export const metadata: Metadata = {
  title: 'Rust Smart Contract Curriculum — Free Course | Voidspace',
  description:
    'Free structured Rust smart contract course. Go from zero to deploying on NEAR Protocol with hands-on modules, exercises, and real-world projects.',
  alternates: { canonical: 'https://voidspace.io/learn/rust-curriculum' },
  openGraph: {
    title: 'Rust Smart Contract Curriculum — Free Course | Voidspace',
    description:
      'Free structured Rust course — from zero to deploying smart contracts on NEAR Protocol.',
    url: 'https://voidspace.io/learn/rust-curriculum',
    siteName: 'Voidspace',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rust Smart Contract Curriculum — Free Course | Voidspace',
    description:
      'Free structured course from zero to Rust smart contract deployment on NEAR.',
    creator: '@VoidSpaceNear',
  },
};

export default function RustCurriculumPage() {
  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://voidspace.io' },
              { '@type': 'ListItem', position: 2, name: 'Learn', item: 'https://voidspace.io/learn' },
              { '@type': 'ListItem', position: 3, name: 'Rust Curriculum' },
            ],
          }),
        }}
      />
      <Container className="pt-8 pb-4">
        <Link
          href="/learn"
          className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-near-green transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Learn
        </Link>
        <nav className="mt-2 text-xs text-text-muted">
          <Link href="/learn" className="hover:text-near-green">
            Learn
          </Link>
          <span className="mx-1">›</span>
          <span className="text-text-secondary">Rust Curriculum</span>
        </nav>
      </Container>
      <Container className="pb-20">
        <RustLearningPathway />
      </Container>
    </div>
  );
}
