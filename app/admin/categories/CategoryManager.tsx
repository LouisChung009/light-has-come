'use client'

import { useState } from 'react'
import { createCategory, updateCategory, deleteCategory } from './actions'
import type { Category } from '@/utils/db'

export default function CategoryManager({ initialCategories }: { initialCategories: Category[] }) {
    const categories = initialCategories
    const [isCreating, setIsCreating] = useState(false)

    // Optimistic UI updates could be added here, but for now we rely on revalidation
    // actually, since we are using server actions with revalidatePath, 
    // we might not see updates immediately if we don't refresh local state or use router.refresh()
    // Let's use a simple form for creation.

    return (
        <div>
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#333' }}>現有分類</h2>
                <button
                    onClick={() => setIsCreating(true)}
                    style={{
                        background: '#4A90C8',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        borderRadius: '0.375rem',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.875rem'
                    }}
                >
                    + 新增分類
                </button>
            </div>

            {isCreating && (
                <form action={async (formData) => {
                    await createCategory(formData)
                    setIsCreating(false)
                    // In a real app we'd trigger a router refresh here
                    window.location.reload()
                }} style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '0.5rem', marginBottom: '2rem', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 100px', gap: '1rem', alignItems: 'end' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>顯示名稱 (Label)</label>
                            <input name="label" required placeholder="例如：特別活動" style={{ width: '100%', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #cbd5e1' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>代碼 (Value)</label>
                            <input name="value" required placeholder="例如：special" style={{ width: '100%', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #cbd5e1' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>排序</label>
                            <input name="sort_order" type="number" defaultValue={0} style={{ width: '100%', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #cbd5e1' }} />
                        </div>
                    </div>
                    <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button type="button" onClick={() => setIsCreating(false)} style={{ padding: '0.5rem 1rem', background: 'white', border: '1px solid #cbd5e1', borderRadius: '0.25rem', cursor: 'pointer' }}>取消</button>
                        <button type="submit" style={{ padding: '0.5rem 1rem', background: '#4A90C8', color: 'white', border: 'none', borderRadius: '0.25rem', cursor: 'pointer' }}>儲存</button>
                    </div>
                </form>
            )}

            <div style={{ background: 'white', borderRadius: '0.5rem', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.875rem', color: '#64748b' }}>名稱</th>
                            <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.875rem', color: '#64748b' }}>代碼</th>
                            <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.875rem', color: '#64748b' }}>排序</th>
                            <th style={{ padding: '0.75rem 1rem', textAlign: 'right', fontSize: '0.875rem', color: '#64748b' }}>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((category) => (
                            <CategoryRow key={category.id} category={category} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

function CategoryRow({ category }: { category: Category }) {
    const [isEditing, setIsEditing] = useState(false)

    if (isEditing) {
        return (
            <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td colSpan={4} style={{ padding: '0.5rem' }}>
                    <form action={async (formData) => {
                        await updateCategory(category.id, formData)
                        setIsEditing(false)
                        window.location.reload()
                    }} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <input name="label" defaultValue={category.label} style={{ padding: '0.25rem', border: '1px solid #cbd5e1', borderRadius: '0.25rem' }} />
                        <input name="value" defaultValue={category.value} style={{ padding: '0.25rem', border: '1px solid #cbd5e1', borderRadius: '0.25rem' }} />
                        <input name="sort_order" type="number" defaultValue={category.sort_order} style={{ width: '60px', padding: '0.25rem', border: '1px solid #cbd5e1', borderRadius: '0.25rem' }} />
                        <button type="submit" style={{ padding: '0.25rem 0.5rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '0.25rem', cursor: 'pointer', fontSize: '0.75rem' }}>儲存</button>
                        <button type="button" onClick={() => setIsEditing(false)} style={{ padding: '0.25rem 0.5rem', background: '#94a3b8', color: 'white', border: 'none', borderRadius: '0.25rem', cursor: 'pointer', fontSize: '0.75rem' }}>取消</button>
                    </form>
                </td>
            </tr>
        )
    }

    return (
        <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
            <td style={{ padding: '0.75rem 1rem', color: '#333' }}>{category.label}</td>
            <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace', color: '#666' }}>{category.value}</td>
            <td style={{ padding: '0.75rem 1rem', color: '#666' }}>{category.sort_order}</td>
            <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                <button onClick={() => setIsEditing(true)} style={{ marginRight: '0.5rem', color: '#4A90C8', background: 'none', border: 'none', cursor: 'pointer' }}>編輯</button>
                <button onClick={async () => {
                    if (confirm('確定要刪除此分類嗎？')) {
                        await deleteCategory(category.id)
                        window.location.reload()
                    }
                }} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>刪除</button>
            </td>
        </tr>
    )
}
