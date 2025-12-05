import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { logout } from './actions'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // 如果是登入頁面，不需要顯示側邊欄
    // 但這裡是 Layout，會包住所有 admin 頁面
    // 我們可以透過檢查 user 是否存在來決定是否顯示後台介面
    // 如果沒有 user，且不是在登入頁 (page.tsx)，Middleware 會導向登入頁
    // 但 Layout 會在 page.tsx 之前渲染

    if (!user) {
        return <>{children}</>
    }

    return (
        <div className="admin-panel" style={{ display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif' }}>
            {/* Sidebar */}
            <aside style={{
                width: '250px',
                background: '#333',
                color: 'white',
                padding: '2rem 1rem',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <div style={{ marginBottom: '2rem', padding: '0 1rem' }}>
                    <h2 style={{ fontSize: '1.25rem', color: '#FFD93D', margin: 0 }}>光·來了</h2>
                    <span style={{ fontSize: '0.875rem', color: '#999' }}>後台管理系統</span>
                </div>

                <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <Link href="/admin/dashboard" style={{
                        padding: '0.75rem 1rem',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '0.5rem',
                        background: 'rgba(255,255,255,0.1)'
                    }}>
                        📊 報名資料
                    </Link>
                    <Link href="/admin/gallery" style={{
                        padding: '0.75rem 1rem',
                        color: 'rgba(255,255,255,0.8)',
                        textDecoration: 'none',
                        borderRadius: '0.5rem',
                        // background: 'rgba(255,255,255,0.1)'
                    }}>
                        📷 相簿管理
                    </Link>
                    <Link href="/admin/content" style={{
                        padding: '0.75rem 1rem',
                        color: 'rgba(255,255,255,0.8)',
                        textDecoration: 'none',
                        borderRadius: '0.5rem',
                    }}>
                        📝 文案管理
                    </Link>
                    <Link href="/admin/categories" style={{
                        padding: '0.75rem 1rem',
                        color: 'rgba(255,255,255,0.8)',
                        textDecoration: 'none',
                        borderRadius: '0.5rem',
                    }}>
                        🏷️ 分類管理
                    </Link>
                    <Link href="/" target="_blank" style={{
                        padding: '0.75rem 1rem',
                        color: 'rgba(255,255,255,0.8)',
                        textDecoration: 'none',
                        borderRadius: '0.5rem',
                        marginTop: 'auto'
                    }}>
                        🔗 前往前台
                    </Link>
                </nav>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem', marginTop: '1rem' }}>
                    <div style={{ padding: '0 1rem', marginBottom: '1rem', fontSize: '0.875rem', color: '#999' }}>
                        {user.email}
                    </div>
                    <form action={logout}>
                        <button style={{
                            width: '100%',
                            padding: '0.75rem',
                            background: 'transparent',
                            border: '1px solid rgba(255,255,255,0.2)',
                            color: 'white',
                            borderRadius: '0.5rem',
                            cursor: 'pointer'
                        }}>
                            登出
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, background: '#F5F5F5', overflowY: 'auto' }}>
                {children}
            </main>
        </div>
    )
}
