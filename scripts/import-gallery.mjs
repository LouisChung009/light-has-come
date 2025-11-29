import fs from 'node:fs'
import path from 'node:path'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const BASE_DIR = process.argv[2] || 'imports'
const BUCKET = 'gallery'

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

const mimeMap = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
}

const slugify = (str) =>
  str
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

async function ensureAlbum(albumId, title) {
  const { data, error } = await supabase.from('albums').select('id').eq('id', albumId).maybeSingle()
  if (error) throw error
  if (!data) {
    const today = new Date().toISOString().slice(0, 10)
    const { error: insertError } = await supabase.from('albums').insert({
      id: albumId,
      title,
      date: today,
      category: 'import',
      description: '',
      cover_color: 'linear-gradient(135deg, #FFD93D, #FFAAA5)',
    })
    if (insertError) throw insertError
    console.log(`Created album: ${title} (${albumId})`)
  }
}

async function uploadPhoto(albumId, filePath) {
  const ext = path.extname(filePath).toLowerCase()
  const contentType = mimeMap[ext] || 'application/octet-stream'
  const fileName = path.basename(filePath)
  const storagePath = `${albumId}/${fileName}`

  const fileBuffer = await fs.promises.readFile(filePath)
  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, fileBuffer, { contentType, upsert: false })

  if (uploadError && uploadError.message?.includes('exists')) {
    console.log(`Skip existing: ${storagePath}`)
  } else if (uploadError) {
    throw uploadError
  } else {
    console.log(`Uploaded: ${storagePath}`)
  }

  const { data: publicData } = supabase.storage.from(BUCKET).getPublicUrl(storagePath)
  const { error: insertError } = await supabase.from('photos').insert({
    album_id: albumId,
    src: publicData?.publicUrl,
    alt: fileName,
    width: 0,
    height: 0,
  })
  if (insertError) throw insertError
}

async function importAlbum(dirPath) {
  const title = path.basename(dirPath)
  const albumId = slugify(title) || `album-${Date.now()}`
  await ensureAlbum(albumId, title)

  const entries = await fs.promises.readdir(dirPath, { withFileTypes: true })
  for (const entry of entries) {
    if (!entry.isFile()) continue
    const ext = path.extname(entry.name).toLowerCase()
    if (!mimeMap[ext]) {
      console.log(`Skip non-image: ${entry.name}`)
      continue
    }
    const fullPath = path.join(dirPath, entry.name)
    await uploadPhoto(albumId, fullPath)
  }
}

async function main() {
  const basePath = path.resolve(BASE_DIR)
  const exists = fs.existsSync(basePath)
  if (!exists) {
    console.error(`Base directory not found: ${basePath}`)
    process.exit(1)
  }

  const dirs = await fs.promises.readdir(basePath, { withFileTypes: true })
  const albumDirs = dirs.filter((d) => d.isDirectory())
  if (albumDirs.length === 0) {
    console.error(`No subdirectories found under ${basePath}`)
    process.exit(1)
  }

  for (const dir of albumDirs) {
    const dirPath = path.join(basePath, dir.name)
    console.log(`\nImporting album: ${dir.name}`)
    try {
      await importAlbum(dirPath)
    } catch (err) {
      console.error(`Failed on album ${dir.name}:`, err.message || err)
    }
  }

  console.log('\nImport finished.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
