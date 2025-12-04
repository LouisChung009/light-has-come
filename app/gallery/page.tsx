'use client';

import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// Define types for our Supabase data
interface Album {
    id: string;
    title: string;
    date: string;
    description: string;
    category: string;
    cover_color: string;
    cover_photo_url?: string;
    photos: { count: number }[];
}

interface Category {
    id: string;
    label: string;
    value: string;
    sort_order: number;
}

export default function Gallery() {
    const [filter, setFilter] = useState('all');
    const [albums, setAlbums] = useState<Album[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [contactInfo, setContactInfo] = useState({ address: '', phone: '', time: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            const supabase = createClient();

            // Fetch contact info
            const { data: contactData } = await supabase
                .from('site_content')
                .select('*')
                .eq('category', 'contact');

            if (contactData) {
                setContactInfo({
                    address: contactData.find(item => item.id === 'contact_address')?.content || '',
                    phone: contactData.find(item => item.id === 'contact_phone')?.content || '',
                    time: contactData.find(item => item.id === 'contact_time')?.content || ''
                });
            }

            // Fetch categories
            const { data: categoriesData } = await supabase
                .from('album_categories')
                .select('*')
                .order('sort_order', { ascending: true });

            if (categoriesData) {
                setCategories(categoriesData);
            }

            // Fetch albums with photo count
            const { data: albumsData, error } = await supabase
                .from('albums')
                .select(`
                    *,
                    photos:photos(count)
                `)
                .order('date', { ascending: false });

            if (error) {
                console.error('Error fetching albums:', error);
            } else {
                setAlbums(albumsData || []);
            }
            setLoading(false);
        }

        fetchData();
    }, []);

    const filteredAlbums = filter === 'all'
        ? albums
        : albums.filter(album => album.category === filter);

    // Helper to get category label
    const getCategoryLabel = (value: string) => {
        const cat = categories.find(c => c.value === value);
        return cat ? cat.label : value;
    };

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
                        <button
                            onClick={() => setFilter('all')}
                            style={{
                                padding: '0.5rem 1.5rem',
                                border: `2px solid ${filter === 'all' ? '#4A90C8' : '#eee'}`,
                                background: filter === 'all' ? '#4A90C8' : 'white',
                                color: filter === 'all' ? 'white' : '#333',
                                borderRadius: '0.5rem',
                                cursor: 'pointer',
                                fontWeight: 500,
                                transition: 'all 0.3s',
                                fontSize: '0.9rem'
                            }}
                        >
                            全部活動
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setFilter(cat.value)}
                                style={{
                                    padding: '0.5rem 1.5rem',
                                    border: `2px solid ${filter === cat.value ? '#4A90C8' : '#eee'}`,
                                    background: filter === cat.value ? '#4A90C8' : 'white',
                                    color: filter === cat.value ? 'white' : '#333',
                                    borderRadius: '0.5rem',
                                    cursor: 'pointer',
                                    fontWeight: 500,
                                    transition: 'all 0.3s',
                                    fontSize: '0.9rem'
                                }}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Album Grid */}
            <section style={{ padding: '4rem 1.5rem' }}>
                <div className="container">
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>載入中...</div>
                    ) : filteredAlbums.length === 0 ? (
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
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                        transition: 'transform 0.3s, box-shadow 0.3s',
                                        cursor: 'pointer',
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column'
                                    }}
                                        className="hover:translate-y-[-8px] hover:shadow-lg"
                                    >
                                        {/* Album Cover */}
                                        <div style={{
                                            aspectRatio: '4/3',
                                            background: album.cover_photo_url ? `url(${album.cover_photo_url}) center/cover no-repeat` : album.cover_color,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '4rem',
                                            position: 'relative'
                                        }}>
                                            {/* Stack effect */}
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
                                            {!album.cover_photo_url && <span>📷</span>}
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
                        <p style={{ marginBottom: '0.5rem' }}>📸 更多精彩照片將陸續上傳</p>
                        <p>💡 提示: 點擊相簿可查看詳細照片</p>
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
                                <p>📍 {contactInfo.address}</p>
                                <p>📞 {contactInfo.phone}</p>
                                <p>⏰ {contactInfo.time}</p>
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
