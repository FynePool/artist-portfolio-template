/**
 * Stato del setup iniziale del template: cosa è già personalizzato e cosa manca.
 * Run via: npm run check-setup
 *
 * Solo lettura: non modifica nulla e non stampa mai valori di variabili d'ambiente.
 * Usato dalla skill /setup (.claude/skills/setup) per decidere da dove ripartire.
 */

import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import { createHash } from 'crypto'
import { fileURLToPath } from 'url'

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const TEMPLATE_REPO = 'FynePool/artist-portfolio-template'
const TEMPLATE_ICON_MARKER = 'template-default-icon'

const results = []
const add = (status, area, message, fix) => results.push({ status, area, message, fix })

const read = (rel) => {
  try { return fs.readFileSync(path.join(ROOT, rel), 'utf-8') } catch { return null }
}
const readJson = (rel) => {
  const raw = read(rel)
  if (raw == null) return null
  try { return JSON.parse(raw) } catch { return null }
}
const listDirs = (rel) => {
  try {
    return fs.readdirSync(path.join(ROOT, rel), { withFileTypes: true })
      .filter((d) => d.isDirectory()).map((d) => d.name)
  } catch { return [] }
}

// ── Repository ──────────────────────────────────────────────────────────────
let originRepo = null
try {
  const url = execSync('git remote get-url origin', { cwd: ROOT, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim()
  originRepo = url.replace(/^.*github\.com[:/]/, '').replace(/\.git$/, '')
} catch { /* nessun remote */ }

if (!originRepo) {
  add('todo', 'Repository', 'Nessun remote "origin": il progetto non è collegato a una repo GitHub.', '/setup-repo')
} else if (originRepo.toLowerCase() === TEMPLATE_REPO.toLowerCase()) {
  add('todo', 'Repository', `"origin" punta ancora al template (${TEMPLATE_REPO}).`, '/setup-repo')
} else {
  add('ok', 'Repository', `origin → ${originRepo}`)
}

// ── Identità e contenuti ────────────────────────────────────────────────────
const general = readJson('data/general.json') ?? {}
const homepage = readJson('data/homepage.json') ?? {}
const bio = readJson('data/bio.json') ?? {}

if (general.artistName === 'Nome Artista' || homepage.hero?.name === 'Nome Artista') {
  add('todo', 'Contenuti', 'Nome artista ancora "Nome Artista" (data/general.json, data/homepage.json).', '/setup-content')
} else {
  add('ok', 'Contenuti', `Nome artista: ${general.artistName}`)
}
if (typeof bio.bio === 'string' && bio.bio.startsWith('Lorem ipsum')) {
  add('todo', 'Contenuti', 'Biografia ancora lorem ipsum (data/bio.json).', '/setup-content')
}
if (bio.email === 'info@example.com') {
  add('todo', 'Contenuti', 'Email di contatto ancora info@example.com (data/bio.json).', '/setup-content')
}

const placeholderGalleries = listDirs('public/assets/galleries').filter((d) => /^section\d+$/.test(d))
if (placeholderGalleries.length > 0) {
  add('warn', 'Contenuti', `Gallerie con nome segnaposto: ${placeholderGalleries.join(', ')}.`, '/setup-content')
}

// Cartelle di esempio fornite dal template (public/assets/…)
const TEMPLATE_SAMPLES = [
  'exhibitions/2025-05-lorem-ipsum-dolor',
  'exhibitions/2027-04-15-consectetur-adipiscing',
  'articles/01_lorem-ipsum',
  'mostre/2025-lorem-ipsum-dolor-sit-amet-galleria-lorem-citta',
  'mostre/2024-consectetur-adipiscing-elit-spazio-ipsum-citta',
  'mostre/2023-sed-do-eiusmod-tempor-museo-dolor-citta',
  'premi/2024-premio-lorem-ipsum-1-posto-citta',
]
const samplesLeft = TEMPLATE_SAMPLES.filter((rel) => fs.existsSync(path.join(ROOT, 'public', 'assets', rel)))
if (samplesLeft.length > 0) {
  add('warn', 'Contenuti', `${samplesLeft.length} contenuti di esempio ancora in public/assets/: ${samplesLeft.join(', ')}.`, '/setup-content')
}
// Immagini stock del template riconosciute per contenuto (sha1), non per nome file
const TEMPLATE_HERO_SHA1 = new Set(['adfade93e7b2', '3b306e7608f4', 'c2eb97a8e025'])
const sha1 = (abs) => createHash('sha1').update(fs.readFileSync(abs)).digest('hex').slice(0, 12)
const heroDir = path.join(ROOT, 'public', 'assets', 'hero')
const heroSamples = ['desktop', 'mobile']
  .flatMap((sub) => { try { return fs.readdirSync(path.join(heroDir, sub)).map((f) => path.join(heroDir, sub, f)) } catch { return [] } })
  .filter((abs) => fs.statSync(abs).isFile() && TEMPLATE_HERO_SHA1.has(sha1(abs)))
if (heroSamples.length > 0) {
  add('warn', 'Contenuti', 'Immagini hero ancora quelle stock del template (public/assets/hero/).', '/setup-content')
}

if ((read('app/icon.svg') ?? '').includes(TEMPLATE_ICON_MARKER)) {
  add('warn', 'Contenuti', 'Icona/logo ancora quelli generici del template (app/icon.svg, public/admin/logo.svg).', '/setup-content')
}

// ── CMS (Decap) ─────────────────────────────────────────────────────────────
const cmsConfig = read('public/admin/config.yml') ?? ''
const cmsRepo = /^\s*repo:\s*(\S+)/m.exec(cmsConfig)?.[1]
const cmsBaseUrl = /^\s*base_url:\s*(\S+)/m.exec(cmsConfig)?.[1]

if (!cmsRepo || cmsRepo === 'OWNER/REPO') {
  add('todo', 'CMS', 'backend.repo in public/admin/config.yml è ancora OWNER/REPO.', '/setup-cms')
} else if (originRepo && cmsRepo.toLowerCase() !== originRepo.toLowerCase()) {
  add('warn', 'CMS', `backend.repo (${cmsRepo}) diverso da origin (${originRepo}).`, '/setup-cms')
} else {
  add('ok', 'CMS', `backend.repo → ${cmsRepo}`)
}
if (!cmsBaseUrl || cmsBaseUrl.includes('YOUR-SITE')) {
  add('todo', 'CMS', 'backend.base_url / site_url in public/admin/config.yml sono ancora YOUR-SITE.', '/setup-cms')
} else {
  add('ok', 'CMS', `base_url → ${cmsBaseUrl}`)
}
add('info', 'CMS', 'OAUTH_CLIENT_ID / OAUTH_CLIENT_SECRET vanno impostate su Vercel (Production): non verificabile da qui.', '/setup-cms')

// ── Vercel ──────────────────────────────────────────────────────────────────
const vercelProject = readJson('.vercel/project.json')
if (vercelProject) {
  add('ok', 'Vercel', 'Progetto collegato localmente (.vercel/project.json).')
} else {
  add('info', 'Vercel', 'Nessun .vercel/project.json: progetto non collegato con la CLI (ok se gestito da dashboard o connettore).', '/setup-vercel')
}

// ── Form contatti ───────────────────────────────────────────────────────────
const envLocal = read('.env.local') ?? ''
if (/^NEXT_PUBLIC_WEB3FORMS_KEY=\S+/m.test(envLocal)) {
  add('ok', 'Form contatti', 'NEXT_PUBLIC_WEB3FORMS_KEY presente in .env.local (verifica anche su Vercel).')
} else {
  add('warn', 'Form contatti', 'NEXT_PUBLIC_WEB3FORMS_KEY assente in .env.local: in locale il form mostra solo il link email.', '/setup-contact-form')
}

// ── Output ──────────────────────────────────────────────────────────────────
const ICON = { ok: '✓', todo: '✗', warn: '!', info: 'i' }
let currentArea = null
for (const r of results) {
  if (r.area !== currentArea) {
    currentArea = r.area
    console.log(`\n${r.area}`)
  }
  console.log(`  ${ICON[r.status]} ${r.message}${r.fix && r.status !== 'ok' ? `  → ${r.fix}` : ''}`)
}
const todo = results.filter((r) => r.status === 'todo').length
const warn = results.filter((r) => r.status === 'warn').length
console.log(`\n${todo === 0 ? 'Nessun passaggio bloccante.' : `${todo} passaggi da completare`}${warn ? `, ${warn} avvisi` : ''}.`)
