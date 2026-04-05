# Implementation Plan: Double-Repo Open-Source Transition

This plan details the process of splitting Skillshelf into two repositories: a **Public** open-source repo for community growth and a **Private** repo for your admin features and premium content.

## User Review Required

> [!IMPORTANT]
> **Double-Repo Strategy**: You will maintain two repositories. The **Private** one (current) remains the source of truth for your business. The **Public** one will be a sanitized "Community" edition. I will provide instructions on how to sync them safely.

> [!WARNING]
> **Licensing**: To protect your "Premium" skills from being stolen/resold, I propose **Dual-Licensing**: **MIT** for the code (software) and **CC BY-NC-SA** for the `.md` content. This means people can contribute to the code, but they cannot legally sell your design blueprints.

## Proposed Changes

### 🧱 1. Architecture: The "Hybrid Loader"
- **Unified Skill Type**: Update `src/types/skill.ts` to include a `source` field ('git' | 'database') and a `tier` field ('free' | 'gated' | 'premium').
- **Local Loader**: Create `src/lib/skills-local.ts` to read skills from `/content/skills/free/`.
- **Merged Logic**: Update `src/app/actions/skills.ts` (or equivalent) to return an array containing both local Git skills and Supabase skills.

### 🔒 2. Security & Redaction (Public Repo)
I will provide a script/process to "Sanitize" the public repo:
- **Exclusions**: The following will be **REMOVED** from the public repo:
  - `src/app/(main)/admin` (All admin routes)
  - `src/components/admin` (All management UI)
  - `src/app/actions/admin.ts` (All server-side admin logic)
  - `md/` (All internal strategy and review folders)
- **Environment**: The public `.env.example` will only contain the `ANON` keys, never the `SERVICE_ROLE` key.

### 💎 3. Tiered UX (The "Gate")
- **Free Skills**: Interactive preview, Copy, and Download are **always enabled**.
- **Gated Skills**: 
  - Grid: Clear visibility.
  - Detail Page: Content is blurred or hidden with a **"Login to access this skill"** CTA.
  - Check: `if (!user) return <AuthGate />`.
- **Premium Skills**:
  - Grid: Locked icon.
  - Detail Page: Custom **"Go Premium"** component.
  - Check: `if (profile?.tier !== 'premium') return <PremiumGate />`.
- **Whitelisting**: Your 2/3 existing members will be assigned the `admin` or `premium` role in Supabase so they bypass all gates.

### 📊 4. Database Schema (The "Public" SQL)
I will generate a `schema_public.sql` file containing:
- `skills` table (basic columns).
- `profiles` table (basic role/tier columns).
- Excludes: logging, internal telemetry, or administrative audit tables.

## Open Questions

> [!IMPORTANT]
> **Git Content vs Database**: For the **Free** skills you add to GitHub, do you want them to *also* exist in your local dev database, or should they be **100% database-free** (loaded strictly from the folder)?
> *(Recommendation: Database-free for the public repo makes it easier for contributors to run your app).*

> [!CAUTION]
> **New Repo Setup**: When you create the new public GitHub repo, should I provide a "Publishing Script" that automatically copies only the "Public" files into a clean folder for you to push?

## Verification Plan

### Automated Tests
- Verify `createClient()` works in both public (anon only) and private (admin) contexts.
- Build test to ensure the app compiles without the `admin` folder.

### Manual Verification
- Log out and verify "Free" skills are usable but "Gated" skills show a login prompt.
- Confirm that adding a folder to `content/skills/free/` instantly populates a new card in the grid.
