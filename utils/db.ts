import { neon } from '@neondatabase/serverless'

// Create a SQL client
export function getDb() {
    let databaseUrl = process.env.DATABASE_URL
    if (!databaseUrl) {
        throw new Error('DATABASE_URL environment variable is not set')
    }

    // Sanitize the URL - remove any accidental quotes and fix HTML entities
    databaseUrl = databaseUrl
        .replace(/^["']|["']$/g, '') // Remove surrounding quotes
        .replace(/&amp;/g, '&')       // Fix HTML-escaped ampersands

    return neon(databaseUrl)
}

// Helper types for database results
export type Album = {
    id: string
    created_at: string
    title: string
    date: string
    description: string | null
    cover_color: string
    cover_photo_url: string | null
    category: string
    is_pinned: boolean
}

export type Photo = {
    id: string
    created_at: string
    album_id: string
    src: string
    width: number
    height: number
    alt: string | null
}

export type Registration = {
    id: string
    created_at: string
    parent_name: string
    phone: string
    email: string | null
    child_nickname: string
    child_age: number
    class_type: string
    contact_time: string | null
    message: string | null
    status: string
}

export type Category = {
    id: string
    label: string
    value: string
    sort_order: number
}

export type SiteContent = {
    id: string
    category: string
    section: string
    label: string
    content: string
    content_type: string
}

export type BannerSlide = {
    id: string
    title: string | null
    subtitle: string | null
    media_url: string
    media_type: string
    link_url: string | null
    display_order: number
    is_active: boolean
}

