'use client'

import { useState } from 'react'
import { login } from '@/app/_actions/auth'
import Link from 'next/link'
import { Sword, LogIn, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
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
    <div className="flex-1 flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <Sword className="w-8 h-8 text-[var(--purple)]" />
            <span className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
              LIFE<span className="text-[var(--purple)]">RPG</span>
            </span>
          </Link>
          <h1 className="text-3xl font-bold mt-2">Welcome Back, Hero</h1>
          <p className="text-muted mt-2">Continue your adventure</p>
        </div>

        {/* Form Card */}
        <div className="card p-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-crimson/10 border border-crimson/30 text-crimson text-sm">
              {error}
            </div>
          )}

          <form action={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2 text-muted">
                Email
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
              <label htmlFor="password" className="block text-sm font-medium mb-2 text-muted">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="input pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-[var(--purple)] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Enter the Realm
                </>
              )}
            </button>
          </form>
        </div>

        {/* Sign up link */}
        <p className="text-center mt-6 text-muted text-sm animate-fade-in" style={{ animationDelay: '0.2s' }}>
          New to the adventure?{' '}
          <Link href="/signup" className="text-[var(--purple)] hover:underline font-bold">
            Create Your Character
          </Link>
        </p>
      </div>
    </div>
  )
}
