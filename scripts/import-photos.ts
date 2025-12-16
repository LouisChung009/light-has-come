// Import photos from Supabase JSON to Neon
// Run with: npx tsx scripts/import-photos.ts

import { neon } from '@neondatabase/serverless';

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_BdlqfZVIy5c0@ep-noisy-meadow-a1xsli8h-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';

const photos = [
    // craft-2025-10-26-nkkb5
    { id: '8f05ad10-78b8-4130-af7d-193b1c27631b', album_id: 'craft-2025-10-26-nkkb5', src: 'https://pub-cb9efd95cb3d48e3b24ed8b345699b7f.r2.dev/gallery/craft-2025-10-26-nkkb5/18sq2m.jpg', alt: 'LINE_ALBUM_20251026小小考過學家_251127_129.jpg' },
    { id: '741b4403-c06f-49df-913e-31c9cded2c0e', album_id: 'craft-2025-10-26-nkkb5', src: 'https://pub-cb9efd95cb3d48e3b24ed8b345699b7f.r2.dev/gallery/craft-2025-10-26-nkkb5/n1bpnl.jpg', alt: 'LINE_ALBUM_20251026小小考過學家_251127_128.jpg' },
    // ... 這裡需要手動加入所有照片資料
];

async function importPhotos() {
    const sql = neon(DATABASE_URL);

    console.log(`Starting import of ${photos.length} photos...`);

    let success = 0;
    let failed = 0;

    for (const photo of photos) {
        try {
            await sql`
        INSERT INTO photos (id, album_id, src, alt, width, height)
        VALUES (${photo.id}, ${photo.album_id}, ${photo.src}, ${photo.alt}, 800, 600)
        ON CONFLICT (id) DO NOTHING
      `;
            success++;
            if (success % 50 === 0) {
                console.log(`Imported ${success} photos...`);
            }
        } catch (error) {
            console.error(`Failed to import photo ${photo.id}:`, error);
            failed++;
        }
    }

    console.log(`\nImport complete!`);
    console.log(`Success: ${success}`);
    console.log(`Failed: ${failed}`);
}

importPhotos();
