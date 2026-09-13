'use client'

import { useState, useEffect } from 'react'
import { sendPhoneOtp, verifyPhoneOtp } from '@/app/_actions/auth'
import { ArrowRight, RotateCcw, AlertCircle, ShieldCheck } from 'lucide-react'
import { cn } from '@/app/_lib/utils'

export default function PhoneAuthForm() {
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [phone, setPhone] = useState('')
  const [countryCode, setCountryCode] = useState('+91')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(0)

  // Countdown timer for resending OTP
  useEffect(() => {
    if (countdown <= 0) return
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    return () => clearTimeout(timer)
  }, [countdown])

  const fullPhoneNumber = `${countryCode}${phone.replace(/^0+/, '')}`

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault()
    if (!phone || phone.trim().length < 7) {
      setError('Please enter a valid mobile number')
      return
    }

    setLoading(true)
    setError(null)

    const res = await sendPhoneOtp(fullPhoneNumber)
    setLoading(false)

    if (res?.error) {
      setError(res.error)
    } else {
      setStep('otp')
      setCountdown(30)
      setError(null)
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault()
    if (!otp || otp.trim().length < 4) {
      setError('Please enter the 6-digit OTP code')
      return
    }

    setLoading(true)
    setError(null)

    const res = await verifyPhoneOtp(fullPhoneNumber, otp)
    if (res?.error) {
      setError(res.error)
      setLoading(false)
    }
  }

  async function handleResendOtp() {
    if (countdown > 0) return
    setLoading(true)
    setError(null)

    const res = await sendPhoneOtp(fullPhoneNumber)
    setLoading(false)

    if (res?.error) {
      setError(res.error)
    } else {
      setCountdown(30)
    }
  }

  return (
    <div className="w-full space-y-4">
      {error && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-start gap-2 animate-fade-in">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span className="leading-tight">{error}</span>
        </div>
      )}

      {step === 'phone' ? (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div>
            <label htmlFor="phone-input" className="block text-xs font-bold uppercase tracking-wider mb-2 text-[var(--text-secondary)]">
              Mobile Number
            </label>
            <div className="flex gap-2 items-center">
              {/* Country code selector */}
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="w-[84px] sm:w-24 px-2 py-3 rounded-xl bg-[var(--bg-secondary)] border border-purple-500/30 text-xs font-bold text-white focus:outline-none focus:border-[var(--cyan)] shrink-0 cursor-pointer"
              >
                <option value="+91">🇮🇳 +91</option>
                <option value="+1">🇺🇸 +1</option>
                <option value="+44">🇬🇧 +44</option>
                <option value="+971">🇦🇪 +971</option>
                <option value="+61">🇦🇺 +61</option>
                <option value="+65">🇸🇬 +65</option>
                <option value="+81">🇯🇵 +81</option>
                <option value="+49">🇩🇪 +49</option>
              </select>

              {/* Phone input - clean padding, no icon overlap */}
              <input
                id="phone-input"
                type="tel"
                inputMode="numeric"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                placeholder="98765 43210"
                className="input flex-1 min-w-0 px-3.5 tracking-wider font-mono text-sm"
                maxLength={15}
              />
            </div>
            <p className="text-[11px] text-[var(--text-muted)] mt-2">
              We&apos;ll dispatch a one-time OTP to log you directly into your realm.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || phone.length < 7}
            className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold shadow-lg shadow-purple-600/30 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Send Magic OTP</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-4 animate-fade-in">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="otp-input" className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                Enter 6-Digit OTP
              </label>
              <button
                type="button"
                onClick={() => setStep('phone')}
                className="text-[11px] font-bold text-[var(--cyan)] hover:underline cursor-pointer"
              >
                Change Number
              </button>
            </div>

            <div className="p-2.5 rounded-xl bg-purple-900/20 border border-purple-500/20 mb-3 flex items-center justify-between">
              <span className="text-xs text-purple-200 font-mono truncate mr-2">
                Sent to: <strong className="text-white">{fullPhoneNumber}</strong>
              </span>
              <ShieldCheck className="w-4 h-4 text-[var(--cyan)] shrink-0" />
            </div>

            {/* Symmetrically centered OTP box without icon collision */}
            <input
              id="otp-input"
              type="text"
              inputMode="numeric"
              required
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="• • • • • •"
              className="input w-full px-4 text-center tracking-[0.35em] sm:tracking-[0.5em] font-mono text-xl font-black text-white"
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={loading || otp.length < 4}
            className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold shadow-lg shadow-purple-600/30 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Verify & Enter Realm</span>
              </>
            )}
          </button>

          {/* Resend button */}
          <div className="text-center pt-1">
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={countdown > 0 || loading}
              className={cn(
                'text-xs font-semibold inline-flex items-center gap-1.5 transition-colors',
                countdown > 0
                  ? 'text-[var(--text-muted)] cursor-not-allowed'
                  : 'text-purple-400 hover:text-[var(--cyan)] cursor-pointer'
              )}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              {countdown > 0 ? (
                <span>Resend OTP in {countdown}s</span>
              ) : (
                <span>Didn&apos;t receive code? Resend OTP</span>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
