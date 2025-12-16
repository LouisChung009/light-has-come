import { NextResponse, type NextRequest } from 'next/server'
import { decrypt } from './utils/auth-neon'

export async function middleware(request: NextRequest) {
    const session = request.cookies.get('session')?.value
    let isAuthenticated = false

    if (session) {
        const payload = await decrypt(session)
        if (payload?.user) {
            isAuthenticated = true
        }
    }

    // Protect admin routes
    if (request.nextUrl.pathname.startsWith('/admin') && request.nextUrl.pathname !== '/admin') {
        if (!isAuthenticated) {
            const url = request.nextUrl.clone()
            url.pathname = '/admin'
            return NextResponse.redirect(url)
        }
    }

    // Redirect logged-in users away from login page
    if (request.nextUrl.pathname === '/admin' && isAuthenticated) {
        const url = request.nextUrl.clone()
        url.pathname = '/admin/dashboard'
        return NextResponse.redirect(url)
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
