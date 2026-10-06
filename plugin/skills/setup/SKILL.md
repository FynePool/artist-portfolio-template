---
name: setup
description: Crea da zero un portfolio d'artista dal template FynePool/artist-portfolio-template — verifica i requisiti (account GitHub e Vercel, connettori), crea la repo privata dal template, crea il progetto Vercel con il nome scelto (nome.vercel.app), mette il sito online e passa al setup guidato dentro la repo (/setup). Usala quando l'utente vuole creare, avviare o mettere online un nuovo portfolio d'artista.
---

# Nuovo portfolio d'artista — avvio

Porti l'utente dal nulla a un sito online su `NOME.vercel.app` con la sua repo GitHub privata,
poi gli passi il testimone per il setup completo, che vive **dentro la repo** (skill `/setup`).

Rispondi nella lingua dell'utente (default: italiano). Un passaggio alla volta.

## Regole

- **Nessun passaggio saltato.** Tieni una todo list con A1–A7. Un passaggio è chiuso solo quando
  la sua **verifica** (indicata sotto) è riuscita; annota l'evidenza (es. "repo mario/portfolio, privata").
- **Conferma prima di ogni azione esterna**: creare la repo, creare il progetto Vercel, commit/push.
- **Account e login sono dell'utente**: non creare account, non inserire password o token.
  Nessun segreto passa dalla chat.
- Il template è `FynePool/artist-portfolio-template`.

## A1 — Requisiti

Presentali **tutti in un solo messaggio**, spiegando perché servono, poi verifica quelli verificabili.

