---
name: setup-contact-form
description: Fase 5 di /setup (passaggi 5.1–5.6) — attiva il form contatti del portfolio con Web3Forms ottenendo la access key, salvandola come NEXT_PUBLIC_WEB3FORMS_KEY su Vercel e in locale, e testando l'invio. Usala anche quando il form mostra solo il link email.
---

# Fase 5 — Form contatti (Web3Forms, opzionale)

`components/Contact.tsx` invia i messaggi a https://api.web3forms.com con la chiave
`NEXT_PUBLIC_WEB3FORMS_KEY`. I messaggi arrivano all'email **registrata su Web3Forms per quella
chiave** (non a `data/bio.json` → `email`, che è solo il link mostrato sotto il form).
Senza chiave il sito funziona lo stesso: al posto del form compare l'invito a scrivere all'email.

La chiave è **pubblica by design** (finisce nel bundle del browser): puoi gestirla tu, ma non
ripeterla in chat senza motivo.

Prerequisito: 3.1 chiuso (progetto Vercel). Se sei stato invocato da `/setup`, aggiorna
`setup-progress.md` dopo ogni passaggio.

## 5.1 Decisione — MANUALE

Chiedi esplicitamente: "Vuoi attivare il form di contatto? Senza, i visitatori vedranno solo
l'indirizzo email." Solo con un "no" esplicito: `[-]` su 5.1–5.6 e fine fase.
Se sì, chiedi a quale email devono arrivare i messaggi (se non già raccolta al 0.7).

## 5.2 Richiesta access key — MISTO

- **Lo faccio io (browser, solo sul computer)**: con Claude in Chrome o il browser integrato apri https://web3forms.com,
  sezione "Create your Access Key", e compila l'email. È un invio di dati personali a un servizio
  esterno: **chiedi conferma esplicita** indicando l'email che userai, poi invia.
- **Passo passo**: l'utente apre https://web3forms.com → "Create your Access Key" → inserisce
  l'email → invia. La chiave arriva per email in pochi minuti (controllare lo spam).

## 5.3 Recupero chiave — AUTO (connettore Gmail) / MANUALE

- **Lo faccio io (Gmail)**: se il connettore è disponibile e la casella è quella dell'utente, chiedi
  il permesso e cerca la mail di Web3Forms (es. `from:web3forms` o `web3forms access key`, ultimi
  giorni); estrai la chiave (formato UUID).
- **Altrimenti**: l'utente copia la chiave dalla mail e te la incolla (è pubblica, va bene).

## 5.4 Variabile su Vercel e in locale — AUTO

`NEXT_PUBLIC_WEB3FORMS_KEY` su **Production, Preview e Development**:

- **Connettore Vercel**: crea la variabile sul progetto per i tre target.
- **Vercel CLI** (progetto collegato):
  ```bash
  printf '%s' "$KEY" | vercel env add NEXT_PUBLIC_WEB3FORMS_KEY production
  printf '%s' "$KEY" | vercel env add NEXT_PUBLIC_WEB3FORMS_KEY preview
  printf '%s' "$KEY" | vercel env add NEXT_PUBLIC_WEB3FORMS_KEY development
  ```
  (per `preview` la CLI può chiedere un branch: vuoto = tutti i branch).
- **Passo passo (dashboard)**: Vercel → progetto → Settings → Environment Variables → Add →
  nome, valore, spunta i tre ambienti → Save.

Sul computer: `vercel env pull .env.local` (non scrivere `.env.local` con Edit/Write: è protetto
dall'hook del progetto). Senza CLI collegata, l'utente può creare `.env.local` da `.env.example`.
In cloud `.env.local` non serve: chiudi quella parte con `✔ non necessario in cloud`.

## 5.5 Nuovo deploy e verifica — AUTO

Le variabili `NEXT_PUBLIC_*` sono incorporate al **build**: serve un nuovo deploy
(push su `main`, redeploy da dashboard/connettore o `vercel deploy --prod`). Poi:

```bash
npm run check-setup
```
deve mostrare `✓ Form contatti attivo (chiave Web3Forms presente nel build)`.

## 5.6 Messaggio di prova — MISTO

1. Invio: sul sito di produzione, sezione Contatti → compila (nome "Test setup", email
   dell'utente, oggetto "Altro", messaggio di prova) → invia. Puoi farlo tu via browser
   **previa conferma** (è l'invio di un form), oppure lo fa l'utente. Deve comparire "Messaggio inviato".
2. Ricezione: l'utente conferma che la mail è arrivata, oppure — con il connettore Gmail e il suo
   permesso — la cerchi tu.
3. Prova anche "Richiedi informazioni su quest'opera" nel lightbox di un'opera: deve portare al
   form con oggetto e messaggio precompilati.

Se l'invio fallisce: chiave errata o assente dal build (deploy precedente all'aggiunta della variabile).

## Criteri di completamento

| Passaggio | Chiudi con `[x]` solo se |
|---|---|
| 5.1 | risposta esplicita dell'utente registrata |
| 5.2 | Web3Forms ha confermato l'invio della chiave all'email |
| 5.3 | chiave in formato UUID disponibile |
| 5.4 | variabile presente nei tre ambienti (connettore o `vercel env ls`: solo nomi); `.env.local` aggiornato |
| 5.5 | `check-setup`: form attivo ✓ |
| 5.6 | mail di prova ricevuta (conferma utente o Gmail) |
