import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const RATE_LIMIT_HOURS = 24;

// In-memory rate limiter for anonymous views (IP + skill_id)
const viewTracker = new Map<string, number>();

// Clean up old entries every hour
setInterval(
  () => {
    const cutoff = Date.now() - RATE_LIMIT_HOURS * 60 * 60 * 1000;
    for (const [key, timestamp] of viewTracker.entries()) {
      if (timestamp < cutoff) {
        viewTracker.delete(key);
      }
    }
  },
  60 * 60 * 1000
);

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  return forwarded?.split(",")[0]?.trim() || realIp || "unknown";
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

    const cookieName = `v_${skill_id.slice(0, 8)}`;
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
      // Server-side rate limiting for anonymous users by IP
      const clientIp = getClientIp(request);
      const rateLimitKey = `${clientIp}:${skill_id}`;
      const lastView = viewTracker.get(rateLimitKey);

      if (lastView && Date.now() - lastView < RATE_LIMIT_HOURS * 60 * 60 * 1000) {
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

      viewTracker.set(rateLimitKey, Date.now());
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
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
