/**
 * Generates optimized thumbnails and blur placeholders for all gallery/article images.
 * Run via: node scripts/generate-thumbs.mjs
 * Hooked as prebuild — outputs to public/assets-opt/ (gitignored).
 *
 * Skips: public/assets/hero/ (handled separately with priority loading)
 * Output: public/assets-opt/{same relative path} + public/assets-opt/blurs.json
 */

import sharp from 'sharp'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const ASSETS_DIR = path.join(ROOT, 'public', 'assets')
const OPT_DIR = path.join(ROOT, 'public', 'assets-opt')

const THUMB_MAX_WIDTH = 1200
const THUMB_QUALITY = 82
const BLUR_PX = 8

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif'])
const SKIP_TOP_DIRS = new Set(['hero'])

async function processImage(srcPath, relPath) {
  const ext = path.extname(relPath).toLowerCase()
  const optPath = path.join(OPT_DIR, relPath)
  fs.mkdirSync(path.dirname(optPath), { recursive: true })

  const src = sharp(srcPath)
  const meta = await src.metadata()
  const needsResize = meta.width && meta.width > THUMB_MAX_WIDTH

  const pipeline = sharp(srcPath).resize(needsResize ? THUMB_MAX_WIDTH : undefined, undefined, { withoutEnlargement: true })

  if (ext === '.png') {
    await pipeline.png({ compressionLevel: 9 }).toFile(optPath)
  } else {
    await pipeline.jpeg({ quality: THUMB_QUALITY }).toFile(optPath)
  }

  const blurBuf = await sharp(srcPath)
    .resize(BLUR_PX)
    .jpeg({ quality: 20 })
    .toBuffer()

  return `data:image/jpeg;base64,${blurBuf.toString('base64')}`
}

async function walk(dir, relBase, blurs) {
  let entries
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true })
  } catch {
    return
  }

  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue

    const fullPath = path.join(dir, entry.name)
    const relPath = relBase ? `${relBase}/${entry.name}` : entry.name
    const topDir = relPath.split('/')[0]

    if (SKIP_TOP_DIRS.has(topDir)) continue

    if (entry.isDirectory()) {
      await walk(fullPath, relPath, blurs)
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase()
      if (!IMAGE_EXTS.has(ext)) continue
      process.stdout.write(`  ${relPath}\n`)
      blurs[relPath] = await processImage(fullPath, relPath)
    }
  }
}

async function main() {
  console.log('Generating optimized images...')
  fs.mkdirSync(OPT_DIR, { recursive: true })

  const blurs = {}
  await walk(ASSETS_DIR, '', blurs)

  fs.writeFileSync(path.join(OPT_DIR, 'blurs.json'), JSON.stringify(blurs, null, 2))
  console.log(`\nDone — ${Object.keys(blurs).length} images processed.`)
}

main().catch(err => { console.error(err); process.exit(1) })
