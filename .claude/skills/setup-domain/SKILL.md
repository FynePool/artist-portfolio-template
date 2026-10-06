---
name: setup-domain
description: Fase 6 di /setup (passaggi 6.1–6.7) — collega un dominio personalizzato al portfolio su Vercel e riallinea config.yml del CMS e GitHub OAuth App al nuovo URL. Usala anche quando l'utente vuole passare da *.vercel.app a un dominio proprio.
---

# Fase 6 — Dominio personalizzato (opzionale)

Prerequisito: fase 4 chiusa (il CMS va riallineato al nuovo dominio).
Se sei stato invocato da `/setup`, aggiorna `setup-progress.md` dopo ogni passaggio.

## 6.1 Decisione — MANUALE

Chiedi esplicitamente se vuole un dominio proprio (es. `nomeartista.it`). Solo con un "no"
esplicito: `[-]` su 6.1–6.7 e fine fase.

## 6.2 Dominio disponibile — MANUALE

- Già acquistato: chiedi presso quale registrar (servirà per i DNS).
- Da acquistare: lo compra l'utente dal suo registrar o da Vercel (Domains → Buy).
  Un acquisto è una spesa: non farlo tu; al massimo mostra prezzo e disponibilità se hai il
  connettore Vercel, e lascia la decisione all'utente.

## 6.3 Dominio sul progetto Vercel — AUTO

- Connettore Vercel (aggiungi dominio al progetto) oppure CLI `vercel domains add DOMINIO`
  dalla cartella collegata. Senza strumenti: Vercel → progetto → Settings → Domains → Add.
- Consigliato aggiungere sia `esempio.it` sia `www.esempio.it`, con redirect dall'uno all'altro,
  e scegliere quale è il **principale** (quello senza redirect).

## 6.4 DNS — MANUALE (verifica AUTO)

Vercel mostra i record DNS da impostare (tipicamente un record A per il dominio principale e un
CNAME per `www`): riportali all'utente **esattamente come li mostra Vercel** e guidalo nel pannello
DNS del suo registrar. La propagazione richiede da minuti a qualche ora: annota `⏳ propagazione DNS`
e verifica periodicamente (connettore/CLI: stato del dominio; oppure `curl -sI https://DOMINIO`).
Il certificato HTTPS è automatico.

Una volta attivo, il dominio principale diventa `VERCEL_PROJECT_PRODUCTION_URL`: `lib/site.ts`,
sitemap e metadati lo useranno al prossimo deploy senza modifiche al codice.

## 6.5 config.yml — AUTO

`NUOVO` = `https://dominio-principale` (senza `/` finale). In `public/admin/config.yml`:
`backend.base_url: NUOVO` e `site_url: NUOVO`. Aggiorna anche la riga 3.3 del registro con il
nuovo URL. Commit + push (previa conferma) → deploy.

## 6.6 GitHub OAuth App — MISTO

GitHub → Settings → Developer settings → OAuth Apps → app del sito (per un'organizzazione:
impostazioni dell'organizzazione): Homepage URL = `NUOVO`, Authorization callback URL =
`NUOVO/api/auth` → Update. Campi non segreti: puoi aggiornarli tu via browser previa conferma,
o guidare l'utente.

## 6.7 Verifica — MISTO

`npm run check-setup` → sezione Produzione tutta ✓ sul nuovo URL (in particolare `/api/auth` →
GitHub, senza avviso su `redirect_uri`). Poi l'utente fa login su `NUOVO/admin`.
L'URL `*.vercel.app` continua a funzionare per il sito, ma il CMS va usato dal dominio principale:
dillo anche al gestore dei contenuti.

## Criteri di completamento

| Passaggio | Chiudi con `[x]` solo se |
|---|---|
| 6.1 | risposta esplicita dell'utente registrata |
| 6.2 | dominio di proprietà dell'utente |
| 6.3 | dominio presente nel progetto, principale scelto |
| 6.4 | Vercel segnala il dominio come configurato; `https://NUOVO` risponde 200 |
| 6.5 | `check-setup`: `base_url → NUOVO` e config.yml pubblicato ✓ |
| 6.6 | l'utente conferma (o hai verificato nel browser) i due URL aggiornati |
| 6.7 | `check-setup` Produzione ✓ e login su `NUOVO/admin` confermato |
