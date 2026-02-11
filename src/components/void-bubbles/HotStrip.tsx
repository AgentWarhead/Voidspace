'use client';

import { useEffect, useState, useRef, memo } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VoidBubbleToken {
  id: string;
  symbol: string;
  name: string;
  price: number;
  priceChange24h: number;
  volume24h: number;
  liquidity: number;
  marketCap: number;
  category: string;
  healthScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  riskFactors: string[];
  detectedAt: string;
  priceChange1h: number;
  priceChange6h: number;
  dexScreenerUrl?: string;
  refFinanceUrl?: string;
  contractAddress: string;
}

interface HotStripProps {
  onTokenClick?: (tokenId: string) => void;
}

// Simple in-memory cache to deduplicate API calls (HotStrip + VoidBubblesEngine both fetch /api/void-bubbles)
let cachedTokens: VoidBubbleToken[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 30_000; // 30s

function HotStripInner({ onTokenClick }: HotStripProps) {
  const [tokens, setTokens] = useState<VoidBubbleToken[]>(cachedTokens || []);
  const [loading, setLoading] = useState(!cachedTokens);
  const stripRef = useRef<HTMLDivElement>(null);

  const fetchTokens = async () => {
    // Return cache if still fresh
    if (cachedTokens && Date.now() - cacheTimestamp < CACHE_TTL) {
      setTokens(cachedTokens);
      setLoading(false);
      return;
    }
    try {
      const res = await fetch('/api/void-bubbles');
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      const newTokens = data.tokens || [];
      cachedTokens = newTokens;
      cacheTimestamp = Date.now();
      setTokens(newTokens);
    } catch (error) {
      console.error('Failed to fetch tokens for hot strip:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTokens();
    const interval = setInterval(fetchTokens, 60000); // Refresh every 60s
    return () => clearInterval(interval);
  }, []);

  // Get top 10 movers (5 gainers + 5 losers mixed)
  const topMovers = [...tokens]
    .sort((a, b) => Math.abs(b.priceChange24h) - Math.abs(a.priceChange24h))
    .slice(0, 10);

  // Duplicate items for seamless loop
  const tickerItems = [...topMovers, ...topMovers];

  const handleTokenClick = (tokenId: string) => {
    onTokenClick?.(tokenId);
  };

  if (loading) {
    return (
      <div className="overflow-hidden bg-background/90 border-b border-border">
        <div className="flex items-center px-4 py-2 font-mono text-xs text-text-muted">
          <span className="animate-pulse">⚡ SCANNING MARKET MOVERS...</span>
        </div>
      </div>
    );
  }

  if (topMovers.length === 0) {
    return (
      <div className="overflow-hidden bg-background/90 border-b border-border">
        <div className="flex items-center px-4 py-2 font-mono text-xs text-text-muted">
          <span>⚡ HOT STRIP — NO DATA</span>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden bg-background/90 border-b border-border">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-near-green/3 to-transparent opacity-50" />
      
      {/* Animated ticker */}
      <div 
        ref={stripRef}
        className="relative flex items-center whitespace-nowrap"
        style={{
          animation: 'scroll-left 45s linear infinite',
        }}
      >
        {tickerItems.map((token, index) => {
          const isGainer = token.priceChange24h >= 0;
          const change = token.priceChange24h;
          
          return (
            <div
              key={`${token.id}-${index}`}
              onClick={() => handleTokenClick(token.id)}
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2 cursor-pointer transition-all duration-300",
                "font-mono text-xs font-bold tracking-wide",
                "hover:bg-surface/50 hover:scale-105 hover:shadow-xl",
                "active:scale-95 active:bg-near-green/15",
                "rounded-lg hover:backdrop-blur-sm" // Enhanced styling
              )}
              title={`Click to highlight ${token.symbol} in visualization`}
              style={{
                textShadow: '0 1px 2px rgba(0,0,0,0.8)', // Better text shadow
              }}
            >
              {/* Token symbol with clickable indicator */}
              <span className="text-text-primary flex items-center gap-1">
                {token.symbol}
                <span className="w-1 h-1 bg-near-green/50 rounded-full opacity-60"></span>
              </span>
              
              {/* Change percentage with icon */}
              <div className={cn(
                "flex items-center gap-1",
                isGainer ? "text-near-green" : "text-error"
              )}>
                {isGainer ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                <span>
                  {isGainer ? '+' : ''}{change.toFixed(1)}%
                </span>
              </div>
              
              {/* Separator dot */}
              <span className="text-text-muted">•</span>
            </div>
          );
        })}
      </div>
      
      <style jsx>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}

export const HotStrip = memo(HotStripInner);