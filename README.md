# asarelcastellanos.com

Source for my personal site at [www.asarelcastellanos.com](https://www.asarelcastellanos.com). The home page lists my experience and education. Project write-ups are Markdown files that render at `/projects/<slug>`. The build prerenders every page to static HTML, and Vercel serves it.

## Stack

- [SvelteKit](https://svelte.dev/docs/kit) 2 with Svelte 5 runes, in TypeScript
- Tailwind CSS v4 and [`@heroui/styles`](https://www.heroui.com), using only the button, card, link, and typography components
- [mdsvex](https://mdsvex.pngwn.io) for project Markdown
- Geist and Geist Mono, self-hosted and subset to Latin
- `@gravity-ui/icons` for icons
- `@resvg/resvg-js` for the Open Graph images
- `@sveltejs/adapter-vercel`

## Develop

```sh
npm install
npm run dev
```

Open http://localhost:5173.

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Starts the dev server on port 5173. |
| `npm run check` | Type-checks the TypeScript and Svelte files. |
| `npm run build` | Builds the site and prerenders every page. |
| `npm run preview` | Serves the last build on port 4173. |
| `npm run og` | Writes `static/og.png` and one `static/og/<slug>.png` per published project, and deletes images for projects that are drafts or gone. |

## Layout

```
src/
├── app.css                    tokens for both themes, font faces, HeroUI imports
├── app.html                   pre-paint theme script
├── content/projects/*.md      one file per project
├── lib/
│   ├── components/            Header, Footer, ProjectCard, EntryRow, Seo, and others
│   ├── content/frontmatter.ts parses and validates project frontmatter
│   ├── content/projects.ts    loads every project file (server and project pages only)
│   ├── content/display.ts     helpers that run in the browser
│   ├── data/work.ts           experience and education
│   ├── fonts/                 subset Geist files and their license
│   └── site.ts                site URL, title, description, links
└── routes/
    ├── +page.svelte           home
    ├── projects/              project index and /projects/[slug]
    ├── sitemap.xml/, robots.txt/
    └── +error.svelte          404 and error page
static/
├── asarelcastellanos_resume.pdf
├── monogram.svg               favicon
├── og.png                     home page share image
└── og/                        one share image per published project
scripts/
├── generate-og.mjs            renders the share images
└── fonts/                     Geist TTF files for the share images
```

## Add a project

1. Create `src/content/projects/<slug>.md`. The slug is lowercase words joined by hyphens, such as `howlate-la`.
2. Start the file with frontmatter. Copy an existing project file and change the values.
3. Write the body in Markdown below the frontmatter.
4. Set `draft: false` when the project is ready, run `npm run og`, and commit the new image in `static/og/`.

| Field | Required | Value |
|---|---|---|
| `title` | yes | The project name. |
| `summary` | yes | One sentence for the card and the meta description. |
| `status` | yes | `Collecting data`, `In development`, or `Shipped`. |
| `role` | yes | Such as `Solo project`. |
| `start` | yes | A month, written `2026-08`. |
| `end` | no | A month. Leave it out for an ongoing project. |
| `stack` | yes | A list, such as `[Python, DuckDB]`. |
| `links` | no | A block with `site` and `source` URLs, each indented two spaces. |
| `cover` | no | A block with `src` (a path under `static/`, starting with `/`) and `alt`. |
| `order` | yes | A whole number. Lower numbers show first. |
| `draft` | yes | `true` keeps the project off the site. |

The parser in `src/lib/content/frontmatter.ts` rejects a missing, unknown, or malformed field and names the file and the field. It checks drafts too, so a broken draft fails the build. The parser also rejects em and en dashes in frontmatter text.

A draft is hidden from the site but not private, because this repository is public.

While every project is a draft, the site hides the Projects nav link, the home page project section, and the project entries in `sitemap.xml`. The `/projects` page shows "No projects are published yet" and tells search engines not to index it. All of these come back once one project has `draft: false`.

## Update other content

| What | Where |
|---|---|
| Experience and education | `src/lib/data/work.ts` |
| Home intro | `src/routes/+page.svelte` |
| Site title, description, and links | `src/lib/site.ts` |
| Resume | Replace `static/asarelcastellanos_resume.pdf`. |
| Home share image | Edit `scripts/generate-og.mjs`, then run `npm run og`. |
| Colors | The token blocks in `src/app.css`. Light is under `:root` and dark is under `.dark`. |

## Styles

`src/app.css` imports HeroUI's prelude and four components instead of the whole package. The full import made the stylesheet 479 KB. To use another HeroUI component, add an import for its CSS file next to the others.

SvelteKit inlines the stylesheet into each page, so the first paint does not wait on a second request. `inlineStyleThreshold` in `svelte.config.js` sets the limit at 100 KB. The stylesheet is about 69 KB now. If it grows past the limit, SvelteKit goes back to a separate file without warning, so raise the limit.

## Theme

Light is the default. The script in `src/app.html` runs before the first paint and picks the stored choice, then the system setting, then light. The header toggle saves the choice in `localStorage`.

## Fonts

The files in `src/lib/fonts` are subset to Latin, Latin Extended-A, general punctuation, and arrows. This cut them from 171 KB to 93 KB. A character outside those ranges, such as Greek or Cyrillic, renders in the fallback font. To rebuild the files from the [Geist release](https://github.com/vercel/geist-font/releases), install fonttools and run this once for each of the three files:

```sh
pip install fonttools brotli
pyftsubset Geist-Variable.woff2 \
  --unicodes="U+0000-017F,U+2000-206F,U+20AC,U+2122,U+2190-21FF,U+2212" \
  --layout-features='*' --flavor=woff2 \
  --output-file=src/lib/fonts/Geist-Variable.woff2
```

The TTF files in `scripts/fonts` are full fonts and only feed the share images.
