import { corsHeaders } from '../_shared/cors.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SYSTEM_PROMPT = `You are an opinionated, energetic startup co-founder who lives and breathes the NEAR Protocol ecosystem. You've built projects on NEAR, you know the ecosystem's strengths and gaps intimately, and you're excited to help builders find their next big opportunity.

Your job: Generate mission briefs that make builders say "I NEED to build this." Be specific, be data-driven, be actionable. Reference real projects, real numbers, real opportunities. Don't be generic — every brief should feel like insider intelligence.

NEAR Protocol — What Makes It Special:
- "The Blockchain for AI" — the execution layer for AI-native applications
- Shade Agents: Autonomous AI agents running in Trusted Execution Environments (TEEs) — private, verifiable, unstoppable
- NEAR Intents: Intent-based transactions that abstract away chains entirely — users just say what they want
- Chain Signatures: One NEAR account controls assets on ANY blockchain (Bitcoin, Ethereum, Solana, etc.)
- Performance: Sub-600ms finality, sharded architecture scaling to 1M+ TPS
- Developer Experience: JavaScript/TypeScript SDKs, human-readable accounts, cheap storage

NEAR Ecosystem Funding:
- NEAR Foundation Grants Program (grants.near.org)
- NEAR Horizon accelerator for startups
- Proximity Labs DeFi grants
- Ecosystem fund for strategic priorities (AI, Privacy, Intents, RWA, Data)

Output valid JSON only. No markdown code blocks or explanations.`;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { opportunityId, userId, customIdea } = await req.json();

    if (!opportunityId && !customIdea) {
      return new Response(
        JSON.stringify({ error: 'Either opportunityId or customIdea is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client (env vars auto-available in Edge Functions)
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // JSON structure shared by both prompts
    const briefJsonStructure = `{
  "projectNames": ["3 creative, memorable name suggestions that could be real product names"],
  "problemStatement": "2-3 punchy sentences defining the problem. Make the reader feel the pain.",
  "solutionOverview": "2-3 sentences describing the solution. Be specific about the approach, not generic.",
  "whyNow": "2-3 sentences on why this is the perfect moment to build this. Reference ecosystem data, market trends, or NEAR tech readiness.",
  "targetUsers": ["3-5 specific user personas with their pain points"],
  "keyFeatures": [
    {"name": "Feature name", "description": "What it does, why users need it, and how it differentiates", "priority": "must-have"}
  ],
  "technicalRequirements": {
    "frontend": ["Specific frontend technologies with reasoning"],
    "backend": ["Specific backend technologies with reasoning"],
    "blockchain": ["NEAR-specific requirements and contracts needed"]
  },
  "nearTechStack": {
    "useShadeAgents": true,
    "useIntents": false,
    "useChainSignatures": false,
    "explanation": "Concrete explanation of which NEAR features to use and exactly how they fit this project"
  },
  "competitiveLandscape": "Analysis of existing projects in this space. Name competitors, their strengths, their weaknesses, and exactly where the opportunity lies.",
  "monetizationIdeas": ["3-5 specific revenue models with estimated potential where possible"],
  "nextSteps": ["5 concrete actions to take in week 1 to start building this project"],
  "fundingOpportunities": ["2-4 specific funding sources, grants, or accelerators relevant to this project category"],
  "buildComplexity": {
    "difficulty": "beginner",
    "estimatedTimeline": "Realistic timeline (e.g., '4-6 weeks for MVP')",
    "teamSize": "Recommended team (e.g., '1-2 developers')"
  },
  "resources": [
    {"title": "Resource name", "url": "https://docs.near.org/relevant-page", "type": "docs"}
  ]
}`;

    let userPrompt: string;

    if (opportunityId) {
      // === EXISTING OPPORTUNITY-BASED FLOW ===

      // Check for cached brief first
      const { data: existingBrief } = await supabase
        .from('project_briefs')
        .select('*')
        .eq('opportunity_id', opportunityId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (existingBrief) {
        return new Response(JSON.stringify(existingBrief), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Fetch opportunity with category
      const { data: opportunity, error: oppError } = await supabase
        .from('opportunities')
        .select('*, category:categories(*)')
        .eq('id', opportunityId)
        .single();

      if (oppError || !opportunity) {
        return new Response(
          JSON.stringify({ error: 'Opportunity not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Fetch rich context: active projects, top projects, chain stats, category aggregates
      const [
        { count },
        { data: topProjects },
        { data: chainStats },
        { data: categoryAgg },
      ] = await Promise.all([
        supabase
          .from('projects')
          .select('*', { count: 'exact', head: true })
          .eq('category_id', opportunity.category_id)
          .eq('is_active', true),
        supabase
          .from('projects')
          .select('name, description, tvl_usd, github_stars, github_forks, github_language, raw_data, is_active')
          .eq('category_id', opportunity.category_id)
          .order('tvl_usd', { ascending: false })
          .limit(5),
        supabase
          .from('chain_stats')
          .select('total_transactions, total_accounts, nodes_online, avg_block_time')
          .order('recorded_at', { ascending: false })
          .limit(1)
          .single(),
        supabase
          .from('projects')
          .select('tvl_usd, github_stars, github_forks')
          .eq('category_id', opportunity.category_id),
      ]);

      // Compute category aggregates
      const catTVL = (categoryAgg || []).reduce((s: number, p: Record<string, unknown>) => s + (Number(p.tvl_usd) || 0), 0);
      const catStars = (categoryAgg || []).reduce((s: number, p: Record<string, unknown>) => s + (Number(p.github_stars) || 0), 0);
      const catForks = (categoryAgg || []).reduce((s: number, p: Record<string, unknown>) => s + (Number(p.github_forks) || 0), 0);

      // Format top projects for context
      const projectContext = (topProjects || []).map((p: Record<string, unknown>) => {
        const fastnear = (p.raw_data as Record<string, unknown>)?.fastnear as Record<string, unknown> | undefined;
        return `  - ${p.name}: TVL $${Number(p.tvl_usd || 0).toLocaleString()}, ${p.github_stars || 0} stars, ${p.github_forks || 0} forks, lang: ${p.github_language || 'N/A'}, NEAR balance: ${fastnear?.balance_near || 'N/A'}, active: ${p.is_active}${p.description ? `, "${p.description}"` : ''}`;
      }).join('\n');

      // Format chain stats context
      const chainContext = chainStats
        ? `NEAR Chain Health: ${Number(chainStats.total_transactions).toLocaleString()} total transactions, ${Number(chainStats.total_accounts).toLocaleString()} total accounts, ${chainStats.nodes_online} nodes online, ${Number(chainStats.avg_block_time).toFixed(2)}s avg block time`
        : '';

      userPrompt = `Generate a mission brief for this NEAR ecosystem void. Make it compelling, specific, and grounded in the real data below.

