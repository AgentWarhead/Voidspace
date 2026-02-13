import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/auth/rate-limit';

interface TransactionData {
  hash: string;
  block_height: number;
  block_timestamp: string;
  signer_id: string;
  receiver_id: string;
  action_kind: string;
  args: Record<string, unknown>;
  deposit: string;
  gas: string;
  method_name?: string;
  status: 'SUCCESS' | 'FAILURE';
}

interface StreamFilters {
  txType?: string;
  minAmount?: number;
  accounts?: string[];
  includeContracts?: boolean;
}

// NearBlocks API response types
interface NearBlocksTxn {
  id?: string;
  transaction_hash?: string;
  included_in_block_hash?: string;
  block_timestamp?: string;
  signer_account_id?: string;
  receiver_account_id?: string;
  block?: { block_height?: number };
  actions?: Array<{
    action?: string;
    method?: string;
  }> | null;
  actions_agg?: { deposit?: number };
  outcomes?: { status?: boolean | null };
  outcomes_agg?: { transaction_fee?: number };
}

function mapTransaction(raw: NearBlocksTxn): TransactionData | null {
  const hash = raw.transaction_hash;
  const signerId = raw.signer_account_id;
  const receiverId = raw.receiver_account_id;

  // Skip transactions with missing critical fields
  if (!hash || !signerId || !receiverId) return null;

  // Parse block_timestamp (nanoseconds) to ISO string
  let blockTimestamp: string;
  if (raw.block_timestamp) {
    const ms = Math.floor(parseInt(raw.block_timestamp) / 1_000_000);
    blockTimestamp = new Date(ms).toISOString();
  } else {
    blockTimestamp = new Date().toISOString();
  }

  // Determine action kind from actions array
  let actionKind = 'UNKNOWN';
  let methodName: string | undefined;
  if (raw.actions && Array.isArray(raw.actions) && raw.actions.length > 0) {
    actionKind = raw.actions[0]?.action || 'UNKNOWN';
    methodName = raw.actions[0]?.method || undefined;
  }

  // Convert deposit from yoctoNEAR number to NEAR string
  const depositYocto = raw.actions_agg?.deposit ?? 0;
  const depositNear = depositYocto / 1e24;
  const depositStr = depositNear.toString();

  // Determine status
  let status: 'SUCCESS' | 'FAILURE' = 'SUCCESS';
  if (raw.outcomes?.status === false) {
    status = 'FAILURE';
  }

  return {
    hash,
    block_height: raw.block?.block_height ?? 0,
    block_timestamp: blockTimestamp,
    signer_id: signerId,
    receiver_id: receiverId,
    action_kind: actionKind,
    args: {},
    deposit: depositStr,
    gas: (raw.outcomes_agg?.transaction_fee ?? 0).toString(),
    method_name: methodName,
    status,
  };
}

async function fetchLatestTransactions(filters: StreamFilters = {}): Promise<TransactionData[]> {
  try {
    const baseUrl = 'https://api.nearblocks.io/v1/txns';
    const params = new URLSearchParams({
      page: '1',
      per_page: '50',
      order: 'desc'
    });

    const response = await fetch(`${baseUrl}?${params}`, {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 5 }, // Cache for 5 seconds
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    const rawTxns: NearBlocksTxn[] = data.txns || [];

    // Map and filter out invalid transactions
    let transactions: TransactionData[] = rawTxns
      .map(mapTransaction)
      .filter((tx): tx is TransactionData => tx !== null);

    // Apply filters with null safety
    if (filters.accounts && filters.accounts.length > 0) {
      const accountSet = new Set(filters.accounts.map(a => a.toLowerCase()));
      transactions = transactions.filter(tx =>
        accountSet.has((tx.signer_id || '').toLowerCase()) ||
        accountSet.has((tx.receiver_id || '').toLowerCase())
      );
    }

    if (filters.txType && filters.txType !== 'all') {
      const txTypeFilter = filters.txType.toLowerCase();
      transactions = transactions.filter(tx =>
        (tx.action_kind || '').toLowerCase() === txTypeFilter
      );
    }

    if (filters.minAmount && filters.minAmount > 0) {
      transactions = transactions.filter(tx => {
        const amount = parseFloat(tx.deposit) || 0;
        return amount >= filters.minAmount!;
      });
    }

    if (!filters.includeContracts) {
      transactions = transactions.filter(tx =>
        !(tx.receiver_id || '').includes('.') || (tx.receiver_id || '').endsWith('.near')
      );
    }

    return transactions.slice(0, 30);

  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
}

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!rateLimit(`pulse-streams:${ip}`, 10, 60_000).allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const { searchParams } = new URL(request.url);

    // Input validation for filters
    const txType = searchParams.get('txType');
    const minAmountStr = searchParams.get('minAmount');
    const accountsStr = searchParams.get('accounts');
    const includeContractsStr = searchParams.get('includeContracts');

    if (txType && !/^[a-zA-Z_-]+$/.test(txType)) {
      return NextResponse.json({ error: 'Invalid txType format' }, { status: 400 });
    }

    let minAmount: number | undefined;
    if (minAmountStr) {
      minAmount = parseFloat(minAmountStr);
      if (isNaN(minAmount) || minAmount < 0) {
        return NextResponse.json({ error: 'minAmount must be a positive number' }, { status: 400 });
      }
    }

    let accounts: string[] | undefined;
    if (accountsStr) {
      accounts = accountsStr.split(',').filter(Boolean);
      if (accounts.length > 10) {
        return NextResponse.json({ error: 'Too many accounts (max 10)' }, { status: 400 });
      }
      for (const account of accounts) {
        if (account.length > 64 || !/^[a-z0-9._-]+$/i.test(account)) {
          return NextResponse.json({ error: 'Invalid account ID format' }, { status: 400 });
        }
      }
    }

    const filters: StreamFilters = {
      txType: txType || undefined,
      minAmount,
      accounts,
      includeContracts: includeContractsStr === 'true'
    };

    const transactions = await fetchLatestTransactions(filters);

    return NextResponse.json({
      transactions,
      count: transactions.length,
      timestamp: new Date().toISOString(),
      filters
    });

  } catch (error) {
    console.error('Pulse Streams API error:', error);
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!rateLimit(`pulse-streams-poll:${ip}`, 10, 60_000).allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const { lastTimestamp, filters } = await request.json();

    const transactions = await fetchLatestTransactions(filters);

    // Filter for transactions newer than lastTimestamp
    const newTransactions = lastTimestamp
      ? transactions.filter(tx => new Date(tx.block_timestamp) > new Date(lastTimestamp))
      : transactions;

    return NextResponse.json({
      transactions: newTransactions,
      count: newTransactions.length,
      timestamp: new Date().toISOString(),
      hasNew: newTransactions.length > 0
    });

  } catch (error) {
    console.error('Pulse Streams polling error:', error);
    return NextResponse.json({ error: 'Failed to poll transactions' }, { status: 500 });
  }
}
