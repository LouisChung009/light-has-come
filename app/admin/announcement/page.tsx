import { getAnnouncement } from './actions'
import AnnouncementForm from './AnnouncementForm'

export default async function AnnouncementAdmin() {
    const config = await getAnnouncement()

    return (
        <div style={{ padding: '2rem', maxWidth: '800px' }}>
            <h1 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', color: '#111' }}>首頁彈出視窗設定</h1>
            <p style={{ marginBottom: '1.25rem', color: '#4b5563' }}>
                可在此控制首頁進站公告的顯示/隱藏、文字內容，以及是否顯示「立即報名」按鈕。
            </p>

            <AnnouncementForm initialConfig={config} />
        </div>
    )
}
