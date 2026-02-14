import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/auth/rate-limit';
import { getAuthenticatedUser } from '@/lib/auth/verify-request';
import { checkBalance, deductCredits } from '@/lib/credits';

// Visual generation via Gemini. Credit-gated to prevent abuse.
// Flat fee: $0.05 per generation (3x markup on ~$0.015 Gemini cost).
const VISUAL_CREDIT_COST = 0.05;

interface VisualRequest {
  prompt: string;
  type: 'architecture' | 'flow' | 'infographic' | 'social';
  projectContext?: string;
}

const ALLOWED_TYPES = ['architecture', 'flow', 'infographic', 'social'] as const;

export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const user = getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const rateKey = `visual:${user.userId}`;
    if (!rateLimit(rateKey, 3, 60_000).allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    // Credit gate — check before burning Gemini API cost
    const hasCredits = await checkBalance(user.userId, VISUAL_CREDIT_COST);
    if (!hasCredits) {
      return NextResponse.json(
        { error: 'Insufficient credits. Top up your Sanctum balance to generate visuals.' },
        { status: 402 }
      );
    }

    const { prompt, type, projectContext }: VisualRequest = await request.json();

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: 'Prompt must be a non-empty string' },
        { status: 400 }
      );
    }

    if (prompt.length > 1000) {
      return NextResponse.json(
        { error: 'Prompt too long (max 1000 characters)' },
        { status: 400 }
      );
    }

    if (!type || !ALLOWED_TYPES.includes(type)) {
      return NextResponse.json(
        { error: 'Type must be one of: architecture, flow, infographic, social' },
        { status: 400 }
      );
    }

    // Build enhanced prompt based on type
    // Each prompt is optimized for Gemini image generation with consistent Voidspace branding
    const BRAND = `STRICT VISUAL QUALITY STANDARDS:
- Premium, modern design — looks like it was made by a top-tier design agency
- Dark or rich background preferred (not plain white) — deep blacks, dark gradients, or sophisticated color palettes
- Clean sans-serif typography, bold headings, HIGH CONTRAST for readability — text must be crisp and legible at any size
- Subtle depth effects: glass morphism, soft glows, layered shadows, gradient accents
- SHARP, CRISP lines and edges — nothing blurry, fuzzy, or low-quality. Every pixel matters.
- All text in the image must be PERFECTLY READABLE — no overlapping, no low-contrast text, no tiny illegible labels
- Color palette: ADAPT to match the user's project, brand, or topic:
  * NEAR Protocol projects: Use NEAR green (#00EC97) as primary accent with dark backgrounds
  * Crypto/DeFi projects: Dark themes with vibrant accent colors matching the protocol's brand
  * General web3: Sophisticated dark gradients with electric blue, purple, or teal accents
  * If no brand specified: default to a premium dark theme with vibrant accent colors
- NO clip-art. NO cartoonish or amateur elements. NO stock-photo aesthetic. NO blurry edges.
- Output: high resolution, 16:9 landscape aspect ratio, production-ready quality
- This should look like something a Fortune 500 company would pay $10K for.
- PROFESSIONAL POLISH: Every element should feel intentional and refined.`;

    let enhancedPrompt = '';
    const ctx = projectContext ? `\nProject context: ${projectContext}` : '';
    
    switch (type) {
      case 'architecture':
        enhancedPrompt = `Generate a professional software architecture diagram.

${BRAND}

DIAGRAM REQUIREMENTS:
- Show system components as labeled glass-morphism cards/boxes with glowing accent borders
- EVERY component MUST have a clear, readable label in bold text — no unlabeled boxes
- Connect components with clean directional arrows with subtle glow effects
- Label ALL connections with brief protocol/method names (REST, RPC, WebSocket, gRPC, etc.)
- Group related services visually with subtle background zones (frontend, backend, data layer, blockchain, external APIs)
- Include small icons or symbols inside each component box to aid instant recognition
- Clear visual hierarchy: primary services larger, secondary smaller, external services distinct
- Arrange in a clean top-to-bottom or left-to-right flow — no overlapping, consistent spacing
- Add a subtle grid or dot pattern on the background for depth
- For blockchain/NEAR projects: clearly show on-chain vs off-chain boundary, smart contracts, RPC nodes, indexers
- For DeFi: show token flows, liquidity pools, oracle feeds as distinct visual elements
- Text must be CRISP and readable even at 50% zoom — use high-contrast colors for labels
- This should look like it belongs in a $10M startup pitch deck

WHAT TO DIAGRAM: ${prompt}${ctx}`;
        break;
        
      case 'flow':
        enhancedPrompt = `Generate a user flow diagram showing a step-by-step process.

${BRAND}

FLOW REQUIREMENTS:
- Each step is a rounded rectangle with accent-colored border and glass-morphism fill
- Number each step clearly (01, 02, 03...) in the top-left corner of each box
- Connect steps with smooth curved arrows with directional arrowheads
- Decision points use diamond shapes with a contrasting accent color
- Start node: filled accent circle. End node: filled accent circle with ring
- Include a brief label inside each step box (action verb + noun: "Connect Wallet", "Submit Form")
- Arrange left-to-right or top-to-bottom with consistent spacing
- Clean, scannable at a glance — no clutter

FLOW TO SHOW: ${prompt}${ctx}`;
        break;
        
      case 'infographic':
        enhancedPrompt = `Generate an educational infographic that explains a technical concept visually.

${BRAND}

INFOGRAPHIC REQUIREMENTS:
- Bold headline at the top in large text with an accent-colored keyword
- Divide content into 3-5 clear sections with visual hierarchy (top to bottom)
- Use icons, small illustrations, and data visualizations (charts, progress bars, comparisons)
- Key numbers/stats should be LARGE and accent-colored to draw the eye
- Include brief explanatory text (2-3 lines max per section)
- Use divider lines or subtle section backgrounds to separate topics
- Bottom section: key takeaway or call-to-action in a highlighted accent box
- Optimized for sharing — readable at both full size and thumbnail
- Professional enough for a conference presentation, engaging enough for Twitter

TOPIC TO EXPLAIN: ${prompt}${ctx}`;
        break;
        
      case 'social':
        enhancedPrompt = `Generate a social media announcement graphic optimized for Twitter/X.

${BRAND}

SOCIAL GRAPHIC REQUIREMENTS:
- Aspect ratio: 16:9 (1200x675px equivalent) — Twitter card format
- SCROLL-STOPPING impact: massive, bold headline text taking up 40-50% of the image
- Text must be LEGIBLE even as a small thumbnail — use thick, bold fonts with high contrast
- Gradient highlight or underline on the most important word(s) — draw the eye instantly
- Subtle abstract background elements: mesh gradients, geometric shapes, particle effects
- If announcing a feature: show a minimal mockup/icon representing it
- If announcing a launch: add urgency elements (date, "LIVE NOW", countdown feel)
- For crypto/NEAR projects: include subtle chain iconography, token symbols, or protocol visuals
- Include space for a small logo/brand mark in the corner
- NO stock photo feel. NO generic templates. This should look custom-designed.
- The image alone should make someone stop scrolling and want to learn more.
- Test mentally: would this stand out in a feed of 100 tweets? It MUST.

ANNOUNCEMENT: ${prompt}${ctx}`;
        break;
        
      default:
        enhancedPrompt = prompt;
    }

    // Call Nano Banana Pro (Gemini) for image generation
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': process.env.GEMINI_API_KEY || '',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: enhancedPrompt,
          }],
        }],
        generationConfig: {
          responseModalities: ['image', 'text'],
          responseMimeType: 'image/png',
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Gemini API error:', error);
      
      // Return placeholder for demo if API fails
      return NextResponse.json({
        success: true,
        isDemo: true,
        message: 'Visual generation is available with Gemini API key configured.',
        prompt: enhancedPrompt,
        demoNote: 'Configure GEMINI_API_KEY for actual image generation.',
      });
    }

    const data = await response.json();
    
    // Extract image from response
    const imagePart = data.candidates?.[0]?.content?.parts?.find(
      (part: { inlineData?: { mimeType: string; data: string } }) => part.inlineData
    );

    if (imagePart?.inlineData) {
      // Deduct credits AFTER successful generation (don't charge for failures)
      await deductCredits(user.userId, VISUAL_CREDIT_COST, 'Sanctum visual generation', {
        sessionId: type,
      });

      return NextResponse.json({
        success: true,
        image: {
          mimeType: imagePart.inlineData.mimeType,
          data: imagePart.inlineData.data, // Base64 encoded
        },
        prompt: enhancedPrompt,
      });
    }

    return NextResponse.json({
      success: false,
      error: 'No image generated',
      prompt: enhancedPrompt,
    });
  } catch (error) {
    console.error('Visual generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate visual' },
      { status: 500 }
    );
  }
}
