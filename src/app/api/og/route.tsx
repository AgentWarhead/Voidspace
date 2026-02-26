import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export const runtime = 'nodejs';

const TYPE_CONFIG = {
  project: { label: 'PROJECT', color: '#00EC97', bg: 'rgba(0,236,151,0.08)' },
  void: { label: 'ECOSYSTEM VOID', color: '#a78bfa', bg: 'rgba(167,139,250,0.08)' },
  category: { label: 'CATEGORY', color: '#38bdf8', bg: 'rgba(56,189,248,0.08)' },
  default: { label: 'VOIDSPACE', color: '#00EC97', bg: 'rgba(0,236,151,0.08)' },
} as const;

type OgType = keyof typeof TYPE_CONFIG;

function isValidType(t: string | null): t is OgType {
  return t !== null && t in TYPE_CONFIG;
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const title = searchParams.get('title')?.slice(0, 80) || 'Voidspace';
  const subtitle = searchParams.get('subtitle')?.slice(0, 120) || 'The Intelligence Layer for NEAR Protocol';
  const rawType = searchParams.get('type');
  const type: OgType = isValidType(rawType) ? rawType : 'default';
  const tag = searchParams.get('tag')?.slice(0, 30) || null;

  const config = TYPE_CONFIG[type];

  // Load fonts — these are in src/app/fonts/, resolve relative to cwd
  let geistData: ArrayBuffer | null = null;
  let geistMonoData: ArrayBuffer | null = null;
  try {
    const fontsDir = path.join(process.cwd(), 'src', 'app', 'fonts');
    [geistData, geistMonoData] = await Promise.all([
      readFile(path.join(fontsDir, 'GeistVF.woff')),
      readFile(path.join(fontsDir, 'GeistMonoVF.woff')),
    ]);
  } catch {
    // Font load failed — ImageResponse will use system font fallback
  }

  const fonts: ConstructorParameters<typeof ImageResponse>[1]['fonts'] = [];
  if (geistData) {
    fonts.push({ name: 'Geist', data: geistData, weight: 400, style: 'normal' });
    fonts.push({ name: 'Geist', data: geistData, weight: 700, style: 'normal' });
  }
  if (geistMonoData) {
    fonts.push({ name: 'GeistMono', data: geistMonoData, weight: 400, style: 'normal' });
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: 'flex',
          flexDirection: 'column',
          background: '#0a0a0a',
          position: 'relative',
          overflow: 'hidden',
          fontFamily: geistData ? 'Geist, sans-serif' : 'sans-serif',
        }}
      >
        {/* Grid pattern overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(0,236,151,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,236,151,0.04) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Radial glow */}
        <div
          style={{
            position: 'absolute',
            top: -200,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 900,
            height: 600,
            borderRadius: '50%',
            background: `radial-gradient(ellipse at center, ${config.color}18 0%, transparent 70%)`,
          }}
        />

        {/* Bottom vignette */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 200,
            background: 'linear-gradient(transparent, #0a0a0a)',
          }}
        />

        {/* Scan line accent */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background: `linear-gradient(90deg, transparent 0%, ${config.color} 50%, transparent 100%)`,
            opacity: 0.6,
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            padding: '60px 72px',
            position: 'relative',
            zIndex: 10,
            justifyContent: 'space-between',
          }}
        >
          {/* Top row: logo + type badge */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* Logo wordmark */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: `linear-gradient(135deg, ${config.color} 0%, ${config.color}88 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    background: '#0a0a0a',
                    opacity: 0.8,
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: '#ffffff',
                  letterSpacing: '-0.02em',
                  fontFamily: geistData ? 'Geist, sans-serif' : 'sans-serif',
                }}
              >
                VOIDSPACE
              </span>
            </div>

            {/* Type badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 14px',
                borderRadius: 6,
                background: config.bg,
                border: `1px solid ${config.color}33`,
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: config.color,
                }}
              />
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: config.color,
                  letterSpacing: '0.1em',
                  fontFamily: geistMonoData ? 'GeistMono, monospace' : 'monospace',
                }}
              >
                {config.label}
              </span>
            </div>
          </div>

          {/* Center: title + subtitle */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 900 }}>
            {tag && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 4,
                }}
              >
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: config.color,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    fontFamily: geistMonoData ? 'GeistMono, monospace' : 'monospace',
                  }}
                >
                  {tag}
                </span>
              </div>
            )}

            <h1
              style={{
                fontSize: title.length > 50 ? 44 : title.length > 35 ? 52 : 60,
                fontWeight: 700,
                color: '#ffffff',
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
                margin: 0,
                fontFamily: geistData ? 'Geist, sans-serif' : 'sans-serif',
              }}
            >
              {title}
            </h1>

            <p
              style={{
                fontSize: 20,
                color: 'rgba(255,255,255,0.55)',
                lineHeight: 1.5,
                margin: 0,
                fontWeight: 400,
                fontFamily: geistData ? 'Geist, sans-serif' : 'sans-serif',
              }}
            >
              {subtitle}
            </p>
          </div>

          {/* Bottom row: tagline + domain */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              {/* NEAR label */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '4px 10px',
                  borderRadius: 4,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    color: 'rgba(255,255,255,0.4)',
                    letterSpacing: '0.08em',
                    fontFamily: geistMonoData ? 'GeistMono, monospace' : 'monospace',
                  }}
                >
                  NEAR PROTOCOL
                </span>
              </div>

              <span
                style={{
                  fontSize: 13,
                  color: 'rgba(255,255,255,0.25)',
                  fontFamily: geistMonoData ? 'GeistMono, monospace' : 'monospace',
                }}
              >
                See Everything. Build Anything.
              </span>
            </div>

            <span
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: config.color,
                letterSpacing: '-0.01em',
                fontFamily: geistData ? 'Geist, sans-serif' : 'sans-serif',
              }}
            >
              voidspace.io
            </span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: fonts.length > 0 ? fonts : undefined,
    }
  );
}
