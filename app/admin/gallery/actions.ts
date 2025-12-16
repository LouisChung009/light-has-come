'use server'

import { getDb } from '@/utils/db'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import JSZip from 'jszip'
import { deleteFromExternalStorage, extractExternalKeyFromUrl, isExternalStorageEnabled, uploadToExternalStorage } from '@/utils/storage/external'

type AlbumMeta = {
    id?: string
    title: string
    date: string
    category: string
    description?: string
    cover_color?: string
}

export type BulkImportResult = {
    success: boolean
    message: string
    createdAlbums: number
    createdPhotos: number
    skippedFiles: number
    details: string[]
    errors: string[]
}

type ManifestAlbum = {
    folder: string
    id?: string
    title?: string
    date?: string
    category?: string
    description?: string
    cover_color?: string
}

const COVER_COLORS = [
    'linear-gradient(135deg, #FFD93D, #FFAAA5)',
    'linear-gradient(135deg, #4A90C8, #B4E7CE)',
    'linear-gradient(135deg, #2E5C8A, #4A90C8)',
    'linear-gradient(135deg, #B4E7CE, #FFD93D)',
    'linear-gradient(135deg, #FFAAA5, #FFD93D)',
    'linear-gradient(135deg, #B4E7CE, #4A90C8)',
]

const CATEGORY_ALIASES: Record<string, AlbumMeta['category']> = {
    craft: 'craft',
    手作: 'craft',
    music: 'music',
    音樂: 'music',
    worship: 'music',
    science: 'science',
    科學: 'science',
    outdoor: 'outdoor',
    戶外: 'outdoor',
    special: 'special',
    活動: 'special',
    其他: 'special',
}

const ALLOWED_IMAGE_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp', 'gif', 'heic', 'heif'])

export async function createAlbum(formData: FormData) {
    const sql = getDb()

    const title = formData.get('title') as string
    const date = formData.get('date') as string
    const category = formData.get('category') as string
    const description = formData.get('description') as string

    // Generate a simple ID from date and random string to avoid collision
    const id = `${date}-${Math.random().toString(36).substring(2, 7)}`

    try {
        await sql`INSERT INTO albums (id, title, date, category, description, cover_color)
                  VALUES (${id}, ${title}, ${date}, ${category}, ${description}, 'linear-gradient(135deg, #FFD93D, #FFAAA5)')`
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to create album')
    }

    revalidatePath('/admin/gallery')
    redirect('/admin/gallery')
}

export async function deleteAlbum(id: string): Promise<void> {
    const sql = getDb()

    try {
        await sql`DELETE FROM albums WHERE id = ${id}`
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to delete album')
    }

    revalidatePath('/admin/gallery')
    revalidatePath('/gallery')
    revalidatePath(`/gallery/${id}`)
}

export async function updateAlbum(id: string, formData: FormData) {
    const sql = getDb()

    const title = formData.get('title') as string
    const date = formData.get('date') as string
    const category = formData.get('category') as string
    const description = formData.get('description') as string

    try {
        await sql`UPDATE albums SET title = ${title}, date = ${date}, category = ${category}, description = ${description} WHERE id = ${id}`
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to update album')
    }

    revalidatePath(`/admin/gallery/${id}`)
    revalidatePath('/admin/gallery')
    revalidatePath('/gallery')
}

export async function togglePin(id: string, isPinned: boolean) {
    const sql = getDb()

    try {
        await sql`UPDATE albums SET is_pinned = ${!isPinned} WHERE id = ${id}`
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to toggle pin')
    }

    revalidatePath('/admin/gallery')

    revalidatePath('/gallery')
    revalidatePath(`/gallery/${id}`)
}

