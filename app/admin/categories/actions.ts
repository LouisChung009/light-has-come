'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export type Category = {
    id: string
    label: string
    value: string
    sort_order: number
}

export async function getCategories() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('album_categories')
        .select('*')
        .order('sort_order', { ascending: true })

    if (error) {
        console.error('Error fetching categories:', error)
        return []
    }

    return data as Category[]
}

export async function createCategory(formData: FormData) {
    const supabase = await createClient()
    const label = formData.get('label') as string
    const value = formData.get('value') as string
    const sort_order = parseInt(formData.get('sort_order') as string || '0')

    if (!label || !value) {
        throw new Error('Label and Value are required')
    }

    const { error } = await supabase
        .from('album_categories')
        .insert({ label, value, sort_order })

    if (error) {
        throw new Error(error.message)
    }

    revalidatePath('/admin/categories')
    revalidatePath('/admin/gallery/new')
    revalidatePath('/gallery')
}

export async function updateCategory(id: string, formData: FormData) {
    const supabase = await createClient()
    const label = formData.get('label') as string
    const value = formData.get('value') as string
    const sort_order = parseInt(formData.get('sort_order') as string || '0')

    const { error } = await supabase
        .from('album_categories')
        .update({ label, value, sort_order })
        .eq('id', id)

    if (error) {
        throw new Error(error.message)
    }

    revalidatePath('/admin/categories')
    revalidatePath('/admin/gallery/new')
    revalidatePath('/gallery')
}

export async function deleteCategory(id: string) {
    const supabase = await createClient()
    const { error } = await supabase
        .from('album_categories')
        .delete()
        .eq('id', id)

    if (error) {
        throw new Error(error.message)
    }

    revalidatePath('/admin/categories')
    revalidatePath('/admin/gallery/new')
    revalidatePath('/gallery')
}
