/**
 * Single source of truth for the application's base URL.
 *
 * Priority:
 *   1. NEXT_PUBLIC_SITE_URL (set in Vercel / .env.local for production)
 *   2. VERCEL_PROJECT_PRODUCTION_URL (auto-injected by Vercel)
 *   3. localhost fallback for local dev
 *
 * Trailing slashes are stripped so consumers can safely append paths.
 */
export function getBaseUrl(): string {
  const url =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000");

  return url.replace(/\/+$/, "");
}
