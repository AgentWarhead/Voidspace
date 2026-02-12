'use client';

import { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Category } from '@/types';

interface OpportunityFiltersProps {
  categories: Category[];
  total: number;
  filteredTotal: number;
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-3 py-1 rounded-full text-xs font-mono whitespace-nowrap transition-all duration-200 border',
        active
          ? 'bg-near-green/15 border-near-green/40 text-near-green'
          : 'bg-surface border-border text-text-muted hover:border-border-hover hover:text-text-secondary'
      )}
    >
      {children}
    </button>
  );
}

export function OpportunityFilters({ categories, total, filteredTotal }: OpportunityFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategory = searchParams?.get('category') || '';
  const currentDifficulty = searchParams?.get('difficulty') || '';
  const currentCompetition = searchParams?.get('competition') || '';
  const currentSort = searchParams?.get('sort') || 'gap_score';
  const currentSearch = searchParams?.get('q') || '';
  const [searchValue, setSearchValue] = useState(currentSearch);

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams?.toString() || '');
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete('page');
    router.push(`?${params.toString()}`);
  }

  const handleSearch = useCallback(() => {
    updateFilter('q', searchValue);
  }, [searchValue]); // eslint-disable-line react-hooks/exhaustive-deps

  const difficulties = [
    { value: '', label: 'All' },
    { value: 'beginner', label: '🟢 Beginner' },
    { value: 'intermediate', label: '🟡 Intermediate' },
    { value: 'advanced', label: '🔴 Advanced' },
  ];

  const competitions = [
    { value: '', label: 'All' },
    { value: 'low', label: '↓ Low' },
    { value: 'medium', label: '→ Medium' },
    { value: 'high', label: '↑ High' },
  ];

  const sortOptions = [
    { value: 'gap_score', label: 'Gap Score' },
    { value: 'date', label: 'Newest' },
    { value: 'difficulty_asc', label: 'Easiest First' },
  ];

  return (
    <div className="space-y-3">
      {/* Top row: search + sort + result count */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-shrink-0">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
          <input
            type="text"
            placeholder="Search voids..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            onBlur={handleSearch}
            className="bg-surface border border-border rounded-lg pl-8 pr-3 py-1.5 text-sm text-text-primary placeholder:text-text-muted focus:border-near-green focus:outline-none w-48 transition-colors"
          />
        </div>
        <select
          value={currentSort}
          onChange={(e) => updateFilter('sort', e.target.value)}
          className="bg-surface border border-border rounded-lg px-3 py-1.5 text-xs font-mono text-text-primary focus:border-near-green focus:outline-none"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <span className="ml-auto text-xs font-mono text-text-muted">
          Showing <span className="text-near-green">{filteredTotal}</span> of {total} voids
        </span>
      </div>

      {/* Filter chips row */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[10px] uppercase tracking-widest text-text-muted font-mono mr-1">Difficulty</span>
        {difficulties.map((d) => (
          <Chip key={d.value} active={currentDifficulty === d.value} onClick={() => updateFilter('difficulty', d.value)}>
            {d.label}
          </Chip>
        ))}

        <span className="w-px h-4 bg-border mx-1" />

        <span className="text-[10px] uppercase tracking-widest text-text-muted font-mono mr-1">Competition</span>
        {competitions.map((c) => (
          <Chip key={c.value} active={currentCompetition === c.value} onClick={() => updateFilter('competition', c.value)}>
            {c.label}
          </Chip>
        ))}
      </div>

      {/* Category chips (scrollable) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        <span className="text-[10px] uppercase tracking-widest text-text-muted font-mono mr-1 flex-shrink-0">Category</span>
        <Chip active={currentCategory === ''} onClick={() => updateFilter('category', '')}>
          All
        </Chip>
        {categories.map((cat) => (
          <Chip key={cat.id} active={currentCategory === cat.slug} onClick={() => updateFilter('category', cat.slug)}>
            {cat.icon || '◈'} {cat.name}
          </Chip>
        ))}
      </div>
    </div>
  );
}
