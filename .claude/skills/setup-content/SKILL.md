---
name: setup-content
description: Sostituisce i contenuti segnaposto del template (nome artista, bio, email, social, sezioni section1..N, opere, esposizioni, hero, icone, colori) con quelli dell'artista. Usala nella fase 2 di /setup o quando l'utente vuole personalizzare il portfolio partendo dal template.
---

# Identità e contenuti

Tutto qui sono modifiche a file del progetto: **le fai tu**. L'utente fornisce testi, immagini
(percorsi su disco) e scelte. Se un dato manca, lascia il segnaposto e segnalalo nel riepilogo:
i contenuti si possono completare dopo anche dal CMS (`/admin`).

Prima di iniziare, leggi `CLAUDE.md` (sezioni Content, Section system, Gallery config).

## 1. Identità

| File | Campi |
|---|---|
| `data/general.json` | `siteTitle` (tab del browser, anteprime social), `artistName` (nav, footer, metadati, JSON-LD, file .ics), `description` (SEO), `defaultTheme` (`dark`/`light`) |
| `data/homepage.json` | `hero.name`, `hero.subtitle` (anche sottotitolo dell'immagine social), `exhibitionsCta.*` |
| `data/bio.json` | `bio` (paragrafi separati da riga vuota, `_corsivo_`), `email` (link mostrato sotto il form), `social.instagram` / `social.facebook` (stringa vuota = link nascosto; non rimuovere la chiave, il tipo TS la richiede), `aboutSections` (biografia / mostre / premi on-off) |

Social diversi da Instagram/Facebook richiedono codice: `components/About.tsx` (icona + voce
in `socialLinks`) e `public/admin/config.yml` (campo in "Bio e contatti").

## 2. Sezioni del portfolio (gallerie)

Il template ha `public/assets/galleries/section1`, `section2`, `section3`. Per ogni sezione dell'artista:

1. **Slug** = nome cartella = URL `/gallerie/{slug}`: solo `[a-z0-9-]` (es. `pittura`, `opere-su-carta`).
   Rinomina con `git mv public/assets/galleries/section1 public/assets/galleries/pittura`.
2. In `gallery.json`: `nome` = slug; nei `file` sostituisci il vecchio segmento cartella.
3. In `gallery-config.json`: `nome` = slug, `title`, `subtitle`, `order` (10, 20, 30…),
   `layout` (`masonry` = proporzioni originali, consigliato per pittura/disegno; `grid-3` / `grid-2`
   = celle 4:3 ritagliate, adatto alla fotografia), `enabled` + `limitItems` (anteprima in homepage).
4. Sezioni in più: crea la cartella con i due JSON (`"type": "opere"` / `"type": "config"`
   obbligatori, altrimenti non compaiono nel CMS). Sezioni in meno: elimina la cartella (chiedi conferma).

La navigazione si aggiorna da sola (`components/Nav.tsx` legge le gallerie pubbliche).

### Opere

- Se l'utente ti dà cartelle di immagini: copiale nella galleria con nomi
  `NN_titolo-kebab.jpg` e scrivi le voci in `gallery.json`
  (`file` = `/assets/galleries/{slug}/{nome}`, `alt` obbligatorio, `size` es. `80x60`, `medium`, `featured`).
  Chiedi titoli/tecniche/dimensioni o ricavali dai nomi file e falli confermare.
- Altrimenti rimuovi le opere stock e lascia che l'utente le carichi dal CMS. Attenzione: una galleria
  **senza opere non viene mostrata**; finché è vuota non comparirà nemmeno nella nav.
- Immagini grandi: ok fino a qualche MB; le miniature si generano al build (`scripts/generate-thumbs.mjs`).

## 3. Altri contenuti di esempio

Chiedi se tenerli come base da modificare o eliminarli. Cartelle di esempio:

- `public/assets/exhibitions/2025-05-lorem-ipsum-dolor`, `public/assets/exhibitions/2027-04-15-consectetur-adipiscing`
- `public/assets/articles/01_lorem-ipsum`
- `public/assets/mostre/*` (3 voci), `public/assets/premi/*` (1 voce)

Una sezione homepage vuota va nascosta in `data/homepage.json` → `sectionVisibility`
(es. `articles: false` se non ci sono articoli). Le sezioni mostre/premi della biografia si
spengono da `data/bio.json` → `aboutSections`.

## 4. Hero

Immagini in `public/assets/hero/desktop/` (orizzontali) e `public/assets/hero/mobile/` (verticali),
elencate in `data/homepage.json` → `hero.desktop` / `hero.mobile` (path `/assets/hero/...`, l'ordine
dell'array è l'ordine del carosello). Sostituisci le 3 immagini stock del template.

## 5. Icone e logo

- `app/icon.svg` (favicon) e `public/admin/logo.svg` (logo nel CMS). Se l'utente ha un logo SVG
  usalo; altrimenti proponi un monogramma semplice con le iniziali. **Rimuovi il commento
  `template-default-icon`** (lo usa `check-setup` per capire se l'icona è ancora quella del template).
- Rigenera le PNG dall'SVG:
  ```bash
  node -e "const s=require('sharp');(async()=>{await s('app/icon.svg').resize(180,180).png().toFile('app/apple-icon.png');for(const n of [192,512])await s('app/icon.svg').resize(n,n).png().toFile('public/android-chrome-'+n+'x'+n+'.png')})()"
  ```

## 6. Aspetto (opzionale)

- Colori: token in `app/globals.css` (chiaro in `@theme`, scuro in `.dark`). Gli stessi valori
  sono replicati in `public/admin/preview.css`, negli `opengraph-image.tsx` (hex) e in
  `public/site.webmanifest` (`theme_color`): aggiornali insieme.
- Font: `app/layout.tsx` (Cormorant Garamond + Inter via `next/font/google`).
- Testi dell'interfaccia (Biografia, Contatti, Esposizioni, "Richiedi informazioni"…) sono in
  italiano nei componenti; se serve un'altra lingua elencali all'utente prima di toccarli.

## Verifica

```bash
npm run check-setup   # la sezione "Contenuti" non deve avere ✗
npm run lint && npm run build
```

Se possibile avvia il sito (`npm run dev`) e mostra homepage e una pagina galleria all'utente.
Poi committa (`git commit -m "Contenuti iniziali"`) e, previa conferma, pusha.
