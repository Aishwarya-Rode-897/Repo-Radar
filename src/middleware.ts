import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple in-memory store for rate limiting
const rateLimit = new Map<string, { count: number; timestamp: number }>();

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Add security headers
  const headers = response.headers;
  headers.set('X-DNS-Prefetch-Control', 'on');
  headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  headers.set('X-Frame-Options', 'SAMEORIGIN');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('Referrer-Policy', 'origin-when-cross-origin');
  headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // Only apply rate limiting to API routes
  if (request.nextUrl.pathname.startsWith('/api')) {
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor?.split(',')[0] ?? request.headers.get('x-real-ip') ?? 'anonymous';
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute
    const maxRequests = 60; // 60 requests per minute

    const current = rateLimit.get(ip) ?? { count: 0, timestamp: now };

    // Reset if outside window
    if (now - current.timestamp > windowMs) {
      current.count = 0;
      current.timestamp = now;
    }

    current.count++;
    rateLimit.set(ip, current);

    // Rate limit exceeded
    if (current.count > maxRequests) {
      return new NextResponse(JSON.stringify({ error: 'Too many requests' }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': '60',
        },
      });
    }

    // Add rate limit headers
    headers.set('X-RateLimit-Limit', maxRequests.toString());
    headers.set('X-RateLimit-Remaining', (maxRequests - current.count).toString());
    headers.set('X-RateLimit-Reset', (current.timestamp + windowMs).toString());
  }

  return response;
} 