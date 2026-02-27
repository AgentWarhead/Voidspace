'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
// @ts-ignore
import { Search, Target, Globe, Sparkles, BookOpen, Zap, ArrowRight, BarChart3, Wallet, Map, Command, Trophy, User, X } from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface PaletteItem {
  id: string;
  label: string;
  description?: string;
  href: string;
  icon: React.ElementType;
  group: 'navigate' | 'tools' | 'learn';
  shortcut?: string;
}

// ─── Command Registry ───────────────────────────────────────────────────────────

const PALETTE_ITEMS: PaletteItem[] = [
  // Navigate
  { id: 'home', label: 'Home', description: 'Ecosystem dashboard & priority voids', href: '/', icon: Globe, group: 'navigate' },
  { id: 'voids', label: 'Explore Voids', description: 'Browse all NEAR ecosystem gaps', href: '/opportunities', icon: Target, group: 'navigate' },
  { id: 'observatory', label: 'Observatory', description: 'Live NEAR market data & analytics', href: '/observatory', icon: BarChart3, group: 'navigate' },
  { id: 'categories', label: 'Ecosystem Map', description: '20+ NEAR categories with gap scoring', href: '/categories', icon: Map, group: 'navigate' },
  { id: 'pricing', label: 'Pricing', description: 'Sanctum tiers & credit plans', href: '/pricing', icon: Zap, group: 'navigate' },
  // Tools
  { id: 'sanctum', label: 'Sanctum', description: 'AI smart contract builder', href: '/sanctum', icon: Sparkles, group: 'tools', shortcut: 'S' },
  { id: 'void-lens', label: 'Void Lens', description: 'AI wallet reputation scoring', href: '/void-lens', icon: Wallet, group: 'tools' },
  { id: 'constellation', label: 'Constellation Map', description: 'Wallet transaction flow graph', href: '/constellation', icon: Globe, group: 'tools' },
  { id: 'void-bubbles', label: 'Void Bubbles', description: 'Live 3D NEAR token visualizer', href: '/void-bubbles', icon: Globe, group: 'tools' },
  { id: 'search', label: 'Full Search', description: 'Search projects, voids, categories', href: '/search', icon: Search, group: 'tools', shortcut: '/' },
  // Learn
  { id: 'learn', label: 'Learn NEAR', description: '66 free modules — Explorer to Founder', href: '/learn', icon: BookOpen, group: 'learn' },
  { id: 'profile', label: 'My Profile', description: 'XP, achievements, saved missions', href: '/profile', icon: User, group: 'learn' },
  { id: 'trophies', label: 'Trophy Vault', description: 'Your earned Voidspace achievements', href: '/trophies', icon: Trophy, group: 'learn' },
];

const GROUP_LABELS: Record<PaletteItem['group'], string> = {
  navigate: 'Navigate',
  tools: 'Intelligence Tools',
  learn: 'Learn & Profile',
};

// ─── Helpers ────────────────────────────────────────────────────────────────────

function filterItems(items: PaletteItem[], query: string): PaletteItem[] {
  if (!query.trim()) return items;
  const q = query.toLowerCase();
  return items.filter(
    (item) =>
      item.label.toLowerCase().includes(q) ||
      item.description?.toLowerCase().includes(q) ||
      item.group.includes(q),
  );
}

function groupItems(items: PaletteItem[]): Record<string, PaletteItem[]> {
  return items.reduce<Record<string, PaletteItem[]>>((acc, item) => {
    if (!acc[item.group]) acc[item.group] = [];
    acc[item.group].push(item);
    return acc;
  }, {});
}

