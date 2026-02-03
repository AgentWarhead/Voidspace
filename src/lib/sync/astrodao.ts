import { SupabaseClient } from '@supabase/supabase-js';

const NEAR_RPC = 'https://rpc.mainnet.near.org';

/**
 * Call a view method on a NEAR contract via JSON-RPC.
 * Returns the decoded JSON result, or null if the contract/method doesn't exist.
 */
async function callViewMethod<T>(
  contractId: string,
  methodName: string,
  args: Record<string, unknown> = {}
): Promise<T | null> {
  const argsBase64 = Buffer.from(JSON.stringify(args)).toString('base64');

  const res = await fetch(NEAR_RPC, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 'voidspace',
      method: 'query',
      params: {
        request_type: 'call_function',
        finality: 'final',
        account_id: contractId,
        method_name: methodName,
        args_base64: argsBase64,
      },
    }),
  });

  if (!res.ok) return null;

  const json = await res.json();
  if (json.error || !json.result?.result) return null;

  // Result is a byte array — decode to string, then parse JSON
  const bytes = json.result.result as number[];
  const decoded = String.fromCharCode(...bytes);

  try {
    return JSON.parse(decoded) as T;
  } catch {
    return null;
  }
}

interface SputnikPolicy {
  roles: { name: string; kind: unknown; permissions: string[]; vote_policy: unknown }[];
  default_vote_policy: unknown;
  proposal_bond: string;
  bounty_bond: string;
}

/**
 * Derive a plausible Sputnik DAO contract ID from a project.
 * Most DAOs on NEAR follow the pattern: name.sputnik-dao.near
 */
function deriveDaoContractId(project: {
  slug: string;
  name: string;
  raw_data: Record<string, unknown> | null;
}): string | null {
  // Check raw_data for explicit DAO contract
  if (project.raw_data) {
    const raw = project.raw_data;
    if (typeof raw.daoContractId === 'string') return raw.daoContractId;
    if (typeof raw.contract === 'string' && raw.contract.includes('sputnik-dao.near')) {
      return raw.contract;
    }
  }

  // Well-known DAO slug → contract mappings
  const knownDaos: Record<string, string> = {
    'astrodao': 'astro.sputnik-dao.near',
    'near-digital-collective': 'ndc.sputnik-dao.near',
    'creatives-dao': 'creatives.sputnik-dao.near',
    'marketing-dao': 'marketing.sputnik-dao.near',
    'human-guild': 'humanguild.sputnik-dao.near',
    'near-hispano': 'near-hispano.sputnik-dao.near',
    'devgov': 'devgovgigs.sputnik-dao.near',
    'open-web-sandbox': 'open-web-sandbox.sputnik-dao.near',
    'onboarding-dao': 'onboarding-dao.sputnik-dao.near',
  };

  if (knownDaos[project.slug]) return knownDaos[project.slug];

  // Try slug.sputnik-dao.near as a guess
  return `${project.slug}.sputnik-dao.near`;
}

export async function syncAstroDAO(supabase: SupabaseClient) {
  let enriched = 0;
  let failed = 0;
  let skipped = 0;

  // Fetch projects in the DAOs & Governance category
  const { data: daoCategory } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', 'daos')
    .single();

  if (!daoCategory) {
    return { enriched: 0, failed: 0, skipped: 0, total: 0, error: 'DAO category not found' };
  }

  const { data: projects } = await supabase
    .from('projects')
    .select('id, slug, name, raw_data');

  if (!projects || projects.length === 0) {
    return { enriched: 0, failed: 0, skipped: 0, total: 0 };
  }

  // Filter to DAO-category projects + any project that might be a DAO
  const { data: daoProjects } = await supabase
    .from('projects')
    .select('id, slug, name, raw_data')
    .eq('category_id', daoCategory.id);

  const targetProjects = daoProjects || [];

  for (const project of targetProjects) {
    const contractId = deriveDaoContractId(project);
    if (!contractId) {
      skipped++;
      continue;
    }

    try {
      // Query the DAO policy (members, roles, bonds)
      const policy = await callViewMethod<SputnikPolicy>(contractId, 'get_policy');

      if (!policy) {
        // Contract doesn't exist or isn't a Sputnik DAO — skip silently
        skipped++;
        continue;
      }

      // Query the last proposal ID to get proposal count
      const lastProposalId = await callViewMethod<number>(contractId, 'get_last_proposal_id');

      // Count unique members across all roles
      const memberSet = new Set<string>();
      for (const role of policy.roles || []) {
        const kind = role.kind as { Group?: string[] } | string;
        if (typeof kind === 'object' && kind.Group) {
          for (const member of kind.Group) {
            memberSet.add(member);
          }
        }
      }

      const existingRaw = (project.raw_data || {}) as Record<string, unknown>;
      await supabase
        .from('projects')
        .update({
          raw_data: {
            ...existingRaw,
            astrodao: {
              contract_id: contractId,
              member_count: memberSet.size,
              role_count: policy.roles?.length || 0,
              proposal_count: typeof lastProposalId === 'number' ? lastProposalId : 0,
              proposal_bond: policy.proposal_bond || null,
              bounty_bond: policy.bounty_bond || null,
              roles: (policy.roles || []).map((r) => r.name),
              synced_at: new Date().toISOString(),
            },
          },
        })
        .eq('id', project.id);

      enriched++;

      // Rate limiting: 100ms between RPC calls
      await new Promise((resolve) => setTimeout(resolve, 100));
    } catch {
      failed++;
    }
  }

  return { enriched, failed, skipped, total: targetProjects.length };
}
