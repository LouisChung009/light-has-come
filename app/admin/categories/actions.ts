'use server'

import { getDb } from '@/utils/db'
import type { Category } from '@/utils/db'
import { revalidatePath } from 'next/cache'


export async function getCategories(): Promise<Category[]> {
    const sql = getDb()
    try {
        const data = await sql`SELECT * FROM album_categories ORDER BY sort_order ASC`
        return data as Category[]
    } catch (error) {
        console.error('Error fetching categories:', error)
        return []
    }
}

export async function createCategory(formData: FormData) {
    const sql = getDb()
    const label = formData.get('label') as string
    const value = formData.get('value') as string
    const sort_order = parseInt(formData.get('sort_order') as string || '0')

    if (!label || !value) {
        throw new Error('Label and Value are required')
    }

    try {
        await sql`INSERT INTO album_categories (label, value, sort_order) VALUES (${label}, ${value}, ${sort_order})`
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to create category')
    }

    revalidatePath('/admin/categories')
    revalidatePath('/admin/gallery/new')
    revalidatePath('/gallery')
}

export async function updateCategory(id: string, formData: FormData) {
    const sql = getDb()
    const label = formData.get('label') as string
    const value = formData.get('value') as string
    const sort_order = parseInt(formData.get('sort_order') as string || '0')

    try {
        await sql`UPDATE album_categories SET label = ${label}, value = ${value}, sort_order = ${sort_order} WHERE id = ${id}`
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to update category')
    }

    revalidatePath('/admin/categories')
    revalidatePath('/admin/gallery/new')
    revalidatePath('/gallery')
}

export async function deleteCategory(id: string) {
    const sql = getDb()
    try {
        await sql`DELETE FROM album_categories WHERE id = ${id}`
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to delete category')
    }

    revalidatePath('/admin/categories')
    revalidatePath('/admin/gallery/new')
    revalidatePath('/gallery')
}

