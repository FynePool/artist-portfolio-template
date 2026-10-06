---
name: setup-content
description: Fase 2 di /setup (passaggi 2.1–2.9) — sostituisce i contenuti segnaposto del template (nome artista, bio, email, social, sezioni section1..N, opere, esposizioni, hero, icone, colori) con quelli dell'artista. Usala anche quando l'utente vuole personalizzare il portfolio partendo dal template.
---

# Fase 2 — Identità e contenuti

Tutto qui sono modifiche a file del progetto: **le fai tu** (AUTO). L'utente fornisce testi,
immagini (percorsi su disco o cartelle) e decisioni. Se un dato manca, **chiedilo**: il passaggio
resta `[ ]` finché non c'è il dato o una decisione esplicita dell'utente (es. "biografia provvisoria
va bene", "le opere le carico dal CMS").

Prima di iniziare leggi `CLAUDE.md` (sezioni Content, Section system, Gallery config).
Se sei stato invocato da `/setup`, aggiorna `setup-progress.md` dopo ogni passaggio.

## 2.1 Identità — `data/general.json`

`siteTitle` (tab del browser, anteprime social), `artistName` (nav, footer, metadati, JSON-LD,
file .ics), `description` (SEO, 1-2 frasi), `defaultTheme` (`dark` / `light`: chiedi).

## 2.2 Hero — `data/homepage.json` + `public/assets/hero/`

- `hero.name`, `hero.subtitle` (es. "Pittura, disegno, fotografia"; è anche il sottotitolo
  dell'immagine di anteprima social).
- Immagini: orizzontali in `public/assets/hero/desktop/`, verticali in `public/assets/hero/mobile/`,
  elencate in `hero.desktop` / `hero.mobile` (path `/assets/hero/...`; l'ordine dell'array è
  l'ordine del carosello). Rimuovi le 3 immagini stock del template.
- Senza immagini dell'artista: proponi di usare un'opera (copiandola) finché non arrivano foto dedicate.

## 2.3 Biografia e contatti — `data/bio.json`

`bio` (paragrafi separati da riga vuota, `_corsivo_`), `email` (link mostrato sotto il form),
`social.instagram` / `social.facebook` (stringa vuota = link nascosto; non rimuovere la chiave),
`aboutSections` (biografia / mostre / premi on-off). Anche `exhibitionsCta` in `data/homepage.json`
(titolo, descrizione, testo bottone del banner Esposizioni).

Form contatti su piano Hobby (uso non commerciale, vedi `/setup` fase 0): chiedi se tenere
l'oggetto "Acquisto opera" in `components/Contact.tsx` (select `subject` e precompilazione in
`components/Contact.tsx` / `lib/contactPrefill.ts`) o sostituirlo con una voce neutra
(es. "Informazioni su un'opera"). Decide l'utente.

Social diversi da Instagram/Facebook richiedono codice: `components/About.tsx` (icona + voce
in `socialLinks`) e `public/admin/config.yml` (campo in "Bio e contatti").

## 2.4 Sezioni del portfolio — `public/assets/galleries/`

Il template ha `section1`, `section2`, `section3`. Per ogni sezione dell'artista:

1. **Slug** = nome cartella = URL `/gallerie/{slug}`: solo `[a-z0-9-]` (es. `pittura`, `opere-su-carta`).
   `git mv public/assets/galleries/section1 public/assets/galleries/pittura`.
2. `gallery.json`: `nome` = slug; nei `file` sostituisci il vecchio segmento cartella.
3. `gallery-config.json`: `nome` = slug, `title`, `subtitle`, `order` (10, 20, 30…),
   `layout` (`masonry` = proporzioni originali, per pittura/disegno; `grid-3` / `grid-2` =
   celle 4:3 ritagliate, per la fotografia), `enabled` + `limitItems` (anteprima in homepage).
4. Sezioni in più: nuova cartella con i due JSON (`"type": "opere"` / `"type": "config"`
   obbligatori, altrimenti non compaiono nel CMS). Sezioni in meno: elimina la cartella (con conferma).

La navigazione si aggiorna da sola (`components/Nav.tsx` legge le gallerie pubbliche).

## 2.5 Opere

In una **sessione cloud** non puoi leggere i file del computer dell'utente: o le carica lui nella
repo da GitHub (pagina della cartella → Add file → Upload files) e tu le sistemi, o si caricano dal
CMS a fine setup (registra la decisione). Vale anche per le immagini di 2.2 e 2.7.

- Se l'utente fornisce immagini: copiale nella galleria con nomi `NN_titolo-kebab.jpg` e scrivi
  le voci in `gallery.json` (`file` = `/assets/galleries/{slug}/{nome}`, `alt` obbligatorio,
  `size` es. `80x60`, `medium`, `featured`). Ricava titoli/tecniche dai nomi file e falli confermare.
- Se preferisce caricarle dal CMS: rimuovi comunque le opere stock e registra la decisione.
  Attenzione: una galleria **senza opere non viene mostrata** (né in homepage né nella nav) finché
  non se ne carica almeno una — dillo all'utente.
- Chiedi quali opere mettere "in evidenza" (`featured: true`): senza nessuna, la sezione
  "In evidenza" semplicemente non compare.

## 2.6 Esposizioni, articoli, mostre, premi di esempio

Cartelle di esempio da sostituire con contenuti reali o eliminare (chiedi):

- `public/assets/exhibitions/2025-05-lorem-ipsum-dolor`, `public/assets/exhibitions/2027-04-15-consectetur-adipiscing`
- `public/assets/articles/01_lorem-ipsum`
- `public/assets/mostre/*` (3 voci), `public/assets/premi/*` (1 voce)

Sezioni rimaste vuote vanno nascoste: `data/homepage.json` → `sectionVisibility`
(es. `articles: false`), `data/bio.json` → `aboutSections` (mostre/premi). Il banner
`exhibitions-cta` senza esposizioni porta a una pagina vuota: nascondilo se non ce ne sono.

## 2.7 Icona e logo

- `app/icon.svg` (favicon) e `public/admin/logo.svg` (logo nel CMS). Se l'utente ha un logo SVG
  usalo; altrimenti proponi un monogramma semplice con le iniziali e fallo approvare.
- **Rimuovi il commento `template-default-icon`** (lo usa `check-setup`).
- Rigenera le PNG:
  ```bash
  node -e "const s=require('sharp');(async()=>{await s('app/icon.svg').resize(180,180).png().toFile('app/apple-icon.png');for(const n of [192,512])await s('app/icon.svg').resize(n,n).png().toFile('public/android-chrome-'+n+'x'+n+'.png')})()"
  ```

## 2.8 Aspetto

Chiedi se tenere colori e font del template. Se no:
- Colori: token in `app/globals.css` (chiaro in `@theme`, scuro in `.dark`); stessi valori in
  `public/admin/preview.css`, negli `opengraph-image.tsx` (hex) e in `public/site.webmanifest`
  (`theme_color`, `background_color`): aggiornali insieme.
- Font: `app/layout.tsx` (Cormorant Garamond + Inter via `next/font/google`).
- I testi dell'interfaccia (Biografia, Contatti, Esposizioni, "Richiedi informazioni"…) sono in
  italiano nei componenti: se serve un'altra lingua, elenca i file all'utente prima di toccarli.

## 2.9 Verifica, anteprima, pubblicazione — MISTO

```bash
npm run check-setup -- --offline
npm run lint && npm run build
```

Sul computer: avvia `npm run dev` e mostra all'utente homepage, una pagina `/gallerie/...` e
`/exhibitions` (browser integrato o chiedigli di aprire http://localhost:3000).
In cloud: pusha su un branch (es. `contenuti-iniziali`), recupera l'URL del deploy di anteprima con il
connettore Vercel e fallo aprire all'utente (è loggato su Vercel, quindi lo vede); poi unisci su `main`.

Serve la sua **approvazione esplicita**. Poi commit (`git commit -m "Contenuti iniziali"`) e, previa
conferma, push su `main`.

## Criteri di completamento

| Passaggio | Chiudi con `[x]` solo se |
|---|---|
| 2.1 | `general.json` senza "Nome Artista" né lorem ipsum; tema scelto dall'utente |
| 2.2 | `hero.name` reale; nessuna immagine stock (`check-setup` senza avviso hero) |
| 2.3 | bio non lorem ipsum (o provvisoria approvata), email reale, social reali o vuoti |
| 2.4 | nessuna cartella `sectionN` residua (salvo scelta esplicita); ogni galleria ha `nome` = cartella in entrambi i JSON |
| 2.5 | opere reali presenti, oppure decisione "carico dal CMS" registrata e stock rimosse |
| 2.6 | nessuna cartella di esempio elencata da `check-setup`; sezioni vuote nascoste |
| 2.7 | `check-setup` senza avviso icona; PNG rigenerate |
| 2.8 | colori/font aggiornati ovunque, oppure decisione "tengo quelli del template" |
| 2.9 | lint e build ok; anteprima approvata dall'utente; commit su `origin/main` |
