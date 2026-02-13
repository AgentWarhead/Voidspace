import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/auth/rate-limit';
import { isValidNearAccountId } from '@/lib/auth/validate';

interface Transaction {
  transaction_hash: string;
  receiver_account_id: string;
  predecessor_account_id: string;
  block_timestamp: string;
  actions: Array<{
    action: string;
    method?: string | null;
    deposit: number;
    args?: string | null;
  }>;
  actions_agg?: {
    deposit: number;
  };
}

interface NearBlocksResponse {
  txns: Transaction[];
}

interface NodeData {
  id: string;
  type: 'wallet' | 'contract' | 'dao';
  balance?: number;
  transactionCount: number;
  firstSeen?: string;
  lastSeen?: string;
}

interface EdgeData {
  source: string;
  target: string;
  weight: number;
  transactionCount: number;
  totalValue: number;
  // Direction-aware fields (relative to queried address)
  sentCount: number;
  receivedCount: number;
  totalValueSent: number;
  totalValueReceived: number;
  direction: 'outflow' | 'inflow' | 'bidirectional';
  lastInteraction?: string;
  firstInteraction?: string;
}

interface ConstellationData {
  nodes: NodeData[];
  edges: EdgeData[];
  centerNode: string;
}

// Helper function to determine account type
function getAccountType(accountId: string): 'wallet' | 'contract' | 'dao' {
  if (accountId.includes('.dao') || accountId.includes('.sputnik')) {
    return 'dao';
  }
  
  const contractPatterns = [
    '.pool',
    '.poolv1',
    '.factory',
    '.token',
    '.swap',
    '.ref',
    '.jumbo',
    '.orderly',
    '.spin',
    '.dex',
    '.bridge'
  ];
  
  if (contractPatterns.some(pattern => accountId.includes(pattern)) || 
      accountId.includes('.') && !accountId.endsWith('.near') && !accountId.endsWith('.testnet')) {
    return 'contract';
  }
  
  return 'wallet';
}

// Helper function to calculate interaction strength
function calculateWeight(txCount: number, totalValue: number): number {
  const txWeight = Math.log(txCount + 1) * 10;
  const valueWeight = Math.log(totalValue + 1) * 5;
  return Math.min(txWeight + valueWeight, 100);
}

