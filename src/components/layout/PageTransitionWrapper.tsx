'use client';

import { usePathname } from 'next/navigation';
import { PageTransition } from '@/components/effects/PageTransition';

export function PageTransitionWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <PageTransition key={pathname}>
      {children}
    </PageTransition>
  );
}
