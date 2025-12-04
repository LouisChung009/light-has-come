import { getCategories } from './actions'
import CategoryManager from './CategoryManager'
import Link from 'next/link'

export default async function CategoriesPage() {
    const categories = await getCategories()

    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ marginBottom: '2rem' }}>
                <Link href="/admin" style={{ color: '#666', textDecoration: 'none', marginBottom: '1rem', display: 'inline-block' }}>
                    ← 返回後台首頁
                </Link>
                <h1 style={{ fontSize: '1.75rem', color: '#333', margin: 0 }}>分類管理</h1>
            </div>

            <CategoryManager initialCategories={categories} />
        </div>
    )
}
