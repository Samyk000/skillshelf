<div align="center">

# SKILLSHELF

### **// Free Design Skill Library**

**Stop shipping ugly.** Get SKILL.md files that turn your AI-generated code into premium, pixel-perfect UI.

[Live Demo](#) · [Report Bug](https://github.com/Samyk000/skillshelf/issues) · [Request Feature](https://github.com/Samyk000/skillshelf/issues)

---

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?style=flat-square&logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3FCF8E?style=flat-square&logo=supabase)

</div>

---

## // What Is This

Skillshelf is a curated library of **design skills** for your AI coding tools. Each skill includes a `SKILL.md` file that teaches your AI assistant how to build beautiful, consistent UI components.

**No more AI slop.** Just clean, intentional design that actually looks good.

---

## // Features

```
01 BROWSE        Explore the library of design skills by category and tags
02 PREVIEW       See live previews of each skill before downloading
03 COPY          One-click copy to clipboard — paste directly into your project
04 DOWNLOAD      Download .md files to use with Cursor, Claude, ChatGPT, etc.
05 LIKE & SAVE   Bookmark your favorites for quick access
06 ADMIN PANEL   Manage skills, categories, and featured items
```

### Design Categories

| Category | Description |
|----------|-------------|
| `Paper` | Clean, paper-inspired minimal designs |
| `Minimal SaaS` | Simple, elegant SaaS landing pages |
| `Editorial` | Magazine-style editorial layouts |
| `Soft Dashboard` | Gentle, approachable dashboard UIs |
| `Brutalist` | Bold, raw brutalist design systems |
| `Enterprise` | Professional enterprise-grade interfaces |
| `Premium Dark` | Luxurious dark-themed experiences |
| `Bento Product` | Grid-based bento box layouts |
| `Docs-Focused` | Documentation-first designs |
| `Pricing-Page-Focused` | Conversion-optimized pricing pages |

---

## // Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 16.2.1 (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 4 |
| **Components** | shadcn/ui |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Supabase Auth |
| **Storage** | Supabase Storage |
| **Markdown** | react-markdown + Shiki |
| **Fonts** | Space Grotesk + JetBrains Mono |

---

## // Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) account

### Installation

```bash
# Clone the repository
git clone https://github.com/Samyk000/skillshelf.git
cd skillshelf

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## // Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Get these values from your [Supabase Dashboard](https://supabase.com/dashboard) → Project Settings → API.

---

## // Database Setup

### Tables

Run these SQL commands in your Supabase SQL Editor:

```sql
-- Profiles (extends Supabase auth.users)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  display_name text,
  role text default 'user' check (role in ('user', 'admin')),
  created_at timestamptz default now()
);

-- Skills
create table skills (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  title text not null,
  short_description text not null,
  long_description text,
  category text not null,
  tags text[] default '{}',
  status text default 'draft' check (status in ('draft', 'published', 'archived')),
  skill_markdown text not null,
  preview_html text,
  preview_external_url text,
  cover_image_url text,
  featured boolean default false,
  created_by uuid references auth.users,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Skill Likes
create table skill_likes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  skill_id uuid references skills on delete cascade not null,
  created_at timestamptz default now(),
  unique(user_id, skill_id)
);

-- Skill Saves
create table skill_saves (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  skill_id uuid references skills on delete cascade not null,
  created_at timestamptz default now(),
  unique(user_id, skill_id)
);

-- Skill Views
create table skill_views (
  id uuid default gen_random_uuid() primary key,
  skill_id uuid references skills on delete cascade not null,
  user_id uuid references auth.users,
  created_at timestamptz default now()
);
```

### Row Level Security

```sql
-- Enable RLS on all tables
alter table profiles enable row level security;
alter table skills enable row level security;
alter table skill_likes enable row level security;
alter table skill_saves enable row level security;
alter table skill_views enable row level security;

-- Public read access to published skills
create policy "Published skills are viewable by everyone"
  on skills for select using (status = 'published');

-- Admins can manage all skills
create policy "Admins can manage skills"
  on skills for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- Users can like/save skills
create policy "Users can manage their likes"
  on skill_likes for all using (auth.uid() = user_id);

create policy "Users can manage their saves"
  on skill_saves for all using (auth.uid() = user_id);
```

---

## // Project Structure

```
skillshelf/
├── src/
│   ├── app/
│   │   ├── (main)/
│   │   │   ├── page.tsx              # Homepage
│   │   │   ├── (public)/
│   │   │   │   ├── skills/           # Browse & detail pages
│   │   │   │   └── preview/          # Full-screen preview
│   │   │   ├── (auth)/               # Login, signup, forgot password
│   │   │   ├── dashboard/            # User dashboard (saved, liked)
│   │   │   └── admin/                # Admin panel
│   │   └── api/auth/callback/        # Supabase auth callback
│   ├── components/
│   │   ├── admin/                    # SkillForm, SkillTable
│   │   ├── auth/                     # LoginForm, SignupForm
│   │   ├── explore/                  # SearchBar, FilterChips
│   │   ├── layout/                   # Header, Footer, Container
│   │   ├── skills/                   # SkillCard, SkillPreview, etc.
│   │   └── ui/                       # shadcn/ui components
│   ├── lib/
│   │   ├── supabase/                 # Client, server, middleware
│   │   ├── constants.ts              # Categories & tags
│   │   └── download.ts               # Download utility
│   └── types/                        # TypeScript types
├── public/                           # Static assets
├── next.config.ts                    # Next.js config with security headers
└── package.json
```

---

## // Usage

### For Users

1. **Browse** — Visit `/skills` to explore the library
2. **Preview** — Click any skill to see live preview and details
3. **Copy** — Click "COPY SKILL" to copy the SKILL.md to clipboard
4. **Download** — Click "DOWNLOAD .MD" to save the file locally
5. **Save** — Create an account to like and bookmark skills

### For Admins

1. Sign up and set your role to `admin` in the Supabase dashboard
2. Visit `/admin` to access the admin panel
3. Create skills with title, description, markdown, and preview HTML
4. Toggle "Featured" to showcase skills on the homepage

### Using Skills with AI Tools

**Cursor:** Add the SKILL.md content to your `.cursorrules` file or project instructions.

**Claude:** Paste the SKILL.md at the start of your conversation as system context.

**ChatGPT:** Use the SKILL.md as a custom instruction or paste it in your prompt.

---

## // Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## // Contributing

Contributions are welcome. Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## // License

MIT License — feel free to use this project for personal or commercial purposes.

---

<div align="center">

**[skillshelf.dev](https://skillshelf.dev)** · Built with `//` care

</div>
