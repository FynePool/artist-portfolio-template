import fs from 'fs'
import path from 'path'

export interface Artwork {
  file: string
  medium?: string
  size?: string
  alt: string
  blurDataURL?: string
  featured?: boolean
}

// Tre stati mutuamente esclusivi (vedi docs/gallery-config-dinamica.md):
//   public   → mostrata in homepage, pagina dedicata attiva, inclusa in sitemap/OG
//   unlisted → nascosta in homepage, pagina dedicata attiva, ancora in sitemap/OG
//   draft    → esclusa a monte da getGalleries(): 404 sul dettaglio, fuori da sitemap/OG
export type GalleryVisibility = 'public' | 'unlisted' | 'draft'

// Impaginazione delle opere (components/Gallery.tsx):
//   masonry → colonne con proporzioni originali (nessun ritaglio)
//   grid-3  → griglia fino a 3 colonne, celle 4:3 con ritaglio
//   grid-2  → griglia fino a 2 colonne, celle 4:3 con ritaglio
export type GalleryLayout = 'masonry' | 'grid-3' | 'grid-2'

export interface GalleryConfig {
  // Anteprima limitata in homepage (con link "Vedi tutte" alla pagina dedicata).
  // Assente/false per default: comportamento invariato (tutte le opere, nessun link).
  enabled: boolean
  limitItems: number
  // Ordine di render (crescente). Assente → coda, tie-break sul nome cartella.
  order: number
  // Assente → 'public' (comportamento invariato).
  visibility: GalleryVisibility
  // Assente → 'masonry'.
  layout: GalleryLayout
  description?: string
}

export interface GallerySection {
  id: string // = nome cartella (slug); i path immagine si costruiscono da qui
  title: string
  subtitle?: string
  works: Artwork[]
  config: GalleryConfig
}

const DEFAULT_LIMIT_ITEMS = 6

// Il nome cartella è lo slug canonico (URL /gallerie/{id}): kebab pulito, niente
// index/underscore. Le cartelle non conformi vengono ignorate con un warning.
const FOLDER_SLUG = /^[a-z0-9-]+$/

function isNonEmptyString(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0
}

function isFiniteNumber(v: unknown): v is number {
  return typeof v === 'number' && Number.isFinite(v)
}

function isPositiveInt(v: unknown): v is number {
  return typeof v === 'number' && Number.isInteger(v) && v > 0
}

function tryReadJson(filePath: string): Record<string, unknown> | undefined {
  if (!fs.existsSync(filePath)) return undefined
  try {
    const parsed = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    return parsed != null && typeof parsed === 'object' ? parsed : undefined
  } catch {
    return undefined
  }
}

function parseVisibility(raw: unknown): GalleryVisibility {
  return raw === 'unlisted' || raw === 'draft' ? raw : 'public' // default sicuro
}

function parseLayout(raw: unknown): GalleryLayout {
  return raw === 'grid-3' || raw === 'grid-2' ? raw : 'masonry'
}

interface ResolvedGallery {
  title: string
  subtitle?: string
  config: GalleryConfig
}

// gallery-config.json vive come file sorella di gallery.json (entry CMS separata:
// due entry Decap non possono condividere lo stesso file senza rischio di sovrascrittura).
// title/subtitle assenti ⇒ fallback minimo su kebabToWords(nome cartella).
function readGalleryConfig(folder: string, folderPath: string): ResolvedGallery {
  const raw = tryReadJson(path.join(folderPath, 'gallery-config.json')) ?? {}
  return {
    title: isNonEmptyString(raw.title) ? raw.title : kebabToWords(folder),
    subtitle: isNonEmptyString(raw.subtitle) ? raw.subtitle : undefined,
    config: {
      enabled: raw.enabled === true,
      limitItems: isPositiveInt(raw.limitItems) ? raw.limitItems : DEFAULT_LIMIT_ITEMS,
      order: isFiniteNumber(raw.order) ? raw.order : Number.POSITIVE_INFINITY,
      visibility: parseVisibility(raw.visibility),
      layout: parseLayout(raw.layout),
      description: isNonEmptyString(raw.description) ? raw.description : undefined,
    },
  }
}

