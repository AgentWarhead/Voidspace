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
    const BRAND = `STRICT VISUAL STYLE:
- Background: deep black (#0A0A0F) to dark charcoal (#12121A) gradient
- Primary accent: vivid teal/cyan (#00EC97) for highlights, borders, glows, and key elements
- Secondary accents: electric purple (#8B5CF6) sparingly for depth, white (#F0F0F0) for text
- Typography: clean sans-serif, bold headings, high contrast against dark background
- Aesthetic: premium Web3/fintech — glass morphism panels, subtle glow effects, sharp edges
- NO bright white backgrounds. NO clip-art. NO cartoonish elements.
- Output: high resolution, 16:9 landscape aspect ratio, production-ready quality`;

    let enhancedPrompt = '';
    const ctx = projectContext ? `\nProject context: ${projectContext}` : '';
    
    switch (type) {
      case 'architecture':
        enhancedPrompt = `Generate a professional software architecture diagram.

${BRAND}

DIAGRAM REQUIREMENTS:
- Show system components as labeled glass-morphism cards/boxes with teal (#00EC97) borders
- Connect components with clean directional arrows (white or teal, with subtle glow)
- Group related services visually (frontend, backend, blockchain layer, external APIs)
- Include small icons or symbols inside each component box to aid recognition
- Label all connections with brief protocol/method names (REST, RPC, WebSocket, etc.)
- Arrange in a clear top-to-bottom or left-to-right hierarchy — no overlapping
- Add a subtle grid or dot pattern on the dark background for depth
- This should look like it belongs in a $10M startup pitch deck

WHAT TO DIAGRAM: ${prompt}${ctx}`;
        break;
        
      case 'flow':
        enhancedPrompt = `Generate a user flow diagram showing a step-by-step process.

${BRAND}

FLOW REQUIREMENTS:
- Each step is a rounded rectangle with teal (#00EC97) border and glass-morphism fill
- Number each step clearly (01, 02, 03...) in the top-left corner of each box
- Connect steps with smooth curved arrows with directional arrowheads (glowing teal)
- Decision points use diamond shapes with purple (#8B5CF6) accent
- Start node: filled teal circle. End node: filled teal circle with ring
- Include a brief label inside each step box (action verb + noun: "Connect Wallet", "Select Token")
- Arrange left-to-right or top-to-bottom with consistent spacing
- Add a subtle "VOIDSPACE" watermark in bottom-right corner, very low opacity
- Clean, scannable at a glance — no clutter

FLOW TO SHOW: ${prompt}${ctx}`;
        break;
        
      case 'infographic':
        enhancedPrompt = `Generate an educational infographic that explains a technical concept visually.

${BRAND}

INFOGRAPHIC REQUIREMENTS:
- Bold headline at the top in large white text with teal (#00EC97) accent word
- Divide content into 3-5 clear sections with visual hierarchy (top to bottom)
- Use icons, small illustrations, and data visualizations (charts, progress bars, comparisons)
- Key numbers/stats should be LARGE and teal-colored to draw the eye
- Include brief explanatory text (2-3 lines max per section) in light gray
- Use divider lines or subtle section backgrounds to separate topics
- Bottom section: key takeaway or call-to-action in a highlighted teal box
- Optimized for sharing — readable at both full size and thumbnail
- Professional enough for a conference presentation, engaging enough for Twitter

TOPIC TO EXPLAIN: ${prompt}${ctx}`;
        break;
        
      case 'social':
        enhancedPrompt = `Generate a social media announcement graphic optimized for Twitter/X.

${BRAND}

SOCIAL GRAPHIC REQUIREMENTS:
- Aspect ratio: 16:9 (1200x675px equivalent) — Twitter card format
- Massive, bold headline text taking up 40-50% of the image — impossible to scroll past
- Teal (#00EC97) gradient highlight or underline on the most important word(s)
- Subtle abstract background elements: mesh gradients, geometric shapes, particle effects
- If announcing a feature: show a minimal mockup/icon representing it
- If announcing a launch: add urgency elements (date, "LIVE NOW", countdown feel)
- Include space for a small logo/brand mark in the corner
- NO stock photo feel. This should look like it was designed by a top-tier Web3 design agency.
- The image alone should make someone stop scrolling and want to learn more.

ANNOUNCEMENT: ${prompt}${ctx}`;
        break;
        
      default:
        enhancedPrompt = prompt;
    }

    // Call Nano Banana Pro (Gemini) for image generation
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent', {
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
