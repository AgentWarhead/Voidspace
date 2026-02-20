/**
 * Shared DexScreener service for NEAR Protocol token data.
 * Provides reusable functions for fetching token pairs, market data, and aggregate stats.
 * Results are cached in-memory for 60 seconds.
 */

// --- Types ---

export interface DexPair {
  baseToken: { address: string; name: string; symbol: string };
  quoteToken: { address: string; name: string; symbol: string };
  priceUsd: string;
  volume: { h24: number; h6: number; h1: number };
  priceChange: { h24: number; h6: number; h1: number; m5?: number };
  liquidity: { usd: number };
  marketCap?: number;
  fdv?: number;
  chainId: string;
  dexId?: string;
  pairAddress?: string;
  pairCreatedAt?: number;
  txns?: {
    h24: { buys: number; sells: number };
    h6: { buys: number; sells: number };
    h1: { buys: number; sells: number };
  };
  info?: {
    imageUrl?: string;
    websites?: { url: string; label: string }[];
    socials?: { url: string; type: string }[];
  } | null;
}

export interface TokenData {
  symbol: string;
  name: string;
  contractAddress: string;
  price: number;
  priceChange1h: number;
  priceChange6h: number;
  priceChange24h: number;
  priceChange5m?: number;
  volume24h: number;
  volume6h: number;
  volume1h: number;
  liquidity: number;
  marketCap: number;
  fdv?: number;
  dexId?: string;
  pairAddress?: string;
  pairCreatedAt?: string;
  imageUrl?: string;
  socials?: { url: string; type: string }[];
  websites?: { url: string; label: string }[];
  txns24h?: { buys: number; sells: number };
  txns6h?: { buys: number; sells: number };
  txns1h?: { buys: number; sells: number };
  dexScreenerUrl?: string;
  refFinanceUrl?: string;
}

export interface AggregateStats {
  totalTokens: number;
  totalLiquidity: number;
  totalVolume24h: number;
  totalMarketCap: number;
  gainersCount: number;
  losersCount: number;
}

// --- Cache ---

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const CACHE_TTL_MS = 60_000; // 60 seconds
const cache = new Map<string, CacheEntry<unknown>>();

const CACHE_MISS = Symbol('cache-miss');

function getCached<T>(key: string): T | typeof CACHE_MISS {
  const entry = cache.get(key);
  if (!entry) return CACHE_MISS;
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    cache.delete(key);
    return CACHE_MISS;
  }
  return entry.data as T;
}

function setCache<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() });
}

// --- Helpers ---

function pairToTokenData(pair: DexPair): TokenData {
  return {
    symbol: pair.baseToken?.symbol || 'UNKNOWN',
    name: pair.baseToken?.name || 'Unknown',
    contractAddress: pair.baseToken?.address || '',
    price: parseFloat(pair.priceUsd) || 0,
    priceChange1h: pair.priceChange?.h1 || 0,
    priceChange6h: pair.priceChange?.h6 || 0,
    priceChange24h: pair.priceChange?.h24 || 0,
    priceChange5m: pair.priceChange?.m5 ?? undefined,
    volume24h: pair.volume?.h24 || 0,
    volume6h: pair.volume?.h6 || 0,
    volume1h: pair.volume?.h1 || 0,
    liquidity: pair.liquidity?.usd || 0,
    marketCap: pair.marketCap || pair.fdv || 0,
    fdv: pair.fdv,
    dexId: pair.dexId,
    pairAddress: pair.pairAddress,
    pairCreatedAt: pair.pairCreatedAt
      ? new Date(pair.pairCreatedAt).toISOString()
      : undefined,
    imageUrl: pair.info?.imageUrl,
    socials: pair.info?.socials,
    websites: pair.info?.websites,
    txns24h: pair.txns?.h24,
    txns6h: pair.txns?.h6,
    txns1h: pair.txns?.h1,
    dexScreenerUrl: pair.baseToken?.address
      ? `https://dexscreener.com/near/${pair.baseToken.address}`
      : undefined,
    refFinanceUrl: pair.baseToken?.address
      ? `https://app.ref.finance/#near|${pair.baseToken.address}`
      : undefined,
  };
}

/**
 * Pick the best pair per base token symbol (highest liquidity).
 */
