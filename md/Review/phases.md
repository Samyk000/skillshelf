# Skillshelf Overhaul: Implementation Phases

This document outlines the step-by-step phases to transition Skillshelf to a "Dribbble-Style" high-performance architecture.

## 🧱 Database & Backend (Priority 1)
*Foundational changes to ensure data integrity and storage efficiency.*

- [ ] **Title Uniqueness**: Add a `UNIQUE` constraint to the `title` column in the `skills` table via Supabase migration.
- [ ] **Featured Limit (5)**: Implement a UI-level blockade and database-level constraint to ensure exactly 5 skills are marked `featured: true`. If 5 are already active, the "Feature" button will be disabled with a tooltip to "un-feature" an existing item first.
- [ ] **Image Storage**: Create and utilize a dedicated `thumbnails` bucket in Supabase specifically for compressed screenshots to keep your main `skills` bucket clean and within free-tier limits.
- [ ] **Minification Hook**: Implement a server-action utility to strip unnecessary whitespace and comments from `preview_html` and `skill_markdown` before saving (reducing DB payload).

## 🎛️ Admin Panel Overhaul (Priority 2)
*Improving the workflow for content creation.*

- [ ] **Skill Dashboard Grid**:
    - [ ] Re-organize `SkillTable` to group **Featured** items at the top with a distinct visual divider.
    - [ ] Add "Featured" count indicator (e.g., "5/5 Featured slots filled").
- [ ] **SkillForm Enhancements**:
    - [ ] **Image Upload Field**: Add a visible field for `cover_image_url`.
    - [ ] **Clipboard Paste Support**: Implement `onPaste` listener to automatically capture images from the clipboard, compress them client-side, and upload to Supabase storage.
    - [ ] **Image Compression**: Integrate `browser-image-compression` to ensure all uploads stay under 250KB.
    - [ ] **Markdown Character Count**: Add a real-time counter above the `skill_markdown` textarea.
    - [ ] **Slug Auto-Sync**: Maintain existing slug generation logic but add a "Sync with Title" toggle.

## 🎨 Frontend & Public UI (Priority 3)
*The user-facing experience: 60fps scrolling and pixel-perfect previews.*

- [ ] **Showcase Section**:
    - [ ] Update `HeroShowcase` to strictly use the `cover_image_url`. 
    - [ ] Implement smooth fade-ins for images.
- [ ] **Explore Grid (SkillsList)**:
    - [ ] **Column Update**: Change grid to **3 columns** (Desktop) and **2 columns** (Tablet/Mobile).
    - [ ] **Batch Size**: 9 initial / 6 "Load More".
    - [ ] **Static-First Card**: `SkillCard` now renders an optimized `<img>` tag by default. 
    - [ ] **Iframe Removal**: Completely remove `iframe` mounting logic from the main grid to ensure Zero-Lag scrolling.
- [ ] **Adaptive "Desktop" Viewport**:
    - [ ] On mobile, Ensure the desktop screenshot frames correctly (using `object-fit: cover` with a glassmorphic border) to maintain the "Professional Design" aesthetic.
- [ ] **Interactive Preview (Detail Page)**:
    - [ ] Only load the full HTML `iframe` when a user navigates to the detail page (`/skills/[slug]`).
    - [ ] Use `Suspense` with a skeleton loader for the iframe.

## 🚀 Optimization & Caching (Priority 4)
*Ensuring the "Instant" feel and reducing API spam.*

- [ ] **Next.js Caching**:
    - [ ] Implement `unstable_cache` with specific tags (`'skills-list'`, `'featured-skills'`).
    - [ ] Trigger `revalidateTag` in admin server actions only when a skill is created/updated/deleted.
- [ ] **Image Caching**: Set long-lived `Cache-Control` headers for assets stored in Supabase buckets.
- [ ] **Core Web Vitals**: Final audit to ensure LCP is < 2.0s on all key pages.

---

## ✅ Final Checklist
- [ ] **Grid at 60fps?** (Verified via Chrome Profiler).
- [ ] **Image Compression working?** (Verified by checking new DB entries).
- [ ] **Mobile View looks pixel-perfect?** (Verified via Responsive Design Mode).
- [ ] **Admin paste working?** (Verified by clipboard test).
- [ ] **Duplicate titles blocked?** (Verified via DB error catch).
