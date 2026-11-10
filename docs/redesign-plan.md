# asarelcastellanos.com redesign plan

Status: draft, 2026-11-09. Opus wrote this plan. Sonnet implements it one PR at a time.

## Where the site is now

The live site matches `main` (commit `353e35f`, 2026-04-30). It is a single SvelteKit page on Vercel. `npm run check` and `npm run build` pass with 0 errors. `npm audit` reports 13 vulnerabilities (6 high, 1 critical). All of them are in build tools, not in the shipped static files. The critical ones are in Next.js, which the `geist` font package lists as a dependency even though this site never runs it.

### Content

- The page has a name, a two-line bio, a "currently" line, 4 jobs (company, title, dates), a résumé download, and links to GitHub, LinkedIn, and email.
- There are no projects. The April redesign deleted the old project list and did not replace it.
- There is no education. Cal Poly (BS Economics, Quantitative Analysis, Dec 2025) appears only in the résumé PDF.
- The Arrow role shows one line. The résumé has strong numbers for it (5,000+ manufacturers, 41,000+ models, 45,000+ listings a day from 200+ sources, seller onboarding cut from days to under an hour). None of them reach the site.
- The bio and "currently" copy name feelings, not facts ("Tools sharp, dependencies few", "a 200-line SQL migration nobody asked for").

### Technical

| Issue | Where | Effect |
|---|---|---|
| Content starts at `opacity: 0` until JavaScript mounts | `src/routes/+page.svelte` | Blank page without JS. Delays the largest paint. |
| `text-transform: lowercase` on `<main>` | `src/routes/+page.svelte` | Lowercases the name, company names, and "GitHub". |
| Cursor dot runs `requestAnimationFrame` forever | `src/lib/components/Cursor.svelte` | Burns a frame loop when the mouse is still. |
| Hover state set from JS, no focus styles | `LinkRow.svelte`, `app.css` | Keyboard users get no visible focus. |
| `mailto:` link opens with `target="_blank"` | `+page.svelte` via `LinkRow` | Opens an empty tab in some browsers. |
| Geist loads from Google Fonts with CSS `@import` | `src/app.css` | Render-blocking request chain. The `geist` npm package is already installed and only the OG script uses it. |
| `--font-mono` points at the sans font | `src/app.css` | The "mono" labels are not monospaced. |
| `adapter-auto` and no prerendering | `svelte.config.js` | A static page runs as a server function on every request. |
| Canonical URL is the apex domain, which 308-redirects to `www` | `+layout.svelte` | Canonical and `og:url` point at a redirect. |
| No `robots.txt`, `sitemap.xml`, 404 page, or structured data | `static/`, `src/routes/` | `/robots.txt` and `/sitemap.xml` return 404. |
| Meta description written twice | `+layout.svelte`, `+page.svelte` | Two copies to keep in sync. |
| Footer year hard-coded as 2026 | `Footer.svelte` | Goes stale on January 1. |
| Dark mode only | `app.css` | No light theme. |
| Minor dependency updates waiting | `package.json` | Kit 2.58 to 2.70, Svelte 5.55 to 5.57, Vite 8.0 to 8.3. Kit 3 and adapter 8 are majors; leave them out of this project. |

## Decisions

These came from the owner on 2026-11-09.

