import Link from 'next/link'
import Footer from '../components/Footer'
import { createClient } from '@/utils/supabase/server'

type Album = {
    id: string
    title: string
    date: string
    description: string
    category: string
    cover_color: string
    cover_photo_url?: string
    photos?: { count: number }[]
    is_pinned?: boolean
}

type Category = {
    id: string
    label: string
    value: string
    sort_order: number
}

export const dynamic = 'force-dynamic'

export default async function Gallery({ searchParams }: { searchParams: Promise<{ filter?: string }> }) {
    const resolvedParams = await searchParams
    const filter = resolvedParams?.filter || 'all'

    const supabase = await createClient()

    const [{ data: categories }, { data: albums }] = await Promise.all([
        supabase
            .from('album_categories')
            .select('*')
            .order('sort_order', { ascending: true }),
        supabase
            .from('albums')
            .select(`*, photos:photos(count)`)
            .order('is_pinned', { ascending: false })
            .order('date', { ascending: false }),
    ])

    const safeCategories = (categories || []) as Category[]
    const safeAlbums = (albums || []) as Album[]

    const filteredAlbums = filter === 'all'
        ? safeAlbums
        : safeAlbums.filter(album => album.category === filter)

    const getCategoryLabel = (value: string) => {
        const cat = safeCategories.find(c => c.value === value)
        return cat ? cat.label : value
    }

    const filterLinkStyle = (isActive: boolean) => ({
        padding: '0.5rem 1.5rem',
        border: `2px solid ${isActive ? '#4A90C8' : '#eee'}`,
        background: isActive ? '#4A90C8' : 'white',
        color: isActive ? 'white' : '#333',
        borderRadius: '0.5rem',
        cursor: 'pointer',
        fontWeight: 500,
        transition: 'all 0.3s',
        fontSize: '0.9rem',
        textDecoration: 'none'
    })

    return (
        <div style={{ minHeight: '100vh', background: '#F5F5F5' }}>

            {/* Page Header */}
            <section style={{
                background: 'linear-gradient(135deg, #4A90C8, #2E5C8A)',
                color: 'white',
                padding: '4rem 1.5rem',
                textAlign: 'center'
            }}>
                <div className="container">
                    <h1 style={{ fontSize: 'clamp(2rem, 5vw, 2.5rem)', marginBottom: '1rem' }}>活動花絮</h1>
                    <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.125rem)', opacity: 0.9 }}>記錄孩子們在「光·來了」的精彩時刻</p>
                </div>
            </section>

            {/* Filter */}
            <section style={{ background: 'white', padding: '2rem 1.5rem', borderBottom: '1px solid #eee' }}>
                <div className="container">
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link href="/gallery" style={filterLinkStyle(filter === 'all')}>
                            全部活動
                        </Link>
                        {safeCategories.map(cat => (
                            <Link
                                key={cat.id}
                                href={`?filter=${cat.value}`}
                                style={filterLinkStyle(filter === cat.value)}
                            >
                                {cat.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Album Grid */}
            <section style={{ padding: '4rem 1.5rem' }}>
                <div className="container">
                    {filteredAlbums.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>目前沒有相關相簿</div>
                    ) : (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                            gap: '2rem',
                            marginBottom: '3rem'
                        }}>
                            {filteredAlbums.map(album => (
                                <Link href={`/gallery/${album.id}`} key={album.id} style={{ textDecoration: 'none' }}>
                                    <div style={{
                                        background: 'white',
                                        borderRadius: '1rem',
                                        overflow: 'hidden',
                                        boxShadow: album.is_pinned ? '0 4px 12px rgba(255, 217, 61, 0.3)' : '0 4px 12px rgba(0,0,0,0.1)',
                                        transition: 'transform 0.3s, box-shadow 0.3s',
                                        cursor: 'pointer',
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        border: album.is_pinned ? '2px solid #FFD93D' : 'none'
                                    }}
                                        className="hover:translate-y-[-8px] hover:shadow-lg"
                                    >
                                        <div style={{
                                            aspectRatio: '4/3',
                                            background: album.cover_photo_url ? `url(${album.cover_photo_url}) center/cover no-repeat` : album.cover_color,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '4rem',
                                            position: 'relative'
                                        }}>
                                            <div style={{
                                                position: 'absolute',
                                                top: '10px',
                                                right: '10px',
                                                background: 'rgba(0,0,0,0.5)',
                                                color: 'white',
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                fontSize: '0.875rem',
                                                fontWeight: 500
                                            }}>
                                                {album.photos?.[0]?.count || 0} 張相片
                                            </div>
                                            {album.is_pinned && (
                                                <div style={{
                                                    position: 'absolute',
                                                    top: '10px',
                                                    left: '10px',
                                                    background: '#FFD93D',
                                                    color: '#8a6a00',
                                                    padding: '4px 8px',
                                                    borderRadius: '4px',
                                                    fontSize: '0.875rem',
                                                    fontWeight: 700
                                                }}>
                                                    置頂
                                                </div>
                                            )}
                                            {!album.cover_photo_url && <span>??</span>}
                                        </div>

                                        <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                            <div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ fontSize: '0.875rem', color: '#999' }}>{album.date}</span>
                                                <span style={{
                                                    display: 'inline-block',
                                                    padding: '2px 8px',
                                                    background: '#F5F5F5',
                                                    color: '#4A90C8',
                                                    borderRadius: '0.25rem',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 600
                                                }}>
                                                    {getCategoryLabel(album.category)}
                                                </span>
                                            </div>
                                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#333' }}>{album.title}</h3>
                                            <p style={{ color: '#666', fontSize: '0.875rem', marginBottom: '1rem', flex: 1 }}>{album.description}</p>
                                            <div style={{ color: '#4A90C8', fontSize: '0.875rem', fontWeight: 600 }}>
                                                查看相簿 →
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    <div style={{
                        textAlign: 'center',
                        padding: '3rem',
                        background: 'white',
                        borderRadius: '1rem',
                        color: '#666'
                    }}>
                        <p style={{ marginBottom: '0.5rem' }}>?? 更多精彩照片將陸續上傳</p>
                        <p>?? 提示: 點擊相簿可查看詳細照片</p>
                    </div>
                </div>
            </section>

            <Footer />
        </div >
    );
}
