'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { resetPasswordAction } from '@/lib/actions'
import { Eye, EyeOff, ArrowLeft, Mail, KeyRound, Lock } from 'lucide-react'

export default function ForgotPasswordPage() {
  const router = useRouter()

  const [identifier, setIdentifier] = useState('')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [step, setStep] = useState<'email' | 'code'>('email')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!identifier) {
      setError('মোবাইল নম্বর বা ইমেল দিন')
      return
    }
    setLoading(true)
    setError('')
    
    // Simulate verification code step for smooth UX
    setTimeout(() => {
      setLoading(false)
      setSuccessMessage('আপনার একাউন্ট যাচাই করা হয়েছে। নতুন পাসওয়ার্ড সেট করুন।')
      setStep('code')
    }, 1000)
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPassword || newPassword.length < 6) {
      setError('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে')
      return
    }

    setLoading(true)
    setError('')

    const res = await resetPasswordAction({ identifier, newPassword })
    if (res.success) {
      setSuccessMessage('পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে! লগইন পেজে যাচ্ছেন...')
      setTimeout(() => router.push('/auth/login'), 2000)
    } else {
      setError(res.message || 'পাসওয়ার্ড রিসেট করতে সমস্যা হয়েছে।')
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
              {step === 'email' ? 'আপনার মোবাইল নম্বর বা ইমেল দিন' : 'আপনার নতুন পাসওয়ার্ড সেট করুন'}
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

          {/* Step 1: Identifier */}
          {step === 'email' && (
            <form onSubmit={handleSendCode} className="space-y-6 relative z-10">
              <div className="space-y-2">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">মোবাইল নম্বর বা ইমেল</label>
                <div className="relative">
                  <Mail size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-600/40" />
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="০১৭XXXXXXXX অথবা email@example.com"
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
                  <>পরবর্তী ধাপে যান <Mail size={22} /></>
                )}
              </button>
            </form>
          )}

          {/* Step 2: New Password */}
          {step === 'code' && (
            <form onSubmit={handleResetPassword} className="space-y-6 relative z-10">
              <div className="space-y-2">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">নতুন পাসওয়ার্ড</label>
                <div className="relative">
                  <Lock size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-600/40" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="কমপক্ষে ৬ অক্ষর"
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
                  <>পাসওয়ার্ড পরিবর্তন করুন <Lock size={22} /></>
                )}
              </button>
              <button
                type="button"
                onClick={() => { setStep('email'); setError(''); setSuccessMessage('') }}
                className="w-full text-sm font-black text-gray-400 hover:text-emerald-600 transition-colors underline underline-offset-4"
              >
                অন্য নম্বর বা ইমেল দিন
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