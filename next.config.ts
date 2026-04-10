import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// In development, React uses eval() for debugging (reconstructing callstacks).
// In production, React never uses eval() — unsafe-eval is not needed.
const scriptSrc = isDev
  ? "script-src 'self' 'unsafe-inline' 'unsafe-eval' https:"
  : "script-src 'self' 'unsafe-inline' https:";

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Preview HTML renders in sandboxed iframes (no allow-same-origin).
      // The sandbox provides primary isolation; CSP adds defense-in-depth.
      scriptSrc,
      "style-src 'self' 'unsafe-inline' https:",
      "font-src 'self' data: https:",
      "img-src 'self' data: https: blob:",
      "frame-src 'self' blob: https:",
      "connect-src 'self' https: ws: wss:",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  experimental: {
    instantNavigationDevToolsToggle: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
