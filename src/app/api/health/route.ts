import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

// Rate limiting: 30 requests per minute per IP
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 30;
const RATE_WINDOW = 60 * 1000; // 1 minute in milliseconds

// Server startup time for uptime calculation  
const serverStartTime = Date.now();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const clientData = rateLimitMap.get(ip);

  if (!clientData || now > clientData.resetTime) {
    // First request or window expired
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }

  if (clientData.count >= RATE_LIMIT) {
    return false; // Rate limited
  }

  clientData.count++;
  return true;
}

function getClientIP(request: NextRequest): string {
  // Try to get real IP from various headers (reverse proxy aware)
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  // Fallback to connection remote address
  return request.ip || 'unknown';
}

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Apply rate limiting
    const clientIP = getClientIP(request);
    if (!checkRateLimit(clientIP)) {
      return NextResponse.json(
        { 
          status: 'error',
          error: 'Rate limit exceeded',
          limit: `${RATE_LIMIT} requests per minute`
        },
        { status: 429 }
      );
    }

    const timestamp = new Date().toISOString();
    const uptime = Math.floor((Date.now() - serverStartTime) / 1000); // seconds
    
    // Initialize check results
    const checks = {
      supabase: false,
      env: false
    };

    // Check environment variables
    const requiredEnvVars = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY', 
      'SUPABASE_SERVICE_ROLE_KEY'
    ];

    const missingEnvVars = requiredEnvVars.filter(
      envVar => !process.env[envVar]
    );

    checks.env = missingEnvVars.length === 0;

    // Check Supabase connectivity
    if (checks.env) {
      try {
        const supabase = createAdminClient();
        
        // Simple connectivity test - just check if we can query
        const { error } = await supabase
          .from('categories') // Assuming categories is a lightweight table
          .select('id')
          .limit(1);

        checks.supabase = !error;
      } catch (error) {
        console.error('Supabase health check failed:', error);
        checks.supabase = false;
      }
    }

    // Determine overall status
    const allChecksPass = Object.values(checks).every(check => check === true);
    const status = allChecksPass ? 'ok' : 'degraded';
    const responseCode = allChecksPass ? 200 : 503;

    const healthData = {
      status,
      timestamp,
      uptime,
      checks,
      ...(missingEnvVars.length > 0 && { missingEnvVars }),
      responseTime: Date.now() - startTime
    };

    return NextResponse.json(healthData, { 
      status: responseCode,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

  } catch (error) {
    console.error('Health check error:', error);
    
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        uptime: Math.floor((Date.now() - serverStartTime) / 1000),
        error: 'Internal server error',
        responseTime: Date.now() - startTime
      },
      { status: 500 }
    );
  }
}

// Clean up rate limit map periodically
setInterval(() => {
  const now = Date.now();
  const expiredIPs: string[] = [];
  
  rateLimitMap.forEach((data, ip) => {
    if (now > data.resetTime) {
      expiredIPs.push(ip);
    }
  });
  
  expiredIPs.forEach(ip => {
    rateLimitMap.delete(ip);
  });
}, RATE_WINDOW);