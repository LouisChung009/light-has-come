'use client'

import { useRef, useState } from 'react'
import { uploadPoster } from './actions'

export default function PosterUploader({ defaultUrl, onUploaded }: { defaultUrl?: string, onUploaded: (url: string) => void }) {
    const [preview, setPreview] = useState(defaultUrl || '')
    const [isUploading, setIsUploading] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFiles = async (files: FileList | null) => {
        if (!files || files.length === 0) return
        const file = files[0]
        setErrorMsg('')
        setIsUploading(true)
        try {
            const formData = new FormData()
            formData.append('file', file)

            const result = await uploadPoster(formData)

            if (result.error) {
                throw new Error(result.error)
            }

            if (result.url) {
                setPreview(result.url)
                onUploaded(result.url)
            }
        } catch (err: any) {
            console.error(err)
            setErrorMsg(err.message || '上傳失敗，請稍後再試')
        } finally {
            setIsUploading(false)
        }
    }

    const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        handleFiles(e.dataTransfer.files)
    }

    return (
        <div style={{ display: 'grid', gap: '0.5rem' }}>
            <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={onDrop}
                style={{
                    border: '2px dashed #cbd5e1',
                    padding: '1.25rem',
                    borderRadius: '0.75rem',
                    background: '#f8fafc',
                    cursor: 'pointer',
                    textAlign: 'center'
                }}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => handleFiles(e.target.files)}
                />
                <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>
                    點擊或拖拉圖片到此處
                </div>
                <div style={{ color: '#475569', fontSize: '0.95rem' }}>建議使用 16:9 的海報圖片</div>
            </div>

            {preview && (
                <div style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.75rem',
                    overflow: 'hidden',
                    background: 'white'
                }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={preview} alt="海報預覽" style={{ width: '100%', display: 'block' }} />
                </div>
            )}

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    style={{
                        padding: '0.6rem 1rem',
                        background: '#4A90C8',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.6rem',
                        fontWeight: 700,
                        cursor: isUploading ? 'not-allowed' : 'pointer'
                    }}
                >
                    {isUploading ? '上傳中...' : '重新選擇'}
                </button>
                {preview && (
                    <button
                        type="button"
                        onClick={() => { setPreview(''); onUploaded('') }}
                        style={{
                            padding: '0.6rem 1rem',
                            background: 'white',
                            color: '#ef4444',
                            border: '1px solid #ef4444',
                            borderRadius: '0.6rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                        }}
                    >
                        清除圖片
                    </button>
                )}
                {errorMsg && <span style={{ color: '#ef4444', fontWeight: 600 }}>{errorMsg}</span>}
            </div>
        </div>
    )
}
