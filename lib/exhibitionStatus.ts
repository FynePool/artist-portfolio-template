// Stato di una mostra rispetto a "adesso" (= momento del build: il sito è
// statico, lo stato si aggiorna al deploy successivo).
// Le date sono stringhe a granularità variabile: "2026", "2026-09", "2026-09-15".
// Tutti i confronti avvengono in UTC per essere indipendenti dal fuso della
// macchina di build.

export type ExhibitionStatus = "upcoming" | "current" | "past" | "undated"

interface DateParts {
  year: number
  month?: number
  day?: number
}

function parseParts(date: string): DateParts | null {
  const m = date.trim().match(/^(\d{4})(?:-(\d{1,2}))?(?:-(\d{1,2}))?$/)
  if (!m) return null
  const year = Number(m[1])
  const month = m[2] ? Number(m[2]) : undefined
  const day = m[3] ? Number(m[3]) : undefined
  if (month !== undefined && (month < 1 || month > 12)) return null
  if (day !== undefined && (day < 1 || day > 31)) return null
  return { year, month, day }
}

function startOf(parts: DateParts): Date {
  return new Date(Date.UTC(parts.year, (parts.month ?? 1) - 1, parts.day ?? 1))
}

function endOf(parts: DateParts): Date {
  if (parts.day !== undefined) {
    return new Date(Date.UTC(parts.year, (parts.month ?? 1) - 1, parts.day, 23, 59, 59))
  }
  if (parts.month !== undefined) {
    // giorno 0 del mese successivo = ultimo giorno del mese
    return new Date(Date.UTC(parts.year, parts.month, 0, 23, 59, 59))
  }
  return new Date(Date.UTC(parts.year, 11, 31, 23, 59, 59))
}

export function getExhibitionStatus(
  date?: string,
  dateEnd?: string,
  now: Date = new Date(),
): ExhibitionStatus {
  const startParts = date ? parseParts(date) : null
  if (!startParts) return "undated"
  const endParts = dateEnd ? parseParts(dateEnd) : null
  const start = startOf(startParts)
  const end = endOf(endParts ?? startParts)
  if (now.getTime() < start.getTime()) return "upcoming"
  if (now.getTime() > end.getTime()) return "past"
  return "current"
}

// Intervallo assoluto di una mostra (per l'export ICS).
// null se la data di inizio manca o non è parsabile.
export function exhibitionDateRange(
  date?: string,
  dateEnd?: string,
): { start: Date; end: Date } | null {
  const startParts = date ? parseParts(date) : null
  if (!startParts) return null
  const endParts = dateEnd ? parseParts(dateEnd) : null
  return { start: startOf(startParts), end: endOf(endParts ?? startParts) }
}

const MONTHS_IT = [
  "gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno",
  "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre",
] as const

// "2026-09-15" → "15 settembre 2026"; "2026-09" → "settembre 2026"; "2026" → "2026"
export function formatItalianDate(date: string): string {
  const parts = parseParts(date)
  if (!parts) return date
  const monthName = parts.month !== undefined ? MONTHS_IT[parts.month - 1] : undefined
  if (parts.day !== undefined && monthName) return `${parts.day} ${monthName} ${parts.year}`
  if (monthName) return `${monthName} ${parts.year}`
  return String(parts.year)
}

// Etichetta per il badge; null per mostre passate o senza data.
export function statusBadgeLabel(
  status: ExhibitionStatus,
  date?: string,
  dateEnd?: string,
): string | null {
  if (status === "current") {
    return dateEnd ? `In corso fino al ${formatItalianDate(dateEnd)}` : "In corso"
  }
  if (status === "upcoming" && date) {
    return `Dal ${formatItalianDate(date)}`
  }
  return null
}
