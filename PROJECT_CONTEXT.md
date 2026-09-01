# Project Context: Moriss Matias Portfolio

## Purpose

This repository contains Moriss Matias's personal portfolio website. It presents him as a **Full Stack Developer**, **UI Designer**, and **AI Automation Specialist**, with a visual, interaction-led single-page experience rather than a conventional multi-page portfolio.

The current portfolio copy positions Moriss as open to work and collaborations, interested in modern web and mobile application development, and presently focused on AI automation.

## Running the project

From this directory (`portfolio/`):

```bash
npm install
npm run dev
```

The development site runs at `http://localhost:3000`. Other available commands are:

```bash
npm run lint
npm run build
npm start
```

## Technology

- **Framework:** Next.js 16.3.1 with the App Router
- **UI:** React 19.2.8 and TypeScript (strict mode)
- **Styling:** Tailwind CSS 4, with a few component-scoped CSS files
- **Animation:** GSAP and ScrollTrigger
- **Icons:** Lucide React plus local SVG technology icons
- **Fonts:** Archivo, Inter, Danfo, and Audiowide through `next/font/google`

The `@/*` import alias resolves to `src/*`.

## Application structure

```text
src/
  app/
    layout.tsx              # Root document, metadata, font variables, theme bootstrap, click sparks
    page.tsx                # Single-page composition, persistent navigation, theme state
    globals.css             # Tailwind import, color tokens, theme-transition styles
  components/
    sections/               # Hero, About, Works, Stack, Contact
    ui/                     # Reusable interaction and display components
  data/
    stackData.ts            # Technology-category data and icon placement
  lib/
    fonts.ts                # next/font configuration
public/
  illustrations/            # Hero and about illustrations
  images/                   # Portrait and featured-work screenshots
  icons/stack/              # Frontend, backend, and AI-automation logos
  resume.pdf                # Resume opened from the About section
```

## Site map and behavior

The homepage (`src/app/page.tsx`) renders all content in this order:

1. **Hero** - Introductory lockup, availability message, role labels, animated name, desk illustration, and numbered section links.
2. **About** - Bio, illustrated/photo portrait swap, resume link, email, education, and experience timeline.
3. **Works** - A three-item featured-work carousel with animated panel swapping.
4. **Stack** - An interactive technology-category explorer.
5. **Contact** - Call to action, clipboard copy for the email address, social links, and oversized name footer.

All primary navigation uses in-page anchors. While the hero navigation is visible, the theme control is a floating button at bottom left. After the hero navigation scrolls out of view, `PillNav` appears at the top with the same section links and the theme control.

### Theme behavior

- The default theme is light.
- A saved `localStorage` value of `theme=dark` enables dark mode before hydration, avoiding a flash of the wrong theme.
- `page.tsx` applies/removes the `dark` class on `<html>` and stores the choice.
- CSS tokens switch between `#efefef`/`#222222` light and dark foreground/background pairs.
- Browsers with the View Transitions API receive a custom diagonal "sword glint" transition when changing theme.

### Motion and interaction inventory

- **Hero:** GSAP entrance timeline reveals name letters from the center outward, then role labels, year, utility labels, illustration, and navigation.
- **About:** ScrollTrigger runs the section entrance and typing effect for "Hello! I'm Mors."
- **Portrait:** `PixelTransition` reveals the photo from the illustrated portrait on hover and restores it on mouse leave.
- **Works:** `WorksSwap` animates an image panel and description panel between left/right positions; arrow buttons cycle the items.
- **Stack:** Hovering a category previews its scattered icons; clicking locks a category, increases emphasis, and exposes technology labels. `TargetCursor` supplies the desktop target cursor on interactive controls.
- **Global:** `ClickSpark` draws canvas sparks at click positions, using the current ink color.

## Current portfolio content

### About and contact

