// Builder puri per il markup schema.org (JSON-LD). Nessun JS client: il risultato
// viene serializzato a build-time da <JsonLd> in uno <script type="application/ld+json">.
import { SITE_URL } from "@/lib/site"
import type { Article, Artwork, GallerySection } from "@/lib/data"
import bio from "@/data/bio.json"
import general from "@/data/general.json"

const ARTIST_NAME = general.artistName

// bio.bio usa "\n" per i paragrafi e "_corsivo_" per l'enfasi: per la description
// del markup serve testo piano su una riga sola.
function plainBio(text: string): string {
  return text
    .replace(/_([^_]+)_/g, "$1")
    .replace(/\s*\n\s*/g, " ")
    .trim()
}

// "80 × 70 cm" → { height: "80 cm", width: "70 cm" }. Ordine convenzionale altezza × larghezza.
function parseSize(size?: string): { height?: string; width?: string } {
  if (!size) return {}
  const parts = size.split("×").map((p) => p.trim())
  if (parts.length !== 2) return {}
  const unit = /\d+\s*([a-z]+)/i.exec(parts[1])?.[1] ?? ""
  const height = /^\d+/.exec(parts[0])?.[0]
  const width = /^\d+/.exec(parts[1])?.[0]
  return {
    height: height ? `${height} ${unit}`.trim() : undefined,
    width: width ? `${width} ${unit}`.trim() : undefined,
  }
}

export function buildPersonSchema(image?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: ARTIST_NAME,
    url: SITE_URL,
    jobTitle: "Artista",
    sameAs: Object.values(bio.social).filter(Boolean),
    image,
    description: plainBio(bio.bio),
  }
}

export function buildExhibitionEventSchema(exhibition: Article) {
  return {
    "@context": "https://schema.org",
    "@type": "ExhibitionEvent",
    name: exhibition.title,
    description: exhibition.subtitle,
    url: `${SITE_URL}/exhibitions`,
    startDate: exhibition.date,
    endDate: exhibition.dateEnd ?? exhibition.date,
  }
}

export function buildVisualArtworkSchema(artwork: Artwork, gallery: GallerySection) {
  const { height, width } = parseSize(artwork.size)
  return {
    "@context": "https://schema.org",
    "@type": "VisualArtwork",
    name: artwork.alt,
    artMedium: artwork.medium,
    image: `${SITE_URL}/assets/${artwork.file}`,
    creator: { "@type": "Person", name: ARTIST_NAME },
    isPartOf: { "@type": "Collection", name: gallery.title },
    height,
    width,
  }
}
