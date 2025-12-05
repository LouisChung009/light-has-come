/* eslint-disable react-hooks/set-state-in-effect */
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type AnnouncementProps = {
    enabled?: boolean
    imageUrl?: string
    ctaEnabled?: boolean
    ctaLabel?: string
    ctaHref?: string
    storageKey?: string
}

export default function HomeAnnouncementModal({
    enabled = true,
    imageUrl,
    ctaEnabled = true,
    ctaLabel = '立即報名',
    ctaHref = '/register',
    storageKey = 'home-announcement-dismissed',
}: AnnouncementProps) {
    const [open, setOpen] = useState(false)
    const [dontShowToday, setDontShowToday] = useState(false)

    const todayKey = typeof window !== 'undefined' ? new Date().toISOString().slice(0, 10) : ''

    useEffect(() => {
        if (typeof window === 'undefined') return
        const suppressed = localStorage.getItem(storageKey)
        if (suppressed === todayKey) {
            setOpen(false)
            return
        }
        if (!suppressed) {
            setOpen(true)
            return
        }
        setOpen(true)
    }, [storageKey, todayKey])

    const handleClose = () => {
        if (typeof window !== 'undefined') {
            if (dontShowToday) {
                localStorage.setItem(storageKey, todayKey)
            } else {
                localStorage.removeItem(storageKey)
            }
        }
        setOpen(false)
    }

    if (!enabled || !imageUrl) return null
    if (!open) return null

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            zIndex: 2000,
        }}>
            <div style={{
                position: 'relative',
                width: 'min(760px, 100%)',
                background: '#111',
                borderRadius: '1.25rem',
                boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
                overflow: 'hidden',
                border: '1px solid rgba(0,0,0,0.05)',
            }}>
                <button
                    onClick={handleClose}
                    aria-label="關閉公告"
                    style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        background: 'rgba(0,0,0,0.65)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '9999px',
                        width: '32px',
                        height: '32px',
                        cursor: 'pointer',
                        fontWeight: 700,
                        fontSize: '16px',
                        lineHeight: '32px',
                        textAlign: 'center',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                    }}
                >
                    ×
                </button>

                <div style={{ position: 'relative', background: '#fefefe' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={imageUrl}
                        alt="最新公告"
                        style={{ display: 'block', width: '100%', height: 'auto' }}
                    />

                    <div style={{
                        position: 'absolute',
                        bottom: '16px',
                        left: '16px',
                        right: '16px',
                        display: 'flex',
                        gap: '0.75rem',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {ctaEnabled && (
                                <Link
                                    href={ctaHref}
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.35rem',
                                        background: 'linear-gradient(135deg, #f97316, #ef4444)',
                                        color: 'white',
                                        padding: '0.75rem 1.35rem',
                                        borderRadius: '9999px',
                                        textDecoration: 'none',
                                        fontWeight: 800,
                                        letterSpacing: '0.02em',
                                        boxShadow: '0 10px 18px rgba(239,68,68,0.35)',
                                    }}
                                    onClick={handleClose}
                                >
                                    {ctaLabel}
                                    <span style={{ fontSize: '1.1rem' }}>→</span>
                                </Link>
                            )}
                            <button
                                onClick={handleClose}
                                style={{
                                    background: 'rgba(0,0,0,0.65)',
                                    color: 'white',
                                    padding: '0.75rem 1.1rem',
                                    borderRadius: '9999px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontWeight: 700,
                                    boxShadow: '0 6px 12px rgba(0,0,0,0.25)',
                                }}
                            >
                                關閉
                            </button>
                        </div>

                        <label style={{
                            display: 'inline-flex',
                            gap: '0.45rem',
                            alignItems: 'center',
                            background: 'rgba(0,0,0,0.55)',
                            color: 'white',
                            padding: '0.55rem 0.9rem',
                            borderRadius: '0.75rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            userSelect: 'none'
                        }}>
                            <input
                                type="checkbox"
                                checked={dontShowToday}
                                onChange={(e) => setDontShowToday(e.target.checked)}
                                style={{ width: '18px', height: '18px' }}
                            />
                            今日不再顯示
                        </label>
                    </div>
                </div>
            </div>
        </div>
    )
}
