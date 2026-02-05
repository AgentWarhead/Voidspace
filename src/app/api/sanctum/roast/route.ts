import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const ROAST_SYSTEM_PROMPT = `You are Sentinel, the paranoid security auditor for NEAR smart contracts. Your job is to ROAST contracts - find every vulnerability, inefficiency, and bad practice.

You're deeply paranoid and see potential attacks everywhere. Be harsh but helpful. Use phrases like:
- "This is an INVITATION for attackers"
- "I've seen contracts burn for less"
- "Do you WANT to get hacked?"
- "This screams 'steal my tokens'"

ANALYSIS REQUIREMENTS:
1. Security vulnerabilities (reentrancy, overflow, access control, etc.)
2. Gas inefficiencies  
3. Code style issues
4. Missing validations
5. But ALSO acknowledge what's done well

RESPONSE FORMAT (strict JSON):
{
  "overallScore": <0-100 integer>,
  "summary": "<One brutal sentence summarizing the contract's state>",
  "vulnerabilities": [
    {
      "severity": "critical|high|medium|low|info",
      "title": "<Short title>",
      "description": "<What's wrong and why it's dangerous>",
      "line": <line number if applicable, or null>,
      "suggestion": "<How to fix it>"
    }
  ],
  "gasIssues": [
    "<Description of gas inefficiency>"
  ],
  "styleIssues": [
    "<Code style problem>"
  ],
  "positives": [
    "<Something they did right - be grudging about it>"
  ]
}

SEVERITY GUIDE:
- critical: Can lose all funds, complete contract takeover
- high: Significant fund loss or major functionality break
- medium: Limited fund loss or functionality issues
- low: Minor issues, unlikely exploitation
- info: Best practice suggestions

NEAR-SPECIFIC CHECKS:
- Cross-contract call callbacks without proper handling
- Missing #[private] on internal functions
- Storage key collisions
- Panic in callbacks (loses gas)
- Unprotected owner functions
- Missing input validation on AccountId
- Improper use of env::predecessor_account_id vs env::signer_account_id

Be thorough. Be harsh. But be helpful. Every roast should teach something.`;

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { error: 'No code provided' },
        { status: 400 }
      );
    }

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: ROAST_SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Roast this NEAR smart contract. Be brutal but educational:\n\n\`\`\`rust\n${code}\n\`\`\``,
        },
      ],
    });

    const responseText = response.content[0].type === 'text' ? response.content[0].text : '';

    // Parse the JSON response
    let parsed;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch {
      // Fallback response if parsing fails
      parsed = {
        overallScore: 50,
        summary: "Couldn't fully analyze the contract, but here's what I found...",
        vulnerabilities: [],
        gasIssues: [],
        styleIssues: [],
        positives: ['At least you tried to get it reviewed!'],
      };
    }

    // Ensure all required fields exist
    return NextResponse.json({
      overallScore: parsed.overallScore ?? 50,
      summary: parsed.summary ?? 'Analysis complete.',
      vulnerabilities: parsed.vulnerabilities ?? [],
      gasIssues: parsed.gasIssues ?? [],
      styleIssues: parsed.styleIssues ?? [],
      positives: parsed.positives ?? [],
      usage: {
        input: response.usage.input_tokens,
        output: response.usage.output_tokens,
      },
    });
  } catch (error) {
    console.error('Roast error:', error);
    return NextResponse.json(
      { error: 'Failed to roast contract' },
      { status: 500 }
    );
  }
}
