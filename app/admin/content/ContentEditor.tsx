'use client'

import { updateContent } from './actions'
import { useState } from 'react'

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
                {!isEditing && (
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

            {isEditing ? (
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
                    {item.content}
                </div>
            )}
        </div>
    )
}