- Structure: a home page plus one page per project at `/projects/<slug>`. Project pages are Markdown files.
- Projects at launch: howlate.la and Engine 13 (a codename). The GIF party game is out. More projects come later, so adding one must be a single new Markdown file plus images.
- Design: evolve the current look with a sage-on-black palette (owner's pick from the preview canvas, 2026-11-09). Keep near-black and Geist; sage replaces amber as the accent. Add a light theme, a wider grid for project images, and normal capitalization. Remove the cursor dot.
- Audience: hiring managers and general visitors equally. Projects lead the home page, with a clear path to experience and the résumé.

- UI rules: build with the owner's `web-ui` skill (`~/Documents/claude-skills/skills/web-ui`) so the result doesn't read as AI output. Svelte uses the skill's CSS layer: Tailwind CSS v4 plus `@heroui/styles`, with BEM classes on native elements. The current look comes back through token overrides, not custom component CSS. Code follows `typescript-best-practices` and `principle-boundary-discipline`, and all copy goes through `unslop`.

## Information architecture

```
/                       home
/projects               index of all projects (short list, grows later)
/projects/howlate-la    write-up
/projects/engine-13     write-up
/asarelcastellanos_resume.pdf
/sitemap.xml, /robots.txt
404                     custom not-found page
```

### Home page, top to bottom

1. Header: `ac` monogram (links home), nav (Projects, Experience, Résumé), Los Angeles time, theme toggle.
2. Intro: name, one paragraph of concrete positioning, and one line on what I'm open to (see open questions).
3. Selected projects: one card per project. Cover image, name, one-line summary, status, stack. The card links to the write-up.
4. Experience: Arrow, Cal Poly Orfalea College of Business (research assistant, Summer Undergraduate Research Program), Snap, Axios, Snap Engineering Academy. Each role gets company, title, dates, and one sentence with its strongest number. Résumé download button below.
5. Education: Cal Poly San Luis Obispo, BS Economics, Quantitative Analysis, Sep 2023 to Dec 2025.
6. Elsewhere: GitHub, LinkedIn, email.
7. Footer: copyright with the current year, source link to this repo.

### Project page template

- Title, one-line summary, status label (for example "Collecting data" or "In development").
- A facts row: role, timeline, stack, links (live site, source when public).
- Cover image or video.
- Body in Markdown. Suggested sections: the problem, what I built, how it works, numbers, what's next.
- Next and previous project links at the bottom.

## Design system

The `web-ui` skill is the source of truth. Read its `SKILL.md` and `references/` (`setup.md`, `design-language.md`, `css-classes.md`, `recipes.md`) before writing any UI. This section only records where this site departs from the skill's defaults, and why.

### Setup

`src/app.css` becomes:

```css
@import "tailwindcss";
@import "@heroui/styles";
/* token overrides below, nothing else */
```

Install `tailwindcss`, `@tailwindcss/vite`, `@heroui/styles`, `tailwind-variants`, and `@gravity-ui/icons`. Add `tailwindcss()` to `vite.config.ts`. Take class strings from the variant functions (`buttonVariants`, `cardVariants`, `chipVariants`) so they stay typed.

### Token overrides

Change as few tokens as the look needs. Everything else stays HeroUI's default.

| Token | Dark (default) | Light |
|---|---|---|
| `--background` | `#090B0A` | `#EEF1EC` |
| `--foreground` | `#E9EEEA` | `#0A0D0B` |
| `--surface` | `#121614` | `#F7F9F5` |
| `--surface-secondary` | `#1A201C` | `#DFE5DD` |
| `--muted` | `#879189` | `#56605A` |
| `--border` | `#26302A` | `#C7D0C6` |
| `--separator` | `#1E2621` | `#D6DED4` |
| `--accent` | sage `#9CC59A` | dark sage `#466A47` |
| `--accent-foreground` | `#090B0A` | `#EEF1EC` |
| `--font-sans`, `--font-mono` | Geist, Geist Mono (self-hosted font files) | same |

Measured contrast: text 16.8:1 dark and 17.1:1 light; muted text at least 5.1:1 on every surface; accent 10.2:1 on black and 5.4:1 on the light background, and button text on the accent passes at the same ratios. The favicon (`static/monogram.svg`) and the OG image script switch from the old paper and ink colors to these.

Preview canvas: https://claude.ai/artifact/NGFSzqPaz9snS5G6EQUrZb (the "Home, sage on black" board is the chosen look). Dark is the default. The theme follows `prefers-color-scheme`, and a header toggle stores the choice in `localStorage`. Use the skill's pre-paint script so the page doesn't flash, and set both `class="dark"` and `data-theme="dark"` on `<html>`. The implementer checks every override pair for contrast and records the ratios in the PR.

### Rules from the skill that change the current site

- No all-caps labels. The uppercase "— currently" eyebrows go. Section titles use the skill's section title style, in sentence case.
- One icon set: `@gravity-ui/icons`. It replaces the two hand-drawn SVGs in `src/lib/icons/`.
- Accent means something: links, the focus ring, the one primary action. No decorative use of the accent.
- Focus: every interactive element shows the accent focus ring with a 2px offset. Add a skip link.
- Motion explains a state change and respects `prefers-reduced-motion`. No JS-gated fade, no cursor follower, no hover lift on anything that isn't a link.
- Type: the skill's scale, one or two steps larger for the home intro (it counts as a marketing page). One display size per page. `tabular-nums` on dates and numbers.
- Width: page content in `mx-auto max-w-6xl px-4 sm:px-6`, prose capped at `max-w-prose`.
- Removed: `Cursor.svelte`, the lowercase transform, the `mounted` opacity trick, the JS hover state in `LinkRow`, and the per-component pixel sizes.

### How each section maps to the kit

| Section | Kit pieces | Not this |
|---|---|---|
| Header | Links with the `link` class, a `button--ghost button--icon-only` theme toggle | A sticky glass bar |
| Home intro | Marketing section recipe: one concrete sentence, no buttons or one at most (Résumé) | Centered headline, gradient, two default buttons |
| Selected projects | `card` with a real screenshot, title, one sentence, one status `chip` with a text label | Identical icon cards with vague one-liners |
| Experience | Prose rows: company and title in `font-medium`, one `text-muted` sentence with a number, dates in `tabular-nums` | A card per job |
| Project facts | A `separator`-divided row, not nested cards | Cards inside cards |
| howlate.la numbers | Stat row recipe | Big numbers with icons |
| Project body | `typography-prose` | Hand-styled Markdown |
| 404 | Empty state recipe | A joke illustration |

### Slop gate

Every PR that touches UI must pass the "Don't ship slop" list in the `web-ui` skill. The reviewer checks screenshots of both themes at 375px and 1280px against that list, and checks all copy with `unslop`. A failure blocks the PR the same way a type error does.

## Technical approach

- Rendering. Switch to `@sveltejs/adapter-vercel` and set `export const prerender = true` in the root layout. Every page becomes static HTML.
- Content. Add `mdsvex` for project Markdown under `src/content/projects/*.md`. Frontmatter has a TypeScript type and one parse function that runs at build time and throws on a missing or malformed field. Components receive typed props and never load content themselves.
- Images. Use `@sveltejs/enhanced-img` for responsive AVIF and WebP output. Project images live in `src/content/projects/<slug>/`.
- SEO. One `Seo.svelte` component sets title, description, canonical, Open Graph, and Twitter tags per page. The canonical host is `https://www.asarelcastellanos.com`, because that is what Vercel serves. Prerendered `sitemap.xml` and `robots.txt` routes. JSON-LD `Person` on the home page.
- OG images. Extend `scripts/generate-og.mjs` to write one image per project from its frontmatter.
- Clock. Render the LA time on the client only, so prerendered HTML does not carry a stale build-time clock.

## Draft copy

Opus drafted this from the résumé and the repos. The owner must check every fact before it ships.

### Home intro

> Full-stack engineer in Los Angeles. At Arrow I build the crawlers and ingestion pipelines behind an equipment marketplace: 45,000 listings a day from more than 200 sources, matched against a catalog of 41,000 models. Outside work I build things like howlate.la, which records every LA Metro bus and train and grades each one against the timetable.
>
> Open to new full-stack and data roles, in Los Angeles or anywhere I'd relocate for.

### howlate.la card

> Records every LA Metro bus and train position, about 25 million updates a day, and grades each stop against the timetable. Collecting since August 2026 for about $2 a month.

Cover image: a chart from the graded data (needs the v0.3.0 backfill reports). Status: Collecting data. Site in progress. Stack: Python, DuckDB, Google Cloud (Compute Engine, Cloud Storage, Cloud Run). Links: GitHub (public).

### howlate.la write-up outline

1. The problem. Trip planners show the next arrival and then the number disappears. Nobody keeps the record, so a rider can't ask whether the 720 is usually late at 8am on a Tuesday.
2. What it collects. Vehicle positions from Metro's real-time feeds, and every published timetable version.
3. How it works. An always-on collector writes five-minute files to Cloud Storage. A daily pipeline grades each scheduled stop against the timetable in force that day.
4. Numbers. 120 lines, an update every 6 seconds per vehicle, about 400 updates a second at peak, about 25 million records and 1 GB of archive a day, about $2 a month.
5. How it's built. A versioned release plan, one issue per PR, protected branches, CI, and reviews on every merge. The history is public.
6. What's next. The public site and the 1.0 release.

### Engine 13 card

> A physics-ragdoll co-op game for PC. Firefighters try to save the town while a superhero and a villain wreck it around them. Engine 13 is a codename.

Status: In development. Stack: Unity 6, C#, Universal Render Pipeline. No source link (private repo). Team project; the owner will supply their role and media later.

### Engine 13 write-up outline

1. The pitch.
2. What works today. Main menu, pause menu, first-person player, keyboard and gamepad input.
3. What's next. Online co-op for 4 to 8 players through Steam lobbies, ragdoll characters, fire and hose, a destructible town.
4. Media. Screenshots or a short clip.

## Work breakdown

Each PR goes on its own branch off `main`. Sonnet implements it with the `web-ui` skill loaded. Opus reviews the diff against this plan and runs the slop gate before the owner sees it. Every PR must pass `npm run check` and `npm run build`, and gets a Vercel preview URL. The owner approves each commit message before it is committed.

| PR | Branch | Scope | Done when |
|---|---|---|---|
| 1 | `redesign/foundation` | adapter-vercel, prerender, remove cursor dot, lowercase, and JS fade, mailto fix, canonical to `www`, `robots.txt`, `sitemap.xml`, minor dependency bumps, footer year | The site looks the same apart from the removals. The built HTML for `/` contains the page text. |
| 2 | `redesign/design-system` | Tailwind v4 and `@heroui/styles` setup, token overrides for both themes, self-hosted Geist and Geist Mono (copy the font files into the repo under the SIL Open Font License and remove the `geist` npm package, which pulls in Next.js and most of the audit findings; point `scripts/generate-og.mjs` at the copied files), pre-paint theme script, header toggle, `@gravity-ui/icons`, focus ring, skip link. Port the current components to kit classes and delete their scoped CSS. | Every token pair passes WCAG AA, with ratios in the PR. No theme flash on reload. Keyboard tabbing shows focus on every link. Slop gate passes. |
| 3 | `redesign/projects` | mdsvex, frontmatter type and parser, `src/content/projects/`, `ProjectCard`, `/projects`, `/projects/[slug]`, `Seo.svelte`, 404 page, per-project OG images, enhanced images | A malformed frontmatter field fails the build. A placeholder project renders at its slug and appears in the sitemap. |
| 4 | `redesign/home` | New home layout: intro, selected projects, experience with one line each, education, elsewhere. JSON-LD `Person` | The home page matches the outline above, using the draft copy. |
| 5 | `redesign/content` | The two write-ups, real images, final copy, updated résumé if needed | Owner has signed off on every sentence. |
| 6 | `redesign/polish` | Lighthouse pass (target 95+ in every category on mobile), README update, remove dead code, final slop gate across every page | Lighthouse report and slop-gate screenshots attached to the PR. |

PRs 1 to 4 can proceed now. PR 5 can ship the howlate.la write-up first. The Engine 13 card and write-up ship when the owner supplies their role and media.

## Owner answers, 2026-11-09

1. Availability: open to new roles and to relocation. The home intro says so.
2. Experience: include the Orfalea research assistant role. The end date is still needed (the SURP repo starts in July 2025).
3. Engine 13: a team project. Role and media come later.
4. howlate.la cover: a chart from the graded data.
5. Theme: a header toggle that falls back to the system setting.
6. Domain: `www` stays the canonical host.
