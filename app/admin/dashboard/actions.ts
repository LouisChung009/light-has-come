'use server'

import { getDb } from '@/utils/db'
import { revalidatePath } from 'next/cache'

export async function updateRegistrationStatus(id: string, status: string) {
    const sql = getDb()

    try {
        await sql`
            UPDATE registrations
            SET status = ${status}
            WHERE id = ${id}
        `
        revalidatePath('/admin/dashboard')
    } catch (error) {
        console.error('Error updating registration status:', error)
        return { error: 'Failed to update status' }
    }
}

export async function deleteRegistration(id: string) {
    const sql = getDb()

    try {
        await sql`
            DELETE FROM registrations
            WHERE id = ${id}
        `
        revalidatePath('/admin/dashboard')
    } catch (error) {
        console.error('Error deleting registration:', error)
        return { error: 'Failed to delete registration' }
    }
}
