
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkStatus() {
    console.log('Checking Supabase connection...')
    console.log(`URL: ${supabaseUrl}`)

    try {
        const { data, error } = await supabase.from('site_content').select('count').limit(1)

        if (error) {
            console.error('Error connecting to Supabase:', error.message)
            if (error.message.includes('Project not found') || error.message.includes('upstream')) {
                console.log('POSSIBLE CAUSE: Project paused or deleted.')
            }
        } else {
            console.log('✅ Connection successful!')
            console.log('Data sample:', data)
        }
    } catch (err: any) {
        console.error('Unexpected error:', err.message)
    }
}

checkStatus()
