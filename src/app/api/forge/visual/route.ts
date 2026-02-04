import { NextRequest, NextResponse } from 'next/server';

// Nano Banana Pro integration for visual generation
// Uses Gemini 2.0 Flash for image generation

interface VisualRequest {
  prompt: string;
  type: 'architecture' | 'flow' | 'infographic' | 'social';
  projectContext?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, type, projectContext }: VisualRequest = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Missing prompt' },
        { status: 400 }
      );
    }

    // Build enhanced prompt based on type
    let enhancedPrompt = '';
    
    switch (type) {
      case 'architecture':
        enhancedPrompt = `Create a clean, professional architecture diagram for a blockchain project. 
Style: Dark theme, modern, tech startup aesthetic. Colors: Use teal/cyan (#00EC97) as accent color on dark background.
Show: ${prompt}
${projectContext ? `Context: ${projectContext}` : ''}
Make it clear, minimal, and suitable for a pitch deck.`;
        break;
        
      case 'flow':
        enhancedPrompt = `Create a user flow / process diagram for a blockchain application.
Style: Dark theme with neon accents, modern fintech aesthetic. Primary color: teal/cyan (#00EC97).
Show the flow: ${prompt}
${projectContext ? `Context: ${projectContext}` : ''}
Use arrows to show direction, keep it simple and readable.`;
        break;
        
      case 'infographic':
        enhancedPrompt = `Create an infographic explaining a blockchain concept.
Style: Dark theme, professional, suitable for social media and presentations. Accent: teal (#00EC97).
Explain: ${prompt}
${projectContext ? `Context: ${projectContext}` : ''}
Make it educational but visually engaging.`;
        break;
        
      case 'social':
        enhancedPrompt = `Create a social media announcement graphic for a blockchain project launch.
Style: Dark theme, bold, eye-catching. Use teal/cyan (#00EC97) as primary accent.
Message: ${prompt}
${projectContext ? `Project: ${projectContext}` : ''}
Make it suitable for Twitter/X, professional but exciting.`;
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
