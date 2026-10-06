# Add or remove artwork

Gallery sections and images are auto-discovered from `public/assets/` — no code changes needed.

## Gallery sections

Folder name **is the URL slug**: a clean kebab string matching `^[a-z0-9-]+$` (lowercase, digits, hyphens — no underscores/spaces/uppercase). Folders not matching are skipped with a build warning.

- The folder name is `section.id` and the URL: `section1` → `/gallerie/section1`. Layout (masonry / grid) is **not** keyed on the folder name: it's the `layout` field in `gallery-config.json`.
- Title, subtitle, render order and visibility live in `gallery-config.json` (siblings of `gallery.json`), **not** in the folder name — so renaming the title never changes the URL. See the "Gallery config" section in CLAUDE.md / README.md for the field list.
- Renaming the **folder** changes the URL (rare, developer-only).

Example: folder `pittura` + `gallery-config.json` `{ "type": "config", "nome": "pittura", "title": "Pittura", "subtitle": "Olio e acrilico su tela", "order": 10, "layout": "masonry" }`.

A new gallery is normally created straight from the CMS ("Gallerie — Opere" → new entry); `npm run sync-cms` no longer exists. If you create the folder by hand instead, `gallery.json` needs `"type": "opere"` and `"nome": "{folder}"` (and `gallery-config.json` needs `"type": "config"`) — without the right `type` the entry is filtered out of the CMS sidebar, though the site still renders it. A gallery with zero works is skipped entirely by `getGalleries()`.

## Artwork files

Supported formats: `.jpg`, `.jpeg`, `.png`, `.webp`, `.avif`.

File name: `{index}_{alt-kebab}_{WxH}_{medium-kebab}.ext`

- `index` — display order within the section
- `alt` — image alt text (required)
- `WxH` — dimensions in cm, e.g. `80x60` (optional, detected by `/^\d+x\d+$/`)
- `medium` — last segment before extension (optional)

Hyphens `-` separate words within a segment; underscores `_` separate segments.

Examples:
```
01_ritratto-donna.jpg                          → alt: "Ritratto donna"
02_studio-mani_matita-su-carta.jpg             → alt: "Studio mani", medium: "Matita su carta"
03_figura-seduta_80x60_olio-su-tela.jpg        → alt: "Figura seduta", 80×60 cm, olio su tela
```

## Hero images

Hero images are listed in `data/homepage.json` → `hero.desktop` (landscape, ≥768 px) and `hero.mobile` (portrait, <768 px) as `/assets/...` paths; array order = carousel order. Files usually live in `public/assets/hero/desktop/` and `public/assets/hero/mobile/` (or `public/assets/uploads/` when uploaded from the CMS).

- Supported formats: `.jpg`, `.jpeg`, `.png`, `.webp`, `.avif`.
- Two or more images activate the auto-advancing carousel (5 s, dot navigation, swipe on mobile).
- If one list is empty, the other is used as fallback for both breakpoints.
- Filesystem fallback (no paths in `homepage.json`): files in `public/assets/hero/{desktop,mobile}/`, alphabetical order.
