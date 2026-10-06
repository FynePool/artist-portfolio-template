/**
 * Stato del setup iniziale del template: cosa è già personalizzato e cosa manca.
 * Run via: npm run check-setup            (controlli locali + remoti sul sito di produzione)
 *          npm run check-setup -- --offline (solo controlli locali)
 *
 * Solo lettura: non modifica nulla e non stampa mai valori di variabili d'ambiente.
 * I controlli remoti sono semplici GET verso l'URL di produzione letto da config.yml.
 * Legge anche setup-progress.md (registro dei passaggi tenuto dalla skill /setup) ed
 * elenca i passaggi non ancora completati, inclusi quelli manuali non verificabili da qui.
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
const pluginLeftovers = ['plugin', '.claude-plugin'].filter((rel) => fs.existsSync(path.join(ROOT, rel)))
if (pluginLeftovers.length > 0) {
  add('todo', 'Repository', `File del plugin del template ancora presenti: ${pluginLeftovers.join(', ')} (passaggio 1.3).`, '/setup-repo')
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

// ── Vercel ──────────────────────────────────────────────────────────────────
const vercelProject = readJson('.vercel/project.json')
if (vercelProject) {
  add('ok', 'Vercel', 'Progetto collegato localmente (.vercel/project.json).')
} else {
  add('info', 'Vercel', 'Nessun .vercel/project.json: progetto non collegato con la CLI (ok se gestito da dashboard o connettore).', '/setup-vercel')
}

// ── Form contatti (locale) ──────────────────────────────────────────────────
const envLocal = read('.env.local') ?? ''
if (/^NEXT_PUBLIC_WEB3FORMS_KEY=\S+/m.test(envLocal)) {
  add('ok', 'Form contatti', 'NEXT_PUBLIC_WEB3FORMS_KEY presente in .env.local.')
} else {
  add('info', 'Form contatti', 'NEXT_PUBLIC_WEB3FORMS_KEY assente in .env.local: in locale il form mostra solo il link email.', '/setup-contact-form')
}

// ── Produzione (controlli remoti) ───────────────────────────────────────────
const OFFLINE = process.argv.includes('--offline')
// Sessione cloud di Claude Code: la rete è limitata ad allowlist (*.vercel.app di norma escluso)
const CLOUD_SESSION = process.env.CLAUDE_CODE_REMOTE === 'true'
const site = cmsBaseUrl && !cmsBaseUrl.includes('YOUR-SITE') ? cmsBaseUrl.replace(/\/+$/, '') : null

async function get(url) {
  try {
    const res = await fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(10000) })
    const isRedirect = res.status >= 300 && res.status < 400
    return { status: res.status, location: res.headers.get('location') ?? '', text: isRedirect ? '' : await res.text() }
  } catch {
    return null
  }
}

async function checkProduction() {
  const home = await get(`${site}/`)
  if (CLOUD_SESSION && (!home || home.status === 403)) {
    add('info', 'Produzione', `Sessione cloud: ${site} non raggiungibile dalla rete della sessione, controlli remoti non verificabili da qui. Verificali con il connettore Vercel (lettura di URL Vercel) o aggiungi il dominio alla rete dell'ambiente cloud.`, '/setup')
    return
  }
  if (!home) {
    add('todo', 'Produzione', `${site} non raggiungibile.`, '/setup-vercel')
  } else if (home.status !== 200) {
    add('todo', 'Produzione', `${site} risponde ${home.status}${home.location ? ` → ${home.location}` : ''}: base_url deve essere il dominio principale, senza redirect.`, '/setup-vercel')
  } else {
    add('ok', 'Produzione', `${site} online.`)
    if (home.text.includes('Nome Artista')) {
      add('warn', 'Produzione', 'Il sito online mostra ancora "Nome Artista": contenuti non pubblicati o deploy non aggiornato.', '/setup-content')
    }
    if (home.text.includes('name="botcheck"')) {
      add('ok', 'Produzione', 'Form contatti attivo (chiave Web3Forms presente nel build).')
    } else if (home.text.includes('id="contatti"')) {
      add('warn', 'Produzione', 'Form contatti NON attivo: NEXT_PUBLIC_WEB3FORMS_KEY assente nel build di produzione (o form non voluto).', '/setup-contact-form')
    }
  }

  const sitemap = await get(`${site}/sitemap.xml`)
  if (sitemap?.status === 200 && sitemap.text.includes('localhost')) {
    add('warn', 'Produzione', 'La sitemap usa localhost: URL del sito non risolto al build.', '/setup-vercel')
  }

  const cfg = await get(`${site}/admin/config.yml`)
  if (!cfg || cfg.status !== 200) {
    add('todo', 'Produzione', 'config.yml del CMS non raggiungibile su /admin/config.yml.', '/setup-cms')
  } else if (cfg.text.includes('OWNER/REPO') || cfg.text.includes('YOUR-SITE')) {
    add('todo', 'Produzione', 'Il config.yml pubblicato contiene ancora i segnaposto: serve commit + push + deploy.', '/setup-cms')
  } else if (cmsRepo && !cfg.text.includes(`repo: ${cmsRepo}`)) {
    add('warn', 'Produzione', 'Il config.yml pubblicato è diverso da quello locale: deploy non aggiornato?', '/setup-cms')
  } else {
    add('ok', 'Produzione', 'config.yml del CMS pubblicato e aggiornato.')
  }

  const auth = await get(`${site}/api/auth`)
  if (auth && auth.status >= 300 && auth.status < 400 && auth.location.startsWith('https://github.com/login/oauth/authorize')) {
    add('ok', 'Produzione', '/api/auth reindirizza a GitHub: OAUTH_CLIENT_ID e OAUTH_CLIENT_SECRET presenti in Production.')
    const redirectUri = new URL(auth.location).searchParams.get('redirect_uri')
    if (redirectUri && redirectUri !== `${site}/api/auth`) {
      add('warn', 'Produzione', `redirect_uri inviato a GitHub (${redirectUri}) diverso da ${site}/api/auth.`, '/setup-cms')
    }
  } else if (auth?.text.includes('Errore di configurazione')) {
    add('todo', 'Produzione', 'OAUTH_CLIENT_ID / OAUTH_CLIENT_SECRET mancanti in Production (o deploy precedente alla loro aggiunta).', '/setup-cms')
  } else {
    add('todo', 'Produzione', `/api/auth risposta inattesa (${auth ? auth.status : 'nessuna risposta'}).`, '/setup-cms')
  }
  add('info', 'Produzione', 'Non verificabili da qui: callback della GitHub OAuth App, login reale a /admin, ricezione email del form.')
}

if (!site) {
  add('info', 'Produzione', 'Controlli remoti non eseguiti: URL di produzione non ancora in config.yml (base_url).', '/setup-vercel')
} else if (OFFLINE) {
  add('info', 'Produzione', 'Controlli remoti saltati (--offline).')
} else {
  await checkProduction()
}

// ── Registro passaggi (setup-progress.md) ───────────────────────────────────
const progress = read('setup-progress.md')
const openSteps = []
if (progress == null) {
  add('info', 'Passaggi', 'setup-progress.md non presente: lo crea la skill /setup al primo avvio.', '/setup')
} else {
  const steps = [...progress.matchAll(/^- \[( |x|-)\] (\d+\.\d+) (.+)$/gm)]
    .map(([, mark, id, text]) => ({ mark, id, text: text.split(' — ')[0] }))
  const open = steps.filter((st) => st.mark === ' ')
  const declined = steps.filter((st) => st.mark === '-').length
  const done = steps.filter((st) => st.mark === 'x').length
  // I passaggi della fase 8 (chiusura) si chiudono proprio dopo questo controllo
  const openBeforeClosing = open.filter((st) => !st.id.startsWith('8.'))
  if (open.length === 0) {
    add('ok', 'Passaggi', `Tutti i ${steps.length} passaggi chiusi (${done} fatti, ${declined} non voluti).`)
  } else if (openBeforeClosing.length === 0) {
    add('ok', 'Passaggi', `Restano solo i passaggi di chiusura (${open.map((st) => st.id).join(', ')}): ${done} fatti, ${declined} non voluti.`)
  } else {
    add('todo', 'Passaggi', `${open.length} passaggi aperti su ${steps.length} (${done} fatti, ${declined} non voluti). Primo da fare: ${open[0].id} ${open[0].text}`, '/setup')
    openSteps.push(...open)
  }
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
if (openSteps.length > 0) {
  console.log('\nPassaggi aperti in setup-progress.md')
  for (const st of openSteps) console.log(`  [ ] ${st.id} ${st.text}`)
}
const todo = results.filter((r) => r.status === 'todo').length
const warn = results.filter((r) => r.status === 'warn').length
console.log(`\n${todo === 0 ? 'Nessun controllo bloccante (✗)' : `${todo} controlli non superati (✗)`}${warn ? `, ${warn} avvisi (!)` : ''}.`)
