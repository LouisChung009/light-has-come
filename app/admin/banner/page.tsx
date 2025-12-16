import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import BannerUploadForm from './BannerUploadForm'
import BannerSlideCard from './BannerSlideCard'
import HeroStyleForm from './HeroStyleForm'

export default async function BannerManagement() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/admin')
    }

    const [{ data: banners }, { data: heroStyleRows }] = await Promise.all([
        supabase
            .from('banner_slides')
            .select('*')
            .order('display_order', { ascending: true }),
        supabase
            .from('site_content')
            .select('id, content')
            .in('id', [
                'home_hero_title_color',
                'home_hero_subtitle_color',
                'home_hero_title_size',
                'home_hero_subtitle_size',
                'home_hero_text_align',
                'home_hero_cta_label',
                'home_hero_cta_href',
                'home_hero_cta_bg',
                'home_hero_cta_text_color',
            ])
    ])

    const heroStyleMap = new Map<string, string>()
    heroStyleRows?.forEach((row: { id: string, content: string }) => heroStyleMap.set(row.id, row.content))

    const heroStyle = {
        titleColor: heroStyleMap.get('home_hero_title_color') || '#FFFFFF',
        subtitleColor: heroStyleMap.get('home_hero_subtitle_color') || '#E5E7EB',
        titleSize: heroStyleMap.get('home_hero_title_size') || 'clamp(2.6rem, 6vw, 4.4rem)',
        subtitleSize: heroStyleMap.get('home_hero_subtitle_size') || 'clamp(1.125rem, 3vw, 1.55rem)',
        textAlign: (heroStyleMap.get('home_hero_text_align') as 'center' | 'left') || 'center',
        ctaLabel: heroStyleMap.get('home_hero_cta_label') || '立即預約體驗',
        ctaHref: heroStyleMap.get('home_hero_cta_href') || '/register',
        ctaBg: heroStyleMap.get('home_hero_cta_bg') || '#FFD93D',
        ctaTextColor: heroStyleMap.get('home_hero_cta_text_color') || '#333333',
    }

    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ marginBottom: '2rem' }}>
                <Link href="/admin/content" style={{ color: '#666', textDecoration: 'none', marginBottom: '1rem', display: 'inline-block' }}>
                    ←返回文案管理
                </Link>
                <h1 style={{ fontSize: '1.75rem', color: '#333', margin: 0 }}>
                    Banner 輪播管理
                </h1>
                <p style={{ color: '#666', marginTop: '0.5rem' }}>
                    上傳照片或影片作為首頁 Banner 輪播
                </p>
            </div>

            <div style={{ background: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>首頁主視覺文字樣式</h2>
                <p style={{ marginTop: 0, marginBottom: '1.25rem', color: '#6b7280' }}>
                    可調整首圖的標題/副標字級、位置，以及「立即預約體驗」按鈕的文字與顏色。
                </p>
                <HeroStyleForm initial={heroStyle} />
            </div>

            <div style={{ background: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>上傳新的 Banner</h2>
                <BannerUploadForm />
            </div>

            <div>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>現有 Banner</h2>
                {!banners || banners.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '1rem', color: '#666' }}>
                        目前沒有 Banner，請上傳第一個！
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {banners.map((banner) => (
                            <BannerSlideCard key={banner.id} banner={banner} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
