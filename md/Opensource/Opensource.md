# Skillshelf Open-Source Strategy

> **Goal**: Transform Skillshelf into a community-driven open-source project with a sustainable freemium model.

---

## 1. Architecture: What Changes

### Current State (Everything in Supabase)
```
┌─────────────────────────────────────┐
│           Supabase DB               │
│  ┌───────────────────────────────┐  │
│  │  skills table (37 rows)       │  │
│  │  - title, slug, category      │  │
│  │  - skill_markdown (TEXT)      │  │
│  │  - preview_html (TEXT)        │  │
│  │  - cover_image_url            │  │
│  │  - featured, status           │  │
│  └───────────────────────────────┘  │
│  skill_views, skill_likes,          │
│  skill_saves, profiles             │
└─────────────────────────────────────┘
```

### Target State (Hybrid: Git + Supabase)
```
┌────────────────────────────────┐   ┌─────────────────────────────┐
│     GitHub Repository          │   │       Supabase DB           │
│  ┌──────────────────────────┐  │   │  ┌───────────────────────┐  │
│  │  /content/skills/free/   │  │   │  │  skills table          │  │
│  │    web-design/           │  │   │  │  - premium skills      │  │
│  │      skill.md            │  │   │  │  - login-gated skills  │  │
│  │      meta.json           │  │   │  │  - preview_html        │  │
│  │      preview.png         │  │   │  │  - cover_image_url     │  │
│  │    typography/           │  │   │  └───────────────────────┘  │
│  │      skill.md            │  │   │  skill_views, skill_likes  │
│  │      meta.json           │  │   │  profiles (auth users)     │
│  │      preview.png         │  │   └─────────────────────────────┘
│  └──────────────────────────┘  │
│  CONTRIBUTING.md               │
│  CODE_OF_CONDUCT.md            │
│  README.md (updated)           │
└────────────────────────────────┘
```

### The Three Tiers
| Tier | Access | Source | What user gets |
|------|--------|--------|----------------|
| **Free** | Everyone | Git repo (`/content/skills/free/`) | Preview image, copy `.md`, download `.md` |
| **Login-Gated** | Authenticated users | Supabase DB | Full preview + copy + download |
| **Premium** | Paid subscribers | Supabase DB | Full preview + copy + download + exclusive content |

---

## 2. Free Skills: How They Live in the Codebase

### Directory Structure
```
content/
└── skills/
    └── free/
        ├── neon-brutalist-dashboard/
        │   ├── meta.json          ← title, slug, category, description
        │   ├── skill.md           ← the actual SKILL.md content
        │   └── preview.png        ← the screenshot you upload
        ├── glassmorphic-portfolio/
        │   ├── meta.json
        │   ├── skill.md
        │   └── preview.png
        └── ...
```

### `meta.json` Schema
```json
{
  "title": "Neon Brutalist Dashboard",
  "slug": "neon-brutalist-dashboard",
  "category": "Web Design",
  "short_description": "A dark-mode, high-contrast dashboard with neon accents.",
  "featured": false
}
```

### Why This Structure?
1. **Contributors can submit skills via Pull Requests** — they add a folder with `meta.json`, `skill.md`, and `preview.png`.
2. **No database needed for free skills** — the app reads from the filesystem at build time.
3. **Git tracks history** — you see who contributed what, when, and can revert easily.
4. **Images are in the repo** — no Supabase storage cost for free skill previews.

### How the App Reads Free Skills
At build time (or via ISR), a utility function scans `/content/skills/free/` and returns an array of skill objects. These are merged with Supabase results on the homepage.

```
Free skills (from Git)  ──┐
                          ├──▶  Unified skill list on homepage
DB skills (from Supa)   ──┘
```

---

## 3. What Stays in Supabase (And Why)

| Data | Stays in Supabase? | Reason |
|------|-------------------|--------|
| Free skill content | **NO** — moves to Git | Zero DB cost, community contributions |
| Login-gated skills | **YES** | Requires auth check before serving |
| Premium skills | **YES** | Requires payment verification |
| `preview_html` | **YES** (for gated/premium only) | Large HTML blobs; free skills use static images |
| `skill_views` | **YES** | Real-time analytics, per-user tracking |
| `skill_likes` | **YES** | Requires authenticated user |
| `skill_saves` | **YES** | Requires authenticated user |
| `profiles` | **YES** | Auth system |

### Supabase Free Tier Budget
| Resource | Free Limit | Current Usage | After Open-Source |
|----------|------------|---------------|-------------------|
| Database | 500 MB | ~50 MB (37 skills) | ~15 MB (only gated/premium) |
| Storage | 1 GB | Minimal | Minimal (free skill images in Git) |
| Auth | 50,000 MAU | ~5 users | Grows with community |
| API calls | Unlimited (within rate limits) | Low | Reduced (free skills are static) |

**Key insight**: Moving free skills to Git dramatically reduces your DB size and API call volume, giving you more room for premium content and user activity.

---

## 4. Access Control Matrix

| Action | Anonymous | Logged In (Free) | Premium |
|--------|-----------|-------------------|---------|
| Browse grid | ✅ | ✅ | ✅ |
| See preview image | ✅ | ✅ | ✅ |
| Copy free `.md` | ✅ | ✅ | ✅ |
| Download free `.md` | ✅ | ✅ | ✅ |
| View interactive preview (free) | ❌ | ✅ | ✅ |
| Browse login-gated skills | ✅ (blurred) | ✅ | ✅ |
| Copy/download gated `.md` | ❌ | ✅ | ✅ |
| Browse premium skills | ✅ (blurred + lock) | ✅ (blurred + lock) | ✅ |
| Copy/download premium `.md` | ❌ | ❌ | ✅ |
| Like / Save | ❌ | ✅ | ✅ |
| Admin panel | ❌ | ❌ | ❌ (admin only) |

