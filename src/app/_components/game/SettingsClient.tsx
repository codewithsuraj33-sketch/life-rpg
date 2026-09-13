'use client'

import { useState } from 'react'
import { updateProfile } from '@/app/_actions/profile'
import { updateEmail, updatePassword, signOut } from '@/app/_actions/auth'
import {
  Settings,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  Shield,
  Save,
  CheckCircle2,
  AlertCircle,
  LogOut,
  KeyRound,
  Copy,
  Check,
} from 'lucide-react'
import { cn } from '@/app/_lib/utils'

interface Profile {
  id: string
  username: string
  avatar_url: string
  level: number
  title: string
  class_type?: string
}

const AVATAR_OPTIONS = [
  '🧙‍♂️', '⚔️', '🏹', '🛡️', '🧝', '🥷', '🐲', '👑', '⚡', '🔥', '🔮', '🐺'
]

export default function SettingsClient({
  profile,
  email,
}: {
  profile: Profile
  email: string
}) {
  // Profile state
  const [username, setUsername] = useState(profile.username)
  const [avatar, setAvatar] = useState(profile.avatar_url || '🧙‍♂️')
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileStatus, setProfileStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)

  // Email state
  const [newEmail, setNewEmail] = useState('')
  const [emailSaving, setEmailSaving] = useState(false)
  const [emailStatus, setEmailStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)

  // Password state
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [passwordStatus, setPasswordStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)

  // Copy state
  const [copiedId, setCopiedId] = useState(false)

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, text: '', color: '' }
    let score = 0
    if (pass.length >= 6) score += 1
    if (pass.length >= 10) score += 1
    if (/[A-Z]/.test(pass)) score += 1
    if (/[0-9]/.test(pass)) score += 1
    if (/[^A-Za-z0-9]/.test(pass)) score += 1

    if (score <= 2) return { score: 33, text: 'Weak', color: 'bg-rose-500 text-rose-400' }
    if (score <= 3) return { score: 66, text: 'Medium', color: 'bg-amber-500 text-amber-400' }
    return { score: 100, text: 'Strong', color: 'bg-emerald-500 text-emerald-400' }
  }

  const passwordStrength = getPasswordStrength(newPassword)

  // Handle Profile Update
  async function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault()
    setProfileSaving(true)
    setProfileStatus(null)

    const formData = new FormData()
    formData.append('username', username)
    formData.append('avatar_url', avatar)

    const res = await updateProfile(formData)
    setProfileSaving(false)

    if (res?.error) {
      setProfileStatus({ type: 'error', msg: res.error })
    } else {
      setProfileStatus({ type: 'success', msg: 'Profile updated successfully!' })
      setTimeout(() => setProfileStatus(null), 4000)
    }
  }

  // Handle Email Update
  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!newEmail) return
    setEmailSaving(true)
    setEmailStatus(null)

    const formData = new FormData()
    formData.append('newEmail', newEmail)

    const res = await updateEmail(formData)
    setEmailSaving(false)

    if (res?.error) {
      setEmailStatus({ type: 'error', msg: res.error })
    } else {
      setEmailStatus({
        type: 'success',
        msg: res?.message || 'Confirmation link sent to your new email address!',
      })
      setNewEmail('')
    }
  }

  // Handle Password Update
  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!newPassword) return
    if (newPassword !== confirmPassword) {
      setPasswordStatus({ type: 'error', msg: 'Passwords do not match' })
      return
    }

    setPasswordSaving(true)
    setPasswordStatus(null)

    const formData = new FormData()
    formData.append('newPassword', newPassword)
    formData.append('confirmPassword', confirmPassword)

    const res = await updatePassword(formData)
    setPasswordSaving(false)

    if (res?.error) {
      setPasswordStatus({ type: 'error', msg: res.error })
    } else {
      setPasswordStatus({ type: 'success', msg: 'Password updated successfully!' })
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => setPasswordStatus(null), 4000)
    }
  }

  const handleCopyId = () => {
    navigator.clipboard.writeText(profile.id)
    setCopiedId(true)
    setTimeout(() => setCopiedId(false), 2000)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-purple-500/25 bg-gradient-to-r from-[var(--bg-secondary)] via-[#120f38] to-[var(--bg-primary)] p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--purple)] to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-500/30 flex-shrink-0">
              <Settings className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Hero Settings
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-purple-500/20 text-[var(--cyan)] border border-purple-500/30">
                  Realm Config
                </span>
              </div>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                Customize your adventurer identity, email, password, and security preferences
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-xl bg-purple-900/40 border border-purple-500/30 text-xs font-mono text-purple-200">
              Lv.{profile.level} {profile.title}
            </div>
            {profile.class_type && (
              <div className="px-3 py-1.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs font-bold text-cyan-300">
                {profile.class_type}
              </div>
            )}
          </div>
        </div>

        {/* Top ambient glow */}
        <div className="absolute -right-16 -top-16 w-56 h-56 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Main Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ========================================================= */}
        {/* SECTION 1: Adventurer Identity */}
        {/* ========================================================= */}
        <div className="glass-card rounded-3xl p-6 sm:p-7 border border-purple-500/20 shadow-xl relative flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 pb-4 border-b border-purple-500/15 mb-5">
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Adventurer Profile</h2>
                <p className="text-xs text-[var(--text-muted)]">Choose your battle avatar and display name</p>
              </div>
            </div>

            {profileStatus && (
              <div
                className={cn(
                  'mb-4 p-3 rounded-xl text-xs font-semibold flex items-center gap-2',
                  profileStatus.type === 'success'
                    ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                    : 'bg-rose-500/15 border border-rose-500/30 text-rose-300'
                )}
              >
                {profileStatus.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                )}
                <span>{profileStatus.msg}</span>
              </div>
            )}

            <form id="profile-form" onSubmit={handleProfileSubmit} className="space-y-5">
              {/* Avatar Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2.5">
                  Choose Avatar
                </label>
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-16 h-16 rounded-2xl bg-[var(--bg-primary)] border-2 border-[var(--cyan)] flex items-center justify-center text-3xl shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                    {avatar}
                  </div>
                  <div className="text-xs text-[var(--text-muted)]">
                    <p className="font-semibold text-white">Selected Icon</p>
                    <p>Tap any hero badge below to equip</p>
                  </div>
                </div>

                <div className="grid grid-cols-6 gap-2">
                  {AVATAR_OPTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setAvatar(emoji)}
                      className={cn(
                        'h-11 rounded-xl text-xl flex items-center justify-center transition-all cursor-pointer select-none',
                        'active:scale-90 touch-action-manipulation',
                        avatar === emoji
                          ? 'bg-purple-600/30 border-2 border-[var(--cyan)] shadow-[0_0_10px_rgba(34,211,238,0.3)] scale-105'
                          : 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-purple-500/40'
                      )}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Username Input */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="username" className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                    Adventurer Name
                  </label>
                  <span className="text-[10px] text-[var(--text-muted)] font-mono">
                    {username.length}/20 chars
                  </span>
                </div>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                  <input
                    id="username"
                    type="text"
                    required
                    maxLength={20}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="input pl-10"
                    placeholder="Grand Paladin"
                  />
                </div>
              </div>
            </form>
          </div>

          <button
            type="submit"
            form="profile-form"
            disabled={profileSaving}
            className="btn-primary w-full mt-6 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold shadow-lg shadow-purple-600/25 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
          >
            {profileSaving ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </>
            )}
          </button>
        </div>

        {/* ========================================================= */}
        {/* SECTION 2: Security & Email */}
        {/* ========================================================= */}
        <div className="glass-card rounded-3xl p-6 sm:p-7 border border-purple-500/20 shadow-xl relative flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 pb-4 border-b border-purple-500/15 mb-5">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Email Address</h2>
                <p className="text-xs text-[var(--text-muted)]">Manage your connected account email</p>
              </div>
            </div>

            {/* Current Email Display */}
            <div className="p-4 rounded-2xl bg-black/40 border border-purple-500/20 mb-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Mail className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Current Email</p>
                    <p className="text-sm font-medium text-white truncate font-mono">{email || 'Not available'}</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Active
                </span>
              </div>
            </div>

            {emailStatus && (
              <div
                className={cn(
                  'mb-4 p-3 rounded-xl text-xs font-semibold flex items-center gap-2',
                  emailStatus.type === 'success'
                    ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                    : 'bg-rose-500/15 border border-rose-500/30 text-rose-300'
                )}
              >
                {emailStatus.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                )}
                <span>{emailStatus.msg}</span>
              </div>
            )}

            <form id="email-form" onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label htmlFor="new-email" className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                  New Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                  <input
                    id="new-email"
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="input pl-10"
                    placeholder="newhero@adventure.com"
                  />
                </div>
                <p className="text-[11px] text-[var(--text-muted)] mt-2">
                  ⚠️ Supabase will dispatch a confirmation link to your new address. You must verify it before the change takes effect.
                </p>
              </div>
            </form>
          </div>

          <button
            type="submit"
            form="email-form"
            disabled={emailSaving || !newEmail}
            className="w-full mt-6 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 border border-cyan-500/30 shadow-lg shadow-cyan-600/20 active:scale-95 disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            {emailSaving ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Mail className="w-4 h-4" />
                <span>Send Email Confirmation</span>
              </>
            )}
          </button>
        </div>

        {/* ========================================================= */}
        {/* SECTION 3: Change Password */}
        {/* ========================================================= */}
        <div className="glass-card rounded-3xl p-6 sm:p-7 border border-purple-500/20 shadow-xl relative flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 pb-4 border-b border-purple-500/15 mb-5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Change Password</h2>
                <p className="text-xs text-[var(--text-muted)]">Update your realm encryption cipher</p>
              </div>
            </div>

            {passwordStatus && (
              <div
                className={cn(
                  'mb-4 p-3 rounded-xl text-xs font-semibold flex items-center gap-2',
                  passwordStatus.type === 'success'
                    ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                    : 'bg-rose-500/15 border border-rose-500/30 text-rose-300'
                )}
              >
                {passwordStatus.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                )}
                <span>{passwordStatus.msg}</span>
              </div>
            )}

            <form id="password-form" onSubmit={handlePasswordSubmit} className="space-y-4">
              {/* New Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="new-password" className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                    New Password
                  </label>
                  {newPassword && (
                    <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full', passwordStrength.color)}>
                      {passwordStrength.text}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                  <input
                    id="new-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="input pl-10 pr-10"
                    placeholder="At least 6 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Strength Meter Bar */}
                {newPassword && (
                  <div className="h-1.5 w-full bg-black/50 rounded-full overflow-hidden mt-2 border border-white/10">
                    <div
                      className={cn('h-full transition-all duration-300', passwordStrength.color.split(' ')[0])}
                      style={{ width: `${passwordStrength.score}%` }}
                    />
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirm-password" className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                  <input
                    id="confirm-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input pl-10"
                    placeholder="Repeat new password"
                  />
                </div>
              </div>
            </form>
          </div>

          <button
            type="submit"
            form="password-form"
            disabled={passwordSaving || !newPassword || !confirmPassword}
            className="btn-primary w-full mt-6 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold shadow-lg shadow-purple-600/25 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
          >
            {passwordSaving ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Shield className="w-4 h-4" />
                <span>Update Password</span>
              </>
            )}
          </button>
        </div>

        {/* ========================================================= */}
        {/* SECTION 4: Account Details & Session */}
        {/* ========================================================= */}
        <div className="glass-card rounded-3xl p-6 sm:p-7 border border-purple-500/20 shadow-xl relative flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 pb-4 border-b border-purple-500/15 mb-5">
              <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-300">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Adventurer Record</h2>
                <p className="text-xs text-[var(--text-muted)]">Account ID and active session management</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Account ID display */}
              <div className="p-3.5 rounded-2xl bg-black/40 border border-purple-500/20 flex items-center justify-between">
                <div className="min-w-0 mr-2">
                  <p className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Hero Soul ID</p>
                  <p className="text-xs font-mono text-slate-300 truncate">{profile.id}</p>
                </div>
                <button
                  type="button"
                  onClick={handleCopyId}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer flex-shrink-0 active:scale-90"
                  title="Copy Soul ID"
                >
                  {copiedId ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Status information */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-black/40 border border-purple-500/20">
                  <p className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Class</p>
                  <p className="text-sm font-bold text-[var(--cyan)]">{profile.class_type || 'Novice'}</p>
                </div>
                <div className="p-3 rounded-2xl bg-black/40 border border-purple-500/20">
                  <p className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Rank Status</p>
                  <p className="text-sm font-bold text-amber-300">Active Adventurer</p>
                </div>
              </div>
            </div>
          </div>

          {/* Danger Zone: Log Out */}
          <div className="mt-6 pt-5 border-t border-purple-500/15">
            <form action={signOut}>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-all active:scale-95 cursor-pointer shadow-lg shadow-rose-900/20"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out of Realm</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
