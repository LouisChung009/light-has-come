import { NextResponse } from 'next/server'

/**
 * Lightweight health check for Vercel. Uses a simple `SELECT 1` to verify DB connectivity.
 * For heavier diagnostics (counts), call with `?full=true` which will attempt exact counts.
 * This endpoint is TEMPORARY and should be removed after debugging.
 */
export async function GET(request: Request) {
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

    // Try to connect to database with a lightweight check
    if (process.env.DATABASE_URL) {
        try {
            const { neon } = await import('@neondatabase/serverless')
            const sql = neon(process.env.DATABASE_URL)

            // simple connectivity probe
            await sql`SELECT 1`

            diagnostics.dbTest = {
                status: '✓ Connected',
            }

            // If requested, run a fuller diagnostic (may be slow) using ?full=true
            const url = new URL(request.url)
            if (url.searchParams.get('full') === 'true') {
                try {
                    const result = await sql`SELECT COUNT(*) as count FROM admin_users`
                    diagnostics.dbTest.adminUsers = result[0]?.count || 0
                } catch (err: any) {
                    console.error('Health full-check admin_users failed:', err.stack || err.message || err)
                    diagnostics.dbTest.adminUsers = 'error'
                }
            }
        } catch (error: any) {
            console.error('Health DB error:', error.stack || error.message || error)
            diagnostics.dbTest = {
                status: '✗ Failed',
                error: 'DB connection error (logged)'
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
