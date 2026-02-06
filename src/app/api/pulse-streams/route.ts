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

async function fetchLatestTransactions(filters: StreamFilters = {}): Promise<TransactionData[]> {
  try {
    const baseUrl = 'https://api.nearblocks.io/v1/txns';
    const params = new URLSearchParams({
      page: '1',
      per_page: '50',
      order: 'desc'
    });

    // Add account filter if provided
    if (filters.accounts && filters.accounts.length > 0) {
      // For simplicity, we'll filter after fetching
      // In production, you'd want multiple API calls or a better endpoint
    }

    const response = await fetch(`${baseUrl}?${params}`, {
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    let transactions: TransactionData[] = data.txns || [];

    // Apply filters
    if (filters.accounts && filters.accounts.length > 0) {
      const accountSet = new Set(filters.accounts.map(a => a.toLowerCase()));
      transactions = transactions.filter(tx => 
        accountSet.has(tx.signer_id.toLowerCase()) || 
        accountSet.has(tx.receiver_id.toLowerCase())
      );
    }

    if (filters.txType && filters.txType !== 'all') {
      const txTypeFilter = filters.txType;
      transactions = transactions.filter(tx => 
        tx.action_kind.toLowerCase() === txTypeFilter.toLowerCase()
      );
    }

    if (filters.minAmount && filters.minAmount > 0) {
      transactions = transactions.filter(tx => {
        const amount = parseFloat(tx.deposit) || 0;
        return amount >= filters.minAmount!;
      });
    }

    if (!filters.includeContracts) {
      // Filter out contract calls if requested
      transactions = transactions.filter(tx => 
        !tx.receiver_id.includes('.') || tx.receiver_id.endsWith('.near')
      );
    }

    return transactions.slice(0, 30); // Limit to 30 most recent

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

    // Validate txType if provided
    if (txType && !/^[a-zA-Z_-]+$/.test(txType)) {
      return NextResponse.json({ error: 'Invalid txType format' }, { status: 400 });
    }

    // Validate minAmount if provided
    let minAmount: number | undefined;
    if (minAmountStr) {
      minAmount = parseFloat(minAmountStr);
      if (isNaN(minAmount) || minAmount < 0) {
        return NextResponse.json({ error: 'minAmount must be a positive number' }, { status: 400 });
      }
    }

    // Validate accounts if provided
    let accounts: string[] | undefined;
    if (accountsStr) {
      accounts = accountsStr.split(',').filter(Boolean);
      if (accounts.length > 10) {
        return NextResponse.json({ error: 'Too many accounts (max 10)' }, { status: 400 });
      }
      // Basic account ID validation
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

// WebSocket endpoint for real-time updates (simplified polling approach)
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