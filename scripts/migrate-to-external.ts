import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import fs from 'fs'
import { buildExternalKey, extractExternalKeyFromUrl, getExternalPublicUrl, isExternalStorageEnabled, uploadToExternalStorage } from '../utils/storage/external'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
    process.exit(1)
}

if (!isExternalStorageEnabled()) {
    console.error('❌ External storage is not configured. Please set EXTERNAL_* env vars before migrating.')
    process.exit(1)
}

const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const deleteSupabaseAfter = args.includes('--delete-supabase')
const logPath = args.find(a => a.startsWith('--log='))?.split('=')[1] || 'migrate-log.jsonl'
const deleteFromLog = args.find(a => a.startsWith('--delete-from-log='))?.split('=')[1]
const limitArg = args.find(a => a.startsWith('--limit='))?.split('=')[1]
const limit = limitArg ? parseInt(limitArg, 10) : undefined

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function deleteSupabaseFromLog(filePath: string) {
    if (!fs.existsSync(filePath)) {
        console.error(`❌ Log file not found: ${filePath}`)
        process.exit(1)
    }

    const lines = fs.readFileSync(filePath, 'utf-8').split(/\r?\n/).filter(Boolean)
    const keys = new Set<string>()
    for (const line of lines) {
        try {
            const parsed = JSON.parse(line)
            if (parsed?.key) keys.add(parsed.key)
        } catch {
            keys.add(line.trim())
        }
    }

    console.log(`🧹 Deleting ${keys.size} Supabase objects from log...`)
    const allKeys = Array.from(keys)
    const batchSize = 100
    for (let i = 0; i < allKeys.length; i += batchSize) {
        const batch = allKeys.slice(i, i + batchSize)
        const { error } = await supabase.storage.from('gallery').remove(batch)
        if (error) {
            console.error('❌ Delete batch failed:', error.message)
        } else {
            console.log(`✅ Deleted ${Math.min(i + batchSize, allKeys.length)}/${allKeys.length}`)
        }
    }
}

function extractSupabaseKey(url: string) {
    // Typical Supabase public URL: .../storage/v1/object/public/gallery/<key>
    const match = url.match(/\/storage\/v1\/object\/public\/gallery\/(.+)$/)
    if (match?.[1]) {
        return decodeURIComponent(match[1].split('?')[0])
    }
    const fallback = url.split('/gallery/')[1]
    return fallback ? fallback.split('?')[0] : null
}

function isSupabaseGalleryUrl(url: string) {
    return url.includes('/storage/v1/object/public/gallery/') || url.includes('/gallery/')
}

async function migratePhotos() {
    console.log('🚀 Starting migration of photos to external storage...')
    if (dryRun) console.log('🧪 Dry run mode: no DB updates or deletes')

    const pageSize = 1000
    let from = 0
    let migrated = 0
    let skipped = 0
    let errors = 0

    while (true) {
        const { data: photos, error } = await supabase
            .from('photos')
            .select('id, album_id, src, alt')
            .range(from, from + pageSize - 1)

        if (error) throw error
        if (!photos || photos.length === 0) break

        for (const photo of photos) {
            if (limit && migrated >= limit) {
                console.log(`⛔ Reached limit ${limit}, stopping.`)
                return { migrated, skipped, errors }
            }

            const src = photo.src as string

            if (!src || extractExternalKeyFromUrl(src)) {
                skipped++
                continue
            }

            if (!isSupabaseGalleryUrl(src)) {
                skipped++
                continue
            }

            const key = extractSupabaseKey(src)
            if (!key) {
                console.warn(`⚠️ Could not parse Supabase key for photo ${photo.id}`)
                errors++
                continue
            }

            try {
                const res = await fetch(src)
                if (!res.ok) throw new Error(`download failed ${res.status}`)
                const arrayBuffer = await res.arrayBuffer()
                const buffer = Buffer.from(arrayBuffer)
                const contentType = res.headers.get('content-type') || undefined

                const newUrl = await uploadToExternalStorage(key, buffer, contentType)

                if (!dryRun) {
                    fs.appendFileSync(
                        logPath,
                        JSON.stringify({ photoId: photo.id, key, oldSrc: src, newSrc: newUrl }) + '\n',
                        'utf-8'
                    )

                    const { error: updateError } = await supabase
                        .from('photos')
                        .update({ src: newUrl })
                        .eq('id', photo.id)

                    if (updateError) throw updateError
                }

                if (deleteSupabaseAfter && !dryRun) {
                    await supabase.storage.from('gallery').remove([key])
                }

                migrated++
                if (migrated % 50 === 0) {
                    console.log(`✅ Migrated ${migrated} photos...`)
                }
            } catch (err) {
                console.error(`❌ Photo ${photo.id} migrate failed:`, err)
                errors++
            }
        }

        from += pageSize
    }

    return { migrated, skipped, errors }
}

async function migrateAlbumCovers() {
    console.log('🖼️ Updating album cover_photo_url...')
    const { data: albums, error } = await supabase
        .from('albums')
        .select('id, cover_photo_url')
        .not('cover_photo_url', 'is', null)

    if (error) throw error
    if (!albums) return 0

    let updated = 0

    for (const album of albums) {
        const coverUrl = album.cover_photo_url as string | null
        if (!coverUrl) continue
        if (extractExternalKeyFromUrl(coverUrl)) continue
        if (!isSupabaseGalleryUrl(coverUrl)) continue

        const key = extractSupabaseKey(coverUrl)
        if (!key) continue

        const newUrl = getExternalPublicUrl(buildExternalKey(key))
        if (dryRun) {
            console.log(`🧪 Would update cover for ${album.id} -> ${newUrl}`)
            updated++
            continue
        }

        const { error: updateError } = await supabase
            .from('albums')
            .update({ cover_photo_url: newUrl })
            .eq('id', album.id)

        if (updateError) {
            console.error(`❌ Cover update failed for ${album.id}:`, updateError.message)
            continue
        }
        updated++
    }

    return updated
}

async function main() {
    if (deleteFromLog) {
        await deleteSupabaseFromLog(deleteFromLog)
        console.log('✅ Supabase cleanup finished.')
        return
    }

    const stats = await migratePhotos()
    const covers = await migrateAlbumCovers()

    console.log('\n🎉 Migration finished.')
    console.log(`- Photos migrated: ${stats.migrated}`)
    console.log(`- Photos skipped: ${stats.skipped}`)
    console.log(`- Errors: ${stats.errors}`)
    console.log(`- Album covers updated: ${covers}`)
    if (!dryRun) {
        console.log(`- Log written: ${logPath}`)
    }
    if (!dryRun && !deleteSupabaseAfter) {
        console.log('\n⚠️ Supabase files were NOT deleted. After verifying the site, run:')
        console.log(`   npx tsx scripts/migrate-to-external.ts --delete-from-log=${logPath}`)
    }
}

main().catch((err) => {
    console.error(err)
    process.exit(1)
})
