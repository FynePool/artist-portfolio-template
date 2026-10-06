# Artist Portfolio Template

A template for an artist's portfolio website: artwork galleries, exhibitions, biography, a contact form and an admin panel (`/admin`) to manage the content **without touching code**.

Sample content is included (lorem ipsum texts, stock images, galleries `section1`, `section2`, `section3`) so you can see every feature right away; replace it with the artist's own.

> **Language:** the website's interface and the admin panel are currently in Italian. Texts written by the artist (bio, titles, descriptions) can be in any language.

**Features**

- Full-screen hero with carousel and separate images for desktop and mobile
- Galleries auto-discovered from folders, each with its own page (`/gallerie/{name}`), filter by medium, full-screen slideshow and configurable layout (masonry or grid)
- Lightbox with zoom (pinch, double tap, mouse wheel) and a "request information about this artwork" button that prefills the contact form
- "Featured" section with selected artworks
- Exhibitions page with automatic "ongoing" / "from …" badges and an "add to calendar" (.ics) link for upcoming shows
- Biography with a timeline of exhibitions and awards
- Contact form via [Web3Forms](https://web3forms.com) (no backend)
- [Decap CMS](https://decapcms.org) with GitHub login and editorial workflow (draft → review → publish)
- SEO: sitemap, robots, automatically generated Open Graph images, schema.org markup (JSON-LD)
- Light/dark theme with configurable default, Vercel Analytics and Speed Insights

**Stack:** Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · Framer Motion · Decap CMS · Vercel

---

## Quick start (with Claude)

### Option A — the **Artist Portfolio** plugin (recommended)

The plugin is available in [Claude's plugin directory](https://claude.ai/directory) and builds everything from scratch: it checks the prerequisites, creates your **private** repository from the template, creates the Vercel project with the name you choose (`name.vercel.app`) and puts the site online. Then it tells you how to continue with `/setup` inside the repository.

**Install from the directory (no marketplace to add):**

1. On claude.ai or in the desktop app, open **Customize → Plugins → Discover**, search for **Artist Portfolio** and add it. In Claude Code you can also browse the directory with `/plugin directory`.
2. The plugin works in chat, in Cowork and in Claude Code, where it is synced from your account (`artist-portfolio@synced`). Updates arrive automatically.
3. Start it by typing `/artist-portfolio:setup`, or by asking Claude to create a new artist portfolio.

**Alternatively, from this repository in Claude Code** (terminal or desktop app):

```
/plugin install artist-portfolio --marketplace FynePool/artist-portfolio-template
/artist-portfolio:setup
```

After the kickoff, the full setup still requires Claude Code (on your computer or in the cloud). The plugin replies in your language; the generated site and the setup inside the repository are currently in Italian.

### Option B — manual template

1. **Use this template** → **Create a new repository** → **Private**, in your personal account.
2. Open the new repository in Claude Code and run `/setup`:
   - **on your computer**: `git clone https://github.com/YOUR-ACCOUNT/YOUR-REPO.git`, then open the folder in Claude Code;
   - **in the cloud**: install the [Claude GitHub App](https://github.com/apps/claude) on the repository and start a session at [claude.ai/code](https://claude.ai/code) (Pro, Max or Team plans). In the cloud Claude uses the Vercel connector instead of the CLI; artwork images are uploaded from the CMS and browser steps are done by you.

### Before you start: Vercel Hobby plan

The free Hobby plan is fine for a portfolio, with three constraints the setup will ask you to confirm:

- **Non-commercial use**: the site can be a showcase of the artworks; to advertise or handle their sale (prices, "buy", payments) Vercel requires the Pro plan ([guidelines](https://vercel.com/docs/limits/fair-use-guidelines#commercial-usage)). The choice is yours.
- **A single account edits the site**: with a private repository, Vercel Hobby only deploys changes made by the account owner. GitHub, Vercel and the CMS login must belong to the same person; if someone else's account manages the content, you need the Pro plan or a public repository.
- **Repository in a personal account**: Hobby does not deploy private repositories owned by GitHub organizations.

The `/setup` skill checks which tools are available (GitHub CLI, Vercel CLI or Vercel connector, browser, Gmail connector) and walks you through **every** step, in order, keeping a log in `setup-progress.md`: a step is marked as done only after it has been verified, and optional steps are skipped only on your explicit "no". If you stop, the next `/setup` resumes from the first open step. External actions (creating repositories, deploying, setting variables, sending invites, submitting forms) only happen after you confirm them.

| Phase | Skill | What it covers |
|---|---|---|
| 0. Prerequisites | `/setup` | Accounts, tools, gathering information |
| 1. Repository | `/setup-repo` | Private GitHub repository, CMS `backend.repo`, removal of the plugin files |
| 2. Content | `/setup-content` | Name, bio, sections (replacing `section1..N`), artworks, samples, hero, icons, colors |
| 3. Deploy | `/setup-vercel` | Vercel project linked to GitHub, first deployment, production URL |
| 4. CMS | `/setup-cms` | GitHub OAuth App, OAuth variables, `/admin` login, access for whoever manages the content |
| 5. Contact form (optional) | `/setup-contact-form` | Web3Forms key, variable, test message |
| 6. Domain (optional) | `/setup-domain` | Custom domain and realignment of CMS and OAuth |
| 7. Analytics (optional) | `/setup` | Vercel Web Analytics and Speed Insights |
| 8. Wrap-up | `/setup` | Final check and summary |

<details>
<summary><strong>Every setup step: who does what</strong></summary>

<br>

**Auto** = done by Claude (with your confirmation for external actions) · **Manual** = done by you · **Mixed** = Claude prepares or verifies, you complete it. Where an alternative is given ("Manual if…"), it depends on the available tools.

| # | Step | Who |
|---|---|---|
| 0.1 | Repository open in a Claude Code session (computer or cloud) | Manual |
| 0.2 | `npm install` | Auto |
| 0.3 | Owner's personal GitHub account (the same used for the CMS) | Manual |
| 0.4 | Vercel account linked to the same GitHub account; Hobby constraints confirmed | Manual |
| 0.5 | GitHub CLI login (`gh auth login`) or choice of the manual path | Manual |
| 0.6 | Up-to-date Vercel CLI (Auto) and `vercel login` or connector authorization (Manual) | Mixed |
| 0.7 | Answers to the initial questions (name, sections, email, content manager, domain) | Manual |
| 1.1 | Creation of your own GitHub repository | Auto (Manual without the GitHub CLI) |
| 1.2 | `backend.repo` in the CMS, commit and push | Auto |
| 1.3 | Removal of the plugin files from the repository | Auto |
| 2.1 | Identity: name, title, description, theme | Auto (texts provided by you) |
| 2.2 | Hero: name, subtitle, images | Auto (images provided by you) |
| 2.3 | Biography, email, social links | Auto (texts provided by you) |
| 2.4 | Sections replacing `section1..N` | Auto |
| 2.5 | Artworks in the galleries | Auto with your files, or Manual from the CMS |
| 2.6 | Sample exhibitions, articles, shows, awards | Auto |
| 2.7 | Icon and logo | Auto |
| 2.8 | Colors and fonts | Auto |
| 2.9 | Build, local preview (approved by you), commit and push | Mixed |
| 3.1 | Vercel project linked to the repository | Auto (Manual from the dashboard, or to authorize Vercel's GitHub app) |
| 3.2 | First deployment | Auto |
| 3.3 | Production URL | Auto |
| 3.4 | Site online check | Auto |
| 4.1 | Production URL in the CMS `config.yml` | Auto |
| 4.2 | Creation of the GitHub OAuth App | Mixed (Claude fills in the fields in the browser, you register it) |
| 4.3 | Client secret generation | **Always manual** |
| 4.4 | `OAUTH_CLIENT_ID` on Vercel | Auto |
| 4.5 | `OAUTH_CLIENT_SECRET` on Vercel | **Always manual** (the secret never goes through Claude) |
| 4.6 | Commit, push, new deployment | Auto |
| 4.7 | Technical check of `/api/auth` and the published `config.yml` | Auto |
| 4.8 | First login to `/admin` | Manual |
| 4.9 | Access for whoever manages the content (the owner, or a collaborator only with Pro or a public repository) | Auto |
| 4.10 | Invitation accepted and content manager's first login | Manual (content manager) |
| 5.1 | Decision: contact form yes/no | Manual |
| 5.2 | Web3Forms access key request | Mixed (Claude fills in the form in the browser after your confirmation) |
| 5.3 | Retrieving the key from the email | Auto with the Gmail connector, otherwise Manual |
| 5.4 | `NEXT_PUBLIC_WEB3FORMS_KEY` on Vercel and in `.env.local` | Auto |
| 5.5 | New deployment and check that the form is active | Auto |
| 5.6 | Test message sent and received | Mixed |
| 6.1 | Decision: custom domain yes/no | Manual |
| 6.2 | Domain purchase | Manual |
| 6.3 | Domain added to the Vercel project | Auto |
| 6.4 | DNS records at the registrar | Manual (verified Auto) |
| 6.5 | `config.yml` on the new domain | Auto |
| 6.6 | GitHub OAuth App URLs updated | Mixed |
| 6.7 | Check and login on the new domain | Mixed |
| 7.1 | Enable Analytics and Speed Insights | Manual (Vercel dashboard) |
| 8.1 | Final `check-setup` | Auto |
| 8.2 | Final summary | Auto |

</details>

You can also run each skill on its own, for example `/setup-content` to update the content later.

---

<details>
<summary><strong>Manual setup (without Claude Code)</strong></summary>

<br>

Setup status at any time:

```bash
npm run check-setup
```

1. **Repository** — create the private repository with "Use this template" in your personal account, clone it, run `npm install`. In `public/admin/config.yml` set `backend.repo: YOUR-ACCOUNT/YOUR-REPO` and delete `plugin/` and `.claude-plugin/` (they are only used to distribute the plugin). Commit with your own GitHub account (see the Hobby constraints above).
2. **Content** — edit `data/general.json` (`siteTitle`, `artistName`, `description`, `defaultTheme`), `data/bio.json` (bio, email, social links), `data/homepage.json` (hero, sections). Rename the folders `public/assets/galleries/section1..3` after your sections (only `a-z`, `0-9`, `-`) and update `nome` and the `file` paths in each gallery's two JSON files. Replace hero images, artworks, exhibitions, `app/icon.svg` and `public/admin/logo.svg` (remove the `template-default-icon` comment). All content can also be changed later from the CMS.
3. **Vercel** — at [vercel.com/new](https://vercel.com/new) import the repository and deploy (zero configuration). Note the production URL (e.g. `https://name.vercel.app`).
4. **CMS**
   1. In `public/admin/config.yml` set `backend.base_url` and `site_url` to the production URL (without a trailing `/`).
   2. Create a GitHub OAuth App at [github.com/settings/applications/new](https://github.com/settings/applications/new): Homepage URL = site URL, Authorization callback URL = `site-URL/api/auth`. Generate a client secret.
   3. On Vercel (Production environment) add `OAUTH_CLIENT_ID` and `OAUTH_CLIENT_SECRET`.
   4. Commit + push → once deployed, open `/admin` and click "Login with GitHub".
   5. Whoever manages the content needs a GitHub account with **Write** permission on the repository (Settings → Collaborators).
5. **Contact form (optional)** — at [web3forms.com](https://web3forms.com) create an access key with the email that should receive the messages; on Vercel → Settings → Environment Variables add `NEXT_PUBLIC_WEB3FORMS_KEY` (Production, Preview, Development).
6. **Domain (optional)** — Vercel → Settings → Domains. Then update `base_url`/`site_url` in `config.yml` and the GitHub OAuth App URLs.

</details>

<details>
<summary><strong>Environment variables</strong></summary>

<br>

Template in [`.env.example`](.env.example). On Vercel: Settings → Environment Variables; every change requires a new deployment.

| Variable | Environments | Notes |
|---|---|---|
| `NEXT_PUBLIC_WEB3FORMS_KEY` | Production, Preview, Development | Web3Forms key for the contact form. Public by design (it ends up in the client bundle). If missing, the form is replaced by the email link. |
| `OAUTH_CLIENT_ID` | Production | Client ID of the GitHub OAuth App used to log in to `/admin`. |
| `OAUTH_CLIENT_SECRET` | Production | Client secret of the GitHub OAuth App. **Secret**: never in git, never in chat. |
| `NEXT_PUBLIC_SITE_URL` | Production (optional) | Canonical URL. Usually not needed: on Vercel the production domain (`VERCEL_PROJECT_PRODUCTION_URL`) is used automatically. |

</details>

---

<details>
<summary><strong>User guide (CMS)</strong></summary>

<br>

This guide is for whoever manages the content through the web admin panel, **without touching files, JSON or Git**. The panel is in Italian: labels are shown here as they appear, with a translation.

### Access

1. Go to `/admin` on the site (e.g. `https://artist-name.vercel.app/admin`), or use the "Area amministrativa" (admin area) link in the footer.
2. Click **"Login with GitHub"** and authorize with your GitHub account.
3. It only works if your account has **Write** permission on the repository.

### Workflow

The CMS uses the **Editorial Workflow** mode: changes don't go online when you save them; they move through three stages shown in the **Workflow** tab:

1. **Draft** — saved, not published yet.
2. **In Review** — under review (optional).
3. **Ready** — ready to publish.

When a change is Ready, click **Publish**: it is saved to GitHub and a Vercel deployment starts. The site updates in about a minute.

You can collect several changes and publish them together. Drafts are stored on GitHub: you'll find them in the Workflow tab even from another browser.

> ⚠️ If you close the tab **without clicking Save**, unsaved changes are lost.

### Panel sections

#### Generali → Impostazioni generali (General → General settings)

Site title, artist name (navigation bar, footer, metadata), description for search engines and social previews, default theme (light/dark).

#### Generali → Bio e contatti (General → Bio and contacts)

- **Biografia (biography):** separate paragraphs with an empty line; `_text_` becomes italic.
- **Email:** address shown under the contact form. It doesn't change where form messages are delivered (that depends on the Web3Forms key).
- **Social:** Instagram and Facebook links (leave empty to hide).
- **Sezioni biografia (biography sections):** turn the biography text, "Mostre e partecipazioni" (exhibitions and participations) and "Premi" (awards) on or off.

#### Generali → Homepage

- **Hero:** name and subtitle; desktop (landscape) and mobile (portrait) images. Two or more images → automatic carousel. If mobile images are missing, the desktop ones are used.
- **Sezioni visibili (visible sections):** turn galleries, articles, biography, exhibitions banner, contacts and featured artworks on or off.
- **Ordine sezioni (section order):** drag to change the order on the homepage.
- **CTA Esposizioni (exhibitions banner):** title, description and button text of the banner linking to the Exhibitions page.

#### Mostre e partecipazioni / Premi (Exhibitions and participations / Awards)

Entries of the two timelines in the biography: year + description. Automatically sorted by year, newest first.

#### Articoli (Articles)

Editorial blocks with an image (or carousel) and text in the homepage Articles section. The **Ordine** (order) field sets the position (lowest number first). Two or more images → carousel.

#### Esposizioni (Exhibitions)

Like articles, plus:

- **Data inizio** (start date: `2024`, `2024-05` or `2024-05-15`) to sort newest first; optional **Data fine** (end date).
- Based on the dates, the site automatically shows an **"In corso fino al …"** (ongoing until …) or **"Dal …"** (from …, upcoming shows) badge, and for upcoming shows an **"Aggiungi al calendario"** (add to calendar) link. The status updates at every publish.
- **Mostra in homepage (show on homepage):** the exhibition also appears in the homepage Exhibitions banner (several exhibitions → carousel).

#### Gallerie — Opere (Galleries — Artworks)

Each gallery is a section of the portfolio with its own page (`/gallerie/{name}`).

- **Add an artwork:** open the gallery → **Opere** → **+** → upload the image, write the description (required, used for accessibility) and, optionally, size (e.g. `80x60`) and medium → Save.
- **Reorder:** drag the entries; the order in the panel is the order on the site.
- **In evidenza (featured, homepage):** checked artworks feed the "Featured" section.
- **Tecnica (medium):** feeds the medium filter on the gallery page (shown with at least 2 different media). Always write the same medium the same way.
- **New gallery:** "Gallerie — Opere" → **New Galleria** → **Nome cartella** (folder name: lowercase letters, digits and hyphens only, e.g. `sculpture`: it becomes the address `/gallerie/sculpture`) → add the artworks → Save. A gallery without artworks is not shown.

> Don't change the **Nome cartella** after creating the gallery: it is the page address. To change the visible name, use the **Titolo** (title) in the configuration.

#### Gallerie — Configurazione (Galleries — Configuration)

One entry per gallery, with the **same "Nome cartella"** as in the Artworks tab (if it differs, the configuration is ignored — when in doubt, copy and paste):

- **Titolo / Sottotitolo (title / subtitle):** visible name (changing it doesn't change the address).
- **Ordine (order):** position on the homepage (ascending numbers, e.g. 10, 20, 30).
- **Visibilità (visibility):** *Pubblica* (public: homepage + page), *Solo pagina diretta* (direct page only: hidden from the homepage but reachable via link), *Bozza* (draft: hidden everywhere, page returns 404).
- **Impaginazione (layout):** *Masonry* (original proportions, ideal for paintings and drawings) or *Griglia* 3/2 columns (cropped 4:3 tiles, ideal for photography).
- **Anteprima limitata in homepage (limited homepage preview)** + **Numero opere mostrate (number of artworks shown):** when on, the homepage shows only the first N artworks followed by a "see all artworks" link.
- **Descrizione (description):** optional free text.

Each gallery page also has an **"Avvia slideshow"** (start slideshow) button: full-screen presentation (space = pause, arrows = change artwork, Esc = exit), handy for fairs and studio visits.

</details>

<details>
<summary><strong>User guide (file system)</strong></summary>

<br>

For whoever updates the content directly in the files (bulk operations, repository access).

```
data/
  general.json        ← title, artist name, description, default theme
  bio.json            ← biography, email, social links, biography sub-sections
  homepage.json       ← hero, visible sections and their order, exhibitions banner

public/assets/
  hero/desktop/       ← landscape hero images
  hero/mobile/        ← portrait hero images
  galleries/{name}/   ← one folder per gallery: images + gallery.json + gallery-config.json
  articles/{slug}/    ← article.json + images
  exhibitions/{date}-{slug}/  ← article.json + images
  mostre/{year}-{slug}/entry.json     ← exhibitions timeline
  premi/{year}-{slug}/entry.json      ← awards timeline
  uploads/            ← images uploaded from the CMS (hero and generic media)
```

**Galleries.** The folder name is the page address (`/gallerie/{name}`, only `a-z0-9-`).

`gallery.json` — list of artworks (order = order on the site):

```json
{
  "type": "opere",
  "nome": "section1",
  "items": [
    { "file": "/assets/galleries/section1/01_lorem-ipsum.jpg", "alt": "Lorem ipsum", "size": "60x80", "medium": "Tecnica A", "featured": true }
  ]
}
```

`gallery-config.json` — gallery settings (every field except `type`/`nome` is optional):

```json
{
  "type": "config",
  "nome": "section1",
  "title": "Section1",
  "subtitle": "Lorem ipsum dolor sit amet",
  "order": 10,
  "visibility": "public",
  "layout": "masonry",
  "enabled": true,
  "limitItems": 2
}
```

| Field | Default | Notes |
|---|---|---|
| `title` / `subtitle` | readable folder name / — | visible name |
| `order` | last | homepage order (ascending) |
| `visibility` | `public` | `public` · `unlisted` (hidden from the homepage, page active) · `draft` (hidden, 404) |
| `layout` | `masonry` | `masonry` · `grid-3` · `grid-2` |
| `enabled` / `limitItems` | `false` / `6` | limited homepage preview |
| `description` | — | free text |

`type` (`"opere"` / `"config"`) lets the CMS tell the two tabs apart: a file without the right `type` doesn't show up in the panel, but the site still displays it.

**Articles and exhibitions** — `article.json`:

```json
{
  "date": "2027-04-15",
  "dateEnd": "2027-05-30",
  "title": "Title",
  "subtitle": "April 2027 · Venue · City",
  "description": "Text.",
  "imagePosition": "left",
  "showInHomepage": true,
  "images": ["01_photo.jpg"],
  "link": { "text": "Learn more", "url": "https://example.com", "newTab": true }
}
```

`date`/`dateEnd`/`showInHomepage` apply to exhibitions; articles use `order` (a number) for sorting.

**Exhibitions timeline and awards** — `entry.json`: `{ "anno": "2024", "description": "Title, Venue, City" }` (`anno` = year).

**Homepage** — in `data/homepage.json`, `sectionVisibility` decides *whether* a section appears (it must be `true`), `sectionOrder` *in which order*. Keys: `featured`, `galleries`, `articles`, `about`, `exhibitions-cta`, `contact`.

</details>

<details>
<summary><strong>Local development</strong></summary>

<br>

```bash
npm install
npm run dev          # http://localhost:3000
npm run lint
npm run build        # also generates image thumbnails and blur placeholders (prebuild)
npm run check-setup  # template customization status
```

The CMS (`/admin`) only works on the production domain (GitHub login with a single callback URL).

</details>

<details>
<summary><strong>Project structure</strong></summary>

<br>

```
app/
  layout.tsx                  # root layout, fonts, analytics, JSON-LD Person
  page.tsx                    # homepage: assembles the sections according to data/homepage.json
  api/auth/route.ts           # GitHub OAuth for the CMS
  exhibitions/                # /exhibitions page, OG image, .ics export
  gallerie/[id]/              # per-gallery page, OG image
  sitemap.ts, robots.ts, opengraph-image.tsx
  globals.css                 # color tokens (light/dark) and global styles

components/
  Nav.tsx / NavClient.tsx     # navigation: links generated from the galleries + client for scroll and mobile menu
  Hero.tsx, Gallery.tsx, Lightbox.tsx, Slideshow.tsx, MediumFilter.tsx, FeaturedWorks.tsx
  Article.tsx, ExhibitionsCta.tsx, ExhibitionsCarousel.tsx, About.tsx, Contact.tsx, Footer.tsx

lib/
  data.ts                     # file system reads: hero, galleries, articles, exhibitions, timelines
  site.ts                     # site URL (env → Vercel production domain → localhost)
  exhibitionStatus.ts, ics.ts, jsonld.ts, ogAssets.ts, mediums.ts, contactPrefill.ts, theme.tsx

public/admin/                 # Decap CMS: index.html, config.yml, previews, logo
scripts/
  generate-thumbs.mjs         # thumbnails and blur placeholders (prebuild)
  check-setup.mjs             # template setup status
.claude/skills/               # Claude Code setup skills (/setup and phases)
.claude-plugin/marketplace.json # plugin marketplace (removed in artists' repositories)
plugin/                       # artist-portfolio plugin: kickoff skill /artist-portfolio:setup (removed in artists' repositories)
```

</details>

---

Released under the [MIT](LICENSE) license. Sample images: photos from [Unsplash](https://unsplash.com) via [Lorem Picsum](https://picsum.photos), used as placeholders.
