'use client'

import { useState } from 'react'
import { forgotPassword } from '@/app/_actions/auth'
import Link from 'next/link'
import { Mail, ArrowLeft, Sparkles, Send, CheckCircle } from 'lucide-react'
import FloatingParticles from '@/app/_components/ui/FloatingParticles'

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    setSuccess(null)
    const result = await forgotPassword(formData)
    if (result?.error) {
      setError(result.error)
    } else if (result?.success) {
      setSuccess(result.message || 'Check your email for a reset link!')
    }
    setLoading(false)
  }

  return (
    <div className="flex-1 flex items-center justify-center px-6 py-16 relative overflow-hidden bg-[var(--bg-primary)] min-h-[calc(100vh-80px)]">
      <FloatingParticles count={10} />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-5 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[var(--purple)] to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight text-white">
              Life<span className="text-[var(--cyan)]">RPG</span>
            </span>
          </Link>
          <h1 className="text-3xl sm:text-4xl font-black text-white mt-1">Reset Your Password</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-2">
            Enter your email and we&apos;ll send you a magic recovery scroll
          </p>
        </div>

        {/* Form Card */}
        <div className="glass-card p-7 sm:p-8 rounded-3xl border border-purple-500/25 shadow-2xl animate-fade-in relative">
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {success ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-emerald-400" />
              </div>
              <div>
                <p className="text-white font-bold text-lg">Scroll Sent!</p>
                <p className="text-[var(--text-secondary)] text-sm mt-1.5">
                  {success}
                </p>
              </div>
              <p className="text-xs text-[var(--text-muted)]">
                Didn&apos;t receive it? Check your spam folder or wait a minute and try again.
              </p>
            </div>
          ) : (
            <form action={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider mb-2 text-[var(--text-secondary)]">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="input pl-11"
                    placeholder="hero@adventure.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold shadow-lg shadow-purple-600/30 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Recovery Scroll</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Back to login */}
        <p className="text-center mt-6 text-[var(--text-secondary)] text-sm animate-fade-in">
          <Link href="/login" className="text-[var(--cyan)] hover:underline font-bold inline-flex items-center gap-1.5">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  )
}
