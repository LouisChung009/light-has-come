'use client'

import { updateContent, uploadContentImage } from './actions'
import { useState, useRef } from 'react'

interface ContentItem {
    id: string
    category: string
    label: string
    content: string
    content_type: string
}

export default function ContentEditor({ item }: { item: ContentItem }) {
    const [isEditing, setIsEditing] = useState(false)
    const [content, setContent] = useState(item.content)
    const [isSaving, setIsSaving] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleSave = async () => {
        setIsSaving(true)
        await updateContent(item.id, content)
        setIsSaving(false)
        setIsEditing(false)
    }

    const handleCancel = () => {
        setContent(item.content)
        setIsEditing(false)
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploading(true)
        const formData = new FormData()
        formData.append('file', file)
        formData.append('contentId', item.id)

        const result = await uploadContentImage(formData)

        if (result.url) {
            setContent(result.url)
        } else if (result.error) {
            alert(result.error)
        }
        setIsUploading(false)
    }

    const isImageType = item.content_type === 'image'

    return (
        <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '0.5rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            marginBottom: '1rem'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#333', margin: 0 }}>{item.label}</h3>
                    <p style={{ fontSize: '0.875rem', color: '#666', margin: '0.25rem 0 0' }}>ID: {item.id}</p>
                </div>
                {!isEditing && !isImageType && (
                    <button
                        onClick={() => setIsEditing(true)}
                        style={{
                            background: '#4A90C8',
                            color: 'white',
                            border: 'none',
                            padding: '0.5rem 1rem',
                            borderRadius: '0.375rem',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: 500
                        }}
                    >
                        編輯
                    </button>
                )}
            </div>

            {/* Image Upload UI */}
            {isImageType ? (
                <div>
                    {content ? (
                        <div style={{ marginBottom: '1rem' }}>
                            <img
                                src={content}
                                alt={item.label}
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '300px',
                                    borderRadius: '0.5rem',
                                    border: '1px solid #e2e8f0'
                                }}
                            />
                        </div>
                    ) : (
                        <div style={{
                            padding: '3rem',
                            background: '#f9fafb',
                            borderRadius: '0.5rem',
                            textAlign: 'center',
                            color: '#9ca3af',
                            marginBottom: '1rem',
                            border: '2px dashed #e5e7eb'
                        }}>
                            尚未上傳圖片
                        </div>
                    )}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept="image/*"
                        style={{ display: 'none' }}
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        style={{
                            background: isUploading ? '#ccc' : '#10b981',
                            color: 'white',
                            border: 'none',
                            padding: '0.75rem 1.5rem',
                            borderRadius: '0.375rem',
                            cursor: isUploading ? 'not-allowed' : 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: 600
                        }}
                    >
                        {isUploading ? '⏳ 上傳中...' : '📷 上傳圖片'}
                    </button>
                    {content && (
                        <button
                            onClick={async () => {
                                setContent('')
                                await updateContent(item.id, '')
                            }}
                            style={{
                                background: '#ef4444',
                                color: 'white',
                                border: 'none',
                                padding: '0.75rem 1.5rem',
                                borderRadius: '0.375rem',
                                cursor: 'pointer',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                marginLeft: '0.5rem'
                            }}
                        >
                            🗑️ 移除圖片
                        </button>
                    )}
                </div>
            ) : isEditing ? (
                <>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={item.content_type === 'text' ? 3 : 8}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '2px solid #e2e8f0',
                            borderRadius: '0.375rem',
                            fontSize: '1rem',
                            resize: 'vertical',
                            marginBottom: '1rem'
                        }}
                    />
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            style={{
                                background: isSaving ? '#ccc' : '#10b981',
                                color: 'white',
                                border: 'none',
                                padding: '0.5rem 1rem',
                                borderRadius: '0.375rem',
                                cursor: isSaving ? 'not-allowed' : 'pointer',
                                fontSize: '0.875rem',
                                fontWeight: 500
                            }}
                        >
                            {isSaving ? '儲存中...' : '儲存'}
                        </button>
                        <button
                            onClick={handleCancel}
                            disabled={isSaving}
                            style={{
                                background: '#e5e7eb',
                                color: '#374151',
                                border: 'none',
                                padding: '0.5rem 1rem',
                                borderRadius: '0.375rem',
                                cursor: isSaving ? 'not-allowed' : 'pointer',
                                fontSize: '0.875rem',
                                fontWeight: 500
                            }}
                        >
                            取消
                        </button>
                    </div>
                </>
            ) : (
                <div style={{
                    padding: '1rem',
                    background: '#f9fafb',
                    borderRadius: '0.375rem',
                    color: '#374151',
                    whiteSpace: 'pre-wrap',
                    lineHeight: 1.6
                }}>
                    {item.content || '(空白)'}
                </div>
            )}
        </div>
    )
}
