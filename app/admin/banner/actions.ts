'use server'

import { getSession } from '@/utils/auth-neon'
import { getDb } from '@/utils/db'
import { uploadToR2, deleteFromR2 } from '@/utils/r2'
import { revalidatePath } from 'next/cache'

export async function updateBannerSlide(formData: FormData) {
    const id = formData.get('id') as string
    if (!id) return { error: '缺少 Banner ID' }

    const session = await getSession()
    if (!session?.user) return { error: '未登入' }

    const title = (formData.get('title') as string) || null
    const subtitle = (formData.get('subtitle') as string) || null
    const linkUrl = (formData.get('linkUrl') as string) || null
    const displayOrder = parseInt((formData.get('displayOrder') as string) || '0', 10) || 0
    const file = formData.get('file') as File | null

    const sql = getDb()

    let mediaUrl: string | null = null
    let mediaType: string | null = null

    if (file && file.size > 0) {
        // Get old file path for deletion
        const existing = await sql`
            SELECT media_url FROM banner_slides WHERE id = ${id}
        `

        // Upload new file to R2
        const ext = file.name.split('.').pop()
        const key = `banners/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
        const buffer = Buffer.from(await file.arrayBuffer())

        const uploadResult = await uploadToR2(key, buffer, file.type)
        if (!uploadResult.success) {
            return { error: uploadResult.error || 'Upload failed' }
        }

        mediaUrl = uploadResult.url!
        mediaType = file.type?.startsWith('video/') ? 'video' : 'image'

        // Delete old file from R2 if exists
        if (existing[0]?.media_url) {
            const oldUrl = existing[0].media_url
            // Extract key from URL (assuming format: BASE_URL/key)
            const baseUrl = process.env.EXTERNAL_PUBLIC_BASE_URL || ''
            if (oldUrl.startsWith(baseUrl)) {
                const oldKey = oldUrl.replace(baseUrl + '/', '')
                await deleteFromR2(oldKey)
            }
        }
    }

    // Build update query dynamically
    if (mediaUrl) {
        await sql`
            UPDATE banner_slides 
            SET title = ${title}, 
                subtitle = ${subtitle}, 
                link_url = ${linkUrl}, 
                display_order = ${displayOrder},
                media_url = ${mediaUrl},
                media_type = ${mediaType}
            WHERE id = ${id}
        `
    } else {
        await sql`
            UPDATE banner_slides 
            SET title = ${title}, 
                subtitle = ${subtitle}, 
                link_url = ${linkUrl}, 
                display_order = ${displayOrder}
            WHERE id = ${id}
        `
    }

    revalidatePath('/admin/banner')
    revalidatePath('/')
    return { ok: true }
}
