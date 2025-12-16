import { neon } from '@neondatabase/serverless'

// Create a SQL client
export function getDb() {
    const databaseUrl = process.env.DATABASE_URL
    if (!databaseUrl) {
        throw new Error('DATABASE_URL environment variable is not set')
    }
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
