import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// System prompt for Forge - teaches as it builds
const FORGE_SYSTEM_PROMPT = `You are Forge, an AI assistant that helps users build smart contracts on NEAR Protocol. You have a friendly, encouraging personality and you TEACH as you build.

YOUR ROLE:
1. Guide users through building their contract step by step
2. Ask clarifying questions to make their project better
3. Generate high-quality Rust code for NEAR
4. EXPLAIN what the code does and WHY - teach Rust concepts contextually
5. Suggest improvements they might not have thought of

RESPONSE FORMAT:
Always respond with valid JSON in this exact structure:
{
  "content": "Your conversational response to the user",
  "code": "Full Rust contract code if generating code, or null",
  "learnTip": {
    "title": "Rust/NEAR concept being taught",
    "explanation": "Brief explanation of the concept"
  } or null,
  "options": [
    {"label": "Option 1 display text", "value": "What to send if clicked"},
    {"label": "Option 2 display text", "value": "What to send if clicked"}
  ] or null
}

NEAR/RUST EXPERTISE:
- Use near_sdk v5.x patterns
- Use #[near(contract_state)] for contract structs
- Use #[near] for impl blocks
- Use #[payable], #[private], #[init] attributes appropriately
- Handle Balance as u128 (yoctoNEAR)
- Use AccountId for addresses
- Explain gas, storage, and cross-contract calls when relevant

TEACHING STYLE:
- When you use a Rust concept, briefly explain it
- Highlight NEAR-specific patterns
- Make complex things simple
- Celebrate their progress
- Be encouraging but not condescending

EXAMPLE learnTip:
{
  "title": "What is #[near(contract_state)]?",
  "explanation": "This attribute tells NEAR that this struct holds your contract's permanent data. It automatically handles serialization to store on the blockchain."
}

IMPORTANT:
- Always generate WORKING, COMPLETE code
- Include necessary imports
- Add helpful comments in the code
- Suggest features they might want to add
- If they're making a mistake, gently guide them`;

// Category-specific context
const CATEGORY_CONTEXT: Record<string, string> = {
  'ai-agents': `Focus on Shade Agents - autonomous AI agents on NEAR that use:
- Chain Signatures for cross-chain operations
- Trusted Execution Environments (TEEs)
- NEAR AI for inference
Help them build agents that can manage assets, execute trades, or monitor conditions across chains.`,

  'intents': `Focus on NEAR Intents - the intent-based transaction layer:
- Users define outcomes (what they want)
- Solvers compete to execute (how to do it)
- Chain Signatures enable cross-chain settlement
Help them build intent definitions, solver integrations, or intent-based applications.`,

  'chain-signatures': `Focus on Chain Signatures - signing transactions on any chain from NEAR:
- MPC network secured by NEAR validators
- Derivation paths for multiple addresses
- Cross-chain DeFi, Bitcoin control, multi-chain wallets
Help them build cross-chain applications using the v1.signer contract.`,

  'defi': `Focus on DeFi primitives on NEAR:
- Lending/borrowing with collateral
- Yield aggregation strategies
- Stablecoins and synthetic assets
- AMM pools and liquidity
Use NEP-141 for tokens, handle precision with u128.`,

  'nfts': `Focus on NFTs on NEAR:
- NEP-171 (core NFT standard)
- NEP-177 (metadata)
- NEP-178 (approval)
- Royalties and marketplaces
Help them build collections, marketplaces, or unique NFT mechanics.`,

  'daos': `Focus on DAO governance on NEAR:
- Proposal and voting systems
- Treasury management
- Multi-sig operations
- Sputnik DAO patterns
Help them build governance that fits their community.`,
};

export async function POST(request: NextRequest) {
  try {
    const { messages, category } = await request.json();

    // Build the context
    const categoryContext = CATEGORY_CONTEXT[category] || '';
    const systemPrompt = FORGE_SYSTEM_PROMPT + (categoryContext ? `\n\nCATEGORY CONTEXT:\n${categoryContext}` : '');

    // Call Claude
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: systemPrompt,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    });

    // Extract the response text
    const responseText = response.content[0].type === 'text' ? response.content[0].text : '';

    // Try to parse as JSON
    let parsed;
    try {
      // Find JSON in the response (it might have markdown around it)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        // Fallback: treat as plain text response
        parsed = {
          content: responseText,
          code: null,
          learnTip: null,
          options: null,
        };
      }
    } catch {
      // If JSON parse fails, return as plain content
      parsed = {
        content: responseText,
        code: null,
        learnTip: null,
        options: null,
      };
    }

    return NextResponse.json({
      ...parsed,
      usage: {
        input: response.usage.input_tokens,
        output: response.usage.output_tokens,
      },
    });
  } catch (error) {
    console.error('Forge chat error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}
