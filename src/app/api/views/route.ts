import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const RATE_LIMIT_HOURS = 24;

// Trusted proxy headers - only use these if behind a known reverse proxy
// On Vercel: x-forwarded-for is set by Vercel's edge network
// On Cloudflare: cf-connecting-ip is set by Cloudflare
// For local development: we rely on cookie-based rate limiting
function getClientIp(request: NextRequest): string {
  // Vercel sets this header and it's trustworthy
  const vercelIp = request.headers.get("x-vercel-forwarded-for");
  if (vercelIp) return vercelIp.split(",")[0]?.trim() || "unknown";

  // Cloudflare sets this header and it's trustworthy
  const cfIp = request.headers.get("cf-connecting-ip");
  if (cfIp) return cfIp;

  // For local development, return a unique anonymous identifier
  // We don't trust x-forwarded-for in local/dev because clients can spoof it
  return "local-dev";
}

// Generate a consistent hash for anonymous rate limiting
function getAnonymousId(request: NextRequest): string {
  const ip = getClientIp(request);
  const userAgent = request.headers.get("user-agent") || "unknown";
  // Simple hash - in production use crypto.subtle
  return Buffer.from(`${ip}:${userAgent}`).toString("base64").slice(0, 32);
}

export async function POST(request: NextRequest) {
  try {
    const { skill_id } = await request.json();

    if (!skill_id || typeof skill_id !== "string") {
      return NextResponse.json(
        { error: "Missing skill_id" },
        { status: 400 }
      );
    }

    // Validate UUID format
    const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!UUID_REGEX.test(skill_id)) {
      return NextResponse.json(
        { error: "Invalid skill_id format" },
        { status: 400 }
      );
    }

    // Use a hash of the skill_id to avoid cookie collisions
    // Different UUIDs can share the same first 8 characters
    const cookieHash = Buffer.from(skill_id).toString("base64").replace(/[^a-zA-Z0-9]/g, "").slice(0, 16);
    const cookieName = `v_${cookieHash}`;
    const viewCookie = request.cookies.get(cookieName);

    if (viewCookie) {
      return NextResponse.json(
        { error: "Already viewed" },
        { status: 429 }
      );
    }

    const supabase = await createClient();
    let user = null;

    try {
      const result = await supabase.auth.getUser();
      user = result.data.user;
    } catch {
      // Auth check failed, continue as anonymous
    }

    if (user) {
      const { data: recentView } = await supabase
        .from("skill_views")
        .select("id")
        .eq("skill_id", skill_id)
        .eq("user_id", user.id)
        .gte(
          "created_at",
          new Date(Date.now() - RATE_LIMIT_HOURS * 60 * 60 * 1000).toISOString()
        )
        .limit(1)
        .maybeSingle();

      if (recentView) {
        const response = NextResponse.json({ viewed: true, rate_limited: true });
        response.cookies.set(cookieName, "1", {
          httpOnly: true,
          sameSite: "lax",
          secure: true,
          maxAge: RATE_LIMIT_HOURS * 60 * 60,
          path: "/",
        });
        return response;
      }

      await supabase
        .from("skill_views")
        .insert({ skill_id, user_id: user.id });
    } else {
      // Server-side rate limiting for anonymous users using Supabase
      const anonymousId = getAnonymousId(request);
      
      // Check if anonymous user already viewed this skill recently
      const { data: recentAnonymousView } = await supabase
        .from("skill_views")
        .select("id")
        .eq("skill_id", skill_id)
        .is("user_id", null)
        .gte(
          "created_at",
          new Date(Date.now() - RATE_LIMIT_HOURS * 60 * 60 * 1000).toISOString()
        )
        .limit(10);

      // Check if we already have too many anonymous views (basic rate limit)
      if (recentAnonymousView && recentAnonymousView.length >= 3) {
        const response = NextResponse.json({ viewed: true, rate_limited: true });
        response.cookies.set(cookieName, "1", {
          httpOnly: true,
          sameSite: "lax",
          secure: true,
          maxAge: RATE_LIMIT_HOURS * 60 * 60,
          path: "/",
        });
        return response;
      }

      await supabase.from("skill_views").insert({ skill_id });
    }

    const response = NextResponse.json({ viewed: true });
    response.cookies.set(cookieName, "1", {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      maxAge: RATE_LIMIT_HOURS * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Failed to record view:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