function getBlurs(): Record<string, string> {
  const blursPath = path.join(process.cwd(), 'public', 'assets-opt', 'blurs.json')
  if (!fs.existsSync(blursPath)) return {}
  try {
    return JSON.parse(fs.readFileSync(blursPath, 'utf-8')) as Record<string, string>
  } catch {
    return {}
  }
}

// Gallery folder: public/assets/galleries/{slug}/  (nome cartella = slug URL)
// File:          {index}_{alt-kebab}_{size}_{medium-kebab}.ext
// Size is optional — detected by pattern \d+x\d+
// La convenzione filename resta come fallback per gallerie senza gallery.json.

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif'])

function kebabToWords(s: string): string {
  const words = s.replace(/-/g, ' ').toLowerCase()
  return words.charAt(0).toUpperCase() + words.slice(1)
}

function parseFilename(filename: string): Omit<Artwork, 'file'> {
  const ext = path.extname(filename)
  const base = filename.slice(0, -ext.length)
  const parts = base.split('_')
  const [, ...rest] = parts // drop index

  const alt = kebabToWords(rest[0] ?? base)

  // 4+ parts and third segment is a size (e.g. 80x70)
  if (rest.length >= 3 && /^\d+x\d+$/i.test(rest[1])) {
    return {
      alt,
      size: rest[1].replace(/x/i, ' × ') + ' cm',
      medium: kebabToWords(rest[rest.length - 1]),
    }
  }

  // 3 parts: index, alt, medium
  if (rest.length >= 2) {
    return { alt, medium: kebabToWords(rest[rest.length - 1]) }
  }

  return { alt }
}

interface GalleryJsonEntry {
  file: string
  alt: string
  size?: string
  medium?: string
  featured?: boolean
}

// Hero: public/assets/hero/desktop/ and public/assets/hero/mobile/
// Legacy fallback: files in root of hero/ → desktop only
export interface HeroImages {
  desktop: string[]
  mobile: string[]
}

// CMS stores paths as /assets/hero/… → strip /assets/ so Hero.tsx can prepend it
function normalizeHeroPath(p: unknown): string {
  const s = String(p)
  return s.startsWith('/assets/') ? s.slice('/assets/'.length) : s
}

export function getHeroImages(): HeroImages {
  // JSON source (managed by CMS via data/homepage.json)
  const homepageJsonPath = path.join(process.cwd(), 'data', 'homepage.json')
  if (fs.existsSync(homepageJsonPath)) {
    try {
      const raw = JSON.parse(fs.readFileSync(homepageJsonPath, 'utf-8')) as { hero?: { desktop?: unknown; mobile?: unknown } }
      const heroExists = (p: string) => fs.existsSync(path.join(process.cwd(), 'public', 'assets', p))
      const desktop = Array.isArray(raw.hero?.desktop) ? raw.hero.desktop.map(normalizeHeroPath).filter(heroExists) : []
      const mobile  = Array.isArray(raw.hero?.mobile)  ? raw.hero.mobile.map(normalizeHeroPath).filter(heroExists)  : []
      if (desktop.length > 0 || mobile.length > 0) return { desktop, mobile }
    } catch { /* fall through */ }
  }

  // Filesystem fallback
  const heroDir = path.join(process.cwd(), 'public', 'assets', 'hero')
  if (!fs.existsSync(heroDir)) return { desktop: [], mobile: [] }

  const readSubdir = (sub: string): string[] => {
    const dir = path.join(heroDir, sub)
    if (!fs.existsSync(dir)) return []
    return fs.readdirSync(dir)
      .filter(f => IMAGE_EXTENSIONS.has(path.extname(f).toLowerCase()))
      .sort()
      .map(f => `hero/${sub}/${f}`)
  }

  const desktop = readSubdir('desktop')
  const mobile  = readSubdir('mobile')
  if (desktop.length > 0 || mobile.length > 0) return { desktop, mobile }

  // Legacy fallback: files directly in hero/ → desktop only
  const legacy = fs.readdirSync(heroDir)
    .filter(f => IMAGE_EXTENSIONS.has(path.extname(f).toLowerCase()))
    .sort()
    .map(f => `hero/${f}`)
  return { desktop: legacy, mobile: [] }
}

