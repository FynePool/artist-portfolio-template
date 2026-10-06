"use client"

import { useEffect, useState } from "react"
import FadeUp from "./FadeUp"
import content from "@/data/bio.json"
import { consumeStoredInquiry, inquiryMessage, onArtworkInquiry } from "@/lib/contactPrefill"

// Chiave pubblica by design (bundle client). In env per rotazione senza commit.
const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? ""

type Status = "idle" | "pending" | "success" | "error"

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")

  // Precompilazione da "Richiedi informazioni" (lightbox):
  // al mount consuma un'eventuale richiesta cross-page, poi resta in ascolto
  // dell'evento same-page emesso dal lightbox.
  useEffect(() => {
    const apply = (inquiry: Parameters<typeof inquiryMessage>[0]) => {
      setSubject("Acquisto opera")
      setMessage(inquiryMessage(inquiry))
    }
    const stored = consumeStoredInquiry()
    if (stored) apply(stored)
    return onArtworkInquiry(apply)
  }, [])

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus("pending")

    const form = e.currentTarget
    const name = (form.elements.namedItem("name") as HTMLInputElement).value
    const email = (form.elements.namedItem("email") as HTMLInputElement).value
    const subjectValue = (form.elements.namedItem("subject") as HTMLSelectElement).value
    const messageValue = (form.elements.namedItem("body") as HTMLTextAreaElement).value
    const botcheck = (form.elements.namedItem("botcheck") as HTMLInputElement).checked

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          botcheck,
          name,
          email,
          subject: `[Portfolio] ${subjectValue} — da ${name}`,
          message: messageValue,
        }),
      })
      const data = await res.json()
      setStatus(data.success ? "success" : "error")
    } catch {
      setStatus("error")
    }
  }

  return (
    <section id="contatti" className="py-24 px-6">
      <FadeUp className="max-w-md md:max-w-[33.6rem] mx-auto">
        <h2 className="font-serif text-4xl font-light mb-2">Contatti</h2>
        <p className="font-sans text-sm text-muted mb-8">
          Per informazioni su opere, commissioni o mostre.
        </p>

        {WEB3FORMS_KEY === "" ? (
          <p className="font-sans text-sm text-body py-4">
            Scrivimi all&apos;indirizzo indicato qui sotto.
          </p>
        ) : status === "success" ? (
          <p className="font-sans text-sm text-body py-4">
            Messaggio inviato. Ti risponderò il prima possibile.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Honeypot: invisibile agli utenti, i bot lo compilano.
                Web3Forms scarta le submission con botcheck spuntato. */}
            <input
              type="checkbox"
              name="botcheck"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="hidden"
            />
            <div>
              <label htmlFor="name" className="form-label">Nome *</label>
              <input id="name" name="name" type="text" required className="form-field" />
            </div>

            <div>
              <label htmlFor="email" className="form-label">Email *</label>
              <input id="email" name="email" type="email" required className="form-field" />
            </div>

            <div>
              <label htmlFor="subject" className="form-label">Oggetto *</label>
              <select
                id="subject"
                name="subject"
                required
                className="form-field"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              >
                <option value="">Seleziona...</option>
                <option value="Acquisto opera">Acquisto opera</option>
                <option value="Commissione">Commissione</option>
                <option value="Mostra">Mostra</option>
                <option value="Altro">Altro</option>
              </select>
            </div>

            <div>
              <label htmlFor="body" className="form-label">Messaggio *</label>
              <textarea
                id="body"
                name="body"
                required
                rows={5}
                className="form-field resize-none"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <button
                type="submit"
                disabled={status === "pending"}
                className="border border-ink px-6 py-2 text-sm font-sans hover:bg-ink hover:text-white dark:hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === "pending" ? "Invio in corso…" : "Invia messaggio"}
              </button>

              {status === "error" && (
                <p className="font-sans text-sm text-body">
                  Invio non riuscito. Prova a scrivere direttamente all&apos;email indicata sotto.
                </p>
              )}
            </div>
          </form>
        )}

        <p className="font-sans text-sm text-muted mt-6">
          oppure scrivi a{" "}
          <a
            href={`mailto:${content.email}`}
            className="text-ink underline underline-offset-4 hover:text-muted transition-colors"
          >
            {content.email}
          </a>
        </p>
      </FadeUp>
    </section>
  )
}
