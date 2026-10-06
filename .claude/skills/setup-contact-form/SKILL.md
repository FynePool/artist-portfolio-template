---
name: setup-contact-form
description: Attiva il form contatti del portfolio con Web3Forms — ottenere la access key, salvarla come NEXT_PUBLIC_WEB3FORMS_KEY su Vercel e in locale, testare l'invio. Usala nella fase 3 di /setup o quando il form mostra solo il link email.
---

# Form contatti (Web3Forms)

`components/Contact.tsx` invia i messaggi a https://api.web3forms.com con la chiave
`NEXT_PUBLIC_WEB3FORMS_KEY`. I messaggi arrivano all'email **registrata su Web3Forms per quella
chiave** (non a `data/bio.json` → `email`, che è solo il link mostrato sotto il form).

Senza chiave il sito funziona lo stesso: al posto del form compare l'invito a scrivere all'email.
Se l'utente non vuole il form, finisci qui.

La chiave è **pubblica by design** (finisce nel bundle del browser): puoi gestirla tu, ma non
ripeterla in chat senza motivo.

## 1. Ottenere la access key

Chiedi a quale email devono arrivare i messaggi (di solito quella dell'artista).

- **Passo passo per l'utente**: apri https://web3forms.com → sezione "Create your Access Key" →
  inserisci l'email → invia. La chiave arriva per email in pochi minuti (controllare lo spam).
- **Lo faccio io (browser)**: se hai Claude in Chrome o il browser integrato, puoi aprire la pagina
  e compilare il campo email. È un invio di dati personali a un servizio esterno: **chiedi conferma
  esplicita** prima di inviare, indicando l'email che userai.

## 2. Recuperare la chiave

- **Lo faccio io (connettore Gmail)**: se il connettore è disponibile e l'email è quella dell'utente,
  chiedi il permesso e cerca la mail di Web3Forms (es. query `from:web3forms` o `web3forms access key`
  negli ultimi giorni); estrai la chiave (formato UUID).
- **Altrimenti**: l'utente copia la chiave dalla mail e te la incolla (è pubblica, va bene).

## 3. Salvare la chiave

Ambienti: **Production, Preview e Development** (così funziona anche nelle anteprime e in locale).

- **Connettore Vercel (MCP)**: crea la variabile `NEXT_PUBLIC_WEB3FORMS_KEY` sul progetto per i tre target.
- **Vercel CLI** (progetto già collegato, vedi `/setup-vercel`):
  ```bash
  vercel env add NEXT_PUBLIC_WEB3FORMS_KEY production
  vercel env add NEXT_PUBLIC_WEB3FORMS_KEY preview
  vercel env add NEXT_PUBLIC_WEB3FORMS_KEY development
  ```
  (ognuno chiede il valore in modo interattivo: puoi passarlo via stdin, es. `printf '%s' "$KEY" | vercel env add ...`;
  per `preview` la CLI può chiedere un branch: vuoto = tutti i branch).
- **Passo passo (dashboard)**: Vercel → progetto → Settings → Environment Variables → Add →
  nome `NEXT_PUBLIC_WEB3FORMS_KEY`, valore, spunta i tre ambienti → Save.

In locale: `vercel env pull .env.local` (non scrivere `.env.local` a mano con Edit/Write: è protetto
dall'hook del progetto). Se il progetto Vercel non esiste ancora, rimanda questo passaggio a dopo
`/setup-vercel` e annotalo.

Le variabili `NEXT_PUBLIC_*` sono incorporate al **build**: serve un nuovo deploy perché la modifica
vada online (`vercel deploy --prod`, redeploy da dashboard, o un nuovo push su `main`).

## 4. Test

1. Sul sito di produzione: sezione Contatti → compila e invia → "Messaggio inviato".
2. Verifica con l'utente che la mail sia arrivata (o, con il connettore Gmail e il suo permesso, cercala tu).
3. Prova anche il pulsante "Richiedi informazioni su quest'opera" nel lightbox di un'opera:
   deve portare al form con oggetto e messaggio precompilati.

Se l'invio fallisce: chiave sbagliata o non presente nel build (controlla che il deploy sia
successivo all'aggiunta della variabile).
