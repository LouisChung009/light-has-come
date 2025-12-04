'use client'

import { createAlbum } from '../actions'
import { getCategories } from '../../categories/actions'
import Link from 'next/link'

export default async function NewAlbum() {
    const categories = await getCategories()

    return (
        <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem' }}>
                <Link href="/admin/gallery" style={{ color: '#666', textDecoration: 'none', marginBottom: '1rem', display: 'inline-block' }}>
                    ← 返回列表
                </Link>
                <h1 style={{ fontSize: '1.75rem', color: '#333', margin: 0 }}>新增相簿</h1>
            </div>

            <form action={createAlbum} style={{ background: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>活動標題</label>
                    <input
                        type="text"
                        name="title"
                        required
                        placeholder="例如：聖誕節慶祝活動"
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #ddd' }}
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>活動日期</label>
                        <input
                            type="date"
                            name="date"
                            required
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #ddd' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>分類</label>
                        <select
                            name="category"
                            required
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #ddd', background: 'white' }}
                        >
                            {categories.map(category => (
                                <option key={category.id} value={category.value}>
                                    {category.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>活動描述</label>
                    <textarea
                        name="description"
                        rows={4}
                        placeholder="請輸入活動的簡短描述..."
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #ddd' }}
                    />
                </div>

                <button
                    type="submit"
                    style={{
                        width: '100%',
                        padding: '1rem',
                        background: '#4A90C8',
                        color: 'white',
                        borderRadius: '0.5rem',
                        fontSize: '1rem',
                        fontWeight: 600,
                        border: 'none',
                        cursor: 'pointer'
                    }}
                >
                    建立相簿
                </button>
            </form>
        </div>
    )
}
