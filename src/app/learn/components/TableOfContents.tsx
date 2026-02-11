'use client';

import { useEffect, useState } from 'react';

const TOC_ITEMS = [
  { id: 'overview', label: 'Overview' },
  { id: 'learning-tracks', label: 'Learning Tracks' },
  { id: 'deep-dives', label: 'Deep Dives' },
  { id: 'near-overview', label: 'NEAR Overview' },
  { id: 'ai-briefs', label: 'AI Briefs' },
  { id: 'ecosystem', label: 'Ecosystem' },
  { id: 'templates', label: 'Templates' },
  { id: 'resources', label: 'Resources' },
];

export function TableOfContents() {
  const [activeId, setActiveId] = useState<string>('overview');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the first visible entry
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          // Pick the one closest to top
          const sorted = visible.sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
          );
          setActiveId(sorted[0].target.id);
        }
      },
      {
        rootMargin: '-80px 0px -60% 0px',
        threshold: 0,
      }
    );

    // Observe all sections
    TOC_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <nav className="hidden xl:block fixed left-8 top-1/2 -translate-y-1/2 z-40">
      <div className="flex flex-col gap-1">
        <span className="text-[10px] uppercase tracking-widest text-text-muted mb-2 font-medium">
          Contents
        </span>
        {TOC_ITEMS.map(({ id, label }) => (
          <a
            key={id}
            href={`#${id}`}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`text-xs py-1 pl-3 border-l-2 transition-all duration-200 ${
              activeId === id
                ? 'border-near-green text-near-green font-medium'
                : 'border-transparent text-text-muted hover:text-text-secondary hover:border-text-muted'
            }`}
          >
            {label}
          </a>
        ))}
      </div>
    </nav>
  );
}
