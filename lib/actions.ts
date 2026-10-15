'use server'
import { db } from './db'
import { profiles, orders, transactions } from './schema'
import { eq, desc, sql } from 'drizzle-orm'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { hashPassword, comparePassword, createToken, getSession } from './auth'

function normalizePhone(phone: string) {
    if (!phone) return ''
    const banglaDigits: { [key: string]: string } = {
        '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
        '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
    }
    let cleaned = phone.trim().replace(/[০-৯]/g, d => banglaDigits[d] || d).replace(/\s|-/g, '')
    if (cleaned.startsWith('+88')) cleaned = cleaned.replace('+88', '')
    else if (cleaned.startsWith('8801')) cleaned = cleaned.substring(2)
    return cleaned
}

export async function registerAction(formData: { name: string; phone?: string; email?: string; password: string }) {
    try {
        const { name, phone, email, password } = formData

        if (!name || (!phone && !email) || !password) {
            return { success: false, message: 'নাম, পাসওয়ার্ড এবং অন্তত মোবাইল নম্বর অথবা ইমেল দিন' }
        }
        if (typeof password !== 'string' || password.length > 72) {
            return { success: false, message: 'পাসওয়ার্ডটি ৭২ ক্যারেক্টারের নিচে হতে হবে' }
        }
        if (typeof name !== 'string' || name.length > 100) {
            return { success: false, message: 'নামটি ১০০ ক্যারেক্টারের নিচে হতে হবে' }
        }

        if (!process.env.DATABASE_URL) {
            return { success: false, message: 'সার্ভারে DATABASE_URL যুক্ত করা হয়নি!' }
        }

        const formattedPhone = phone && phone.trim() !== '' ? normalizePhone(phone) : null
        const formattedEmail = email && email.trim() !== '' ? email.trim().toLowerCase() : null

        if (formattedPhone) {
            const existingPhone = await db.select().from(profiles).where(eq(profiles.phone, formattedPhone)).limit(1)
            if (existingPhone.length > 0) {
                return { success: false, message: 'এই মোবাইল নম্বরটি ইতিমধ্যে ব্যবহার করা হয়েছে' }
            }
        }

        if (formattedEmail) {
            const existingEmail = await db.select().from(profiles).where(eq(profiles.email, formattedEmail)).limit(1)
            if (existingEmail.length > 0) {
                return { success: false, message: 'এই ইমেলটি ইতিমধ্যে ব্যবহার করা হয়েছে' }
            }
        }

        const hashedPassword = await hashPassword(password)
        
        // টাইপ সেফ ইনসার্ট অবজেক্ট
        const insertData: {
            fullName: string;
            password: string;
            balance: number;
            role: string;
            phone?: string | null;
            email?: string | null;
        } = {
            fullName: name.trim(),
            password: hashedPassword,
            balance: 0,
            role: 'user',
        }

        if (formattedPhone) insertData.phone = formattedPhone
        if (formattedEmail) insertData.email = formattedEmail

        await db.insert(profiles).values(insertData)

        return { success: true }
    } catch (err: any) {
        console.error('Register Action Error:', err)
        return {
            success: false,
            message: 'রেজিস্ট্রেশন করতে সমস্যা হয়েছে (ডাটাবেজ কানেকশন চেক করুন)'
        }
    }
}

export async function loginAction(formData: { identifier: string; password: string }) {
    try {
        const { identifier, password } = formData

        if (!identifier || !password) {
            return { success: false, message: 'মোবাইল নম্বর/ইমেল এবং পাসওয়ার্ড দিন' }
        }
        if (typeof password !== 'string' || password.length > 72) {
            return { success: false, message: 'পাসওয়ার্ড খুব বড়' }
        }

        if (!process.env.DATABASE_URL) {
            return { success: false, message: 'সার্ভারে DATABASE_URL যুক্ত করা হয়নি!' }
        }

        const input = identifier.trim()
        const isEmail = input.includes('@')
        const formattedInput = isEmail ? input.toLowerCase() : normalizePhone(input)

        const user = await db.select().from(profiles)
            .where(sql`${profiles.phone} = ${formattedInput} OR ${profiles.email} = ${formattedInput}`)
            .limit(1)

        if (user.length === 0) {
            return { success: false, message: 'এই নম্বর বা ইমেলে কোনো অ্যাকাউন্ট পাওয়া যায়নি' }
        }

        const isMatch = await comparePassword(password, user[0].password)
        if (!isMatch) {
            return { success: false, message: 'পাসওয়ার্ড ভুল হয়েছে' }
        }

        const token = await createToken({ 
            id: user[0].id, 
            identifier: user[0].phone || user[0].email, 
            role: user[0].role 
        })
        
        const cookieStore = await cookies()
        cookieStore.set('session', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7
        })

        return { success: true }
    } catch (err: any) {
        console.error('Login Action Error:', err)
        return {
            success: false,
            message: 'লগইন করতে সমস্যা হয়েছে (ডাটাবেজ কানেকশন চেক করুন)'
        }
    }
}

