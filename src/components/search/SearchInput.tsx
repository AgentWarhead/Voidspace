'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { Card } from '@/components/ui';
import { ScanLine } from '@/components/effects/ScanLine';

interface SearchInputProps {
  initialQuery?: string;
  placeholder?: string;
}

export function SearchInput({ 
  initialQuery = '', 
  placeholder = 'Search projects, voids, categories...' 
}: SearchInputProps) {
  const [inputValue, setInputValue] = useState(initialQuery);
  const router = useRouter();
  const searchParams = useSearchParams();
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Update input value when URL changes (for browser back/forward)
  useEffect(() => {
    const currentQuery = searchParams.get('q') || '';
    setInputValue(currentQuery);
  }, [searchParams]);

  // Debounced search function
  const performSearch = (query: string) => {
    const trimmedQuery = query.trim();
    const params = new URLSearchParams(searchParams.toString());
    
    if (trimmedQuery) {
      params.set('q', trimmedQuery);
    } else {
      params.delete('q');
    }
    
    router.replace(`/search?${params.toString()}`);
  };

  // Handle input change with debounce
  const handleInputChange = (value: string) => {
    setInputValue(value);
    
    // Clear existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    // Set new timeout for debounced search
    debounceTimeoutRef.current = setTimeout(() => {
      performSearch(value);
    }, 300);
  };

  // Handle form submission (for non-JS fallback and immediate search on Enter)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear debounce timeout and search immediately
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    performSearch(inputValue);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return (
    <form onSubmit={handleSubmit} className="mt-6 max-w-xl mx-auto">
      <Card 
        variant="glass" 
        padding="none" 
        className="relative overflow-hidden transition-shadow duration-300 focus-within:ring-1 focus-within:ring-cyan-400/50 focus-within:shadow-[0_0_20px_rgba(0,212,255,0.15)]"
      >
        <ScanLine />
        <div className="relative z-10 flex items-center">
          <Search className="w-5 h-5 text-text-muted ml-4 shrink-0" />
          <input
            type="text"
            name="q"
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={placeholder}
            className="flex-1 bg-transparent text-text-primary placeholder:text-text-muted px-4 py-3 text-sm outline-none"
            autoFocus
          />
          <button
            type="submit"
            className="px-4 py-3 text-sm font-medium text-near-green hover:bg-near-green/10 transition-colors"
          >
            Search
          </button>
        </div>
      </Card>
    </form>
  );
}