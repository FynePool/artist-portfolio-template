---
name: setup-cms
description: Fase 4 di /setup (passaggi 4.1–4.10) — configura il login al CMS Decap (/admin) del portfolio con GitHub OAuth App, variabili OAUTH_CLIENT_ID/OAUTH_CLIENT_SECRET su Vercel e config.yml, poi dà accesso in scrittura a chi gestisce i contenuti. Usala anche se il login a /admin non funziona.
---

# Fase 4 — Login al CMS e accesso per chi gestisce i contenuti

## Come funziona (spiegalo in breve all'utente)

`/admin` carica Decap CMS (`public/admin/index.html` + `config.yml`). "Login with GitHub" apre
`/api/auth` (`app/api/auth/route.ts`), che fa l'OAuth con una **GitHub OAuth App** usando
`OAUTH_CLIENT_ID` e `OAUTH_CLIENT_SECRET`. Il token ottenuto è quello della persona che entra:
per salvare deve avere **permesso di scrittura sulla repo**. Ogni pubblicazione è un commit su
`main` → Vercel ridistribuisce il sito.

Prerequisiti: 1.2 e 3.3 chiusi. `SITE` = URL di produzione registrato al 3.3, senza `/` finale.
Se sei stato invocato da `/setup`, aggiorna `setup-progress.md` dopo ogni passaggio.

## 4.1 config.yml — AUTO

In `public/admin/config.yml`: `backend.base_url: SITE` e `site_url: SITE`
(verifica anche `backend.repo` = OWNER/NOME e `backend.branch: main`). Il commit avviene al 4.6.

## 4.2 GitHub OAuth App — MISTO

GitHub non permette di creare OAuth App via API: è un passaggio da interfaccia web.

- Account personale: https://github.com/settings/applications/new
- Repo di un'organizzazione: meglio crearla nell'organizzazione,
  `https://github.com/organizations/ORG/settings/applications/new`

| Campo | Valore |
|---|---|
| Application name | es. `Portfolio NOME ARTISTA — CMS` |
| Homepage URL | `SITE` |
| Authorization callback URL | `SITE/api/auth` |
| Enable Device Flow | spento |