export async function uploadPhoto(formData: FormData) {
    const sql = getDb()

    const albumId = formData.get('albumId') as string
    const file = formData.get('file') as File

    if (!file) {
        return { error: 'No file uploaded' }
    }

    // 1. Upload file to Storage (external R2)
    const fileExt = (file.name.split('.').pop() || 'jpg').toLowerCase()
    const fileName = `${albumId}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

    let publicUrl: string

    if (isExternalStorageEnabled()) {
        const buffer = Buffer.from(await file.arrayBuffer())
        publicUrl = await uploadToExternalStorage(
            fileName,
            buffer,
            file.type || guessContentType(fileExt)
        )
    } else {
        return { error: 'External storage not configured' }
    }

    // 2. Insert into photos table
    try {
        await sql`INSERT INTO photos (album_id, src, alt, width, height)
                  VALUES (${albumId}, ${publicUrl}, ${file.name}, 800, 600)`
    } catch (error) {
        return { error: error instanceof Error ? error.message : 'Failed to save photo' }
    }

    revalidatePath(`/admin/gallery/${albumId}`)
}

export async function deletePhoto(id: string, src: string) {
    const sql = getDb()

    // 1. Delete from External Storage (R2)
    const externalKey = extractExternalKeyFromUrl(src)
    if (externalKey) {
        try {
            await deleteFromExternalStorage(externalKey)
        } catch (err) {
            console.error('External storage delete failed', err)
        }
    }

    // 2. Delete from Database
    try {
        await sql`DELETE FROM photos WHERE id = ${id}`
    } catch (error) {
        return { error: error instanceof Error ? error.message : 'Failed to delete photo' }
    }
}

export async function setAlbumCover(albumId: string, photoUrl: string) {
    const sql = getDb()

    try {
        await sql`UPDATE albums SET cover_photo_url = ${photoUrl} WHERE id = ${albumId}`
    } catch (error) {
        return { error: error instanceof Error ? error.message : 'Failed to set cover' }
    }

    revalidatePath(`/admin/gallery/${albumId}`)
    revalidatePath('/admin/gallery')
    revalidatePath('/gallery')
}

export async function bulkImportAlbums(formData: FormData): Promise<BulkImportResult> {
    const zipFile = formData.get('zipFile') as File | null
    if (!zipFile) {
        return {
            success: false,
            message: '請選擇 ZIP 檔案',
            createdAlbums: 0,
            createdPhotos: 0,
            skippedFiles: 0,
            details: [],
            errors: ['沒有收到任何檔案']
        }
    }

    const sql = getDb()
    const errors: string[] = []
    const details: string[] = []

    let zip: JSZip
    try {
        const buffer = Buffer.from(await zipFile.arrayBuffer())
        zip = await JSZip.loadAsync(buffer)
    } catch (error) {
        return {
            success: false,
            message: '解析 ZIP 檔案失敗，請確認檔案是否損毀或重新匯出',
            createdAlbums: 0,
            createdPhotos: 0,
            skippedFiles: 0,
            details: [],
            errors: [error instanceof Error ? error.message : '無法解析 ZIP']
        }
    }

    const manifest = await readManifest(zip)
    const albumEntries = collectAlbumEntries(zip)

    if (albumEntries.length === 0) {
        return {
            success: false,
            message: 'ZIP 裡沒有找到任何相片，請確認有資料夾與圖片檔案',
            createdAlbums: 0,
            createdPhotos: 0,
            skippedFiles: 0,
            details: [],
            errors: ['未找到任何圖片']
        }
    }

    let createdAlbums = 0
    let createdPhotos = 0
    let skippedFiles = 0

    for (const entry of albumEntries) {
        const meta = buildAlbumMeta(entry.albumKey, manifest)
        const albumId = meta.id || createAlbumId(meta)

        // 先確認相簿是否已存在
        const existingAlbums = await sql`SELECT id, cover_photo_url FROM albums WHERE id = ${albumId} LIMIT 1`
        const existingAlbum = existingAlbums[0] as { id: string, cover_photo_url: string | null } | undefined

        if (!existingAlbum) {
            try {
                const coverColor = meta.cover_color || pickCoverColor(albumId)
                await sql`INSERT INTO albums (id, title, date, category, description, cover_color)
                          VALUES (${albumId}, ${meta.title}, ${meta.date}, ${meta.category}, ${meta.description || null}, ${coverColor})`
                createdAlbums++
                details.push(`✅ 已建立相簿「${meta.title}」`)
            } catch (insertError) {
                errors.push(`相簿 ${meta.title} 建立失敗: ${insertError instanceof Error ? insertError.message : 'Unknown error'}`)
                continue
            }
        } else {
            details.push(`ℹ️ 相簿「${meta.title}」已存在，追加照片中`)
        }

        let firstPhotoUrl: string | null = existingAlbum?.cover_photo_url || null

        for (const file of entry.files) {
            const extension = getFileExtension(file.fileName)

            if (!extension || !ALLOWED_IMAGE_EXTENSIONS.has(extension)) {
                skippedFiles++
                details.push(`跳過 ${file.fileName}（不支援的格式）`)
                continue
            }

            const fileBuffer = await file.zipFile.async('nodebuffer')
            const storagePath = `${albumId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${sanitizeFileName(file.fileName)}`

            let publicUrl: string

            if (isExternalStorageEnabled()) {
                try {
                    publicUrl = await uploadToExternalStorage(
                        storagePath,
                        fileBuffer,
                        guessContentType(extension)
                    )
                } catch (err) {
                    errors.push(`照片 ${file.fileName} 上傳失敗: ${err instanceof Error ? err.message : 'external upload error'}`)
                    continue
                }
            } else {
                errors.push(`照片 ${file.fileName} 上傳失敗: External storage not configured`)
                continue
            }

            try {
                await sql`INSERT INTO photos (album_id, src, alt, width, height)
                          VALUES (${albumId}, ${publicUrl}, ${file.fileName}, 800, 600)`
            } catch (dbError) {
                errors.push(`照片 ${file.fileName} 寫入資料庫失敗: ${dbError instanceof Error ? dbError.message : 'Unknown error'}`)
                continue
            }

            createdPhotos++
            if (!firstPhotoUrl) {
                firstPhotoUrl = publicUrl
            }
        }

        if ((!existingAlbum || !existingAlbum.cover_photo_url) && firstPhotoUrl) {
            await sql`UPDATE albums SET cover_photo_url = ${firstPhotoUrl} WHERE id = ${albumId}`
        }
    }

    revalidatePath('/admin/gallery')
    revalidatePath('/gallery')

    return {
        success: errors.length === 0,
        message: errors.length === 0 ? '批次匯入完成' : '批次匯入部分失敗，請檢查錯誤訊息',
        createdAlbums,
        createdPhotos,
        skippedFiles,
        details,
        errors
    }
}

function collectAlbumEntries(zip: JSZip) {
    const albums = new Map<string, { albumKey: string, files: { fileName: string, zipFile: JSZip.JSZipObject }[] }>()

    zip.forEach((relativePath, zipEntry) => {
        if (zipEntry.dir) return
        if (relativePath.startsWith('__MACOSX')) return

        const segments = relativePath.split('/').filter(Boolean)
        if (segments.length < 2) return

        const [albumFolder, ...rest] = segments
        const fileName = rest.join('/')
        if (!fileName) return

        const albumEntry = albums.get(albumFolder) || { albumKey: albumFolder, files: [] }
        albumEntry.files.push({ fileName, zipFile: zipEntry })
        albums.set(albumFolder, albumEntry)
    })

    return Array.from(albums.values())
}

async function readManifest(zip: JSZip): Promise<Record<string, ManifestAlbum>> {
    const manifestFile = zip.file(/manifest\.json$/i)
    if (!manifestFile || manifestFile.length === 0) return {}

    try {
        const manifestRaw = await manifestFile[0].async('string')
        const parsed = JSON.parse(manifestRaw) as { albums?: ManifestAlbum[] }
        const manifestMap: Record<string, ManifestAlbum> = {}

        parsed.albums?.forEach((album) => {
            if (album.folder) {
                manifestMap[album.folder] = album
            }
        })

        return manifestMap
    } catch {
        return {}
    }
}

function buildAlbumMeta(folderName: string, manifest: Record<string, ManifestAlbum>): AlbumMeta {
    const manifestMeta = manifest[folderName]

    const parsedFromFolder = parseFolderName(folderName)

    const title = manifestMeta?.title || parsedFromFolder.title || folderName
    const date = normalizeDate(manifestMeta?.date || parsedFromFolder.date)
    const category = pickCategory(manifestMeta?.category || parsedFromFolder.category)

    return {
        id: manifestMeta?.id,
        title,
        date,
        category,
        description: manifestMeta?.description,
        cover_color: manifestMeta?.cover_color || parsedFromFolder.cover_color
    }
}

function parseFolderName(folderName: string): Partial<AlbumMeta> {
    const dateMatch = folderName.match(/(\d{4}[./-]?\d{1,2}[./-]?\d{1,2})/)
    const datePart = dateMatch?.[1]

    const withoutDate = datePart ? folderName.replace(datePart, '') : folderName
    const parts = withoutDate.replace(/[\s]+/g, ' ').split(/[_-]/).filter(Boolean)

    const categoryPart = parts.find(part => CATEGORY_ALIASES[part.toLowerCase()] || CATEGORY_ALIASES[part as keyof typeof CATEGORY_ALIASES])
    const titleParts = parts.filter(part => part !== categoryPart)
    const title = titleParts.join(' ').trim() || folderName

    return {
        title,
        date: datePart,
        category: categoryPart,
    }
}

function normalizeDate(dateStr?: string) {
    if (!dateStr) return new Date().toISOString().slice(0, 10)

    const cleaned = dateStr.replace(/[./]/g, '-')
    const match = cleaned.match(/(\d{4})-?(\d{1,2})-?(\d{1,2})/)
    if (!match) return new Date().toISOString().slice(0, 10)

    const [, y, m, d] = match
    const month = m.padStart(2, '0')
    const day = d.padStart(2, '0')
    return `${y}-${month}-${day}`
}

function pickCategory(category?: string): AlbumMeta['category'] {
    if (!category) return 'special'
    const key = category.toLowerCase()
    return CATEGORY_ALIASES[key] || CATEGORY_ALIASES[category] || 'special'
}

function createAlbumId(meta: AlbumMeta) {
    const slug = slugify(meta.title)
    const randomSuffix = Math.random().toString(36).slice(2, 6)
    return `${meta.date}-${slug}-${randomSuffix}`
}

function slugify(text: string) {
    const cleaned = text
        .toLowerCase()
        .replace(/[^a-z0-9\u4e00-\u9fa5\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
    return cleaned || 'album'
}

function pickCoverColor(seed: string) {
    let hash = 0
    for (let i = 0; i < seed.length; i++) {
        hash = (hash << 5) - hash + seed.charCodeAt(i)
        hash |= 0
    }
    const index = Math.abs(hash) % COVER_COLORS.length
    return COVER_COLORS[index]
}

function getFileExtension(fileName: string) {
    const parts = fileName.split('.')
    if (parts.length < 2) return ''
    return parts.pop()!.toLowerCase()
}

function sanitizeFileName(fileName: string) {
    return fileName.replace(/[^\w.\-]/g, '_')
}

function guessContentType(ext: string) {
    switch (ext.toLowerCase()) {
        case 'jpg':
        case 'jpeg':
            return 'image/jpeg'
        case 'png':
            return 'image/png'
        case 'webp':
            return 'image/webp'
        case 'gif':
            return 'image/gif'
        case 'heic':
        case 'heif':
            return 'image/heic'
        default:
            return 'application/octet-stream'
    }
}
