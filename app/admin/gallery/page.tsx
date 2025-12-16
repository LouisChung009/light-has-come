import { getDb, Album } from '@/utils/db'
import Link from 'next/link'
import DeleteAlbumButton from './DeleteAlbumButton'
import SortControl from './SortControl'
import PinButton from './PinButton'

export default async function AdminGallery({ searchParams }: { searchParams: Promise<{ sort?: string }> }) {
    const { sort = 'date_desc' } = await searchParams
    const sql = getDb()

    // Build ORDER BY clause based on sort parameter
    let orderBy = 'is_pinned DESC, date DESC'
    switch (sort) {
        case 'date_asc':
            orderBy = 'is_pinned DESC, date ASC'
            break
        case 'title_asc':
            orderBy = 'is_pinned DESC, title ASC'
            break
        case 'title_desc':
            orderBy = 'is_pinned DESC, title DESC'
            break
        case 'date_desc':
        default:
            orderBy = 'is_pinned DESC, date DESC'
            break
    }

    const albums = await sql`SELECT * FROM albums ORDER BY ${sql.unsafe(orderBy)}` as Album[]


    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.75rem', color: '#333', margin: 0 }}>相簿管理</h1>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <SortControl />
                    <div style={{ width: '1px', height: '24px', background: '#e2e8f0', margin: '0 0.5rem' }}></div>
                    <Link href="/admin/gallery/bulk-import" style={{
                        background: '#1E293B',
                        color: 'white',
                        padding: '0.75rem 1.25rem',
                        borderRadius: '0.5rem',
                        textDecoration: 'none',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem'
                    }}>
                        ⚡ 批次匯入
                    </Link>
                    <Link href="/admin/gallery/new" style={{
                        background: '#4A90C8',
                        color: 'white',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '0.5rem',
                        textDecoration: 'none',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        + 新增相簿
                    </Link>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {albums?.map((album) => (
                    <div key={album.id} style={{
                        background: 'white',
                        borderRadius: '0.75rem',
                        overflow: 'hidden',
                        boxShadow: album.is_pinned ? '0 4px 12px rgba(255, 217, 61, 0.4)' : '0 2px 8px rgba(0,0,0,0.05)',
                        border: album.is_pinned ? '2px solid #FFD93D' : '1px solid #eee',
                        position: 'relative',
                        transition: 'all 0.3s ease'
                    }}>
                        <div style={{
                            position: 'absolute',
                            top: '0.75rem',
                            right: '0.75rem',
                            zIndex: 10
                        }}>
                            <PinButton id={album.id} isPinned={album.is_pinned || false} />
                        </div>

                        <div style={{
                            height: '150px',
                            background: album.cover_color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '3rem',
                            position: 'relative'
                        }}>
                            {album.cover_photo_url ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={album.cover_photo_url}
                                    alt={album.title}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            ) : (
                                <span>📷</span>
                            )}
                        </div>
                        <div style={{ padding: '1.25rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ fontSize: '0.875rem', color: '#666' }}>{album.date}</span>
                                <span style={{
                                    fontSize: '0.75rem',
                                    background: '#f1f5f9',
                                    padding: '2px 8px',
                                    borderRadius: '4px',
                                    color: '#64748b'
                                }}>
                                    {album.category}
                                </span>
                            </div>
                            <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem', color: '#333' }}>
                                {album.is_pinned && <span style={{ marginRight: '0.5rem' }}>📌</span>}
                                {album.title}
                            </h3>
                            <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '2.6em' }}>
                                {album.description || '沒有描述'}
                            </p>

                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <Link href={`/admin/gallery/${album.id}`} style={{
                                    flex: 1,
                                    textAlign: 'center',
                                    padding: '0.5rem',
                                    border: '1px solid #4A90C8',
                                    color: '#4A90C8',
                                    borderRadius: '0.375rem',
                                    textDecoration: 'none',
                                    fontSize: '0.875rem'
                                }}>
                                    管理照片
                                </Link>
                                <DeleteAlbumButton id={album.id} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