function deduplicatePairs(pairs: DexPair[]): Map<string, DexPair> {
  const tokenMap = new Map<string, DexPair>();
  for (const pair of pairs) {
    if (pair.chainId !== 'near') continue;
    const sym = pair.baseToken?.symbol;
    if (!sym) continue;
    const existing = tokenMap.get(sym);
    if (!existing || (pair.liquidity?.usd || 0) > (existing.liquidity?.usd || 0)) {
      tokenMap.set(sym, pair);
    }
  }
  return tokenMap;
}

// --- Public API ---

// ── Option C: Multi-source discovery + curated safety net ────────────────────
//
// Query DexScreener using multiple major NEAR quote assets as base tokens.
// This surfaces tokens paired against wNEAR, AURORA, USDC, and USDT on Ref
// Finance — far broader than the single wrap.near query which only returned ~20.
//
// A curated address set acts as a safety net: known ecosystem tokens are always
// included even if they don't surface through the base-token queries, and they
// bypass the liquidity/volume filter entirely.

const NEAR_BASE_QUERIES = [
  'wrap.near',                                                    // wNEAR — largest pool, most pairs
  'aurora',                                                       // AURORA — ETH-bridged asset pairs
  'usdt.tether-token.near',                                       // USDT — stablecoin-quoted pairs
  'a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.factory.bridge.near', // USDC (Rainbow Bridge) — brings NEKO, DAI, STNEAR, cUSD
  'token.v2.ref-finance.near',                                    // REF — surfaces REF, OCT and ref-paired tokens
];

// Known NEAR ecosystem token contract addresses.
// Always fetched & included regardless of current liquidity/volume.
const CURATED_TOKEN_ADDRESSES = new Set([
  // Core DeFi
  'token.v2.ref-finance.near',     // REF (Ref Finance)
  'token.paras.near',              // PARAS (NFT marketplace)
  'sweat_welcome.near',            // SWEAT (Move-to-Earn)
  'meta-token.near',               // META (Meta Pool governance)
  'v2-nearx.stader-labs.near',     // NearX (Stader liquid staking)
  'token.burrow.near',             // BRRR (Burrow lending)
  'token.cheddar.near',            // CHEDDAR
  'token.pembrock.near',           // PEM (Pembrock)
  // Meme / Community
  'blackdragon.tkn.near',          // BLACKDRAGON
  'lonk.meme-cooking.near',        // LONK
  'neko.tkn.near',                 // NEKO
  'bean.tkn.near',                 // BEAN
  // Infra / Bridges
  'aurora',                        // AURORA
  'wrap.near',                     // wNEAR
  // Other ecosystem
  'hapi.tkn.near',                 // HAPI (security oracle)
  'intel.tkn.near',                // INTEL (AI/oracle)
]);

/**
 * Fetch all NEAR pairs from DexScreener using multi-source discovery.
 * Sources: 4 base-token queries (parallel) + curated safety-net addresses.
 */
