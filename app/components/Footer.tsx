import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Footer() {
  const supabase = await createClient()

  // Fetch contact content from Supabase
  const { data: content } = await supabase
    .from('site_content')
    .select('*')
    .eq('category', 'contact')

  // Helper function to get content by ID
  const getContent = (id: string) => {
    return content?.find(item => item.id === id)?.content || ''
  }

  return (
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
              耶穌說：我就是來到世上的光，使凡信我的不住在黑暗裡。
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
  )
}
