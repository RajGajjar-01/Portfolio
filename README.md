# Portfolio

Personal site built with Astro. Static output; one ~5.5kb JS bundle for smooth
scrolling, and nothing else.

## Commands

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the dev server at `localhost:4321` |
| `pnpm build` | Build to `./dist` |
| `pnpm preview` | Preview the production build locally |
| `pnpm check` | Typecheck `.astro` and `.ts` files |
| `pnpm deploy` | Build and deploy to Cloudflare Workers |

The project convention is to run the dev server detached:

```sh
pnpm astro dev --background   # then: astro dev stop | status | logs
```

## Stack

- **Astro 7** — static output, no adapter
- **Tailwind 4** — via `@tailwindcss/vite`, tokens defined in `src/styles/global.css`
- **MDX** — content collections for projects and posts
- **Astro Fonts API** — Inter and Instrument Serif, self-hosted and preloaded
- **Lenis** — smooth scrolling (`src/components/layout/SmoothScroll.astro`)

No UI framework is installed. The only JavaScript is Lenis (~5.5kb gzipped) plus
a ~15-line inline theme script. Everything else — reveals, page transitions, the
mobile menu — is CSS.

## Where things live

```
src/
  data/site.ts         name, nav, socials — edit this first
  data/resume.ts       resume content
  content/projects/    case studies (MDX)
  content/blog/        posts (MDX)
  content.config.ts    frontmatter schemas
  lib/content.ts       collection queries, sorting, date helpers
  layouts/             Base (head) → Page (chrome) → Entry (article)
  components/ui/       primitives: Container, Section, Tag, Button, cards
  components/layout/   Header, Footer, ThemeToggle
  components/home/     homepage sections
  styles/global.css    theme tokens, base styles, prose
  styles/motion.css    the animation layer
```

## Adding content

Drop an `.mdx` file into `src/content/projects/` or `src/content/blog/`. The
filename becomes the URL slug. Frontmatter is validated by Zod at build time —
a missing or misspelled field fails the build rather than the page.

Set `draft: true` to hide an entry from production builds while keeping it
visible in `pnpm dev`.

Cover images go in `src/assets/` and are referenced by relative path in
frontmatter. They are optimised at build time; do not put them in `public/`,
which bypasses the image pipeline.

## Animation

All animation is CSS, defined in `src/styles/motion.css`:

- `.reveal` — fades in on scroll via `animation-timeline: view()`
- `.reveal-once` — plays immediately, for above-the-fold content
- `.parallax` — scroll-linked drift for large media
- Page transitions use the native `@view-transition` rule

The reading progress bar (`.scroll-progress`) is the exception: it reads a
`--scroll-progress` variable published by `SmoothScroll.astro`. On article pages
it replaces the native vertical scrollbar, which is hidden — but only once the
script confirms at runtime that the bar is being driven, so the reader is never
left without a scroll cue.

Two guards matter. Everything sits behind `@supports (animation-timeline: view())`
so browsers without support show static content rather than a blank page, and
behind `prefers-reduced-motion: no-preference`.

## Theming

Three states: explicit light, explicit dark, and follow-the-system when nothing
is stored. Colours are CSS variables on `:root` in `global.css`; Tailwind reads
them through an `@theme inline` block, which is what allows runtime swapping.

## Deploying

Static assets only — no adapter, no server runtime.

```sh
pnpm deploy
```

Config lives in `wrangler.jsonc`. First deploy will prompt for a Cloudflare
login.

## Before going live

- [ ] Set the real domain in `astro.config.mjs` (`SITE`) and `src/data/site.ts` (`url`) — sitemap, RSS, and canonical URLs all depend on it
- [ ] Replace the placeholder copy in `src/data/site.ts`, `src/data/resume.ts`, and `src/components/home/`
- [ ] Replace the sample entries in `src/content/`
- [ ] Fill in the real social URLs (several are `TODO`)
- [ ] Add cover images and an OG share image