- **Lo faccio io (browser, solo sul computer)**: con Claude in Chrome o il browser integrato apri la
  pagina (il login a GitHub lo fa l'utente) e compila questi campi, che non sono segreti. **Register application**
  lo clicca l'utente, o tu solo dopo sua conferma esplicita.
- **Passo passo**: dai all'utente la tabella sopra e attendi conferma.

## 4.3 Client secret — MANUALE (sempre)

Nella pagina dell'app l'utente clicca **Generate a new client secret** e lo tiene da parte per il 4.5.
Il secret non deve passare da te: non chiederlo in chat, non leggerlo dallo schermo, non inserirlo
tu in nessun campo, non scriverlo nel registro.

## 4.4 `OAUTH_CLIENT_ID` su Vercel — AUTO

Il Client ID è visibile nella pagina dell'app e non è segreto: leggilo dal browser o fattelo copiare.
- Connettore Vercel: crea la variabile sul progetto, target Production.
- CLI (solo sul computer): `printf '%s' "CLIENT_ID" | vercel env add OAUTH_CLIENT_ID production`

## 4.5 `OAUTH_CLIENT_SECRET` su Vercel — MANUALE (sempre)

L'utente, a scelta:
- dashboard: Vercel → progetto → Settings → Environment Variables → nome `OAUTH_CLIENT_SECRET`,
  ambiente **Production**, tipo Sensitive → Save;
- oppure nel proprio terminale (il valore viene chiesto in modo nascosto):
  ```bash
  vercel env add OAUTH_CLIENT_SECRET production
  ```
Attendi la sua conferma; la verifica tecnica arriva al 4.7.

## 4.6 Commit, push, nuovo deploy — AUTO

Committa `public/admin/config.yml` (+ `setup-progress.md`) e pusha su `main` previa conferma.
Il push genera il deploy, che include anche le variabili appena aggiunte. Attendi lo stato Ready.
(Se le variabili sono state aggiunte dopo l'ultimo deploy e non c'è nulla da pushare: redeploy
da dashboard, connettore o `vercel deploy --prod`.)

## 4.7 Verifica tecnica — AUTO

```bash
npm run check-setup
```

Nella sezione "Produzione" devono comparire: `✓ config.yml del CMS pubblicato e aggiornato` e
`✓ /api/auth reindirizza a GitHub`. Se no, vedi la tabella dei problemi qui sotto.

## 4.8 Login reale — MANUALE

L'utente apre `SITE/admin` → **Login with GitHub** → Authorize → deve vedere il pannello con le
collezioni (Generali, Gallerie — Opere, Esposizioni…). Chiedigli conferma.

| Sintomo | Causa probabile |
|---|---|
| "Errore di configurazione: variabili OAUTH_CLIENT_ID o OAUTH_CLIENT_SECRET mancanti" | env mancanti in Production o deploy precedente alla loro aggiunta |
| GitHub: "The redirect_uri is not associated with this application" | callback dell'OAuth App diverso da `SITE/api/auth` (https, www, dominio) |
| "Errore OAuth GitHub: bad_verification_code / incorrect_client_credentials" | secret o client ID sbagliati / rigenerati |
| Login ok ma errori nel caricare le collezioni / "Not Found" | `backend.repo` errato, oppure l'account non ha accesso in scrittura alla repo |
| Repo di organizzazione: login ok ma repo invisibile | l'organizzazione limita le OAuth App: Org → Settings → Third-party access → approva l'app |
| Popup bloccato | consentire i popup per il sito e riprovare (index.html gestisce anche il fallback) |

## 4.9 Accesso per chi gestisce i contenuti — AUTO (con conferma)

Chiedi chi gestirà i contenuti. Se è il proprietario stesso (consigliato): chiudi con
`✔ gestore = proprietario`.

Se è **un'altra persona** con un altro account GitHub, prima verifica il piano: con Vercel **Hobby**
e repo **privata** le sue pubblicazioni dal CMS verrebbero bloccate (Vercel pubblica solo i commit del
proprietario). Spiega le alternative e fai scegliere l'utente: passare a Pro, rendere pubblica la repo,
oppure far gestire i contenuti al proprietario. Solo dopo la scelta, serve un account GitHub (gratuito)
con permesso **Write**:

- **Lo faccio io (GitHub CLI)**, previa conferma (GitHub invia un invito via email):
  ```bash
  gh api -X PUT repos/OWNER/NOME/collaborators/USERNAME -f permission=push
  ```
- **Passo passo**: repo → Settings → Collaborators → Add people → username → ruolo Write.

## 4.10 Invito accettato e primo login del gestore — MANUALE

La persona accetta l'invito (email o `https://github.com/OWNER/NOME/invitations`) e fa login da
`SITE/admin`. Può richiedere tempo: annota `⏳ in attesa del gestore` e prosegui con le fasi
successive, tornando qui prima della chiusura. Verifica: `gh api repos/OWNER/NOME/collaborators/USERNAME`
risponde 204 (invito accettato) e il gestore conferma il login.
Indicagli la sezione "User guide (CMS)" del README (in inglese, con le etichette italiane del pannello): il CMS usa il flusso editoriale
(Draft → In Review → Ready → **Publish**); solo Publish manda online.
Se gestore = proprietario: `✔ coincide con 4.8`.

## Criteri di completamento

| Passaggio | Chiudi con `[x]` solo se |
|---|---|
| 4.1 | `check-setup` mostra `✓ base_url → SITE` |
| 4.2 | l'utente conferma l'app creata; Homepage e callback coincidono con la tabella |
| 4.3 | l'utente conferma di aver generato il secret (senza mostrarlo) |
| 4.4 | la variabile risulta nel progetto (connettore/`vercel env ls production`: solo il nome) |
| 4.5 | conferma dell'utente; verifica tecnica al 4.7 |
| 4.6 | commit su `origin/main` e deploy Ready |
| 4.7 | `check-setup`: config.yml pubblicato ✓ e `/api/auth` → GitHub ✓ |
| 4.8 | l'utente vede il pannello dopo il login |
| 4.9 | collaboratore invitato (o gestore = proprietario) |
| 4.10 | collaboratore attivo (204) e login confermato (o gestore = proprietario) |
