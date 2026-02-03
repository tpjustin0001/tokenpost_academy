
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// Load environment variables manually
const envPath = path.resolve(process.cwd(), '.env.local')
const envContent = fs.readFileSync(envPath, 'utf-8')
const envVars = envContent.split('\n').reduce((acc, line) => {
    const [key, value] = line.split('=')
    if (key && value) {
        acc[key.trim()] = value.trim()
    }
    return acc
}, {} as Record<string, string>)

const supabaseUrl = envVars['NEXT_PUBLIC_SUPABASE_URL'] || process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = envVars['SUPABASE_SERVICE_ROLE_KEY'] || process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase Environment Variables')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkTables() {
    const tables = ['user_points', 'point_transactions', 'quizzes', 'quiz_questions', 'quiz_attempts']
    const results: Record<string, boolean> = {}

    console.log('Checking tables...')

    for (const table of tables) {
        const { error } = await supabase.from(table).select('id').limit(1)
        if (error) {
            // If error code is '42P01' (undefined_table) or similar, it doesn't exist.
            // Supabase-js might return specific error details.
            if (error.code === '42P01' || error.message.includes('relation') && error.message.includes('does not exist')) {
                results[table] = false
            } else {
                // Some other error (e.g. permission), but table likely exists if RLS triggers or other DB error.
                // Actually, RLS shouldn't trigger for Service Role.
                console.log(`Error checking ${table}:`, error.message)
                results[table] = false // Assume false on error for safety
            }
        } else {
            results[table] = true
        }
    }

    console.table(results)

    const allExist = Object.values(results).every(v => v)
    if (allExist) {
        console.log('✅ All tables exist.')
    } else {
        console.log('❌ Some tables are missing.')
    }
}

checkTables()
