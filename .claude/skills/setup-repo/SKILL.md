---
name: setup-repo
description: Crea o collega la repository GitHub propria per un portfolio nato da artist-portfolio-template e allinea backend.repo del CMS. Usala nella fase 1 di /setup o quando "origin" punta ancora al template o manca.
---

# Repo GitHub propria

Il sito e il CMS lavorano su una repo GitHub dell'utente: Vercel la usa per i deploy automatici,
Decap CMS ci committa i contenuti. Serve una repo **propria**, non il template.

## Diagnosi

```bash
git remote -v
gh auth status
```

- **origin = repo dell'utente** (creata con "Use this template" su GitHub) → niente da creare:
  verifica solo che l'utente abbia permesso di push (`gh repo view OWNER/REPO --json viewerPermission`),
  poi vai a "Allinea il CMS".
- **origin = `FynePool/artist-portfolio-template`** (clonato il template) oppure **nessun git/origin**
  → crea la repo (sotto).

## Crea la repo

### Lo faccio io (GitHub CLI autenticata)

Chiedi e conferma: nome repo, proprietario (account personale o organizzazione), visibilità
(**privata consigliata**: la repo contiene i contenuti del sito; Decap funziona con entrambe).
Poi:

```bash
# se manca git
git init -b main && git add -A && git commit -m "Initial commit from artist-portfolio-template"
# se origin punta al template, tienilo come riferimento con un altro nome
git remote rename origin template
# crea la repo e pusha
gh repo create OWNER/NOME --private --source=. --remote=origin --push
```

Il branch deve chiamarsi `main` (è quello configurato in `public/admin/config.yml` → `backend.branch`).
Se l'utente usa un altro nome, aggiorna anche quel campo.

### Passo passo per l'utente (senza GitHub CLI)

1. Apri https://github.com/FynePool/artist-portfolio-template → **Use this template** → **Create a new repository**.
2. Scegli proprietario, nome, visibilità (Private consigliata) → **Create repository**.
3. In locale: `git clone https://github.com/OWNER/NOME.git` e apri quella cartella in Claude Code.

Alternativa se ha già il codice in locale: crea una repo **vuota** su https://github.com/new
(senza README/licenza), poi `git remote set-url origin https://github.com/OWNER/NOME.git && git push -u origin main`.

## Allinea il CMS

Aggiorna `public/admin/config.yml`:

```yaml
backend:
  repo: OWNER/NOME
```

Lascia `base_url` / `site_url` com'erano: si impostano in `/setup-cms`, quando c'è l'URL di produzione.
Committa e pusha (`git commit -m "Configura repo CMS"`), previa conferma.

## Esito

Riporta: URL della repo, visibilità, branch `main`, `backend.repo` aggiornato.
