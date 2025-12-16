'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

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

        try {
            // Import dynamically to avoid server-only module issues in client component if possible, 
            // or just rely on Next.js handling server actions imports.
            // Actually, we should import at top level.
            const { createBannerSlide } = await import('@/app/admin/content/actions')

            const result = await createBannerSlide(formData)

            if (result?.error) {
                throw new Error(result.error)
            }

            formEl.reset()
            // router.refresh() is handled by revalidatePath in the action
        } catch (err) {
            console.error(err)
            const message = err instanceof Error ? err.message : '上傳失敗，請稍後再試'
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
