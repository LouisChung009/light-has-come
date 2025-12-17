#!/usr/bin/env node
require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

const DATABASE_URL = process.argv[2] || process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('MISSING DATABASE_URL');
  console.error('Usage: node scripts/check-neon-photos.js <DATABASE_URL>');
  process.exit(2);
}

(async () => {
  try {
    const sql = neon(DATABASE_URL);
    const r1 = await sql`SELECT COUNT(*) as c FROM photos`;
    const r2 = await sql`SELECT id, src, created_at FROM photos ORDER BY created_at DESC LIMIT 20`;
    console.log(JSON.stringify({ photosCount: r1[0]?.c ?? 0, sample: r2 }, null, 2));
  } catch (e) {
    console.error('ERR', e && e.message ? e.message : e);
    process.exit(1);
  }
})();
