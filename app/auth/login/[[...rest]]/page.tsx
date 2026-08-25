'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { loginAction } from '@/lib/actions'
import { Eye, EyeOff, LogIn, Lock, ArrowLeft, Phone } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    phone: '',
    password: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await loginAction(form)
    if (res.success) {
      router.push('/dashboard')
    } else {
      setError(res.message || 'লগইন করতে সমস্যা হয়েছে')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f6fdf9] flex flex-col items-center justify-center p-4 py-12 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-emerald-100/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-amber-50/30 blur-3xl pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-lg">
        <Link href="/" className="inline-flex items-center gap-2 text-emerald-800 hover:text-emerald-600 transition-colors mb-8 font-black text-sm">
          <ArrowLeft size={18} /> হোমপেজে ফিরে যান
        </Link>

        <div className="bg-white rounded-[3.5rem] p-10 md:p-14 shadow-2xl shadow-emerald-900/10 border border-emerald-50 relative overflow-hidden">
          <div className="mb-12 text-center relative z-10">
            <h1 className="text-4xl font-black text-[#022c22] mb-3">লগইন</h1>
            <p className="text-gray-500 font-bold text-sm">মোবাইল নম্বর দিয়ে আপনার একাউন্টে প্রবেশ করুন</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="space-y-2">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">মোবাইল নম্বর</label>
              <div className="relative">
                <Phone size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-600/40" />
                <input type="text" name="phone" value={form.phone} onChange={handleChange} placeholder="০১৭XXXXXXXX" className="w-full pl-14 pr-6 py-5 rounded-[1.5rem] border-2 border-emerald-50 bg-gray-50 focus:bg-white focus:border-emerald-500 outline-none transition-all font-black text-sm" required />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">পাসওয়ার্ড</label>
              <div className="relative">
                <Lock size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-600/40" />
                <input type={showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} placeholder="আপনার পাসওয়ার্ড" className="w-full pl-14 pr-14 py-5 rounded-[1.5rem] border-2 border-emerald-50 bg-gray-50 focus:bg-white focus:border-emerald-500 outline-none transition-all font-black text-sm" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-emerald-400 hover:text-emerald-600 transition-colors">
                  {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
              </div>
              {/* পাসওয়ার্ড ভুলে গেছেন লিংক */}
              <div className="flex justify-end mt-1">
                <Link href="/auth/forgot-password" className="text-xs font-black text-emerald-600 hover:text-emerald-700 underline underline-offset-4">
                  পাসওয়ার্ড ভুলে গেছেন?
                </Link>
              </div>
            </div>

            {error && (
              <div className="bg-rose-50 border-2 border-rose-100 text-rose-600 p-5 rounded-2xl font-black text-sm animate-shake flex items-center gap-3">
                <span>⚠️</span> {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="w-full py-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-[2rem] font-black text-xl shadow-2xl shadow-emerald-900/20 transition-all flex items-center justify-center gap-4 group">
              {loading ? (
                <div className="w-7 h-7 border-4 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>লগইন করুন <LogIn className="group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>

            <p className="text-center text-sm text-gray-500 font-bold mt-8">
              অ্যাকাউন্ট নেই?{' '}
              <Link href="/auth/register" className="text-emerald-600 hover:text-emerald-700 underline underline-offset-4">নতুন অ্যাকাউন্ট খুলুন</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}