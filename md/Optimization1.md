# Skillshelf Performance Optimization — Master Plan

**Date:** 2026-04-05
**Owner:** Product Manager
**Status:** Approved for Implementation
**Goal:** Achieve production-level smooth scrolling and instant revisit loads with zero visual regression and zero breaking changes.

---

## Problem Statement

Users experience scroll lag when browsing the skill grid. The browser renders multiple heavy `<iframe>` elements simultaneously (each parsing full HTML/CSS/JS), causing main-thread lockup. Additionally, every page visit triggers fresh Supabase queries because middleware bypasses ISR caching, making revisits feel slow.

---

## Success Criteria

| Metric | Current | Target | Measurement |
|--------|---------|--------|-------------|
| Revisit page load | 2-4s | <0.5s | Chrome DevTools Network |
| Scroll FPS (grid) | 20-30fps | 50-60fps | Chrome DevTools Performance |
| Database queries per load | 5+ heavy | 5+ light | Supabase Dashboard |
| Visual regression | N/A | Zero | Side-by-side screenshot comparison |
| Breaking changes | N/A | Zero | Test suite + manual QA |

---

## Architecture Overview

### Root Cause Chain (Before)
```
Middleware calls getUser() on every request
  → Next.js marks request as "dynamic"
  → ISR (revalidate = 60) completely bypassed
  → Every page load = fresh Supabase queries
  → Grid fetches preview_html (heavy HTML) for 12+ skills
  → Browser renders 12 iframes simultaneously
  → Main thread locks up → scroll lag
```

### Fixed Architecture
```
Request comes in
  → Public route? → Skip auth → ISR serves cached HTML
  → Protected route? → Auth check → Proceed
  → Grid: max 3 concurrent iframe renders (queue the rest)
  → Revisit: cached HTML → zero DB queries → instant load
```

---

## Phase Breakdown

| Phase | Scope | Risk | Effort | Deployable Alone? |
|-------|-------|------|--------|-------------------|
| **Phase 1** | Middleware fix + DB indexes + iframe concurrency | Zero | 2 hours | ✅ Yes |
| **Phase 2** | Error boundaries + BackButton fix + dead code cleanup | Low | 1.5 hours | ✅ Yes |
| **Phase 3** | Optional: image-first grid + admin improvements | Low | 4 hours | ✅ Yes |

---

## What Stays Exactly As-Is (Zero Visual Regression)

| Component | Status |
|-----------|--------|
| `SkillCard` iframe rendering | ✅ Unchanged — still shows `preview_html` iframe |
| `HeroShowcase` carousel | ✅ Unchanged — still shows iframe previews |
| `SkillPreview` detail page | ✅ Unchanged — full iframe with `srcDoc` |
| Homepage queries | ✅ Unchanged — still fetches `preview_html` |
| Admin form | ✅ Unchanged |
| All routes | ✅ Unchanged |
| Auth flow | ✅ Unchanged |
| Like/Save/Copy/Download | ✅ Unchanged |

---

## Rejected Recommendations (Do NOT Implement)

| Recommendation | Reason |
|---|---|
| UNIQUE constraint on `title` | Blocks valid content, breaks migration on existing data |
| Minify `preview_html` before saving | Destroys admin readability, can break whitespace-dependent CSS/JS, minimal benefit (gzip already compresses) |
| `unstable_cache` with tags | Internal Next.js API, could break in future versions. ISR + `revalidatePath` is sufficient |
| `browser-image-compression` library | ~50KB bundle for admin-only feature. Canvas API does this with zero dependencies |

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Middleware change breaks auth routes | Low | High | Test `/dashboard`, `/admin` after deploy |
| DB indexes conflict with existing | None | None | Using `IF NOT EXISTS` |
| Iframe queue causes visible delay | Low | Low | Queue threshold is 3 — user won't notice staggered loading |
| ISR cache serves stale data after admin edit | None | None | `revalidatePath` already called in all admin actions |

---

## Rollback Plan

Each phase is independently deployable. If any phase causes issues:
1. Revert the git commit
2. Redeploy
3. No database migrations to undo (Phase 1 indexes are additive only)

---

## Post-Implementation Validation

- [ ] Homepage loads in <2s on first visit
- [ ] Homepage loads in <0.5s on revisit (within 60s)
- [ ] Grid scrolls at 50+ FPS (Chrome DevTools Performance tab)
- [ ] All skill previews render identically to before
- [ ] HeroShowcase carousel works identically
- [ ] Skill detail page iframe works identically
- [ ] `/dashboard` still requires auth
- [ ] `/admin` still requires admin role
- [ ] Like/Save/Copy/Download all work
- [ ] Mobile responsive layout unchanged

---

*This plan prioritizes safety over speed. Every change is additive, reversible, and independently deployable. Zero visual regression is the non-negotiable constraint.*
