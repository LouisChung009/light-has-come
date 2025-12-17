import { NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

// Debug DB endpoint. By default this returns fast estimates using pg_class to avoid heavy COUNTs.
// If you need exact counts, call with `?full=true` (may be slow).
export async function GET(request: Request) {
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

        const url = new URL(request.url)
        const full = url.searchParams.get('full') === 'true'

        if (full) {
            // Exact counts (may be slow) - user requested
            const albumsCount = await sql`SELECT COUNT(*) as count FROM albums`
            const photosCount = await sql`SELECT COUNT(*) as count FROM photos`
            const categoriesCount = await sql`SELECT COUNT(*) as count FROM album_categories`
            const siteContentCount = await sql`SELECT COUNT(*) as count FROM site_content`

            results.albums = albumsCount[0]?.count
            results.photos = photosCount[0]?.count
            results.categories = categoriesCount[0]?.count
            results.siteContent = siteContentCount[0]?.count
            results.status = 'OK'
        } else {
            // Fast estimates using pg_class - cheap and avoids long-running queries
            const q = async (name: string) => {
                const res = await sql`SELECT reltuples::bigint AS estimate FROM pg_class WHERE relname = ${name}`
                return res[0]?.estimate ?? null
            }

            results.albums = await q('albums')
            results.photos = await q('photos')
            results.categories = await q('album_categories')
            results.siteContent = await q('site_content')
            results.status = 'OK (estimates)'
        }
    } catch (error: any) {
        console.error('Debug DB error:', error.stack || error.message || error)
        results.error = 'DB query failed (logged)'
        results.status = 'ERROR'
    }

    return NextResponse.json(results)
}
