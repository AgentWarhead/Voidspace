import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/auth/rate-limit';
import { isValidNearAccountId } from '@/lib/auth/validate';
import { getAuthenticatedUser } from '@/lib/auth/verify-request';
import { checkAiBudget, logAiUsage } from '@/lib/auth/ai-budget';
import { fetchTokenByAddress } from '@/lib/dexscreener';

// Known NEAR contracts mapped to friendly names
const KNOWN_CONTRACTS: Record<string, { name: string; category: string }> = {
  'v2.ref-finance.near': { name: 'Ref Finance', category: 'DEX' },
  'aurora': { name: 'Aurora', category: 'EVM' },
  'wrap.near': { name: 'wNEAR', category: 'DeFi' },
  'linear-protocol.near': { name: 'LiNEAR', category: 'Liquid Staking' },
  'meta-pool.near': { name: 'Meta Pool', category: 'Liquid Staking' },
  'app.burrow.cash': { name: 'Burrow', category: 'Lending' },
  'v1.orderly-network.near': { name: 'Orderly', category: 'Orderbook' },
  'token.sweat': { name: 'Sweat Economy', category: 'Move-to-Earn' },
  'v2.staking-pool.near': { name: 'NEAR Staking', category: 'Staking' },
  'usn': { name: 'USN Stablecoin', category: 'Stablecoin' },
  'token.v2.ref-finance.near': { name: 'Ref Finance Token', category: 'DEX' },
  'priceoracle.near': { name: 'Price Oracle', category: 'Oracle' },
  'nearx.stader-labs.near': { name: 'Stader NearX', category: 'Liquid Staking' },
  'sweat_welcome.near': { name: 'Sweat Welcome', category: 'Move-to-Earn' },
  'core.near': { name: 'NEAR Core', category: 'Infrastructure' },
  'lockup.near': { name: 'NEAR Lockup', category: 'Lockup' },
};

interface WalletData {
  account: string;
  balance: string;
  transactions: Array<Record<string, unknown>>;
  contracts: Array<Record<string, unknown>>;
  tokens: Array<Record<string, unknown>>;
  stats: {
    total_transactions: number;
    first_transaction: string | null;
    last_transaction: string | null;
  };
  // Enriched data
  nftCount: number;
  accessKeys: {
    fullAccess: number;
    functionCall: number;
    keys: Array<Record<string, unknown>>;
  };
  topContracts: Array<{ address: string; name: string; category: string; interactions: number }>;
  stakedAmount: string;
  storageUsage: number;
  txPatterns: {
    avgTxPerDay: number;
    mostActiveDay: string;
    sendCount: number;
    receiveCount: number;
    recentActivity: 'active' | 'moderate' | 'dormant';
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
    securityScore: number;
    defiScore: number;
  };
  securityProfile: {
    fullAccessKeys: number;
    functionCallKeys: number;
    riskFlags: string[];
  };
  defiActivity: {
    topProtocols: Array<{ name: string; interactions: number; category: string }>;
    hasStaking: boolean;
    stakedAmount: string;
    nftCount: number;
  };
  activityPattern: {
    avgTxPerDay: number;
    mostActiveDay: string;
    sendReceiveRatio: number;
    recentActivity: 'active' | 'moderate' | 'dormant';
  };
  walletAge: {
    days: number;
    created: string;
    label: string;
  };
}

// Helper to convert yoctoNEAR to NEAR (divide by 10^24)
function yoctoToNear(yoctoAmount: string): string {
  const yocto = BigInt(yoctoAmount || '0');
  const near = Number(yocto) / 1e24;
  return near.toFixed(2);
}

// Helper to convert nanoseconds timestamp to ISO string
function nanoToISOString(nanoTimestamp: string | number | null): string | null {
  if (!nanoTimestamp) return null;
  const ms = Number(nanoTimestamp) / 1_000_000;
  if (isNaN(ms) || ms <= 0) return null;
  return new Date(ms).toISOString();
}

function getWalletAgeLabel(days: number, firstTx: string | null): string {
  if (!firstTx) return 'Unknown';
  const year = new Date(firstTx).getFullYear();
  if (days < 90) return 'New (<3mo)';
  if (year <= 2020) return `OG (${year})`;
  if (year <= 2022) return `Veteran (${year})`;
  return `Regular (${year}+)`;
}

