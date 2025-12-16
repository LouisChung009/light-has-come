import Link from 'next/link'
import HeroBanner from './components/HeroBanner'
import Footer from './components/Footer'
import HomeAnnouncementModal from './components/HomeAnnouncementModal'
import { getDb, SiteContent } from '@/utils/db'

type HeroStyle = {
    titleColor: string
    subtitleColor: string
    titleSize: string
    subtitleSize: string
    textAlign: 'center' | 'left'
    ctaLabel: string
    ctaHref: string
    ctaBg: string
    ctaTextColor: string
}

type AnnouncementConfig = {
    enabled: boolean
    imageUrl: string
    ctaEnabled?: boolean
    ctaLabel?: string
    ctaHref?: string
    storageKey?: string
}

export default async function Home() {
    const sql = getDb()

    const [contentRows, announcementRows] = await Promise.all([
        sql`
            SELECT * FROM site_content 
            WHERE category IN ('home', 'contact', 'courses')
        `,
        sql`
            SELECT content FROM site_content 
            WHERE id = 'home_announcement' AND category = 'announcement'
            LIMIT 1
        `,
    ])

    const content = contentRows as SiteContent[]
    const announcementRow = (announcementRows as SiteContent[])[0] || null

    const defaultAnnouncement: AnnouncementConfig = {
        enabled: false,
        imageUrl: '',
        ctaEnabled: true,
        ctaLabel: '立即報名',
        ctaHref: '/register',
        storageKey: 'home-announcement',
    }

    let announcement = defaultAnnouncement
    if (announcementRow?.content) {
        try {
            announcement = { ...defaultAnnouncement, ...JSON.parse(announcementRow.content) }
        } catch {
            announcement = defaultAnnouncement
        }
    }

    const getContent = (id: string) => {
        return content?.find(item => item.id === id)?.content || ''
    }


    const heroStyle: HeroStyle = {
        titleColor: getContent('home_hero_title_color') || '#FFFFFF',
        subtitleColor: getContent('home_hero_subtitle_color') || '#E5E7EB',
        titleSize: getContent('home_hero_title_size') || 'clamp(2.6rem, 6vw, 4.4rem)',
        subtitleSize: getContent('home_hero_subtitle_size') || 'clamp(1.125rem, 3vw, 1.55rem)',
        textAlign: (getContent('home_hero_text_align') as HeroStyle['textAlign']) || 'center',
        ctaLabel: getContent('home_hero_cta_label') || '立即預約體驗',
        ctaHref: getContent('home_hero_cta_href') || '/register',
        ctaBg: getContent('home_hero_cta_bg') || '#FFD93D',
        ctaTextColor: getContent('home_hero_cta_text_color') || '#333333',
    }

    return (
        <div style={{ minHeight: '100vh' }}>
            <HomeAnnouncementModal
                enabled={announcement.enabled}
                imageUrl={announcement.imageUrl}
                ctaEnabled={announcement.ctaEnabled}
                ctaLabel={announcement.ctaLabel}
                ctaHref={announcement.ctaHref}
                storageKey={announcement.storageKey}
            />

            {/* Hero Banner with Carousel */}
            <HeroBanner heroStyle={heroStyle} />

            {/* Values Section */}
            <section style={{ padding: '4rem 1.5rem', background: '#F5F5F5' }}>
                <div className="container">
                    <h2 style={{ fontSize: 'clamp(2rem, 5vw, 2.5rem)', textAlign: 'center', marginBottom: '3rem', color: '#333' }}>
                        {getContent('home_values_title')}
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                        {/* Value 1 */}
                        <div style={{ background: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📖</div>
                            <h3 style={{ fontSize: 'clamp(1.35rem, 3vw, 1.65rem)', marginBottom: '1rem', color: '#4A90C8' }}>
                                {getContent('home_value_1_title')}
                            </h3>
                            <p style={{ color: '#666', lineHeight: 1.9, fontSize: 'clamp(1.2rem, 3vw, 1.35rem)' }}>
                                {getContent('home_value_1_desc')}
                            </p>
                        </div>

                        {/* Value 2 */}
                        <div style={{ background: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💝</div>
                            <h3 style={{ fontSize: 'clamp(1.35rem, 3vw, 1.65rem)', marginBottom: '1rem', color: '#FFAAA5' }}>
                                {getContent('home_value_2_title')}
                            </h3>
                            <p style={{ color: '#666', lineHeight: 1.9, fontSize: 'clamp(1.2rem, 3vw, 1.35rem)' }}>
                                {getContent('home_value_2_desc')}
                            </p>
                        </div>

                        {/* Value 3 */}
                        <div style={{ background: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎨</div>
                            <h3 style={{ fontSize: 'clamp(1.35rem, 3vw, 1.65rem)', marginBottom: '1rem', color: '#FFD93D' }}>
                                {getContent('home_value_3_title')}
                            </h3>
                            <p style={{ color: '#666', lineHeight: 1.9, fontSize: 'clamp(1.2rem, 3vw, 1.35rem)' }}>
                                {getContent('home_value_3_desc')}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Courses Preview */}
            <section id="courses" style={{ padding: '4rem 1.5rem' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <h2 style={{ fontSize: 'clamp(2rem, 5vw, 2.5rem)', marginBottom: '1rem', color: '#333' }}>
                            {getContent('home_courses_title')}
                        </h2>
                        <p style={{ fontSize: 'clamp(1.2rem, 3vw, 1.35rem)', color: '#666', lineHeight: 1.9 }}>
                            {getContent('home_courses_subtitle')}
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        {/* 幼幼班 */}
                        <div style={{ background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                            <h3 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', color: '#92400E' }}>
                                {getContent('courses_toddler_name')}
                            </h3>
                            <p style={{ fontSize: 'clamp(1.2rem, 3vw, 1.35rem)', color: '#78350F', marginBottom: '1rem' }}>
                                {getContent('courses_toddler_age')}
                            </p>
                            <p style={{ color: '#451A03', lineHeight: 1.95, marginBottom: '1.5rem', fontSize: 'clamp(1.2rem, 3vw, 1.35rem)' }}>
                                {getContent('courses_toddler_desc')}
                            </p>
                            <Link href="/courses" style={{ color: '#92400E', fontWeight: 600, textDecoration: 'none' }}>
                                了解更多 →
                            </Link>
                        </div>

                        {/* 撒母耳班 */}
                        <div style={{ background: 'linear-gradient(135deg, #DBEAFE, #BFDBFE)', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                            <h3 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', color: '#1E3A8A' }}>
                                {getContent('courses_samuel_name')}
                            </h3>
                            <p style={{ fontSize: 'clamp(1.2rem, 3vw, 1.35rem)', color: '#1E40AF', marginBottom: '1rem' }}>
                                {getContent('courses_samuel_age')}
                            </p>
                            <p style={{ color: '#1E3A8A', lineHeight: 1.95, marginBottom: '1.5rem', fontSize: 'clamp(1.2rem, 3vw, 1.35rem)' }}>
                                {getContent('courses_samuel_desc')}
                            </p>
                            <Link href="/courses" style={{ color: '#1E3A8A', fontWeight: 600, textDecoration: 'none' }}>
                                了解更多 →
                            </Link>
                        </div>

                        {/* 約書亞班 */}
                        <div style={{ background: 'linear-gradient(135deg, #FEE2E2, #FECACA)', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                            <h3 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', color: '#7F1D1D' }}>
                                {getContent('courses_joshua_name')}
                            </h3>
                            <p style={{ fontSize: 'clamp(1.2rem, 3vw, 1.35rem)', color: '#991B1B', marginBottom: '1rem' }}>
                                {getContent('courses_joshua_age')}
                            </p>
                            <p style={{ color: '#7F1D1D', lineHeight: 1.95, marginBottom: '1.5rem', fontSize: 'clamp(1.2rem, 3vw, 1.35rem)' }}>
                                {getContent('courses_joshua_desc')}
                            </p>
                            <Link href="/courses" style={{ color: '#7F1D1D', fontWeight: 600, textDecoration: 'none' }}>
                                了解更多 →
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section id="register" style={{ background: 'linear-gradient(135deg, #4A90C8, #2E5C8A)', color: 'white', padding: '4rem 1.5rem', textAlign: 'center' }}>
                <div className="container">
                    <h2 style={{ fontSize: 'clamp(2rem, 5vw, 2.5rem)', marginBottom: '1rem' }}>
                        {getContent('home_hero_cta')}
                    </h2>
                    <p style={{ fontSize: 'clamp(1.2rem, 3vw, 1.35rem)', marginBottom: '2rem', opacity: 0.95, lineHeight: 1.9 }}>
                        讓孩子在愛與歡樂中成長，建立美好的品格與價值觀
                    </p>
                    <Link href="/register" style={{
                        display: 'inline-block',
                        background: '#FFD93D',
                        color: '#333',
                        padding: '1.2rem 3rem',
                        borderRadius: '9999px',
                        textDecoration: 'none',
                        fontWeight: 700,
                        fontSize: '1.25rem',
                        boxShadow: '0 8px 20px rgba(255, 217, 61, 0.3)'
                    }}>
                        立即預約體驗
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    )
}
