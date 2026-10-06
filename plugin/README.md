# Artist Portfolio

Crea da zero il sito portfolio di un artista partendo dal template open source
[FynePool/artist-portfolio-template](https://github.com/FynePool/artist-portfolio-template):
gallerie di opere, esposizioni, biografia, form contatti e un pannello `/admin` per aggiornare i
contenuti senza toccare codice.

*English: creates an artist portfolio website from an open-source Next.js template — a private
GitHub repository in the user's account and a live site on Vercel (`name.vercel.app`) — then hands
off to a guided setup (content, CMS login, contact form, custom domain) that lives in the new repository.*

## Come si usa

Scrivi `/artist-portfolio:setup` (o chiedi a Claude di creare un nuovo portfolio). Claude:

1. elenca e verifica i requisiti: account GitHub personale, account Vercel collegato allo stesso
   GitHub, accesso di Claude a Vercel (connettore o CLI), avviso sui limiti del piano Vercel Hobby;
2. ti fa scegliere il nome del sito, che diventa il nome della repo e l'indirizzo `nome.vercel.app`;
3. crea la tua repo **privata** dal template (con GitHub CLI, oppure ti guida al pulsante "Use this template");
4. crea il progetto Vercel collegato alla repo e pubblica il sito;
5. fa il primo commit di configurazione e ti spiega come proseguire con `/setup` dentro la repo,
   sul computer o su Claude Code nel cloud.

Ogni azione su account esterni (creare repo o progetti, commit) parte solo dopo la tua conferma.

## Servizi e dati coinvolti

Il plugin contiene solo istruzioni per Claude (una skill): nessun server, script o codice eseguibile.
Claude agisce con gli strumenti che **tu** hai già collegato:

- **GitHub** (GitHub CLI o connettore): legge il tuo username, crea una repo dal template nel tuo account, fa commit nella nuova repo.
- **Vercel** (connettore o CLI): legge i tuoi team e progetti, crea un progetto collegato alla repo, controlla lo stato dei deploy.
- **Rete**: richieste di sola lettura a `https://nome.vercel.app` per verificare disponibilità del nome e sito online.

Il setup successivo, dentro la repo, può usare se lo scegli anche il connettore Gmail (per leggere
la mail con la chiave del form contatti) e il browser (per compilare campi non segreti).

Il plugin non invia dati a servizi diversi da questi, non chiede né memorizza password, token o
segreti, e non crea account per tuo conto.

## Requisiti

- Account GitHub personale e account Vercel (il piano gratuito Hobby va bene per un sito vetrina non commerciale).
- Claude Code (terminale, app desktop o cloud) per il setup completo dopo l'avvio.

Licenza MIT · [Privacy](PRIVACY.md) · [Supporto](https://github.com/FynePool/artist-portfolio-template/issues)
