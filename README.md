# Ludo's Molecular Graphics Lab website

Source for [autinlab.org](https://autinlab.org), the site of Ludo's Molecular Graphics Lab at Scripps Research. Vite + React + TypeScript, deployed to GitHub Pages on every push to `main`.

## Run locally

Prerequisite: Node.js 20.

```
npm install
npm run dev       # dev server
npm run build     # tsc typecheck + vite build into dist/
npm run preview   # serve dist/ at http://localhost:4173
```

## Where files end up

- `index.html`, `labintern.html`, `xrstudy.html` are Vite entries (see `vite.config.ts`), bundled into `dist/`.
- Everything in `public/` is copied unchanged to the root of `dist/`, so `public/llms.txt` is served at `https://autinlab.org/llms.txt`. Static pages placed there (`cellpack.html`, `mesoscope.html`) need no Vite entry.
- `vite.config.ts` uses `base: './'`, so asset paths are relative. Canonical, Open Graph, sitemap and llms.txt URLs must be absolute (`https://autinlab.org/...`).

## Search engine and AI crawler files

| File | Purpose |
|---|---|
| `index.html` head | Title, description, canonical, Open Graph/Twitter tags, JSON-LD (lab, Ludovic Autin, cellPACK, Mesoscope) |
| `index.html` `<noscript>` | Plain-text lab intro for visitors and bots without JavaScript |
| `public/robots.txt` | Allows all crawlers; blocks `/playground/molstar-dev/` and `/playground/stories/` |
| `public/sitemap.xml` | Indexable pages (xrstudy is intentionally left out) |
| `public/llms.txt` | Summary and annotated links for AI assistants |
| `public/cellpack.html`, `public/mesoscope.html` | Static answer pages readable without JavaScript |

The same facts live in several places. When you change a tool, publication or team fact in `constants.ts`, also update: the `index.html` JSON-LD and `<noscript>`, `public/llms.txt`, and the matching static page. Add any new page to `public/sitemap.xml`.

## Check what a bot without JavaScript sees

In PowerShell, use `curl.exe` (plain `curl` is an alias for `Invoke-WebRequest`).

```
npm run build
Test-Path dist\robots.txt, dist\sitemap.xml, dist\llms.txt, dist\cellpack.html, dist\mesoscope.html
npm run preview
curl.exe -s -A "GPTBot" http://localhost:4173/ | Select-String "Mesoscope|cellPACK|Scripps"
curl.exe -s http://localhost:4173/llms.txt
```

After deploying, run `curl.exe -sI https://autinlab.org/llms.txt` and paste the home page into [validator.schema.org](https://validator.schema.org/).
