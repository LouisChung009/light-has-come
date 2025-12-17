import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'

// R2 configuration from environment variables
const R2_ENDPOINT = process.env.EXTERNAL_S3_ENDPOINT
const R2_BUCKET = process.env.EXTERNAL_S3_BUCKET
const R2_ACCESS_KEY_ID = process.env.EXTERNAL_S3_ACCESS_KEY_ID
const R2_SECRET_ACCESS_KEY = process.env.EXTERNAL_S3_SECRET_ACCESS_KEY
const R2_PUBLIC_BASE_URL = process.env.EXTERNAL_PUBLIC_BASE_URL
const R2_PREFIX = process.env.EXTERNAL_S3_PREFIX || ''

function getR2Client() {
    if (!R2_ENDPOINT || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
        throw new Error('R2 configuration is missing. Check EXTERNAL_S3_* environment variables.')
    }

    return new S3Client({
        region: 'auto',
        endpoint: R2_ENDPOINT,
        credentials: {
            accessKeyId: R2_ACCESS_KEY_ID,
            secretAccessKey: R2_SECRET_ACCESS_KEY,
        },
    })
}

export async function uploadToR2(
    key: string,
    body: Buffer,
    contentType?: string
): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
        const client = getR2Client()
        const fullKey = R2_PREFIX ? `${R2_PREFIX}/${key}` : key

        await client.send(
            new PutObjectCommand({
                Bucket: R2_BUCKET,
                Key: fullKey,
                Body: body,
                ContentType: contentType,
            })
        )

        const url = `${R2_PUBLIC_BASE_URL}/${fullKey}`
        return { success: true, url }
    } catch (error: any) {
        console.error('R2 upload error:', error)
        return { success: false, error: error.message }
    }
}

export async function deleteFromR2(key: string): Promise<{ success: boolean; error?: string }> {
    try {
        const client = getR2Client()
        const fullKey = R2_PREFIX ? `${R2_PREFIX}/${key}` : key

        await client.send(
            new DeleteObjectCommand({
                Bucket: R2_BUCKET,
                Key: fullKey,
            })
        )

        return { success: true }
    } catch (error: any) {
        console.error('R2 delete error:', error)
        return { success: false, error: error.message }
    }
}
