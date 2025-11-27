'use client';

import Link from 'next/link';

export default function About() {
    return (
        <div style={{ minHeight: '100vh', background: '#F5F5F5' }}>
            {/* Header */}
            <header style={{ background: 'white', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', position: 'sticky', top: 0, zIndex: 100 }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem' }}>
                    <Link href="/" style={{ textDecoration: 'none' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <h1 style={{ fontSize: '1.5rem', color: '#333', margin: 0 }}>光·來了</h1>
                            <span style={{ fontSize: '0.875rem', color: '#666' }}>大里思恩堂兒童主日學</span>
                        </div>
                    </Link>
                    <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                        <Link href="/" style={{ color: '#333', textDecoration: 'none', fontWeight: 500 }}>首頁</Link>
                        <Link href="/courses" style={{ color: '#333', textDecoration: 'none', fontWeight: 500 }}>課程介紹</Link>
                        <Link href="/gallery" style={{ color: '#333', textDecoration: 'none', fontWeight: 500 }}>活動花絮</Link>
                        <Link href="/about" style={{ color: '#4A90C8', textDecoration: 'none', fontWeight: 600 }}>關於我們</Link>
                        <Link href="/register" style={{
                            background: '#4A90C8',
                            color: 'white',
                            padding: '0.5rem 1.25rem',
                            borderRadius: '9999px',
                            textDecoration: 'none',
                            fontWeight: 600,
                            fontSize: '0.875rem'
                        }}>預約體驗</Link>
                    </nav>
                </div>
            </header>

            {/* Page Header */}
            <section style={{
                background: 'linear-gradient(135deg, #2E5C8A, #4A90C8)',
                color: 'white',
                padding: '4rem 1.5rem',
                textAlign: 'center'
            }}>
                <div className="container">
                    <h1 style={{ fontSize: 'clamp(2rem, 5vw, 2.5rem)', marginBottom: '1rem' }}>關於我們</h1>
                    <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.125rem)', opacity: 0.9 }}>認識「光·來了」的異象與團隊</p>
                </div>
            </section>

            {/* Vision Section */}
            <section style={{ padding: '4rem 1.5rem', background: 'white' }}>
                <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '2rem', color: '#333', marginBottom: '2rem' }}>我們的異象</h2>
                    <p style={{ fontSize: '1.25rem', color: '#666', lineHeight: 1.8, marginBottom: '3rem' }}>
                        「光·來了」源自約翰福音 12:46：「我就是來到世上的光，使凡信我的不住在黑暗裡。」<br />
                        我們期盼每個來到這裡的孩子，都能被上帝的光照亮，並成為這世代的光，將愛與溫暖帶給周圍的人。
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

            {/* Team Section */}
            <section style={{ padding: '4rem 1.5rem', background: '#F5F5F5' }}>
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
            <section style={{ padding: '4rem 1.5rem', background: 'white' }}>
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
                            <p>📍 地址：412台灣大里區東榮路312號</p>
                            <p>📞 電話：04 2482 3735</p>
                            <p>⏰ 時間：每週日 10:00 - 11:30</p>
                            <p>📧 Email：light.has.come@example.com</p>
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

            {/* Footer */}
            <footer style={{ background: '#333', color: 'white', padding: '3rem 1.5rem' }}>
                <div className="container">
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '2rem',
                        marginBottom: '2rem',
                    }}>
                        <div>
                            <h3 style={{ fontSize: '1.5rem', color: '#FFD93D', marginBottom: '1rem' }}>光·來了</h3>
                            <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.7 }}>
                                大里思恩堂兒童主日學<br />
                                "我就是來到世上的光,使凡信我的不住在黑暗裡。"
                            </p>
                        </div>
                        <div>
                            <h4 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>聯絡資訊</h4>
                            <div style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 2 }}>
                                <p>📍 412台灣大里區東榮路312號</p>
                                <p>📞 04 2482 3735</p>
                                <p>⏰ 每週日 10:00-11:30</p>
                            </div>
                        </div>
                        <div>
                            <h4 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>快速連結</h4>
                            <div style={{ lineHeight: 2 }}>
                                <p><Link href="/courses" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>課程介紹</Link></p>
                                <p><Link href="/gallery" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>活動花絮</Link></p>
                                <p><Link href="/about" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>關於我們</Link></p>
                                <p><Link href="/register" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>預約體驗</Link></p>
                            </div>
                        </div>
                    </div>
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem' }}>
                        <p>© 2025 光·來了 - 大里思恩堂兒童主日學. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
