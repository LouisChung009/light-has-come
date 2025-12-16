'use server'

import { getDb } from '@/utils/db'
import { revalidatePath } from 'next/cache'
import { uploadToExternalStorage, deleteFromExternalStorage, extractExternalKeyFromUrl } from '@/utils/storage/external'

export async function updateContent(id: string, content: string) {
    const sql = getDb()

    try {
        await sql`
            UPDATE site_content 
            SET content = ${content}, updated_at = NOW()
            WHERE id = ${id}
        `
        revalidatePath('/')
        revalidatePath('/courses')
        revalidatePath('/about')
    } catch (error) {
        console.error('Error updating content:', error)
        return { error: 'Failed to update content' }
    }
}

export async function updateGalleryIntro(formData: FormData) {
    const title = formData.get('title') as string
    const subtitle = formData.get('subtitle') as string

    if (!title && !subtitle) return

    const sql = getDb()

    try {
        const content = { title, subtitle }
        await sql`
            INSERT INTO site_content (id, category, label, content, updated_at)
            VALUES ('home_gallery_intro', 'gallery', '相簿介紹', ${JSON.stringify(content)}, NOW())
            ON CONFLICT (id)
            DO UPDATE SET
                content = EXCLUDED.content,
                updated_at = NOW()
        `
        revalidatePath('/')
        revalidatePath('/gallery')
    } catch (error) {
        console.error('Error updating gallery intro:', error)
        return { error: 'Failed to update gallery intro' }
    }
}

export async function createBannerSlide(formData: FormData) {
    const file = formData.get('file') as File
    const title = formData.get('title') as string
    const subtitle = formData.get('subtitle') as string
    const linkUrl = formData.get('linkUrl') as string
    const displayOrder = parseInt(formData.get('displayOrder') as string) || 0

    if (!file) {
        return { error: 'No file uploaded' }
    }

    try {
        // Upload to R2
        const fileExt = file.name.split('.').pop()
        const fileName = `banners/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
        const buffer = new Uint8Array(await file.arrayBuffer())

        const publicUrl = await uploadToExternalStorage(fileName, buffer, file.type)
        const mediaType = file.type.startsWith('video/') ? 'video' : 'image'

        // Insert into Neon
        const sql = getDb()
        await sql`
            INSERT INTO banner_slides (title, subtitle, media_url, media_type, link_url, display_order, is_active)
            VALUES (${title}, ${subtitle}, ${publicUrl}, ${mediaType}, ${linkUrl || null}, ${displayOrder}, true)
        `

        revalidatePath('/admin/banner')
        revalidatePath('/')
    } catch (error) {
        console.error('Error creating banner slide:', error)
        return { error: 'Failed to create banner slide' }
    }
}

export async function deleteBannerSlide(id: string, mediaUrl: string) {
    try {
        // Delete from R2
        const key = extractExternalKeyFromUrl(mediaUrl)
        if (key) {
            await deleteFromExternalStorage(key)
        }

        // Delete from Neon
        const sql = getDb()
        await sql`
            DELETE FROM banner_slides
            WHERE id = ${id}
        `

        revalidatePath('/admin/banner')
        revalidatePath('/')
    } catch (error) {
        console.error('Error deleting banner slide:', error)
        return { error: 'Failed to delete banner slide' }
    }
}

export async function toggleBannerSlide(id: string, isActive: boolean) {
    try {
        const sql = getDb()
        await sql`
            UPDATE banner_slides
            SET is_active = ${isActive}
            WHERE id = ${id}
        `

        revalidatePath('/admin/banner')
        revalidatePath('/')
    } catch (error) {
        console.error('Error toggling banner slide:', error)
        return { error: 'Failed to toggle banner slide' }
    }
}
