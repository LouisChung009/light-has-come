import Link from 'next/link'
import HeroBanner from './components/HeroBanner'
import Footer from './components/Footer'
import HomeAnnouncementModal from './components/HomeAnnouncementModal'
import { createClient } from '@/utils/supabase/server'

type AnnouncementConfig = {
    enabled: boolean
    imageUrl: string
    ctaEnabled?: boolean
    ctaLabel?: string
    ctaHref?: string
    storageKey?: string
}

export default async function Home() {
    const supabase = await createClient()

    const [{ data: content }, { data: announcementRow }] = await Promise.all([
        supabase
            .from('site_content')
            .select('*')
            .in('category', ['home', 'contact']),
        supabase
            .from('site_content')
            .select('content')
            .eq('id', 'home_announcement')
            .eq('category', 'announcement')
            .maybeSingle(),
    ])

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

    return (
        <div style={{ minHeight: '100vh' }}>
            <HomeAnnouncementModal
                enabled={announcement.enabled}
                title={announcement.title}
                subtitle={announcement.subtitle}
                content={announcement.content}
                ctaEnabled={announcement.ctaEnabled}
                ctaLabel={announcement.ctaLabel}
                ctaHref={announcement.ctaHref}
                storageKey={announcement.storageKey}
            />

            {/* Hero Banner with Carousel */}
            <HeroBanner />

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
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#4A90C8' }}>
                                {getContent('home_value_1_title')}
                            </h3>
                            <p style={{ color: '#666', lineHeight: 1.7 }}>
                                {getContent('home_value_1_desc')}
                            </p>
                        </div>

                        {/* Value 2 */}
                        <div style={{ background: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💝</div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#FFAAA5' }}>
                                {getContent('home_value_2_title')}
                            </h3>
                            <p style={{ color: '#666', lineHeight: 1.7 }}>
                                {getContent('home_value_2_desc')}
                            </p>
                        </div>

                        {/* Value 3 */}
                        <div style={{ background: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎨</div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#FFD93D' }}>
                                {getContent('home_value_3_title')}
                            </h3>
                            <p style={{ color: '#666', lineHeight: 1.7 }}>
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
                        <p style={{ fontSize: '1.125rem', color: '#666' }}>
                            {getContent('home_courses_subtitle')}
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        {/* 幼幼班 */}
                        <div style={{ background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                            <h3 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', color: '#92400E' }}>幼幼班</h3>
                            <p style={{ fontSize: '1rem', color: '#78350F', marginBottom: '1rem' }}>2-6歲</p>
                            <p style={{ color: '#451A03', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                                透過遊戲、唱歌、手作等活動，讓孩子在快樂中認識耶穌的愛。
                            </p>
                            <Link href="/courses" style={{ color: '#92400E', fontWeight: 600, textDecoration: 'none' }}>
                                了解更多 →
                            </Link>
                        </div>

                        {/* 撒母耳班 */}
                        <div style={{ background: 'linear-gradient(135deg, #DBEAFE, #BFDBFE)', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                            <h3 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', color: '#1E3A8A' }}>撒母耳班</h3>
                            <p style={{ fontSize: '1rem', color: '#1E40AF', marginBottom: '1rem' }}>7-9歲</p>
                            <p style={{ color: '#1E3A8A', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                                深入淺出的聖經故事教學，培養孩子的信仰根基與品格。
                            </p>
                            <Link href="/courses" style={{ color: '#1E3A8A', fontWeight: 600, textDecoration: 'none' }}>
                                了解更多 →
                            </Link>
                        </div>

                        {/* 約書亞班 */}
                        <div style={{ background: 'linear-gradient(135deg, #FEE2E2, #FECACA)', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                            <h3 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', color: '#7F1D1D' }}>約書亞班</h3>
                            <p style={{ fontSize: '1rem', color: '#991B1B', marginBottom: '1rem' }}>10-12歲</p>
                            <p style={{ color: '#7F1D1D', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                                引導孩子思考信仰與生活的連結，建立個人與神的關係。
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
                    <p style={{ fontSize: '1.125rem', marginBottom: '2rem', opacity: 0.95 }}>
                        讓孩子在愛與歡樂中成長，建立美好的品格與價值觀
                    </p>
                    <Link href="/register" style={{
                        display: 'inline-block',
                        background: '#FFD93D',
                        color: '#333',
                        padding: '1rem 2.5rem',
                        borderRadius: '9999px',
                        textDecoration: 'none',
                        fontWeight: 700,
                        fontSize: '1.125rem',
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
