import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import Footer from '../components/Footer'

export default async function About() {
    const supabase = await createClient()

    // Fetch content from Supabase
    const { data: content } = await supabase
        .from('site_content')
        .select('*')
        .in('category', ['about', 'contact'])

    // Helper function to get content by ID
    const getContent = (id: string) => {
        return content?.find(item => item.id === id)?.content || ''
    }

    return (
        <div style={{ minHeight: '100vh', background: '#F5F5F5' }}>
            {/* Page Header */}
            <section style={{
                background: 'linear-gradient(135deg, #2E5C8A, #4A90C8)',
                color: 'white',
                padding: '4rem 1.5rem',
                textAlign: 'center'
            }}>
                <div className="container">
                    <h1 style={{ fontSize: 'clamp(2rem, 5vw, 2.5rem)', marginBottom: '1rem' }}>
                        {getContent('about_title')}
                    </h1>
                    <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.125rem)', opacity: 0.9 }}>
                        {getContent('about_intro')}
                    </p>
                </div>
            </section>

            {/* Vision Section */}
            <section style={{ padding: '4rem 1.5rem', background: 'white' }}>
                <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '2rem', color: '#333', marginBottom: '2rem' }}>
                        {getContent('about_vision_title')}
                    </h2>
                    <p style={{ fontSize: '1.25rem', color: '#666', lineHeight: 1.8, marginBottom: '3rem' }}>
                        {getContent('about_vision')}
                    </p>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '2rem',
                        textAlign: 'left'
                    }}>
                        <div style={{ padding: '2rem', background: '#FFF8E7', borderRadius: '1rem' }}>
                            <h3 style={{ fontSize: '1.5rem', color: '#FFD93D', marginBottom: '1rem' }}>快樂成長</h3>
                            <p style={{ color: '#666' }}>創造一個充滿歡笑與愛的環境，讓孩子喜歡來教會，快樂學習。</p>
                        </div>
                        <div style={{ padding: '2rem', background: '#F0F9FF', borderRadius: '1rem' }}>
                            <h3 style={{ fontSize: '1.5rem', color: '#4A90C8', marginBottom: '1rem' }}>品格建造</h3>
                            <p style={{ color: '#666' }}>透過聖經真理，培養孩子誠實、勇敢、負責、愛人的美好品格。</p>
                        </div>
                        <div style={{ padding: '2rem', background: '#FFF0F0', borderRadius: '1rem' }}>
                            <h3 style={{ fontSize: '1.5rem', color: '#FFAAA5', marginBottom: '1rem' }}>恩賜發揮</h3>
                            <p style={{ color: '#666' }}>發掘每個孩子的獨特天賦，提供舞台讓他們展現自我，建立自信。</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section style={{ padding: '4rem 1.5rem', background: '#F5F5F5' }}>
                <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '2rem', color: '#333', marginBottom: '2rem' }}>
                        {getContent('about_mission_title')}
                    </h2>
                    <p style={{ fontSize: '1.25rem', color: '#666', lineHeight: 1.8 }}>
                        {getContent('about_mission')}
                    </p>
                </div>
            </section>

            {/* Team Section */}
            <section style={{ padding: '4rem 1.5rem', background: 'white' }}>
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: '2rem', color: '#333', marginBottom: '3rem', textAlign: 'center' }}>專業師資團隊</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
                        {[
                            { name: '快樂老師', role: '幼幼班導師', icon: '👩‍🏫', color: '#FFD93D' },
                            { name: '大衛老師', role: '撒母耳班導師', icon: '👨‍🏫', color: '#4A90C8' },
                            { name: '愛心老師', role: '約書亞班導師', icon: '👩‍🏫', color: '#FFAAA5' },
                            { name: '音樂老師', role: '敬拜讚美', icon: '🎵', color: '#B4E7CE' },
                        ].map((member, i) => (
                            <div key={i} style={{
                                background: 'white',
                                padding: '2rem',
                                borderRadius: '1rem',
                                textAlign: 'center',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                            }}>
                                <div style={{
                                    width: '100px', height: '100px', background: member.color, borderRadius: '50%',
                                    margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '3rem'
                                }}>
                                    {member.icon}
                                </div>
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#333' }}>{member.name}</h3>
                                <p style={{ color: '#666', fontSize: '0.875rem' }}>{member.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section style={{ padding: '4rem 1.5rem', background: '#F5F5F5' }}>
                <div className="container" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '2rem', color: '#333', marginBottom: '2rem' }}>聯絡我們</h2>
                    <div style={{
                        background: 'linear-gradient(135deg, #4A90C8, #2E5C8A)',
                        color: 'white',
                        padding: '3rem',
                        borderRadius: '1.5rem',
                        boxShadow: '0 10px 30px rgba(74, 144, 200, 0.2)'
                    }}>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>大里思恩堂兒童主日學</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', fontSize: '1.125rem' }}>
                            <p>📍 地址：{getContent('contact_address')}</p>
                            <p>📞 電話：{getContent('contact_phone')}</p>
                            <p>⏰ 時間：{getContent('contact_time')}</p>
                        </div>
                        <div style={{ marginTop: '3rem' }}>
                            <Link href="/register" style={{
                                display: 'inline-block',
                                padding: '1rem 3rem',
                                background: '#FFD93D',
                                color: '#333',
                                borderRadius: '9999px',
                                textDecoration: 'none',
                                fontWeight: 600,
                                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                            }}>
                                預約參觀
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}
