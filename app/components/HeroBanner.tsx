'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface BannerSlide {
    id: string
    title: string | null
    subtitle: string | null
    media_url: string
    media_type: string
    link_url: string | null
}

type HeroStyle = {
    titleColor: string
    subtitleColor: string
    titleSize: string
    subtitleSize: string
    textAlign: 'center' | 'left'
    ctaLabel: string
    ctaHref: string
    ctaBg: string
    ctaTextColor: string
}

export default function HeroBanner({ heroStyle }: { heroStyle: HeroStyle }) {
    const [banners, setBanners] = useState<BannerSlide[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchBanners() {
            try {
                const response = await fetch('/api/banner')
                const data = await response.json()
                if (Array.isArray(data) && data.length > 0) {
                    setBanners(data)
                }
            } catch (error) {
                console.error('Failed to fetch banners:', error)
            }
            setLoading(false)
        }

        fetchBanners()
    }, [])

    useEffect(() => {
        if (banners.length <= 1) return

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % banners.length)
        }, 5000) // 每秒切換
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
                color: heroStyle.titleColor
            }}>
                載入中..
            </div>
        )
    }

    if (banners.length === 0) {
        // 沒有 Banner 時的預設版面
        return (
            <section style={{
                background: 'linear-gradient(135deg, #4A90C8, #2E5C8A)',
                color: heroStyle.titleColor,
                padding: '6rem 1.5rem',
                textAlign: heroStyle.textAlign,
                minHeight: '600px',
                display: 'flex',
                alignItems: 'center'
            }}>
                <div className="container">
                    <h1 style={{
                        fontSize: heroStyle.titleSize,
                        marginBottom: '1.25rem',
                        fontWeight: 800,
                        color: heroStyle.titleColor
                    }}>
                        讓孩子在愛中成長
                    </h1>
                    <p style={{
                        fontSize: heroStyle.subtitleSize,
                        marginBottom: '2.25rem',
                        opacity: 0.95,
                        color: heroStyle.subtitleColor,
                        fontWeight: 600
                    }}>
                        大里思恩堂兒童主日學歡迎您
                    </p>
                    <Link href={heroStyle.ctaHref || '/register'} style={{
                        display: 'inline-block',
                        background: heroStyle.ctaBg,
                        color: heroStyle.ctaTextColor,
                        padding: '1rem 2.75rem',
                        borderRadius: '9999px',
                        textDecoration: 'none',
                        fontWeight: 800,
                        fontSize: '1.125rem',
                        letterSpacing: '0.01em',
                        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.12)',
                        border: '2px solid rgba(255,255,255,0.2)'
                    }}>
                        {heroStyle.ctaLabel || '立即預約體驗'}
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
                        background: 'linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0.55))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: heroStyle.textAlign === 'left' ? 'flex-start' : 'center',
                        padding: '0 1.25rem'
                    }}>
                        <div className="container" style={{
                            textAlign: heroStyle.textAlign,
                            color: 'white',
                            padding: '2.5rem',
                            maxWidth: '980px',
                            margin: heroStyle.textAlign === 'left' ? '0 auto 0 0' : '0 auto'
                        }}>
                            {banner.title && (
                                <h1 style={{
                                    fontSize: heroStyle.titleSize,
                                    marginBottom: '1rem',
                                    fontWeight: 800,
                                    textShadow: '2px 2px 6px rgba(0,0,0,0.45)',
                                    color: heroStyle.titleColor,
                                    lineHeight: 1.1
                                }}>
                                    {banner.title}
                                </h1>
                            )}
                            {banner.subtitle && (
                                <p style={{
                                    fontSize: heroStyle.subtitleSize,
                                    marginBottom: '2.25rem',
                                    textShadow: '1px 1px 3px rgba(0,0,0,0.4)',
                                    color: heroStyle.subtitleColor,
                                    fontWeight: 600
                                }}>
                                    {banner.subtitle}
                                </p>
                            )}
                            {(banner.link_url || heroStyle.ctaHref) && (
                                <Link href={banner.link_url || heroStyle.ctaHref} style={{
                                    display: 'inline-block',
                                    background: heroStyle.ctaBg,
                                    color: heroStyle.ctaTextColor,
                                    padding: '1rem 2.75rem',
                                    borderRadius: '9999px',
                                    textDecoration: 'none',
                                    fontWeight: 800,
                                    fontSize: '1.125rem',
                                    letterSpacing: '0.01em',
                                    boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                                    border: '2px solid rgba(255,255,255,0.2)'
                                }}>
                                    {heroStyle.ctaLabel || '立即預約體驗'}
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