function analyzeTxPatterns(
  transactions: Array<Record<string, unknown>>,
  address: string,
  firstTx: string | null
): WalletData['txPatterns'] {
  const txCount = transactions.length;
  
  // Calculate avg tx per day
  let avgTxPerDay = 0;
  if (firstTx) {
    const ageInDays = Math.max(1, (Date.now() - new Date(firstTx).getTime()) / (1000 * 60 * 60 * 24));
    avgTxPerDay = parseFloat((txCount / ageInDays).toFixed(2));
  }
  
  // Count sends vs receives
  let sendCount = 0;
  let receiveCount = 0;
  const dayCounts: Record<string, number> = {};
  
  for (const tx of transactions) {
    const signerId = tx?.signer_account_id as string | undefined;
    if (signerId === address) {
      sendCount++;
    } else {
      receiveCount++;
    }
    
    // Track day of week activity
    const timestamp = tx?.block_timestamp as string | number | undefined;
    if (timestamp) {
      const ms = Number(timestamp) / 1_000_000;
      if (!isNaN(ms) && ms > 0) {
        const dayName = new Date(ms).toLocaleDateString('en-US', { weekday: 'long' });
        dayCounts[dayName] = (dayCounts[dayName] || 0) + 1;
      }
    }
  }
  
  // Find most active day
  let mostActiveDay = 'Unknown';
  let maxDayCount = 0;
  for (const [day, count] of Object.entries(dayCounts)) {
    if (count > maxDayCount) {
      maxDayCount = count;
      mostActiveDay = day;
    }
  }
  
  // Determine recent activity level
  let recentActivity: 'active' | 'moderate' | 'dormant' = 'dormant';
  if (transactions.length > 0) {
    const lastTxTimestamp = transactions[0]?.block_timestamp as string | number | undefined;
    if (lastTxTimestamp) {
      const lastTxMs = Number(lastTxTimestamp) / 1_000_000;
      const daysSinceLastTx = (Date.now() - lastTxMs) / (1000 * 60 * 60 * 24);
      if (daysSinceLastTx < 7) recentActivity = 'active';
      else if (daysSinceLastTx < 30) recentActivity = 'moderate';
    }
  }
  
  return { avgTxPerDay, mostActiveDay, sendCount, receiveCount, recentActivity };
}

function extractTopContracts(
  transactions: Array<Record<string, unknown>>,
  address: string
): Array<{ address: string; name: string; category: string; interactions: number }> {
  const contractCounts: Record<string, number> = {};
  
  for (const tx of transactions) {
    const receiver = tx?.receiver_account_id as string | undefined;
    if (receiver && receiver !== address) {
      contractCounts[receiver] = (contractCounts[receiver] || 0) + 1;
    }
  }
  
  return Object.entries(contractCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([addr, count]) => {
      const known = KNOWN_CONTRACTS[addr];
      return {
        address: addr,
        name: known?.name || addr,
        category: known?.category || 'Unknown',
        interactions: count,
      };
    });
}

