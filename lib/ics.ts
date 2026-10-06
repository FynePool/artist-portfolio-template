import { SITE_URL } from "@/lib/site"
import type { Article } from "@/lib/data"
import { exhibitionDateRange } from "@/lib/exhibitionStatus"
import general from "@/data/general.json"

// Escaping testo RFC 5545 (§3.3.11): backslash, punto e virgola, virgola, newline.
function escapeIcsText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n")
}

function toIcsDate(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}`
}

// Folding RFC 5545: righe oltre 75 ottetti continuano con spazio iniziale.
// Semplificazione a 74 caratteri: sufficiente per testo latino.
function foldLine(line: string): string {
  if (line.length <= 74) return line
  const chunks: string[] = []
  let rest = line
  while (rest.length > 74) {
    chunks.push(rest.slice(0, 74))
    rest = " " + rest.slice(74)
  }
  chunks.push(rest)
  return chunks.join("\r\n")
}

// Evento all-day per una mostra. null se la mostra non ha date parsabili.
export function buildExhibitionIcs(exhibition: Article): string | null {
  const range = exhibitionDateRange(exhibition.date, exhibition.dateEnd)
  if (!range) return null

  // Negli eventi all-day DTEND è esclusivo: giorno successivo all'ultimo giorno
  const dtEnd = new Date(range.end.getTime())
  dtEnd.setUTCDate(dtEnd.getUTCDate() + 1)

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:-//${escapeIcsText(general.artistName)}//Portfolio//IT`,
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${exhibition.id}@${new URL(SITE_URL).hostname}`,
    `DTSTAMP:${toIcsDate(new Date())}T000000Z`,
    `DTSTART;VALUE=DATE:${toIcsDate(range.start)}`,
    `DTEND;VALUE=DATE:${toIcsDate(dtEnd)}`,
    `SUMMARY:${escapeIcsText(exhibition.title)}`,
    ...(exhibition.subtitle ? [`LOCATION:${escapeIcsText(exhibition.subtitle)}`] : []),
    `DESCRIPTION:${escapeIcsText(`Dettagli: ${SITE_URL}/exhibitions`)}`,
    `URL:${SITE_URL}/exhibitions`,
    "END:VEVENT",
    "END:VCALENDAR",
  ]

  return lines.map(foldLine).join("\r\n") + "\r\n"
}
