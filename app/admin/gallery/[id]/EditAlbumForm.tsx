'use client'

import { useState } from 'react'
import { updateAlbum } from '../actions'

type Album = {
    id: string
    title: string
    date: string
    category: string
    description: string | null
}

type Category = {
    id: string
    label: string
    value: string
}

export default function EditAlbumForm({ album, categories }: { album: Album, categories: Category[] }) {
    const [isEditing, setIsEditing] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    if (!isEditing) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <h1 style={{ fontSize: '1.75rem', color: '#333', margin: 0 }}>
                    {album.title}
                </h1>
                <button
                    onClick={() => setIsEditing(true)}
                    style={{
                        padding: '0.25rem 0.75rem',
                        fontSize: '0.875rem',
                        color: '#4A90C8',
                        background: 'none',
                        border: '1px solid #4A90C8',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    編輯
                </button>
            </div>
        )
    }

    async function handleSubmit(formData: FormData) {
        setIsLoading(true)
        try {
            await updateAlbum(album.id, formData)
            setIsEditing(false)
        } catch (error) {
            alert('更新失敗')
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form action={handleSubmit} style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'grid', gap: '1rem', maxWidth: '500px' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                        相簿名稱
                    </label>
                    <input
                        name="title"
                        defaultValue={album.title}
                        required
                        style={{
                            width: '100%',
                            padding: '0.5rem',
                            borderRadius: '0.25rem',
                            border: '1px solid #cbd5e1'
                        }}
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                            日期
                        </label>
                        <input
                            type="date"
                            name="date"
                            defaultValue={album.date}
                            required
                            style={{
                                width: '100%',
                                padding: '0.5rem',
                                borderRadius: '0.25rem',
                                border: '1px solid #cbd5e1'
                            }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                            分類
                        </label>
                        <select
                            name="category"
                            defaultValue={album.category}
                            required
                            style={{
                                width: '100%',
                                padding: '0.5rem',
                                borderRadius: '0.25rem',
                                border: '1px solid #cbd5e1'
                            }}
                        >
                            {categories.map(category => (
                                <option key={category.id} value={category.value}>
                                    {category.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                        描述 (選填)
                    </label>
                    <textarea
                        name="description"
                        defaultValue={album.description || ''}
                        rows={3}
                        style={{
                            width: '100%',
                            padding: '0.5rem',
                            borderRadius: '0.25rem',
                            border: '1px solid #cbd5e1'
                        }}
                    />
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <button
                        type="submit"
                        disabled={isLoading}
                        style={{
                            padding: '0.5rem 1rem',
                            background: '#4A90C8',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.25rem',
                            cursor: 'pointer',
                            opacity: isLoading ? 0.7 : 1
                        }}
                    >
                        {isLoading ? '儲存中...' : '儲存變更'}
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        disabled={isLoading}
                        style={{
                            padding: '0.5rem 1rem',
                            background: 'white',
                            color: '#64748b',
                            border: '1px solid #cbd5e1',
                            borderRadius: '0.25rem',
                            cursor: 'pointer'
                        }}
                    >
                        取消
                    </button>
                </div>
            </div>
        </form>
    )
}
