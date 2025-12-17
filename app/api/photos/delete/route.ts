import { NextResponse } from 'next/server'
import { getSession } from '@/utils/auth-neon'
import { getDb } from '@/utils/db'
import { deleteFromR2 } from '@/utils/r2'

export async function POST(request: Request) {
    try {
        const session = await getSession()
        if (!session?.user) {
            return NextResponse.json({ error: '未登入' }, { status: 401 })
        }

        const body = await request.json().catch(() => ({}))
        const { id, src } = body as { id?: string; src?: string }
        if (!id || !src) {
            return NextResponse.json({ error: '缺少必要參數' }, { status: 400 })
        }

        // Delete from R2 if it's an R2 URL
        const baseUrl = process.env.EXTERNAL_PUBLIC_BASE_URL || ''
        if (src.startsWith(baseUrl)) {
            const key = src.replace(baseUrl + '/', '')
            await deleteFromR2(key)
        }

        // Delete from database
        const sql = getDb()
        await sql`DELETE FROM photos WHERE id = ${id}`

        return NextResponse.json({ ok: true })
    } catch (error) {
        console.error('delete photo error', error)
        return NextResponse.json({ error: '伺服器錯誤，請稍後再試' }, { status: 500 })
    }
}
