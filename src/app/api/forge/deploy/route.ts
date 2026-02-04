import { NextRequest, NextResponse } from 'next/server';

// NOTE: Full deployment requires:
// 1. Rust/cargo installed on server
// 2. WASM compilation (cargo build --target wasm32-unknown-unknown)
// 3. near-api-js with funded deployer account
//
// For Nearcon demo, this provides a simulated deployment flow.
// Real deployment will be enabled post-demo with a proper backend.

interface DeployRequest {
  code: string;
  projectName: string;
  network: 'testnet' | 'mainnet';
}

export async function POST(request: NextRequest) {
  try {
    const { code, projectName, network }: DeployRequest = await request.json();

    if (!code || !projectName) {
      return NextResponse.json(
        { error: 'Missing code or project name' },
        { status: 400 }
      );
    }

    // Validate it looks like Rust/NEAR code
    if (!code.includes('near') && !code.includes('pub fn')) {
      return NextResponse.json(
        { error: 'Invalid contract code' },
        { status: 400 }
      );
    }

    // Generate a contract address
    const sanitizedName = projectName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .substring(0, 20);
    const timestamp = Date.now().toString(36);
    const contractId = `${sanitizedName}-${timestamp}.${network === 'mainnet' ? 'near' : 'testnet'}`;

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
