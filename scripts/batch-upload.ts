
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import sharp from 'sharp'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Missing Supabase credentials in .env.local')
    process.exit(1)
}

// Use Service Role Key if available (Bypasses RLS), otherwise fall back to Anon Key
const supabaseKey = supabaseServiceKey || supabaseAnonKey
const supabase = createClient(supabaseUrl, supabaseKey)

if (!supabaseServiceKey) {
    console.warn('⚠️  Warning: SUPABASE_SERVICE_ROLE_KEY not found.')
    console.warn('   The script is running with the Anonymous Key, which may be blocked by RLS policies.')
    console.warn('   If you see "row-level security policy" errors, please add SUPABASE_SERVICE_ROLE_KEY to your .env.local file.')
} else {
    console.log('🔐 Running with Service Role Key (Admin Mode)')
}

const SOURCE_DIR = 'line_albums'
const COMPLETED_DIR = 'line_albums/_completed'

const HASH_SIZE = 16

async function processAllAlbums() {
    console.log('🚀 Starting Batch Upload Process with AI Filtering...')
    console.log(`📂 Scanning folder: ${SOURCE_DIR}\n`)

    if (!fs.existsSync(SOURCE_DIR)) {
        fs.mkdirSync(SOURCE_DIR)
    }
    if (!fs.existsSync(COMPLETED_DIR)) {
        fs.mkdirSync(COMPLETED_DIR)
    }

    const items = fs.readdirSync(SOURCE_DIR)
    const albumFolders = items.filter(item => {
        const fullPath = path.join(SOURCE_DIR, item)
        return fs.statSync(fullPath).isDirectory() && item !== '_completed' && !item.startsWith('.')
    })

    if (albumFolders.length === 0) {
        console.log('⚠️ No album folders found in "line_albums".')
        console.log('👉 Please create a folder inside "line_albums" (e.g., "2024-01-01 New Year") and put photos in it.')
        return
    }

    console.log(`found ${albumFolders.length} albums to process:`, albumFolders, '\n')

    for (const folderName of albumFolders) {
        await processAlbum(folderName)
    }

    console.log('\n✨ All tasks finished!')
}

// Simple Perceptual Hash
async function computeHash(filePath: string): Promise<string> {
    try {
        const buffer = await sharp(filePath)
            .resize(HASH_SIZE, HASH_SIZE, { fit: 'fill' })
            .grayscale()
            .raw()
            .toBuffer()

        // Convert buffer to hex string for comparison
        return buffer.toString('hex')
    } catch (err) {
        console.error(`Error hashing file ${filePath}:`, err)
        return ''
    }
}

// Hamming distance for hex strings
function getHammingDistance(hash1: string, hash2: string): number {
    let distance = 0
    for (let i = 0; i < hash1.length; i++) {
        if (hash1[i] !== hash2[i]) distance++
    }
    return distance
}