- Display name: **Moriss Matias** / **Mors**
- Email: `morsmatias15@gmail.com`
- GitHub: `https://github.com/mors-codes`
- Education: Associate in Computer Technology, De La Salle Lipa (2023-2025)
- Experience:
  - Freelance Developer, self-employed / remote (Jun 2025-Dec 2025)
  - IT Specialist Intern, Nutech Hardware and Software Solutions (Feb 2025-Apr 2025)

### Featured works

`src/components/sections/Works.tsx` currently defines three placeholder entries:

| Title | Description | Screenshot |
| --- | --- | --- |
| Project One | Full-stack web app | `/images/works/project-1.png` |
| Project Two | Automation workflow | `/images/works/project-2.png` |
| Project Three | UI/UX design system | `/images/works/project-3.png` |

### Technology stack

The stack explorer has three categories defined in `src/data/stackData.ts`:

- **Frontend:** HTML, CSS, JavaScript, React, TypeScript, Tailwind CSS, Bootstrap, Vite, Angular, and Next.js.
- **Backend:** Java, Node.js, PHP, MySQL, PostgreSQL, Supabase, Express.js, MongoDB, OAuth, and JWT.
- **AI Automation:** n8n, Make.com, Zapier, GoHighLevel, OpenAI, Slack, Gemini, Gmail, Google Sheets, Claude, HubSpot, Airtable, Notion, and ClickUp.

Each icon's position, size, and rotation are explicitly configured in that data file. Express.js, OpenAI, and Notion use separate light/dark SVG variants.

## Assets

Important public assets:

- `public/illustrations/hero-desk.svg` - Hero desk scene.
- `public/illustrations/about-portrait.svg` - About-section illustration.
- `public/images/portrait-photo.jpg` - Photo shown through the portrait hover transition.
- `public/images/works/project-1.png` through `project-3.png` - Featured-work screenshots.
- `public/resume.pdf` - Resume opened in a new tab.
- `public/icons/stack/` - 37 technology logo files across frontend, backend, and AI automation.

## Important implementation notes

- The root page is a client component because it owns theme state and scroll observation. Most animated sections/components are also client components.
- `layout.tsx` provides the site metadata: "Moriss Matias" and "Full Stack Developer / UI Designer / AI Automation Specialist".
- `next.config.ts` leaves Next image optimization enabled and sets `minimumCacheTTL` to 60 seconds for replaceable work screenshots.
- No backend, API routes, database configuration, environment variables, authentication, CMS, or form submission flow currently exists. All portfolio data is local and hard-coded.
- `CardSwap` is a reusable GSAP card-stack component, but it is not currently imported by a rendered section. `WorksSwap` is the active featured-work presentation.

## Content and navigation items still to complete

- The "View More Works" link points to `/works`, but this repository has no `/works` route yet.
- The Stack section's "View all tech stack" link defaults to `/works`, which is also not implemented.
- LinkedIn and Twitter links are `#` placeholders in `Contact.tsx`.
- Featured-work titles and descriptions are generic placeholders. They have screenshots but no external project/demo/repository links.
- The code comment beside the email says to swap it for the real email; the rendered value is the email listed above.

## Editing guide

- **Personal copy, timeline, links, email, and social destinations:** `src/components/sections/About.tsx` and `src/components/sections/Contact.tsx`.
- **Featured work data:** `src/components/sections/Works.tsx`; replace the associated images under `public/images/works/` if needed.
- **Technology names, grouping, scatter placement, size, or theme-specific icon selection:** `src/data/stackData.ts`.
- **Global colors and theme-transition styling:** `src/app/globals.css`.
- **Home navigation labels/order:** `src/app/page.tsx` and `src/components/ui/NavRow.tsx`.
- **SEO title/description and root-level wrappers:** `src/app/layout.tsx`.

## Development conventions

- Use `next/image` for local raster/image assets where practical; the Stack icon grid deliberately uses `<img>` because its SVG source switches with theme.
- Preserve the `"use client"` directive on components that use browser APIs, React state/effects, GSAP, or DOM access.
- Keep image paths rooted at `/` so they resolve from `public/`.
- Update this file when portfolio content, routes, stack categories, assets, or deployment behavior materially changes.
