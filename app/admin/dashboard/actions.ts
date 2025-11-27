'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateRegistrationStatus(id: string, status: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('registrations')
        .update({ status })
        .eq('id', id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/admin/dashboard')
}

export async function deleteRegistration(id: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('registrations')
        .delete()
        .eq('id', id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/admin/dashboard')
}
