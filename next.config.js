/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Add security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
  
  // Basic image configuration
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '**',
      },
    ],
  },
  
  // Configure environment polyfills to prevent 'self is not defined' error
  // This transpiles browser APIs for the server environment
  transpilePackages: [
    '@polar-sh/sdk',
    '@clerk/nextjs',
    'react-syntax-highlighter',
    'framer-motion',
  ],
  
  // Server packages configuration
  serverExternalPackages: ['scheduler'],
  
  // Simple experimental features
  experimental: {
    // Disable optimizations that might cause build issues
    optimizeCss: false,
  },
};

module.exports = nextConfig; 