async function fetchWalletData(address: string): Promise<WalletData | null | 'rate-limited'> {
  try {
    const baseUrl = 'https://api.nearblocks.io/v1/account';
    
    // Fetch basic account info
    const accountResponse = await fetch(`${baseUrl}/${address}`, {
      headers: { 'Accept': 'application/json' }
    });
    
    if (accountResponse.status === 429) {
      return 'rate-limited';
    }
    
    if (!accountResponse.ok) {
      throw new Error(`Failed to fetch account: ${accountResponse.status}`);
    }
    
    const accountData = await accountResponse.json();
    const account = accountData.account?.[0] || accountData;
    
    // Fetch data in two batches to avoid NearBlocks rate limits
    const [txResponse, tokensResponse] = await Promise.all([
      // Transactions (last 100)
      fetch(`${baseUrl}/${address}/txns?page=1&per_page=100`, {
        headers: { 'Accept': 'application/json' }
      }).catch(() => null),
      // Tokens
      fetch(`${baseUrl}/${address}/tokens?page=1&per_page=50`, {
        headers: { 'Accept': 'application/json' }
      }).catch(() => null),
    ]);

    // Small delay to respect rate limits, then fetch remaining data
    await new Promise(r => setTimeout(r, 200));

    const [nftResponse, keysResponse] = await Promise.all([
      // NFTs
      fetch(`${baseUrl}/${address}/nft-tokens?page=1&per_page=50`, {
        headers: { 'Accept': 'application/json' }
      }).catch(() => null),
      // Access keys
      fetch(`${baseUrl}/${address}/keys`, {
        headers: { 'Accept': 'application/json' }
      }).catch(() => null),
    ]);
    
    const txData = txResponse?.ok ? await txResponse.json() : { txns: [] };
    const transactions = txData.txns || [];
    
    const tokensData = tokensResponse?.ok ? await tokensResponse.json() : { tokens: [] };
    
    const nftData = nftResponse?.ok ? await nftResponse.json() : { nft: [] };
    const nftCount = nftData.nft?.length || nftData.nfts?.length || 0;
    
    const keysData = keysResponse?.ok ? await keysResponse.json() : { keys: [] };
    const allKeys = keysData.keys || [];
    let fullAccessKeys = 0;
    let functionCallKeys = 0;
    for (const key of allKeys) {
      const permission = key?.access_key?.permission;
      if (permission === 'FullAccess' || typeof permission === 'string' && permission.includes('FullAccess')) {
        fullAccessKeys++;
      } else {
        functionCallKeys++;
      }
    }
    
    // Get first/last transaction timestamps
    const firstTxTimestamp = transactions.length > 0 
      ? transactions[transactions.length - 1]?.block_timestamp 
      : account.created?.block_timestamp;
    const lastTxTimestamp = transactions.length > 0 
      ? transactions[0]?.block_timestamp 
      : null;
    
    const firstTxISO = nanoToISOString(firstTxTimestamp);
    
    // Staking: locked field in account data
    const lockedAmount = account.locked || '0';
    const stakedAmount = yoctoToNear(lockedAmount);
    
    // Storage usage
    const storageUsage = parseInt(account.storage_usage || '0', 10) || 0;
    
    // Analyze tx patterns
    const txPatterns = analyzeTxPatterns(transactions, address, firstTxISO);
    
    // Extract top contracts
    const topContracts = extractTopContracts(transactions, address);
    
    return {
      account: address,
      balance: yoctoToNear(account.amount || '0'),
      transactions,
      contracts: [],
      tokens: tokensData.tokens || [],
      stats: {
        total_transactions: transactions.length || 0,
        first_transaction: firstTxISO,
        last_transaction: nanoToISOString(lastTxTimestamp),
      },
      nftCount,
      accessKeys: {
        fullAccess: fullAccessKeys,
        functionCall: functionCallKeys,
        keys: allKeys,
      },
      topContracts,
      stakedAmount,
      storageUsage,
      txPatterns,
    };
  } catch (error) {
    console.error('Error fetching wallet data:', error);
    return null;
  }
}

