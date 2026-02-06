import { NextRequest, NextResponse } from 'next/server';
import { createRateLimiter } from '@/lib/auth/rate-limit';
import { randomBytes } from 'crypto';

// Suspicious User-Agent patterns
const SUSPICIOUS_USER_AGENTS = [
  '', // Empty user agent
  'curl',
  'wget',
  'python-requests',
  'python-urllib',
  'bot',
  'crawler',
  'spider',
  'scraper',
  'hack',
  'scanner',
  'nuclei',
  'sqlmap',
];

// Global rate limiter: 100 requests per minute per IP
const globalRateLimiter = createRateLimiter({
  limit: 100,
  windowMs: 60 * 1000, // 1 minute
  maxMapSize: 1000, // Track up to 1000 unique IPs
});

export function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;
  const userAgent = request.headers.get('user-agent') || '';
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  const method = request.method;

  // 0. Body Size Limit - Check before any other processing
  if (pathname.startsWith('/api/')) {
    const contentLength = request.headers.get('content-length');
    if (contentLength) {
      const bodySize = parseInt(contentLength, 10);
      const maxSize = pathname === '/api/sync' ? 1048576 : 102400; // 1MB for sync, 100KB for others
      
      if (bodySize > maxSize) {
        console.log(`🚫 SIZE: Request too large (${bodySize} bytes) for ${pathname} from ${ip}`);
        return new NextResponse('Request entity too large', { status: 413 });
      }
    }
  }

  // 1. CORS Protection - Only allow same-origin requests for API routes
  if (pathname.startsWith('/api/')) {
    const referer = request.headers.get('referer');
    const isValidOrigin = !referer || referer.startsWith(origin);
    
    // Allow OPTIONS for preflight, but check origin for actual requests
    if (method !== 'OPTIONS' && !isValidOrigin) {
      console.log(`🚫 CORS: Blocked cross-origin request from ${referer || 'unknown'} to ${pathname}`);
      return new NextResponse('Forbidden', { status: 403 });
    }
  }

  // 2. Block suspicious User-Agents
  const lowerUserAgent = userAgent.toLowerCase();
  const isSuspicious = SUSPICIOUS_USER_AGENTS.some(pattern => 
    pattern === '' ? userAgent === '' : lowerUserAgent.includes(pattern)
  );

  if (isSuspicious) {
    console.log(`🚫 UA: Blocked suspicious user agent "${userAgent}" from ${ip}`);
    return new NextResponse('Forbidden', { status: 403 });
  }

  // 3. Global rate limiting - 100 requests per minute per IP
  const rateLimitResult = globalRateLimiter.rateLimit(ip);
  if (!rateLimitResult.allowed) {
    console.log(`🚫 RATE: Global rate limit exceeded for ${ip} on ${pathname} (remaining: ${rateLimitResult.remaining})`);
    return new NextResponse('Too Many Requests', { status: 429 });
  }

  // 4. CSRF Protection and Request logging for API routes
  if (pathname.startsWith('/api/')) {
    const startTime = Date.now();
    
    // Log the request
    console.log(`📡 API: ${method} ${pathname} from ${ip} (${userAgent.slice(0, 50)}${userAgent.length > 50 ? '...' : ''})`);

    // Verify CSRF token for write operations (before processing)
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      // Skip CSRF for Bearer auth endpoints and health check
      if (pathname !== '/api/sync' && pathname !== '/api/health') {
        const csrfHeader = request.headers.get('x-csrf-token');
        const csrfCookie = request.cookies.get('vs_csrf')?.value;
        
        if (!csrfHeader || !csrfCookie || csrfHeader !== csrfCookie) {
          console.log(`🚫 CSRF: Token mismatch for ${pathname} from ${ip}`);
          return new NextResponse('CSRF token invalid', { status: 403 });
        }
      }
    }

    // Create response
    const response = NextResponse.next();
    
    // Generate and set CSRF token for read operations
    if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
      const existingToken = request.cookies.get('vs_csrf')?.value;
      if (!existingToken) {
        const csrfToken = randomBytes(32).toString('hex');
        response.cookies.set('vs_csrf', csrfToken, {
          httpOnly: false, // JS needs to read this
          sameSite: 'strict',
          secure: process.env.NODE_ENV === 'production',
          path: '/',
        });
      }
    }
    
    // Add timing header for debugging
    response.headers.set('X-Response-Time', `${Date.now() - startTime}ms`);
    
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};