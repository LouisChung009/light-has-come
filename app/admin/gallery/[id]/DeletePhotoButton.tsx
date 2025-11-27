'use client'

import { deletePhoto } from '../actions'

export default function DeletePhotoButton({ id, src }: { id: string, src: string }) {
    return (
        <form action={async () => { await deletePhoto(id, src) }}>
            <button
                type="submit"
                style={{
                    color: '#ef4444',
                    background: 'none',
                    border: 'none',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    padding: '0.25rem'
                }}
                onClick={(e) => {
                    if (!confirm('確定要刪除這張照片嗎？')) {
                        e.preventDefault()
                    }
                }}
            >
                刪除
            </button>
        </form>
    )
}
