/**
 * Migrate banner images from Supabase Storage to Cloudflare R2
 * 
 * Run with: npx tsx scripts/migrate-banners-to-r2.ts
 * 
 * Make sure you have these environment variables set:
 * - EXTERNAL_S3_ENDPOINT
 * - EXTERNAL_S3_BUCKET
 * - EXTERNAL_S3_ACCESS_KEY_ID
 * - EXTERNAL_S3_SECRET_ACCESS_KEY
 * - EXTERNAL_PUBLIC_BASE_URL
 * - DATABASE_URL
 */

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { neon } from '@neondatabase/serverless'
import sharp from 'sharp'

// Banner images to migrate
const banners = [
    {
        id: '3beeb63e-5752-45c1-8192-b8da0c16452e',
        oldUrl: 'https://xgwgwckahctpwyqorokt.supabase.co/storage/v1/object/public/gallery/banners/1764978236828-htbw2zrn8k9.png',
        filename: 'banner-1.webp'
    },
    {
        id: '75461e1d-45da-4256-b51e-2c3b74f9ab10',
        oldUrl: 'https://xgwgwckahctpwyqorokt.supabase.co/storage/v1/object/public/gallery/banners/1764979641076-r0cg1epvnn.JPG',
        filename: 'banner-2.webp'
    }
]

async function migrate() {
    // Check environment variables
    const endpoint = process.env.EXTERNAL_S3_ENDPOINT
    const bucket = process.env.EXTERNAL_S3_BUCKET
    const accessKeyId = process.env.EXTERNAL_S3_ACCESS_KEY_ID
    const secretAccessKey = process.env.EXTERNAL_S3_SECRET_ACCESS_KEY
    const publicBaseUrl = process.env.EXTERNAL_PUBLIC_BASE_URL
    const databaseUrl = process.env.DATABASE_URL

    if (!endpoint || !bucket || !accessKeyId || !secretAccessKey || !publicBaseUrl) {
        console.error('Missing R2 environment variables!')
        console.log('Required:', 'EXTERNAL_S3_ENDPOINT, EXTERNAL_S3_BUCKET, EXTERNAL_S3_ACCESS_KEY_ID, EXTERNAL_S3_SECRET_ACCESS_KEY, EXTERNAL_PUBLIC_BASE_URL')
        process.exit(1)
    }

    if (!databaseUrl) {
        console.error('Missing DATABASE_URL environment variable!')
        process.exit(1)
    }

    const sql = neon(databaseUrl)
    const s3 = new S3Client({
        region: 'auto',
        endpoint,
        credentials: { accessKeyId, secretAccessKey },
        forcePathStyle: true,
    })

    console.log('Starting banner migration...\n')

    for (const banner of banners) {
        console.log(`Processing: ${banner.oldUrl}`)

        try {
            // 1. Download image
            console.log('  Downloading...')
            const response = await fetch(banner.oldUrl)
            if (!response.ok) {
                throw new Error(`Failed to download: ${response.status}`)
            }
            const buffer = await response.arrayBuffer()

            // 2. Compress with sharp (convert to WebP)
            console.log('  Compressing...')
            const compressed = await sharp(Buffer.from(buffer))
                .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
                .webp({ quality: 80 })
                .toBuffer()

            console.log(`  Original: ${(buffer.byteLength / 1024).toFixed(1)} KB`)
            console.log(`  Compressed: ${(compressed.length / 1024).toFixed(1)} KB`)

            // 3. Upload to R2
            console.log('  Uploading to R2...')
            const key = `banners/${banner.filename}`
            await s3.send(new PutObjectCommand({
                Bucket: bucket,
                Key: key,
                Body: compressed,
                ContentType: 'image/webp',
                CacheControl: 'public, max-age=31536000, immutable',
            }))

            const newUrl = `${publicBaseUrl.replace(/\/+$/, '')}/${key}`
            console.log(`  New URL: ${newUrl}`)

            // 4. Update database
            console.log('  Updating database...')
            await sql`UPDATE banner_slides SET media_url = ${newUrl} WHERE id = ${banner.id}`

            console.log('  Done!\n')
        } catch (error) {
            console.error(`  Error: ${error}`)
        }
    }

    console.log('Migration complete!')
}

migrate().catch(console.error)
