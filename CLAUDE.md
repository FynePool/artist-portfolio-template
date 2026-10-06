# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project context

**Template** for single-page artist portfolios deployed on Vercel, with Decap CMS for content editing. Ships with placeholder content (lorem ipsum, stock images, galleries `section1..3`) to be replaced per artist. Optimize for small reviewable changes, accessibility, responsive UI, basic SEO, and working local build before deploy. No secrets in git.

## Template setup

Two entry points:

- **Plugin `artist-portfolio`** ([plugin/](plugin/), listed by [.claude-plugin/marketplace.json](.claude-plugin/marketplace.json), so this repo is also a plugin marketplace): `/artist-portfolio:setup` bootstraps from nothing — prerequisites (incl. Vercel Hobby constraints), private repo from template (`gh repo create --template` or the "Use this template" link), Vercel project named by the user (connector or CLI), first commit, then hands off to the repo's `/setup` in a new session (repo skills only load in a session opened on the repo). Plugins don't load in cloud sessions; repo skills do. Bump `version` in [plugin/.claude-plugin/plugin.json](plugin/.claude-plugin/plugin.json) on every plugin change (it pins installs). Validate with `claude plugin validate .` and `claude plugin validate ./plugin`. [plugin/README.md](plugin/README.md) is the directory listing text and must disclose every service the skill acts on; [plugin/.claude-plugin/icon.png](plugin/.claude-plugin/icon.png) is the listing icon (the directory reads it only on the first portal save). Avoid download-and-run shell patterns in skills (`$(curl …)`, `$(gh api …)`, `… | sh`, clone-then-run chains): the directory lint flags them.
- **Repo skills** (below), usable locally or in a cloud session (`CLAUDE_CODE_REMOTE=true`: no Vercel CLI, no browser, no local files — use connectors).

Derived repos must not keep `plugin/` and `.claude-plugin/`: step 1.3 (`/setup-repo`) removes them and `check-setup` flags them.

