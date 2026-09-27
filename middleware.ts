// middleware.ts (প্রথম ১০ লাইন এভাবে দিন, বাকি কোড একই থাকবে)
import { NextResponse, NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET_KEY = process.env.JWT_SECRET || 'shohoj-seba-eb6b4703-eb59-456b-8bd5-b3225bf23148-secure-key'
const SECRET = new TextEncoder().encode(JWT_SECRET_KEY)

export async function middleware(request: NextRequest) {
    const session = request.cookies.get('session')?.value

    const isDashboard = request.nextUrl.pathname.startsWith('/dashboard')
    const isAdmin = request.nextUrl.pathname.startsWith('/admin')
    const isAuth = request.nextUrl.pathname.startsWith('/auth')

    let payload = null;
    if (session) {
        try {
            const verified = await jwtVerify(session, SECRET)
            payload = verified.payload
        } catch (err) {
            // Invalid token (e.g. secret changed or expired)
        }
    }

    if (isDashboard || isAdmin) {
        if (!payload) {
            const res = NextResponse.redirect(new URL('/auth/login', request.url))
            res.cookies.delete('session')
            return res
        }
        
        if (isAdmin && (payload as any).role !== 'admin') {
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }
    }

    if (isAuth && payload) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    if (isAuth && session && !payload) {
        const res = NextResponse.next()
        res.cookies.delete('session')
        return res
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/dashboard/:path*', '/admin/:path*', '/auth/:path*'],
}