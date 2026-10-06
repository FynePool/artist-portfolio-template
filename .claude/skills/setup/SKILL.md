---
name: setup
description: Setup iniziale guidato del template artist-portfolio-template — repo GitHub, contenuti dell'artista, deploy Vercel, login al CMS Decap (GitHub OAuth), accesso per chi gestisce i contenuti, form contatti (Web3Forms), dominio. Esegue TUTTI i passaggi in ordine tenendo un registro verificato (setup-progress.md). Usala quando l'utente ha appena creato un progetto da questo template, chiede di "configurare", "mettere online" o "fare il setup" del portfolio, o vuole riprendere un setup interrotto.
---

# Setup iniziale del portfolio

Sei la regia del setup. Porti l'utente attraverso **ogni** passaggio della lista canonica,
nell'ordine, senza saltarne nessuno. Per ogni passaggio proponi **"lo faccio io"** quando hai
lo strumento giusto, altrimenti dai istruzioni **passo passo** e aspetti che l'utente confermi.

Rispondi nella lingua dell'utente (default: italiano). Un passaggio alla volta, niente muri di testo.

## La lista canonica e il registro

- La lista completa e numerata dei passaggi è in [progress-template.md](progress-template.md)
  (fasi 0–8, ID `N.M`, esecutore AUTO / MANUALE / MISTO). È l'unica fonte: non inventare
  passaggi diversi e non riordinarli.
- All'avvio:
  - se `setup-progress.md` **non esiste** nella root del progetto, copialo da `progress-template.md`;
  - se **esiste**, leggilo e riprendi dal **primo** passaggio non chiuso (`[ ]`). Non fidarti
    ciecamente dei `[x]` di sessioni precedenti: `check-setup` deve confermarli (vedi sotto).
  - Se la repo è stata creata con il plugin `artist-portfolio` (`/artist-portfolio:setup`), il registro
    arriva già con alcuni passaggi chiusi (requisiti, repo, progetto Vercel, URL): confermali con
    `check-setup` e prosegui.
- Il registro si aggiorna **subito dopo ogni passaggio**, non a fine fase.

## Protocollo anti-salto (obbligatorio)

1. **Ordine stretto.** Si lavora sul primo passaggio aperto. Non si passa al successivo finché
   quello corrente non è `[x]` o `[-]`. Unica eccezione: un passaggio MANUALE in attesa
   dell'utente (es. propagazione DNS, invito da accettare) può restare aperto mentre procedi
   con passaggi **successivi che non dipendono da lui** — annotalo con `⏳ in attesa di: …` e
   tornaci prima di chiudere la fase.
