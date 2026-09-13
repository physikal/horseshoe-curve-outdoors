import type { NextConfig } from "next";

/** Block vercel.live so the preview Toolbar / feedback circle cannot load. */
const toolbarBlockingCsp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://images.squarespace-cdn.com https://static1.squarespace.com",
  "font-src 'self' data:",
  "connect-src 'self'",
  "frame-src 'self'",
  "media-src 'self' https://images.squarespace-cdn.com https://static1.squarespace.com",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
].join("; ");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.squarespace-cdn.com",
      },
      {
        protocol: "https",
        hostname: "static1.squarespace.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: toolbarBlockingCsp,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
