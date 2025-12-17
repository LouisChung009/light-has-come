import { S3Client, ListObjectsV2Command, DeleteObjectsCommand } from '@aws-sdk/client-s3';
import * as dotenv from 'dotenv';
import * as readline from 'readline';

// Load environment variables
dotenv.config({ path: '.env.local' });

const config = {
    endpoint: process.env.EXTERNAL_S3_ENDPOINT,
    bucket: process.env.EXTERNAL_S3_BUCKET,
    accessKeyId: process.env.EXTERNAL_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.EXTERNAL_S3_SECRET_ACCESS_KEY,
    region: process.env.EXTERNAL_S3_REGION || 'auto',
    prefix: process.env.EXTERNAL_S3_PREFIX || 'gallery'
};

if (!config.endpoint || !config.bucket || !config.accessKeyId || !config.secretAccessKey) {
    console.error('❌ Missing R2 configuration in .env.local');
    process.exit(1);
}

const client = new S3Client({
    region: config.region,
    endpoint: config.endpoint,
    credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
    },
    forcePathStyle: true,
});

async function clearBucket() {
    console.log(`⚠️  WARNING: You are about to DELETE ALL FILES in bucket "${config.bucket}" with prefix "${config.prefix}/"`);
    console.log(`Endpoint: ${config.endpoint}`);

    // Safety check: force user confirmation (skipped here for automation, but good to have printed)
    console.log('Starting deletion process...');

    let continuationToken: string | undefined = undefined;
    let deletedCount = 0;

    do {
        const listCmd = new ListObjectsV2Command({
            Bucket: config.bucket,
            Prefix: config.prefix ? (config.prefix + '/') : undefined,
            ContinuationToken: continuationToken
        });

        const listRes = await client.send(listCmd);

        if (!listRes.Contents || listRes.Contents.length === 0) {
            console.log('No more objects found to delete.');
            break;
        }

        const objectsToDelete = listRes.Contents.map(obj => ({ Key: obj.Key }));
        console.log(`Deleting batch of ${objectsToDelete.length} files...`);

        const deleteCmd = new DeleteObjectsCommand({
            Bucket: config.bucket,
            Delete: {
                Objects: objectsToDelete,
                Quiet: true
            }
        });

        await client.send(deleteCmd);
        deletedCount += objectsToDelete.length;
        continuationToken = listRes.NextContinuationToken;

    } while (continuationToken);

    console.log(`✅ Cleared ${deletedCount} files from R2.`);
}

clearBucket().catch(err => {
    console.error('❌ Error clearing bucket:', err);
    process.exit(1);
});
