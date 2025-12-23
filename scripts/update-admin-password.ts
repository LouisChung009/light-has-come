
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import { getDb } from '../utils/db'
import bcrypt from 'bcryptjs'

async function updateAdminPassword() {
    const sql = getDb()
    
    // 修改這裡的資訊
    const email = 'be463977@gmail.com'
    const newPassword = 'Louis0830'  // 您想要的密碼
    const name = 'Louis0830'

    console.log(`Updating password for: ${email}`)

    // 使用 bcrypt 加密密碼
    const hash = await bcrypt.hash(newPassword, 10)
    console.log(`Generated hash: ${hash}`)

    try {
        await sql`
            UPDATE admin_users 
            SET password_hash = ${hash}
            WHERE email = ${email}
        `
        console.log('Password updated successfully!')
        console.log('')
        console.log('You can now login with:')
        console.log(`  Email: ${email}`)
        console.log(`  Password: ${newPassword}`)
    } catch (err) {
        console.error('Error updating password:', err)
    }
}

updateAdminPassword().catch(console.error)
