---
name: setup-domain
description: Collega un dominio personalizzato al portfolio su Vercel e riallinea CMS e OAuth App al nuovo URL. Usala nella fase 6 di /setup o quando l'utente vuole passare da *.vercel.app a un dominio proprio.
---

# Dominio personalizzato (opzionale)

Prerequisito: progetto Vercel funzionante (`/setup-vercel`).

## 1. Dominio

- **Già acquistato altrove**: si collega e si configurano i DNS presso il registrar.
- **Da acquistare**: l'utente può comprarlo dal suo registrar o da Vercel (Domains → Buy).
  Un acquisto è una spesa: non farlo tu senza un'approvazione esplicita con prezzo mostrato;
  di norma lascialo fare all'utente.

## 2. Aggiungilo al progetto

- **Lo faccio io**: connettore Vercel (aggiungi dominio al progetto) oppure CLI
  `vercel domains add DOMINIO` dalla cartella collegata.
- **Passo passo**: Vercel → progetto → Settings → Domains → Add → inserisci dominio
  (consigliato aggiungere sia `esempio.it` sia `www.esempio.it`, con redirect sull'uno dei due).

Vercel mostra i record DNS da impostare (tipicamente un record A per il dominio principale e un
CNAME per `www`): riportali all'utente **esattamente come li mostra Vercel** e guidalo nel pannello
DNS del suo registrar. La propagazione può richiedere da minuti a qualche ora; il certificato HTTPS
è automatico.

Imposta il dominio scelto come principale (quello senza redirect): diventa
`VERCEL_PROJECT_PRODUCTION_URL`, quindi `lib/site.ts`, sitemap e metadati lo useranno al prossimo
deploy senza modifiche al codice.

## 3. Riallinea il CMS (obbligatorio, altrimenti il login a /admin si rompe)

Con `NUOVO` = `https://dominio-principale` (senza `/` finale):

1. `public/admin/config.yml` → `backend.base_url: NUOVO` e `site_url: NUOVO` (lo faccio io).
2. GitHub OAuth App (Settings → Developer settings → OAuth Apps → app del sito):
   Homepage URL = `NUOVO`, Authorization callback URL = `NUOVO/api/auth`.
   Campi non segreti: puoi aggiornarli tu via browser previa conferma, o guidare l'utente.
3. Commit + push → deploy. Testa `NUOVO/admin` → Login with GitHub.

L'URL `*.vercel.app` continua a funzionare per il sito, ma il CMS va usato dal dominio principale.
