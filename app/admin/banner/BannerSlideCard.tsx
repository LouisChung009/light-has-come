'use client'

import { deleteBannerSlide, toggleBannerSlide } from '../content/actions'
import { updateBannerSlide } from './actions'
import { useState, useTransition } from 'react'
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
    const [isEditing, setIsEditing] = useState(false)
    const [title, setTitle] = useState(banner.title || '')
    const [subtitle, setSubtitle] = useState(banner.subtitle || '')
    const [linkUrl, setLinkUrl] = useState(banner.link_url || '')
    const [displayOrder, setDisplayOrder] = useState(banner.display_order || 0)
    const [file, setFile] = useState<File | null>(null)
    const [message, setMessage] = useState('')
    const [isSaving, startTransition] = useTransition()
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

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault()
        setMessage('')
        startTransition(async () => {
            const formData = new FormData()
            formData.append('id', banner.id)
            formData.append('title', title)
            formData.append('subtitle', subtitle)
            formData.append('linkUrl', linkUrl)
            formData.append('displayOrder', String(displayOrder))
            if (file) {
                formData.append('file', file)
            }
            const res = await updateBannerSlide(formData)
            if (res?.error) {
                setMessage(res.error)
                return
            }
            setMessage('已更新')
            setIsEditing(false)
            setFile(null)
            router.refresh()
        })
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
                    // eslint-disable-next-line @next/next/no-img-element
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

                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
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
                    <button
                        onClick={() => setIsEditing((prev) => !prev)}
                        disabled={isProcessing}
                        style={{
                            flex: 1,
                            background: '#6366f1',
                            color: 'white',
                            border: 'none',
                            padding: '0.5rem',
                            borderRadius: '0.375rem',
                            fontSize: '0.875rem',
                            cursor: isProcessing ? 'not-allowed' : 'pointer',
                            fontWeight: 500
                        }}
                    >
                        {isEditing ? '關閉編輯' : '編輯'}
                    </button>
                </div>

                {isEditing && (
                    <form onSubmit={handleUpdate} style={{ display: 'grid', gap: '0.5rem' }}>
                        <input
                            type="text"
                            placeholder="標題"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            style={{ width: '100%', padding: '0.6rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}
                        />
                        <input
                            type="text"
                            placeholder="副標"
                            value={subtitle}
                            onChange={(e) => setSubtitle(e.target.value)}
                            style={{ width: '100%', padding: '0.6rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}
                        />
                        <input
                            type="url"
                            placeholder="連結 (可留空)"
                            value={linkUrl}
                            onChange={(e) => setLinkUrl(e.target.value)}
                            style={{ width: '100%', padding: '0.6rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}
                        />
                        <label style={{ fontSize: '0.85rem', color: '#555' }}>
                            排序
                            <input
                                type="number"
                                value={displayOrder}
                                onChange={(e) => setDisplayOrder(parseInt(e.target.value, 10) || 0)}
                                style={{ width: '100%', padding: '0.6rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb', marginTop: '0.25rem' }}
                            />
                        </label>
                        <label style={{ fontSize: '0.85rem', color: '#555' }}>
                            更換圖片/影片 (選填)
                            <input
                                type="file"
                                accept="image/*,video/*"
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                                style={{ width: '100%', marginTop: '0.25rem' }}
                            />
                        </label>
                        <button
                            type="submit"
                            disabled={isSaving}
                            style={{
                                background: isSaving ? '#ccc' : '#4A90C8',
                                color: 'white',
                                padding: '0.65rem',
                                borderRadius: '0.5rem',
                                border: 'none',
                                fontWeight: 700,
                                cursor: isSaving ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {isSaving ? '儲存中…' : '儲存修改'}
                        </button>
                        {message && <div style={{ color: message === '已更新' ? '#16a34a' : '#ef4444', fontWeight: 600 }}>{message}</div>}
                    </form>
                )}
            </div>
        </div>
    )
}
