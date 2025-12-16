
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import { getDb } from '../utils/db'
import bcrypt from 'bcryptjs'

async function seed() {
    const sql = getDb()
    const email = 'admin@example.com' // You should change this or prompt for input
    const password = 'admin' // You should change this or prompt for input
    const name = 'Admin'

    console.log(`Creating admin user: ${email}`)

    const hash = await bcrypt.hash(password, 10)

    try {
        await sql`
            INSERT INTO admin_users (email, password_hash, name)
            VALUES (${email}, ${hash}, ${name})
            ON CONFLICT (email) DO NOTHING
        `
        console.log('Admin user created successfully.')
    } catch (err) {
        console.error('Error creating admin user:', err)
    }
}

seed().catch(console.error)
