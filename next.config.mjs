/** @type {import('next').NextConfig} */
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: __dirname,
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
  images: {
    unoptimized: true,
  },

  // Ensure webpack handles raw glsl/shaders if we add them later
  webpack: (config) => {
    return config;
  },

  // Next.js 16 requires explicit turbopack settings if webpack is used
  turbopack: {},

  // ── Enterprise Security Headers (Vercel Edge) ─────────────
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Strict Transport Security: Force HTTPS for 1 year
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          // Prevent clickjacking / embedding in iframes
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          // Prevent MIME type sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // Referrer policy - minimal data leakage
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // Permissions Policy - disable camera/microphone/geolocation
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          // DNS prefetch — off to prevent information leakage
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'off',
          },
          // Content Security Policy
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              // Scripts: Allow self + inline + eval (Required for Next.js Fast Refresh & some 3D libraries)
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              // Styles: Allow self + inline (needed for CSS-in-JS)
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              // Fonts: Allow Google Fonts
              "font-src 'self' https://fonts.gstatic.com",
              // Images: Allow self + data URIs + common CDNs for profile/OG
              "img-src 'self' data: blob: https://github.com https://avatars.githubusercontent.com",
              // WebGL workers and canvas
              "worker-src 'self' blob:",
              // Connect: Restrict to self + GitHub API + essential external points
              "connect-src 'self' https://api.github.com https://app.letsdefend.io",
              // Media: Allow self + music CDNs
              "media-src 'self' https://cdn.pixabay.com",
              // Frame: Deny all iframes embedding this site
              "frame-ancestors 'none'",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;

