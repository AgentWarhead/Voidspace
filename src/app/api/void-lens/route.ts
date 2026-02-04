import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/auth/rate-limit';

interface WalletData {
  account: string;
  balance: string;
  transactions: any[];
  contracts: any[];
  tokens: any[];
  stats: {
    total_transactions: number;
    first_transaction: string | null;
    last_transaction: string | null;
  };
}

interface ReputationAnalysis {
  score: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  activitySummary: string;
  keyInsights: string[];
  details: {
    ageScore: number;
    activityScore: number;
    diversityScore: number;
    balanceScore: number;
  };
}

async function fetchWalletData(address: string): Promise<WalletData | null> {
  try {
    const baseUrl = 'https://api.nearblocks.io/v1/account';
    
    // Fetch basic account info
    const accountResponse = await fetch(`${baseUrl}/${address}`, {
      headers: { 'Accept': 'application/json' }
    });
    
    if (!accountResponse.ok) {
      throw new Error(`Failed to fetch account: ${accountResponse.status}`);
    }
    
    const accountData = await accountResponse.json();
    
    // Fetch transactions (last 100)
    const txResponse = await fetch(`${baseUrl}/${address}/txns?page=1&per_page=100`, {
      headers: { 'Accept': 'application/json' }
    });
    
    const txData = txResponse.ok ? await txResponse.json() : { txns: [] };
    
    // Fetch tokens
    const tokensResponse = await fetch(`${baseUrl}/${address}/tokens?page=1&per_page=50`, {
      headers: { 'Accept': 'application/json' }
    });
    
    const tokensData = tokensResponse.ok ? await tokensResponse.json() : { tokens: [] };
    
    return {
      account: address,
      balance: accountData.amount || '0',
      transactions: txData.txns || [],
      contracts: [], // Would need separate API call
      tokens: tokensData.tokens || [],
      stats: {
        total_transactions: txData.txns?.length || 0,
        first_transaction: txData.txns?.length > 0 ? txData.txns[txData.txns.length - 1]?.block_timestamp : null,
        last_transaction: txData.txns?.length > 0 ? txData.txns[0]?.block_timestamp : null,
      }
    };
  } catch (error) {
    console.error('Error fetching wallet data:', error);
    return null;
  }
}

async function generateReputationAnalysis(walletData: WalletData): Promise<ReputationAnalysis> {
  try {
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    if (!anthropicKey) {
      // Fallback to basic analysis if Claude API not available
      return generateBasicAnalysis(walletData);
    }

    const prompt = `Analyze this NEAR wallet and generate a reputation score (0-100) and analysis:

Wallet: ${walletData.account}
Balance: ${walletData.balance} NEAR
Total Transactions: ${walletData.stats.total_transactions}
First Activity: ${walletData.stats.first_transaction}
Last Activity: ${walletData.stats.last_transaction}
Token Holdings: ${walletData.tokens.length} different tokens

Recent Transactions:
${walletData.transactions.slice(0, 10).map(tx => 
  `- ${tx.action_kind || 'Unknown'}: ${tx.hash} (${tx.block_timestamp})`
).join('\n')}

Please analyze and respond with a JSON object containing:
- score (0-100): Overall reputation score
- riskLevel (LOW/MEDIUM/HIGH): Risk assessment
- activitySummary (string): Brief activity overview
- keyInsights (string[]): 3-4 key insights about this wallet
- details: { ageScore, activityScore, diversityScore, balanceScore } (each 0-100)

Consider factors like account age, transaction frequency, balance consistency, interaction diversity, and any suspicious patterns.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error('Claude API failed');
    }

    const result = await response.json();
    const analysis = JSON.parse(result.content[0].text);
    
    return analysis;
  } catch (error) {
    console.error('Error generating analysis:', error);
    return generateBasicAnalysis(walletData);
  }
}

function generateBasicAnalysis(walletData: WalletData): ReputationAnalysis {
  const balance = parseFloat(walletData.balance) || 0;
  const txCount = walletData.stats.total_transactions || 0;
  const tokenCount = walletData.tokens.length || 0;
  
  // Basic scoring algorithm
  const balanceScore = Math.min(100, Math.log10(balance + 1) * 20);
  const activityScore = Math.min(100, Math.log10(txCount + 1) * 25);
  const diversityScore = Math.min(100, tokenCount * 10);
  
  const ageInDays = walletData.stats.first_transaction 
    ? (Date.now() - new Date(walletData.stats.first_transaction).getTime()) / (1000 * 60 * 60 * 24)
    : 0;
  const ageScore = Math.min(100, Math.log10(ageInDays + 1) * 30);
  
  const score = Math.round((balanceScore + activityScore + diversityScore + ageScore) / 4);
  
  const riskLevel = score >= 70 ? 'LOW' : score >= 40 ? 'MEDIUM' : 'HIGH';
  
  const activitySummary = `${txCount} transactions, ${balance.toFixed(2)} NEAR balance, ${tokenCount} tokens`;
  
  const keyInsights = [
    `Account age: ${Math.round(ageInDays)} days`,
    `Transaction activity: ${txCount > 100 ? 'High' : txCount > 20 ? 'Medium' : 'Low'}`,
    `Token diversity: ${tokenCount} different tokens`,
    `Balance level: ${balance > 100 ? 'High' : balance > 10 ? 'Medium' : 'Low'}`
  ];
  
  return {
    score,
    riskLevel,
    activitySummary,
    keyInsights,
    details: {
      ageScore: Math.round(ageScore),
      activityScore: Math.round(activityScore),
      diversityScore: Math.round(diversityScore),
      balanceScore: Math.round(balanceScore)
    }
  };
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!rateLimit(`void-lens:${ip}`, 10, 60_000).allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const { address } = await request.json();
    
    if (!address || typeof address !== 'string') {
      return NextResponse.json({ error: 'Invalid wallet address' }, { status: 400 });
    }

    const walletData = await fetchWalletData(address);
    if (!walletData) {
      return NextResponse.json({ error: 'Failed to fetch wallet data' }, { status: 404 });
    }

    const analysis = await generateReputationAnalysis(walletData);
    
    return NextResponse.json({
      address,
      walletData,
      analysis,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Void Lens API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}