Vercel Hobby constraints enforced by the setup: non-commercial use (showcase only), commits from the Vercel owner only on private repos (CMS editor = owner, git author = owner's GitHub noreply email), personal-account repos only.


A new project created from this template is configured through project skills in [.claude/skills/](.claude/skills/):

- `/setup` — orchestrator: inventories available tools (gh, Vercel CLI/connector, browser, Gmail), runs `npm run check-setup`, then runs the phases below in dependency order.
- `/setup-repo` → `/setup-content` → `/setup-vercel` → `/setup-cms` → `/setup-contact-form` (optional) → `/setup-domain` (optional).
- The canonical numbered step list is [.claude/skills/setup/progress-template.md](.claude/skills/setup/progress-template.md); `/setup` copies it to `setup-progress.md` (project root) and marks a step `[x]` only with verification evidence. `check-setup` parses that file and lists open steps. Keep step IDs consistent across the template, the phase skills and the README table.

`npm run check-setup` ([scripts/check-setup.mjs](scripts/check-setup.mjs)) is read-only and reports what is still template-default (artist name, placeholder galleries/samples, stock hero, default icon marker, CMS placeholders `OWNER/REPO` / `YOUR-SITE`, git origin still pointing at the template). Keep it in sync when adding new template placeholders.

Setup rules: confirm before outward actions (repo creation, deploys, env vars, invites); `OAUTH_CLIENT_SECRET` never passes through the conversation — the user sets it on Vercel.

## Tech stack

- Framework: Next.js 16 (App Router)
- Language: TypeScript 5 (strict)
- Package manager: npm
- Styling: Tailwind CSS v4
- Testing: none
- Deployment: Vercel (framework defaults — no `vercel.json`)

## Commands

```bash
npm install         # install dependencies
npm run dev         # dev server → http://localhost:3000
npm run build       # production build
npm run lint        # ESLint
npx tsc --noEmit    # typecheck (no dedicated script in package.json)
npm run check-setup # template setup status (read-only)
```

Before marking a task done, run the cheapest relevant check:
1. `npm run lint` for any JS/TS change
2. `npx tsc --noEmit` for type-affecting changes
3. `npm run build` before deploy-sensitive changes

## Key conventions

**CSS tokens** — Tailwind v4 defines semantic tokens in [app/globals.css](app/globals.css) (`surface`, `ink`, `body`, `muted`, `faint`, `rule`). Use these instead of Tailwind's built-in color classes. Dark mode redefines the same tokens under `.dark` on `<html>` — not a media query.

**Content** — Copy is split across three files in [data/](data/), not a single `content.json` (no such file exists): [data/general.json](data/general.json) (`siteTitle`, `artistName`, `description`, `defaultTheme`), [data/bio.json](data/bio.json) (`bio`, `email`, `social`, `aboutSections`), [data/homepage.json](data/homepage.json) (`hero`, `sectionVisibility`, `sectionOrder`, `exhibitionsCta`). Bio paragraphs support `_text_` for italic. `defaultTheme` sets the initial theme (`"dark"` | `"light"`). `artistName` is the single source for the artist's name in nav, footer, page metadata, OG alts, JSON-LD and the `.ics` PRODID — never hardcode the name in components.

**Section system** — Two independent fields in [data/homepage.json](data/homepage.json) control homepage sections:
- `sectionOrder`: array that sets the render order. Hero is always first, Footer always last.
- `sectionVisibility`: object mapping each key to a **plain boolean** (`"galleries": true`, not `{ "show": true }`). A section is rendered **only** if its key is present here with value `true`. If the key is missing, the section is hidden regardless of `sectionOrder`.

Current valid section keys: `"galleries"`, `"articles"`, `"exhibitions-cta"`, `"about"`, `"contact"`, `"featured"`.

**Adding a new section** — When introducing a new homepage section:
1. Add its `SectionKey` to the union type in [app/page.tsx](app/page.tsx).
2. Add it to `sectionMap` in [app/page.tsx](app/page.tsx).
3. Add it to `sectionVisibility` in [data/homepage.json](data/homepage.json) (boolean `true`/`false`).
4. Optionally add it to `sectionOrder` to position it.
Skipping step 3 means the section will never render.

**Gallery auto-discovery** — [lib/data.ts](lib/data.ts) reads `public/assets/` at build time and derives all gallery sections and artwork metadata from folder/file names. No code changes are needed to add or remove **artwork within existing galleries**. See `/add-artwork` for naming conventions.

**Gallery folder = slug** — the folder name under `public/assets/galleries/` is **only** the URL slug (`/gallerie/{folder}`): a clean kebab string matching `^[a-z0-9-]+$` (e.g. `section1`, `pittura`). No `{index}_{title}_{subtitle}` convention — that was removed (`parseFolder` no longer exists). Folders not matching the slug regex are skipped with a `console.warn` in `getGalleries()`. All mutable metadata (title, subtitle, order, visibility) lives in `gallery-config.json`, so renaming a gallery's title never changes its URL. Renaming the **folder** changes the URL — a rare developer action; add an explicit redirect in `next.config.ts` if the old URL was public.

**Adding a new gallery section** — **no developer action required**: the content manager creates it from the CMS ("Gallerie — Opere" → new entry). `npm run sync-cms` and the `BEGIN/END gallerie autogenerate` markers **no longer exist** — the two gallery collections in [public/admin/config.yml](public/admin/config.yml) are static and cover every gallery. Creating the folder by hand still works (`lib/data.ts` auto-discovers it), but `gallery.json` must then include `"type": "opere"` or the gallery won't show in the CMS (see below).

**Gallery CMS collections — why the `type` field exists** — the two collections (`gallery_opere`, `gallery_config`) are `folder` collections pointing at the **same** base folder `public/assets/galleries`. Decap does **not** scope a folder collection by filename: its listing filters only by extension and depth (`listEntries` → `entriesByFolder(folder, extension, depth)`; `depth` is a *maximum*). Without a discriminator each collection would list **both** `gallery.json` and `gallery-config.json`, and saving one under the other's schema would wipe its fields. The separation therefore comes from a top-level `"type"` field (`"opere"` / `"config"`) plus each collection's `filter` option, which matches on parsed JSON fields. **A gallery JSON without the right `type` is invisible in the CMS** (the site still renders it — `lib/data.ts` ignores `type`). The `nome` field is the slug source (`identifier_field` + `slug: "{{nome}}"`) and must match the folder name; in `gallery-config.json` it must match the gallery's folder or the config is silently ignored.

**Decap CMS** — Config at [public/admin/config.yml](public/admin/config.yml). Handles gallery metadata, articles, exhibitions, mostre, premi, and site settings. Auth via GitHub OAuth through `/api/auth` ([app/api/auth/route.ts](app/api/auth/route.ts), env `OAUTH_CLIENT_ID` / `OAUTH_CLIENT_SECRET`). In the template `backend.repo` is `OWNER/REPO` and `base_url` / `site_url` are `https://YOUR-SITE.vercel.app`: placeholders filled by `/setup-repo` and `/setup-cms`.

**Navigation** — [components/Nav.tsx](components/Nav.tsx) is a server component that builds the links (one per public gallery from `getGalleries()`, plus Biografia / Contatti / Esposizioni) filtered by `sectionVisibility` and ordered by `sectionOrder`; [components/NavClient.tsx](components/NavClient.tsx) handles scroll state, active section and the mobile menu.

**Gallery config (`gallery-config.json`)** — each gallery folder holds two sibling JSON files: `gallery.json` (`type: "opere"`, `nome`, `items`) and `gallery-config.json` (`type: "config"`, `nome`, gallery-level settings). They're deliberately **separate files, not one object**: a Decap folder-collection entry maps to exactly one file, and keeping them apart is what gives the content manager two distinct CMS screens (a gallery can hold ~50 works — merging config into that page would make it unusable). `gallery-config.json` fields (all optional):
- `title` / `subtitle` — visible identity; `title` absent ⇒ `kebabToWords(folder)`.
- `layout` — `"masonry"` (default; original proportions) | `"grid-3"` | `"grid-2"` (4:3 cropped cells). Read by [components/Gallery.tsx](components/Gallery.tsx); layout is never derived from the folder name.
- `order` — render order (ascending); absent ⇒ end of list, tie-break on folder name.
- `visibility` — `"public"` (default) | `"unlisted"` | `"draft"`. `public`: shown in homepage + dedicated page + sitemap/OG. `unlisted`: hidden from homepage but page/sitemap stay live. `draft`: excluded upstream in `getGalleries()` → 404 on `/gallerie/{slug}`, out of sitemap/OG.
- `enabled` / `limitItems` — homepage preview: when `enabled` is `true`, the homepage shows only the first `limitItems` works plus a "Vedi tutte" link to `/gallerie/{id}`; else all works render inline. Orthogonal to `visibility` (they decide *how* a visible gallery renders, not *whether*).
- `description` — free extended metadata.

`readGalleryConfig()` in [lib/data.ts](lib/data.ts) defaults every field at runtime (`{ enabled: false, limitItems: 6, order: +∞, visibility: "public", layout: "masonry" }`, title from folder) when `gallery-config.json` is missing or malformed — never assume it exists. A gallery is fully valid with `gallery.json` alone.

**Empty galleries are skipped** — `getGalleries()` drops any gallery with zero works. This keeps a just-created (still empty) gallery, or an orphan folder holding only a `gallery-config.json` saved under a mismatched `nome`, from rendering an empty section in production. `readWorks()` also tolerates a missing/non-array `items` (a CMS-created gallery may not serialize an empty list) — without that guard the build would throw.

**Medium filter** — [lib/mediums.ts](lib/mediums.ts) (`uniqueMediums`, `filterByMedium`) + [components/MediumFilter.tsx](components/MediumFilter.tsx). Only active on [components/Gallery.tsx](components/Gallery.tsx) via `enableFilter` — used on the dedicated `/gallerie/[id]` page, never on the homepage instance.

**Slideshow** — [components/Slideshow.tsx](components/Slideshow.tsx), fullscreen autoplay presentation of a gallery's works. Enabled via the explicit `enableSlideshow` prop on `Gallery` (set only in [app/gallerie/[id]/page.tsx](app/gallerie/[id]/page.tsx)) — do not derive it from `previewCount`/`detailHref`, since those are also `undefined` on the homepage instance and would silently show the slideshow there too.

**Exhibition status & calendar export** — [lib/exhibitionStatus.ts](lib/exhibitionStatus.ts) derives current/upcoming/past from an exhibition's `date`/`dateEnd`; upcoming exhibitions get an "Aggiungi al calendario" link built by [lib/ics.ts](lib/ics.ts) and served from [app/exhibitions/[slug]/calendar.ics/route.ts](app/exhibitions/[slug]/calendar.ics/route.ts).

**JSON-LD (schema.org)** — [lib/jsonld.ts](lib/jsonld.ts) has pure builder functions (`buildPersonSchema`, `buildExhibitionEventSchema`, `buildVisualArtworkSchema`); rendered via [components/JsonLd.tsx](components/JsonLd.tsx) (a server component, no `'use client'`). Wired into `app/layout.tsx` (Person, every page), `app/exhibitions/page.tsx` (ExhibitionEvent[]), `app/gallerie/[id]/page.tsx` (VisualArtwork[]). Build-time only, zero client JS.

**Dynamic OG images** — build-time `next/og` via the `opengraph-image.tsx` file convention, siblings of `app/page.tsx`, `app/exhibitions/page.tsx`, `app/gallerie/[id]/page.tsx`. [lib/ogAssets.ts](lib/ogAssets.ts) picks the source image. No static OG image files or hardcoded URLs.

**Lightbox → Contact prefill** — [lib/contactPrefill.ts](lib/contactPrefill.ts) bridges [components/Lightbox.tsx](components/Lightbox.tsx)'s "Richiedi informazioni" button to [components/Contact.tsx](components/Contact.tsx): scrolls to `#contatti` and prefills the message. Falls back to a `mailto:` link if no Contact section is rendered on the current page.

**Site URL** — [lib/site.ts](lib/site.ts) exports `SITE_URL`, the single source of truth for the production domain, resolved at build time from `NEXT_PUBLIC_SITE_URL` (optional override) → `VERCEL_PROJECT_PRODUCTION_URL` (Vercel system env) → `http://localhost:3000`. Imported by `metadataBase` in `app/layout.tsx`, `sitemap.ts`, `robots.ts`, `lib/ics.ts` and every JSON-LD/OG builder. Never hardcode the URL elsewhere (the only other place is the Decap `config.yml`, which can't read env vars).

**Path alias** — `@/*` resolves to the project root (`tsconfig.json`).

## Working rules

- Prefer minimal diffs; do not rewrite entire files unless unavoidable.
- Preserve existing visual behavior unless the task explicitly asks for redesign.
- Before editing, identify the files likely involved.
- For non-trivial changes, propose a short plan first.
- After editing, name the changed files and verification run.
- If a command fails, report the exact command and likely cause.
- Do not invent env vars, API routes, or data contracts not already in the codebase.
- Do not modify `.env*`, generated build output, or lockfiles without explicit reason.

## Vercel rules

- No `vercel.json` — rely on Next.js framework conventions.
- Preview and Production are separate environments; env var changes require a new deployment.
- Do not hardcode secrets or deployment URLs — [lib/site.ts](lib/site.ts) (`SITE_URL`) is the only code path for the production URL; everything else imports it.
- Env vars: `NEXT_PUBLIC_WEB3FORMS_KEY` (Production/Preview/Development, public by design), `OAUTH_CLIENT_ID` + `OAUTH_CLIENT_SECRET` (Production), optional `NEXT_PUBLIC_SITE_URL`. See [.env.example](.env.example).
- If local and Vercel builds diverge, compare Node version, env vars, and build command.

## Git rules

- Run `git status` before large changes.
- Do not mix unrelated changes in one commit.
- Never force-push or delete branches without explicit request.
