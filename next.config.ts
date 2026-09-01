import type { NextConfig } from "next";

const BACKEND_URL = process.env.BACKEND_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || "http://18.212.228.237:8000";

const nextConfig: NextConfig = {
  // 1. Enable Gzip and Brotli compression for all assets
  compress: true,

  // 2. Tree-shake heavy packages (reduces bundle size by ~40%)
  experimental: {
    optimizePackageImports: ['lucide-react', 'axios', 'zustand'],
  },

  // 3. Modern Next.js Image Optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400,
  },

  // 4. Production compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },

  allowedDevOrigins: [
    '192.168.161.1',
    '192.168.161.1:3000',
    'localhost',
    'localhost:3000',
    '127.0.0.1',
    '127.0.0.1:3000',
  ],

  // 5. Server-Side API Proxy
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${BACKEND_URL.replace(/\/$/, '')}/api/:path*`,
      },
    ];
  },

  // 6. Long-lived caching headers for static assets
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|png|webp|avif|woff2|ico)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
