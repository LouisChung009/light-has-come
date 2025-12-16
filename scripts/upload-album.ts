import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
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

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const mimeMap: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
}

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

async function uploadAlbum(folderPath: string, albumName: string, date: string) {
    console.log(`🚀 Starting upload for album: "${albumName}"`)
    console.log(`🗂️ Source folder: ${folderPath}`)

    // 1. Create Album
    const { data: album, error: albumError } = await supabase
        .from('albums')
        .insert({
            title: albumName,
            date: date,
            category: 'activity',
            description: 'Batch uploaded from script',
            cover_color: '#4A90C8'
        })
        .select()
        .single()

    if (albumError) {
        console.error('❌ Failed to create album:', albumError.message)
        return
    }

    console.log(`✅ Album created with ID: ${album.id}`)

    // 2. Read files
    const files = fs.readdirSync(folderPath).filter(file => {
        const ext = path.extname(file).toLowerCase()
        return Object.hasOwn(mimeMap, ext)
    })

    if (files.length === 0) {
        console.warn('⚠️ No supported images found in folder.')
        return
    }

    console.log(`📸 Found ${files.length} photos to upload...`)

    // 3. Upload photos
    let successCount = 0
    let failCount = 0

    for (const file of files) {
        const filePath = path.join(folderPath, file)
        const fileBuffer = fs.readFileSync(filePath)
        const fileName = `${Date.now()}-${file}`
        const storagePath = `${album.id}/${fileName}`
        const contentType = mimeMap[path.extname(file).toLowerCase()] || 'image/jpeg'

        try {
            // 檢測人臉，避免上傳個人正臉特寫
            const faceFound = await hasFace(fileBuffer)
            if (faceFound) {
                console.log(`⚠️ Skip ${file} (face detected)`)
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

            // Insert into Database
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
            process.stdout.write(`\r✅ Progress: ${successCount}/${files.length} (${Math.round(successCount / files.length * 100)}%)`)

        } catch (err) {
            console.error(`\n❌ Error uploading ${file}:`, err)
            failCount++
        }
    }

    console.log('\n\n🎉 Upload Complete!')
    console.log(`✅ Success: ${successCount}`)
    console.log(`⚠️ Failed: ${failCount}`)
    console.log(`🔗 View Album: https://light-has-come.vercel.app/gallery/${album.id}`)
}

// CLI Arguments
const args = process.argv.slice(2)
const folderArg = args.find(a => a.startsWith('--folder='))?.split('=')[1]
const nameArg = args.find(a => a.startsWith('--name='))?.split('=')[1]
const dateArg = args.find(a => a.startsWith('--date='))?.split('=')[1] || new Date().toISOString().split('T')[0]

if (!folderArg || !nameArg) {
    console.log('\nUsage: npx tsx scripts/upload-album.ts --folder=\"./photos\" --name=\"Album Name\" [--date=\"YYYY-MM-DD\"]')
    process.exit(1)
}

uploadAlbum(folderArg, nameArg, dateArg)