export async function logoutAction() {
    const cookieStore = await cookies()
    cookieStore.delete('session')
}

// --- Profile ---
export async function getProfile() {
    const session = await getSession()
    if (!session) return null
    const user = await db.select().from(profiles).where(eq(profiles.id, (session as any).id)).limit(1)
    
    if (user.length === 0) return null
    const { password, ...safeUser } = user[0]
    return safeUser
}

// --- Orders ---
export async function placeOrderAction(service: { id: string, title: string, price: number }, inputData: string) {
    const session = await getSession()
    if (!session) return { success: false, message: 'লগইন করুন' }

    const profile = await db.select().from(profiles).where(eq(profiles.id, (session as any).id)).limit(1)
    if (profile.length === 0 || profile[0].balance < service.price) {
        return { success: false, message: 'পর্যাপ্ত ব্যালেন্স নেই' }
    }

    try {
        await db.update(profiles)
            .set({ balance: sql`${profiles.balance} - ${service.price}` })
            .where(eq(profiles.id, (session as any).id))

        await db.insert(orders).values({
            userId: profile[0].phone || profile[0].email || 'user',
            serviceId: service.id,
            serviceName: service.title,
            price: service.price,
            inputData: inputData,
            status: 'pending',
            notes: '',
        })

        revalidatePath('/dashboard')
        return { success: true }
    } catch (err) {
        console.error(err)
        return { success: false, message: 'অর্ডার করতে সমস্যা হয়েছে' }
    }
}

export async function getOrdersAction() {
    const session = await getSession()
    if (!session) return []
    const profile = await db.select().from(profiles).where(eq(profiles.id, (session as any).id)).limit(1)
    if (profile.length === 0) return []

    const identifier = profile[0].phone || profile[0].email || ''

    return await db.select().from(orders)
        .where(eq(orders.userId, identifier))
        .orderBy(desc(orders.createdAt))
}

// --- Balance ---
export async function addBalanceAction(amount: number, trxId: string, method: string, description: string) {
    const session = await getSession()
    if (!session) return { success: false, message: 'লগইন করুন' }

    const profile = await db.select().from(profiles).where(eq(profiles.id, (session as any).id)).limit(1)
    if (profile.length === 0) return { success: false, message: 'ইউজার পাওয়া যায়নি' }

    const identifier = profile[0].phone || profile[0].email || ''
    const userId = profile[0].id

    try {
        await db.insert(transactions).values({
            userId: identifier,
            amount,
            method,
            trxId,
            description,
            status: 'approved',
        })

        await db.update(profiles)
            .set({ balance: sql`${profiles.balance} + ${amount}` })
            .where(eq(profiles.id, userId))

        revalidatePath('/dashboard')
        revalidatePath('/admin')
        return { success: true, message: 'ব্যালেন্স সফলভাবে যোগ হয়েছে' }
    } catch (err: any) {
        console.error('addBalanceAction error:', err)
        if (err?.message?.includes('unique') || err?.code === '23505') {
            return { success: false, message: 'এই TrxID টি আগে ব্যবহার হয়েছে' }
        }
        return { success: false, message: 'ব্যালেন্স যোগ করতে সমস্যা হয়েছে' }
    }
}

// --- Admin ---
export async function getAdminStats() {
    const session = await getSession()
    if (!session || (session as any).role !== 'admin') return null

    const allTransactions = await db.select().from(transactions).orderBy(desc(transactions.createdAt))
    const allOrders = await db.select().from(orders).orderBy(desc(orders.createdAt))
    const allUsers = await db.select().from(profiles).orderBy(desc(profiles.createdAt))

    return { transactions: allTransactions, orders: allOrders, users: allUsers }
}

