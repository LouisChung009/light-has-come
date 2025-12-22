
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { neon } from '@neondatabase/serverless';

// Load environment variables
dotenv.config({ path: '.env.local' });

if (!process.env.DATABASE_URL) {
    console.error('❌ Missing DATABASE_URL');
    process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

const SOURCE_DIR = 'line_albums';
const CATEGORY_ALIASES: Record<string, string> = {
    craft: 'craft', 手作: 'craft',
    music: 'music', worship: 'music', 音樂: 'music',
    science: 'science', 科學: 'science',
    outdoor: 'outdoor', 戶外: 'outdoor',
    special: 'special', 活動: 'special', 其他: 'special',
    camp: 'camp', 營會: 'camp',
    course: 'course', 課程: 'course'
};

function normalizeDate(dateStr: string) {
    // Handle YYYYMMDD
    if (/^\d{8}$/.test(dateStr)) {
        return `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`;
    }
    // Handle YYYY-MM-DD or YYYY.MM.DD
    const cleaned = dateStr.replace(/[./]/g, '-');
    const match = cleaned.match(/(\d{4})-?(\d{1,2})-?(\d{1,2})/);
    if (match) {
        const [, y, m, d] = match;
        return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
    }
    return dateStr;
}

function parseFolderMeta(folderName: string) {
    const parts = folderName.split('_').filter(Boolean);

    // Check for 8-digit date at start
    let datePart = parts.find(p => /^(\d{8}|\d{4}[./-]\d{1,2}[./-]\d{1,2})$/.test(p));

    const date = datePart ? normalizeDate(datePart) : new Date().toISOString().slice(0, 10);

    // Category is usually the last part if it matches an alias
    let categoryRaw = parts[parts.length - 1];
    let category = CATEGORY_ALIASES[categoryRaw.toLowerCase()] || 'special';

    // Title is everything else
    // If last part was category, exclude it. If not, include it.
    let titleParts = parts.filter(p => p !== datePart);
    if (CATEGORY_ALIASES[categoryRaw.toLowerCase()]) {
        titleParts = titleParts.slice(0, -1);
    }

    let title = titleParts.join(' ');

    // Fallback if title empty
    if (!title) title = folderName;

    return { title, date, category };
}

async function main() {
    console.log('🚀 Starting Metadata Update...');

    const albums = await sql`SELECT id, title, date, category FROM albums`;
    console.log(`Loaded ${albums.length} albums from DB.`);

    const items = fs.readdirSync(SOURCE_DIR);
    const folders = items.filter(item => {
        return fs.statSync(path.join(SOURCE_DIR, item)).isDirectory() && !item.startsWith('.') && item !== '_completed';
    });

    for (const folder of folders) {
        const meta = parseFolderMeta(folder);
        console.log(`\n📂 Folder: ${folder}`);
        console.log(`   -> Parsed: [${meta.date}] ${meta.title} (${meta.category})`);

        // Find matching album
        // Strategy: Match by Title (Loose) or exact match if previous upload used folder name
        // We check if DB title seems to 'contain' the parsed title or matches folder name

        let match = albums.find(a => a.title === meta.title || a.title === folder);

        // If not found, try to find by ID? No, ID is random.
        // Try fuzzy match?
        if (!match) {
            // Maybe DB title includes date? e.g. "20251102_Title"
            match = albums.find(a => a.title.includes(meta.title));
        }

        if (match) {
            console.log(`   ✅ Found DB Match: [${match.title}] (ID: ${match.id})`);
            console.log(`      Current: ${match.date} | ${match.category}`);

            // Update
            if (match.date !== meta.date || match.title !== meta.title || match.category !== meta.category) {
                console.log(`      🔄 Updating to: ${meta.date} | ${meta.title} | ${meta.category}`);
                await sql`
                    UPDATE albums 
                    SET date = ${meta.date}, title = ${meta.title}, category = ${meta.category}
                    WHERE id = ${match.id}
                `;
                console.log(`      ✨ Updated.`);
            } else {
                console.log(`      (No changes needed)`);
            }
        } else {
            console.log(`   ⚠️ No matching album found in DB. Skipping.`);
        }
    }
    console.log('\nDone.');
}

main();
