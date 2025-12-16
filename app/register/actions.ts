'use server'

import { getDb } from '@/utils/db'

export async function submitRegistration(formData: {
    parentName: string
    phone: string
    email: string
    childNickname: string
    childAge: number
    classType: string
    contactTime: string
    message: string
}) {
    const sql = getDb()

    try {
        await sql`
            INSERT INTO registrations (
                parent_name, 
                phone, 
                email, 
                child_nickname, 
                child_age, 
                class_type, 
                contact_time, 
                message, 
                status
            )
            VALUES (
                ${formData.parentName},
                ${formData.phone},
                ${formData.email},
                ${formData.childNickname},
                ${formData.childAge},
                ${formData.classType},
                ${formData.contactTime},
                ${formData.message},
                'pending'
            )
        `
        return { success: true }
    } catch (error) {
        console.error('Registration submission error:', error)
        return { error: '報名失敗，請稍後再試' }
    }
}
