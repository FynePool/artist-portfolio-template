// Canale di comunicazione tra il lightbox ("Richiedi informazioni su
// quest'opera") e il form della sezione Contatti.
// - CustomEvent: caso same-page (gallerie e Contact sulla homepage)
// - sessionStorage: caso cross-page (il form legge al mount)
// Modulo client-only: non importarlo in Server Components.

export interface ArtworkInquiry {
  title: string
  medium?: string
  size?: string
}

const EVENT_NAME = "artwork-inquiry"
const STORAGE_KEY = "artwork-inquiry"

export function inquiryMessage(inquiry: ArtworkInquiry): string {
  const detail = [inquiry.medium, inquiry.size].filter(Boolean).join(", ")
  return `Buongiorno, vorrei ricevere informazioni sull'opera "${inquiry.title}"${
    detail ? ` (${detail})` : ""
  }. Grazie.`
}

export function requestArtworkInfo(inquiry: ArtworkInquiry): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(inquiry))
  } catch {
    // storage disabilitato (es. navigazione privata con quota 0): l'evento basta
  }
  window.dispatchEvent(new CustomEvent<ArtworkInquiry>(EVENT_NAME, { detail: inquiry }))
}

export function consumeStoredInquiry(): ArtworkInquiry | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    sessionStorage.removeItem(STORAGE_KEY)
    const parsed = JSON.parse(raw) as Partial<ArtworkInquiry>
    if (typeof parsed.title !== "string" || parsed.title.length === 0) return null
    return {
      title: parsed.title,
      medium: typeof parsed.medium === "string" ? parsed.medium : undefined,
      size: typeof parsed.size === "string" ? parsed.size : undefined,
    }
  } catch {
    return null
  }
}

export function onArtworkInquiry(
  callback: (inquiry: ArtworkInquiry) => void,
): () => void {
  const handler = (e: Event) => {
    callback((e as CustomEvent<ArtworkInquiry>).detail)
  }
  window.addEventListener(EVENT_NAME, handler)
  return () => window.removeEventListener(EVENT_NAME, handler)
}

export function buildInquiryMailto(email: string, inquiry: ArtworkInquiry): string {
  const subject = encodeURIComponent(`Informazioni opera — ${inquiry.title}`)
  const body = encodeURIComponent(inquiryMessage(inquiry))
  return `mailto:${email}?subject=${subject}&body=${body}`
}
