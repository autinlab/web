# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm install` — install deps
- `npm run dev` — Vite dev server
- `npm run build` — `tsc` typecheck (no emit) then `vite build`, output in `dist/`
- `npm run preview` — preview the production build

There is no test runner and no linter configured. TypeScript strictness (including `noUnusedLocals`/`noUnusedParameters`) is enforced via `tsc` during `build`.

## Deployment

Pushes to `main` trigger `.github/workflows/main.yml`, which runs `npm run build` and publishes `dist/` to the `gh-pages` branch via `JamesIves/github-pages-deploy-action`. The site is served at `autinlab.org` (see `public/CNAME`). `vite.config.ts` sets `base: './'` so built asset URLs are relative — keep this if you change config, otherwise GitHub Pages will 404 on assets.

## Architecture

### Multi-page Vite build

This is **not** a single-page app despite being React-based. `vite.config.ts` declares three Rollup inputs, each with its own HTML entry and TSX bootstrap:

- `index.html` → `index.tsx` → `App.tsx` — the main lab portfolio.
- `labintern.html` → `labintern.tsx` — renders `InternPlannerModal` standalone (the planner is also reachable as a modal from the main app).
- `xrstudy.html` → `xrstudy.tsx` → `XRStudyPage` — standalone XR lesson study page.

When adding a new top-level page, add an HTML file, a TSX bootstrap, **and** a new entry in `vite.config.ts`'s `rollupOptions.input`. Missing the third step means the page won't appear in `dist/`.

### Two coexisting React versions (intentional)

`package.json` pins React 18 (used by `@vitejs/plugin-react` during the build/typecheck) but each `*.html` ships an **import map** pointing the browser at React 19 from `aistudiocdn.com`. At runtime the browser uses React 19; the build toolchain still type-checks against the local React 18 types. Don't "fix" this mismatch without understanding the deployment story — the import map is what actually runs in production.

### Styling: Tailwind via CDN

Tailwind is loaded from `cdn.tailwindcss.com` in each HTML file with a `tailwind.config` inline `<script>` (custom `science` color palette, `Inter`/`Space Grotesk` fonts, float keyframes). There is no PostCSS/Tailwind build step. If you change the Tailwind theme, update the inline config in **all three** HTML files to keep them in sync.

### Content vs. components

Static content is centralized and separated from presentation:

- `constants.ts` — main-site content (team members, publications, research areas, software tools, integrative models, nav items). Edit here, not inside components.
- `types.ts` — shared TS types/enums for the above.
- `data/labintern.ts` — LabIntern planner content (questions, projects, copy). The file's header comment is the maintainer's guide for which constant controls what.
- `lib/labintern.ts` — pure scoring logic for the planner; matches answer state against `PLANNER_PROJECTS`.
- `data/xrStudy.ts` — XR study page content.

### Static playground apps

`public/playground/` (cellPAINT2D, fullerenes, viewer_dev, virus-on-the-rock) holds self-contained static apps served as-is by Vite. They are not part of the React build and are referenced by absolute URLs from the site.

### Scripts directory (not part of the web build)

`scripts/` contains a Python helper (`google_forms_study_builder.py`) for provisioning Google Forms for the XR study, plus an Apps Script (`link_form_responses_to_sheets.gs`). The OAuth artifacts (`credentials.json`, `token.json`, `created_forms.json`) are gitignored — never commit them.

## Notes on the AI Studio README

`README.md` is the boilerplate from the AI Studio template and mentions a `GEMINI_API_KEY` / `.env.local`. The current code does **not** use Gemini at runtime — treat that instruction as stale unless you're explicitly adding Gemini integration.

# CLAUDE.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.
