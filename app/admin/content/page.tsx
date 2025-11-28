import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import ContentEditor from './ContentEditor'
import Link from 'next/link'

export default async function ContentManagement() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/admin')
    }

    type ContentItem = {
        id: string
        category: string
        section: string | null
        label: string
        content: string
        content_type: string
    }

    const { data: contents } = await supabase
        .from('site_content')
        .select('*')
        .order('category', { ascending: true })
        .order('section', { ascending: true })
        .order('display_order', { ascending: true })
        .returns<ContentItem[]>()

    // Group by category and section
    const groupedContents: Record<string, ContentItem[]> = (contents ?? []).reduce((acc, item) => {
        const key = `${item.category}::${item.section || 'general'}`
        if (!acc[key]) {
            acc[key] = []
        }
        acc[key].push(item)
        return acc
    }, {} as Record<string, ContentItem[]>)

    const categoryNames: Record<string, string> = {
        home: '首頁',
        courses: '課程介紹',
        about: '關於我們',
        contact: '聯絡資訊'
    }

    const sectionNames: Record<string, string> = {
        hero: 'Hero 區塊',
        values: '價值主張',
        courses: '課程預覽',
        intro: '介紹',
        toddler: '幼幼班',
        samuel: '撒母耳班',
        joshua: '約書亞班',
        vision: '願景',
        mission: '使命',
        info: '基本資訊',
        general: '一般'
    }

    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.75rem', color: '#333', margin: 0 }}>
                    網站文案管理
                </h1>
                <Link
                    href="/admin/banner"
                    style={{
                        background: '#10b981',
                        color: 'white',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '0.5rem',
                        textDecoration: 'none',
                        fontWeight: 600
                    }}
                >
                    🎬 Banner 輪播管理
                </Link>
            </div>

            {Object.entries(groupedContents).map(([key, items]) => {
                const [category, section] = key.split('::')
                return (
                    <div key={key} style={{ marginBottom: '3rem' }}>
                        <h2 style={{
                            fontSize: '1.5rem',
                            fontWeight: 600,
                            color: '#1f2937',
                            marginBottom: '0.5rem'
                        }}>
                            {categoryNames[category] || category}
                            {section !== 'general' && (
                                <span style={{ fontSize: '1.125rem', color: '#6b7280', marginLeft: '0.5rem' }}>
                                    / {sectionNames[section] || section}
                                </span>
                            )}
                        </h2>
                        <div style={{ borderBottom: '2px solid #e5e7eb', marginBottom: '1.5rem' }} />
                        {items.map((item) => (
                            <ContentEditor key={item.id} item={item} />
                        ))}
                    </div>
                )
            })}
        </div>
    )
}
