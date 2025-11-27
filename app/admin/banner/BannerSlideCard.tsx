'use client'

import { deleteBannerSlide, toggleBannerSlide } from '../content/actions'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Banner {
    id: string
    title: string | null
    subtitle: string | null
    media_url: string
    media_type: string
    link_url: string | null
    display_order: number
    is_active: boolean
}

export default function BannerSlideCard({ banner }: { banner: Banner }) {
    const [isProcessing, setIsProcessing] = useState(false)
    const router = useRouter()

    const handleDelete = async () => {
        if (!confirm('確定要刪除這個 Banner 嗎？')) return

        setIsProcessing(true)
        await deleteBannerSlide(banner.id, banner.media_url)
        router.refresh()
    }

    const handleToggle = async () => {
        setIsProcessing(true)
        await toggleBannerSlide(banner.id, !banner.is_active)
        router.refresh()
    }

    return (
        <div style={{
            background: 'white',
            borderRadius: '1rem',
            overflow: 'hidden',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
            opacity: isProcessing ? 0.5 : 1
        }}>
            <div style={{ position: 'relative', aspectRatio: '16/9', background: '#f3f4f6' }}>
                {banner.media_type === 'video' ? (
                    <video
                        src={banner.media_url}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        muted
                        loop
                        autoPlay
                    />
                ) : (
                    <img
                        src={banner.media_url}
                        alt={banner.title || 'Banner'}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                )}
                <div style={{
                    position: 'absolute',
                    top: '0.5rem',
                    right: '0.5rem',
                    background: banner.is_active ? '#10b981' : '#ef4444',
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: 600
                }}>
                    {banner.is_active ? '啟用中' : '已停用'}
                </div>
            </div>

            <div style={{ padding: '1rem' }}>
                {banner.title && (
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#333', margin: '0 0 0.25rem' }}>
                        {banner.title}
                    </h3>
                )}
                {banner.subtitle && (
                    <p style={{ fontSize: '0.875rem', color: '#666', margin: '0 0 0.5rem' }}>
                        {banner.subtitle}
                    </p>
                )}
                <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '1rem' }}>
                    排序: {banner.display_order} | 類型: {banner.media_type === 'video' ? '影片' : '圖片'}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                        onClick={handleToggle}
                        disabled={isProcessing}
                        style={{
                            flex: 1,
                            background: banner.is_active ? '#f59e0b' : '#10b981',
                            color: 'white',
                            border: 'none',
                            padding: '0.5rem',
                            borderRadius: '0.375rem',
                            fontSize: '0.875rem',
                            cursor: isProcessing ? 'not-allowed' : 'pointer',
                            fontWeight: 500
                        }}
                    >
                        {banner.is_active ? '停用' : '啟用'}
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={isProcessing}
                        style={{
                            flex: 1,
                            background: '#ef4444',
                            color: 'white',
                            border: 'none',
                            padding: '0.5rem',
                            borderRadius: '0.375rem',
                            fontSize: '0.875rem',
                            cursor: isProcessing ? 'not-allowed' : 'pointer',
                            fontWeight: 500
                        }}
                    >
                        刪除
                    </button>
                </div>
            </div>
        </div>
    )
}
