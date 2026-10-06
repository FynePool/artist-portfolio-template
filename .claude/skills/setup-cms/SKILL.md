---
name: setup-cms
description: Configura il login al CMS Decap (/admin) del portfolio — GitHub OAuth App, variabili OAUTH_CLIENT_ID/OAUTH_CLIENT_SECRET su Vercel, config.yml (repo e URL) — e dà accesso in scrittura a chi gestisce i contenuti. Usala nella fase 5 di /setup o se il login a /admin non funziona.
---

# Login al CMS e accesso per chi gestisce i contenuti

## Come funziona (spiegalo in breve all'utente)

`/admin` carica Decap CMS (`public/admin/index.html` + `config.yml`). "Login with GitHub" apre
`/api/auth` (`app/api/auth/route.ts`), che fa l'OAuth con una **GitHub OAuth App** usando
`OAUTH_CLIENT_ID` e `OAUTH_CLIENT_SECRET`. Il token ottenuto è quello della persona che entra:
per salvare deve avere **permesso di scrittura sulla repo**. Ogni pubblicazione è un commit su
`main` → Vercel ridistribuisce il sito.

Prerequisiti: repo (`/setup-repo`) e URL di produzione (`/setup-vercel`).
Di seguito `SITE` = URL di produzione senza `/` finale (es. `https://nome-artista.vercel.app`).

## 1. config.yml — lo faccio io

In `public/admin/config.yml`:

```yaml
backend:
  repo: OWNER/NOME          # repo GitHub del sito
  branch: main
  base_url: SITE            # dove gira /api/auth
site_url: SITE
```

## 2. GitHub OAuth App

GitHub non permette di creare OAuth App via API: è un passaggio da interfaccia web.

- Account personale: https://github.com/settings/applications/new
- Repo di un'organizzazione: meglio creare l'app nell'organizzazione,
  `https://github.com/organizations/ORG/settings/applications/new`

Campi:

| Campo | Valore |
|---|---|
| Application name | es. `Portfolio NOME ARTISTA — CMS` |
| Homepage URL | `SITE` |
| Authorization callback URL | `SITE/api/auth` |
| Enable Device Flow | lasciare spento |

**Lo faccio io (browser)**: con Claude in Chrome o il browser integrato puoi aprire la pagina
(l'utente deve essere già loggato su GitHub: il login lo fa lui) e compilare questi tre campi,
che non sono segreti. Il click su **Register application** fallo fare all'utente, o fallo tu
solo dopo sua conferma esplicita.

Poi, nella pagina dell'app:
- **Client ID**: visibile in pagina, non è segreto → puoi leggerlo tu (browser) o farlo copiare.
- **Generate a new client secret**: lo genera e lo copia **l'utente**. Il secret non deve passare
  da te: non chiederlo in chat, non leggerlo dallo schermo, non inserirlo tu in nessun campo.

## 3. Variabili su Vercel (ambiente Production)

- `OAUTH_CLIENT_ID` → **lo faccio io**: connettore Vercel (crea env sul progetto, target production)
  oppure CLI: `printf '%s' "CLIENT_ID" | vercel env add OAUTH_CLIENT_ID production`.
- `OAUTH_CLIENT_SECRET` → **lo fa l'utente**, a scelta:
  - dashboard: Vercel → progetto → Settings → Environment Variables → `OAUTH_CLIENT_SECRET`,
    ambiente Production, tipo Sensitive → Save;
  - oppure nel proprio terminale (il valore viene chiesto in modo nascosto):
    ```bash
    vercel env add OAUTH_CLIENT_SECRET production
    ```

## 4. Pubblica

Committa `public/admin/config.yml`, pusha su `main` (previa conferma) e attendi il deploy.
Se le env sono state aggiunte dopo l'ultimo deploy, serve comunque un nuovo deploy.

## 5. Test

Apri `SITE/admin` → **Login with GitHub** → Authorize → deve comparire il pannello con le
collezioni (Generali, Gallerie — Opere, Esposizioni…).

| Sintomo | Causa probabile |
|---|---|
| Pagina "Errore di configurazione: variabili OAUTH_CLIENT_ID o OAUTH_CLIENT_SECRET mancanti" | env mancanti in Production o deploy precedente alla loro aggiunta |
| GitHub: "The redirect_uri is not associated with this application" | callback URL dell'OAuth App diverso da `SITE/api/auth` (https, www, dominio) |
| "Errore OAuth GitHub: bad_verification_code / incorrect_client_credentials" | secret o client ID sbagliati / rigenerati |
| Login ok ma errori nel caricare le collezioni / "Not Found" | `backend.repo` errato, oppure l'utente non ha accesso in scrittura alla repo |
| Repo di organizzazione: login ok ma repo invisibile | l'organizzazione limita le OAuth App: Org → Settings → Third-party access → approva l'app |
| Popup bloccato | consentire i popup per il sito e riprovare (index.html gestisce anche il fallback) |

## 6. Accesso per chi gestisce i contenuti

Serve un account GitHub (gratuito) con permesso **Write** sulla repo.

- **Lo faccio io (GitHub CLI)**, previa conferma (GitHub invia un invito via email):
  ```bash
  gh api -X PUT repos/OWNER/NOME/collaborators/USERNAME -f permission=push
  ```
- **Passo passo**: repo → Settings → Collaborators (o Collaborators and teams) → Add people →
  username → ruolo Write.

La persona accetta l'invito (email o `https://github.com/OWNER/NOME/invitations`), poi entra da
`SITE/admin`. Indicale la sezione "Guida all'utilizzo (CMS)" del README: il CMS usa il flusso
editoriale (Draft → In Review → Ready → **Publish**); solo Publish manda online.
