'use client';

import { use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { albums } from '../../data/albums';

export default function AlbumDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const album = albums.find(a => a.id === id);

    if (!album) {
        notFound();
    }

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
                        <Link href="/gallery" style={{ color: '#4A90C8', textDecoration: 'none', fontWeight: 600 }}>活動花絮</Link>
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

            {/* Album Header */}
            <section style={{
                background: album.coverColor,
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
                        {album.description}
                    </p>
                </div>
            </section>

            {/* Masonry Layout */}
            <section style={{ padding: '2rem 1.5rem' }}>
                <div className="container">
                    <div style={{
                        columnCount: 3,
                        columnGap: '1.5rem',
                        // Responsive columns handled by media queries in style tag below
                    }} className="masonry-grid">
                        {album.photos.map((photo) => (
                            <div key={photo.id} style={{
                                breakInside: 'avoid',
                                marginBottom: '1.5rem',
                                background: 'white',
                                borderRadius: '1rem',
                                overflow: 'hidden',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                transition: 'transform 0.3s',
                            }} className="hover:scale-[1.02]">
                                <img
                                    src={photo.src}
                                    alt={photo.alt}
                                    style={{
                                        width: '100%',
                                        height: 'auto',
                                        display: 'block',
                                    }}
                                />
                                <div style={{ padding: '1rem' }}>
                                    <p style={{ margin: 0, fontSize: '0.875rem', color: '#666' }}>{photo.alt}</p>
                                </div>
                            </div>
                        ))}
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

            <style jsx global>{`
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
