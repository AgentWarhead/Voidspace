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
  
  // Common contract patterns
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

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!rateLimit(`constellation:${ip}`, 10, 60_000).allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const body = await request.json();
    const { address } = body;

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

    // Fetch transactions for the given address
    const transactionUrl = `https://api.nearblocks.io/v1/account/${address}/txns?page=1&per_page=100&order=desc`;
    
    console.log('Fetching transactions from:', transactionUrl);
    
    let response;
    try {
      response = await fetch(transactionUrl, { 
        headers,
        // Add timeout and cache settings for serverless
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
      
      // Handle rate limiting
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
    
    console.log(`Found ${data.txns.length} transactions for ${address}`);

    // Process transactions to build constellation data
    const connectionMap = new Map<string, {
      transactionCount: number;
      totalValue: number;
      firstSeen: string;
      lastSeen: string;
    }>();
    
    const nodeData = new Map<string, NodeData>();
    
    // Add the center node
    nodeData.set(address, {
      id: address,
      type: getAccountType(address),
      transactionCount: data.txns.length,
      firstSeen: data.txns[data.txns.length - 1]?.block_timestamp,
      lastSeen: data.txns[0]?.block_timestamp
    });

    for (const tx of data.txns) {
      const { receiver_account_id, predecessor_account_id, block_timestamp, actions_agg } = tx;
      
      // Determine the other party in the transaction
      const otherParty: string = predecessor_account_id === address ? receiver_account_id : predecessor_account_id;
      
      if (otherParty === address || otherParty === 'system') continue; // Skip self-transactions and system
      
      // Track connections
      const connectionKey = [address, otherParty].sort().join('->');
      
      if (!connectionMap.has(connectionKey)) {
        connectionMap.set(connectionKey, {
          transactionCount: 0,
          totalValue: 0,
          firstSeen: block_timestamp,
          lastSeen: block_timestamp
        });
      }
      
      const connection = connectionMap.get(connectionKey)!;
      connection.transactionCount++;
      
      // Get transaction value from deposit
      const depositValue = actions_agg?.deposit || 0;
      connection.totalValue += Number(depositValue) / 1e24; // Convert yoctoNEAR to NEAR
      
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
      
      // Only include connections with meaningful interaction
      if (connection.transactionCount >= 1) {
        edges.push({
          source,
          target,
          weight: calculateWeight(connection.transactionCount, connection.totalValue),
          transactionCount: connection.transactionCount,
          totalValue: connection.totalValue
        });
      }
    }

    const constellation: ConstellationData = {
      nodes,
      edges,
      centerNode: address
    };

    console.log(`Built constellation with ${nodes.length} nodes and ${edges.length} edges`);

    // Return with cache headers to reduce API calls
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