function generateBasicAnalysis(walletData: WalletData): ReputationAnalysis {
  const balance = parseFloat(walletData.balance) || 0;
  const txCount = walletData.stats.total_transactions || 0;
  const tokenCount = walletData.tokens?.length || 0;
  
  // Age scoring
  const ageInDays = walletData.stats.first_transaction 
    ? (Date.now() - new Date(walletData.stats.first_transaction).getTime()) / (1000 * 60 * 60 * 24)
    : 0;
  const ageScore = Math.min(100, Math.log10(ageInDays + 1) * 30);
  
  // Activity scoring
  const activityScore = Math.min(100, Math.log10(txCount + 1) * 25);
  
  // Diversity scoring — tokens + contracts interacted with
  const contractDiversity = walletData.topContracts?.length || 0;
  const diversityScore = Math.min(100, (tokenCount * 5) + (contractDiversity * 5));
  
  // Balance scoring
  const balanceScore = Math.min(100, Math.log10(balance + 1) * 20);
  
  // Security scoring — based on access keys
  const fullKeys = walletData.accessKeys?.fullAccess || 0;
  const fnKeys = walletData.accessKeys?.functionCall || 0;
  let securityScore = 70; // base
  if (fullKeys === 1) securityScore += 20; // single full-access key is ideal
  else if (fullKeys === 0) securityScore += 10; // contract account
  else if (fullKeys > 3) securityScore -= 20; // too many full-access keys is risky
  if (fnKeys > 0 && fnKeys <= 20) securityScore += 10; // healthy function-call key usage
  else if (fnKeys > 50) securityScore -= 10; // excessive
  securityScore = Math.max(0, Math.min(100, securityScore));
  
  // DeFi scoring — based on known protocol interactions
  const defiContracts = walletData.topContracts?.filter(c => {
    const known = KNOWN_CONTRACTS[c.address];
    return known && ['DEX', 'DeFi', 'Liquid Staking', 'Lending', 'Staking', 'Orderbook'].includes(known.category);
  }) || [];
  const hasStaking = parseFloat(walletData.stakedAmount || '0') > 0;
  const nftCount = walletData.nftCount || 0;
  let defiScore = 0;
  defiScore += Math.min(40, defiContracts.length * 15);
  if (hasStaking) defiScore += 25;
  if (nftCount > 0) defiScore += Math.min(20, nftCount * 2);
  if (tokenCount > 3) defiScore += 15;
  defiScore = Math.min(100, defiScore);
  
  // Overall score — weighted average of all 6 dimensions
  const score = Math.round(
    (ageScore * 0.15) + 
    (activityScore * 0.2) + 
    (diversityScore * 0.15) + 
    (balanceScore * 0.2) + 
    (securityScore * 0.15) + 
    (defiScore * 0.15)
  );
  
  const riskLevel = score >= 70 ? 'LOW' : score >= 40 ? 'MEDIUM' : 'HIGH';
  
  // Rich activity summary
  const stakeInfo = hasStaking ? `, ${walletData.stakedAmount} NEAR staked` : '';
  const nftInfo = nftCount > 0 ? `, ${nftCount} NFTs` : '';
  const activitySummary = `${txCount} transactions over ${Math.round(ageInDays)} days, ${balance.toFixed(2)} NEAR balance, ${tokenCount} tokens${stakeInfo}${nftInfo}`;
  
  // Security risk flags
  const riskFlags: string[] = [];
  const fullAccessKeys = walletData.accessKeys?.fullAccess || 0;
  if (fullAccessKeys > 3) riskFlags.push('Multiple full-access keys detected — potential security risk');
  if (fullAccessKeys === 0) riskFlags.push('No full-access keys — likely a contract account');
  if (walletData.txPatterns?.recentActivity === 'dormant') riskFlags.push('Account appears dormant — no recent activity');
  if (balance < 0.1 && txCount > 50) riskFlags.push('Low balance with high activity — may indicate fund transfers');
  if (tokenCount === 0 && txCount > 20) riskFlags.push('No token holdings despite activity — unusual pattern');
  
  // Rich key insights
  const keyInsights: string[] = [];
  
  // Age insight
  if (ageInDays > 1000) {
    keyInsights.push(`🏛️ OG wallet — active for ${Math.round(ageInDays / 365)} years on NEAR. This is a well-established account.`);
  } else if (ageInDays > 365) {
    keyInsights.push(`📅 Veteran account — ${Math.round(ageInDays / 365)}+ years old with established on-chain history.`);
  } else if (ageInDays > 90) {
    keyInsights.push(`📅 Account is ${Math.round(ageInDays)} days old — building transaction history.`);
  } else {
    keyInsights.push(`🆕 New account — only ${Math.round(ageInDays)} days old. Limited history for analysis.`);
  }
  
  // Activity insight
  const avgTxPerDay = walletData.txPatterns?.avgTxPerDay || 0;
  if (avgTxPerDay > 5) {
    keyInsights.push(`⚡ Power user — averaging ${avgTxPerDay.toFixed(1)} transactions per day. Highly active on-chain.`);
  } else if (avgTxPerDay > 1) {
    keyInsights.push(`📊 Active user — averaging ${avgTxPerDay.toFixed(1)} transactions per day.`);
  } else if (txCount > 0) {
    keyInsights.push(`📊 Light user — ${avgTxPerDay.toFixed(2)} transactions per day on average.`);
  }
  
  // DeFi insight
  if (defiContracts.length > 0) {
    const protocolNames = defiContracts.slice(0, 3).map(c => KNOWN_CONTRACTS[c.address]?.name || c.address).join(', ');
    keyInsights.push(`🔄 Active DeFi participant — interacted with ${protocolNames}${defiContracts.length > 3 ? ` and ${defiContracts.length - 3} more` : ''}.`);
  } else if (tokenCount > 3) {
    keyInsights.push(`🪙 Holds ${tokenCount} tokens but limited DeFi protocol interactions detected.`);
  }
  
  // Security insight
  if (securityScore >= 80) {
    keyInsights.push(`🔒 Strong security posture — ${fullAccessKeys} full-access key${fullAccessKeys !== 1 ? 's' : ''}, ${fnKeys} function-call keys.`);
  } else if (riskFlags.length > 0) {
    keyInsights.push(`⚠️ Security note: ${riskFlags[0]}`);
  }
  
  // Staking insight
  if (hasStaking) {
    keyInsights.push(`💎 Staking ${walletData.stakedAmount} NEAR — committed to network security.`);
  }
  
  // NFT insight
  if (nftCount > 10) {
    keyInsights.push(`🎨 NFT collector — holds ${nftCount} NFTs across various collections.`);
  } else if (nftCount > 0) {
    keyInsights.push(`🎨 Owns ${nftCount} NFT${nftCount > 1 ? 's' : ''} on NEAR.`);
  }
  
  // Balance insight
  if (balance > 1000) {
    keyInsights.push(`💰 Significant NEAR holdings — ${formatBalanceCompact(balance)} in wallet.`);
  }
  
  // Send/receive insight
  const { sendCount, receiveCount } = walletData.txPatterns || { sendCount: 0, receiveCount: 0 };
  if (sendCount > 0 && receiveCount > 0) {
    const ratio = sendCount / Math.max(1, receiveCount);
    if (ratio > 2) {
      keyInsights.push(`📤 Primarily an outbound wallet — sends ${ratio.toFixed(1)}x more than it receives.`);
    } else if (ratio < 0.5) {
      keyInsights.push(`📥 Primarily a receiving wallet — receives ${(1/ratio).toFixed(1)}x more than it sends.`);
    }
  }
  
  // Top protocol insight (enriched)
  if (walletData.topContracts?.length > 0) {
    const topContract = walletData.topContracts[0];
    const topName = KNOWN_CONTRACTS[topContract.address]?.name || topContract.address;
    keyInsights.push(`🏆 Most interacted: ${topName} (${topContract.interactions} transactions).`);
  }
  
  // DeFi activity details
  const topProtocols = walletData.topContracts
    ?.filter(c => KNOWN_CONTRACTS[c.address])
    .slice(0, 6)
    .map(c => ({
      name: KNOWN_CONTRACTS[c.address]?.name || c.name,
      interactions: c.interactions,
      category: KNOWN_CONTRACTS[c.address]?.category || c.category,
    })) || [];
  
  // Wallet age details
  const walletAge = {
    days: Math.round(ageInDays),
    created: walletData.stats.first_transaction || 'Unknown',
    label: getWalletAgeLabel(ageInDays, walletData.stats.first_transaction),
  };
  
  return {
    score,
    riskLevel,
    activitySummary,
    keyInsights: keyInsights.slice(0, 8), // cap at 8
    details: {
      ageScore: Math.round(ageScore),
      activityScore: Math.round(activityScore),
      diversityScore: Math.round(diversityScore),
      balanceScore: Math.round(balanceScore),
      securityScore: Math.round(securityScore),
      defiScore: Math.round(defiScore),
    },
    securityProfile: {
      fullAccessKeys: walletData.accessKeys?.fullAccess || 0,
      functionCallKeys: walletData.accessKeys?.functionCall || 0,
      riskFlags,
    },
    defiActivity: {
      topProtocols,
      hasStaking,
      stakedAmount: walletData.stakedAmount || '0',
      nftCount,
    },
    activityPattern: {
      avgTxPerDay: walletData.txPatterns?.avgTxPerDay || 0,
      mostActiveDay: walletData.txPatterns?.mostActiveDay || 'Unknown',
      sendReceiveRatio: sendCount / Math.max(1, receiveCount),
      recentActivity: walletData.txPatterns?.recentActivity || 'dormant',
    },
    walletAge,
  };
}

