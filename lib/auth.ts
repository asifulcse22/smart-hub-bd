// lib/auth.ts
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'

const JWT_SECRET_KEY = process.env.JWT_SECRET || 'shohoj-seba-eb6b4703-eb59-456b-8bd5-b3225bf23148-secure-key'
const SECRET = new TextEncoder().encode(JWT_SECRET_KEY)

export async function hashPassword(password: string) {
    return await bcrypt.hash(password, 10)
}

export async function comparePassword(password: string, hash: string) {
    return await bcrypt.compare(password, hash)
}

export async function createToken(payload: any) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(SECRET)
}

export async function verifyToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, SECRET)
        return payload
    } catch (err) {
        return null
    }
}

export async function getSession() {
    const cookieStore = await cookies()
    const token = cookieStore.get('session')?.value
    if (!token) return null
    return await verifyToken(token)
}