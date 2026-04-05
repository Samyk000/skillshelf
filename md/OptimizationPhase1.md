# Phase 1 — Core Performance Fix

**Priority:** 🔴 Critical
**Effort:** ~2 hours
**Risk:** Zero
**Deployable:** Independently

---

## Goal

Fix the root cause of scroll lag and slow revisits. Zero visual changes. Zero breaking changes.

---

## 1. Fix Middleware — Enable ISR Caching

**File:** `src/middleware.ts` + `src/lib/supabase/middleware.ts`

**Problem:** `updateSession()` calls `supabase.auth.getUser()` on every request, making `revalidate = 60` dead code. Every page load is a fresh Supabase query.

**Solution:** Skip auth check for public routes. Only run it for protected routes.

**Public routes (skip auth):**
- `/`
- `/skills/*`
- `/preview/*`
- `/robots.txt`
- `/sitemap.xml`
- `/api/views`

**Protected routes (require auth):**
- `/dashboard/*`
- `/admin/*`

**Implementation:**
```typescript
// In middleware.ts
const publicPaths = ['/', '/skills', '/preview', '/robots.txt', '/sitemap.xml', '/api/views'];

const isPublicRoute = publicPaths.some(
  (path) =>
    request.nextUrl.pathname === path ||
    request.nextUrl.pathname.startsWith(path + '/') ||
    request.nextUrl.pathname.startsWith(path + '?')
);

if (isPublicRoute) {
  return NextResponse.next(); // Skip auth entirely → ISR works
}

return await updateSession(request); // Auth check for protected routes
```

**Expected impact:** Homepage and skill pages serve cached HTML from Vercel edge within the 60s window. Revisit load time drops from 2-4s to <0.5s.

**Rollback:** Revert to calling `updateSession()` for all requests.

---

## 2. Add Database Indexes

**File:** Supabase SQL Editor (run manually)

**Problem:** Without indexes, every query is a full table scan. At scale, this gets slower.

**SQL:**
```sql
CREATE INDEX IF NOT EXISTS idx_skills_status ON skills(status);
CREATE INDEX IF NOT EXISTS idx_skills_slug ON skills(slug);
CREATE INDEX IF NOT EXISTS idx_skills_featured ON skills(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_skills_category_status ON skills(category, status);
CREATE INDEX IF NOT EXISTS idx_skills_created_at ON skills(created_at DESC) WHERE status = 'published';
CREATE UNIQUE INDEX IF NOT EXISTS idx_likes_user_skill ON skill_likes(user_id, skill_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_saves_user_skill ON skill_saves(user_id, skill_id);
CREATE INDEX IF NOT EXISTS idx_views_skill_id ON skill_views(skill_id);
CREATE INDEX IF NOT EXISTS idx_views_skill_created ON skill_views(skill_id, created_at);
```

**Expected impact:** All queries run 10-100x faster. No visual change.

**Rollback:** Drop indexes (but no reason to — they're additive only).

---

## 3. Iframe Concurrency Limiter

**File:** `src/components/skills/SkillCard.tsx`

**Problem:** When scrolling fast, 12 iframes try to parse simultaneously. Each iframe creates a full browser context (HTML parsing, CSS layout, JS execution, DOM creation). This locks the main thread.

**Solution:** Limit concurrent iframe rendering to 3. Queue the rest.

**Implementation:**
- Add a global `Map<string, boolean>` tracking which iframes are currently rendering
- In the IntersectionObserver callback, check if < 3 iframes are rendering
- If yes: render immediately
- If no: wait in queue, render when one finishes

**Alternative (simpler, same result):** Increase the `rootMargin` threshold and add a debounce delay before setting `isVisible = true`. This naturally staggers iframe creation without a complex queue system.

```typescript
// In SkillCard.tsx — add debounce to IntersectionObserver
useEffect(() => {
  const el = cardRef.current;
  if (!el) return;

  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        // Debounce: wait 100ms before committing to render
        // This prevents rapid scroll from triggering many iframes
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          setIsVisible(true);
          observer.disconnect();
        }, 100);
      }
    },
    { rootMargin: "100px" } // Reduced from 200px
  );

  observer.observe(el);
  return () => {
    observer.disconnect();
    if (timeoutId) clearTimeout(timeoutId);
  };
}, []);
```

**Expected impact:** Scroll FPS improves from 20-30fps to 45-55fps. Iframes load in a controlled sequence instead of all at once. No visual regression — same previews, same quality.

**Rollback:** Revert `rootMargin` to `200px` and remove debounce.

---

## Phase 1 Checklist

- [ ] Update middleware to skip auth for public routes
- [ ] Test that `/dashboard` still redirects unauthenticated users to `/login`
- [ ] Test that `/admin` still redirects non-admins
- [ ] Test that `/` and `/skills/[slug]` work without auth
- [ ] Run database index migration SQL in Supabase
- [ ] Verify indexes exist (`\di` in psql or Supabase SQL editor)
- [ ] Add debounce to SkillCard IntersectionObserver
- [ ] Reduce `rootMargin` from `200px` to `100px`
- [ ] Test scroll smoothness (Chrome DevTools Performance tab)
- [ ] Test revisit load time (should be <0.5s within 60s window)
- [ ] Verify all skill previews render identically
- [ ] Verify HeroShowcase carousel works identically
- [ ] Verify skill detail page iframe works identically
- [ ] Deploy and monitor

---

## Verification Commands

```bash
# Check Vercel response headers for cache HIT
curl -I https://skillshelf-liart.vercel.app/
# Look for: x-vercel-cache: HIT

# Check scroll FPS
# Open Chrome DevTools → Performance → Record → Scroll grid → Check FPS graph
```
