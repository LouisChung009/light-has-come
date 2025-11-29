import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { deleteAlbum } from './actions'
import DeleteAlbumButton from './DeleteAlbumButton'

export default async function AdminGallery() {
    const supabase = await createClient()

    const { data: albums } = await supabase
        .from('albums')
        .select('*')
        .order('date', { ascending: false })

    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.75rem', color: '#333', margin: 0 }}>相簿管理</h1>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
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
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                        border: '1px solid #eee'
                    }}>
                        <div style={{
                            height: '150px',
                            background: album.cover_color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '3rem'
                        }}>
                            📷
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
                            <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem', color: '#333' }}>{album.title}</h3>
                            <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                {album.description}
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