export async function fetchNearTokens(): Promise<TokenData[]> {
  const cacheKey = 'near-all-tokens';
  const cached = getCached<TokenData[]>(cacheKey);
  if (cached !== CACHE_MISS) return cached;

  // ── 1. Parallel base-token queries ─────────────────────────────────────────
  const fetchResults = await Promise.allSettled(
    NEAR_BASE_QUERIES.map(addr =>
      fetch(`https://api.dexscreener.com/latest/dex/tokens/${addr}`, {
        next: { revalidate: 60 },
      })
        .then(r => r.ok ? r.json() : { pairs: [] })
        .catch(() => ({ pairs: [] }))
    )
  );

  const allPairs: DexPair[] = [];
  for (const result of fetchResults) {
    if (result.status === 'fulfilled') {
      allPairs.push(...(result.value?.pairs || []));
    }
  }

  // Best pair per symbol, NEAR chain only (highest liquidity wins)
  const tokenMap = deduplicatePairs(allPairs);

  // ── 2. Fetch any curated tokens not yet discovered ──────────────────────────
  const discoveredAddresses = new Set(
    Array.from(tokenMap.values()).map(p => p.baseToken?.address || '')
  );
  const missingCurated = [...CURATED_TOKEN_ADDRESSES].filter(
    addr => !discoveredAddresses.has(addr)
  );

  if (missingCurated.length > 0) {
    const BATCH = 15;
    for (let i = 0; i < missingCurated.length; i += BATCH) {
      if (i > 0) await new Promise(r => setTimeout(r, 200));
      try {
        const res = await fetch(
          `https://api.dexscreener.com/latest/dex/tokens/${missingCurated.slice(i, i + BATCH).join(',')}`,
          { next: { revalidate: 60 } }
        );
        if (res.ok) {
          const data = await res.json();
          const pairs: DexPair[] = (data?.pairs || []).filter((p: DexPair) => p.chainId === 'near');
          for (const pair of pairs) {
            const sym = pair.baseToken?.symbol;
            if (!sym) continue;
            const existing = tokenMap.get(sym);
            if (!existing || (pair.liquidity?.usd || 0) > (existing.liquidity?.usd || 0)) {
              tokenMap.set(sym, pair);
            }
          }
        }
      } catch { /* skip failed batches silently */ }
    }
  }

  // ── 3. Build output with quality filter ────────────────────────────────────
  const tokens: TokenData[] = [];
  const seenAddresses = new Set<string>();

  for (const pair of Array.from(tokenMap.values())) {
    const addr = pair.baseToken?.address || '';
    if (seenAddresses.has(addr)) continue;
    seenAddresses.add(addr);

    const liquidity = pair.liquidity?.usd || 0;
    const volume = pair.volume?.h24 || 0;
    const isCurated = CURATED_TOKEN_ADDRESSES.has(addr);

    // Curated tokens: always include (known ecosystem tokens).
    // Others: $5k liquidity OR $500 daily volume to filter dead/junk pairs.
    if (isCurated || liquidity >= 5000 || volume >= 500) {
      tokens.push(pairToTokenData(pair));
    }
  }

  tokens.sort((a, b) => b.marketCap - a.marketCap);
  setCache(cacheKey, tokens);
  return tokens;
}

/**
 * Fetch a single token's data by symbol (case-insensitive match).
 */
export async function fetchTokenBySymbol(symbol: string): Promise<TokenData | null> {
  const cacheKey = `token-sym-${symbol.toLowerCase()}`;
  const cached = getCached<TokenData | null>(cacheKey);
  if (cached !== CACHE_MISS) return cached;

  // First try the full NEAR tokens list (already cached)
  try {
    const allTokens = await fetchNearTokens();
    const match = allTokens.find(
      (t) => t.symbol.toLowerCase() === symbol.toLowerCase()
    );
    if (match) {
      setCache(cacheKey, match);
      return match;
    }
  } catch {
    // Fall through to search
  }

  // Fallback: use DexScreener search
  try {
    const res = await fetch(
      `https://api.dexscreener.com/latest/dex/search?q=${encodeURIComponent(symbol)}`,
      { next: { revalidate: 60 } }
    );
    if (res.ok) {
      const data = await res.json();
      const pairs: DexPair[] = data?.pairs || [];
      const nearPair = pairs.find(
        (p) =>
          p.chainId === 'near' &&
          p.baseToken?.symbol?.toLowerCase() === symbol.toLowerCase()
      );
      if (nearPair) {
        const token = pairToTokenData(nearPair);
        setCache(cacheKey, token);
        return token;
      }
    }
  } catch {
    // Ignore search errors
  }

  setCache(cacheKey, null);
  return null;
}

/**
 * Fetch multiple tokens' data by contract addresses in batched requests.
 * DexScreener supports comma-separated multi-token lookup.
 * Batches into groups of 15 to stay within URL length limits.
 */
