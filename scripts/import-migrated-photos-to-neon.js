#!/usr/bin/env node
/*
  Usage:
    node scripts/import-migrated-photos-to-neon.js <DATABASE_URL> [--dry-run] [--limit=1000] [--log=migrate-log.jsonl]
*/
const fs = require('fs');
const path = require('path');
const { neon } = require('@neondatabase/serverless');

const args = process.argv.slice(2);
const DATABASE_URL = args[0] || process.env.DATABASE_URL;
const dryRun = args.includes('--dry-run');
const limitArg = args.find(a => a.startsWith('--limit='));
const limit = limitArg ? parseInt(limitArg.split('=')[1], 10) : undefined;
const logArg = args.find(a => a.startsWith('--log='));
const logPath = logArg ? logArg.split('=')[1] : 'migrate-log.jsonl';

if (!DATABASE_URL) {
  console.error('Missing DATABASE_URL. Usage: node scripts/import-migrated-photos-to-neon.js <DATABASE_URL> [--dry-run]');
  process.exit(2);
}

if (!fs.existsSync(logPath)) {
  console.error('Log file not found:', logPath);
  process.exit(2);
}

(async () => {
  try {
    console.log('Reading log:', logPath);
    const lines = fs.readFileSync(logPath, 'utf-8').split(/\r?\n/).filter(Boolean);
    console.log(`Found ${lines.length} log lines`);

    const entries = [];
    for (const line of lines) {
      try {
        const p = JSON.parse(line);
        if (p && p.photoId && p.key && p.newSrc) {
          const [album_id] = p.key.split('/');
          const filename = p.key.split('/').pop();
          entries.push({ id: p.photoId, album_id, src: p.newSrc, alt: filename });
        }
      } catch (e) {
        // ignore unparsable lines
      }
      if (limit && entries.length >= limit) break;
    }

    console.log(`Parsed ${entries.length} entries (limit=${limit || 'none'})`);

    const sql = neon(DATABASE_URL);

    let missing = 0;
    let inserted = 0;
    const batchSize = 100;

    for (let i = 0; i < entries.length; i += batchSize) {
      const batch = entries.slice(i, i + batchSize);

      // Check which IDs already exist
      const ids = batch.map(b => b.id);
      const existing = await sql`SELECT id FROM photos WHERE id = ANY(${ids})`;
      const existingIds = new Set(existing.map(r => r.id));

      const toInsert = batch.filter(b => !existingIds.has(b.id));
      missing += toInsert.length;

      if (toInsert.length === 0) {
        console.log(`Batch ${i / batchSize + 1}: all exist, skipped`);
        continue;
      }

      console.log(`Batch ${i / batchSize + 1}: ${toInsert.length} missing`);

      if (!dryRun) {
        for (const t of toInsert) {
          try {
            await sql`
              INSERT INTO photos (id, album_id, src, alt, width, height)
              VALUES (${t.id}, ${t.album_id}, ${t.src}, ${t.alt}, 800, 600)
              ON CONFLICT (id) DO NOTHING
            `;
            inserted++;
          } catch (e) {
            console.error('Insert failed for', t.id, e.message);
          }
        }
      }
    }

    console.log('\nImport summary:');
    console.log(`Entries processed: ${entries.length}`);
    console.log(`Missing (would insert): ${missing}`);
    if (!dryRun) console.log(`Inserted: ${inserted}`);

    if (dryRun) console.log('\nDry run mode: no changes were written.');

    process.exit(0);
  } catch (e) {
    console.error('ERR', e && e.message ? e.message : e);
    process.exit(1);
  }
})();
