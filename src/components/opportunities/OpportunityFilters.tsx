'use client';

import { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, ChevronDown } from 'lucide-react';
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
        'px-3 py-1.5 min-h-[36px] sm:min-h-[32px] rounded-full text-xs font-mono whitespace-nowrap transition-all duration-200 border',
        'active:scale-95 touch-manipulation',
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
  const [filtersOpen, setFiltersOpen] = useState(false);

  const hasActiveFilters = currentCategory || currentDifficulty || currentCompetition || currentSearch;

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
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1 sm:flex-initial">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search voids..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            onBlur={handleSearch}
            className="w-full sm:w-48 bg-surface border border-border rounded-lg pl-9 pr-3 py-2.5 sm:py-1.5 text-sm text-text-primary placeholder:text-text-muted focus:border-near-green focus:outline-none transition-colors"
          />
        </div>
        <div className="flex items-center gap-3">
          <select
            value={currentSort}
            onChange={(e) => updateFilter('sort', e.target.value)}
            className="bg-surface border border-border rounded-lg px-3 py-2.5 sm:py-1.5 text-xs font-mono text-text-primary focus:border-near-green focus:outline-none min-h-[44px] sm:min-h-0"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          {/* Mobile filter toggle */}
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={cn(
              'sm:hidden flex items-center gap-1.5 px-3 py-2.5 rounded-lg border text-xs font-mono min-h-[44px]',
              'active:scale-95 touch-manipulation transition-all',
              hasActiveFilters
                ? 'border-near-green/40 text-near-green bg-near-green/10'
                : 'border-border text-text-muted'
            )}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            <ChevronDown className={cn('w-3 h-3 transition-transform', filtersOpen && 'rotate-180')} />
          </button>

          <span className="hidden sm:inline text-xs font-mono text-text-muted ml-auto">
            Showing <span className="text-near-green">{filteredTotal}</span> of {total} voids
          </span>
        </div>
      </div>

      {/* Mobile result count */}
      <div className="sm:hidden text-xs font-mono text-text-muted text-center">
        Showing <span className="text-near-green">{filteredTotal}</span> of {total} voids
      </div>

      {/* Filter chips — always visible on desktop, collapsible on mobile */}
      <div className={cn(
        'space-y-3 overflow-hidden transition-all duration-300',
        filtersOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 sm:max-h-[500px] opacity-0 sm:opacity-100'
      )}>
        {/* Difficulty + Competition chips */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2">
          <span className="text-[10px] uppercase tracking-widest text-text-muted font-mono">Difficulty</span>
          <div className="flex flex-wrap gap-2">
            {difficulties.map((d) => (
              <Chip key={d.value} active={currentDifficulty === d.value} onClick={() => updateFilter('difficulty', d.value)}>
                {d.label}
              </Chip>
            ))}
          </div>

          <span className="hidden sm:block w-px h-4 bg-border mx-1" />
          <div className="border-t border-border/50 sm:hidden my-1" />

          <span className="text-[10px] uppercase tracking-widest text-text-muted font-mono">Competition</span>
          <div className="flex flex-wrap gap-2">
            {competitions.map((c) => (
              <Chip key={c.value} active={currentCompetition === c.value} onClick={() => updateFilter('competition', c.value)}>
                {c.label}
              </Chip>
            ))}
          </div>
        </div>

        {/* Category chips (scrollable) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin -mx-1 px-1">
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
    </div>
  );
}
