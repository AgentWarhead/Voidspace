'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function SearchShortcut() {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Cmd+K (Mac) or Ctrl+K (Windows/Linux)
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        // Prevent default browser behavior (Cmd+K usually opens address bar)
        event.preventDefault();
        
        // Navigate to search page
        router.push('/search');
      }
    };

    // Add event listener
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [router]);

  // This component doesn't render anything visible
  return null;
}