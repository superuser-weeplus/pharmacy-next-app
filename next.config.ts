import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: [
        'http://localhost:3000',
        process.env.NEXT_PUBLIC_APP_URL || '',
        process.env.NEXT_PUBLIC_VERCEL_URL || '',
      ].filter(Boolean),
      bodySizeLimit: '2mb', // จำกัดขนาดของ request body
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
  // เปิดใช้งาน Edge Runtime เฉพาะบางส่วน
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { 
            key: 'Content-Security-Policy', 
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://static.line-scdn.net",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: https://cdn.sanity.io https://static.line-scdn.net",
              "font-src 'self' https://fonts.gstatic.com",
              "connect-src 'self' https://api.line.me https://cdn.sanity.io",
              "frame-src 'self' https://static.line-scdn.net",
              "worker-src 'self' blob:",
            ].join('; ')
          },
        ],
      },
    ]
  }
};

export default nextConfig;