2. **Niente `[x]` senza verifica.** Un passaggio diventa `[x]` solo dopo aver controllato i suoi
   **criteri di completamento** (sezione finale di ogni skill di fase). Scrivi l'evidenza sulla
   riga: `- [x] 1.1 Repo propria … — AUTO ✔ origin = mario/portfolio (2026-10-07)`.
   - Per i passaggi MANUALI l'evidenza è la conferma dell'utente **più** la verifica tecnica
     quando esiste (es. 4.5: l'utente dice "fatto" → `check-setup` mostra `/api/auth` → GitHub).
   - Se un passaggio risulta già fatto (es. repo creata con "Use this template"), va comunque
     verificato e chiuso con l'evidenza `✔ già presente: …`. Mai chiudere passaggi in blocco.
3. **`[-]` solo dove è scritto "opzionale"** (fasi 5, 6, 7 e i passaggi che lo prevedono nel testo),
   e solo dopo una **domanda esplicita** all'utente e una risposta esplicita ("no, non lo voglio").
   Il silenzio o "dopo" non valgono come rifiuto: il passaggio resta `[ ]`.
4. **Rimandare non è chiudere.** Se l'utente vuole rimandare un passaggio obbligatorio, lascialo
   `[ ]` con nota `⏸ rimandato: motivo`. Se un passaggio successivo dipende da lui, fermati e
   spiega cosa blocca (es. senza 3.3 URL di produzione non si può fare la fase 4).
5. **Fine fase = controllo.** Al termine di ogni fase: `npm run check-setup`, confronta l'esito con
   il registro (se `check-setup` contraddice un `[x]`, riapri il passaggio), mostra all'utente lo
   stato in 2-3 righe, committa `setup-progress.md` insieme alle altre modifiche della fase.
6. **Mai dichiarare il setup concluso** se `check-setup` riporta ✗ o il registro ha passaggi `[ ]`.
   In quel caso il riepilogo finale elenca esplicitamente cosa resta e chi deve farlo.

Tieni anche una todo list di sessione (strumento di task tracking disponibile) con una voce per
fase, per non perdere il filo nelle conversazioni lunghe.

## Regole valide per tutto il setup

- **Conferma prima di ogni azione esterna**: creare repo, deploy, impostare variabili su Vercel,
  invitare collaboratori, inviare form. Una conferma vale per quell'azione, non per le successive.
- **Segreti fuori dalla chat**: `OAUTH_CLIENT_SECRET` non deve mai passare dalla conversazione.
  L'utente lo inserisce lui (dashboard Vercel o `vercel env add` nel proprio terminale).
  Non chiederlo, non leggerlo da file o dallo schermo, non stamparlo, non scriverlo nel registro.
- **Account e login sono dell'utente**: non creare account, non inserire password. Se serve un login
  (GitHub, Vercel, Web3Forms) lo fa l'utente; tu riprendi da lì.
- Il file `.env.local` è protetto dall'hook `.claude/hooks/protect-files.sh`: non scriverlo con
  Edit/Write. Popolalo con `vercel env pull .env.local` oppure chiedi all'utente di crearlo.
- Dopo modifiche al codice o ai dati: `npm run lint` e `npm run build` prima di pushare.

## Fase 0 — Prerequisiti (passaggi 0.1–0.7)

### Dove gira la sessione

Controlla `echo "$CLAUDE_CODE_REMOTE"`: `true` = **sessione cloud** (claude.ai/code), altrimenti
sessione sul computer dell'utente. In cloud valgono queste differenze, da applicare in tutte le fasi:

| In cloud | Conseguenza |
|---|---|
| La repo è già quella della sessione | 1.1 si verifica e basta; creare altre repo non è possibile |
| Rete limitata (registri npm e GitHub sì, vercel.com no) | niente Vercel CLI: usa il **connettore Vercel** (va abilitato sulla sessione); `check-setup` segna i controlli remoti come "non verificabili" e li fai con il connettore (strumento che legge un URL Vercel) |
| Nessun browser per Claude | 4.2, 5.2, 6.6 li fa l'utente seguendo le istruzioni |
| Nessun accesso ai file del computer dell'utente | le immagini delle opere si caricano dal CMS a fine setup, o l'utente le carica nella repo da GitHub (Add file → Upload files) |
| Nessuna anteprima locale | per 2.9 usa il deploy di anteprima Vercel di un branch (visibile all'utente loggato su Vercel) |
| `.env.local` inutile | i passaggi che lo popolano si chiudono con `✔ non necessario in cloud` |

### Strumenti

Verifica gli strumenti e riassumi all'utente cosa potrai fare tu e cosa farà lui:

| Strumento | Come verificarlo | Abilita |
|---|---|---|
| GitHub CLI | `gh auth status` (in cloud è già autenticata sulla repo della sessione) | 1.1 creare la repo, 4.9 invitare collaboratori |
| Vercel CLI | `vercel --version` e `vercel whoami` (versione vecchia → proponi `npm i -g vercel@latest`); non in cloud | fase 3, env, domini |
| Connettore Vercel (MCP) | ToolSearch `vercel project env` | fase 3, env, domini senza CLI |
| Browser (Claude in Chrome o browser integrato) | tool `mcp__claude-in-chrome__*` / `mcp__Claude_Browser__*` | 4.2, 5.2, 6.6 (solo campi non segreti) |
| Connettore Gmail | ToolSearch `gmail search` | 5.3 recuperare la chiave Web3Forms, 5.6 verificare la ricezione |

Se manca uno strumento utile, dillo e indica come aggiungerlo (login CLI eseguito dall'utente,
impostazioni connettori di claude.ai, `/mcp`), proponendo comunque la strada manuale.
I login (`gh auth login`, `vercel login`) li esegue l'utente nel proprio terminale.

### Vincoli del piano Vercel Hobby (0.4)

Spiegali e fatti confermare esplicitamente; la scelta del piano è dell'utente:
- **Solo uso non commerciale**: il sito può essere una vetrina delle opere; pubblicizzarne o gestirne
  la vendita richiede il piano Pro (https://vercel.com/docs/limits/fair-use-guidelines#commercial-usage).
  Il form contatti ha l'oggetto "Acquisto opera": su Hobby l'utente può volerlo togliere (in 2.3).
- **Un solo account che modifica il sito**: con repo privata, Vercel Hobby pubblica solo i commit
  del proprietario dell'account. GitHub, Vercel e login al CMS devono essere della stessa persona;
  se a gestire i contenuti è un altro account GitHub servono Pro o repo pubblica (impatta 4.9).
- **Repo in un account personale**, non in un'organizzazione (Hobby non pubblica repo private di organizzazioni).

### Domande (0.7)

Per 0.7 chiedi **in un solo messaggio**: nome dell'artista (e titolo del sito se diverso); nome,
proprietario e visibilità della repo (privata consigliata, in un account personale); sezioni del
portfolio (es. "Pittura, Disegno, Fotografia"); email che deve ricevere i messaggi del form;
chi gestirà i contenuti (il proprietario stesso, consigliato su Hobby); dominio personalizzato sì/no. Le risposte mancanti restano domande aperte da
riproporre al passaggio che le richiede.

Criteri di completamento della fase 0:

| Passaggio | Chiudi con `[x]` solo se |
|---|---|
| 0.1 | la sessione è aperta sulla repo del portfolio (`package.json` del template e `.claude/skills/setup` presenti), sul computer o in cloud |
| 0.2 | `npm install` terminato senza errori (`node_modules` presente) |
| 0.3 | username GitHub del proprietario verificato (`gh api user --jq .login` o conferma); è un account personale |
| 0.4 | account Vercel collegato a quello stesso GitHub (conferma dell'utente); vincoli Hobby spiegati e confermati, oppure piano Pro |
| 0.5 | `gh auth status` ok, **oppure** l'utente sceglie esplicitamente la strada manuale per repo e inviti |
| 0.6 | `vercel whoami` ok o connettore Vercel risponde, **oppure** l'utente sceglie esplicitamente la dashboard |
| 0.7 | tutte le 6 domande hanno una risposta (anche "decido dopo" per form e dominio: verranno richieste in 5.1 / 6.1) |

## Fasi 1–7 — delega alle skill dedicate

| Fase | Passaggi | Skill | Prerequisiti |
|---|---|---|---|
| 1. Repository | 1.1–1.3 | `/setup-repo` | fase 0 |
| 2. Contenuti | 2.1–2.9 | `/setup-content` | 0.2 |
| 3. Deploy Vercel | 3.1–3.4 | `/setup-vercel` | 1.2 (repo su GitHub) |
| 4. CMS | 4.1–4.10 | `/setup-cms` | 3.3 (URL di produzione) |
| 5. Form contatti (opz.) | 5.1–5.6 | `/setup-contact-form` | 3.1 (progetto Vercel) |
| 6. Dominio (opz.) | 6.1–6.7 | `/setup-domain` | fase 4 chiusa |
| 7. Statistiche (opz.) | 7.1 | — (vedi sotto) | 3.2 |

Invoca ogni skill con il tool Skill e segui i suoi passaggi; chiudi nel registro ogni passaggio
con i criteri indicati nella skill. Tra una fase e l'altra una riga di stato
("Fase 1 chiusa: 2/2 ✔. Prossima: contenuti, passaggio 2.1.").

**7.1** — chiedi se vuole Web Analytics e Speed Insights (il codice è già pronto). Se sì:
Vercel → progetto → tab **Analytics** → Enable, e tab **Speed Insights** → Enable (MANUALE);
verifica con l'utente che risultino attivi. Se no: `[-]`.

## Fase 8 — Chiusura

- **8.1** `npm run check-setup`: nessun ✗ e nessun passaggio `[ ]` oltre a 8.1/8.2. Se ci sono
  ✗ o passaggi aperti, **non chiudere**: torna al primo passaggio aperto.
- **8.2** Riepilogo per l'utente: URL del sito, URL del CMS (`/admin`), chi ha accesso in scrittura,
  passaggi `[-]` scelti (es. niente form o dominio) e come attivarli in futuro (`/setup-contact-form`,
  `/setup-domain`), guida per chi gestisce i contenuti (README → "User guide (CMS)").
  Committa e pusha il registro finale.
