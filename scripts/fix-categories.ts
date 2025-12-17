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
    console.log('Fixing database: Creating album_categories table...');

    try {
        // Create album_categories table based on actions.ts
        // label, value, sort_order

        await sql`
            CREATE TABLE IF NOT EXISTS album_categories (
                id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
                label text NOT NULL,
                value text NOT NULL,
                sort_order integer DEFAULT 0,
                created_at timestamp with time zone DEFAULT now()
            );
        `;

        // Seed default categories
        console.log('Seeding default categories...');
        const categories = [
            { label: '手作', value: 'craft', sort_order: 1 },
            { label: '音樂', value: 'music', sort_order: 2 },
            { label: '科學', value: 'science', sort_order: 3 },
            { label: '戶外', value: 'outdoor', sort_order: 4 },
            { label: '特別活動', value: 'special', sort_order: 5 },
        ];

        for (const cat of categories) {
            await sql`
                INSERT INTO album_categories (label, value, sort_order)
                VALUES (${cat.label}, ${cat.value}, ${cat.sort_order})
                ON CONFLICT DO NOTHING -- ID is random UUID, so we can't really conflict unless we add unique constraint on value
            `;
        }

        // Add unique constraint on 'value' to prevent duplicates in future
        try {
            await sql`CREATE UNIQUE INDEX IF NOT EXISTS idx_album_categories_value ON album_categories(value)`;
        } catch (e) {
            console.log('Index might already exist or duplicates present');
        }

        console.log('✅ Fix applied successfully.');

    } catch (error) {
        console.error('❌ Fix failed:', error);
        process.exit(1);
    }
}

main();
