
/**
 * Server-side authentication utilities.
 * This file uses Node.js modules (bcryptjs, database) and should ONLY run in Server Actions.
 * For Edge Runtime (middleware), use auth-edge.ts instead.
 */

import { cookies } from 'next/headers'
import { getDb } from './db'
import bcrypt from 'bcryptjs'
import { encrypt, decrypt } from './auth-edge'

// Re-export for convenience
export { encrypt, decrypt }

export async function login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
        const sql = getDb()

        // 1. Fetch user by email
        const [user] = await sql`
            SELECT * FROM admin_users WHERE email = ${email} LIMIT 1
        `

        if (!user) {
            return { success: false, error: 'User not found' }
        }

        // 2. Verify password
        const isValid = await bcrypt.compare(password, user.password_hash)
        if (!isValid) {
            return { success: false, error: 'Invalid password' }
        }

        // 3. Create session
        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)
        const session = await encrypt({ user: { id: user.id, email: user.email, name: user.name }, expires })

        // 4. Set cookie
        // We need to await cookies() in Next.js 15+ (if applicable, but safe to assume await here)
        const cookieStore = await cookies()
        cookieStore.set('session', session, {
            expires,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
        })

        return { success: true }
    } catch (error: any) {
        console.error('Neon Auth Error:', error)
        return { success: false, error: error.message || 'Authentication error' }
    }
}

export async function logout() {
    const cookieStore = await cookies()
    cookieStore.delete('session')
}

export async function getSession() {
    const cookieStore = await cookies()
    const session = cookieStore.get('session')?.value
    if (!session) return null
    return await decrypt(session)
}
