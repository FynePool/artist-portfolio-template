# Artist Portfolio Template

Template per il sito portfolio di un artista: gallerie di opere, esposizioni, biografia, form di contatto e un pannello di amministrazione (`/admin`) per gestire i contenuti **senza toccare codice**.

Contenuti di esempio inclusi (testi lorem ipsum, immagini stock, gallerie `section1`, `section2`, `section3`): servono a vedere subito tutte le funzionalità e vanno sostituiti con quelli dell'artista.

**Funzionalità**

- Hero full-screen con carosello e immagini separate per desktop e mobile
- Gallerie auto-rilevate da cartelle, ognuna con pagina dedicata (`/gallerie/{nome}`), filtro per tecnica, slideshow fullscreen e impaginazione configurabile (masonry o griglia)
- Lightbox con zoom (pinch, doppio tap, rotella) e pulsante "Richiedi informazioni su quest'opera" che precompila il form contatti
- Sezione "In evidenza" con le opere selezionate
- Pagina Esposizioni con badge automatico "In corso" / "Dal …" e link "Aggiungi al calendario" (.ics) per le mostre future
- Biografia con timeline di mostre e premi
- Form contatti via [Web3Forms](https://web3forms.com) (nessun backend)
- CMS [Decap](https://decapcms.org) con login GitHub e flusso editoriale (bozza → revisione → pubblicazione)
- SEO: sitemap, robots, immagini Open Graph generate automaticamente, markup schema.org (JSON-LD)
- Tema chiaro/scuro con default configurabile, Vercel Analytics e Speed Insights

**Stack:** Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · Framer Motion · Decap CMS · Vercel

---

## Avvio rapido (con Claude Code)

1. Crea la tua repo da questo template: pulsante **Use this template** → **Create a new repository** (privata consigliata).
2. Clona la nuova repo e installa le dipendenze:
   ```bash
   git clone https://github.com/TUO-ACCOUNT/TUA-REPO.git
   cd TUA-REPO
   npm install
   ```
3. Apri la cartella in [Claude Code](https://claude.com/claude-code) ed esegui:
   ```
   /setup
   ```

La skill `/setup` controlla quali strumenti hai a disposizione (GitHub CLI, Vercel CLI o connettore Vercel, browser, connettore Gmail), verifica lo stato del progetto con `npm run check-setup` e ti accompagna fase per fase. Per ogni passaggio propone di farlo direttamente oppure ti dà le istruzioni passo passo; le azioni esterne (creare repo, deploy, variabili, inviti) partono solo dopo la tua conferma.

| Fase | Skill | Cosa fa | Chi lo fa |
|---|---|---|---|
| 1. Repo | `/setup-repo` | Crea/collega la repo GitHub, imposta `backend.repo` del CMS | Claude (con `gh`) o tu |
| 2. Contenuti | `/setup-content` | Nome artista, bio, email, social, sezioni (rinomina `section1..N`), opere, hero, icone, colori | Claude, con i tuoi testi e immagini |
| 3. Form contatti | `/setup-contact-form` | Chiave Web3Forms → `NEXT_PUBLIC_WEB3FORMS_KEY` | Tu richiedi la chiave; Claude può recuperarla da Gmail e impostarla |
| 4. Deploy | `/setup-vercel` | Progetto Vercel collegato a GitHub, variabili, primo deploy, URL | Claude (CLI o connettore Vercel) o tu da dashboard |
| 5. CMS | `/setup-cms` | GitHub OAuth App, `OAUTH_CLIENT_ID` / `OAUTH_CLIENT_SECRET`, `config.yml`, accesso per chi gestisce i contenuti | Misto: il client secret lo inserisci **solo tu** |
| 6. Dominio | `/setup-domain` | Dominio personalizzato e riallineamento di CMS e OAuth | Opzionale |

Puoi lanciare le singole skill anche separatamente, ad esempio `/setup-content` per aggiornare i contenuti in un secondo momento.

---

<details>
<summary><strong>Setup manuale (senza Claude Code)</strong></summary>

<br>

Stato del setup in qualunque momento:

```bash
npm run check-setup
```

1. **Repo** — crea la repo da "Use this template", clonala, `npm install`. In `public/admin/config.yml` imposta `backend.repo: TUO-ACCOUNT/TUA-REPO`.
2. **Contenuti** — modifica `data/general.json` (`siteTitle`, `artistName`, `description`, `defaultTheme`), `data/bio.json` (bio, email, social), `data/homepage.json` (hero, sezioni). Rinomina le cartelle `public/assets/galleries/section1..3` con il nome delle tue sezioni (solo `a-z`, `0-9`, `-`) e aggiorna `nome` e i percorsi `file` nei due JSON di ogni galleria. Sostituisci immagini hero, opere, esposizioni, `app/icon.svg` e `public/admin/logo.svg` (rimuovi il commento `template-default-icon`). Tutti i contenuti si possono anche cambiare dopo dal CMS.
3. **Vercel** — su [vercel.com/new](https://vercel.com/new) importa la repo e fai Deploy (zero configurazione). Annota l'URL di produzione (es. `https://nome.vercel.app`).
4. **Form contatti (opzionale)** — su [web3forms.com](https://web3forms.com) crea una access key con l'email che deve ricevere i messaggi; su Vercel → Settings → Environment Variables aggiungi `NEXT_PUBLIC_WEB3FORMS_KEY` (Production, Preview, Development).
5. **CMS**
   1. In `public/admin/config.yml` imposta `backend.base_url` e `site_url` all'URL di produzione (senza `/` finale).
   2. Crea una GitHub OAuth App su [github.com/settings/applications/new](https://github.com/settings/applications/new): Homepage URL = URL del sito, Authorization callback URL = `URL-del-sito/api/auth`. Genera un client secret.
   3. Su Vercel (ambiente Production) aggiungi `OAUTH_CLIENT_ID` e `OAUTH_CLIENT_SECRET`.
   4. Commit + push → al termine del deploy apri `/admin` e fai "Login with GitHub".
   5. Chi gestisce i contenuti deve avere un account GitHub con permesso **Write** sulla repo (Settings → Collaborators).
6. **Dominio (opzionale)** — Vercel → Settings → Domains. Poi aggiorna `base_url`/`site_url` in `config.yml` e gli URL della GitHub OAuth App.

</details>

<details>
<summary><strong>Variabili d'ambiente</strong></summary>

<br>

Modello in [`.env.example`](.env.example). Su Vercel: Settings → Environment Variables; ogni modifica richiede un nuovo deploy.

| Variabile | Ambienti | Note |
|---|---|---|
| `NEXT_PUBLIC_WEB3FORMS_KEY` | Production, Preview, Development | Chiave Web3Forms per il form contatti. Pubblica by design (finisce nel bundle client). Se assente, il form è sostituito dal link email. |
| `OAUTH_CLIENT_ID` | Production | Client ID della GitHub OAuth App per il login a `/admin`. |
| `OAUTH_CLIENT_SECRET` | Production | Client secret della GitHub OAuth App. **Segreto**: mai in git, mai in chat. |
| `NEXT_PUBLIC_SITE_URL` | Production (opzionale) | URL canonico. Di norma non serve: su Vercel si usa in automatico il dominio di produzione (`VERCEL_PROJECT_PRODUCTION_URL`). |

</details>

---

<details>
<summary><strong>Guida all'utilizzo (CMS)</strong></summary>

<br>

Questa guida è rivolta a chi gestisce i contenuti tramite il pannello di amministrazione web, **senza toccare file, JSON o Git**.

### Accesso

1. Vai su `/admin` del sito (es. `https://nome-artista.vercel.app/admin`), oppure usa il link "Area amministrativa" nel footer.
2. Clicca **"Login with GitHub"** e autorizza con il tuo account GitHub.
3. Funziona solo se il tuo account ha permesso **Write** sulla repository.

### Flusso di lavoro

Il CMS usa la modalità **Editorial Workflow**: le modifiche non vanno online al salvataggio, ma passano per tre fasi visibili nella scheda **Workflow**:

1. **Draft** — bozza salvata, non ancora pubblicata.
2. **In Review** — in revisione (opzionale).
3. **Ready** — pronta per la pubblicazione.

Quando una modifica è in stato Ready, clicca **Publish**: viene salvata su GitHub e parte il deploy su Vercel. Il sito si aggiorna in circa un minuto.

Puoi accumulare più modifiche e pubblicarle insieme. Le bozze sono salvate su GitHub: le ritrovi nella scheda Workflow anche da un altro browser.

> ⚠️ Se chiudi la scheda **senza aver cliccato Save**, le modifiche non salvate vanno perse.

### Sezioni del pannello

#### Generali → Impostazioni generali

Titolo del sito, nome dell'artista (barra di navigazione, footer, metadati), descrizione per motori di ricerca e anteprime social, tema predefinito (chiaro/scuro).

#### Generali → Bio e contatti

- **Biografia:** separa i paragrafi con una riga vuota; `_testo_` diventa corsivo.
- **Email:** indirizzo mostrato sotto il form di contatto. Non cambia la destinazione dei messaggi del form (legata alla chiave Web3Forms).
- **Social:** link Instagram e Facebook (lasciare vuoto per nascondere).
- **Sezioni biografia:** attiva/disattiva testo biografico, "Mostre e partecipazioni" e "Premi".

#### Generali → Homepage

- **Hero:** nome e sottotitolo; immagini desktop (orizzontali) e mobile (verticali). Due o più immagini → carosello automatico. Se le mobile mancano si usano le desktop.
- **Sezioni visibili:** attiva o disattiva gallerie, articoli, biografia, CTA esposizioni, contatti, opere in evidenza.
- **Ordine sezioni:** trascina per cambiare l'ordine in homepage.
- **CTA Esposizioni:** titolo, descrizione e testo del bottone del banner che porta alla pagina Esposizioni.

#### Mostre e partecipazioni / Premi

Voci delle due timeline nella biografia: anno + descrizione. Ordinate automaticamente per anno decrescente.

#### Articoli

Blocchi editoriali con immagine (o carosello) e testo nella sezione Articoli della homepage. Il campo **Ordine** decide la posizione (numero più basso = prima). Due o più immagini → carosello.

#### Esposizioni

Come gli articoli, con in più:

- **Data inizio** (`2024`, `2024-05` o `2024-05-15`) per ordinare dalla più recente; **Data fine** opzionale.
- In base alle date il sito mostra da solo il badge **"In corso fino al …"** o **"Dal …"** (mostre future), e per le mostre future il link **"Aggiungi al calendario"**. Lo stato si aggiorna a ogni pubblicazione.
- **Mostra in homepage:** l'esposizione compare anche nel banner Esposizioni della homepage (più esposizioni → carosello).

#### Gallerie — Opere

Ogni galleria è una sezione del portfolio con la sua pagina dedicata (`/gallerie/{nome}`).

- **Aggiungere un'opera:** apri la galleria → **Opere** → **+** → carica l'immagine, scrivi la descrizione (obbligatoria, serve all'accessibilità) e, se vuoi, dimensioni (es. `80x60`) e tecnica → Save.
- **Riordinare:** trascina le voci; l'ordine del pannello è l'ordine sul sito.
- **In evidenza (homepage):** le opere spuntate alimentano la sezione "In evidenza".
- **Tecnica:** alimenta il filtro per tecnica nella pagina dedicata (compare con almeno 2 tecniche diverse). Scrivi la stessa tecnica sempre allo stesso modo.
- **Nuova galleria:** "Gallerie — Opere" → **New Galleria** → **Nome cartella** (solo minuscole, numeri e trattini, es. `scultura`: diventa l'indirizzo `/gallerie/scultura`) → aggiungi le opere → Save. Una galleria senza opere non viene mostrata.

> Non cambiare il **Nome cartella** dopo la creazione: è l'indirizzo della pagina. Per cambiare il nome visibile usa il **Titolo** nella configurazione.

#### Gallerie — Configurazione

Una voce per galleria, con lo **stesso "Nome cartella"** della scheda Opere (se è diverso la configurazione viene ignorata — nel dubbio copia e incolla):

- **Titolo / Sottotitolo:** nome visibile (cambiarlo non cambia l'indirizzo).
- **Ordine:** posizione in homepage (numeri crescenti, es. 10, 20, 30).
- **Visibilità:** *Pubblica* (homepage + pagina), *Solo pagina diretta* (fuori dalla homepage ma raggiungibile via link), *Bozza* (nascosta ovunque, pagina 404).
- **Impaginazione:** *Masonry* (proporzioni originali, ideale per dipinti e disegni) o *Griglia* 3/2 colonne (riquadri 4:3 ritagliati, ideale per fotografie).
- **Anteprima limitata in homepage** + **Numero opere mostrate:** se attiva, in homepage compaiono solo le prime N opere seguite dal link "Vedi tutte le opere".
- **Descrizione:** testo libero opzionale.

Nella pagina dedicata di ogni galleria c'è anche il pulsante **"Avvia slideshow"**: proiezione a schermo intero (spazio = pausa, frecce = cambia opera, Esc = esci), utile per fiere e studio visit.

</details>

<details>
<summary><strong>Guida all'utilizzo (file system)</strong></summary>

<br>

Per chi aggiorna i contenuti direttamente nei file (operazioni in blocco, accesso alla repo).

```
data/
  general.json        ← titolo, nome artista, descrizione, tema predefinito
  bio.json            ← biografia, email, social, sottosezioni della biografia
  homepage.json       ← hero, sezioni visibili e ordine, banner esposizioni

public/assets/
  hero/desktop/       ← immagini hero orizzontali
  hero/mobile/        ← immagini hero verticali
  galleries/{nome}/   ← una cartella per galleria: immagini + gallery.json + gallery-config.json
  articles/{slug}/    ← article.json + immagini
  exhibitions/{data}-{slug}/  ← article.json + immagini
  mostre/{anno}-{slug}/entry.json
  premi/{anno}-{slug}/entry.json
  uploads/            ← immagini caricate dal CMS (hero e media generici)
```

**Gallerie.** Il nome della cartella è l'indirizzo della pagina (`/gallerie/{nome}`, solo `a-z0-9-`).

`gallery.json` — elenco delle opere (l'ordine è quello del sito):

```json
{
  "type": "opere",
  "nome": "section1",
  "items": [
    { "file": "/assets/galleries/section1/01_lorem-ipsum.jpg", "alt": "Lorem ipsum", "size": "60x80", "medium": "Tecnica A", "featured": true }
  ]
}
```

`gallery-config.json` — impostazioni della galleria (tutti i campi tranne `type`/`nome` sono opzionali):

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

| Campo | Default | Note |
|---|---|---|
| `title` / `subtitle` | nome cartella leggibile / — | nome visibile |
| `order` | in fondo | ordine in homepage (crescente) |
| `visibility` | `public` | `public` · `unlisted` (fuori dalla home, pagina attiva) · `draft` (nascosta, 404) |
| `layout` | `masonry` | `masonry` · `grid-3` · `grid-2` |
| `enabled` / `limitItems` | `false` / `6` | anteprima limitata in homepage |
| `description` | — | testo libero |

`type` (`"opere"` / `"config"`) serve al CMS per distinguere le due schede: un file senza `type` corretto non compare nel pannello, ma il sito lo mostra comunque.

**Articoli ed esposizioni** — `article.json`:

```json
{
  "date": "2027-04-15",
  "dateEnd": "2027-05-30",
  "title": "Titolo",
  "subtitle": "Aprile 2027 · Luogo · Città",
  "description": "Testo.",
  "imagePosition": "left",
  "showInHomepage": true,
  "images": ["01_foto.jpg"],
  "link": { "text": "Scopri di più", "url": "https://example.com", "newTab": true }
}
```

`date`/`dateEnd`/`showInHomepage` valgono per le esposizioni; gli articoli usano `order` (numero) per l'ordinamento.

**Mostre e premi** — `entry.json`: `{ "anno": "2024", "description": "Titolo, Luogo, Città" }`.

**Homepage** — in `data/homepage.json`, `sectionVisibility` decide *se* una sezione appare (deve essere `true`), `sectionOrder` *in che ordine*. Chiavi: `featured`, `galleries`, `articles`, `about`, `exhibitions-cta`, `contact`.

</details>

<details>
<summary><strong>Sviluppo in locale</strong></summary>

<br>

```bash
npm install
npm run dev          # http://localhost:3000
npm run lint
npm run build        # genera anche miniature e blur delle immagini (prebuild)
npm run check-setup  # stato della personalizzazione del template
```

Il CMS (`/admin`) funziona solo sul dominio di produzione (login GitHub con callback unico).

</details>

<details>
<summary><strong>Struttura del progetto</strong></summary>

<br>

```
app/
  layout.tsx                  # layout root, font, analytics, JSON-LD Person
  page.tsx                    # homepage: assembla le sezioni secondo data/homepage.json
  api/auth/route.ts           # OAuth GitHub per il CMS
  exhibitions/                # pagina /exhibitions, OG image, export .ics
  gallerie/[id]/              # pagina dedicata per galleria, OG image
  sitemap.ts, robots.ts, opengraph-image.tsx
  globals.css                 # token colore (chiaro/scuro) e stili globali

components/
  Nav.tsx / NavClient.tsx     # navigazione: link generati dalle gallerie + client per scroll e menu mobile
  Hero.tsx, Gallery.tsx, Lightbox.tsx, Slideshow.tsx, MediumFilter.tsx, FeaturedWorks.tsx
  Article.tsx, ExhibitionsCta.tsx, ExhibitionsCarousel.tsx, About.tsx, Contact.tsx, Footer.tsx

lib/
  data.ts                     # lettura file system: hero, gallerie, articoli, esposizioni, mostre, premi
  site.ts                     # URL del sito (env → dominio di produzione Vercel → localhost)
  exhibitionStatus.ts, ics.ts, jsonld.ts, ogAssets.ts, mediums.ts, contactPrefill.ts, theme.tsx

public/admin/                 # Decap CMS: index.html, config.yml, anteprime, logo
scripts/
  generate-thumbs.mjs         # miniature e blur placeholder (prebuild)
  check-setup.mjs             # stato del setup del template
.claude/skills/               # skill di setup per Claude Code (/setup e fasi)
```

</details>

---

Immagini di esempio: fotografie da [Unsplash](https://unsplash.com) tramite [Lorem Picsum](https://picsum.photos), usate come segnaposto.