1. **Chi sarà il proprietario.** GitHub, Vercel e login al CMS devono essere **della stessa persona**
   (di norma l'artista). Motivo: con il piano Vercel gratuito (Hobby) e una repo privata, Vercel
   pubblica solo le modifiche fatte dal proprietario dell'account; se il CMS viene usato da un altro
   account GitHub, gli aggiornamenti del sito vengono bloccati. Se più persone devono modificare i
   contenuti servono il piano Pro o una repo pubblica: dillo ora, non a metà setup.
2. **Account GitHub** personale (non un'organizzazione: Hobby non pubblica repo private di organizzazioni).
3. **Account Vercel** (piano Hobby gratuito) **collegato allo stesso account GitHub**
   (Vercel → Account Settings → Authentication / Login Connections) e con l'app GitHub di Vercel
   autorizzata sulle repo (https://github.com/apps/vercel → Configure; "All repositories" è il
   modo più semplice, altrimenti aggiungeremo la nuova repo dopo averla creata).
4. **Avviso piano Hobby** — riportalo con queste parole e chiedi conferma di averlo letto:
   > Il piano Hobby è solo per uso personale non commerciale. Il sito può essere una **vetrina**
   > delle opere; se vuoi pubblicizzarne o gestirne la vendita (prezzi, "acquista", pagamenti)
   > Vercel richiede il piano Pro. La scelta è tua.
   > Dettagli: https://vercel.com/docs/limits/fair-use-guidelines#commercial-usage
5. **Accesso di Claude a Vercel**: connettore Vercel autorizzato (claude.ai → Impostazioni →
   Connettori; in Claude Code anche `/mcp`), oppure — in Claude Code sul computer — Vercel CLI
   con `vercel login` eseguito dall'utente.
6. **Accesso di Claude a GitHub** (consigliato): in Claude Code sul computer, GitHub CLI con
   `gh auth login` eseguito dall'utente → la repo la creo io. Senza, l'utente fa un click su
   "Use this template". Il connettore GitHub è utile ma non indispensabile.
7. **Dove proseguirai il setup** (serve Claude Code): sul computer (terminale o app desktop, consigliato
   se le immagini delle opere sono sul computer) oppure nel cloud su claude.ai/code (piano Pro, Max o
   Team; si installerà la Claude GitHub App sulla nuova repo).
8. Facoltativo: connettore Gmail (per recuperare in automatico la chiave del form contatti).

Verifiche (fai quelle possibili con gli strumenti presenti, senza chiedere credenziali):
- Vercel: connettore → elenco team (prendi il team personale) oppure `vercel whoami`.
- GitHub: `gh auth status` e `gh api user --jq .login`, oppure connettore GitHub (utente corrente).
- Stesso proprietario: lo username GitHub verificato deve essere quello con cui l'utente accede a Vercel
  e con cui accederà al CMS. Chiedilo esplicitamente e annota la risposta.

Chiudi A1 solo con: avviso Hobby confermato, proprietario unico confermato, almeno una strada per
Vercel funzionante (connettore o CLI). Senza accesso a Vercel fermati e spiega come attivarlo.

## A2 — Nome del sito

Chiedi il nome (es. `mario-rossi`): diventa il nome della repo e l'indirizzo `NOME.vercel.app`.
Regole: minuscole, numeri, trattini; inizia con una lettera; massimo 40 caratteri.

Verifica la disponibilità:
- GitHub: `gh repo view OWNER/NOME` deve fallire con "not found" (o connettore: repo inesistente).
- Vercel: `curl -sI https://NOME.vercel.app` → `404` con header `x-vercel-error: DEPLOYMENT_NOT_FOUND`
  ⇒ libero; `200` ⇒ già usato, proponi alternative (`NOME-art`, `NOME-studio`…). Se non puoi fare
  richieste HTTP, la conferma arriva in A4 (dominio effettivamente assegnato).

## A3 — Repo privata dal template

**Lo faccio io (GitHub CLI):**

```bash
gh repo create OWNER/NOME --template FynePool/artist-portfolio-template --private
# la copia dal template è asincrona: attendi che i file siano disponibili (ripeti per ~30 s)
gh api repos/OWNER/NOME/contents/package.json --jq .name
```

**Passo passo (senza GitHub CLI):** l'utente apre
https://github.com/FynePool/artist-portfolio-template/generate → Owner: il suo account →
Repository name: `NOME` → **Private** → **Create repository**, e ti conferma.

Verifica: la repo esiste, è **privata** (`gh repo view OWNER/NOME --json visibility` → `PRIVATE`,
o connettore, o conferma dell'utente dalla pagina della repo) e contiene `package.json`.

Se l'utente proseguirà **sul computer** e hai la shell: chiedi la cartella di destinazione
(es. `~/Documents`) e clona:

```bash
gh repo clone OWNER/NOME "CARTELLA/NOME"    # oppure: git clone https://github.com/OWNER/NOME.git
cd "CARTELLA/NOME"
# autore dei commit = account GitHub del proprietario (requisito Vercel Hobby, vedi A1)
git config user.name "$(gh api user --jq '.name // .login')"
git config user.email "$(gh api user --jq '"\(.id)+\(.login)@users.noreply.github.com"')"
```

## A4 — Progetto Vercel con il nome scelto

**Lo faccio io (connettore Vercel):** individua il team personale (elenco team), poi crea il
progetto collegato alla repo con `projectName` = `NOME` e repo `OWNER/NOME` (tool che crea un
progetto da una repository Git). Se l'errore indica che Vercel non vede la repo: l'utente apre
https://github.com/apps/vercel → Configure → aggiunge `NOME` → riprovi.

**Lo faccio io (Vercel CLI, nella cartella clonata):**

```bash
vercel link --yes --project NOME
vercel git connect
```

**Passo passo (dashboard):** https://vercel.com/new → Import della repo → Project Name `NOME` → Deploy.

Verifica: il progetto esiste ed è collegato a `OWNER/NOME`; leggi i domini del progetto. Se il dominio
assegnato non è `NOME.vercel.app` (nome già preso), dillo e proponi: tenerlo, oppure aggiungere al
progetto un altro `*.vercel.app` libero come dominio.

## A5 — Primo commit: configurazione, registro, rimozione del plugin

Nella nuova repo servono tre modifiche, in **un solo commit** su `main` (questo push avvia anche
il primo deploy di produzione):

1. `public/admin/config.yml` → `backend.repo: OWNER/NOME`.
2. Rimuovere i file del plugin, che nella repo dell'artista non servono: la cartella `plugin/` e
   `.claude-plugin/marketplace.json`.
3. Creare `setup-progress.md` copiando `.claude/skills/setup/progress-template.md` e chiudendo
   con `[x]` ed evidenza **solo** i passaggi verificati qui: 0.3, 0.4 (avviso Hobby confermato e
   proprietario unico), 0.5 e 0.6 (strumenti verificati), 1.1, 1.2, 1.3, 3.1, 3.2, 3.3 (scrivi l'URL),
   3.4 (dopo A6). Tutto il resto resta `[ ]`.

Come:
- **Con la cartella clonata**: modifica i file, `git add -A && git commit -m "Avvio: configura repo, registro setup, rimuove plugin" && git push`.
- **Senza clone** (es. Claude in chat o Cowork): con il connettore GitHub crea/aggiorna e cancella
  i file direttamente su `main`. Se non è disponibile, lascia questi passaggi a `/setup` (resteranno
  `[ ]` nel registro: 1.2 e 1.3 li esegue `/setup-repo`) e il primo deploy di produzione partirà al
  primo push del setup.

## A6 — Sito online

Attendi che il deploy di produzione sia **Ready** (connettore: elenco deployment del progetto; CLI:
`vercel ls`). Verifica che `https://NOME.vercel.app` risponda 200 (`curl -sI`, oppure strumento del
connettore per leggere un URL Vercel, oppure l'utente lo apre). Il sito mostra ancora i contenuti di
esempio: è normale, si sostituiscono nel setup. Aggiorna 3.4 nel registro (commit separato se serve).

## A7 — Passaggio al setup completo

Il resto (contenuti, CMS, form contatti, dominio) lo guida la skill `/setup` contenuta nella repo.
Le skill di una repo si caricano solo in una sessione **aperta su quella repo**: questa sessione non
le vede, quindi serve una nuova sessione. Dai all'utente le istruzioni per la strada scelta in A1:

- **Sul computer:** apri la cartella `CARTELLA/NOME` in Claude Code — terminale: `cd "CARTELLA/NOME" && claude`;
  app desktop: scheda Code → nuova sessione → scegli la cartella — poi scrivi `/setup`.
  (Se non è stata clonata: `git clone https://github.com/OWNER/NOME.git` prima.)
- **Nel cloud:** installa la Claude GitHub App sulla repo (https://github.com/apps/claude → Configure →
  aggiungi `NOME`), apri https://claude.ai/code, avvia una sessione sulla repo `OWNER/NOME`, abilita il
  connettore Vercel per la sessione e scrivi `/setup`. In cloud le immagini delle opere si caricano poi
  dal CMS e i passaggi da browser (es. creare la GitHub OAuth App) li farai tu seguendo le istruzioni.

Chiudi con un riepilogo: URL della repo (privata), URL del sito, passaggi già registrati come fatti,
prossima azione (`/setup`, che riprenderà dal passaggio 0.1/0.2 e poi dai contenuti, 2.1).
