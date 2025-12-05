'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type AnnouncementProps = {
    enabled?: boolean
    title?: string
    subtitle?: string
    content?: string
    ctaEnabled?: boolean
    ctaLabel?: string
    ctaHref?: string
    storageKey?: string
}

export default function HomeAnnouncementModal({
    enabled = true,
    title,
    subtitle,
    content,
    ctaEnabled = true,
    ctaLabel = '立即報名',
    ctaHref = '/register',
    storageKey = 'home-announcement-dismissed',
}: AnnouncementProps) {
    const [open, setOpen] = useState(false)

    useEffect(() => {
        const dismissed = typeof window !== 'undefined' ? sessionStorage.getItem(storageKey) : null
        if (!dismissed) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setOpen(true)
        }
    }, [storageKey])

    const handleClose = () => {
        setOpen(false)
        sessionStorage.setItem(storageKey, '1')
    }

    if (!enabled || !title) return null
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
                width: 'min(720px, 100%)',
                background: 'linear-gradient(135deg, #fffdf5, #fff6e5)',
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

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr',
                    gap: '1.25rem',
                    padding: '2rem',
                }}>
                    <div>
                        <p style={{
                            margin: 0,
                            color: '#ef4444',
                            fontWeight: 700,
                            letterSpacing: '0.05em',
                            fontSize: '0.95rem'
                        }}>
                            最新公告
                        </p>
                        <h2 style={{ margin: '0.25rem 0', fontSize: '2rem', color: '#1f2937', lineHeight: 1.2 }}>
                            {title}
                        </h2>
                        {subtitle && (
                            <p style={{ margin: '0.25rem 0', fontSize: '1.1rem', color: '#374151', fontWeight: 600 }}>
                                {subtitle}
                            </p>
                        )}
                        {content && (
                            <p style={{ marginTop: '0.75rem', color: '#4b5563', lineHeight: 1.6 }}>
                                {content}
                            </p>
                        )}
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        {ctaEnabled && (
                            <Link
                                href={ctaHref}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.4rem',
                                    background: 'linear-gradient(135deg, #f97316, #ef4444)',
                                    color: 'white',
                                    padding: '0.85rem 1.4rem',
                                    borderRadius: '0.75rem',
                                    textDecoration: 'none',
                                    fontWeight: 700,
                                    boxShadow: '0 12px 25px rgba(239,68,68,0.35)',
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
                                background: 'white',
                                border: '1px solid #e5e7eb',
                                color: '#374151',
                                padding: '0.85rem 1.2rem',
                                borderRadius: '0.75rem',
                                cursor: 'pointer',
                                fontWeight: 600,
                                boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                            }}
                        >
                            關閉
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
