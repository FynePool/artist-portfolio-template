---
name: setup-repo
description: Fase 1 di /setup (passaggi 1.1–1.2) — crea o collega la repository GitHub propria per un portfolio nato da artist-portfolio-template e allinea backend.repo del CMS. Usala quando "origin" punta ancora al template o manca.
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

- **origin = repo dell'utente** (creata con "Use this template") → verifica che esista e che
  l'utente abbia permesso di scrittura (`gh repo view OWNER/REPO --json viewerPermission`
  → `ADMIN`/`MAINTAIN`/`WRITE`), poi controlla i criteri e chiudi con `✔ già presente`.
- **origin = `FynePool/artist-portfolio-template`** (template clonato) oppure **nessun git/origin**
  → crea la repo.

### Lo faccio io (GitHub CLI autenticata)

Conferma con l'utente: nome repo, proprietario (account o organizzazione), visibilità
(**privata consigliata**; Decap funziona con entrambe). Poi:

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

## Criteri di completamento

| Passaggio | Chiudi con `[x]` solo se |
|---|---|
| 1.1 | `git remote get-url origin` non è il template; `gh repo view` (o l'utente nel browser) conferma che la repo esiste; `git ls-remote origin main` restituisce lo stesso hash di `git rev-parse HEAD` |
| 1.2 | `check-setup` mostra `✓ backend.repo → OWNER/NOME` coerente con origin; il commit è su `origin/main` |