export async function fetchTokensByAddresses(
  addresses: string[],
  signal?: AbortSignal
): Promise<Map<string, TokenData>> {
  const result = new Map<string, TokenData>();
  if (addresses.length === 0) return result;

  // Deduplicate and check cache first
  const unique = [...new Set(addresses)];
  const uncached: string[] = [];

  for (const addr of unique) {
    const cached = getCached<TokenData | null>(`token-addr-${addr}`);
    if (cached !== CACHE_MISS) {
      if (cached !== null) result.set(addr, cached);
    } else {
      uncached.push(addr);
    }
  }

  if (uncached.length === 0) return result;

  // Batch into groups of 15
  const BATCH_SIZE = 15;
  const batches: string[][] = [];
  for (let i = 0; i < uncached.length; i += BATCH_SIZE) {
    batches.push(uncached.slice(i, i + BATCH_SIZE));
  }

  // Process batches sequentially with a stagger to avoid rate limiting
  for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
    if (batchIndex > 0) {
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
    const batch = batches[batchIndex];
    await (async () => {
      try {
        const joined = batch.join(',');
        const res = await fetch(
          `https://api.dexscreener.com/latest/dex/tokens/${joined}`,
          { next: { revalidate: 60 }, signal }
        );
        if (!res.ok) return;

        const data = await res.json();
        const pairs: DexPair[] = data?.pairs || [];

        // Group by base token address, pick highest liquidity NEAR pair for each
        const bestByAddress = new Map<string, DexPair>();
        for (const pair of pairs) {
          if (pair.chainId !== 'near') continue;
          const addr = pair.baseToken?.address;
          if (!addr) continue;
          const existing = bestByAddress.get(addr);
          if (!existing || (pair.liquidity?.usd || 0) > (existing.liquidity?.usd || 0)) {
            bestByAddress.set(addr, pair);
          }
        }

        for (const addr of batch) {
          const bestPair = bestByAddress.get(addr);
          if (bestPair) {
            const token = pairToTokenData(bestPair);
            result.set(addr, token);
            setCache(`token-addr-${addr}`, token);
          } else {
            // Cache miss so we don't re-fetch next time
            setCache(`token-addr-${addr}`, null);
          }
        }
      } catch {
        // Silently skip failed batches
      }
    })();
  }

  return result;
}

/**
 * Fetch a single token's data by contract address.
 */
export async function fetchTokenByAddress(contractAddress: string): Promise<TokenData | null> {
  const cacheKey = `token-addr-${contractAddress}`;
  const cached = getCached<TokenData | null>(cacheKey);
  if (cached !== CACHE_MISS) return cached;

  try {
    const res = await fetch(
      `https://api.dexscreener.com/latest/dex/tokens/${contractAddress}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;

    const data = await res.json();
    const pairs: DexPair[] = data?.pairs || [];
    const nearPairs = pairs.filter((p) => p.chainId === 'near');
    if (nearPairs.length === 0) return null;

    // Pick highest liquidity pair
    nearPairs.sort((a, b) => (b.liquidity?.usd || 0) - (a.liquidity?.usd || 0));
    const token = pairToTokenData(nearPairs[0]);
    setCache(cacheKey, token);
    return token;
  } catch {
    return null;
  }
}

/**
 * Get top movers (sorted by absolute 24h price change).
 */
export async function fetchTopMovers(limit: number = 10): Promise<{
  gainers: TokenData[];
  losers: TokenData[];
}> {
  const tokens = await fetchNearTokens();

  const withVolume = tokens.filter((t) => t.volume24h > 100);
  const sorted = [...withVolume].sort(
    (a, b) => Math.abs(b.priceChange24h) - Math.abs(a.priceChange24h)
  );

  const gainers = sorted
    .filter((t) => t.priceChange24h > 0)
    .slice(0, limit);
  const losers = sorted
    .filter((t) => t.priceChange24h < 0)
    .slice(0, limit);

  return { gainers, losers };
}

/**
 * Get aggregate stats across all NEAR DeFi tokens.
 */
export async function getAggregateStats(): Promise<AggregateStats> {
  const tokens = await fetchNearTokens();

  return {
    totalTokens: tokens.length,
    totalLiquidity: tokens.reduce((sum, t) => sum + t.liquidity, 0),
    totalVolume24h: tokens.reduce((sum, t) => sum + t.volume24h, 0),
    totalMarketCap: tokens.reduce((sum, t) => sum + t.marketCap, 0),
    gainersCount: tokens.filter((t) => t.priceChange24h > 0).length,
    losersCount: tokens.filter((t) => t.priceChange24h < 0).length,
  };
}

/**
 * Fetch recently created pairs (within the last N hours).
 */
export async function fetchNewPairs(hours: number = 24): Promise<TokenData[]> {
  const tokens = await fetchNearTokens();
  const cutoff = Date.now() - hours * 60 * 60 * 1000;

  return tokens.filter((t) => {
    if (!t.pairCreatedAt) return false;
    return new Date(t.pairCreatedAt).getTime() > cutoff;
  });
}
