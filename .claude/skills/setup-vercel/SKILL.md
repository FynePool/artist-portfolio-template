---
name: setup-vercel
description: Fase 3 di /setup (passaggi 3.1–3.4) — crea il progetto Vercel del portfolio collegato alla repo GitHub, esegue il primo deploy e ricava l'URL di produzione. Usala quando il sito non è ancora online o il deploy automatico non funziona.
---

# Fase 3 — Deploy su Vercel

Prerequisito: passaggio 1.2 chiuso (repo GitHub propria con il codice su `main`).
Se sei stato invocato da `/setup`, aggiorna `setup-progress.md` dopo ogni passaggio.

Il progetto è Next.js standard: **nessun `vercel.json`**, nessuna configurazione di build da toccare.
L'URL canonico (`lib/site.ts`) si ricava in automatico da `VERCEL_PROJECT_PRODUCTION_URL`.

## 3.1 Progetto Vercel collegato a GitHub — AUTO (CLI o connettore) / MANUALE (dashboard)

Il collegamento Git è essenziale: ogni pubblicazione dal CMS è un commit su `main`, e solo con
il deploy automatico su push il sito si aggiorna da solo.

### Lo faccio io — connettore Vercel (MCP), se disponibile — l'unica strada in cloud

Cerca i tool con ToolSearch (`vercel create project`, `vercel project env`). Individua il team
corretto (lista team/progetti; su Hobby è il team personale), poi crea il progetto collegato alla
repo GitHub `OWNER/NOME` (tool che crea un progetto da una repository Git, `projectName` = nome scelto:
determina l'indirizzo `NOME.vercel.app`). Se il connettore segnala un'azione richiesta all'utente (es. installare
l'app GitHub di Vercel sulla repo), mostra il link e attendi.

### Lo faccio io — Vercel CLI (solo sul computer: in cloud vercel.com non è raggiungibile)

```bash
vercel --version          # se molto vecchia: npm i -g vercel@latest (con conferma)
vercel whoami             # se non autenticato: l'utente esegue lui `vercel login`
vercel link --yes --project NOME-PROGETTO   # crea/collega il progetto (chiedi lo scope/team)
vercel git connect        # collega la repo GitHub (origin) per i deploy automatici
```

Se `vercel git connect` fallisce per permessi: l'utente autorizza l'app GitHub di Vercel sulla repo
(https://github.com/apps/vercel → Configure → aggiungi la repo), poi riprovi tu.

### Passo passo per l'utente — dashboard

1. https://vercel.com/new → **Import Git Repository** → scegli la repo (se non compare:
   "Adjust GitHub App Permissions" e concedi accesso alla repo).
2. Framework: Next.js (rilevato da solo). Build/Output: lasciare i default. Variabili: non servono ora.
3. **Deploy**, poi comunica il nome del progetto.

## 3.2 Primo deploy di produzione — AUTO

Con Git collegato il deploy parte da import/link o da un push su `main`; altrimenti `vercel deploy --prod`.
Controlla l'esito (connettore: lista deployment; CLI: `vercel ls`, `vercel inspect URL`).
Se il build fallisce: leggi i log del build, riproduci con `npm run build` in locale, correggi,
pusha. Non cambiare impostazioni del progetto prima di aver letto i log.

Se il deploy risulta **bloccato** con un messaggio sull'autore del commit ("commit author did not
have contributing access… Hobby Plan does not support collaboration for private repositories"):
l'autore dell'ultimo commit non è il proprietario dell'account Vercel. Correggi l'identità git
(vedi `/setup-repo`, "Autore dei commit") e fai un nuovo commit; se a pubblicare deve essere davvero
un'altra persona, servono Pro o repo pubblica (vincoli in `/setup`, fase 0).

## 3.3 URL di produzione — AUTO

Ricava il dominio di produzione del progetto (`NOME.vercel.app` o simile: connettore → dettagli
progetto/domini; CLI → `vercel project inspect` o l'alias di produzione mostrato dal deploy) e
**scrivilo nella riga 3.3 di `setup-progress.md`**. È il prerequisito della fase 4.
Usa il dominio di progetto, non l'URL del singolo deployment (quello con hash, protetto da login).

## 3.4 Sito online — AUTO

Apri l'URL (browser integrato, `curl -sI`, o in cloud lo strumento del connettore Vercel che legge
un URL): homepage, una pagina `/gallerie/...`,
`/exhibitions`, `/sitemap.xml` (gli URL devono usare il dominio di produzione, non localhost).
`check-setup` farà questi controlli in automatico dopo il passaggio 4.1, quando l'URL sarà in `config.yml`.

Note per l'utente:
- I deploy di Preview (branch diversi da `main`, incluse le bozze del CMS) sono protetti da login
  Vercel di default; la produzione è pubblica.
- Variabili d'ambiente: si aggiungono nelle fasi 4 (CMS) e 5 (form); ogni modifica richiede un nuovo deploy.

## Criteri di completamento

| Passaggio | Chiudi con `[x]` solo se |
|---|---|
| 3.1 | il progetto esiste ed è collegato alla repo giusta (connettore/CLI/dashboard lo mostrano); un push su `main` genera un deploy |
| 3.2 | ultimo deploy di produzione in stato Ready |
| 3.3 | URL di produzione scritto in `setup-progress.md` |
| 3.4 | homepage 200 sull'URL di produzione; sitemap senza `localhost` |
