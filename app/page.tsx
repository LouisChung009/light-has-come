import Link from 'next/link'
import HeroBanner from './components/HeroBanner'
import { createClient } from '@/utils/supabase/server'

export default async function Home() {
  const supabase = await createClient()

  // Fetch content from Supabase
  const { data: content } = await supabase
    .from('site_content')
    .select('*')
    .in('category', ['home', 'contact'])

  // Helper function to get content by ID
  const getContent = (id: string) => {
    return content?.find(item => item.id === id)?.content || ''
  }

  return (
    <div style={{ minHeight: '100vh' }}>
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
            <Link href="/" style={{ color: '#4A90C8', textDecoration: 'none', fontWeight: 600 }}>首頁</Link>
            <Link href="/courses" style={{ color: '#333', textDecoration: 'none', fontWeight: 500 }}>課程介紹</Link>
            <Link href="/gallery" style={{ color: '#333', textDecoration: 'none', fontWeight: 500 }}>活動花絮</Link>
            <Link href="/about" style={{ color: '#333', textDecoration: 'none', fontWeight: 500 }}>關於我們</Link>
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

      {/* Footer */}
      <footer style={{ background: '#333', color: 'white', padding: '3rem 1.5rem' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
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
                <p>📍 {getContent('contact_address')}</p>
                <p>📞 {getContent('contact_phone')}</p>
                <p>⏰ {getContent('contact_time')}</p>
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
  )
}
