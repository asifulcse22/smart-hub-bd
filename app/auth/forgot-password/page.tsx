'use client'

import { useState } from 'react'
import { useSignIn } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, ArrowLeft, Mail, KeyRound, Lock } from 'lucide-react'

export default function ForgotPasswordPage() {
  const { signIn, isLoaded } = useSignIn()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [step, setStep] = useState<'email' | 'code'>('email')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoaded) return
    setLoading(true)
    setError('')
    try {
      await signIn.create({
        strategy: 'reset_password_email_code',
        identifier: email,
      })
      setSuccessMessage('আপনার ইমেইলে একটি কোড পাঠানো হয়েছে।')
      setStep('code')
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'কোড পাঠাতে সমস্যা হয়েছে।')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoaded) return
    setLoading(true)
    setError('')
    try {
      const result = await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code,
        password: newPassword,
      })
      if (result.status === 'complete') {
        setSuccessMessage('পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে! লগইন পেজে যাচ্ছেন...')
        setTimeout(() => router.push('/auth/login'), 2000)
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'পাসওয়ার্ড রিসেট করতে সমস্যা হয়েছে।')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f6fdf9] flex flex-col items-center justify-center p-4 py-12 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-emerald-100/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-amber-50/30 blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-lg">
        <Link href="/auth/login" className="inline-flex items-center gap-2 text-emerald-800 hover:text-emerald-600 transition-colors mb-8 font-black text-sm">
          <ArrowLeft size={18} /> লগইন পেজে ফিরে যান
        </Link>

        <div className="bg-white rounded-[3.5rem] p-10 md:p-14 shadow-2xl shadow-emerald-900/10 border border-emerald-50 relative overflow-hidden">
          <div className="mb-12 text-center relative z-10">
            <h1 className="text-4xl font-black text-[#022c22] mb-3">পাসওয়ার্ড রিসেট</h1>
            <p className="text-gray-500 font-bold text-sm">
              {step === 'email' ? 'আপনার ইমেইলে একটি কোড পাঠানো হবে' : 'ইমেইলে পাওয়া কোড ও নতুন পাসওয়ার্ড দিন'}
            </p>
          </div>

          {error && (
            <div className="bg-rose-50 border-2 border-rose-100 text-rose-600 p-5 rounded-2xl font-black text-sm flex items-center gap-3 mb-6">
              <span>⚠️</span> {error}
            </div>
          )}

          {successMessage && (
            <div className="bg-emerald-50 border-2 border-emerald-100 text-emerald-700 p-5 rounded-2xl font-black text-sm flex items-center gap-3 mb-6">
              <span>✅</span> {successMessage}
            </div>
          )}

          {/* Step 1: Email */}
          {step === 'email' && (
            <form onSubmit={handleSendEmail} className="space-y-6 relative z-10">
              <div className="space-y-2">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">আপনার ইমেইল</label>
                <div className="relative">
                  <Mail size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-600/40" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@email.com"
                    className="w-full pl-14 pr-6 py-5 rounded-[1.5rem] border-2 border-emerald-50 bg-gray-50 focus:bg-white focus:border-emerald-500 outline-none transition-all font-black text-sm"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-[2rem] font-black text-xl shadow-2xl shadow-emerald-900/20 transition-all flex items-center justify-center gap-4"
              >
                {loading ? (
                  <div className="w-7 h-7 border-4 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>কোড পাঠান <Mail size={22} /></>
                )}
              </button>
            </form>
          )}

          {/* Step 2: Code + New Password */}
          {step === 'code' && (
            <form onSubmit={handleResetPassword} className="space-y-6 relative z-10">
              <div className="space-y-2">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">ইমেইলে পাওয়া কোড</label>
                <div className="relative">
                  <KeyRound size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-600/40" />
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="6 সংখ্যার কোড"
                    className="w-full pl-14 pr-6 py-5 rounded-[1.5rem] border-2 border-emerald-50 bg-gray-50 focus:bg-white focus:border-emerald-500 outline-none transition-all font-black text-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">নতুন পাসওয়ার্ড</label>
                <div className="relative">
                  <Lock size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-600/40" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="কমপক্ষে ৮ অক্ষর"
                    className="w-full pl-14 pr-14 py-5 rounded-[1.5rem] border-2 border-emerald-50 bg-gray-50 focus:bg-white focus:border-emerald-500 outline-none transition-all font-black text-sm"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-emerald-400 hover:text-emerald-600 transition-colors">
                    {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-[2rem] font-black text-xl shadow-2xl shadow-emerald-900/20 transition-all flex items-center justify-center gap-4"
              >
                {loading ? (
                  <div className="w-7 h-7 border-4 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>পাসওয়ার্ড রিসেট করুন <Lock size={22} /></>
                )}
              </button>
              <button
                type="button"
                onClick={() => { setStep('email'); setError(''); setSuccessMessage('') }}
                className="w-full text-sm font-black text-gray-400 hover:text-emerald-600 transition-colors underline underline-offset-4"
              >
                আবার ইমেইল দিন
              </button>
            </form>
          )}

          <p className="text-center text-sm text-gray-500 font-bold mt-8">
            মনে পড়ে গেছে?{' '}
            <Link href="/auth/login" className="text-emerald-600 hover:text-emerald-700 underline underline-offset-4">লগইন করুন</Link>
          </p>
        </div>
      </div>
    </div>
  )
}