---

## 5. Open-Source Formalities

### 5.1 License Decision

**Current**: MIT License — ✅ this is perfect for open-source.

MIT allows anyone to use, modify, and distribute the code freely. The skill content (`.md` files) is also MIT-licensed, meaning the community can fork and contribute without friction.

> **No change needed.** MIT is the right choice for a dev-tools project.

### 5.2 Files to Create

| File | Purpose | Priority |
|------|---------|----------|
| `CONTRIBUTING.md` | How to submit a skill, code standards, PR process | 🔴 Must have |
| `CODE_OF_CONDUCT.md` | Community behavior expectations (use Contributor Covenant) | 🔴 Must have |
| `.github/ISSUE_TEMPLATE/bug_report.md` | Structured bug report form | 🟡 Should have |
| `.github/ISSUE_TEMPLATE/skill_submission.md` | Template for proposing a new skill | 🟡 Should have |
| `.github/PULL_REQUEST_TEMPLATE.md` | Checklist for PRs | 🟡 Should have |
| `ROADMAP.md` | Public roadmap (what's coming) | 🟢 Nice to have |
| `SECURITY.md` | How to report vulnerabilities | 🟡 Should have |

### 5.3 `.gitignore` Updates
Must ensure these are NEVER committed:
```gitignore
# Already covered
.env*

# Add these
md/                    # Internal planning docs (your Review/, Opensource/ folders)
*.tsbuildinfo
```

### 5.4 Secrets Audit
Before making the repo public, verify:
- [ ] `.env.local` is gitignored (✅ already is)
- [ ] No hardcoded API keys in source files
- [ ] No Supabase service-role keys anywhere in the codebase
- [ ] No sensitive data in git history (run `git log --all -p | grep -i "supabase"` to check)

---

## 6. What You Need to Do Manually

### Phase 0: Preparation (Before any code changes)
1. **Audit git history** for any accidentally committed secrets.
2. **Decide which skills are free vs gated vs premium** — make a spreadsheet.
3. **Take screenshots** of each free skill (desktop view, 16:10 ratio, save as `.png`).
4. **Create the `/content/skills/free/` folders** with `meta.json`, `skill.md`, and `preview.png` for each free skill.

### Phase 1: Content Migration
1. For each free skill currently in Supabase:
   - Export the `skill_markdown` content.
   - Create the folder structure in `/content/skills/free/[slug]/`.
   - Add the `meta.json` with title, slug, category, description.
   - Add the `skill.md` file with the markdown content.
   - Add the `preview.png` screenshot.
2. Mark remaining Supabase skills as `login-gated` or `premium` (we'll add a `tier` column).

### Phase 2: Community Setup
1. Write the `CONTRIBUTING.md` (I will draft this for you).
2. Add `CODE_OF_CONDUCT.md` (I will use the standard Contributor Covenant).
3. Create GitHub issue templates.
4. Update the `README.md` to reflect the open-source nature and how contributors can submit skills.

---

## 7. Technical Implementation Plan

### Step 1: Database Schema Update
Add a `tier` column to the `skills` table:
```sql
ALTER TABLE skills ADD COLUMN tier TEXT NOT NULL DEFAULT 'free'
  CHECK (tier IN ('free', 'login_gated', 'premium'));
```
- Existing skills → manually assign tiers.
- Free skills will eventually be removed from DB after Git migration.

### Step 2: Content Loader Utility
Create `src/lib/content.ts`:
- Scans `/content/skills/free/` at build time.
- Returns typed `Skill[]` array (same interface as DB skills).
- Handles `preview.png` → converts to a relative URL.

### Step 3: Unified Skill Fetching
Update `SkillsList` to merge:
```
const freeSkills = getLocalSkills();       // from filesystem
const dbSkills = await getSupabaseSkills(); // from database
const allSkills = [...freeSkills, ...dbSkills];
```

### Step 4: Access Gates
- Free skills: no gate, everything accessible.
- Login-gated: middleware check, show "Login to access" blur overlay.
- Premium: show "Upgrade to Premium" blur overlay (Stripe integration later).

### Step 5: CI/CD
Add a GitHub Action that:
1. Validates all `meta.json` schemas on PR.
2. Ensures `preview.png` exists for each skill.
3. Runs `npm run build` to catch any issues.

---

## 8. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Someone submits malicious `.md` content | Low — it's markdown, not executable | PR review process, lint rules |
| Large preview images bloat the repo | Medium — Git isn't great for binaries | Enforce max 500KB per image, use `.gitattributes` with LFS if needed |
| Contributors break the build | Low | CI runs `npm run build` on every PR |
| Premium skills leaked | High | Premium content ONLY lives in Supabase, never in the repo |
| Git history contains old secrets | High | Audit before making public, use `git-filter-repo` if needed |

---

## 9. Future: Payment & Premium (Not Now)

When you're ready for Stripe:
1. Add `stripe_customer_id` to `profiles` table.
2. Create a `/api/checkout` endpoint.
3. Add a `subscription_status` column to `profiles`.
4. Premium skills check `subscription_status === 'active'` before serving content.

**This is a separate project phase.** The open-source foundation comes first.
