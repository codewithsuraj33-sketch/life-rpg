'use client'

import { signOut } from '@/app/_actions/auth'
import { LogOut, Menu } from 'lucide-react'
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
      <header className="flex items-center justify-between px-3.5 sm:px-6 py-2.5 sm:py-3 border-b border-[var(--border-default)] bg-[var(--bg-secondary)]/80 backdrop-blur-md gap-2 sm:gap-4">
        {/* Mobile menu button */}
        <button
          className="md:hidden p-1.5 -ml-1 text-muted hover:text-[var(--purple)] transition-colors cursor-pointer rounded-lg hover:bg-[var(--bg-primary)]"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Status Bars (HP & XP) */}
        <div className="flex-1 max-w-xs sm:max-w-md mx-1 sm:mx-4 min-w-0 flex flex-col justify-center">
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-bold">
            <span className="text-crimson">HP {profile.current_hp ?? 100}/{profile.max_hp ?? 100}</span>
            <span className="text-purple">Lv.{profile.level} {profile.title}</span>
          </div>
          <div className="stat-bar h-1.5 sm:h-2 mt-0.5 mb-1 bg-red-100">
            <div
              className="stat-bar-fill bg-crimson"
              style={{ width: `${Math.max(0, ((profile.current_hp ?? 100) / (profile.max_hp ?? 100)) * 100)}%` }}
            />
          </div>
          <div className="xp-bar h-1.5 sm:h-2">
            <div
              className="xp-bar-fill"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <div className="text-right text-muted font-mono text-[9px] sm:text-[10px] mt-0.5">
            {currentXP}/{xpForNextLevel} XP
          </div>
        </div>

        {/* Coins + Logout */}
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <div className="flex items-center gap-1 text-[var(--gold)] font-mono font-bold text-xs sm:text-sm bg-[var(--bg-primary)] border border-[var(--border-default)] px-2 py-1 rounded-md sm:bg-transparent sm:border-0 sm:p-0">
            <span>🪙</span>
            <span>{profile.coins.toLocaleString()}</span>
          </div>

          <form action={signOut}>
            <button
              type="submit"
              className="p-1.5 text-muted hover:text-rose-500 transition-colors cursor-pointer rounded-lg hover:bg-[var(--bg-primary)]"
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
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-[var(--bg-secondary)] border-r border-[var(--border-default)] animate-slide-in shadow-2xl">
            {/* Close button */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--border-default)]">
              <div className="flex items-center gap-2">
                <Sword className="w-6 h-6 text-[var(--purple)]" />
                <span className="text-xl font-black">
                  LIFE<span className="text-[var(--purple)]">RPG</span>
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-muted hover:text-[var(--purple)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Character */}
            <div className="px-4 py-5 border-b border-[var(--border-default)] bg-[var(--bg-primary)]">
              <div className="flex items-center gap-3">
                <div className="text-3xl bg-[var(--bg-card)] border border-[var(--border-default)] p-2 rounded-xl shadow-[var(--shadow-cyan)]">{profile.avatar_url}</div>
                <div>
                  <p className="font-bold text-sm text-[var(--text-primary)]">{profile.username}</p>
                  <p className="text-xs font-semibold text-[var(--cyan)] mt-0.5">
                    Lv.{profile.level} {profile.title}
                  </p>
                </div>
              </div>
            </div>

            {/* Nav */}
            <nav className="px-3 py-4 space-y-1 bg-[var(--bg-secondary)] h-full">
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
                        ? 'bg-[var(--purple-bg)] text-[var(--purple)] border border-[var(--border-default)]'
                        : 'text-muted hover:text-[var(--text-primary)] hover:bg-[var(--bg-primary)]'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
