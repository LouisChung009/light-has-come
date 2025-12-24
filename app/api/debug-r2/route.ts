import { NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

export async function GET() {
    const results: Record<string, unknown> = {
        timestamp: new Date().toISOString(),
    }

    // Check environment variables
    results.envCheck = {
        EXTERNAL_S3_ENDPOINT: !!process.env.EXTERNAL_S3_ENDPOINT,
        EXTERNAL_S3_BUCKET: !!process.env.EXTERNAL_S3_BUCKET,
        EXTERNAL_S3_ACCESS_KEY_ID: !!process.env.EXTERNAL_S3_ACCESS_KEY_ID,
        EXTERNAL_S3_SECRET_ACCESS_KEY: !!process.env.EXTERNAL_S3_SECRET_ACCESS_KEY,
        EXTERNAL_PUBLIC_BASE_URL: !!process.env.EXTERNAL_PUBLIC_BASE_URL,
        AUTH_SECRET: !!process.env.AUTH_SECRET,
        DATABASE_URL: !!process.env.DATABASE_URL,
    }

    // Try to create S3 client and upload a test file
    try {
        const endpoint = process.env.EXTERNAL_S3_ENDPOINT
        const bucket = process.env.EXTERNAL_S3_BUCKET
        const accessKeyId = process.env.EXTERNAL_S3_ACCESS_KEY_ID
        const secretAccessKey = process.env.EXTERNAL_S3_SECRET_ACCESS_KEY
        const publicBaseUrl = process.env.EXTERNAL_PUBLIC_BASE_URL

        if (!endpoint || !bucket || !accessKeyId || !secretAccessKey) {
            results.r2Test = { success: false, error: 'Missing R2 configuration' }
            return NextResponse.json(results)
        }

        const client = new S3Client({
            region: 'auto',
            endpoint: endpoint,
            credentials: {
                accessKeyId: accessKeyId,
                secretAccessKey: secretAccessKey,
            },
        })

        const testKey = `test/debug-${Date.now()}.txt`
        const testContent = `Test upload at ${new Date().toISOString()}`

        await client.send(
            new PutObjectCommand({
                Bucket: bucket,
                Key: testKey,
                Body: testContent,
                ContentType: 'text/plain',
            })
        )

        results.r2Test = {
            success: true,
            key: testKey,
            url: `${publicBaseUrl}/${testKey}`,
        }
    } catch (error: any) {
        results.r2Test = {
            success: false,
            error: error.message,
            name: error.name,
        }
    }

    return NextResponse.json(results)
}
