'use client'

import { useState } from 'react'
import { updateProfile } from '@/app/_actions/character'
import { Card, CardHeader, CardTitle } from '@/app/_components/ui/Card'
import { Badge } from '@/app/_components/ui/Badge'
import { ProgressBar } from '@/app/_components/ui/ProgressBar'
import { InventoryClient } from './InventoryClient'
import { calculateProgress } from '@/app/_lib/xp'
import { TITLES } from '@/app/_lib/constants'
import {
  UserCircle,
  Shield,
  Coins,
  Sparkles,
  TrendingUp,
  Save,
  CheckCircle2
} from 'lucide-react'

interface Profile {
  id: string
  username: string
  avatar_url: string
  level: number
  xp: number
  coins: number
  title: string
}

interface Stat {
  id: string
  name: string
  level: number
  xp: number
  icon: string
  color: string
}

const AVATAR_OPTIONS = ['🧙', '⚔️', '🏹', '🛡️', '🧝', '🥷', '🐲', '👑', '⚡', '🔥']

export function CharacterClient({
  profile,
  stats,
  inventory,
}: {
  profile: Profile
  stats: Stat[]
  inventory: any[]
}) {
  const [selectedAvatar, setSelectedAvatar] = useState(profile.avatar_url || '🧙')
  const [username, setUsername] = useState(profile.username)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const { currentXP, xpForNextLevel, progress } = calculateProgress(profile.xp, profile.level)

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    const formData = new FormData()
    formData.append('username', username)
    formData.append('avatar_url', selectedAvatar)

    const res = await updateProfile(formData)
    setSaving(false)

    if (res?.error) {
      setMessage(`Error: ${res.error}`)
    } else {
      setMessage('Profile updated successfully!')
      setTimeout(() => setMessage(null), 3000)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
          <span>🛡️</span> Character Sheet
        </h1>
        <p className="text-sm text-slate-300 mt-1">
          Review your hero level, unlock prestigious titles, and customize your persona.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Col: Avatar & Profile Customization */}
        <div className="md:col-span-1 space-y-6">
          <Card glow className="border-purple-500/35 bg-[#0d0d26]/95 shadow-xl">
            <form onSubmit={handleSave} className="space-y-4 text-center">
              {/* Avatar Preview */}
              <div className="w-24 h-24 mx-auto rounded-3xl bg-[var(--bg-primary)] border-2 border-purple-500/50 shadow-[0_0_20px_rgba(139,92,246,0.3)] flex items-center justify-center text-5xl animate-float">
                {selectedAvatar}
              </div>

              <div>
                <h3 className="font-extrabold text-lg text-white">{username}</h3>
                <Badge variant="gold" className="mt-1 font-mono font-bold shadow-sm shadow-amber-500/20">
                  Lv.{profile.level} {profile.title}
                </Badge>
              </div>

              {/* Avatar Picker */}
              <div className="pt-2 text-left">
                <label className="block text-xs font-bold text-slate-300 mb-2 text-center uppercase tracking-wider">
                  Choose Class Avatar
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {AVATAR_OPTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setSelectedAvatar(emoji)}
                      className={`text-2xl p-2 rounded-xl border transition-all cursor-pointer ${
                        selectedAvatar === emoji
                          ? 'border-cyan-400 bg-cyan-500/20 shadow-[0_0_12px_rgba(34,211,238,0.4)] scale-110'
                          : 'border-white/10 bg-[#090920] hover:border-purple-500/50 hover:scale-105'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Username Input */}
              <div className="text-left pt-2">
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Hero Moniker
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input text-sm py-2 px-3 font-semibold"
                  required
                />
              </div>

              {message && (
                <p className={`text-xs font-bold ${message.startsWith('Error') ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {message}
                </p>
              )}

              <button
                type="submit"
                disabled={saving}
                className="btn-primary w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-extrabold shadow-md shadow-purple-600/30 cursor-pointer disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                {saving ? 'Saving...' : 'Save Character Sheet'}
              </button>
            </form>
          </Card>

          {/* Wallet / Level Stats */}
          <Card className="border-purple-500/25 bg-[#0d0d26]/95 shadow-md">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-300 flex items-center gap-2 font-semibold">
                  <Coins className="w-4 h-4 text-amber-400" /> Gold Bounty
                </span>
                <span className="font-mono font-black text-amber-300">{profile.coins.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-300 flex items-center gap-2 font-semibold">
                  <Sparkles className="w-4 h-4 text-purple-400" /> Lifetime XP
                </span>
                <span className="font-mono font-black text-purple-300">{profile.xp.toLocaleString()}</span>
              </div>
            </div>
          </Card>

          {/* Bag / Inventory */}
          <InventoryClient items={inventory} />
        </div>

        {/* Right 2 Cols: Detailed Stats & Title Progression */}
        <div className="md:col-span-2 space-y-6">
          {/* XP Progress Card */}
          <Card className="border-purple-500/30 bg-[#0d0d26]/95 shadow-xl">
            <CardHeader>
              <CardTitle className="text-white">
                <Shield className="w-5 h-5 text-amber-400" />
                Level Experience & Mastery
              </CardTitle>
              <span className="text-xs font-mono font-bold text-amber-300">
                {currentXP} / {xpForNextLevel} XP
              </span>
            </CardHeader>
            <div className="w-full h-3.5 bg-black/70 rounded-full overflow-hidden border border-purple-500/40 p-0.5 shadow-inner">
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple-500 via-[var(--cyan)] to-amber-400 transition-all duration-700 relative overflow-hidden"
                style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              </div>
            </div>
            <p className="text-xs text-slate-300 mt-2.5">
              Conquer daily missions to earn <span className="text-amber-300 font-bold font-mono">{Math.max(xpForNextLevel - currentXP, 0)} more XP</span> and ascend to{' '}
              <span className="text-[var(--cyan)] font-extrabold">Level {profile.level + 1}</span>.
            </p>
          </Card>

          {/* Core Attribute Bars */}
          <Card className="border-purple-500/30 bg-[#0d0d26]/95 shadow-xl">
            <CardHeader>
              <CardTitle className="text-white">
                <TrendingUp className="w-5 h-5 text-[var(--cyan)]" />
                Specialized Attributes
              </CardTitle>
            </CardHeader>

            <div className="space-y-4">
              {stats.map((stat) => {
                const statProgress = Math.min((stat.xp % 100) / 100, 1)
                const statColor = stat.name.toLowerCase().includes('strength')
                  ? '#f43f5e'
                  : stat.name.toLowerCase().includes('intellect')
                  ? '#22d3ee'
                  : stat.name.toLowerCase().includes('discipline')
                  ? '#f5a623'
                  : '#a78bfa'

                return (
                  <div key={stat.id} className="p-3.5 rounded-xl border border-white/5 bg-[#090920] space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{stat.icon}</span>
                        <span className="font-bold text-white">{stat.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400 font-mono font-semibold">{stat.xp} XP</span>
                        <Badge variant="gold" className="font-mono font-bold text-[11px]">Lv.{stat.level}</Badge>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-black/60 rounded-full overflow-hidden border border-white/10">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.max(statProgress * 100, 8)}%`,
                          backgroundColor: statColor,
                          boxShadow: `0 0 8px ${statColor}60`,
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>

          {/* Titles Roadmap */}
          <Card className="border-purple-500/30 bg-[#0d0d26]/95 shadow-xl">
            <CardHeader>
              <CardTitle className="text-white">
                <span>👑</span> Titles & Prestige Progression
              </CardTitle>
            </CardHeader>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-center">
              {Object.entries(TITLES).map(([lvlStr, title]) => {
                const reqLevel = Number(lvlStr)
                const isUnlocked = profile.level >= reqLevel
                return (
                  <div
                    key={title}
                    className={`p-3 rounded-xl border text-xs transition-all ${
                      isUnlocked
                        ? 'border-amber-500/50 bg-gradient-to-b from-amber-500/20 to-amber-500/5 text-amber-300 font-bold shadow-[0_0_12px_rgba(245,166,35,0.15)]'
                        : 'border-white/5 bg-[#090920] text-slate-500 opacity-60'
                    }`}
                  >
                    <p className="font-bold truncate">{title}</p>
                    <p className="text-[10px] mt-1 font-mono font-semibold">
                      {isUnlocked ? '✓ Unlocked' : `Lv. ${reqLevel}+`}
                    </p>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
