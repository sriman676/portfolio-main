import { NextResponse } from 'next/server';
import { config as portfolioConfig } from '../../../../portfolioConfig';

// ── In-memory rate limiter (5 req / 60s per IP) ──────────────────
const rateLimitMap = new Map(); // ip → { count, resetAt }
const RATE_LIMIT = 5;
const RATE_WINDOW = 60_000; // 1 minute

function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    // Clean up old entries periodically
    if (rateLimitMap.size > 500) {
      for (const [k, v] of rateLimitMap) {
        if (now > v.resetAt) rateLimitMap.delete(k);
      }
    }
    return false;
  }
  if (entry.count >= RATE_LIMIT) return true;
  entry.count++;
  return false;
}

// ── Static fallback (shown when GitHub API is unavailable) ────────
const STATIC_FALLBACK = [
  {
    id: 1, name: 'soc-automation',
    description: 'SIEM alert triage automation — Python scripts for Splunk & Wazuh.',
    html_url: `https://github.com/${portfolioConfig.githubUsername}`,
    language: 'Python', stargazers_count: 0, updated_at: new Date().toISOString(),
  },
  {
    id: 2, name: 'portfolio-os',
    description: 'Quantum-themed immersive 3D cybersecurity portfolio.',
    html_url: `https://github.com/${portfolioConfig.githubUsername}`,
    language: 'JavaScript', stargazers_count: 0, updated_at: new Date().toISOString(),
  },
];

// ── Security headers ──────────────────────────────────────────────
const SECURITY_HEADERS = {
  'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
};

// ── Route handler ─────────────────────────────────────────────────
export async function GET(request) {
  // Rate limiting
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    '0.0.0.0';

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Try again in 60 seconds.' },
      { status: 429, headers: { 'Retry-After': '60', ...SECURITY_HEADERS } }
    );
  }

  try {
    // GitHub public API — no token needed for public repos (60 req/hr unauthenticated)
    const username = portfolioConfig.githubUsername;
    const ghRes = await fetch(
      `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=20&type=public`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'SrimanRutvik-Portfolio/1.0',
          // Add GITHUB_TOKEN env var for higher rate limits (optional)
          ...(process.env.GITHUB_TOKEN
            ? { 'Authorization': `Bearer ${process.env.GITHUB_TOKEN}` }
            : {}),
        },
        next: { revalidate: 3600 }, // ISR: revalidate every hour
      }
    );

    if (!ghRes.ok) {
      // Return fallback data gracefully
      return NextResponse.json(
        { repos: STATIC_FALLBACK, source: 'fallback' },
        { status: 200, headers: SECURITY_HEADERS }
      );
    }

    const raw = await ghRes.json();

    // Sanitize + map only needed fields (no token/private data leaks)
    const repos = Array.isArray(raw)
      ? raw
          .filter(r => !r.fork && !r.private) // Only original public repos
          .slice(0, 12)
          .map(r => ({
            id: r.id,
            name: r.name,
            description: r.description,
            html_url: r.html_url,           // repo URL for click-through
            language: r.language,
            stargazers_count: r.stargazers_count,
            updated_at: r.updated_at,
            topics: (r.topics || []).slice(0, 4),
          }))
      : STATIC_FALLBACK;

    return NextResponse.json(
      { repos, source: 'live' },
      { status: 200, headers: SECURITY_HEADERS }
    );
  } catch {
    return NextResponse.json(
      { repos: STATIC_FALLBACK, source: 'fallback' },
      { status: 200, headers: SECURITY_HEADERS }
    );
  }
}
