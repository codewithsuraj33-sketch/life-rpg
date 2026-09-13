'use client'

import { useState } from 'react'
import { login } from '@/app/_actions/auth'
import Link from 'next/link'
import { LogIn, Eye, EyeOff, Sparkles, ArrowRight, Mail, Phone } from 'lucide-react'
import FloatingParticles from '@/app/_components/ui/FloatingParticles'
import GoogleSignInButton from '@/app/_components/auth/GoogleSignInButton'
import PhoneAuthForm from '@/app/_components/auth/PhoneAuthForm'
import { cn } from '@/app/_lib/utils'

export default function LoginPage() {
  const [authMode, setAuthMode] = useState<'email' | 'phone'>('email')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const result = await login(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center px-6 py-16 relative overflow-hidden bg-[var(--bg-primary)] min-h-[calc(100vh-80px)]">
      {/* Ambient background particles */}
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
          <h1 className="text-3xl sm:text-4xl font-black text-white mt-1">Welcome Back, Hero</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-2">
            Enter your credentials to resume your journey
          </p>
        </div>

        {/* Form Card */}
        <div className="glass-card p-7 sm:p-8 rounded-3xl border border-purple-500/25 shadow-2xl animate-fade-in relative">
          {/* Quick Google Sign In */}
          <div className="mb-5">
            <GoogleSignInButton text="Sign in with Google" />
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center mb-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-purple-500/20" />
            </div>
            <span className="relative px-3 text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] bg-[var(--bg-card)] rounded-full">
              or continue with
            </span>
          </div>

          {/* Auth Method Selector Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-black/40 border border-purple-500/20 mb-5">
            <button
              type="button"
              onClick={() => {
                setAuthMode('email')
                setError(null)
              }}
              className={cn(
                'flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer select-none active:scale-95',
                authMode === 'email'
                  ? 'bg-purple-600/30 text-white border border-purple-500/40 shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-white'
              )}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthMode('phone')
                setError(null)
              }}
              className={cn(
                'flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer select-none active:scale-95',
                authMode === 'phone'
                  ? 'bg-purple-600/30 text-white border border-purple-500/40 shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-white'
              )}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Mobile OTP</span>
            </button>
          </div>

          {/* Tab 1: Email Form */}
          {authMode === 'email' ? (
            <div>
              {error && (
                <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              <form action={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider mb-2 text-[var(--text-secondary)]">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="input"
                    placeholder="hero@adventure.com"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                      Password
                    </label>
                    <Link href="/forgot-password" className="text-[10px] font-bold text-purple-400 hover:text-[var(--cyan)] transition-colors">
                      Forgot Password?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      className="input pr-11"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-white transition-colors"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold shadow-lg shadow-purple-600/30 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-2 cursor-pointer"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>Enter the Realm</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            /* Tab 2: Phone OTP Form */
            <PhoneAuthForm />
          )}
        </div>

        {/* Sign up link */}
        <p className="text-center mt-6 text-[var(--text-secondary)] text-sm animate-fade-in">
          New to the adventure?{' '}
          <Link href="/signup" className="text-[var(--cyan)] hover:underline font-bold ml-1">
            Create Your Character →
          </Link>
        </p>
      </div>
    </div>
  )
}
