---
name: setup-vercel
description: Crea il progetto Vercel del portfolio collegato alla repo GitHub, imposta le variabili d'ambiente, esegue il primo deploy e ricava l'URL di produzione. Usala nella fase 4 di /setup o quando il sito non è ancora online.
---

# Deploy su Vercel

Prerequisito: repo GitHub propria con il codice pushato su `main` (`/setup-repo`).

Il progetto è Next.js standard: **nessun `vercel.json`**, nessuna configurazione di build da toccare.
L'URL canonico (`lib/site.ts`) si ricava in automatico da `VERCEL_PROJECT_PRODUCTION_URL`:
non serve impostarlo.

## 1. Crea il progetto collegato a GitHub

Il collegamento Git è essenziale: ogni pubblicazione dal CMS è un commit su `main`, e solo con
il deploy automatico su push il sito si aggiorna da solo.

### Lo faccio io — connettore Vercel (MCP), se disponibile

Cerca i tool con ToolSearch (`vercel create project`, `vercel project env`). Individua il team
corretto (lista team/progetti), poi crea il progetto con framework Next.js collegato alla repo
GitHub `OWNER/NOME`. Se il connettore segnala che serve un'azione dell'utente (es. installare
l'app GitHub di Vercel sulla repo), mostra il link e attendi.

### Lo faccio io — Vercel CLI

```bash
vercel --version          # se molto vecchia: npm i -g vercel@latest
vercel whoami             # se non autenticato: l'utente esegue lui `vercel login`
vercel link --yes --project NOME-PROGETTO   # crea/collega il progetto (scope: chiedi quale team)
vercel git connect        # collega la repo GitHub (origin) per i deploy automatici
```

Se `vercel git connect` fallisce per permessi, l'utente deve autorizzare l'app GitHub di Vercel
sulla repo: https://github.com/apps/vercel → Configure → aggiungi la repo. Poi riprova.

### Passo passo per l'utente — dashboard

1. https://vercel.com/new → **Import Git Repository** → scegli la repo (se non compare:
   "Adjust GitHub App Permissions" e concedi accesso alla repo).
2. Framework: Next.js (rilevato da solo). Build/Output: lasciare i default.
3. Environment Variables: si possono aggiungere ora o dopo (vedi punto 2).
4. **Deploy**.

## 2. Variabili d'ambiente

| Variabile | Ambienti | Chi la imposta |
|---|---|---|
| `NEXT_PUBLIC_WEB3FORMS_KEY` | Production, Preview, Development | tu (è pubblica) — vedi `/setup-contact-form` |
| `OAUTH_CLIENT_ID` | Production | tu — vedi `/setup-cms` |
| `OAUTH_CLIENT_SECRET` | Production | **solo l'utente** — vedi `/setup-cms` |
| `NEXT_PUBLIC_SITE_URL` | Production | opzionale, solo per forzare un URL diverso dal dominio di produzione |

Ogni modifica alle env richiede un **nuovo deploy** per avere effetto.

## 3. Primo deploy e URL di produzione

- Con Git collegato, il primo deploy parte dall'import/link; altrimenti `vercel deploy --prod`.
- Controlla l'esito (connettore: lista deployment / stato; CLI: `vercel ls`, `vercel inspect URL`).
  Se il build fallisce, leggi i log del build prima di cambiare configurazioni; riprova `npm run build`
  in locale per confrontare.
- Ricava l'**URL di produzione** (dominio `*.vercel.app` assegnato al progetto, o dominio custom)
  e annotalo: serve a `/setup-cms`.

## 4. Verifica

Apri l'URL (browser integrato o chiedi all'utente): homepage, una pagina `/gallerie/...`,
`/exhibitions`, `/sitemap.xml` (gli URL devono usare il dominio di produzione).

Opzionale: Vercel Web Analytics e Speed Insights sono già nel codice (`@vercel/analytics`,
`@vercel/speed-insights`); per vedere i dati l'utente li abilita dalla dashboard del progetto
(tab Analytics / Speed Insights → Enable).

Note:
- I deploy di Preview (branch diversi da `main`, incluse le bozze del CMS) sono protetti da login
  Vercel di default; la produzione è pubblica.
- Il CMS (`/admin`) funziona solo sul dominio di produzione (callback OAuth unico).
