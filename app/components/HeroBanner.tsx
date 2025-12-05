'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'

interface BannerSlide {
    id: string
    title: string | null
    subtitle: string | null
    media_url: string
    media_type: string
    link_url: string | null
}

export default function HeroBanner() {
    const [banners, setBanners] = useState<BannerSlide[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchBanners() {
            const supabase = createClient()
            const { data } = await supabase
                .from('banner_slides')
                .select('*')
                .eq('is_active', true)
                .order('display_order', { ascending: true })

            if (data && data.length > 0) {
                setBanners(data)
            }
            setLoading(false)
        }

        fetchBanners()
    }, [])

    useEffect(() => {
        if (banners.length <= 1) return

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % banners.length)
        }, 5000) // 每5秒切換

        return () => clearInterval(interval)
    }, [banners.length])

    if (loading) {
        return (
            <div style={{
                minHeight: '600px',
                background: 'linear-gradient(135deg, #4A90C8, #2E5C8A)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
            }}>
                載入中...
            </div>
        )
    }

    if (banners.length === 0) {
        // 如果沒有 Banner，顯示預設內容
        return (
            <section style={{
                background: 'linear-gradient(135deg, #4A90C8, #2E5C8A)',
                color: 'white',
                padding: '6rem 1.5rem',
                textAlign: 'center',
                minHeight: '600px',
                display: 'flex',
                alignItems: 'center'
            }}>
                <div className="container">
                    <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', marginBottom: '1.5rem', fontWeight: 700 }}>
                        讓孩子在愛中成長
                    </h1>
                    <p style={{ fontSize: 'clamp(1.125rem, 3vw, 1.5rem)', marginBottom: '2rem', opacity: 0.95 }}>
                        大里思恩堂兒童主日學歡迎您
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
        )
    }

    return (
        <section style={{
            position: 'relative',
            minHeight: '600px',
            overflow: 'hidden'
        }}>
            {/* Banner Slides */}
            {banners.map((banner, index) => (
                <div
                    key={banner.id}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        opacity: index === currentIndex ? 1 : 0,
                        transition: 'opacity 1s ease-in-out',
                        pointerEvents: index === currentIndex ? 'auto' : 'none'
                    }}
                >
                    {banner.media_type === 'video' ? (
                        <video
                            src={banner.media_url}
                            autoPlay
                            loop
                            muted
                            playsInline
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                            }}
                        />
                    ) : (
                        <div
                            style={{
                                width: '100%',
                                height: '100%',
                                backgroundImage: `url(${banner.media_url})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            }}
                        />
                    )}

                    {/* Overlay */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.5))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <div className="container" style={{ textAlign: 'center', color: 'white', padding: '2rem' }}>
                            {banner.title && (
                                <h1 style={{
                                    fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                                    marginBottom: '1rem',
                                    fontWeight: 700,
                                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                                }}>
                                    {banner.title}
                                </h1>
                            )}
                            {banner.subtitle && (
                                <p style={{
                                    fontSize: 'clamp(1.125rem, 3vw, 1.5rem)',
                                    marginBottom: '2rem',
                                    textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                                }}>
                                    {banner.subtitle}
                                </p>
                            )}
                            {banner.link_url && (
                                <Link href={banner.link_url} style={{
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
                                    了解更多
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            ))}

            {/* Indicators */}
            {banners.length > 1 && (
                <div style={{
                    position: 'absolute',
                    bottom: '2rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: '0.5rem',
                    zIndex: 10
                }}>
                    {banners.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            style={{
                                width: index === currentIndex ? '2rem' : '0.75rem',
                                height: '0.75rem',
                                borderRadius: '9999px',
                                background: index === currentIndex ? 'white' : 'rgba(255,255,255,0.5)',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.3s'
                            }}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </section>
    )
}
