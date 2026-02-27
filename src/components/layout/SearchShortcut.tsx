'use client';

import { useEffect, useState } from 'react';
import { CommandPalette } from './CommandPalette';

export function SearchShortcut() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Cmd+K (Mac) or Ctrl+K (Windows/Linux)
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    // Custom event from search button clicks in the Header
    const handleCustomOpen = () => setOpen(true);

    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('voidspace:open-palette', handleCustomOpen);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('voidspace:open-palette', handleCustomOpen);
    };
  }, []);

  return <CommandPalette open={open} onClose={() => setOpen(false)} />;
}
