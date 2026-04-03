import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Define public routes that should bypass getUser() to allow ISR caching
  const publicRoutes = [
    "/",
    "/login",
    "/signup",
    "/forgot-password",
    "/robots.txt",
    "/sitemap.xml",
    "/favicon",
  ];

  const isPublicPage =
    publicRoutes.includes(request.nextUrl.pathname) ||
    request.nextUrl.pathname.startsWith("/skills") ||
    request.nextUrl.pathname.startsWith("/preview");

  // Public API routes that don't require authentication
  const publicApiRoutes = ["/api/views"];
  const isPublicApi = publicApiRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  // Only call getUser() if it's NOT a public page or if it's a public API that needs it
  let user = null;
  if (!isPublicPage || isPublicApi) {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    user = authUser;
  }

  // Protected routes: redirect to /login if not authenticated
  if (
    !user &&
    !isPublicPage &&
    !isPublicApi
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from auth pages ONLY if we checked for them
  // Note: we might need to check user for /login, /signup etc. to redirect away
  if (
    isPublicPage &&
    (request.nextUrl.pathname.startsWith("/login") ||
      request.nextUrl.pathname.startsWith("/signup") ||
      request.nextUrl.pathname.startsWith("/forgot-password"))
  ) {
    // Re-check user for auth pages specifically to handle redirection
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (authUser) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  // IMPORTANT: You *must* return the supabaseResponse object as is.
  return supabaseResponse;
}
