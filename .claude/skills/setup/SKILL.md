---
name: setup
description: Setup iniziale guidato del template artist-portfolio-template — repo GitHub, contenuti dell'artista, form contatti (Web3Forms), deploy Vercel, login al CMS Decap (GitHub OAuth), accesso per chi gestisce i contenuti, dominio. Usala quando l'utente ha appena creato un progetto da questo template o chiede di "configurare", "mettere online" o "fare il setup" del portfolio.
---

# Setup iniziale del portfolio

Sei la regia del setup. Il tuo compito: capire cosa manca, proporre per ogni passaggio
**"lo faccio io"** (se hai lo strumento giusto) oppure dare istruzioni **passo passo**
all'utente, ed eseguire i passaggi nell'ordine corretto delegando alle skill dedicate.

Rispondi nella lingua dell'utente (default: italiano). Un passaggio alla volta, niente muri di testo.

## Regole valide per tutto il setup

- **Conferma prima di ogni azione esterna**: creare repo, deploy, impostare variabili su Vercel,
  invitare collaboratori, inviare form. Una conferma vale per quell'azione, non per le successive.
- **Segreti fuori dalla chat**: `OAUTH_CLIENT_SECRET` non deve mai passare dalla conversazione.
  L'utente lo inserisce lui (dashboard Vercel o `vercel env add` nel proprio terminale).
  Non chiederlo, non leggerlo da file, non stamparlo.
- **Account e login sono dell'utente**: non creare account, non inserire password. Se serve un login
  (GitHub, Vercel, Web3Forms) lo fa l'utente; tu riprendi da lì.
- Il file `.env.local` è protetto dall'hook `.claude/hooks/protect-files.sh`: non scriverlo con
  Edit/Write. Popolalo con `vercel env pull .env.local` oppure chiedi all'utente di crearlo.
- Dopo modifiche al codice o ai dati: `npm run lint` e `npm run build` prima di pushare.

## 1. Inventario strumenti (fallo subito, in silenzio, poi riassumi)

Verifica cosa hai a disposizione, così sai cosa puoi fare tu e cosa deve fare l'utente:

| Strumento | Come verificarlo | Abilita |
|---|---|---|
| GitHub CLI | `gh auth status` | creare la repo, invitare collaboratori |
| Vercel CLI | `vercel --version` e `vercel whoami` (versione vecchia → suggerisci `npm i -g vercel@latest`) | link progetto, env, deploy, domini |
| Connettore Vercel (MCP) | ToolSearch `vercel project env` | creare progetto, env, deploy, domini senza CLI |
| Browser (Claude in Chrome o browser integrato) | tool `mcp__claude-in-chrome__*` / `mcp__Claude_Browser__*` | compilare i campi non segreti di GitHub OAuth App e Web3Forms |
| Connettore Gmail | ToolSearch `gmail search` | recuperare la chiave Web3Forms dalla mail |

Riassumi all'utente in 3-5 righe: "Posso fare io X, Y, Z. Per A e B ti guiderò passo passo."
Se manca un connettore utile, dillo e suggerisci come aggiungerlo (impostazioni dei connettori
di claude.ai, oppure `/mcp` per i server MCP locali) — ma proponi sempre anche la strada manuale.

## 2. Stato attuale

Esegui `npm run check-setup` e mostra all'utente un riepilogo compatto (✓ fatto / ✗ da fare / ! avviso).
Salta i passaggi già completati.

## 3. Raccogli le informazioni in un solo messaggio

Chiedi tutto insieme (l'utente può rispondere "non so / dopo" a qualunque voce):

1. Nome dell'artista (e titolo del sito, se diverso)
2. Nome della repo GitHub e visibilità (privata consigliata), account o organizzazione proprietaria
3. Sezioni del portfolio (es. "Pittura, Disegno, Fotografia") — sostituiranno `section1..3`
4. Email a cui devono arrivare i messaggi del form contatti
5. Username GitHub di chi gestirà i contenuti dal CMS (se diverso dall'utente)
6. Dominio personalizzato: sì/no (se sì, quale e se è già acquistato)

## 4. Esegui le fasi in quest'ordine

Le dipendenze contano: Vercel ha bisogno della repo, il CMS ha bisogno dell'URL di produzione.

| # | Fase | Skill | Dipende da | Obbligatoria |
|---|---|---|---|---|
| 1 | Repo GitHub propria | `/setup-repo` | — | sì |
| 2 | Identità e contenuti | `/setup-content` | — | sì (anche parziale) |
| 3 | Form contatti | `/setup-contact-form` | (Vercel per la produzione) | no — senza chiave il form diventa un link email |
| 4 | Deploy su Vercel | `/setup-vercel` | 1 | sì |
| 5 | Login CMS + accesso gestore contenuti | `/setup-cms` | 1, 4 | sì, se si usa il CMS |
| 6 | Dominio personalizzato | `/setup-domain` | 4 (poi riallinea 5) | no |

Invoca ogni skill con il tool Skill. Tra una fase e l'altra: una riga di stato ("Fatto: repo creata.
Prossimo: contenuti."). Se l'utente vuole saltare una fase, annotalo e prosegui.

La fase 2 si può fare anche in parallelo/dopo: i contenuti si cambiano in qualunque momento,
anche dal CMS. Il minimo indispensabile prima del primo deploy pubblico: nome artista, email,
biografia (anche provvisoria) e niente lorem ipsum visibile se il sito verrà condiviso.

## 5. Verifica finale

1. `npm run check-setup` → nessun ✗.
2. `npm run lint && npm run build` → ok.
3. Sito di produzione raggiungibile; `/admin` → "Login with GitHub" funziona.
4. Se configurato: invio di prova dal form contatti → la mail arriva.
5. Riepiloga all'utente: URL del sito, URL del CMS (`/admin`), chi ha accesso, cosa resta opzionale.
   Indica la guida per chi gestisce i contenuti: sezione "Guida all'utilizzo (CMS)" del README.
