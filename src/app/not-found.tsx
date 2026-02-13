import Link from 'next/link';
import { Container } from '@/components/ui/Container';

export default function NotFound() {
  return (
    <Container size="md" className="py-24 text-center">
      <h1 className="text-6xl font-bold font-mono text-near-green mb-4">404</h1>
      <p className="text-xl text-text-secondary mb-2">Void Not Found</p>
      <p className="text-sm text-text-muted mb-8">
        This page doesn&apos;t exist in the NEAR ecosystem... yet.
      </p>
      <Link
        href="/"
        className="shimmer-btn text-background font-semibold px-6 py-3 rounded-lg text-sm inline-flex items-center gap-2"
      >
        Return to Voidspace
      </Link>
    </Container>
  );
}
