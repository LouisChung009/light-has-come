import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import BannerUploadForm from './BannerUploadForm'
import BannerSlideCard from './BannerSlideCard'

export default async function BannerManagement() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/admin')
    }

    const { data: banners } = await supabase
        .from('banner_slides')
        .select('*')
        .order('display_order', { ascending: true })

    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ marginBottom: '2rem' }}>
                <Link href="/admin/content" style={{ color: '#666', textDecoration: 'none', marginBottom: '1rem', display: 'inline-block' }}>
                    ← 返回文案管理
                </Link>
                <h1 style={{ fontSize: '1.75rem', color: '#333', margin: 0 }}>
                    Banner 輪播管理
                </h1>
                <p style={{ color: '#666', marginTop: '0.5rem' }}>
                    上傳照片或影片作為首頁 Banner 輪播
                </p>
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
