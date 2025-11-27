'use client'

import { deleteAlbum } from './actions'

export default function DeleteAlbumButton({ id }: { id: string }) {
    return (
        <form action={deleteAlbum.bind(null, id)} style={{ display: 'inline' }}>
            <button
                type="submit"
                style={{
                    padding: '0.5rem',
                    border: '1px solid #ef4444',
                    color: '#ef4444',
                    background: 'white',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                }}
                onClick={(e) => {
                    if (!confirm('確定要刪除這個相簿嗎？所有照片也會被刪除。')) {
                        e.preventDefault()
                    }
                }}
            >
                刪除
            </button>
        </form>
    )
}
