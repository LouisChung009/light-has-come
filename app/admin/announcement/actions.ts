'use server'

import { getSession } from '@/utils/auth-neon'
import { uploadToR2 } from '@/utils/r2'

export async function uploadPoster(formData: FormData): Promise<{ url?: string; error?: string }> {
    try {
        // Check session
        const session = await getSession()
        if (!session?.user) {
            console.error('uploadPoster: No session found')
            return { error: '未登入，請重新登入' }
        }

        const file = formData.get('file') as File | null
        if (!file || file.size === 0) {
            return { error: '請選擇檔案' }
        }

        console.log(`uploadPoster: Uploading file ${file.name}, size: ${file.size}, type: ${file.type}`)

        // Check R2 config
        if (!process.env.EXTERNAL_S3_ENDPOINT) {
            console.error('uploadPoster: Missing EXTERNAL_S3_ENDPOINT')
            return { error: 'R2 設定錯誤: 缺少 EXTERNAL_S3_ENDPOINT' }
        }
        if (!process.env.EXTERNAL_S3_BUCKET) {
            console.error('uploadPoster: Missing EXTERNAL_S3_BUCKET')
            return { error: 'R2 設定錯誤: 缺少 EXTERNAL_S3_BUCKET' }
        }
        if (!process.env.EXTERNAL_S3_ACCESS_KEY_ID) {
            console.error('uploadPoster: Missing EXTERNAL_S3_ACCESS_KEY_ID')
            return { error: 'R2 設定錯誤: 缺少 EXTERNAL_S3_ACCESS_KEY_ID' }
        }
        if (!process.env.EXTERNAL_S3_SECRET_ACCESS_KEY) {
            console.error('uploadPoster: Missing EXTERNAL_S3_SECRET_ACCESS_KEY')
            return { error: 'R2 設定錯誤: 缺少 EXTERNAL_S3_SECRET_ACCESS_KEY' }
        }
        if (!process.env.EXTERNAL_PUBLIC_BASE_URL) {
            console.error('uploadPoster: Missing EXTERNAL_PUBLIC_BASE_URL')
            return { error: 'R2 設定錯誤: 缺少 EXTERNAL_PUBLIC_BASE_URL' }
        }

        const ext = file.name.split('.').pop() || 'png'
        const key = `announcements/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
        const buffer = Buffer.from(await file.arrayBuffer())

        console.log(`uploadPoster: Uploading to R2 with key: ${key}`)

        const result = await uploadToR2(key, buffer, file.type)

        if (!result.success) {
            console.error('uploadPoster: R2 upload failed:', result.error)
            return { error: result.error || '上傳到 R2 失敗' }
        }

        console.log(`uploadPoster: Upload successful, URL: ${result.url}`)
        return { url: result.url }
    } catch (err: any) {
        console.error('uploadPoster: Unexpected error:', err)
        return { error: `上傳失敗: ${err.message || '未知錯誤'}` }
    }
}

