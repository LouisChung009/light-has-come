/**
 * Edge-compatible authentication utilities.
 * This file ONLY uses jose (Edge-compatible) and NO Node.js-specific modules.
 * Use this in middleware.ts and other Edge Runtime contexts.
 */

import { SignJWT, jwtVerify } from 'jose'

const SECRET_KEY = process.env.AUTH_SECRET || 'default-secret-key-change-me'
const key = new TextEncoder().encode(SECRET_KEY)

export async function encrypt(payload: any) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(key)
}

export async function decrypt(input: string): Promise<any> {
    try {
        const { payload } = await jwtVerify(input, key, {
            algorithms: ['HS256'],
        })
        return payload
    } catch {
        return null
    }
}
