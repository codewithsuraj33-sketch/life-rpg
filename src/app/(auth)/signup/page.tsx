'use client'

import { useState } from 'react'
import { signup } from '@/app/_actions/auth'
import Link from 'next/link'
import { Sword, UserPlus, Eye, EyeOff } from 'lucide-react'

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null)
  const [infoMessage, setInfoMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    setInfoMessage(null)
    const result = await signup(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else if (result?.message) {
      setInfoMessage(result.message)
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <Sword className="w-8 h-8 text-gold" />
            <span className="text-2xl font-bold tracking-tight">
              Life<span className="text-gold">RPG</span>
            </span>
          </Link>
          <h1 className="text-3xl font-bold mt-2">Create Your Character</h1>
          <p className="text-muted mt-2">Begin your epic adventure</p>
        </div>

        {/* Form Card */}
        <div className="card p-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-crimson/10 border border-crimson/30 text-crimson text-sm">
              {error}
            </div>
          )}
          {infoMessage && (
            <div className="mb-4 p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm">
              {infoMessage}
            </div>
          )}

          <form action={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-2 text-muted">
                Character Name
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                minLength={3}
                maxLength={20}
                className="input"
                placeholder="ShadowKnight42"
              />
            </div>

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
                  minLength={6}
                  className="input pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-gold transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-dim mt-1">At least 6 characters</p>
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
                  <UserPlus className="w-4 h-4" />
                  Start Adventure
                </>
              )}
            </button>
          </form>
        </div>

        {/* Login link */}
        <p className="text-center mt-6 text-muted text-sm animate-fade-in" style={{ animationDelay: '0.2s' }}>
          Already an adventurer?{' '}
          <Link href="/login" className="text-gold hover:underline font-medium">
            Log In
          </Link>
        </p>
      </div>
    </div>
  )
}
