# Project context — Moriss Matias portfolio

Stable briefing for another AI. Capture architecture, conventions, and where things live. Do **not** treat this file as a changelog. Skip updating it for spacing, breakpoints, animation tweaks, copy polish, or other local UI work. Update it only when the stack, section map, data sources, or how the app is put together actually changes.

Owner: **Moriss Matias** (also **Mors**). Role in the product: software engineer. Prefer working in code, not long planning docs.

---

## What this is

A personal **single-page** portfolio. It presents Moriss as a Full Stack Developer, UI Designer, and AI Automation Specialist. The site is visual and motion-led: GSAP entrances, hover/cursor effects, theme transition. There is **no backend**, no API routes, no CMS, no env-based config, no auth, and no form POST. Content is hard-coded in React and `src/data/`.

Positioning (durable, not word-for-word copy): open to work and collaborations; modern web and mobile apps; currently focused on AI automation.

---

## How to run

From the `portfolio/` repo root:

```bash
npm install
npm run dev      # http://localhost:3000
npm run lint
npm run build
npm start
```

---

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js **16** App Router (`next` 16.3.x) |
| UI | React 19, TypeScript **strict** |
| Styling | Tailwind CSS **4** (`@import "tailwindcss"` + `@theme` in `globals.css`) |
| Motion | GSAP; ScrollTrigger registered in sections that scroll-reveal |
| Icons | `lucide-react` plus SVG logos under `public/icons/` |
| Fonts | `next/font/google` in `src/lib/fonts.ts` |

**Next.js 16 differs from older training data.** Before using a Next API, check `node_modules/next/dist/docs/` in this repo. `AGENTS.md` / `CLAUDE.md` only exist to remind agents of that.

Import alias: `@/*` → `src/*`.

---

## Directory map

```text
src/
  app/
    layout.tsx       # html/body, metadata, font CSS variables, theme-init script, ClickSpark
    page.tsx         # homepage composition: theme, nav shells, all sections
    globals.css      # tokens, dark class, name-glare, view-transition / sword-glint
  components/
    sections/        # Hero, About, Works, Stack, Contact
    ui/              # motion + chrome (not page-level sections)
  data/              # stack explorer datasets
  lib/fonts.ts
public/
  illustrations/     # hero desk, about portrait SVG
  images/            # photo + featured-work screenshots
  icons/stack/       # tech logos (frontend, backend, ai-automation, devtools)
  resume.pdf
```

Almost every interactive file is a **client component** (`"use client"`). `layout.tsx` is a server component that wraps children.

---

## Page composition

`src/app/page.tsx` is the only route that matters today. It owns:

- Light/dark theme (`dark` class on `<html>`, `localStorage.theme`, `useSyncExternalStore` so sections stay in sync)
- Whether the user has scrolled past the hero in-page nav (`#hero-nav-row` IntersectionObserver → `pastHero`)
- Mobile menu open state, forwarded to `StaggeredMenu`

Section order and anchor ids:

1. `#hero` — `Hero`
2. `#about` — `About`
3. `#works` — `Works`
4. `#stack` — `Stack` (receives `isDark`)
5. `#contact` — `Contact`

In-page hash links only. Smooth scroll is global (`html { scroll-behavior: smooth }`).

### Navigation chrome (behavioral, not layout)

Three systems, not one navbar:

- **Desktop, while hero nav is on screen:** `Hero` shows logo `MORS.`, availability line, `ThemeToggle`, and `NavRow` (numbered About / Works / Stack / Contact overlaid on the desk illustration).
- **Desktop, after hero nav leaves the viewport:** `PillNav` (`hidden md:block`) slides in with the same anchors plus theme control. `visible={pastHero}`.
- **Mobile (`md` and below):** `MobileNav` is a fixed top bar (logo + hamburger). Hamburger calls `StaggeredMenu.toggle()`. `PillNav` is not shown. Hero’s own logo/theme row is desktop-only.

`md` (768px) is the site-wide desktop/mobile split.

---

## Theme and color

Default is **light**. A `beforeInteractive` script in `layout.tsx` reads `localStorage.theme` so dark mode does not flash.

Tokens in `src/app/globals.css` `@theme` / `.dark`:

- `bg` / `ink` — page background and foreground (`#efefef` ↔ `#222222`)
- `echo` — large muted display (contact footer name)

Tailwind usage: `bg-bg`, `text-ink`, `text-echo`, `font-sans`, `font-display`, `font-logo`, `font-mono-label`.

Theme change: toggle class + persist; if View Transitions API exists, a diagonal clip-path reveal plus a `.sword-glint` overlay.

---

## Type

Configured in `src/lib/fonts.ts`, wired as CSS variables on `<html>`:

| Token | Family | Typical use |
| --- | --- | --- |
| `font-sans` | Archivo | UI copy, nav, body |
| `font-display` | Inter (full weight range) | Big lockups, section titles like `AboutMe` |
| `font-logo` | Danfo | `MORS.` |
| `font-mono-label` | Audiowide | Section numbers `01`–`04` |

Display name lockup is the concatenated word **MorissMatias** (hero `AnimatedName` + contact footer). Logo wordmark is **MORS.**

---

## Sections (what they are for)

