# Contributing to Skillshelf

First off, thank you for considering contributing to Skillshelf! It's people like you that make Skillshelf such a great tool for the AI-augmented design community.

## 🚀 How Can I Contribute?

### 🎨 Submitting a New Skill (No Code Required)
The easiest way to contribute is by adding a high-quality `SKILL.md` to our library. These live directly in the repository under `/content/skills/free/`.

**Steps to submit:**
1.  **Fork** the repository.
2.  Create a new folder in `content/skills/free/[your-skill-slug]`.
3.  Add three files to that folder:
    *   `meta.json`: Metadata about your skill (title, category, description).
    *   `skill.md`: The actual system instructions and design tokens.
    *   `preview.png`: A high-quality screenshot of the design (Desktop view, 16:10 ratio recommended).
4.  **Submit a Pull Request**!

### 💻 Improving the UI/UX
If you're a developer, we welcome improvements to the app itself! 
*   Check the [Issues](https://github.com/Samyk000/skillshelf/issues) for "good first issue" labels.
*   Help optimize our preview rendering or iframe virtualization logic.
*   Improve accessibility or mobile responsiveness.

## 🛠️ Development Setup

1.  Clone your fork: `git clone https://github.com/YOUR_USERNAME/skillshelf.git`
2.  Install dependencies: `npm install`
3.  Set up your local `.env.local` using `.env.example`.
4.  Run the dev server: `npm run dev`

## 📜 Code Style & Standards
- **TypeScript**: We use strict TypeScript. Ensure types are properly defined.
- **Tailwind CSS**: Use utility classes for styling. Avoid ad-hoc CSS unless necessary.
- **Components**: Keep components atomic and reusable in `src/components`.

## 🤝 Community
Please note that this project is released with a [Contributor Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.

## 📝 License
By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
