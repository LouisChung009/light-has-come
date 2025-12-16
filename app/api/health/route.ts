import { NextResponse } from 'next/server'

/**
 * Health check API to diagnose Vercel environment issues.
 * This endpoint is TEMPORARY and should be removed after debugging.
 */
export async function GET() {
    const diagnostics = {
        timestamp: new Date().toISOString(),
        env: {
            DATABASE_URL: process.env.DATABASE_URL ? '✓ Set' : '✗ MISSING',
            DATABASE_URL_LENGTH: process.env.DATABASE_URL?.length || 0,
            DATABASE_URL_PREFIX: process.env.DATABASE_URL?.substring(0, 15) || 'N/A',
            AUTH_SECRET: process.env.AUTH_SECRET ? '✓ Set' : '⚠ Using default',
            NODE_ENV: process.env.NODE_ENV,
        },
        dbTest: null as any,
    }

    // Try to connect to database
    if (process.env.DATABASE_URL) {
        try {
            const { neon } = await import('@neondatabase/serverless')
            const sql = neon(process.env.DATABASE_URL)
            const result = await sql`SELECT COUNT(*) as count FROM admin_users`
            diagnostics.dbTest = {
                status: '✓ Connected',
                adminUsers: result[0]?.count || 0,
            }
        } catch (error: any) {
            diagnostics.dbTest = {
                status: '✗ Failed',
                error: error.message,
            }
        }
    } else {
        diagnostics.dbTest = {
            status: '✗ Skipped',
            error: 'DATABASE_URL not set',
        }
    }

    return NextResponse.json(diagnostics, { status: 200 })
}
