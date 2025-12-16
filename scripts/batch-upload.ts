import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import sharp from 'sharp'
import * as faceapi from 'face-api.js'
import * as tf from '@tensorflow/tfjs'
import { Canvas, Image, ImageData, loadImage } from 'canvas'
import { isExternalStorageEnabled, uploadToExternalStorage } from '../utils/storage/external'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase credentials. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local')
    process.exit(1)
}

// Always use Service Role to bypass RLS for batch operations
const supabase = createClient(supabaseUrl, supabaseServiceKey)
console.log('✅ Running with Service Role Key (Admin Mode)')

// AI 人臉偵測（避免個人正臉特寫）: 使用 face-api + tfjs CPU backend
let faceModelReady = false
const FACE_MODEL_URL = process.env.FACE_MODEL_URL || 'https://justadudewhohacks.github.io/face-api.js/models'
faceapi.env.monkeyPatch({ Canvas: Canvas as any, Image, ImageData } as any)

async function ensureFaceModel() {
    if (faceModelReady) return
    await tf.setBackend('cpu')
    await tf.ready()
    await faceapi.nets.tinyFaceDetector.loadFromUri(FACE_MODEL_URL)
    faceModelReady = true
}

async function hasFace(buffer: Buffer) {
    try {
        await ensureFaceModel()
        const img = await loadImage(buffer)
        const detections = await faceapi.detectAllFaces(img as any, new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.6 }))
        return detections.length > 0
    } catch (err) {
        console.error('⚠️ Face detection failed, skipping detection for this image:', err)
        return false
    }
}

const SOURCE_DIR = 'line_albums'
const COMPLETED_DIR = 'line_albums/_completed'

const HASH_SIZE = 16

// 支援的分類代碼（以資料夾結尾的片段為主，例如 2021-10-09_收穫家庭感恩禮拜_special）
const CATEGORY_ALIASES: Record<string, string> = {
    craft: 'craft',
    手作: 'craft',
    music: 'music',
    worship: 'music',
    音樂: 'music',
    science: 'science',
    科學: 'science',
    outdoor: 'outdoor',
    戶外: 'outdoor',
    special: 'special',
    活動: 'special',
    其他: 'special',
}

function parseFolderMeta(folderName: string) {
    // 規則：date_title_category ；date 取第一個 YYYY-MM-DD（允許 . 或 /），category 為最後一段
    const parts = folderName.split('_').filter(Boolean)
    const datePart = parts.find(p => /(\d{4}[./-]\d{1,2}[./-]\d{1,2})/.test(p))
    const normalizedDate = datePart
        ? normalizeDate(datePart)
        : new Date().toISOString().slice(0, 10)

    const categoryRaw = parts.length > 1 ? parts[parts.length - 1] : ''
    const category = pickCategory(categoryRaw)

    // 標題 = 去掉日期與分類後的剩餘片段；如果空，退回整個資料夾名稱
    const titleParts = parts.filter(p => p !== datePart && p !== categoryRaw)
    const title = titleParts.join(' ').trim() || folderName

    return { title, date: normalizedDate, category }
}

function pickCategory(cat?: string) {
    if (!cat) return 'special'
    const key = cat.toLowerCase()
    return CATEGORY_ALIASES[key] || CATEGORY_ALIASES[cat] || 'special'
}

function normalizeDate(dateStr: string) {
    const cleaned = dateStr.replace(/[./]/g, '-')
    const match = cleaned.match(/(\d{4})-?(\d{1,2})-?(\d{1,2})/)
    if (!match) return new Date().toISOString().slice(0, 10)
    const [, y, m, d] = match
    const month = m.padStart(2, '0')
    const day = d.padStart(2, '0')
    return `${y}-${month}-${day}`
}

