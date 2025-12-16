import Link from 'next/link'
import { getDb, SiteContent } from '@/utils/db'
import Footer from '../components/Footer'

export const dynamic = 'force-dynamic'

export default async function Courses() {
    const sql = getDb()

    // Fetch content from Neon
    const content = await sql`
        SELECT * FROM site_content WHERE category = 'courses'
    ` as SiteContent[]

    // Helper function to get content by ID
    const getContent = (id: string) => {
        return content?.find(item => item.id === id)?.content || ''
    }

    return (
        <div style={{ minHeight: '100vh', background: '#FFF8E7' }}>
            {/* Page Header */}
            <section style={{
                background: 'linear-gradient(135deg, #FFD93D, #FFAAA5)',
                color: 'white',
                padding: '4rem 1.5rem',
                textAlign: 'center'
            }}>
                <div className="container">
                    <h1 style={{ fontSize: 'clamp(2rem, 5vw, 2.5rem)', marginBottom: '1rem' }}>
                        {getContent('courses_intro_title')}
                    </h1>
                    <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.125rem)', opacity: 0.9 }}>
                        {getContent('courses_intro_desc')}
                    </p>
                </div>
            </section>

            {/* Course Details */}
            <section style={{ padding: '4rem 1.5rem' }}>
                <div className="container">

                    {/* 幼幼班 */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2rem',
                        marginBottom: '4rem',
                        background: 'white',
                        borderRadius: '1.5rem',
                        overflow: 'hidden',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
                    }}>
                        <div style={{
                            background: 'linear-gradient(135deg, #FFD93D, #FFAAA5)',
                            padding: '3rem 2rem',
                            textAlign: 'center',
                            color: 'white'
                        }}>
                            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🐣</div>
                            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                                {getContent('courses_toddler_name')}
                            </h2>
                            <p style={{ fontSize: '1.25rem', opacity: 0.9 }}>
                                {getContent('courses_toddler_age')}
                            </p>
                        </div>
                        <div style={{ padding: '2rem 3rem 3rem' }}>
                            <h3 style={{ fontSize: '1.5rem', color: '#333', marginBottom: '1.5rem', borderBottom: '2px solid #FFD93D', display: 'inline-block', paddingBottom: '0.5rem' }}>課程特色</h3>
                            <p style={{ color: '#666', lineHeight: 1.8, marginBottom: '2rem' }}>
                                {getContent('courses_toddler_desc')}
                            </p>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                                <div>
                                    <h4 style={{ fontSize: '1.125rem', color: '#FFAAA5', marginBottom: '1rem', fontWeight: 600 }}>學習重點</h4>
                                    <ul style={{ listStyle: 'none', padding: 0, color: '#666', lineHeight: 2 }}>
                                        <li>✨ 認識創造的天父</li>
                                        <li>✨ 學習分享與愛</li>
                                        <li>✨ 建立生活好習慣</li>
                                        <li>✨ 發展肢體協調</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '1.125rem', color: '#FFAAA5', marginBottom: '1rem', fontWeight: 600 }}>精彩活動</h4>
                                    <ul style={{ listStyle: 'none', padding: 0, color: '#666', lineHeight: 2 }}>
                                        <li>🎨 創意塗鴉</li>
                                        <li>🎵 唱遊律動</li>
                                        <li>📖 繪本故事</li>
                                        <li>🧩 益智遊戲</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 撒母耳班 */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2rem',
                        marginBottom: '4rem',
                        background: 'white',
                        borderRadius: '1.5rem',
                        overflow: 'hidden',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
                    }}>
                        <div style={{
                            background: 'linear-gradient(135deg, #4A90C8, #B4E7CE)',
                            padding: '3rem 2rem',
                            textAlign: 'center',
                            color: 'white'
                        }}>
                            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🌱</div>
                            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                                {getContent('courses_samuel_name')}
                            </h2>
                            <p style={{ fontSize: '1.25rem', opacity: 0.9 }}>
                                {getContent('courses_samuel_age')}
                            </p>
                        </div>
                        <div style={{ padding: '2rem 3rem 3rem' }}>
                            <h3 style={{ fontSize: '1.5rem', color: '#333', marginBottom: '1.5rem', borderBottom: '2px solid #4A90C8', display: 'inline-block', paddingBottom: '0.5rem' }}>課程特色</h3>
                            <p style={{ color: '#666', lineHeight: 1.8, marginBottom: '2rem' }}>
                                {getContent('courses_samuel_desc')}
                            </p>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                                <div>
                                    <h4 style={{ fontSize: '1.125rem', color: '#4A90C8', marginBottom: '1rem', fontWeight: 600 }}>學習重點</h4>
                                    <ul style={{ listStyle: 'none', padding: 0, color: '#666', lineHeight: 2 }}>
                                        <li>✨ 熟悉聖經人物故事</li>
                                        <li>✨ 培養禱告習慣</li>
                                        <li>✨ 學習團隊合作</li>
                                        <li>✨ 建立自信心</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '1.125rem', color: '#4A90C8', marginBottom: '1rem', fontWeight: 600 }}>精彩活動</h4>
                                    <ul style={{ listStyle: 'none', padding: 0, color: '#666', lineHeight: 2 }}>
                                        <li>🔬 科學實驗</li>
                                        <li>🎭 戲劇扮演</li>
                                        <li>🏃‍♂️ 團體競賽</li>
                                        <li>✂️ 手作DIY</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 約書亞班 */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2rem',
                        marginBottom: '4rem',
                        background: 'white',
                        borderRadius: '1.5rem',
                        overflow: 'hidden',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
                    }}>
                        <div style={{
                            background: 'linear-gradient(135deg, #FFAAA5, #4A90C8)',
                            padding: '3rem 2rem',
                            textAlign: 'center',
                            color: 'white'
                        }}>
                            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🌟</div>
                            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                                {getContent('courses_joshua_name')}
                            </h2>
                            <p style={{ fontSize: '1.25rem', opacity: 0.9 }}>
                                {getContent('courses_joshua_age')}
                            </p>
                        </div>
                        <div style={{ padding: '2rem 3rem 3rem' }}>
                            <h3 style={{ fontSize: '1.5rem', color: '#333', marginBottom: '1.5rem', borderBottom: '2px solid #FFAAA5', display: 'inline-block', paddingBottom: '0.5rem' }}>課程特色</h3>
                            <p style={{ color: '#666', lineHeight: 1.8, marginBottom: '2rem' }}>
                                {getContent('courses_joshua_desc')}
                            </p>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                                <div>
                                    <h4 style={{ fontSize: '1.125rem', color: '#FFAAA5', marginBottom: '1rem', fontWeight: 600 }}>學習重點</h4>
                                    <ul style={{ listStyle: 'none', padding: 0, color: '#666', lineHeight: 2 }}>
                                        <li>✨ 聖經真理應用</li>
                                        <li>✨ 發展領導潛能</li>
                                        <li>✨ 參與服事</li>
                                        <li>✨ 探索個人恩賜</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '1.125rem', color: '#FFAAA5', marginBottom: '1rem', fontWeight: 600 }}>精彩活動</h4>
                                    <ul style={{ listStyle: 'none', padding: 0, color: '#666', lineHeight: 2 }}>
                                        <li>🤝 社區服務</li>
                                        <li>🏕️ 體驗營隊</li>
                                        <li>💡 專題討論</li>
                                        <li>🎸 敬拜團練</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CTA */}
                    <div style={{ textAlign: 'center', marginTop: '4rem' }}>
                        <h2 style={{ fontSize: '2rem', color: '#333', marginBottom: '1.5rem' }}>不知道哪個班級適合您的孩子？</h2>
                        <p style={{ color: '#666', marginBottom: '2rem' }}>歡迎預約免費體驗，讓老師協助評估與安排！</p>
                        <Link href="/register" style={{
                            display: 'inline-block',
                            padding: '1rem 3rem',
                            background: '#4A90C8',
                            color: 'white',
                            borderRadius: '9999px',
                            textDecoration: 'none',
                            fontWeight: 600,
                            fontSize: '1.125rem',
                            boxShadow: '0 4px 12px rgba(74, 144, 200, 0.3)'
                        }}>
                            立即預約體驗
                        </Link>
                    </div>

                </div>
            </section>

            <Footer />
        </div>
    )
}
