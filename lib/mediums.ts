import type { Artwork } from "@/lib/data"

// Chiave di normalizzazione per il confronto: minuscole, spazi compressi.
// L'etichetta mostrata resta quella della prima occorrenza (trim).
export function mediumKey(medium: string): string {
  return medium.trim().toLowerCase().replace(/\s+/g, " ")
}

export function uniqueMediums(works: Artwork[]): string[] {
  const seen = new Map<string, string>()
  for (const work of works) {
    if (!work.medium) continue
    const key = mediumKey(work.medium)
    if (!seen.has(key)) seen.set(key, work.medium.trim())
  }
  return [...seen.values()].sort((a, b) => a.localeCompare(b, "it"))
}

export function filterByMedium(works: Artwork[], medium: string | null): Artwork[] {
  if (medium === null) return works
  const key = mediumKey(medium)
  return works.filter((work) => work.medium !== undefined && mediumKey(work.medium) === key)
}
