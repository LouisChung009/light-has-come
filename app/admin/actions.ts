'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { login as neonLogin, logout as neonLogout } from '@/utils/auth-neon'

export async function login(formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { success, error } = await neonLogin(email, password)

    if (!success) {
        console.error('Login error:', error)
        redirect(`/admin?message=${encodeURIComponent(error || 'Login failed')}`)
    }

    revalidatePath('/admin', 'layout')
    redirect('/admin/dashboard')
}

export async function logout() {
    await neonLogout()
    revalidatePath('/admin', 'layout')
    redirect('/admin')
}
