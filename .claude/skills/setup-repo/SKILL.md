---
name: setup-repo
description: Fase 1 di /setup (passaggi 1.1–1.3) — crea o collega la repository GitHub privata per un portfolio nato da artist-portfolio-template, allinea backend.repo del CMS e rimuove i file del plugin. Usala quando "origin" punta ancora al template o manca.
---

# Fase 1 — Repo GitHub propria

Il sito e il CMS lavorano su una repo GitHub dell'utente: Vercel la usa per i deploy automatici,
Decap CMS ci committa i contenuti. Serve una repo **propria**, non il template.

Se sei stato invocato da `/setup`, aggiorna `setup-progress.md` dopo ogni passaggio
(regole nel protocollo anti-salto di `/setup`).

## 1.1 Repo propria come `origin` — AUTO (con GitHub CLI) / MANUALE (senza)

Diagnosi:

```bash
git remote -v
gh auth status
```

In una **sessione cloud** la repo è per forza quella della sessione: verifica i criteri e chiudi.

- **origin = repo dell'utente** (creata con "Use this template") → verifica che esista e che
  l'utente abbia permesso di scrittura (`gh repo view OWNER/REPO --json viewerPermission`
  → `ADMIN`/`MAINTAIN`/`WRITE`), poi controlla i criteri e chiudi con `✔ già presente`.
- **origin = `FynePool/artist-portfolio-template`** (template clonato) oppure **nessun git/origin**
  → crea la repo.

### Lo faccio io (GitHub CLI autenticata)

Conferma con l'utente: nome repo, proprietario (il suo account personale), visibilità
(**privata consigliata**, in un **account personale**: Vercel Hobby non pubblica repo private di
organizzazioni). Poi:

```bash
# se manca git
git init -b main && git add -A && git commit -m "Initial commit from artist-portfolio-template"
# se origin punta al template, tienilo come riferimento con un altro nome
git remote rename origin template
# crea la repo e pusha
gh repo create OWNER/NOME --private --source=. --remote=origin --push
```

Il branch deve chiamarsi `main` (configurato in `public/admin/config.yml` → `backend.branch`).
Se l'utente usa un altro nome, aggiorna anche quel campo.

### Autore dei commit (sul computer)

Vercel Hobby con repo privata pubblica solo i commit del proprietario: l'email dell'autore deve
essere riconosciuta da GitHub come sua. Prima di qualunque commit, imposta l'identità **solo per
questa repo** con l'email noreply dell'account (sempre associata all'account):

Leggi login, nome e ID numerico con `gh api user --jq '.login, .name, .id'`, poi:

```bash
git config user.name "NOME VISUALIZZATO"
git config user.email "ID+LOGIN@users.noreply.github.com"
```

Senza GitHub CLI: chiedi all'utente username e ID numerico (https://api.github.com/users/USERNAME → `id`)
oppure l'email principale del suo account GitHub.

Se la repo è nata pushando la storia del template (percorso con `git remote rename`), l'ultimo commit
è dell'autore del template: su Hobby il primo deploy verrà bloccato, e si sblocca da solo con il
commit del passaggio 1.2, fatto con l'identità corretta.

### Passo passo per l'utente (senza GitHub CLI)

Si resta in questa cartella (così `setup-progress.md` non si perde):

1. L'utente apre https://github.com/new → proprietario, nome, visibilità (Private consigliata),
   **nessun** README/.gitignore/licenza (repo vuota) → **Create repository** → ti dà l'URL.
2. Tu esegui (previa conferma):
   ```bash
   # solo se manca git (codice scaricato come zip)
   git init -b main && git add -A && git commit -m "Initial commit from artist-portfolio-template"
   git remote rename origin template   # solo se origin punta al template
   git remote add origin https://github.com/OWNER/NOME.git
   git push -u origin main
   ```
   Se il push chiede credenziali, l'autenticazione la fa l'utente (Git Credential Manager,
   GitHub Desktop o `gh auth login`): non inserire tu token o password.

## 1.2 `backend.repo` nel CMS — AUTO

In `public/admin/config.yml`:

```yaml
backend:
  repo: OWNER/NOME
```

`base_url` / `site_url` restano com'erano: si impostano al passaggio 4.1, quando c'è l'URL di
produzione. Committa (`git commit -m "Configura repo CMS"`) e, previa conferma, pusha.

## 1.3 Rimozione dei file del plugin — AUTO

La cartella `plugin/` e `.claude-plugin/marketplace.json` servono solo a distribuire il plugin
`artist-portfolio` dal template: nella repo dell'artista vanno tolti.

```bash
git rm -r plugin .claude-plugin
git commit -m "Rimuove i file del plugin del template" && git push   # push previa conferma
```

Se li ha già rimossi `/artist-portfolio:setup`, verifica e chiudi con `✔ già presente`.

## Criteri di completamento

| Passaggio | Chiudi con `[x]` solo se |
|---|---|
| 1.1 | `git remote get-url origin` non è il template; `gh repo view` (o l'utente nel browser) conferma che la repo esiste; `git ls-remote origin main` restituisce lo stesso hash di `git rev-parse HEAD` |
| 1.2 | `check-setup` mostra `✓ backend.repo → OWNER/NOME` coerente con origin; il commit è su `origin/main` |
| 1.3 | `plugin/` e `.claude-plugin/` assenti su `origin/main` (`check-setup` senza avviso plugin) |
