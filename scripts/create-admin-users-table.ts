
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import { getDb } from '../utils/db'

async function migrate() {
    const sql = getDb()
    console.log('Creating admin_users table...')

    await sql`
        CREATE TABLE IF NOT EXISTS admin_users (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            name TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    `
    console.log('Done.')
}

migrate().catch(console.error)
