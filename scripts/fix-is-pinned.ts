import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

if (!process.env.DATABASE_URL) {
    console.error('❌ Missing DATABASE_URL using Neon.');
    process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

async function main() {
    console.log('Fixing database: Adding is_pinned column to albums table...');

    try {
        await sql`
            ALTER TABLE albums 
            ADD COLUMN IF NOT EXISTS is_pinned boolean DEFAULT false;
        `;

        console.log('✅ Fix applied successfully.');

    } catch (error) {
        console.error('❌ Fix failed:', error);
        process.exit(1);
    }
}

main();
