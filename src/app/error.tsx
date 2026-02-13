'use client';

import { useEffect } from 'react';
import { Container } from '@/components/ui/Container';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Page error:', error);
  }, [error]);

  return (
    <Container size="md" className="py-24 text-center">
      <h1 className="text-6xl font-bold font-mono text-rose-400 mb-4">500</h1>
      <p className="text-xl text-text-secondary mb-2">Something went wrong</p>
      <p className="text-sm text-text-muted mb-8">
        An unexpected error occurred. Please try again.
      </p>
      <button
        onClick={reset}
        className="shimmer-btn text-background font-semibold px-6 py-3 rounded-lg text-sm inline-flex items-center gap-2"
      >
        Try Again
      </button>
    </Container>
  );
}
