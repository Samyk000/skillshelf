<div align="center">

<img src="public/ImageforReadmeHeader.jpeg" alt="Skillshelf" width="100%" />

### **// SKILLSHELF**

**The UI you imagine. The code your AI writes.**

[Live Demo](https://skillshelf-liart.vercel.app/) · [Report Bug](https://github.com/Samyk000/skillshelf/issues)

---

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?style=flat-square&logo=tailwindcss)
![Supabase](https://img.shields.io/badge/PostgreSQL-Supabase-3FCF8E?style=flat-square&logo=supabase)
![OS](https://img.shields.io/badge/Open_Source-MIT-blue?style=flat-square)

</div>

---

## // The Problem

You know what looks good. Your AI doesn't.

You say "minimal and clean". It removes all the padding. You say "modern design". It adds a carousel from 2012. You say "premium". It adds a gradient.

The result? A generic interface that screams "I was generated in 30 seconds."

---

> [!TIP]
> **Enjoying Skillshelf?** Give us a ⭐ on GitHub! Your support helps us build more premium design blueprints for the community.

---

## // The Solution

Skillshelf is an open-source, high-end **Engineering Workbench**. Each "Skill" is a `SKILL.md` file — a design blueprint with exact tokens, component patterns, and interaction rules. One copy. Pixel-perfect output.

We provide the **Visual Genome** your AI needs to build pixel-perfect interfaces with exact design DNA.

```
01 CURATED DESIGNS        Hand-crafted systems, not random AI guesses
02 LIVE PREVIEWS          See exactly what you're getting
03 ONE-CLICK COPY         Paste directly into your project
04 INSTANT DOWNLOAD       Save .md files for Cursor, Claude, ChatGPT, v0
```

---

## // Open Source & Self Hosting

Skillshelf is built to be easily hosted anywhere. It uses a universal PostgreSQL structure, meaning you can plug it into Supabase, AWS RDS, or a local Docker container.

### 1. Clone the repository
```bash
git clone https://github.com/Samyk000/skillshelf.git
cd skillshelf
npm install
```

### 2. Configure Environment
Copy our template to create your `.env.local`:
```bash
cp .env.example .env.local
```
Fill in your Postgres/Supabase credentials in `.env.local`.

### 3. Setup the Database
Navigate to the `supabase/` folder. You will find a `schema.sql` file. 
Run this SQL script in your Supabase SQL Editor (or your Postgres client) to instantly create all tables, RPCs, and strict Row Level Security (RLS) policies.

*Note: By default, everyone is a `user`. To upload your own skills, you will need to grant yourself admin rights by running: `UPDATE public.profiles SET role = 'admin' WHERE email = 'your-email@example.com';`*

### 4. Run the Workbench
```bash
npm run dev
```

---

## // How To Use the Skills

1. **Browse** — Find a design style that matches your vision
2. **Preview** — See the live output before you commit
3. **Copy** — One click, paste into your project
4. **Build** — Your AI reads it. It builds exactly what you want.

**Cursor:** Add to `.cursorrules` or project instructions.
**Claude:** Paste as system context.
**ChatGPT:** Use as custom instruction.
**v0:** Include in your prompt.

---

## // Tech Stack

| Layer | Technology |
|-------|------------|
| **Core** | Next.js 16 (App Router), React 19 |
| **Logic** | TypeScript 5 |
| **Aesthetics** | Tailwind CSS 4, Framer Motion |
| **Database** | PostgreSQL (Tested with Supabase) |
| **Parsing** | react-markdown, Shiki (Syntax Highlighting) |

---

## // Contributing

We believe in open design. We welcome contributions.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## // License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">

**Built with `//` care by Samyk000.**

</div>
