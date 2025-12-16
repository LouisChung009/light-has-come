'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export default function BannerUploadForm() {
    const [isUploading, setIsUploading] = useState(false)
    const router = useRouter()
    const formRef = useRef<HTMLFormElement>(null)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formEl = formRef.current
        if (!formEl) return

        const formData = new FormData(formEl)
        const file = formData.get('file') as File | null
        if (!file) {
            alert('請選擇檔案')
            return
        }

        setIsUploading(true)

        const supabase = createClient()
        const title = (formData.get('title') as string) || null
        const subtitle = (formData.get('subtitle') as string) || null
        const linkUrl = (formData.get('linkUrl') as string) || null
        const displayOrder = parseInt(formData.get('displayOrder') as string) || 0

        const mediaType = file.type?.startsWith('video/') ? 'video' : 'image'
        const fileExt = file.name.split('.').pop() || 'bin'
        const fileName = `banners/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

        try {
            // 直接上傳到 Supabase Storage，避免經過 Vercel 函式的尺寸限制
            const { error: uploadError } = await supabase.storage
                .from('gallery')
                .upload(fileName, file, {
                    contentType: file.type || undefined,
                    upsert: true,
                })

            if (uploadError) {
                throw new Error(`檔案上傳失敗：${uploadError.message}`)
            }

            const { data: { publicUrl } } = supabase.storage
                .from('gallery')
                .getPublicUrl(fileName)

            const { error: dbError } = await supabase
                .from('banner_slides')
                .insert({
                    title,
                    subtitle,
                    media_url: publicUrl,
                    media_type: mediaType,
                    link_url: linkUrl || null,
                    display_order: displayOrder,
                    is_active: true
                })

            if (dbError) {
                throw new Error(`寫入資料庫失敗：${dbError.message}`)
            }

            formEl.reset()
            router.refresh()
        } catch (err) {
            console.error(err)
            const message = err instanceof Error ? err.message : '上傳失敗，請稍後再試'
            // Vercel 若回傳純文字（例如 Request Entity Too Large），避免 JSON parse 錯誤
            alert(message)
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <form ref={formRef} onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#333' }}>
                    照片或影片 <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                    type="file"
                    name="file"
                    accept="image/*,video/*"
                    required
                    disabled={isUploading}
                    style={{ width: '100%', padding: '0.5rem', border: '2px solid #e5e7eb', borderRadius: '0.5rem' }}
                />
                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                    支援圖片（JPG, PNG）或影片（MP4, MOV）
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#333' }}>
                        標題（選填）
                    </label>
                    <input
                        type="text"
                        name="title"
                        placeholder="例如：歡迎來到光·來了"
                        disabled={isUploading}
                        style={{ width: '100%', padding: '0.75rem', border: '2px solid #e5e7eb', borderRadius: '0.5rem' }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#333' }}>
                        副標題（選填）
                    </label>
                    <input
                        type="text"
                        name="subtitle"
                        placeholder="例如：讓孩子在愛中成長"
                        disabled={isUploading}
                        style={{ width: '100%', padding: '0.75rem', border: '2px solid #e5e7eb', borderRadius: '0.5rem' }}
                    />
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#333' }}>
                        連結網址（選填）
                    </label>
                    <input
                        type="url"
                        name="linkUrl"
                        placeholder="例如：/register"
                        disabled={isUploading}
                        style={{ width: '100%', padding: '0.75rem', border: '2px solid #e5e7eb', borderRadius: '0.5rem' }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#333' }}>
                        排序
                    </label>
                    <input
                        type="number"
                        name="displayOrder"
                        defaultValue="0"
                        min="0"
                        disabled={isUploading}
                        style={{ width: '100%', padding: '0.75rem', border: '2px solid #e5e7eb', borderRadius: '0.5rem' }}
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={isUploading}
                style={{
                    background: isUploading ? '#ccc' : '#4A90C8',
                    color: 'white',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    fontWeight: 600,
                    cursor: isUploading ? 'not-allowed' : 'pointer'
                }}
            >
                {isUploading ? '上傳中...' : '上傳 Banner'}
            </button>
        </form>
    )
}
