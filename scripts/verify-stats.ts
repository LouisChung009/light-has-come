import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

if (!process.env.DATABASE_URL) {
    console.error('❌ Missing DATABASE_URL');
    process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

async function verify() {
    try {
        const [albumCount] = await sql`SELECT COUNT(*)::int as count FROM albums`;
        const [photoCount] = await sql`SELECT COUNT(*)::int as count FROM photos`;
        const [categoryCount] = await sql`SELECT COUNT(*)::int as count FROM album_categories`;

        console.log('📊 Database Verification Stats:');
        console.log(`   - Albums: ${albumCount.count}`);
        console.log(`   - Photos: ${photoCount.count}`);
        console.log(`   - Categories: ${categoryCount.count}`);

        if (albumCount.count > 0 && photoCount.count > 0) {
            console.log('\n✅ Data present. Application should be functional.');
        } else {
            console.log('\n⚠️ No data found. Upload might have failed or is incomplete.');
        }

    } catch (error) {
        console.error('❌ Verification failed:', error);
    }
}

verify();
