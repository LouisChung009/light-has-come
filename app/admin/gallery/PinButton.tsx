'use client'

import { useState } from 'react'
import { togglePin } from './actions'

export default function PinButton({ id, isPinned }: { id: string, isPinned: boolean }) {
    const [isLoading, setIsLoading] = useState(false)

    async function handleClick(e: React.MouseEvent) {
        e.preventDefault() // Prevent link navigation
        setIsLoading(true)
        try {
            await togglePin(id, isPinned)
        } catch (error) {
            console.error('Failed to toggle pin:', error)
            alert('操作失敗')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <button
            onClick={handleClick}
            disabled={isLoading}
            title={isPinned ? "取消置頂" : "置頂相簿"}
            style={{
                background: isPinned ? '#FFD93D' : 'rgba(255, 255, 255, 0.8)',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '1.2rem',
                transition: 'all 0.2s',
                opacity: isLoading ? 0.5 : 1,
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
        >
            {isPinned ? '📌' : '📍'}
        </button>
    )
}
