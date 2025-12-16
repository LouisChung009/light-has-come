import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

type ExternalStorageConfig = {
    endpoint: string
    region: string
    bucket: string
    accessKeyId: string
    secretAccessKey: string
    publicBaseUrl: string
    prefix?: string
}

function readConfig(): ExternalStorageConfig | null {
    const endpoint = process.env.EXTERNAL_S3_ENDPOINT
    const bucket = process.env.EXTERNAL_S3_BUCKET
    const accessKeyId = process.env.EXTERNAL_S3_ACCESS_KEY_ID
    const secretAccessKey = process.env.EXTERNAL_S3_SECRET_ACCESS_KEY
    const publicBaseUrl = process.env.EXTERNAL_PUBLIC_BASE_URL

    if (!endpoint || !bucket || !accessKeyId || !secretAccessKey || !publicBaseUrl) {
        return null
    }

    return {
        endpoint,
        region: process.env.EXTERNAL_S3_REGION || 'auto',
        bucket,
        accessKeyId,
        secretAccessKey,
        publicBaseUrl,
        prefix: process.env.EXTERNAL_S3_PREFIX,
    }
}

let cachedClient: S3Client | null = null
let cachedKey: string | null = null

function getClient(cfg: ExternalStorageConfig) {
    const key = `${cfg.endpoint}|${cfg.region}|${cfg.accessKeyId}|${cfg.bucket}`
    if (cachedClient && cachedKey === key) {
        return cachedClient
    }

    cachedClient = new S3Client({
        region: cfg.region,
        endpoint: cfg.endpoint,
        credentials: {
            accessKeyId: cfg.accessKeyId,
            secretAccessKey: cfg.secretAccessKey,
        },
        forcePathStyle: true,
    })
    cachedKey = key
    return cachedClient
}

export function isExternalStorageEnabled() {
    return !!readConfig()
}

export function buildExternalKey(path: string) {
    const cfg = readConfig()
    if (!cfg) throw new Error('External storage is not configured')

    const cleanedPath = path.replace(/^\/+/, '')
    const prefix = cfg.prefix ? cfg.prefix.replace(/\/+$/, '') + '/' : ''
    return `${prefix}${cleanedPath}`
}

export function getExternalPublicUrl(key: string) {
    const cfg = readConfig()
    if (!cfg) throw new Error('External storage is not configured')

    const base = cfg.publicBaseUrl.replace(/\/+$/, '')
    return `${base}/${key.replace(/^\/+/, '')}`
}

export async function uploadToExternalStorage(path: string, body: Uint8Array, contentType?: string) {
    const cfg = readConfig()
    if (!cfg) throw new Error('External storage is not configured')

    const key = buildExternalKey(path)
    const client = getClient(cfg)

    await client.send(
        new PutObjectCommand({
            Bucket: cfg.bucket,
            Key: key,
            Body: body,
            ContentType: contentType,
            CacheControl: 'public, max-age=31536000, immutable',
        })
    )

    return getExternalPublicUrl(key)
}

export function extractExternalKeyFromUrl(url: string) {
    const cfg = readConfig()
    if (!cfg) return null

    const base = cfg.publicBaseUrl.replace(/\/+$/, '')
    if (!url.startsWith(base + '/')) return null
    return url.slice(base.length + 1)
}

export async function deleteFromExternalStorage(key: string) {
    const cfg = readConfig()
    if (!cfg) throw new Error('External storage is not configured')

    const client = getClient(cfg)
    await client.send(
        new DeleteObjectCommand({
            Bucket: cfg.bucket,
            Key: key,
        })
    )
}