// Opere da gallery.json (se presente) o fallback su parsing filename.
// Usa `folder` per i path e `path.basename(entry.file)` → il segmento cartella
// nel campo `file` è ignorato a runtime (i rename non richiedono riscrittura).
function readWorks(folder: string, folderPath: string, blurs: Record<string, string>): Artwork[] {
  const galleryJsonPath = path.join(folderPath, 'gallery.json')
  if (fs.existsSync(galleryJsonPath)) {
    const raw = JSON.parse(fs.readFileSync(galleryJsonPath, 'utf-8')) as { items?: GalleryJsonEntry[] }
    // `items` può mancare: una galleria appena creata dal CMS non ha ancora opere e
    // Decap può non serializzare una lista vuota. Senza guardia sarebbe un TypeError
    // che rompe la build.
    return (Array.isArray(raw.items) ? raw.items : []).map(entry => {
      const file = `galleries/${folder}/${path.basename(entry.file)}`
      return {
        file,
        alt: entry.alt,
        size: entry.size ? entry.size.replace(/x/i, ' × ') + ' cm' : undefined,
        medium: entry.medium,
        blurDataURL: blurs[file],
        featured: entry.featured === true,
      }
    })
  }

  return fs.readdirSync(folderPath)
    .filter(f => IMAGE_EXTENSIONS.has(path.extname(f).toLowerCase()))
    .sort()
    .map(filename => {
      const file = `galleries/${folder}/${filename}`
      return { file, ...parseFilename(filename), blurDataURL: blurs[file] }
    })
}

export function getGalleries(): GallerySection[] {
  const galleriesDir = path.join(process.cwd(), 'public', 'assets', 'galleries')
  if (!fs.existsSync(galleriesDir)) return []

  const blurs = getBlurs()

  const sections = fs.readdirSync(galleriesDir)
    .filter(entry => fs.statSync(path.join(galleriesDir, entry)).isDirectory())
    .flatMap(folder => {
      if (!FOLDER_SLUG.test(folder)) {
        console.warn(`Galleria ignorata: "${folder}" non è uno slug valido ([a-z0-9-]).`)
        return []
      }
      const folderPath = path.join(galleriesDir, folder)
      const resolved = readGalleryConfig(folder, folderPath)
      if (resolved.config.visibility === 'draft') return [] // kill-switch: fuori da tutto
      const works = readWorks(folder, folderPath, blurs)
      // Galleria senza opere: fuori da tutto. Evita una sezione vuota in homepage per
      // una galleria appena creata dal CMS o per una cartella orfana (config salvata
      // con uno slug che non corrisponde a nessuna galleria esistente).
      if (works.length === 0) return []
      return [{ id: folder, title: resolved.title, subtitle: resolved.subtitle, works, config: resolved.config }]
    })

  return sections.sort((a, b) =>
    a.config.order - b.config.order || a.id.localeCompare(b.id))
}

// Articles: public/assets/articles/{index}_{slug}/
// Each folder contains: article.json + image files (sorted alphabetically)
export interface ArticleLink {
  text: string
  url: string
  newTab: boolean
}

export interface Article {
  id: string
  title: string
  subtitle?: string
  description?: string
  date?: string
  dateEnd?: string
  imagePosition: 'left' | 'right'
  images: string[]
  link?: ArticleLink
  showInHomepage?: boolean
}

type RawArticleJson = {
  order?: unknown
  date?: unknown
  dateEnd?: unknown
  title?: unknown
  subtitle?: unknown
  description?: unknown
  imagePosition?: unknown
  showInHomepage?: unknown
  images?: unknown
  link?: {
    text?: unknown
    url?: unknown
    newTab?: unknown
  }
}

// "2024", "2024-05", "2024-05-15" → comparable integer (desc = most recent first)
function parseDateScore(date: string): number {
  const parts = date.split('-').map(Number)
  return (parts[0] ?? 0) * 10000 + (parts[1] ?? 0) * 100 + (parts[2] ?? 0)
}

