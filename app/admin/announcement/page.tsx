import { getAnnouncement, saveAnnouncement } from './actions'

export default async function AnnouncementAdmin() {
    const config = await getAnnouncement()

    return (
        <div style={{ padding: '2rem', maxWidth: '800px' }}>
            <h1 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', color: '#111' }}>首頁彈出視窗設定</h1>
            <p style={{ marginBottom: '1.25rem', color: '#4b5563' }}>
                可在此控制首頁進站公告的顯示/隱藏、文字內容，以及是否顯示「立即報名」按鈕。
            </p>

            <form action={saveAnnouncement} style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: '1rem',
                border: '1px solid #e5e7eb',
                boxShadow: '0 4px 10px rgba(0,0,0,0.04)',
                display: 'grid',
                gap: '1rem'
            }}>
                <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontWeight: 600, color: '#111' }}>
                    <input type="checkbox" name="enabled" defaultChecked={config.enabled} />
                    啟用彈出視窗
                </label>

                <div>
                    <label style={{ display: 'block', fontWeight: 600, color: '#111', marginBottom: '0.35rem' }}>標題</label>
                    <input
                        name="title"
                        defaultValue={config.title}
                        required
                        placeholder="例如：最新活動訊息"
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.6rem', border: '1px solid #e5e7eb' }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', fontWeight: 600, color: '#111', marginBottom: '0.35rem' }}>副標題 (選填)</label>
                    <input
                        name="subtitle"
                        defaultValue={config.subtitle}
                        placeholder="例如：公益親子活動巡迴"
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.6rem', border: '1px solid #e5e7eb' }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', fontWeight: 600, color: '#111', marginBottom: '0.35rem' }}>內容 (選填)</label>
                    <textarea
                        name="content"
                        rows={4}
                        defaultValue={config.content}
                        placeholder="可填日期、地點、其他說明"
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.6rem', border: '1px solid #e5e7eb' }}
                    />
                </div>

                <div style={{ padding: '1rem', borderRadius: '0.75rem', border: '1px solid #e5e7eb', background: '#f8fafc', display: 'grid', gap: '0.75rem' }}>
                    <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontWeight: 600, color: '#111' }}>
                        <input type="checkbox" name="ctaEnabled" defaultChecked={config.ctaEnabled} />
                        顯示「立即報名」按鈕
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        <div>
                            <label style={{ display: 'block', fontWeight: 600, color: '#111', marginBottom: '0.35rem' }}>按鈕文字</label>
                            <input
                                name="ctaLabel"
                                defaultValue={config.ctaLabel}
                                style={{ width: '100%', padding: '0.7rem', borderRadius: '0.6rem', border: '1px solid #e5e7eb' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontWeight: 600, color: '#111', marginBottom: '0.35rem' }}>按鈕連結</label>
                            <input
                                name="ctaHref"
                                defaultValue={config.ctaHref}
                                placeholder="/register"
                                style={{ width: '100%', padding: '0.7rem', borderRadius: '0.6rem', border: '1px solid #e5e7eb' }}
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label style={{ display: 'block', fontWeight: 600, color: '#111', marginBottom: '0.35rem' }}>Storage Key (控制每次進站是否再顯示)</label>
                    <input
                        name="storageKey"
                        defaultValue={config.storageKey}
                        style={{ width: '100%', padding: '0.7rem', borderRadius: '0.6rem', border: '1px solid #e5e7eb' }}
                    />
                    <p style={{ margin: '0.35rem 0 0', color: '#6b7280', fontSize: '0.9rem' }}>
                        更換此值可讓使用者重新看到公告（儲存於 sessionStorage）。
                    </p>
                </div>

                <button
                    type="submit"
                    style={{
                        background: '#4A90C8',
                        color: 'white',
                        padding: '0.85rem 1.4rem',
                        borderRadius: '0.75rem',
                        border: 'none',
                        fontWeight: 700,
                        cursor: 'pointer',
                        boxShadow: '0 12px 20px rgba(74,144,200,0.25)',
                        width: 'fit-content'
                    }}
                >
                    儲存設定
                </button>
            </form>
        </div>
    )
}
