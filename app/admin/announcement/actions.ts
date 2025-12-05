'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export type AnnouncementConfig = {
    enabled: boolean
    imageUrl: string
    ctaEnabled?: boolean
    ctaHref?: string
    storageKey?: string
}

const DEFAULT_CONFIG: AnnouncementConfig = {
    enabled: false,
    imageUrl: '',
    ctaEnabled: true,
    ctaHref: '/register',
    storageKey: 'home-announcement-default',
}

export async function getAnnouncement(): Promise<AnnouncementConfig> {
    const supabase = await createClient()
    const { data } = await supabase
        .from('site_content')
        .select('content')
        .eq('id', 'home_announcement')
        .eq('category', 'announcement')
        .maybeSingle()

    if (!data?.content) return DEFAULT_CONFIG
    try {
        return { ...DEFAULT_CONFIG, ...JSON.parse(data.content) }
    } catch {
        return DEFAULT_CONFIG
    }
}

export async function saveAnnouncement(formData: FormData) {
    const supabase = await createClient()

    const payload: AnnouncementConfig = {
        enabled: formData.get('enabled') === 'on',
        imageUrl: (formData.get('imageUrl') as string) || '',
        ctaEnabled: formData.get('ctaEnabled') === 'on',
        ctaHref: (formData.get('ctaHref') as string) || '/register',
        storageKey: (formData.get('storageKey') as string) || 'home-announcement',
    }

    await supabase
        .from('site_content')
        .upsert({
            id: 'home_announcement',
            category: 'announcement',
            content: JSON.stringify(payload),
        })

    revalidatePath('/')
    revalidatePath('/admin/announcement')
}
