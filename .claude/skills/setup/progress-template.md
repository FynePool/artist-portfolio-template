# Setup del portfolio — registro dei passaggi

Creato e aggiornato dalla skill `/setup`. Non contiene e non deve contenere segreti.

Stato: `[ ]` da fare · `[x]` fatto **e verificato** (con evidenza dopo `✔`) · `[-]` non voluto (solo dove indicato "opzionale", su decisione esplicita dell'utente).
Esecutore: **AUTO** = lo fa Claude · **MANUALE** = lo fa l'utente · **MISTO** = Claude prepara/verifica, l'utente completa.

## 0. Prerequisiti
- [ ] 0.1 Repo del portfolio aperta in una sessione Claude Code (sul computer o nel cloud) — MANUALE
- [ ] 0.2 Dipendenze installate (`npm install`) — AUTO
- [ ] 0.3 Account GitHub personale del proprietario del sito (lo stesso con cui si userà il CMS) — MANUALE
- [ ] 0.4 Account Vercel collegato allo stesso GitHub; avviso piano Hobby confermato (vetrina sì, vendita → Pro; un solo account che modifica i contenuti) — MANUALE
- [ ] 0.5 GitHub CLI autenticata (`gh auth login`), oppure scelta esplicita della strada manuale — MANUALE
- [ ] 0.6 Vercel: CLI aggiornata e autenticata (`vercel login`) o connettore Vercel autorizzato o scelta della dashboard — MISTO
- [ ] 0.7 Informazioni raccolte: nome artista, sezioni, email del form, gestore contenuti, dominio — MANUALE

## 1. Repository GitHub
- [ ] 1.1 Repo propria come `origin` (creata se serve) — AUTO
- [ ] 1.2 `backend.repo` in `public/admin/config.yml`, commit e push — AUTO
- [ ] 1.3 File del plugin rimossi dalla repo (`plugin/`, `.claude-plugin/`) — AUTO

## 2. Contenuti
- [ ] 2.1 Identità: nome artista, titolo, descrizione, tema (`data/general.json`) — AUTO
- [ ] 2.2 Hero: nome, sottotitolo, immagini desktop/mobile — AUTO
- [ ] 2.3 Biografia, email, social, sottosezioni biografia (`data/bio.json`) — AUTO
- [ ] 2.4 Sezioni: `section1..N` rinominate/aggiunte/rimosse con titolo, ordine, layout — AUTO
- [ ] 2.5 Opere caricate nelle gallerie, oppure decisione esplicita di caricarle dal CMS — AUTO
- [ ] 2.6 Esposizioni, articoli, mostre, premi di esempio sostituiti o rimossi; sezioni vuote nascoste — AUTO
- [ ] 2.7 Icona e logo del CMS sostituiti (marker rimosso, PNG rigenerate) — AUTO
- [ ] 2.8 Colori e font personalizzati, oppure decisione esplicita di tenere quelli del template — AUTO
- [ ] 2.9 Lint e build ok, anteprima locale approvata dall'utente, commit e push — MISTO

## 3. Deploy su Vercel
- [ ] 3.1 Progetto Vercel collegato alla repo GitHub (deploy automatico su push) — AUTO
- [ ] 3.2 Primo deploy di produzione riuscito — AUTO
- [ ] 3.3 URL di produzione registrato qui: — AUTO
- [ ] 3.4 Sito online e sitemap con l'URL di produzione (`check-setup`) — AUTO

## 4. CMS (/admin)
- [ ] 4.1 `base_url` e `site_url` in `config.yml` = URL di produzione — AUTO
- [ ] 4.2 GitHub OAuth App creata (homepage = sito, callback = sito/api/auth) — MISTO
- [ ] 4.3 Client secret generato — MANUALE
- [ ] 4.4 `OAUTH_CLIENT_ID` su Vercel (Production) — AUTO
- [ ] 4.5 `OAUTH_CLIENT_SECRET` su Vercel (Production), inserito dall'utente — MANUALE
- [ ] 4.6 Commit, push e nuovo deploy — AUTO
- [ ] 4.7 `/api/auth` reindirizza a GitHub e `config.yml` pubblicato aggiornato (`check-setup`) — AUTO
- [ ] 4.8 Login a `/admin` riuscito — MANUALE
- [ ] 4.9 Accesso per chi gestisce i contenuti: è il proprietario stesso, oppure collaboratore Write (richiede Pro o repo pubblica) — AUTO
- [ ] 4.10 Invito accettato e primo login del gestore contenuti — MANUALE

## 5. Form contatti (opzionale)
- [ ] 5.1 Decisione: attivare il form? (se no: `[-]` su 5.2–5.6) — MANUALE
- [ ] 5.2 Access key Web3Forms richiesta con l'email destinataria — MISTO
- [ ] 5.3 Chiave recuperata dalla mail — AUTO
- [ ] 5.4 `NEXT_PUBLIC_WEB3FORMS_KEY` su Vercel (Production, Preview, Development) e `vercel env pull .env.local` — AUTO
- [ ] 5.5 Nuovo deploy, form attivo in produzione (`check-setup`) — AUTO
- [ ] 5.6 Messaggio di prova inviato e ricevuto — MISTO

## 6. Dominio personalizzato (opzionale)
- [ ] 6.1 Decisione: dominio personalizzato? (se no: `[-]` su 6.2–6.7) — MANUALE
- [ ] 6.2 Dominio acquistato/disponibile — MANUALE
- [ ] 6.3 Dominio aggiunto al progetto Vercel e impostato come principale — AUTO
- [ ] 6.4 Record DNS impostati presso il registrar, dominio verificato da Vercel — MANUALE
- [ ] 6.5 `config.yml` aggiornato al nuovo URL, push e deploy — AUTO
- [ ] 6.6 URL della GitHub OAuth App aggiornati al nuovo dominio — MISTO
- [ ] 6.7 `check-setup` ok e login a `/admin` sul nuovo dominio — MISTO

## 7. Statistiche Vercel (opzionale)
- [ ] 7.1 Web Analytics e Speed Insights abilitati dalla dashboard Vercel (oppure `[-]`) — MANUALE

## 8. Chiusura
- [ ] 8.1 `npm run check-setup` senza ✗ e nessun altro passaggio `[ ]` aperto — AUTO
- [ ] 8.2 Riepilogo consegnato: URL sito, URL `/admin`, chi ha accesso, guida CMS nel README — AUTO
