import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { syncEcosystem } from '@/lib/sync/ecosystem';
import { syncDeFiLlama } from '@/lib/sync/defillama';
import { generateOpportunities } from '@/lib/sync/opportunities';

export async function POST(request: Request) {
  try {
    // Simple auth check
    const authHeader = request.headers.get('authorization');
    const expectedKey = process.env.SYNC_API_KEY;
    if (expectedKey && authHeader !== `Bearer ${expectedKey}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createAdminClient();
    const results: Record<string, unknown> = {};

    // Log sync start
    const { data: syncLog } = await supabase
      .from('sync_logs')
      .insert({ source: 'ecosystem', status: 'started', records_processed: 0 })
      .select()
      .single();

    // Step 1: Sync ecosystem data
    results.ecosystem = await syncEcosystem(supabase);

    // Step 2: Sync DeFiLlama TVL data
    results.defillama = await syncDeFiLlama(supabase);

    // Step 3: Generate/update opportunities
    results.opportunities = await generateOpportunities(supabase);

    // Log sync completion
    if (syncLog) {
      await supabase
        .from('sync_logs')
        .update({
          status: 'completed',
          records_processed: (results.ecosystem as { processed?: number })?.processed || 0,
          completed_at: new Date().toISOString(),
        })
        .eq('id', syncLog.id);
    }

    return NextResponse.json({ success: true, results });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    // Log failure
    try {
      const supabase = createAdminClient();
      await supabase
        .from('sync_logs')
        .insert({
          source: 'ecosystem',
          status: 'failed',
          error_message: message,
        });
    } catch {
      // Ignore logging errors
    }

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'POST to this endpoint to trigger a data sync.',
    usage: 'curl -X POST http://localhost:3000/api/sync -H "Authorization: Bearer YOUR_SYNC_API_KEY"',
  });
}
