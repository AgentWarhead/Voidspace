/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@near-wallet-selector/core',
    '@near-wallet-selector/modal-ui',
    '@near-wallet-selector/my-near-wallet',
    '@near-wallet-selector/meteor-wallet',
    '@near-wallet-selector/here-wallet',
  ],

  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,

  // TypeScript: ignore build errors (lucide-react individual icon files lack .d.ts)
  typescript: {
    ignoreBuildErrors: true,
  },

  // ESLint: builder module code blocks trigger jsx-no-comment-textnodes false positives
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Redirect legacy tool routes to Observatory
  async redirects() {
    return [
      {
        source: '/void-lens',
        destination: '/observatory?tool=void-lens',
        permanent: true,
      },
      {
        source: '/constellation',
        destination: '/observatory?tool=constellation',
        permanent: true,
      },
      {
        source: '/pulse-streams',
        destination: '/observatory?tool=pulse-streams',
        permanent: true,
      },
    ];
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          {
            key: 'X-Robots-Tag',
            value: 'all',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com", // unsafe-inline required for Next.js hydration
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: https:",
              "font-src 'self' data: https://fonts.gstatic.com",
              "connect-src 'self' https://*.supabase.co https://*.supabase.in https://rpc.mainnet.near.org https://rpc.testnet.near.org https://api.nearblocks.io https://testnet.nearblocks.io https://api.defillama.com https://api.github.com https://raw.githubusercontent.com https://api.pikespeak.ai https://api.fastnear.com https://api.coingecko.com https://graph.mintbase.xyz https://indexer.ref.finance https://api.dexscreener.com wss://*.near.org https://www.googletagmanager.com https://www.google-analytics.com https://region1.google-analytics.com",
              "base-uri 'self'", // Prevent base tag injection attacks
              "form-action 'self'", // Prevent form hijacking
              "upgrade-insecure-requests", // Force HTTPS
              "frame-ancestors 'none'",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
