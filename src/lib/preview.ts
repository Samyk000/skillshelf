/**
 * Strips external font imports from HTML preview content.
 *
 * Used for card-level previews where loading full Google Fonts / CDN fonts
 * per iframe is wasteful. The standalone preview page intentionally
 * bypasses this so users see the design with its intended typography.
 */

// Patterns that match common font CDN imports
const FONT_LINK_PATTERN =
  /<link[^>]*href=["'][^"']*(fonts\.googleapis\.com|fonts\.gstatic\.com|use\.typekit\.net|fonts\.bunny\.net|rsms\.me\/inter|cdnjs\.cloudflare\.com\/ajax\/libs\/font-awesome)[^"']*["'][^>]*\/?>/gi;

const FONT_IMPORT_PATTERN =
  /@import\s+url\(["']?[^)"']*(fonts\.googleapis\.com|fonts\.gstatic\.com|use\.typekit\.net|fonts\.bunny\.net)[^)"']*["']?\)\s*;?/gi;

/**
 * Removes external font <link> tags and @import rules from HTML strings.
 * This prevents each iframe on the home/listing pages from making
 * redundant network requests for fonts that are only cosmetic in a
 * thumbnail-sized preview.
 *
 * @param html - Raw preview HTML from the database
 * @returns Cleaned HTML with font imports stripped
 */
export function stripExternalFonts(html: string): string {
  if (!html) return html;

  let cleaned = html;

  // Remove <link> tags pointing to font CDNs
  cleaned = cleaned.replace(FONT_LINK_PATTERN, "");

  // Remove @import url() rules inside <style> blocks
  cleaned = cleaned.replace(FONT_IMPORT_PATTERN, "");

  return cleaned;
}
