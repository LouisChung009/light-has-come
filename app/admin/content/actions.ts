'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateContent(id: string, content: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('site_content')
        .update({
            content,
            updated_at: new Date().toISOString()
        })
        .eq('id', id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/')
    revalidatePath('/courses')
    revalidatePath('/about')
}

export async function createBannerSlide(formData: FormData) {
    const supabase = await createClient()

    const file = formData.get('file') as File
    const title = formData.get('title') as string
    const subtitle = formData.get('subtitle') as string
    const linkUrl = formData.get('linkUrl') as string
    const displayOrder = parseInt(formData.get('displayOrder') as string) || 0

    if (!file) {
        return { error: 'No file uploaded' }
    }

    // Determine media type
    const mediaType = file.type.startsWith('video/') ? 'video' : 'image'

    // Upload to storage (convert to buffer for Node env)
    const fileExt = file.name.split('.').pop()
    const fileName = `banners/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const buffer = Buffer.from(await file.arrayBuffer())

    const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(fileName, buffer, {
            contentType: file.type || undefined,
            upsert: true,
        })

    if (uploadError) {
        return { error: uploadError.message }
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(fileName)

    // Insert into database
    const { error: dbError } = await supabase
        .from('banner_slides')
        .insert({
            title,
            subtitle,
            media_url: publicUrl,
            media_type: mediaType,
            link_url: linkUrl || null,
            display_order: displayOrder,
            is_active: true
        })

    if (dbError) {
        return { error: dbError.message }
    }

    revalidatePath('/admin/banner')
    revalidatePath('/')
}

export async function deleteBannerSlide(id: string, mediaUrl: string) {
    const supabase = await createClient()

    // Delete from storage
    const path = mediaUrl.split('/gallery/')[1]
    if (path) {
        await supabase.storage.from('gallery').remove([path])
    }

    // Delete from database
    const { error } = await supabase
        .from('banner_slides')
        .delete()
        .eq('id', id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/admin/banner')
    revalidatePath('/')
}

export async function toggleBannerSlide(id: string, isActive: boolean) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('banner_slides')
        .update({ is_active: isActive })
        .eq('id', id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/admin/banner')
    revalidatePath('/')
}
