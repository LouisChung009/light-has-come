import dotenv from 'dotenv'

// Load env before other imports
dotenv.config({ path: '.env.local' })

import { getDb } from '../utils/db'
import { login } from '../utils/auth-neon'

console.log('Loaded Environment Variables:', Object.keys(process.env).filter(k => k.includes('URL') || k.includes('DB')))

async function debugAuth() {
    const sql = getDb()

    console.log('--- Checking admin_users table ---')
    try {
        const users = await sql`SELECT id, email, name, password_hash, created_at FROM admin_users`
        console.log(`Found ${users.length} users:`)
        users.forEach(u => console.log(`- ${u.email} (Hash length: ${u.password_hash?.length})`))

        if (users.length > 0) {
            console.log('\n--- Testing Login Logic ---')
            const email = 'admin@example.com'
            const password = 'admin'

            console.log(`Attempting login with: ${email} / ${password}`)
            const result = await login(email, password)
            console.log('Login Result:', result)
        } else {
            console.log('No users found! Seed script might have failed.')
        }

    } catch (err) {
        console.error('Database Error:', err)
    }
}

debugAuth().catch(console.error)