async function processAllAlbums() {
    console.log('🚀 Starting Batch Upload Process with AI Filtering...')
    console.log(`🗂️ Scanning folder: ${SOURCE_DIR}\n`)

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
        console.log('📭 No album folders found in "line_albums".')
        console.log('👉 Please create a folder inside "line_albums" (e.g., "2024-01-01 New Year") and put photos in it.')
        return
    }

    console.log(`found ${albumFolders.length} albums to process:`, albumFolders, '\n')

    for (const folderName of albumFolders) {
        await processAlbum(folderName)
    }

    console.log('\n✅ All tasks finished!')
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
    console.log(`📁 Processing Album: "${folderName}"`)

    const meta = parseFolderMeta(folderName)
    const { title, date, category } = meta

    // 0. Check if album already exists
    const { data: existingAlbum } = await supabase
        .from('albums')
        .select('id')
        .eq('title', title)
        .single()

    if (existingAlbum) {
        console.log(`ℹ️ Album "${title}" already exists online.`)
        console.log(`   Skipping upload to avoid duplicates.`)

        // Move to _completed so it doesn't clutter
        const completedPath = path.join(COMPLETED_DIR, folderName)
        try {
            if (fs.existsSync(completedPath)) {
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
    const id = `${date}-${Math.random().toString(36).substring(2, 8)}`

    const { data: album, error: albumError } = await supabase
        .from('albums')
        .insert({
            id: id,
            title: title,
            date: date,
            category: category,
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
        if (file.startsWith('.')) return false
        const ext = path.extname(file).toLowerCase()
        return ['.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif'].includes(ext)
    })

    console.log(`   Found ${files.length} photos. Analyzing for duplicates...`)

    const processedHashes: string[] = []
    const filesToUpload: string[] = []
    let skippedCount = 0

    for (const file of files) {
        const filePath = path.join(folderPath, file)
        const hash = await computeHash(filePath)

        if (!hash) {
            filesToUpload.push(file)
            continue
        }

        let isDuplicate = false
        for (const existingHash of processedHashes) {
            const distance = getHammingDistance(hash, existingHash)
            if (distance < 30) {
                isDuplicate = true
                break
            }
        }

        if (isDuplicate) {
            skippedCount++
            process.stdout.write('S')
        } else {
            processedHashes.push(hash)
            filesToUpload.push(file)
            process.stdout.write('.')
        }
    }

    console.log(`\n   ✅ AI Analysis Complete:`)
    console.log(`   - Total: ${files.length}`)
    console.log(`   - Kept: ${filesToUpload.length}`)
    console.log(`   - Skipped (Similar): ${skippedCount}`)
    console.log(`   🚀 Uploading ${filesToUpload.length} unique photos...`)

    let successCount = 0

    for (const file of filesToUpload) {
        const filePath = path.join(folderPath, file)
        const fileBuffer = fs.readFileSync(filePath)
        const fileExt = path.extname(file).toLowerCase()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}${fileExt}`
        const storagePath = `${album.id}/${fileName}`

        const contentType = (() => {
            switch (fileExt) {
                case '.png': return 'image/png'
                case '.webp': return 'image/webp'
                case '.heic': return 'image/heic'
                case '.heif': return 'image/heif'
                case '.jpeg':
                case '.jpg':
                default: return 'image/jpeg'
            }
        })()

        try {
            // 檢測人臉，避免上傳個人正臉特寫
            const faceFound = await hasFace(fileBuffer)
            if (faceFound) {
                console.log(`\n   ⚠️ Skip ${file} (face detected)`)
                continue
            }

            let publicUrl: string

            if (isExternalStorageEnabled()) {
                publicUrl = await uploadToExternalStorage(storagePath, fileBuffer, contentType)
            } else {
                const { error: uploadError } = await supabase.storage
                    .from('gallery')
                    .upload(storagePath, fileBuffer, {
                        contentType,
                        upsert: false
                    })

                if (uploadError) throw uploadError

                const { data: { publicUrl: supabaseUrl } } = supabase.storage
                    .from('gallery')
                    .getPublicUrl(storagePath)
                publicUrl = supabaseUrl
            }

            const { error: dbError } = await supabase
                .from('photos')
                .insert({
                    album_id: album.id,
                    src: publicUrl,
                    alt: file,
                    width: 800,
                    height: 600
                })

            if (dbError) throw dbError
            successCount++
            process.stdout.write('↑')
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
