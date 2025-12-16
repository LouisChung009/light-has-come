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

        const enabled = formData.get('enabled') === 'on'
        const ctaEnabled = formData.get('ctaEnabled') === 'on'
        const rawHref = ((formData.get('ctaHref') as string) || '').trim()

        const payload = {
            enabled,
            imageUrl: (formData.get('imageUrl') as string) || '',
            ctaEnabled,
            ctaLabel: (formData.get('ctaLabel') as string) || '立即報名',
            ctaHref: ctaEnabled ? (rawHref || '/register') : null,
            storageKey: (formData.get('storageKey') as string) || 'home-announcement',
        }

        if (!payload.imageUrl) {
            return NextResponse.json({ error: '請上傳海報圖片' }, { status: 400 })
        }

        if (payload.ctaEnabled && !rawHref) {
            return NextResponse.json({ error: '請填寫報名按鈕的網址' }, { status: 400 })
        }

        const { error } = await supabase
            .from('site_content')
            .upsert({
                id: 'home_announcement',
                category: 'announcement',
                label: '首頁彈窗',
                content: JSON.stringify(payload),
            })

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ ok: true })
    } catch (error) {
        console.error('announcement save error', error)
        return NextResponse.json({ error: '伺服器錯誤，請稍後再試' }, { status: 500 })
    }
}
