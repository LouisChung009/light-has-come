'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateBannerSlide(formData: FormData) {
    const id = formData.get('id') as string
    if (!id) return { error: '缺少 Banner ID' }

    const title = (formData.get('title') as string) || null
    const subtitle = (formData.get('subtitle') as string) || null
    const linkUrl = (formData.get('linkUrl') as string) || null
    const displayOrder = parseInt((formData.get('displayOrder') as string) || '0', 10) || 0
    const file = formData.get('file') as File | null

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: '未登入' }

    let mediaUrl: string | null = null
    let mediaType: string | null = null

    if (file && file.size > 0) {
        // 先找舊檔路徑
        const { data: existing } = await supabase
            .from('banner_slides')
            .select('media_url')
            .eq('id', id)
            .maybeSingle()

        const ext = file.name.split('.').pop()
        const path = `banners/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
        const buffer = Buffer.from(await file.arrayBuffer())

        const { error: uploadError } = await supabase.storage
            .from('gallery')
            .upload(path, buffer, {
                contentType: file.type || undefined,
                upsert: true,
            })

        if (uploadError) return { error: uploadError.message }

        const { data: publicUrlData } = supabase.storage.from('gallery').getPublicUrl(path)
        mediaUrl = publicUrlData.publicUrl
        mediaType = file.type?.startsWith('video/') ? 'video' : 'image'

        // 刪掉舊檔
        if (existing?.media_url) {
            const oldPath = existing.media_url.split('/gallery/')[1]
            if (oldPath) {
                await supabase.storage.from('gallery').remove([oldPath])
            }
        }
    }

    const updatePayload: Record<string, any> = {
        title,
        subtitle,
        link_url: linkUrl || null,
        display_order: displayOrder,
    }
    if (mediaUrl) {
        updatePayload.media_url = mediaUrl
        updatePayload.media_type = mediaType
    }

    const { error } = await supabase
        .from('banner_slides')
        .update(updatePayload)
        .eq('id', id)

    if (error) return { error: error.message }

    revalidatePath('/admin/banner')
    revalidatePath('/')
    return { ok: true }
}
