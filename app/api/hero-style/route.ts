import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

const fields: { key: string; label: string }[] = [
    { key: 'home_hero_title_color', label: '首頁主視覺標題色' },
    { key: 'home_hero_subtitle_color', label: '首頁主視覺副標色' },
    { key: 'home_hero_title_size', label: '首頁主視覺標題字級' },
    { key: 'home_hero_subtitle_size', label: '首頁主視覺副標字級' },
    { key: 'home_hero_text_align', label: '首頁主視覺對齊' },
    { key: 'home_hero_cta_label', label: '首頁主視覺按鈕文字' },
    { key: 'home_hero_cta_href', label: '首頁主視覺按鈕連結' },
    { key: 'home_hero_cta_bg', label: '首頁主視覺按鈕底色' },
    { key: 'home_hero_cta_text_color', label: '首頁主視覺按鈕文字色' },
]

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const supabase = await createClient()

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return NextResponse.json({ error: '未登入' }, { status: 401 })
        }

        const payload = fields.map(({ key, label }) => ({
            id: key,
            category: 'home',
            section: 'hero',
            label,
            content: bodyMapValue(body, key),
            content_type: 'text',
            display_order: 0,
        }))

        const { error } = await supabase
            .from('site_content')
            .upsert(payload, { onConflict: 'id' })

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ ok: true })
    } catch (error) {
        console.error('hero-style save error', error)
        return NextResponse.json({ error: '伺服器錯誤，請稍後再試' }, { status: 500 })
    }
}

function bodyMapValue(body: Record<string, unknown>, key: string) {
    switch (key) {
        case 'home_hero_title_color':
            return (body.titleColor as string) || '#FFFFFF'
        case 'home_hero_subtitle_color':
            return (body.subtitleColor as string) || '#E5E7EB'
        case 'home_hero_title_size':
            return (body.titleSize as string) || 'clamp(2.6rem, 6vw, 4.4rem)'
        case 'home_hero_subtitle_size':
            return (body.subtitleSize as string) || 'clamp(1.125rem, 3vw, 1.55rem)'
        case 'home_hero_text_align':
            return (body.textAlign as string) || 'center'
        case 'home_hero_cta_label':
            return (body.ctaLabel as string) || '立即預約體驗'
        case 'home_hero_cta_href':
            return (body.ctaHref as string) || '/register'
        case 'home_hero_cta_bg':
            return (body.ctaBg as string) || '#FFD93D'
        case 'home_hero_cta_text_color':
            return (body.ctaTextColor as string) || '#333333'
        default:
            return ''
    }
}
