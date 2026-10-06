import fs from "fs"
import path from "path"

// Formati che satori (il renderer di ImageResponse) supporta con certezza.
// avif/webp esclusi deliberatamente: meglio saltare un'opera che rompere l'OG.
const OG_SAFE_MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
}

// Converte un asset (path relativo a public/assets/) in data URI base64.
// null se il file non esiste o il formato non è sicuro per satori.
export function assetToDataUri(assetRelativePath: string): string | null {
  const abs = path.join(process.cwd(), "public", "assets", assetRelativePath)
  if (!fs.existsSync(abs)) return null
  const mime = OG_SAFE_MIME[path.extname(abs).toLowerCase()]
  if (!mime) return null
  const data = fs.readFileSync(abs)
  return `data:${mime};base64,${data.toString("base64")}`
}

// Prima immagine convertibile di una lista di path relativi a public/assets/.
export function firstUsableDataUri(assetRelativePaths: string[]): string | null {
  for (const p of assetRelativePaths) {
    const uri = assetToDataUri(p)
    if (uri) return uri
  }
  return null
}
