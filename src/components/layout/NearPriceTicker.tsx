'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PriceData {
  price: number;
  change24h: number;
  marketCap: number;
  lastUpdated: string;
}

export function NearPriceTicker() {
  const [data, setData] = useState<PriceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const router = useRouter();

  const fetchPrice = async () => {
    try {
      const res = await fetch('/api/near-price');
      if (!res.ok) throw new Error('Failed to fetch');
      const priceData = await res.json();
      if (priceData.price > 0) {
        setData(priceData);
        setError(false);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrice();
    
    // Refresh every 60 seconds
    const interval = setInterval(fetchPrice, 60000);
    return () => clearInterval(interval);
  }, []);

  // Don't render anything if there's an error or no data
  if (error || (!loading && !data)) {
    return null;
  }

  // Loading skeleton
  if (loading) {
    return (
      <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface border border-border">
        <div className="w-8 h-4 bg-surface-hover rounded animate-pulse" />
        <div className="w-12 h-4 bg-surface-hover rounded animate-pulse" />
      </div>
    );
  }

  const isPositive = data!.change24h >= 0;
  const formattedPrice = data!.price.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const formattedChange = `${isPositive ? '+' : ''}${data!.change24h.toFixed(2)}%`;

  return (
    <div 
      className={cn(
        "hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md border transition-colors cursor-pointer",
        isPositive 
          ? "bg-near-green/5 border-near-green/20 hover:bg-near-green/10" 
          : "bg-error/5 border-error/20 hover:bg-error/10"
      )}
      title={`Market Cap: $${(data!.marketCap / 1e9).toFixed(2)}B — Click to open Void Bubbles`}
      onClick={() => router.push('/void-bubbles')}
    >
      {/* NEAR Logo */}
      <svg 
        className="w-3.5 h-3.5" 
        viewBox="0 0 24 24" 
        fill="currentColor"
      >
        <path d="M12 0L3 6v12l9 6 9-6V6l-9-6zm0 2.5l6.5 4.3v8.4L12 19.5l-6.5-4.3V6.8L12 2.5z" 
          className={isPositive ? "text-near-green" : "text-error"}
        />
      </svg>
      
      {/* Price */}
      <span className="text-xs font-medium text-text-primary font-mono">
        {formattedPrice}
      </span>
      
      {/* Change */}
      <span 
        className={cn(
          "flex items-center gap-0.5 text-xs font-medium font-mono",
          isPositive ? "text-near-green" : "text-error"
        )}
      >
        {isPositive ? (
          <TrendingUp className="w-3 h-3" />
        ) : (
          <TrendingDown className="w-3 h-3" />
        )}
        {formattedChange}
      </span>
    </div>
  );
}
