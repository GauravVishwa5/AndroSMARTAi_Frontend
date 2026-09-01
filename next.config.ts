import type { NextConfig } from "next";

const BACKEND_URL = process.env.BACKEND_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || "http://18.212.228.237:8000";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    '192.168.161.1',
    '192.168.161.1:3000',
    'localhost',
    'localhost:3000',
    '127.0.0.1',
    '127.0.0.1:3000',
  ],
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${BACKEND_URL.replace(/\/$/, '')}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
