/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@near-wallet-selector/modal-ui'],
  
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
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline'", // Removed 'unsafe-eval' - modern wallet-selector doesn't need it
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self' data:",
              "connect-src 'self' https://*.supabase.co https://*.supabase.in https://rpc.mainnet.near.org https://rpc.testnet.near.org https://api.nearblocks.io https://testnet.nearblocks.io https://api.defillama.com https://api.github.com https://raw.githubusercontent.com https://api.pikespeak.ai https://api.fastnear.com https://api.coingecko.com https://graph.mintbase.xyz wss://*.near.org",
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