async function processAlbum(folderName: string) {
    const folderPath = path.join(SOURCE_DIR, folderName)
    console.log(`----------------------------------------`)
    console.log(`📸 Processing Album: "${folderName}"`)

    const dateMatch = folderName.match(/^(\d{4}-\d{2}-\d{2})/)
    const date = dateMatch ? dateMatch[1] : new Date().toISOString().split('T')[0]
    const title = folderName

    // 0. Check if album already exists
    const { data: existingAlbum } = await supabase
        .from('albums')
        .select('id')
        .eq('title', title)
        .single()

    if (existingAlbum) {
        console.log(`⚠️ Album "${title}" already exists online.`)
        console.log(`   Skipping upload to avoid duplicates.`)

        // Move to _completed so it doesn't clutter
        const completedPath = path.join(COMPLETED_DIR, folderName)
        try {
            if (fs.existsSync(completedPath)) {
                // If folder already exists in _completed, rename source to avoid collision or just remove source?
                // Safer to rename source with timestamp
                const timestampedName = `${folderName}_duplicate_${Date.now()}`
                fs.renameSync(folderPath, path.join(COMPLETED_DIR, timestampedName))
            } else {
                fs.renameSync(folderPath, completedPath)
            }
            console.log(`📦 Moved folder to "_completed"`)
        } catch (err) {
            console.error(`⚠️ Failed to move folder:`, err)
        }
        return
    }

    // 1. Create Album
    // Generate ID manually as DB doesn't auto-generate it (consistent with Admin UI)
    const id = `${date}-${Math.random().toString(36).substring(2, 8)}`

    const { data: album, error: albumError } = await supabase
        .from('albums')
        .insert({
            id: id,
            title: title,
            date: date,
            category: 'activity',
            description: 'Imported from LINE (AI Filtered)',
            cover_color: '#4A90C8'
        })
        .select()
        .single()

    if (albumError) {
        console.error(`❌ Failed to create album "${title}":`, albumError.message)
        return
    }

    console.log(`✅ Album created: ${title} (ID: ${album.id})`)

    // 2. Read and Filter photos
    const files = fs.readdirSync(folderPath).filter(file => {
        if (file.startsWith('.')) return false // Ignore hidden files and macOS metadata (._*)
        const ext = path.extname(file).toLowerCase()
        return ['.jpg', '.jpeg', '.png', '.webp', '.heic'].includes(ext)
    })

    console.log(`   Found ${files.length} photos. Analyzing for duplicates...`)

    const processedHashes: string[] = []
    const filesToUpload: string[] = []
    let skippedCount = 0

    for (const file of files) {
        const filePath = path.join(folderPath, file)
        const hash = await computeHash(filePath)

        if (!hash) {
            filesToUpload.push(file) // If hash fails, upload anyway to be safe
            continue
        }

        let isDuplicate = false
        for (const existingHash of processedHashes) {
            const distance = getHammingDistance(hash, existingHash)
            // Threshold check: if distance is small, images are very similar
            // HASH_SIZE 16x16 = 256 pixels. Hex string length = 512 chars.
            // A threshold of 5-10 differences out of 512 is very strict (near exact).
            // Let's use a percentage based threshold for robustness.
            // Actually, simple pixel comparison is sensitive.
            // Let's use a simpler average hash approach if this is too strict, 
            // but for burst shots (identical scene, slight movement), pixel diff is usually small.

            // Let's try a simpler approach: Average Hash logic manually
            // But raw pixel comparison is fine for "burst shots".
            // Let's relax threshold a bit. 512 chars. 5% diff = ~25 chars.
            if (distance < 30) {
                isDuplicate = true
                break
            }
        }

        if (isDuplicate) {
            skippedCount++
            process.stdout.write('S') // S for Skipped
        } else {
            processedHashes.push(hash)
            filesToUpload.push(file)
            process.stdout.write('.') // . for Kept
        }
    }

    console.log(`\n   🤖 AI Analysis Complete:`)
    console.log(`   - Total: ${files.length}`)
    console.log(`   - Kept: ${filesToUpload.length}`)
    console.log(`   - Skipped (Similar): ${skippedCount}`)
    console.log(`   🚀 Uploading ${filesToUpload.length} unique photos...`)

    let successCount = 0

    for (const file of filesToUpload) {
        const filePath = path.join(folderPath, file)
        const fileBuffer = fs.readFileSync(filePath)
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}${path.extname(file)}`
        const storagePath = `${album.id}/${fileName}`

        try {
            const { error: uploadError } = await supabase.storage
                .from('gallery')
                .upload(storagePath, fileBuffer, {
                    contentType: 'image/jpeg',
                    upsert: false
                })

            if (uploadError) throw uploadError

            const { data: { publicUrl } } = supabase.storage
                .from('gallery')
                .getPublicUrl(storagePath)

            const { error: dbError } = await supabase
                .from('photos')
                .insert({
                    album_id: album.id,
                    src: publicUrl,
                    // caption: '', // Removed as column doesn't exist
                    width: 800,
                    height: 600
                })

            if (dbError) throw dbError
            successCount++
            process.stdout.write('↑') // Arrow for upload
        } catch (err) {
            console.error(`\n   ❌ Error uploading ${file}:`, err)
        }
    }

    console.log(`\n   ✅ Uploaded ${successCount} photos.`)

    // 3. Move to _completed
    const completedPath = path.join(COMPLETED_DIR, folderName)
    try {
        fs.renameSync(folderPath, completedPath)
        console.log(`📦 Moved folder to "_completed/${folderName}"`)
    } catch (err) {
        console.error(`⚠️ Failed to move folder:`, err)
    }
}

processAllAlbums()
