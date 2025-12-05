'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export type AnnouncementConfig = {
    enabled: boolean
    title: string
    subtitle?: string
    content?: string
    ctaEnabled?: boolean
    ctaLabel?: string
    ctaHref?: string
    storageKey?: string
}

const DEFAULT_CONFIG: AnnouncementConfig = {
    enabled: false,
    title: '',
    subtitle: '',
    content: '',
    ctaEnabled: true,
    ctaLabel: '立即報名',
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
        title: (formData.get('title') as string) || '',
        subtitle: (formData.get('subtitle') as string) || '',
        content: (formData.get('content') as string) || '',
        ctaEnabled: formData.get('ctaEnabled') === 'on',
        ctaLabel: (formData.get('ctaLabel') as string) || '立即報名',
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
