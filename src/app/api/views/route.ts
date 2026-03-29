import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const RATE_LIMIT_HOURS = 24;

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
          maxAge: RATE_LIMIT_HOURS * 60 * 60,
          path: "/",
        });
        return response;
      }

      await supabase
        .from("skill_views")
        .insert({ skill_id, user_id: user.id });
    } else {
      await supabase.from("skill_views").insert({ skill_id });
    }

    const response = NextResponse.json({ viewed: true });
    response.cookies.set(cookieName, "1", {
      httpOnly: true,
      sameSite: "lax",
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
