'use client';

import { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SlidersHorizontal, Search } from 'lucide-react';
import type { Category } from '@/types';

interface OpportunityFiltersProps {
  categories: Category[];
}

export function OpportunityFilters({ categories }: OpportunityFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete('page');
    router.push(`?${params.toString()}`);
  }

  const currentCategory = searchParams.get('category') || '';
  const currentDifficulty = searchParams.get('difficulty') || '';
  const currentSort = searchParams.get('sort') || 'gap_score';
  const currentSearch = searchParams.get('q') || '';
  const [searchValue, setSearchValue] = useState(currentSearch);

  const handleSearch = useCallback(() => {
    updateFilter('q', searchValue);
  }, [searchValue]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-wrap items-center gap-3">
      <SlidersHorizontal className="w-4 h-4 text-text-muted" />

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
        <input
          type="text"
          placeholder="Search..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          onBlur={handleSearch}
          className="bg-surface/60 backdrop-blur-sm border border-border rounded-lg pl-8 pr-3 py-1.5 text-sm text-text-primary focus:border-near-green focus:outline-none w-40"
        />
      </div>

      <select
        value={currentCategory}
        onChange={(e) => updateFilter('category', e.target.value)}
        className="bg-surface/60 backdrop-blur-sm border border-border rounded-lg px-3 py-1.5 text-sm text-text-primary focus:border-near-green focus:outline-none"
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.slug}>
            {cat.name}
          </option>
        ))}
      </select>

      <select
        value={currentDifficulty}
        onChange={(e) => updateFilter('difficulty', e.target.value)}
        className="bg-surface/60 backdrop-blur-sm border border-border rounded-lg px-3 py-1.5 text-sm text-text-primary focus:border-near-green focus:outline-none"
      >
        <option value="">All Difficulties</option>
        <option value="beginner">Beginner</option>
        <option value="intermediate">Intermediate</option>
        <option value="advanced">Advanced</option>
      </select>

      <select
        value={currentSort}
        onChange={(e) => updateFilter('sort', e.target.value)}
        className="bg-surface/60 backdrop-blur-sm border border-border rounded-lg px-3 py-1.5 text-sm text-text-primary focus:border-near-green focus:outline-none"
      >
        <option value="gap_score">Gap Score</option>
        <option value="date">Most Recent</option>
        <option value="demand">Demand Score</option>
      </select>
    </div>
  );
}
