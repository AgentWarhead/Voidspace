import { NextRequest, NextResponse } from 'next/server';

interface Transaction {
  hash: string;
  receiver_account_id: string;
  signer_account_id: string;
  block_timestamp: string;
  transaction_actions: Array<{
    action_kind: string;
    args?: any;
  }>;
  outcomes: {
    transaction_outcome: {
      outcome: {
        gas_burnt: number;
      };
    };
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
    const body = await request.json();
    const { address, depth = 1 } = body;

    if (!address) {
      return NextResponse.json({ error: 'Address is required' }, { status: 400 });
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
    const transactionUrl = `https://api.nearblocks.io/v1/account/${address}/txns?page=1&per_page=500&order=desc`;
    
    console.log('Fetching transactions for:', address);
    
    const response = await fetch(transactionUrl, { headers });
    
    if (!response.ok) {
      console.error('NEAR Blocks API error:', response.status, response.statusText);
      return NextResponse.json(
        { error: 'Failed to fetch transaction data from NEAR Blocks' },
        { status: response.status }
      );
    }

    const data: NearBlocksResponse = await response.json();
    
    if (!data.txns) {
      return NextResponse.json(
        { error: 'No transaction data found' },
        { status: 404 }
      );
    }

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
      const { receiver_account_id, signer_account_id, block_timestamp, outcomes } = tx;
      
      // Determine the other party in the transaction
      const otherParty = signer_account_id === address ? receiver_account_id : signer_account_id;
      
      if (otherParty === address) continue; // Skip self-transactions
      
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
      
      // Estimate transaction value based on gas used (rough approximation)
      const gasUsed = outcomes?.transaction_outcome?.outcome?.gas_burnt || 0;
      connection.totalValue += gasUsed / 1e12; // Convert to NEAR
      
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
    
    for (const [connectionKey, connection] of connectionMap) {
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

    return NextResponse.json(constellation);
    
  } catch (error) {
    console.error('Constellation API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}