import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/auth/rate-limit';

// NOTE: Full deployment requires:
// 1. Rust/cargo installed on server
// 2. WASM compilation (cargo build --target wasm32-unknown-unknown)
// 3. near-api-js with funded deployer account
//
// For Nearcon demo, this provides a simulated deployment flow.
// Real deployment will be enabled post-demo with a proper backend.

interface DeployRequest {
  code: string;
  projectName?: string;
  category?: string;
  network?: 'testnet' | 'mainnet';
}

// Category to contract prefix mapping
const CATEGORY_PREFIXES: Record<string, string> = {
  'ai-agents': 'shade-agent',
  'intents': 'intent',
  'chain-signatures': 'xchain',
  'privacy': 'private',
  'rwa': 'rwa-token',
  'defi': 'defi',
  'dex-trading': 'dex',
  'gaming': 'game',
  'nfts': 'nft',
  'daos': 'dao',
  'social': 'social',
  'dev-tools': 'devtool',
  'wallets': 'wallet',
  'data-analytics': 'data',
  'infrastructure': 'infra',
  'meme-tokens': 'meme',
  'staking-rewards': 'stake',
  'prediction-markets': 'predict',
  'launchpads': 'launch',
  'bridges': 'bridge',
  'custom': 'sanctum',
};

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!rateLimit(`deploy:${ip}`, 2, 60_000).allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const { code, projectName, category, network = 'testnet' }: DeployRequest = await request.json();

    if (!code || typeof code !== 'string' || code.trim().length === 0) {
      return NextResponse.json(
        { error: 'Code must be a non-empty string' },
        { status: 400 }
      );
    }

    // Validate network
    if (network !== 'testnet' && network !== 'mainnet') {
      return NextResponse.json(
        { error: 'Network must be "testnet" or "mainnet"' },
        { status: 400 }
      );
    }

    // Validate it looks like Rust/NEAR code
    if (!code.includes('near') && !code.includes('pub fn') && !code.includes('struct')) {
      return NextResponse.json(
        { error: 'Invalid contract code' },
        { status: 400 }
      );
    }

    // Generate a contract address based on category or project name
    const prefix = category ? (CATEGORY_PREFIXES[category] || 'sanctum') : 'sanctum';
    const sanitizedName = projectName 
      ? projectName.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 15)
      : prefix;
    const timestamp = Date.now().toString(36).slice(-6);
    const randomSuffix = Math.random().toString(36).slice(2, 6);
    const contractId = `${sanitizedName}-${timestamp}${randomSuffix}.${network === 'mainnet' ? 'near' : 'testnet'}`;

    // Simulate deployment delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // In production, this would:
    // 1. Save code to temp file
    // 2. Run cargo build --target wasm32-unknown-unknown --release
    // 3. Use near-api-js to deploy the .wasm file
    // 4. Return actual transaction hash

    // For demo, return simulated success
    const mockTxHash = `${Date.now().toString(16)}${Math.random().toString(16).slice(2, 10)}`;

    return NextResponse.json({
      success: true,
      contractId,
      network,
      transactionHash: mockTxHash,
      explorerUrl: `https://explorer.${network}.near.org/accounts/${contractId}`,
      message: `Contract deployed to ${network}!`,
      // Flag that this is a demo deployment
      isDemo: true,
      demoNote: 'This is a simulated deployment for demo purposes. Full testnet deployment coming soon!',
    });
  } catch (error) {
    console.error('Deploy error:', error);
    return NextResponse.json(
      { error: 'Deployment failed' },
      { status: 500 }
    );
  }
}

// GET endpoint to check deployment status
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const contractId = searchParams.get('contractId');

  if (!contractId) {
    return NextResponse.json(
      { error: 'Missing contractId' },
      { status: 400 }
    );
  }

  // In production, this would check actual contract status on NEAR
  return NextResponse.json({
    contractId,
    status: 'deployed',
    isDemo: true,
  });
}
