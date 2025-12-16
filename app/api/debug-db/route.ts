import { NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

export async function GET() {
    const results: Record<string, unknown> = {
        timestamp: new Date().toISOString(),
        DATABASE_URL_EXISTS: !!process.env.DATABASE_URL,
        DATABASE_URL_PREFIX: process.env.DATABASE_URL?.substring(0, 30) + '...',
    }

    try {
        if (!process.env.DATABASE_URL) {
            results.error = 'DATABASE_URL is not set'
            return NextResponse.json(results, { status: 500 })
        }

        const sql = neon(process.env.DATABASE_URL)

        const albumsCount = await sql`SELECT COUNT(*) as count FROM albums`
        const photosCount = await sql`SELECT COUNT(*) as count FROM photos`
        const categoriesCount = await sql`SELECT COUNT(*) as count FROM album_categories`
        const siteContentCount = await sql`SELECT COUNT(*) as count FROM site_content`

        results.albums = albumsCount[0]?.count
        results.photos = photosCount[0]?.count
        results.categories = categoriesCount[0]?.count
        results.siteContent = siteContentCount[0]?.count
        results.status = 'OK'
    } catch (error) {
        results.error = error instanceof Error ? error.message : 'Unknown error'
        results.status = 'ERROR'
    }

    return NextResponse.json(results)
}