// Helper: get period cutoff timestamp in nanoseconds
function getPeriodCutoff(period: string): string | null {
  const now = Date.now();
  let msAgo: number;
  switch (period) {
    case '7d': msAgo = 7 * 24 * 60 * 60 * 1000; break;
    case '30d': msAgo = 30 * 24 * 60 * 60 * 1000; break;
    case '90d': msAgo = 90 * 24 * 60 * 60 * 1000; break;
    default: return null; // 'all'
  }
  // NearBlocks timestamps are in nanoseconds
  return ((now - msAgo) * 1_000_000).toString();
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!rateLimit(`constellation:${ip}`, 10, 60_000).allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const body = await request.json();
    const { address, period } = body;

    if (!address || typeof address !== 'string') {
      return NextResponse.json({ error: 'Address is required and must be a string' }, { status: 400 });
    }

    if (!isValidNearAccountId(address)) {
      return NextResponse.json({ error: 'Invalid NEAR account ID format' }, { status: 400 });
    }

    const apiKey = process.env.NEARBLOCKS_API_KEY;
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'User-Agent': 'Voidspace-Constellation/1.0'
    };
    
    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    // Fetch transactions for the given address (increased to 250)
    const transactionUrl = `https://api.nearblocks.io/v1/account/${address}/txns?page=1&per_page=250&order=desc`;
    
    console.log('Fetching transactions from:', transactionUrl);
    
    let response;
    try {
      response = await fetch(transactionUrl, { 
        headers,
        next: { revalidate: 60 }
      });
    } catch (fetchError) {
      console.error('Fetch error:', fetchError);
      return NextResponse.json(
        { error: 'Network error connecting to NEAR Blocks API' },
        { status: 503 }
      );
    }
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('NEAR Blocks API error:', response.status, errorText);
      
      if (response.status === 429) {
        return NextResponse.json(
          { error: 'Rate limited by NEAR Blocks. Please wait a moment and try again.' },
          { status: 429 }
        );
      }
      
      return NextResponse.json(
        { error: `NEAR Blocks API error: ${response.status}` },
        { status: response.status }
      );
    }

    let data: NearBlocksResponse;
    try {
      data = await response.json();
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return NextResponse.json(
        { error: 'Failed to parse NEAR Blocks response' },
        { status: 500 }
      );
    }
    
    if (!data.txns || !Array.isArray(data.txns)) {
      console.log('No txns in response, data keys:', Object.keys(data));
      return NextResponse.json(
        { error: 'No transaction data found for this address' },
        { status: 404 }
      );
    }

    // Filter by period if specified
    const periodCutoff = getPeriodCutoff(period || 'all');
    let filteredTxns = data.txns;
    if (periodCutoff) {
      filteredTxns = data.txns.filter(tx => tx.block_timestamp >= periodCutoff);
    }
    
    console.log(`Found ${data.txns.length} transactions, ${filteredTxns.length} after period filter for ${address}`);

    // Process transactions to build constellation data
    const connectionMap = new Map<string, {
      transactionCount: number;
      totalValue: number;
      sentCount: number;
      receivedCount: number;
      totalValueSent: number;
      totalValueReceived: number;
      firstSeen: string;
      lastSeen: string;
    }>();
    
    const nodeData = new Map<string, NodeData>();
    
    // Add the center node
    nodeData.set(address, {
      id: address,
      type: getAccountType(address),
      transactionCount: filteredTxns.length,
      firstSeen: filteredTxns[filteredTxns.length - 1]?.block_timestamp,
      lastSeen: filteredTxns[0]?.block_timestamp
    });

    for (const tx of filteredTxns) {
      const { receiver_account_id, predecessor_account_id, block_timestamp, actions_agg } = tx;
      
      // Determine the other party in the transaction
      const otherParty: string = predecessor_account_id === address ? receiver_account_id : predecessor_account_id;
      const isSent = predecessor_account_id === address; // center node is the sender
      
      if (otherParty === address || otherParty === 'system') continue;
      
      // Track connections — use directed key (always center -> other)
      const connectionKey = [address, otherParty].sort().join('->');
      
      if (!connectionMap.has(connectionKey)) {
        connectionMap.set(connectionKey, {
          transactionCount: 0,
          totalValue: 0,
          sentCount: 0,
          receivedCount: 0,
          totalValueSent: 0,
          totalValueReceived: 0,
          firstSeen: block_timestamp,
          lastSeen: block_timestamp
        });
      }
      
      const connection = connectionMap.get(connectionKey)!;
      connection.transactionCount++;
      
      const depositValue = actions_agg?.deposit || 0;
      const nearValue = Number(depositValue) / 1e24;
      connection.totalValue += nearValue;
      
      // Track direction relative to the queried address
      if (isSent) {
        connection.sentCount++;
        connection.totalValueSent += nearValue;
      } else {
        connection.receivedCount++;
        connection.totalValueReceived += nearValue;
      }
      
      if (block_timestamp > connection.lastSeen) {
        connection.lastSeen = block_timestamp;
      }
      if (block_timestamp < connection.firstSeen) {
        connection.firstSeen = block_timestamp;
      }
      
      // Add node data for the other party
      if (!nodeData.has(otherParty)) {
        nodeData.set(otherParty, {
          id: otherParty,
          type: getAccountType(otherParty),
          transactionCount: 0,
          firstSeen: block_timestamp,
          lastSeen: block_timestamp
        });
      }
      
      const otherNode = nodeData.get(otherParty)!;
      otherNode.transactionCount++;
      
      if (block_timestamp > otherNode.lastSeen!) {
        otherNode.lastSeen = block_timestamp;
      }
      if (block_timestamp < otherNode.firstSeen!) {
        otherNode.firstSeen = block_timestamp;
      }
    }

    // Convert to constellation format
    const nodes = Array.from(nodeData.values());
    const edges: EdgeData[] = [];
    
    for (const [connectionKey, connection] of Array.from(connectionMap.entries())) {
      const [source, target] = connectionKey.split('->');
      
      if (connection.transactionCount >= 1) {
        // Determine primary direction
        let direction: 'outflow' | 'inflow' | 'bidirectional' = 'bidirectional';
        if (connection.sentCount > 0 && connection.receivedCount === 0) {
          direction = 'outflow';
        } else if (connection.receivedCount > 0 && connection.sentCount === 0) {
          direction = 'inflow';
        }

        edges.push({
          source,
          target,
          weight: calculateWeight(connection.transactionCount, connection.totalValue),
          transactionCount: connection.transactionCount,
          totalValue: connection.totalValue,
          sentCount: connection.sentCount,
          receivedCount: connection.receivedCount,
          totalValueSent: connection.totalValueSent,
          totalValueReceived: connection.totalValueReceived,
          direction,
          lastInteraction: connection.lastSeen,
          firstInteraction: connection.firstSeen,
        });
      }
    }

    const constellation: ConstellationData = {
      nodes,
      edges,
      centerNode: address
    };

    console.log(`Built constellation with ${nodes.length} nodes and ${edges.length} edges`);

    return NextResponse.json(constellation, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      }
    });
    
  } catch (error) {
    console.error('Constellation API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
