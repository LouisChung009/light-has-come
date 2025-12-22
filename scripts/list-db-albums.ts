
import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL!);

async function keys() {
    const albums = await sql`SELECT id, title, date, category FROM albums ORDER BY date DESC`;
    console.log(JSON.stringify(albums, null, 2));
}
keys();