function formatBalanceCompact(balance: number): string {
  if (balance >= 1000000) return `${(balance / 1000000).toFixed(2)}M NEAR`;
  if (balance >= 1000) return `${(balance / 1000).toFixed(2)}K NEAR`;
  return `${balance.toFixed(2)} NEAR`;
}

async function generateReputationAnalysis(walletData: WalletData, userId?: string): Promise<ReputationAnalysis> {
  try {
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    if (!anthropicKey) {
      return generateBasicAnalysis(walletData);
    }

    if (userId) {
      const budget = await checkAiBudget(userId);
      if (!budget.allowed) {
        console.log(`AI budget exceeded for user ${userId}, using basic analysis`);
        return generateBasicAnalysis(walletData);
      }
    }

    // Get basic analysis first for structure
    const basicAnalysis = generateBasicAnalysis(walletData);
    
    const hasStaking = parseFloat(walletData.stakedAmount || '0') > 0;
    const topContractsSummary = walletData.topContracts?.slice(0, 8).map(c => 
      `${c.name} (${c.category}): ${c.interactions} txs`
    ).join('\n') || 'None detected';

    const prompt = `Analyze this NEAR Protocol wallet and generate a comprehensive reputation report. Return ONLY valid JSON.

Wallet: ${walletData.account}
Balance: ${walletData.balance} NEAR
Staked: ${walletData.stakedAmount} NEAR
Total Transactions: ${walletData.stats.total_transactions}
First Activity: ${walletData.stats.first_transaction || 'Unknown'}
Last Activity: ${walletData.stats.last_transaction || 'Unknown'}
Account Age: ${basicAnalysis.walletAge.days} days (${basicAnalysis.walletAge.label})
Token Holdings: ${walletData.tokens?.length || 0} different tokens
NFT Holdings: ${walletData.nftCount} NFTs
Storage Used: ${walletData.storageUsage} bytes

Access Keys:
- Full Access: ${walletData.accessKeys?.fullAccess || 0}
- Function Call: ${walletData.accessKeys?.functionCall || 0}

Top Contract Interactions:
${topContractsSummary}

Activity Patterns:
- Avg TX/day: ${walletData.txPatterns?.avgTxPerDay || 0}
- Most Active Day: ${walletData.txPatterns?.mostActiveDay || 'Unknown'}
- Sent: ${walletData.txPatterns?.sendCount || 0}, Received: ${walletData.txPatterns?.receiveCount || 0}
- Recent Activity: ${walletData.txPatterns?.recentActivity || 'unknown'}

Security Risk Flags: ${basicAnalysis.securityProfile.riskFlags.join('; ') || 'None'}

Respond with JSON containing:
{
  "score": 0-100,
  "riskLevel": "LOW"|"MEDIUM"|"HIGH",
  "activitySummary": "Rich 2-3 sentence summary",
  "keyInsights": ["insight1", "insight2", ...up to 8 insights with emoji prefixes],
  "details": { "ageScore": 0-100, "activityScore": 0-100, "diversityScore": 0-100, "balanceScore": 0-100, "securityScore": 0-100, "defiScore": 0-100 }
}

Be specific about NEAR ecosystem context. Reference actual protocols by name.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1500,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      throw new Error('Claude API failed');
    }

    const result = await response.json();
    const aiOutput = JSON.parse(result.content[0].text);
    
    if (userId && result.usage) {
      const totalTokens = result.usage.input_tokens + result.usage.output_tokens;
      await logAiUsage(userId, 'void_lens_ai', totalTokens);
    }
    
    // Merge AI insights with our computed structural data
    return {
      score: aiOutput.score || basicAnalysis.score,
      riskLevel: aiOutput.riskLevel || basicAnalysis.riskLevel,
      activitySummary: aiOutput.activitySummary || basicAnalysis.activitySummary,
      keyInsights: aiOutput.keyInsights || basicAnalysis.keyInsights,
      details: {
        ageScore: aiOutput.details?.ageScore || basicAnalysis.details.ageScore,
        activityScore: aiOutput.details?.activityScore || basicAnalysis.details.activityScore,
        diversityScore: aiOutput.details?.diversityScore || basicAnalysis.details.diversityScore,
        balanceScore: aiOutput.details?.balanceScore || basicAnalysis.details.balanceScore,
        securityScore: aiOutput.details?.securityScore || basicAnalysis.details.securityScore,
        defiScore: aiOutput.details?.defiScore || basicAnalysis.details.defiScore,
      },
      // These are always computed from real data, not AI
      securityProfile: basicAnalysis.securityProfile,
      defiActivity: basicAnalysis.defiActivity,
      activityPattern: basicAnalysis.activityPattern,
      walletAge: basicAnalysis.walletAge,
    };
  } catch (error) {
    console.error('Error generating analysis:', error);
    return generateBasicAnalysis(walletData);
  }
}

// --- Portfolio Enrichment ---

// Token category classification
const TOKEN_CATEGORIES: Record<string, string> = {
  'wrap.near': 'infrastructure',
  'aurora': 'infrastructure',
  'core.near': 'infrastructure',
  'token.sweat': 'other',
  'token.ref-finance.near': 'defi',
  'token.v2.ref-finance.near': 'defi',
  'v2.ref-finance.near': 'defi',
  'linear-protocol.near': 'defi',
  'meta-pool.near': 'defi',
  'app.burrow.cash': 'defi',
  'nearx.stader-labs.near': 'defi',
  'v1.orderly-network.near': 'defi',
  'usn': 'stablecoin',
  'usdt.tether-token.near': 'stablecoin',
  'dac17f958d2ee523a2206206994597c13d831ec7.factory.bridge.near': 'stablecoin',
  'a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.factory.bridge.near': 'stablecoin',
  '17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1': 'stablecoin',
  'token.0xshitzu.near': 'meme',
  'token.lonk.near': 'meme',
  'bobo.tkn.near': 'meme',
  'ftv2.nekotoken.near': 'meme',
  'blackdragon.tkn.near': 'meme',
};

function classifyToken(contractAddress: string, symbol: string): string {
  if (TOKEN_CATEGORIES[contractAddress]) return TOKEN_CATEGORIES[contractAddress];
  const lc = (symbol || '').toLowerCase();
  const contract = contractAddress.toLowerCase();
  if (contract.includes('meme-cooking') || contract.includes('.tkn.near')) return 'meme';
  if (['usdt', 'usdc', 'dai', 'usn', 'usd'].includes(lc)) return 'stablecoin';
  if (['ref', 'linear', 'burrow', 'meta', 'orderly', 'nearx'].some(k => lc.includes(k))) return 'defi';
  if (['near', 'aurora', 'wnear'].includes(lc)) return 'infrastructure';
  return 'other';
}

interface PortfolioHolding {
  symbol: string;
  name: string;
  contractAddress: string;
  balance: number;
  price: number;
  usdValue: number;
  priceChange24h: number;
  category: string;
  imageUrl?: string;
}

interface PortfolioData {
  totalValue: number;
  totalChange24h: number;
  topHolding: { symbol: string; usdValue: number } | null;
  holdings: PortfolioHolding[];
  diversification: {
    defi: number;
    stablecoin: number;
    meme: number;
    infrastructure: number;
    other: number;
  };
  diversificationLabel: string;
}

async function enrichPortfolio(address: string, walletData: WalletData): Promise<PortfolioData | null> {
  try {
    // Small delay to avoid NearBlocks rate limits (fetchWalletData already made 5 requests)
    await new Promise(r => setTimeout(r, 300));

    // Fetch token inventory with balances from NearBlocks
    const invResponse = await fetch(
      `https://api.nearblocks.io/v1/account/${address}/inventory`,
      { headers: { 'Accept': 'application/json' } }
    ).catch(() => null);

    if (!invResponse?.ok) return null;

    const invData = await invResponse.json();
    const fts: Array<{
      contract: string;
      amount: string;
      ft_meta?: { name?: string; symbol?: string; decimals?: number; icon?: string; price?: number | null };
    }> = invData?.inventory?.fts || [];

    if (fts.length === 0) return null;

    // Look up prices from DexScreener for each token (batch, max 15 to avoid rate limits)
    const lookupTokens = fts.slice(0, 30);
    const priceResults = await Promise.allSettled(
      lookupTokens.map(ft => fetchTokenByAddress(ft.contract))
    );

    const holdings: PortfolioHolding[] = [];

    // Also add native NEAR balance
    const nearBalance = parseFloat(walletData.balance) || 0;
    if (nearBalance > 0) {
      const nearDex = await fetchTokenByAddress('wrap.near').catch(() => null);
      if (nearDex) {
        holdings.push({
          symbol: 'NEAR',
          name: 'NEAR Protocol',
          contractAddress: 'native',
          balance: nearBalance,
          price: nearDex.price || 0,
          usdValue: nearBalance * (nearDex.price || 0),
          priceChange24h: nearDex.priceChange24h || 0,
          category: 'infrastructure',
        });
      }
    }

    for (let i = 0; i < lookupTokens.length; i++) {
      const ft = lookupTokens[i];
      const result = priceResults[i];
      const dexData = result?.status === 'fulfilled' ? result.value : null;

      const decimals = ft.ft_meta?.decimals || 18;
      const rawAmount = ft.amount || '0';
      let balance = 0;
      try {
        // Handle very large numbers by converting safely
        if (decimals <= 18) {
          balance = Number(BigInt(rawAmount)) / Math.pow(10, decimals);
        } else {
          // For very high decimals, divide step by step
          const divisor = BigInt(10) ** BigInt(decimals);
          balance = Number(BigInt(rawAmount) * BigInt(1e6) / divisor) / 1e6;
        }
      } catch {
        balance = parseFloat(rawAmount) / Math.pow(10, decimals);
      }

      if (balance <= 0 || !isFinite(balance)) continue;

      const symbol = ft.ft_meta?.symbol || ft.contract.split('.')[0] || 'UNKNOWN';
      const name = ft.ft_meta?.name || symbol;
      const price = dexData?.price || 0;
      const usdValue = balance * price;
      const category = classifyToken(ft.contract, symbol);

      holdings.push({
        symbol,
        name,
        contractAddress: ft.contract,
        balance,
        price,
        usdValue,
        priceChange24h: dexData?.priceChange24h || 0,
        category,
        imageUrl: dexData?.imageUrl || undefined,
      });
    }

    // Sort by USD value descending
    holdings.sort((a, b) => b.usdValue - a.usdValue);

    const totalValue = holdings.reduce((sum, h) => sum + h.usdValue, 0);

    // Calculate weighted 24h change
    let totalChange24h = 0;
    if (totalValue > 0) {
      totalChange24h = holdings.reduce((sum, h) => {
        const weight = h.usdValue / totalValue;
        return sum + (h.priceChange24h * weight);
      }, 0);
    }

    const topHolding = holdings.length > 0
      ? { symbol: holdings[0].symbol, usdValue: holdings[0].usdValue }
      : null;

    // Diversification analysis
    const diversification = { defi: 0, stablecoin: 0, meme: 0, infrastructure: 0, other: 0 };
    for (const h of holdings) {
      const cat = h.category as keyof typeof diversification;
      if (cat in diversification) {
        diversification[cat] += h.usdValue;
      } else {
        diversification.other += h.usdValue;
      }
    }

    // Convert to percentages
    if (totalValue > 0) {
      for (const key of Object.keys(diversification) as Array<keyof typeof diversification>) {
        diversification[key] = Math.round((diversification[key] / totalValue) * 100);
      }
    }

    // Diversification label
    const maxCategoryPct = Math.max(...Object.values(diversification));
    const activeCats = Object.values(diversification).filter(v => v > 5).length;
    let diversificationLabel = 'Balanced';
    if (maxCategoryPct >= 80) diversificationLabel = 'Highly Concentrated';
    else if (maxCategoryPct >= 60) diversificationLabel = 'Concentrated';
    else if (activeCats >= 4) diversificationLabel = 'Well Diversified';
    else if (activeCats >= 3) diversificationLabel = 'Moderately Diversified';

    return {
      totalValue,
      totalChange24h: Math.round(totalChange24h * 100) / 100,
      topHolding,
      holdings: holdings.slice(0, 20), // Cap at 20 for response size
      diversification,
      diversificationLabel,
    };
  } catch (error) {
    console.error('Portfolio enrichment error:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getAuthenticatedUser(request);
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const rateKey = user ? `void-lens:${user.userId}` : `void-lens:${ip}`;
    
    if (!rateLimit(rateKey, user ? 10 : 5, 60_000).allowed) {
      return NextResponse.json({ 
        error: 'Too many requests. Connect your wallet for higher limits.' 
      }, { status: 429 });
    }

    const { address } = await request.json();
    
    if (!address || typeof address !== 'string') {
      return NextResponse.json({ error: 'Invalid wallet address' }, { status: 400 });
    }

    if (!isValidNearAccountId(address)) {
      return NextResponse.json({ error: 'Invalid NEAR account ID format' }, { status: 400 });
    }

    const walletData = await fetchWalletData(address);
    if (walletData === 'rate-limited') {
      return NextResponse.json({ 
        error: "NEAR's data feeds are busy. Please wait a moment and try again." 
      }, { status: 429 });
    }
    if (!walletData) {
      return NextResponse.json({ 
        error: "We couldn't find that wallet on NEAR. Double-check the address." 
      }, { status: 404 });
    }

    // Run analysis and portfolio enrichment in parallel
    const [analysis, portfolio] = await Promise.all([
      generateReputationAnalysis(walletData, user?.userId),
      enrichPortfolio(address, walletData),
    ]);
    
    const responseData = {
      address,
      walletData,
      analysis,
      portfolio,
      timestamp: new Date().toISOString()
    };

    const headers: Record<string, string> = {};
    if (!user) {
      headers['Cache-Control'] = 'public, s-maxage=120, stale-while-revalidate=300';
    }
    
    return NextResponse.json(responseData, { headers });
    
  } catch (error) {
    console.error('Void Lens API error:', error);
    return NextResponse.json({ 
      error: "NEAR's data feeds are busy. Try again in a moment." 
    }, { status: 500 });
  }
}
