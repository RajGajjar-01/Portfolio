# Raj N Gajjar — Personal Portfolio

Personal portfolio website built with **Astro 7** and **Tailwind CSS v4**, featuring a dark/light theme, interactive name hero, and a Markdown-driven work portfolio.

## Tech Stack

- **Framework:** Astro 7
- **Styling:** Tailwind CSS v4
- **Icons:** Custom Phosphor-derived SVG icons
- **Fonts:** Archivo, Public Sans, Rubik (Google Fonts)
- **Content:** Markdown-based work collection
- **View Transitions:** Astro ClientRouter

## Features

- Dark/light mode with system preference detection and localStorage persistence
- Interactive NameHero with magnetic font-weight hover effect on each character
- Responsive navigation with collapsible mobile menu
- Offset grid layout for staggered project previews
- Fully typed content collection for portfolio projects
- Custom 404 page

## Commands

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `pnpm install`             | Installs dependencies                            |
| `pnpm dev`             | Starts local dev server at `localhost:4321`      |
| `pnpm build`           | Build your production site to `./dist/`          |
| `pnpm preview`         | Preview your build locally, before deploying     |
| `pnpm astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `pnpm astro -- --help` | Get help using the Astro CLI                     |

## Project Structure

```
src/
  content.config.ts          # Content collection schema
  content/work/              # Markdown project files
  layouts/BaseLayout.astro   # Root layout with nav & footer
  pages/                     # Routes: index, work, about, 404
  components/                # Reusable UI components
  styles/global.css          # Tailwind import + design tokens
```
