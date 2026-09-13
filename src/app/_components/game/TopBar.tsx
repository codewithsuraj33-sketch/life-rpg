'use client'

import { signOut } from '@/app/_actions/auth'
import { LogOut, Menu, Sparkles } from 'lucide-react'
import { calculateProgress } from '@/app/_lib/xp'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Scroll,
  UserCircle,
  Trophy,
  Crown,
  ShoppingBag,
  X,
  Sword,
} from 'lucide-react'
import { cn } from '@/app/_lib/utils'

interface Profile {
  id: string
  username: string
  avatar_url: string
  level: number
  xp: number
  coins: number
  title: string
  current_hp?: number
  max_hp?: number
}

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/quests', label: 'Quests', icon: Scroll },
  { href: '/character', label: 'Character', icon: UserCircle },
  { href: '/shop', label: 'Item Shop', icon: ShoppingBag },
  { href: '/achievements', label: 'Achievements', icon: Trophy },
  { href: '/leaderboard', label: 'Leaderboard', icon: Crown },
]

export function TopBar({ profile }: { profile: Profile }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { currentXP, xpForNextLevel, progress } = calculateProgress(profile.xp, profile.level)

  return (
    <>
      <header className="flex items-center justify-between px-4 sm:px-8 py-3 border-b border-[var(--border-default)] bg-[var(--bg-secondary)]/90 backdrop-blur-xl gap-3 sm:gap-6 sticky top-0 z-30">
        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 -ml-1 text-[var(--text-secondary)] hover:text-white transition-colors cursor-pointer rounded-xl hover:bg-white/5"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Status Bars (HP & XP) */}
        <div className="flex-1 max-w-sm sm:max-w-lg mx-1 sm:mx-4 min-w-0 flex flex-col justify-center space-y-2">
          {/* Bar 1: HP */}
          <div className="space-y-0.5">
            <div className="flex items-center justify-between text-[10px] sm:text-xs font-bold">
              <span className="text-rose-400 flex items-center gap-1" style={{ textShadow: '0 0 8px rgba(244,63,94,0.4)' }}>
                ❤️ HP {profile.current_hp ?? 100}/{profile.max_hp ?? 100}
              </span>
              <span className="text-purple-300 font-mono text-[11px]">
                Lv.{profile.level} {profile.title}
              </span>
            </div>
            <div className="h-1.5 sm:h-2 bg-black/70 rounded-full overflow-hidden border border-rose-500/30">
              <div
                className="h-full rounded-full bg-gradient-to-r from-red-600 via-rose-500 to-pink-500 transition-all duration-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]"
                style={{
                  width: `${Math.max(
                    0,
                    ((profile.current_hp ?? 100) / (profile.max_hp ?? 100)) * 100
                  )}%`,
                }}
              />
            </div>
          </div>

          {/* Bar 2: XP */}
          <div className="space-y-0.5">
            <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-mono">
              <span className="text-slate-300">Level Experience</span>
              <span className="text-amber-300 font-bold">
                {currentXP} / {xpForNextLevel} XP ({Math.round(progress * 100)}%)
              </span>
            </div>
            <div className="h-1.5 sm:h-2 bg-black/70 rounded-full overflow-hidden border border-purple-500/30">
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple-500 via-[var(--cyan)] to-amber-400 transition-all duration-700 shadow-[0_0_8px_rgba(245,166,35,0.5)]"
                style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
              />
            </div>
          </div>
        </div>

        {/* Coins + Logout */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <Link
            href="/shop"
            className="flex items-center gap-1.5 text-amber-300 font-mono font-bold text-xs sm:text-sm bg-amber-500/15 border border-amber-500/40 px-3 py-1.5 rounded-xl hover:bg-amber-500/25 hover:border-amber-400 hover:shadow-[0_0_15px_rgba(245,166,35,0.25)] transition-all"
            title="Open Shop"
          >
            <span>🪙</span>
            <span>{profile.coins.toLocaleString()}</span>
          </Link>

          <form action={signOut}>
            <button
              type="submit"
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer rounded-xl border border-transparent hover:border-rose-500/30"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </form>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-md animate-fade-in"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-[var(--bg-secondary)] border-r border-[var(--border-default)] animate-slide-in shadow-2xl flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--border-default)]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[var(--purple)] to-indigo-600 flex items-center justify-center shadow-md">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xl font-black text-white">
                    Life<span className="text-[var(--cyan)]">RPG</span>
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-[var(--text-muted)] hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Character Card */}
              <div className="px-5 py-4 border-b border-[var(--border-default)] bg-[var(--bg-primary)]/70">
                <div className="flex items-center gap-3">
                  <div className="text-3xl bg-[var(--bg-card)] border border-purple-500/30 p-2 rounded-2xl shadow-md">
                    {profile.avatar_url || '🧙‍♂️'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-sm text-white truncate">{profile.username}</p>
                    <p className="text-xs font-semibold text-[var(--cyan)] truncate mt-0.5">
                      Lv.{profile.level} {profile.title}
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="px-3 py-4 space-y-1.5">
                {navItems.map((item) => {
                  const isActive = pathname === item.href
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all',
                        isActive
                          ? 'bg-purple-500/20 text-[var(--cyan)] border border-purple-500/30'
                          : 'text-[var(--text-secondary)] hover:text-white hover:bg-white/5'
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  )
                })}
              </nav>
            </div>

            {/* Mobile Footer Logout */}
            <div className="p-4 border-t border-[var(--border-default)]">
              <form action={signOut}>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out of Realm</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