Category: ${opportunity.category?.name}
Title: ${opportunity.title}
Description: ${opportunity.description}
Gap Score: ${opportunity.gap_score}/100 (higher = bigger opportunity)
Demand Score: ${opportunity.demand_score || 'N/A'}
Competition Level: ${opportunity.competition_level}
Current Active Projects: ${count || 0}

=== ECOSYSTEM CONTEXT ===
Category Aggregates: $${catTVL.toLocaleString()} TVL, ${catStars} GitHub stars, ${catForks} forks across ${(categoryAgg || []).length} projects
${chainContext}

Top Projects in Category:
${projectContext || '  (none)'}
=========================

Use the ecosystem context above to make your brief hyper-specific. Reference actual competitor projects by name, cite real TVL figures, and explain why NOW is the moment to build this. Be opinionated about what would win in this space.

Return JSON matching this exact structure:
${briefJsonStructure}`;
    } else {
      // === CUSTOM IDEA FLOW ===

      // Fetch general chain stats for context
      const { data: chainStats } = await supabase
        .from('chain_stats')
        .select('total_transactions, total_accounts, nodes_online, avg_block_time')
        .order('recorded_at', { ascending: false })
        .limit(1)
        .single();

      const chainContext = chainStats
        ? `NEAR Chain Health: ${Number(chainStats.total_transactions).toLocaleString()} total transactions, ${Number(chainStats.total_accounts).toLocaleString()} total accounts, ${chainStats.nodes_online} nodes online, ${Number(chainStats.avg_block_time).toFixed(2)}s avg block time`
        : '';

      userPrompt = `Generate a mission brief for this custom NEAR Protocol project idea. Make it compelling, specific, and grounded in real ecosystem data.

User's Project Idea:
${customIdea}

=== ECOSYSTEM CONTEXT ===
${chainContext}
=========================

Analyze this idea and generate a comprehensive build plan. Be specific about how this could be built on NEAR Protocol. If the idea is vague, make smart assumptions and be opinionated.

Return JSON matching this exact structure:
${briefJsonStructure}`;
    }

    // Call Claude API
    const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY');
    if (!anthropicKey) {
      return new Response(
        JSON.stringify({ error: 'ANTHROPIC_API_KEY not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-5-20251101',
        max_tokens: 8000,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    });

    if (!claudeRes.ok) {
      const errText = await claudeRes.text();
      throw new Error(`Claude API error ${claudeRes.status}: ${errText}`);
    }

    const claudeData = await claudeRes.json();
    let rawText = claudeData.content[0].text.trim();
    // Strip markdown code block wrappers if present (e.g. ```json ... ```)
    if (rawText.startsWith('```')) {
      rawText = rawText.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '');
    }
    const briefContent = JSON.parse(rawText);

    // Save to database
    const briefInsert: Record<string, unknown> = {
      opportunity_id: opportunityId || null,
      user_id: userId || null,
      content: customIdea
        ? { ...briefContent, custom_idea: customIdea }
        : briefContent,
    };

    const { data: savedBrief } = await supabase
      .from('project_briefs')
      .insert(briefInsert)
      .select()
      .single();

    return new Response(JSON.stringify(savedBrief || { content: briefContent }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
