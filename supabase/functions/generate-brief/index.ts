import { corsHeaders } from '../_shared/cors.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SYSTEM_PROMPT = `You are an expert startup advisor and blockchain developer specializing in the NEAR Protocol ecosystem. Generate comprehensive project briefs for builders looking to fill gaps in the ecosystem.

NEAR Protocol Key Features:
- "The Blockchain for AI" - execution layer for AI-native applications
- Shade Agents: Autonomous AI agents using Trusted Execution Environments (TEEs)
- NEAR Intents: Intent-based transactions that work across chains
- Chain Abstraction: One account that works on any blockchain via Chain Signatures
- Performance: Sub-600ms finality, potential for 1M+ TPS with sharding

When recommending technical approaches, always consider how NEAR's unique features can be leveraged.

Output valid JSON only. No markdown code blocks or explanations.`;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { opportunityId, userId } = await req.json();

    if (!opportunityId) {
      return new Response(
        JSON.stringify({ error: 'opportunityId is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client (env vars auto-available in Edge Functions)
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

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

    // Count active projects in same category
    const { count } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('category_id', opportunity.category_id)
      .eq('is_active', true);

    const userPrompt = `Generate a detailed project brief for this NEAR ecosystem gap:

Category: ${opportunity.category?.name}
Title: ${opportunity.title}
Description: ${opportunity.description}
Gap Score: ${opportunity.gap_score}/100 (higher = bigger opportunity)
Competition Level: ${opportunity.competition_level}
Current Active Projects: ${count || 0}

Return JSON matching this exact structure:
{
  "projectNames": ["3 creative, memorable name suggestions"],
  "problemStatement": "2-3 sentences clearly defining the problem this project solves",
  "solutionOverview": "2-3 sentences describing the solution approach",
  "targetUsers": ["3-5 specific user personas who need this"],
  "keyFeatures": [
    {"name": "Feature name", "description": "What it does and why it matters", "priority": "must-have"}
  ],
  "technicalRequirements": {
    "frontend": ["Recommended frontend technologies"],
    "backend": ["Recommended backend technologies"],
    "blockchain": ["NEAR-specific requirements"]
  },
  "nearTechStack": {
    "useShadeAgents": true,
    "useIntents": false,
    "useChainSignatures": false,
    "explanation": "Why these NEAR features are or aren't recommended"
  },
  "competitiveLandscape": "Brief analysis of existing solutions and how to differentiate",
  "monetizationIdeas": ["3-5 realistic revenue model suggestions"],
  "buildComplexity": {
    "difficulty": "beginner",
    "estimatedTimeline": "Realistic timeline (e.g., '4-6 weeks')",
    "teamSize": "Recommended team (e.g., '1-2 developers')"
  },
  "resources": [
    {"title": "Resource name", "url": "https://docs.near.org", "type": "docs"}
  ]
}`;

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
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
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
    const { data: savedBrief } = await supabase
      .from('project_briefs')
      .insert({
        opportunity_id: opportunityId,
        user_id: userId || null,
        content: briefContent,
      })
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
