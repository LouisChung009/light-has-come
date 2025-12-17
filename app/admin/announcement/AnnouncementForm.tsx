'use client'

import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import PosterUploader from './PosterUploader'

type AnnouncementConfig = {
    enabled: boolean
    imageUrl: string
    ctaEnabled?: boolean
    ctaLabel?: string
    ctaHref?: string
    storageKey?: string
}

export default function AnnouncementForm({ initialConfig }: { initialConfig: AnnouncementConfig }) {
    const [imageUrl, setImageUrl] = useState(initialConfig.imageUrl || '')
    const [enabled, setEnabled] = useState(initialConfig.enabled)
    const [ctaEnabled, setCtaEnabled] = useState(initialConfig.ctaEnabled ?? true)
    const [ctaLabel, setCtaLabel] = useState(initialConfig.ctaLabel || '立即報名')
    const [ctaHref, setCtaHref] = useState(initialConfig.ctaHref || '')
    const [storageKey, setStorageKey] = useState(initialConfig.storageKey || 'home-announcement')
    const [isPending, startTransition] = useTransition()
    const [errorMsg, setErrorMsg] = useState('')
    const router = useRouter()

    // 當重新勾選「顯示按鈕」且未填網址時，自動填入預設路徑
    useEffect(() => {
        if (ctaEnabled && !ctaHref) {
            setCtaHref('/register')
        }
    }, [ctaEnabled, ctaHref])

    return (
        <form action={(formData) => {
            setErrorMsg('')
            startTransition(async () => {
                const res = await fetch('/api/announcement', {
                    method: 'POST',
                    body: formData
                })
                const data = await res.json()
                if (!res.ok || data.error) {
                    setErrorMsg(data.error || '儲存失敗')
                    return
                }
                router.refresh()
            })
        }} style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '1rem',
            border: '1px solid #e5e7eb',
            boxShadow: '0 4px 10px rgba(0,0,0,0.04)',
            display: 'grid',
            gap: '1rem'
        }}>
            <input type="hidden" name="imageUrl" value={imageUrl} />

            <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontWeight: 600, color: '#111' }}>
                <input type="checkbox" name="enabled" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
                啟用彈出視窗
            </label>

            <div>
                <label style={{ display: 'block', fontWeight: 600, color: '#111', marginBottom: '0.35rem' }}>海報圖片</label>
                <PosterUploader defaultUrl={imageUrl} onUploaded={setImageUrl} />
                <p style={{ margin: '0.35rem 0 0', color: '#6b7280', fontSize: '0.9rem' }}>
                    可點擊或拖曳上傳，檔案會存到 Cloudflare R2，前台彈窗直接使用這張圖。
                </p>
                {!imageUrl && <p style={{ color: '#ef4444', fontWeight: 600, marginTop: '0.25rem' }}>請先上傳海報圖片</p>}
            </div>

            <div style={{ padding: '1rem', borderRadius: '0.75rem', border: '1px solid #e5e7eb', background: '#f8fafc', display: 'grid', gap: '0.75rem' }}>
                <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontWeight: 600, color: '#111' }}>
                    <input type="checkbox" name="ctaEnabled" checked={ctaEnabled} onChange={(e) => setCtaEnabled(e.target.checked)} />
                    顯示「立即報名」按鈕
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                        <label style={{ display: 'block', fontWeight: 600, color: '#111', marginBottom: '0.35rem' }}>按鈕文字</label>
                        <input
                            name="ctaLabel"
                            value={ctaLabel}
                            onChange={(e) => setCtaLabel(e.target.value)}
                            disabled={!ctaEnabled}
                            style={{ width: '100%', padding: '0.7rem', borderRadius: '0.6rem', border: '1px solid #e5e7eb', background: ctaEnabled ? 'white' : '#f5f5f5' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontWeight: 600, color: '#111', marginBottom: '0.35rem' }}>按鈕連結 (URL)</label>
                        <input
                            type="url"
                            name="ctaHref"
                            value={ctaHref}
                            onChange={(e) => setCtaHref(e.target.value)}
                            placeholder="/register"
                            disabled={!ctaEnabled}
                            style={{ width: '100%', padding: '0.7rem', borderRadius: '0.6rem', border: '1px solid #e5e7eb', background: ctaEnabled ? 'white' : '#f5f5f5' }}
                        />
                    </div>
                </div>
            </div>

            <div>
                <label style={{ display: 'block', fontWeight: 600, color: '#111', marginBottom: '0.35rem' }}>Storage Key（控制「今日不再顯示」）</label>
                <input
                    name="storageKey"
                    value={storageKey}
                    onChange={(e) => setStorageKey(e.target.value)}
                    style={{ width: '100%', padding: '0.7rem', borderRadius: '0.6rem', border: '1px solid #e5e7eb' }}
                />
                <p style={{ margin: '0.35rem 0 0', color: '#6b7280', fontSize: '0.9rem' }}>
                    更換這個值可讓所有訪客重新看到彈窗；「今日不再顯示」僅作用當天。
                </p>
            </div>

            <button
                type="submit"
                disabled={isPending}
                style={{
                    background: '#4A90C8',
                    color: 'white',
                    padding: '0.85rem 1.4rem',
                    borderRadius: '0.75rem',
                    border: 'none',
                    fontWeight: 700,
                    cursor: isPending ? 'not-allowed' : 'pointer',
                    boxShadow: '0 12px 20px rgba(74,144,200,0.25)',
                    width: 'fit-content'
                }}
            >
                {isPending ? '儲存中…' : '儲存設定'}
            </button>
            {errorMsg && <div style={{ color: '#ef4444', fontWeight: 700 }}>{errorMsg}</div>}
        </form>
    )
}
