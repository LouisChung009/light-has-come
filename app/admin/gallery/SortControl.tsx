'use client'

import { useRouter, useSearchParams } from 'next/navigation'

export default function SortControl() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const currentSort = searchParams.get('sort') || 'date_desc'

    function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const newSort = e.target.value
        const params = new URLSearchParams(searchParams.toString())
        params.set('sort', newSort)
        router.push(`?${params.toString()}`)
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <label htmlFor="sort-select" style={{ fontSize: '0.875rem', color: '#666' }}>排序:</label>
            <select
                id="sort-select"
                value={currentSort}
                onChange={handleChange}
                style={{
                    padding: '0.5rem',
                    borderRadius: '0.375rem',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.875rem',
                    background: 'white',
                    cursor: 'pointer'
                }}
            >
                <option value="date_desc">日期 (新到舊)</option>
                <option value="date_asc">日期 (舊到新)</option>
                <option value="title_asc">名稱 (A-Z)</option>
                <option value="title_desc">名稱 (Z-A)</option>
            </select>
        </div>
    )
}
