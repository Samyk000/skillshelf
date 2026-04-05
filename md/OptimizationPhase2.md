# Phase 2 — Polish & Resilience

**Priority:** 🟡 High
**Effort:** ~1.5 hours
**Risk:** Low
**Deployable:** Independently (after or alongside Phase 1)

---

## Goal

Fix edge cases, improve error handling, clean up dead code. No visual changes to the main user flow.

---

## 1. Fix `BackButton` for Direct Navigation

**File:** `src/components/skills/BackButton.tsx`

**Problem:** `window.history.back()` does nothing if the user landed directly on a skill (bookmark, shared link, search engine). The user is stuck.

**Solution:** Check if there's history to go back to. If not, navigate to homepage.

**Implementation:**
```typescript
const handleBack = () => {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push("/");
  }
};
```

**Expected impact:** Users always have a working back navigation. No dead ends.

**Rollback:** Revert to `router.back()` only.

---

## 2. Add Error Boundaries

**Files to create:**
- `src/app/(main)/error.tsx`
- `src/app/(main)/(public)/skills/[slug]/error.tsx`

**Problem:** When Supabase queries fail, the behavior is inconsistent. Some pages show error UI, others silently fail or show `notFound()` for server errors.

**Solution:** Route-level error boundaries with retry capability.

**Implementation:**
```typescript
// src/app/(main)/error.tsx
"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="border-2 border-destructive p-8 text-center">
      <p className="text-xs font-semibold tracking-wider text-destructive">
        // SOMETHING WENT WRONG
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        {error.message || "An unexpected error occurred."}
      </p>
      <button
        onClick={reset}
        className="mt-4 border-2 border-primary px-4 py-2 text-xs font-semibold tracking-wider text-primary uppercase transition-colors hover:bg-primary hover:text-primary-foreground"
      >
        TRY AGAIN
      </button>
    </div>
  );
}
```

**Expected impact:** Graceful error handling instead of blank pages. Users can retry failed requests.

**Rollback:** Delete error.tsx files.

---

## 3. Fix SkillCard Keyboard Accessibility

**File:** `src/components/skills/SkillCard.tsx`

**Problem:** The hover overlay with copy/download buttons is only accessible via mouse. Keyboard users can't access these actions.

**Solution:** Show overlay on `:focus-within` in addition to `:hover`.

**Implementation:**
Add `group-focus-within:translate-y-0 group-focus-within:pointer-events-auto` to the overlay div's className.

**Expected impact:** Keyboard users can access all card actions. WCAG 2.1 AA compliance.

**Rollback:** Remove the focus-within classes.

---

## 4. Clean Up Dead Code

**Files to delete:**
- `src/components/explore/SortDropdown.tsx` — unused, replaced by `SortTabs`
- `src/components/skills/SkillMarkdown.tsx` — unused, markdown goes directly to CopyButton/DownloadButton

**Files to clean:**
- `src/components/explore/FilterChips.tsx` — remove unused `isPending` variable
- `src/components/admin/SkillForm.tsx` — remove unused `onStatusChange` and `onFeaturedChange` props (already done in previous round)

**Expected impact:** Smaller bundle, less confusion for future developers.

**Rollback:** Restore deleted files from git history.

---

## 5. Fix Sort Error Handling Consistency

**File:** `src/components/skills/SkillsList.tsx`

**Problem:** Only the "recent" sort path returns an error UI. Views/likes sort paths silently return empty arrays on failure.

**Solution:** Add error handling for all sort modes.

**Implementation:**
```typescript
// In the views sort block:
if (skillsResult.error) {
  return (
    <div className="border-2 border-destructive p-6 text-destructive">
      Error loading skills.
    </div>
  );
}

// Same for likes sort block
```

**Expected impact:** Users see meaningful error messages instead of blank grids.

**Rollback:** Remove error checks from views/likes blocks.

---

## Phase 2 Checklist

- [ ] Fix `BackButton` for direct navigation
- [ ] Test BackButton with direct link (open skill in new tab)
- [ ] Test BackButton with normal navigation (click from homepage)
- [ ] Create `src/app/(main)/error.tsx`
- [ ] Create `src/app/(main)/(public)/skills/[slug]/error.tsx`
- [ ] Test error boundary by simulating Supabase failure
- [ ] Add keyboard accessibility to SkillCard overlay
- [ ] Test keyboard navigation (Tab through cards, Enter to open)
- [ ] Delete `SortDropdown.tsx`
- [ ] Delete `SkillMarkdown.tsx`
- [ ] Remove unused `isPending` from FilterChips
- [ ] Fix sort error handling in SkillsList
- [ ] Deploy and monitor
