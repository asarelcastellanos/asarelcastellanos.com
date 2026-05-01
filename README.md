# asarelcastellanos.com

My personal site — a single-page online business card. Dark mode only, single 640px column, deliberately quiet.

Built with [SvelteKit](https://svelte.dev/docs/kit) (Svelte 5 runes) and TypeScript. No CSS framework — just design tokens in `src/app.css` and scoped styles per component.

## Stack

- SvelteKit + Svelte 5 (runes: `$state`, `$effect`, `$props`, `$derived`)
- TypeScript
- Vite
- [Geist](https://vercel.com/font) (sans only)
- `@resvg/resvg-js` for the OG image

## Develop

```sh
npm install
npm run dev
```

Open http://localhost:5173.

## Build

```sh
npm run build
npm run preview
```

## Other scripts

| Command | What it does |
|---|---|
| `npm run check` | TypeScript + Svelte check |
| `npm run og` | Regenerate `static/og.png` from `scripts/generate-og.mjs` |

## Layout

```
src/
├── app.css                  design tokens (colors, type, spacing, motion)
├── app.html
├── lib/
│   ├── components/          Header, Bio, Section, Work, LinkRow, Footer, Cursor
│   ├── data/work.ts         work history
│   └── icons/               inline SVG icons
└── routes/
    ├── +layout.svelte       site-wide meta tags + favicon
    └── +page.svelte         the page
static/
├── monogram.svg             favicon
├── og.png                   social share image (1200×630)
└── asarelcastellanos_resume.pdf
scripts/
└── generate-og.mjs          regenerates static/og.png
```

## Updating content

- **Work history**: edit `src/lib/data/work.ts`.
- **Résumé**: replace `static/asarelcastellanos_resume.pdf`.
- **Bio / "currently" copy**: edit `src/lib/components/Bio.svelte` and `src/routes/+page.svelte`.
- **OG image**: edit `scripts/generate-og.mjs`, then `npm run og`.
