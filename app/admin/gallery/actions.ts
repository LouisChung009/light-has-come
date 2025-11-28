'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createAlbum(formData: FormData) {
    const supabase = await createClient()

    const title = formData.get('title') as string
    const date = formData.get('date') as string
    const category = formData.get('category') as string
    const description = formData.get('description') as string

    // Generate a simple ID from date and random string to avoid collision
    const id = `${date}-${Math.random().toString(36).substring(2, 7)}`

    const { error } = await supabase
        .from('albums')
        .insert({
            id,
            title,
            date,
            category,
            description,
            cover_color: 'linear-gradient(135deg, #FFD93D, #FFAAA5)' // Default color
        })

    if (error) {
        throw new Error(error.message)
    }

    revalidatePath('/admin/gallery')
    redirect('/admin/gallery')
}

export async function deleteAlbum(id: string): Promise<void> {
    const supabase = await createClient()

    const { error } = await supabase
        .from('albums')
        .delete()
        .eq('id', id)

    if (error) {
        throw new Error(error.message)
    }

    revalidatePath('/admin/gallery')
    revalidatePath('/gallery')
}

export async function uploadPhoto(formData: FormData) {
    const supabase = await createClient()

    const albumId = formData.get('albumId') as string
    const file = formData.get('file') as File

    if (!file) {
        return { error: 'No file uploaded' }
    }

    // 1. Upload file to Storage
    const fileExt = file.name.split('.').pop()
    const fileName = `${albumId}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

    const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(fileName, file)

    if (uploadError) {
        return { error: uploadError.message }
    }

    // 2. Get Public URL
    const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(fileName)

    // 3. Insert into photos table
    const { error: dbError } = await supabase
        .from('photos')
        .insert({
            album_id: albumId,
            src: publicUrl,
            alt: file.name,
            width: 800, // Mock width/height for now, ideally we get this from the image
            height: 600
        })

    if (dbError) {
        return { error: dbError.message }
    }

    revalidatePath(`/admin/gallery/${albumId}`)
}

export async function deletePhoto(id: string, src: string) {
    const supabase = await createClient()

    // 1. Delete from Storage
    // Extract path from URL: .../gallery/albumId/filename
    const path = src.split('/gallery/')[1]
    if (path) {
        await supabase.storage
            .from('gallery')
            .remove([path])
    }

    // 2. Delete from Database
    const { error } = await supabase
        .from('photos')
        .delete()
        .eq('id', id)

    if (error) {
        return { error: error.message }
    }

    // We need to revalidate the page where this photo was
    // Since we don't have the albumId here easily without querying, 
    // we might rely on the client to refresh or pass albumId.
    // But usually revalidatePath with layout or page path works.
    // Let's try to revalidate the specific album page if possible, 
    // but generic revalidate might be safer if we don't know the ID.
    // Actually, the client calls this, so the client can refresh.
}

export async function setAlbumCover(albumId: string, photoUrl: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('albums')
        .update({ cover_photo_url: photoUrl })
        .eq('id', albumId)

    if (error) {
        return { error: error.message }
    }

    revalidatePath(`/admin/gallery/${albumId}`)
    revalidatePath('/admin/gallery')
    revalidatePath('/gallery')
}