// ─── Component ──────────────────────────────────────────────────────────────────

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filtered = filterItems(PALETTE_ITEMS, query);
  const grouped = groupItems(filtered);

  // Reset state when palette opens
  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
      // Small delay for animation to start before focusing
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Scroll active item into view
  useEffect(() => {
    const activeEl = listRef.current?.querySelector('[data-active="true"]') as HTMLElement | null;
    activeEl?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  const handleSelect = useCallback(
    (item: PaletteItem) => {
      onClose();
      router.push(item.href);
    },
    [router, onClose],
  );

  const handleSearchSubmit = useCallback(() => {
    if (!query.trim()) return;
    onClose();
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  }, [query, router, onClose]);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
        case 'ArrowDown':
          e.preventDefault();
          setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setActiveIndex((i) => Math.max(i - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (filtered[activeIndex]) {
            handleSelect(filtered[activeIndex]);
          } else if (query.trim()) {
            handleSearchSubmit();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, filtered, activeIndex, query, handleSelect, handleSearchSubmit, onClose]);

  // Reset active index on query change
  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  // Flat index helper for keyboard navigation
  let flatIndex = 0;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            key="panel"
            initial={{ opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="fixed inset-x-4 top-[15vh] z-[201] mx-auto max-w-xl"
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
          >
            <div className="rounded-xl border border-border bg-surface shadow-2xl overflow-hidden">
              {/* Search input row */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                <Search className="w-4 h-4 text-text-muted shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    // Let the document listener handle arrows/enter/escape
                    // but prevent form submit on Enter
                    if (e.key === 'Enter') e.preventDefault();
                  }}
                  placeholder="Search or navigate…"
                  className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none"
                  autoComplete="off"
                  spellCheck={false}
                />
                <div className="hidden sm:flex items-center gap-1 text-[10px] text-text-muted font-mono shrink-0">
                  <kbd className="px-1.5 py-0.5 rounded bg-surface-hover border border-border">ESC</kbd>
                  <span>to close</span>
                </div>
                <button
                  onClick={onClose}
                  className="sm:hidden p-1 rounded hover:bg-surface-hover text-text-muted transition-colors"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Results */}
              <div
                ref={listRef}
                className="max-h-[60vh] overflow-y-auto py-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border"
              >
                {filtered.length === 0 ? (
                  <div className="px-4 py-8 text-center">
                    <p className="text-sm text-text-muted">No results for &ldquo;{query}&rdquo;</p>
                    <button
                      onClick={handleSearchSubmit}
                      className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-near-green bg-near-green/10 border border-near-green/20 hover:bg-near-green/15 transition-colors"
                    >
                      <Search className="w-3 h-3" />
                      Search for &ldquo;{query}&rdquo; in full search
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  (Object.keys(grouped) as PaletteItem['group'][]).map((group) => {
                    const items = grouped[group];
                    if (!items?.length) return null;
                    return (
                      <div key={group}>
                        <p className="px-4 pt-3 pb-1 text-[10px] uppercase tracking-widest font-mono text-text-muted">
                          {GROUP_LABELS[group] ?? group}
                        </p>
                        {items.map((item) => {
                          const currentFlatIndex = flatIndex++;
                          const isActive = currentFlatIndex === activeIndex;
                          const Icon = item.icon;
                          return (
                            <button
                              key={item.id}
                              data-active={isActive}
                              onClick={() => handleSelect(item)}
                              onMouseEnter={() => setActiveIndex(currentFlatIndex)}
                              className={cn(
                                'w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors',
                                isActive ? 'bg-surface-hover' : 'hover:bg-surface-hover/50',
                              )}
                            >
                              <span
                                className={cn(
                                  'flex items-center justify-center w-7 h-7 rounded-md border shrink-0 transition-colors',
                                  isActive
                                    ? 'bg-near-green/15 border-near-green/30 text-near-green'
                                    : 'bg-surface border-border text-text-muted',
                                )}
                              >
                                <Icon className="w-3.5 h-3.5" />
                              </span>
                              <span className="flex-1 min-w-0">
                                <span className={cn('block text-sm font-medium', isActive ? 'text-text-primary' : 'text-text-secondary')}>
                                  {item.label}
                                </span>
                                {item.description && (
                                  <span className="block text-xs text-text-muted truncate mt-0.5">
                                    {item.description}
                                  </span>
                                )}
                              </span>
                              {item.shortcut && (
                                <kbd className="hidden sm:block px-1.5 py-0.5 rounded text-[10px] font-mono text-text-muted bg-surface border border-border shrink-0">
                                  {item.shortcut}
                                </kbd>
                              )}
                              {isActive && (
                                <ArrowRight className="w-3.5 h-3.5 text-near-green shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    );
                  })
                )}

                {/* Footer hint */}
                {query && filtered.length > 0 && (
                  <div className="px-4 pt-2 pb-1 border-t border-border mt-1">
                    <button
                      onClick={handleSearchSubmit}
                      className="flex items-center gap-2 text-xs text-text-muted hover:text-near-green transition-colors py-1"
                    >
                      <Search className="w-3 h-3" />
                      Full search for &ldquo;{query}&rdquo;
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              {/* Footer keyboard hints */}
              <div className="hidden sm:flex items-center gap-4 px-4 py-2.5 border-t border-border bg-background/50 text-[10px] text-text-muted font-mono">
                <span className="flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 rounded bg-surface border border-border">↑↓</kbd>
                  navigate
                </span>
                <span className="flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 rounded bg-surface border border-border">↵</kbd>
                  select
                </span>
                <span className="flex items-center gap-1.5">
                  <Command className="w-3 h-3" />
                  <kbd className="px-1.5 py-0.5 rounded bg-surface border border-border">K</kbd>
                  toggle
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
