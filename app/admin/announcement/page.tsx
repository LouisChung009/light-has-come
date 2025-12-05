import { createClient } from '@/utils/supabase/server'
import AnnouncementForm from './AnnouncementForm'

async function getAnnouncement() {
    const supabase = await createClient()
    const { data } = await supabase
        .from('site_content')
        .select('content')
        .eq('id', 'home_announcement')
        .eq('category', 'announcement')
        .maybeSingle()

    const defaultConfig = {
        enabled: false,
        imageUrl: '',
        ctaEnabled: true,
        ctaLabel: '立即報名',
        ctaHref: '/register',
        storageKey: 'home-announcement',
    }

    if (!data?.content) return defaultConfig
    try {
        return { ...defaultConfig, ...JSON.parse(data.content) }
    } catch {
        return defaultConfig
    }
}

export default async function AnnouncementAdmin() {
    const config = await getAnnouncement()

    return (
        <div style={{ padding: '2rem', maxWidth: '800px' }}>
            <h1 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', color: '#111' }}>首頁彈出視窗設定</h1>
            <p style={{ marginBottom: '1.25rem', color: '#4b5563' }}>
                控制首頁進站公告的海報圖片、報名按鈕，以及「今日不再顯示」。
            </p>
            <AnnouncementForm initialConfig={config} />
        </div>
    )
}