export async function approveTransactionAction(id: number) {
    const session = await getSession()
    if (!session || (session as any).role !== 'admin') return { success: false }

    try {
        const txn = await db.select().from(transactions).where(eq(transactions.id, id)).limit(1)
        if (txn.length === 0) return { success: false, message: 'Transaction not found' }
        if (txn[0].status !== 'pending') return { success: false, message: 'Already processed' }

        const amount = Number(txn[0].amount)
        const userIdentifier = txn[0].userId as string

        await db.update(transactions)
            .set({ status: 'approved' })
            .where(eq(transactions.id, id))

        await db.update(profiles)
            .set({ balance: sql`${profiles.balance} + ${amount}` })
            .where(sql`${profiles.phone} = ${userIdentifier} OR ${profiles.email} = ${userIdentifier}`)

        revalidatePath('/dashboard')
        revalidatePath('/admin')
        return { success: true }
    } catch (err: any) {
        console.error('Approval error:', err)
        return { success: false, message: err.message }
    }
}

export async function rejectTransactionAction(id: number) {
    const session = await getSession()
    if (!session || (session as any).role !== 'admin') return { success: false }
    await db.update(transactions).set({ status: 'rejected' }).where(eq(transactions.id, id))
    revalidatePath('/admin')
    return { success: true }
}

// --- Withdraw ---
export async function withdrawBalanceAction(amount: number, method: string, receiverNumber: string) {
    const session = await getSession()
    if (!session) return { success: false, message: 'লগইন করুন' }

    const profile = await db.select().from(profiles).where(eq(profiles.id, (session as any).id)).limit(1)
    if (profile.length === 0 || profile[0].balance < amount) {
        return { success: false, message: 'পর্যাপ্ত ব্যালেন্স নেই' }
    }

    const identifier = profile[0].phone || profile[0].email || ''
    const userId = profile[0].id

    try {
        await db.update(profiles)
            .set({ balance: sql`${profiles.balance} - ${amount}` })
            .where(eq(profiles.id, userId))

        await db.insert(transactions).values({
            userId: identifier,
            amount,
            method,
            trxId: `WD-${Date.now()}-${userId}`,
            description: `Withdraw: ${method}, Receiver: ${receiverNumber}`,
            status: 'pending',
        })

        revalidatePath('/dashboard')
        revalidatePath('/admin')
        return { success: true }
    } catch (err: any) {
        console.error('withdrawBalanceAction error:', err)
        return { success: false, message: 'উইথড্র করতে সমস্যা হয়েছে' }
    }
}

export async function updateOrderAction(id: number, status: string, notes: string) {
    const session = await getSession()
    if (!session || (session as any).role !== 'admin') return { success: false }

    await db.update(orders)
        .set({ status, notes })
        .where(eq(orders.id, id))

    revalidatePath('/admin')
    revalidatePath('/dashboard')
    return { success: true }
}

export async function resetPasswordAction(formData: { identifier: string; newPassword: string }) {
    try {
        const { identifier, newPassword } = formData
        if (!identifier || !newPassword) {
            return { success: false, message: 'তথ্যগুলো সঠিকভাবে পূরণ করুন' }
        }
        const input = identifier.trim()
        const isEmail = input.includes('@')
        const formattedInput = isEmail ? input.toLowerCase() : normalizePhone(input)

        const user = await db.select().from(profiles)
            .where(sql`${profiles.phone} = ${formattedInput} OR ${profiles.email} = ${formattedInput}`)
            .limit(1)

        if (user.length === 0) {
            return { success: false, message: 'এই নম্বর বা ইমেলে কোনো অ্যাকাউন্ট পাওয়া যায়নি' }
        }

        const hashedPassword = await hashPassword(newPassword)
        await db.update(profiles)
            .set({ password: hashedPassword })
            .where(eq(profiles.id, user[0].id))

        return { success: true, message: 'পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!' }
    } catch (err) {
        console.error('Reset Password Error:', err)
        return { success: false, message: 'পাসওয়ার্ড পরিবর্তন করতে সমস্যা হয়েছে' }
    }
}