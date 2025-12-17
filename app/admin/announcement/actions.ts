'use server'

import { getSession } from '@/utils/auth-neon'
import { uploadToR2 } from '@/utils/r2'

export async function uploadPoster(formData: FormData): Promise<{ url?: string; error?: string }> {
    const session = await getSession()
    if (!session?.user) {
        return { error: '未登入' }
    }

    const file = formData.get('file') as File | null
    if (!file || file.size === 0) {
        return { error: '請選擇檔案' }
    }

    try {
        const ext = file.name.split('.').pop() || 'png'
        const key = `announcements/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
        const buffer = Buffer.from(await file.arrayBuffer())

        const result = await uploadToR2(key, buffer, file.type)
        if (!result.success) {
            return { error: result.error || '上傳失敗' }
        }

        return { url: result.url }
    } catch (err: any) {
        console.error('Poster upload error:', err)
        return { error: err.message || '上傳失敗' }
    }
}