**Hero** — Entrance timeline (GSAP): letter-by-letter name (center-out), then roles, year, chrome, illustration, `NavRow`. `AnimatedName` is per-letter spans plus a CSS glare overlay (`.name-glare`). Theme toggle lives in the desktop eyebrow, not as a global floating control.

**About** — Numbered eyebrow `01 — AboutMe`. ScrollTrigger typewriter for “Hello! I'm Mors.” Portrait: `PixelTransition` between illustrated SVG and photo. Resume opens `/resume.pdf`. Bio, email, education, experience via `TimelineEntry`.

**Works** — Eyebrow `02 — FeaturedWorks`. Data is the `WORKS` array in `Works.tsx`. Presentation is `WorksSwap` (two panels: image vs info; arrows cycle). Items may include `stack` icon chips and an optional `link`. “View More Works” currently points at `/works` (route does not exist yet).

**Stack** — Eyebrow `03 — TechStack`. `StackScatter` is the explorer: hover previews scattered icons from `src/data/stackData.ts`; click locks a category; a second “block” view lists tools from `src/data/stackBlockData.ts`. Desktop `TargetCursor` on those controls. Dispatches `stack-eyebrow-done` when the eyebrow animation finishes so scatter can start. Some logos have `{ light, dark }` SVG pairs (Express, OpenAI, Notion, etc.). Scatter icons use `<img>` so the `src` can switch with theme; elsewhere prefer `next/image` for local rasters.

**Contact** — Eyebrow `04 — GetInTouch`. Copy-to-clipboard email button, social row, oversized `MorissMatias` footer.

---

## `components/ui` inventory

Use these instead of inventing parallel widgets:

| Component | Role |
| --- | --- |
| `AnimatedName` | Hero display name, per-letter animation + glare |
| `NavRow` / `NavLink` | Hero numbered in-page links + hover bar |
| `MobileNav` | Mobile top bar |
| `StaggeredMenu` | Full-screen mobile menu (imperative `open` / `close` / `toggle`) |
| `PillNav` | Desktop persistent nav after hero |
| `ThemeToggle` | Sun/moon control (also inlined in PillNav) |
| `WorksSwap` | Featured work carousel |
| `StackScatter` | Tech explorer |
| `TargetCursor` | Desktop target cursor (Stack) |
| `PixelTransition` | Pixel-grid content swap (About portrait) |
| `TimelineEntry` | Date / title / subtitle / description |
| `ClickSpark` | Canvas click sparks around the whole app (layout) |

Several of these have colocated CSS (`PillNav.css`, `StaggeredMenu.css`, `StackScatter.css`, `TargetCursor.css`).

---

## Identity and content (edit in source, not here)

Treat the **files** as source of truth if this list drifts.

- Email: `morsmatias15@gmail.com` (`About.tsx`, `Contact.tsx`)
- GitHub: `https://github.com/mors-codes`
- LinkedIn / Twitter: still `#` placeholders in `Contact.tsx` and `StaggeredMenu` socials on `page.tsx`
- Education: Associate in Computer Technology, De La Salle Lipa, 2023–2025
- Experience: Freelance Developer (Jun–Dec 2025, remote); IT Specialist Intern at Nutech Hardware and Software Solutions (Feb–Apr 2025)
- Featured works: defined in `src/components/sections/Works.tsx` (one live project plus placeholders is expected)
- Stack lists and scatter coordinates: `src/data/stackData.ts` and `src/data/stackBlockData.ts`

Metadata title/description: `src/app/layout.tsx`.

---

## Assets

Paths are public-root (`/illustrations/...`, `/images/...`, `/icons/...`, `/resume.pdf`).

Notable:

- `/illustrations/hero-desk.svg`
- `/illustrations/about-portrait.svg`
- `/images/portrait-photo.jpg`
- `/images/works/project-*.png`
- `/resume.pdf`
- `/icons/stack/{frontend,backend,ai-automation,devtools}/`

`next.config.ts` keeps image optimization on and sets a short `minimumCacheTTL` so work screenshots can be replaced at the same URL.

---

## Conventions for another AI

- Match existing visual language: light/dark ink-on-paper, heavy Inter lockups, Archivo UI, numbered Audiowide eyebrows, 3px ink borders, rounded-xl buttons.
- Keep `"use client"` on anything using state, effects, GSAP, `window`, or refs to DOM.
- Do not add a backend or extra routes unless asked. The product is one scrolling page.
- Do not “simplify” GSAP timelines into CSS-only unless asked; motion is core.
- Section padding pattern is `px-8` mobile / `md:px-16` desktop — keep new sections consistent with that rhythm, not pixel-identical to one snapshot.
- Featured work shape: `WorkItem` in `WorksSwap.tsx` (`title`, `description`, `image`, optional `stack`, optional `link`).
- Stack scatter positions are explicit `x` / `y` / `size` / `rotation` in data, not computed layout.

### Known gaps (structural)

- No `/works` (or other) extra routes, though some links still target `/works`.
- LinkedIn and Twitter are placeholders.
- Contact email comment still says to swap the real address; the rendered address is the one in use.

---

## When to refresh this file

Refresh if you add routes, a CMS, new top-level sections, a different nav model, new design tokens, or move where content lives. Do not refresh for mobile hero lockup tweaks, font-size fitting, or similar.