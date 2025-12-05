import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
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
        const buffer = Buffer.from(await file.arrayBuffer())

        const { error: uploadError } = await supabase.storage
            .from('gallery')
            .upload(fileName, buffer, {
                contentType: file.type || undefined,
                upsert: true,
            })

        if (uploadError) {
            return NextResponse.json({ error: uploadError.message }, { status: 500 })
        }

        const { data: { publicUrl } } = supabase.storage
            .from('gallery')
            .getPublicUrl(fileName)

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
            return NextResponse.json({ error: dbError.message }, { status: 500 })
        }

        return NextResponse.json({ ok: true })
    } catch (error) {
        console.error('Banner upload error', error)
        return NextResponse.json({ error: '伺服器錯誤，請稍後再試' }, { status: 500 })
    }
}
