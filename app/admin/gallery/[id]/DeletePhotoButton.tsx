'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DeletePhotoButton({ id, src }: { id: string, src: string }) {
    const [isDeleting, setIsDeleting] = useState(false)
    const router = useRouter()

    const handleDelete = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!confirm('確定要刪除這張照片嗎？')) return
        setIsDeleting(true)
        try {
            const res = await fetch('/api/photos/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, src }),
            })
            if (!res.ok) {
                const data = await res.json().catch(() => ({}))
                throw new Error(data.error || '刪除失敗')
            }
            router.refresh()
        } catch (error) {
            alert(error instanceof Error ? error.message : '刪除失敗，請稍後再試')
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <form onSubmit={handleDelete}>
            <button
                type="submit"
                disabled={isDeleting}
                style={{
                    color: '#ef4444',
                    background: 'none',
                    border: 'none',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    padding: '0.25rem'
                }}
            >
                {isDeleting ? '刪除中…' : '刪除'}
            </button>
        </form>
    )
}
