'use client'

import { useState } from 'react'

type HeroStyle = {
    titleColor: string
    subtitleColor: string
    titleSize: string
    subtitleSize: string
    textAlign: 'center' | 'left'
    ctaLabel: string
    ctaHref: string
    ctaBg: string
    ctaTextColor: string
}

export default function HeroStyleForm({ initial }: { initial: HeroStyle }) {
    const [form, setForm] = useState<HeroStyle>(initial)
    const [isSaving, setIsSaving] = useState(false)
    const [message, setMessage] = useState('')

    const handleChange = (key: keyof HeroStyle, value: string) => {
        setForm(prev => ({ ...prev, [key]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)
        setMessage('')

        try {
            const res = await fetch('/api/hero-style', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            })
            const data = await res.json()
            if (!res.ok || data.error) {
                throw new Error(data.error || '儲存失敗')
            }
            setMessage('已儲存並套用首頁主視覺樣式')
        } catch (error) {
            setMessage(error instanceof Error ? error.message : '儲存失敗，請稍後再試')
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '1rem' }}>
                <div>
                    <label style={{ fontWeight: 600, color: '#111', display: 'block', marginBottom: '0.35rem' }}>標題色</label>
                    <input
                        type="color"
                        value={form.titleColor}
                        onChange={(e) => handleChange('titleColor', e.target.value)}
                        style={{ width: '100%', height: '42px', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}
                    />
                </div>
                <div>
                    <label style={{ fontWeight: 600, color: '#111', display: 'block', marginBottom: '0.35rem' }}>副標色</label>
                    <input
                        type="color"
                        value={form.subtitleColor}
                        onChange={(e) => handleChange('subtitleColor', e.target.value)}
                        style={{ width: '100%', height: '42px', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}
                    />
                </div>
                <div>
                    <label style={{ fontWeight: 600, color: '#111', display: 'block', marginBottom: '0.35rem' }}>按鈕底色</label>
                    <input
                        type="color"
                        value={form.ctaBg}
                        onChange={(e) => handleChange('ctaBg', e.target.value)}
                        style={{ width: '100%', height: '42px', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}
                    />
                </div>
                <div>
                    <label style={{ fontWeight: 600, color: '#111', display: 'block', marginBottom: '0.35rem' }}>按鈕文字色</label>
                    <input
                        type="color"
                        value={form.ctaTextColor}
                        onChange={(e) => handleChange('ctaTextColor', e.target.value)}
                        style={{ width: '100%', height: '42px', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}
                    />
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '1rem' }}>
                <div>
                    <label style={{ fontWeight: 600, color: '#111', display: 'block', marginBottom: '0.35rem' }}>標題字級</label>
                    <input
                        type="text"
                        value={form.titleSize}
                        onChange={(e) => handleChange('titleSize', e.target.value)}
                        placeholder="例如：clamp(2.6rem, 6vw, 4.4rem)"
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.6rem', border: '1px solid #e5e7eb' }}
                    />
                </div>
                <div>
                    <label style={{ fontWeight: 600, color: '#111', display: 'block', marginBottom: '0.35rem' }}>副標字級</label>
                    <input
                        type="text"
                        value={form.subtitleSize}
                        onChange={(e) => handleChange('subtitleSize', e.target.value)}
                        placeholder="例如：clamp(1.125rem, 3vw, 1.55rem)"
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.6rem', border: '1px solid #e5e7eb' }}
                    />
                </div>
                <div>
                    <label style={{ fontWeight: 600, color: '#111', display: 'block', marginBottom: '0.35rem' }}>對齊方式</label>
                    <select
                        value={form.textAlign}
                        onChange={(e) => handleChange('textAlign', e.target.value)}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.6rem', border: '1px solid #e5e7eb', background: 'white' }}
                    >
                        <option value="center">置中</option>
                        <option value="left">置左</option>
                    </select>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '1rem' }}>
                <div>
                    <label style={{ fontWeight: 600, color: '#111', display: 'block', marginBottom: '0.35rem' }}>按鈕文字</label>
                    <input
                        type="text"
                        value={form.ctaLabel}
                        onChange={(e) => handleChange('ctaLabel', e.target.value)}
                        placeholder="例如：立即預約體驗"
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.6rem', border: '1px solid #e5e7eb' }}
                    />
                </div>
                <div>
                    <label style={{ fontWeight: 600, color: '#111', display: 'block', marginBottom: '0.35rem' }}>按鈕連結</label>
                    <input
                        type="url"
                        value={form.ctaHref}
                        onChange={(e) => handleChange('ctaHref', e.target.value)}
                        placeholder="/register"
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.6rem', border: '1px solid #e5e7eb' }}
                    />
                </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <button
                    type="submit"
                    disabled={isSaving}
                    style={{
                        background: isSaving ? '#ccc' : '#4A90C8',
                        color: 'white',
                        padding: '0.85rem 1.4rem',
                        borderRadius: '0.75rem',
                        border: 'none',
                        fontWeight: 700,
                        cursor: isSaving ? 'not-allowed' : 'pointer',
                        boxShadow: '0 12px 20px rgba(74,144,200,0.25)'
                    }}
                >
                    {isSaving ? '儲存中…' : '儲存樣式'}
                </button>
                {message && <span style={{ color: '#16a34a', fontWeight: 600 }}>{message}</span>}
            </div>
        </form>
    )
}
