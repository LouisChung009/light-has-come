import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
    const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!SUPABASE_URL || !SUPABASE_KEY) {
        // Running in environment without Supabase: return a safe browser stub
        return {
            auth: {
                async getUser() {
                    return { data: { user: null } }
                },
            },
        } as any
    }

    return createBrowserClient(SUPABASE_URL, SUPABASE_KEY)
}