function readArticleLike(dir: string, assetPrefix: string, sortBy: 'order' | 'date-desc' = 'order'): Article[] {
  if (!fs.existsSync(dir)) return []

  const collected: { order: number; article: Article }[] = fs.readdirSync(dir)
    .filter(entry => {
      const stat = fs.statSync(path.join(dir, entry))
      return stat.isDirectory()
    })
    .sort()
    .flatMap(folder => {
      const folderPath = path.join(dir, folder)
      const jsonPath = path.join(folderPath, 'article.json')
      if (!fs.existsSync(jsonPath)) return []

      const slug = folder.replace(/^\d+_/, '')
      const raw = JSON.parse(fs.readFileSync(jsonPath, 'utf-8')) as RawArticleJson

      const images = Array.isArray(raw.images) && (raw.images as unknown[]).length > 0
        ? (raw.images as unknown[]).map(f => `${assetPrefix}/${folder}/${path.basename(String(f))}`)
        : fs.readdirSync(folderPath)
            .filter(f => IMAGE_EXTENSIONS.has(path.extname(f).toLowerCase()))
            .sort()
            .map(f => `${assetPrefix}/${folder}/${f}`)

      const link =
        raw.link != null && typeof raw.link === 'object'
          ? {
              text: String(raw.link.text ?? ''),
              url: String(raw.link.url ?? ''),
              newTab: Boolean(raw.link.newTab),
            }
          : undefined

      return [{
        order: typeof raw.order === 'number' ? raw.order : Infinity,
        article: {
          id: slug,
          title: String(raw.title ?? ''),
          subtitle: raw.subtitle != null ? String(raw.subtitle) : undefined,
          description: raw.description != null ? String(raw.description) : undefined,
          date: raw.date != null ? String(raw.date) : undefined,
          dateEnd: raw.dateEnd != null ? String(raw.dateEnd) : undefined,
          imagePosition: raw.imagePosition === 'right' ? 'right' as const : 'left' as const,
          images,
          link,
          showInHomepage: raw.showInHomepage === true,
        },
      }]
    })

  if (sortBy === 'date-desc') {
    return collected.sort((a, b) => {
      const da = a.article.date ? parseDateScore(a.article.date) : 0
      const db = b.article.date ? parseDateScore(b.article.date) : 0
      return db - da
    }).map(e => e.article)
  }
  return collected.sort((a, b) => a.order - b.order).map(e => e.article)
}

export function getArticles(): Article[] {
  return readArticleLike(
    path.join(process.cwd(), 'public', 'assets', 'articles'),
    'articles',
  )
}

export function getExhibitions(): Article[] {
  return readArticleLike(
    path.join(process.cwd(), 'public', 'assets', 'exhibitions'),
    'exhibitions',
    'date-desc',
  )
}

export interface TimelineEntry {
  year: string
  description: string
}

function readTimeline(dir: string): TimelineEntry[] {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir)
    .filter(entry => fs.statSync(path.join(dir, entry)).isDirectory())
    .flatMap(folder => {
      const jsonPath = path.join(dir, folder, 'entry.json')
      if (!fs.existsSync(jsonPath)) return []
      try {
        const raw = JSON.parse(fs.readFileSync(jsonPath, 'utf-8')) as { anno?: unknown; description?: unknown }
        if (!raw.anno || !raw.description) return []
        return [{ year: String(raw.anno), description: String(raw.description) }]
      } catch { return [] }
    })
    .sort((a, b) => b.year.localeCompare(a.year))
}

export function getMostre(): TimelineEntry[] {
  return readTimeline(path.join(process.cwd(), 'public', 'assets', 'mostre'))
}

export function getPremi(): TimelineEntry[] {
  return readTimeline(path.join(process.cwd(), 'public', 'assets', 'premi'))
}

// Opere marcate "in evidenza" dal CMS, nell'ordine delle gallerie e delle entry.
// Le gallerie senza gallery.json (solo parsing filename) non hanno il campo:
// featured è disponibile solo per le gallerie gestite dal CMS.
export function getFeaturedWorks(): Artwork[] {
  return getGalleries().flatMap((gallery) => gallery.works.filter((w) => w.featured === true))
}
