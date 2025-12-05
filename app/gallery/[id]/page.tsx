import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Footer from '../../components/Footer'

type Photo = {
    id: string
    src: string
    alt: string
    width: number
    height: number
}

type Album = {
    id: string
    title: string
    date: string
    description: string
    cover_color: string
}

export const dynamic = 'force-dynamic'

export default async function AlbumDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()

    const { data: albumData } = await supabase
        .from('albums')
        .select('id, title, date, description, cover_color')
        .eq('id', id)
        .single()

    const album = albumData as Album | null

    if (!album) {
        notFound()
    }

    const { data: photosData } = await supabase
        .from('photos')
        .select('*')
        .eq('album_id', id)
        .order('created_at', { ascending: false })

    const photos = (photosData || []) as Photo[]

    return (
        <div style={{ minHeight: '100vh', background: '#F5F5F5' }}>

            {/* Album Header */}
            <section style={{
                background: album.cover_color,
                color: 'white',
                padding: '4rem 1.5rem',
                textAlign: 'center',
                position: 'relative'
            }}>
                <div className="container">
                    <Link href="/gallery" style={{
                        position: 'absolute',
                        top: '2rem',
                        left: '2rem',
                        color: 'white',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontWeight: 600,
                        background: 'rgba(0,0,0,0.2)',
                        padding: '0.5rem 1rem',
                        borderRadius: '9999px'
                    }}>
                        ← 返回列表
                    </Link>
                    <span style={{
                        display: 'inline-block',
                        background: 'rgba(255,255,255,0.2)',
                        padding: '0.25rem 1rem',
                        borderRadius: '9999px',
                        marginBottom: '1rem',
                        fontSize: '0.875rem'
                    }}>
                        {album.date}
                    </span>
                    <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '1rem' }}>{album.title}</h1>
                    <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', opacity: 0.9, maxWidth: '800px', margin: '0 auto' }}>
                        {album.description || '這個相簿尚無描述'}
                    </p>
                </div>
            </section>

            {/* Masonry Layout */}
            <section style={{ padding: '2rem 1.5rem' }}>
                <div className="container">
                    {photos.length === 0 ? (
                        <div style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>此相簿暫無照片</div>
                    ) : (
                        <div style={{
                            columnCount: 3,
                            columnGap: '1.5rem',
                        }} className="masonry-grid">
                            {photos.map((photo: Photo) => (
                                <div key={photo.id} style={{
                                    breakInside: 'avoid',
                                    marginBottom: '1.5rem',
                                    background: 'white',
                                    borderRadius: '1rem',
                                    overflow: 'hidden',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                    transition: 'transform 0.3s',
                                }} className="hover:scale-[1.02]">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={photo.src}
                                        alt={photo.alt || 'photo'}
                                        style={{
                                            width: '100%',
                                            height: 'auto',
                                            display: 'block',
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <Footer />

            <style>{`
                @media (max-width: 1024px) {
                    .masonry-grid {
                        column-count: 2 !important;
                    }
                }
                @media (max-width: 640px) {
                    .masonry-grid {
                        column-count: 1 !important;
                    }
                }
            `}</style>
        </div>
    );
}
