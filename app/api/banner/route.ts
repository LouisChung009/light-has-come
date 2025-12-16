import { NextResponse } from 'next/server'
import { getDb } from '@/utils/db'
import { uploadToExternalStorage } from '@/utils/storage/external'
import { getSession } from '@/utils/auth-neon'

// GET: Fetch active banners (public)
export async function GET() {
    try {
        const sql = getDb()
        const banners = await sql`
            SELECT id, title, subtitle, media_url, media_type, link_url 
            FROM banner_slides 
            WHERE is_active = true 
            ORDER BY display_order ASC
        `
        return NextResponse.json(banners)
    } catch (error) {
        console.error('Failed to fetch banners:', error)
        return NextResponse.json({ error: 'Failed to fetch banners' }, { status: 500 })
    }
}

// POST: Upload new banner (requires auth)
export async function POST(request: Request) {
    try {
        const session = await getSession()
        if (!session?.user) {
            return NextResponse.json({ error: '未登入' }, { status: 401 })
        }

        const formData = await request.formData()
        const file = formData.get('file') as File | null
        const title = formData.get('title') as string
        const subtitle = formData.get('subtitle') as string
        const linkUrl = formData.get('linkUrl') as string
        const displayOrder = parseInt(formData.get('displayOrder') as string) || 0

        if (!file) {
            return NextResponse.json({ error: '沒有檔案' }, { status: 400 })
        }

        const mediaType = file.type.startsWith('video/') ? 'video' : 'image'
        const fileExt = file.name.split('.').pop()
        const fileName = `banners/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
        const buffer = new Uint8Array(await file.arrayBuffer())

        // Upload to R2
        const publicUrl = await uploadToExternalStorage(fileName, buffer, file.type)

        // Save to Neon
        const sql = getDb()
        await sql`
            INSERT INTO banner_slides (title, subtitle, media_url, media_type, link_url, display_order, is_active)
            VALUES (${title}, ${subtitle}, ${publicUrl}, ${mediaType}, ${linkUrl || null}, ${displayOrder}, true)
        `

        return NextResponse.json({ ok: true })
    } catch (error) {
        console.error('Banner upload error', error)
        return NextResponse.json({ error: '伺服器錯誤，請稍後再試' }, { status: 500 })
    }
}

