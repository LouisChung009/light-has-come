'use client'

import { setAlbumCover } from '../actions'
import { useState } from 'react'

export default function SetCoverButton({ albumId, photoUrl, isCurrentCover }: { albumId: string, photoUrl: string, isCurrentCover: boolean }) {
    const [isLoading, setIsLoading] = useState(false)

    const handleSetCover = async () => {
        setIsLoading(true)
        await setAlbumCover(albumId, photoUrl)
        setIsLoading(false)
    }

    if (isCurrentCover) {
        return (
            <span style={{
                position: 'absolute',
                top: '0.5rem',
                left: '0.5rem',
                background: '#4A90C8',
                color: 'white',
                padding: '0.25rem 0.5rem',
                borderRadius: '0.25rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                zIndex: 10
            }}>
                封面
            </span>
        )
    }

    return (
        <button
            onClick={handleSetCover}
            disabled={isLoading}
            className="set-cover-btn"
            style={{
                position: 'absolute',
                top: '0.5rem',
                left: '0.5rem',
                background: 'rgba(0,0,0,0.6)',
                color: 'white',
                border: 'none',
                padding: '0.25rem 0.5rem',
                borderRadius: '0.25rem',
                fontSize: '0.75rem',
                cursor: 'pointer',
                zIndex: 10,
                opacity: 0,
                transition: 'opacity 0.2s'
            }}
        >
            {isLoading ? '設定中...' : '設為封面'}
        </button>
    )
}
