import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return NextResponse.json({ error: '未登入' }, { status: 401 })
        }

        const body = await request.json().catch(() => ({}))
        const { id, src } = body as { id?: string; src?: string }
        if (!id || !src) {
            return NextResponse.json({ error: '缺少必要參數' }, { status: 400 })
        }

        const path = src.split('/gallery/')[1]
        if (path) {
            await supabase.storage.from('gallery').remove([path])
        }

        const { error } = await supabase
            .from('photos')
            .delete()
            .eq('id', id)

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ ok: true })
    } catch (error) {
        console.error('delete photo error', error)
        return NextResponse.json({ error: '伺服器錯誤，請稍後再試' }, { status: 500 })
    }
}
