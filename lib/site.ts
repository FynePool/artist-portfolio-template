// Unico punto di verità per l'URL di produzione.
// Regola di progetto: l'URL non deve comparire hardcodato altrove
// (app/layout.tsx lo importa da qui per metadataBase).
//
// Ordine di risoluzione (al build):
// 1. NEXT_PUBLIC_SITE_URL — override esplicito (es. dominio custom non ancora primario)
// 2. VERCEL_PROJECT_PRODUCTION_URL — variabile di sistema Vercel, valorizzata in automatico
//    con il dominio di produzione del progetto (custom domain se configurato, altrimenti *.vercel.app)
// 3. localhost per lo sviluppo locale
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL
  if (explicit) return explicit
  const vercelProduction = process.env.VERCEL_PROJECT_PRODUCTION_URL
  if (vercelProduction) return `https://${vercelProduction}`
  return "http://localhost:3000"
}

export const SITE_URL = resolveSiteUrl().replace(/\/+$/, "")
