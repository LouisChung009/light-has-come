import { getDb, SiteContent } from '@/utils/db'
import { redirect } from 'next/navigation'
import ContentEditor from './ContentEditor'
import Link from 'next/link'

export default async function ContentManagement() {
    // Auth check is handled by middleware

    // Fetch content from Neon
    const sql = getDb()
    const contents = await sql`
        SELECT * FROM site_content
        ORDER BY category ASC, section ASC, display_order ASC
    ` as SiteContent[]

    // Group by category and section
    const groupedContents: Record<string, SiteContent[]> = (contents ?? []).reduce((acc, item) => {
        const key = `${item.category}::${item.section || 'general'}`
        if (!acc[key]) {
            acc[key] = []
        }
        acc[key].push(item)
        return acc
    }, {} as Record<string, SiteContent[]>)

    const categoryNames: Record<string, string> = {
        home: '首頁',
        courses: '課程介紹',
        about: '關於我們',
        contact: '聯絡資訊',
        announcement: '公告'
    }

    const sectionNames: Record<string, string> = {
        hero: 'Hero 區塊',
        values: '價值主張',
        courses: '課程預覽',
        intro: '介紹',
        toddler: '寶貝班',
        samuel: '撒母耳班',
        daniel: '但以理班',
        joshua: '約書亞班',
        vision: '願景',
        mission: '使命',
        team: '師資團隊',
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

            {Object.entries(groupedContents).map(([key, items]: [string, SiteContent[]]) => {
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
