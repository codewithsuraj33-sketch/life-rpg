'use client'

import { useState } from 'react'
import { updateProfile } from '@/app/_actions/character'
import { Card, CardHeader, CardTitle } from '@/app/_components/ui/Card'
import { Badge } from '@/app/_components/ui/Badge'
import { ProgressBar } from '@/app/_components/ui/ProgressBar'
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
}: {
  profile: Profile
  stats: Stat[]
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
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2.5">
          <span>🛡️</span> Character Sheet
        </h1>
        <p className="text-sm text-muted mt-1">
          Review your level, titles, and attribute specializations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Col: Avatar & Profile Customization */}
        <div className="md:col-span-1 space-y-6">
          <Card glow>
            <form onSubmit={handleSave} className="space-y-4 text-center">
              {/* Avatar Preview */}
              <div className="w-24 h-24 mx-auto rounded-2xl bg-[var(--bg-primary)] border-2 border-amber-500/40 flex items-center justify-center text-5xl shadow-lg">
                {selectedAvatar}
              </div>

              <div>
                <h3 className="font-bold text-lg">{username}</h3>
                <Badge variant="gold" className="mt-1">
                  Lv.{profile.level} {profile.title}
                </Badge>
              </div>

              {/* Avatar Picker */}
              <div className="pt-2 text-left">
                <label className="block text-xs font-semibold text-muted mb-2 text-center">
                  Choose Your Hero Class/Avatar
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {AVATAR_OPTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setSelectedAvatar(emoji)}
                      className={`text-2xl p-1.5 rounded-lg border transition-all cursor-pointer ${
                        selectedAvatar === emoji
                          ? 'border-amber-500 bg-amber-500/20 scale-105'
                          : 'border-[var(--border-default)] hover:border-amber-500/30'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Username Input */}
              <div className="text-left pt-2">
                <label className="block text-xs font-semibold text-muted mb-1">
                  Hero Name
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--border-default)] bg-[var(--bg-primary)] text-sm focus:outline-none focus:border-amber-500/50"
                  required
                />
              </div>

              {message && (
                <p className={`text-xs ${message.startsWith('Error') ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {message}
                </p>
              )}

              <button
                type="submit"
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-black font-semibold text-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                {saving ? 'Saving...' : 'Save Character'}
              </button>
            </form>
          </Card>

          {/* Wallet / Level Stats */}
          <Card>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted flex items-center gap-2">
                  <Coins className="w-4 h-4 text-amber-400" /> Gold Coins
                </span>
                <span className="font-mono font-bold text-amber-400">{profile.coins}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" /> Total XP
                </span>
                <span className="font-mono font-bold">{profile.xp}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right 2 Cols: Detailed Stats & Title Progression */}
        <div className="md:col-span-2 space-y-6">
          {/* XP Progress Card */}
          <Card>
            <CardHeader>
              <CardTitle>
                <Shield className="w-5 h-5 text-amber-400" />
                Level Progress
              </CardTitle>
              <span className="text-xs font-mono text-muted">
                {currentXP} / {xpForNextLevel} XP
              </span>
            </CardHeader>
            <ProgressBar progress={progress} className="h-3" />
            <p className="text-xs text-muted mt-2">
              Earn {Math.max(xpForNextLevel - currentXP, 0)} more XP from quests to advance to{' '}
              <span className="text-amber-400 font-semibold">Level {profile.level + 1}</span>.
            </p>
          </Card>

          {/* Core Attribute Bars */}
          <Card>
            <CardHeader>
              <CardTitle>
                <TrendingUp className="w-5 h-5 text-amber-400" />
                Attributes & Skills
              </CardTitle>
            </CardHeader>

            <div className="space-y-4">
              {stats.map((stat) => {
                const statProgress = Math.min((stat.xp % 100) / 100, 1)
                return (
                  <div key={stat.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{stat.icon}</span>
                        <span className="font-semibold">{stat.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted font-mono">{stat.xp} XP</span>
                        <Badge variant="gold">Lv.{stat.level}</Badge>
                      </div>
                    </div>
                    <ProgressBar
                      progress={statProgress}
                      color={stat.color}
                      className="h-2"
                    />
                  </div>
                )
              })}
            </div>
          </Card>

          {/* Titles Roadmap */}
          <Card>
            <CardHeader>
              <CardTitle>
                <span>👑</span> Titles Progression
              </CardTitle>
            </CardHeader>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
              {Object.entries(TITLES).map(([lvlStr, title]) => {
                const reqLevel = Number(lvlStr)
                const isUnlocked = profile.level >= reqLevel
                return (
                  <div
                    key={title}
                    className={`p-2.5 rounded-lg border text-xs transition-all ${
                      isUnlocked
                        ? 'border-amber-500/40 bg-amber-500/10 text-amber-300 font-medium'
                        : 'border-[var(--border-default)] bg-[var(--bg-secondary)]/40 text-dim'
                    }`}
                  >
                    <p className="font-bold">{title}</p>
                    <p className="text-[10px] mt-0.5 opacity-80">Lv. {reqLevel}+</p>
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
