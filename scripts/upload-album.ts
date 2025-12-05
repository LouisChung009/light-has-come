
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials in .env.local')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function uploadAlbum(folderPath: string, albumName: string, date: string) {
    console.log(`🚀 Starting upload for album: "${albumName}"`)
    console.log(`📂 Source folder: ${folderPath}`)

    // 1. Create Album
    const { data: album, error: albumError } = await supabase
        .from('albums')
        .insert({
            title: albumName,
            date: date,
            category: 'activity', // Default category
            description: 'Batch uploaded from LINE',
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
        return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext)
    })

    console.log(`📸 Found ${files.length} photos to upload...`)

    // 3. Upload photos
    let successCount = 0
    let failCount = 0

    for (const [, file] of files.entries()) {
        const filePath = path.join(folderPath, file)
        const fileBuffer = fs.readFileSync(filePath)
        const fileName = `${Date.now()}-${file}`
        const storagePath = `${album.id}/${fileName}`

        try {
            // Upload to Storage
            const { error: uploadError } = await supabase.storage
                .from('gallery')
                .upload(storagePath, fileBuffer, {
                    contentType: 'image/jpeg', // Simplified, ideally detect mime type
                    upsert: false
                })

            if (uploadError) throw uploadError

            // Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('gallery')
                .getPublicUrl(storagePath)

            // Insert into Database
            const { error: dbError } = await supabase
                .from('photos')
                .insert({
                    album_id: album.id,
                    url: publicUrl,
                    caption: '',
                    width: 800, // Placeholder
                    height: 600 // Placeholder
                })

            if (dbError) throw dbError

            successCount++
            process.stdout.write(`\r⏳ Progress: ${successCount}/${files.length} (${Math.round(successCount / files.length * 100)}%)`)

        } catch (err) {
            console.error(`\n❌ Error uploading ${file}:`, err)
            failCount++
        }
    }

    console.log('\n\n🎉 Upload Complete!')
    console.log(`✅ Success: ${successCount}`)
    console.log(`❌ Failed: ${failCount}`)
    console.log(`🔗 View Album: https://light-has-come.vercel.app/gallery/${album.id}`)
}

// CLI Arguments
const args = process.argv.slice(2)
const folderArg = args.find(a => a.startsWith('--folder='))?.split('=')[1]
const nameArg = args.find(a => a.startsWith('--name='))?.split('=')[1]
const dateArg = args.find(a => a.startsWith('--date='))?.split('=')[1] || new Date().toISOString().split('T')[0]

if (!folderArg || !nameArg) {
    console.log('\nUsage: npx tsx scripts/upload-album.ts --folder="./photos" --name="Album Name" [--date="YYYY-MM-DD"]')
    process.exit(1)
}

uploadAlbum(folderArg, nameArg, dateArg)
