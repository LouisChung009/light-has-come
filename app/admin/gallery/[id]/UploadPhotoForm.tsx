'use client'

import { uploadPhoto } from '../actions'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

export default function UploadPhotoForm({ albumId }: { albumId: string }) {
    const [isUploading, setIsUploading] = useState(false)
    const [files, setFiles] = useState<File[]>([])
    const [progress, setProgress] = useState({ current: 0, total: 0 })
    const [isDragging, setIsDragging] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const router = useRouter()

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(prev => [...prev, ...Array.from(e.target.files || [])])
        }
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        if (e.dataTransfer.files) {
            setFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)])
        }
    }

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index))
    }

    const handleUpload = async () => {
        if (files.length === 0) return

        setIsUploading(true)
        setProgress({ current: 0, total: files.length })

        for (let i = 0; i < files.length; i++) {
            const formData = new FormData()
            formData.append('albumId', albumId)
            formData.append('file', files[i])

            try {
                await uploadPhoto(formData)
            } catch (error) {
                console.error('Upload failed for file:', files[i].name, error)
            }

            setProgress({ current: i + 1, total: files.length })
        }

        setIsUploading(false)
        setFiles([])
        // Refresh the page to show new photos
        router.refresh()
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Drag and Drop Zone */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{
                    border: `2px dashed ${isDragging ? '#4A90C8' : '#ddd'}`,
                    borderRadius: '1rem',
                    padding: '3rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: isDragging ? '#F0F9FF' : '#fafafa',
                    transition: 'all 0.2s'
                }}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                />
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>☁️</div>
                <p style={{ margin: 0, fontSize: '1.125rem', color: '#333', fontWeight: 500 }}>
                    點擊或拖拉照片至此
                </p>
                <p style={{ margin: '0.5rem 0 0', color: '#666', fontSize: '0.875rem' }}>
                    支援多張照片同時上傳
                </p>
            </div>

            {/* File List Preview */}
            {files.length > 0 && (
                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontWeight: 600, color: '#333' }}>已選擇 {files.length} 張照片</span>
                        <button
                            onClick={() => setFiles([])}
                            style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem' }}
                        >
                            全部清除
                        </button>
                    </div>
                    <div style={{ maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {files.map((file, index) => (
                            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #eee' }}>
                                <span style={{ fontSize: '0.875rem', color: '#666', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '80%' }}>
                                    {file.name}
                                </span>
                                <button
                                    onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                                    style={{ color: '#999', background: 'none', border: 'none', cursor: 'pointer' }}
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={handleUpload}
                        disabled={isUploading}
                        style={{
                            width: '100%',
                            marginTop: '1rem',
                            background: isUploading ? '#ccc' : '#4A90C8',
                            color: 'white',
                            padding: '0.75rem',
                            borderRadius: '0.5rem',
                            border: 'none',
                            fontWeight: 600,
                            cursor: isUploading ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        {isUploading ? (
                            <>
                                <span>⏳</span>
                                <span>上傳中... ({progress.current}/{progress.total})</span>
                            </>
                        ) : (
                            <>
                                <span>🚀</span>
                                <span>開始上傳</span>
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    )
}
