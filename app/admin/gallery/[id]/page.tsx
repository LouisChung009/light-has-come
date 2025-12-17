import { getDb, Album, Photo } from '@/utils/db'
import Link from 'next/link'
import UploadPhotoForm from './UploadPhotoForm'
import DeletePhotoButton from './DeletePhotoButton'
import SetCoverButton from './SetCoverButton'
import EditAlbumForm from './EditAlbumForm'

import { getCategories } from '../../categories/actions'

export default async function AlbumDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const sql = getDb()
    const categories = await getCategories()

    const albums = await sql`SELECT * FROM albums WHERE id = ${id} LIMIT 1`
    const album = albums[0] as Album | undefined

    const photos = await sql`SELECT * FROM photos WHERE album_id = ${id} ORDER BY created_at DESC` as Photo[]

    if (!album) {
        return <div>Album not found</div>
    }


    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Link href="/admin/gallery" style={{ textDecoration: 'none', color: '#666' }}>
                    ← 返回列表
                </Link>
                <EditAlbumForm album={album} categories={categories} />
                <span style={{ background: '#f1f5f9', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.875rem' }}>
                    {photos?.length || 0} 張照片
                </span>
            </div>

            <div style={{ background: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>上傳照片</h2>
                <UploadPhotoForm albumId={id} />
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '1.5rem'
            }}>
                {photos?.map((photo) => (
                    <div key={photo.id} style={{
                        position: 'relative',
                        aspectRatio: '1',
                        borderRadius: '0.5rem',
                        overflow: 'hidden',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    }}
                        className="group"
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={photo.src}
                            alt={photo.alt || ''}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                            }}
                        />

                        <SetCoverButton
                            albumId={id}
                            photoUrl={photo.src}
                            isCurrentCover={album.cover_photo_url === photo.src}
                        />

                        <div style={{
                            position: 'absolute',
                            top: '0.5rem',
                            right: '0.5rem',
                            zIndex: 10
                        }}>
                            <DeletePhotoButton id={photo.id} src={photo.src} />
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
                .group:hover .set-cover-btn {
                    opacity: 1 !important;
                }
            `}</style>
        </div>
    )
}
