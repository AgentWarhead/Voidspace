'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { SlidersHorizontal } from 'lucide-react';
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

  return (
    <div className="flex flex-wrap items-center gap-3">
      <SlidersHorizontal className="w-4 h-4 text-text-muted" />

      <select
        value={currentCategory}
        onChange={(e) => updateFilter('category', e.target.value)}
        className="bg-surface border border-border rounded-lg px-3 py-1.5 text-sm text-text-primary focus:border-near-green focus:outline-none"
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
        className="bg-surface border border-border rounded-lg px-3 py-1.5 text-sm text-text-primary focus:border-near-green focus:outline-none"
      >
        <option value="">All Difficulties</option>
        <option value="beginner">Beginner</option>
        <option value="intermediate">Intermediate</option>
        <option value="advanced">Advanced</option>
      </select>

      <select
        value={currentSort}
        onChange={(e) => updateFilter('sort', e.target.value)}
        className="bg-surface border border-border rounded-lg px-3 py-1.5 text-sm text-text-primary focus:border-near-green focus:outline-none"
      >
        <option value="gap_score">Gap Score</option>
        <option value="date">Most Recent</option>
        <option value="demand">Demand Score</option>
      </select>
    </div>
  );
}
