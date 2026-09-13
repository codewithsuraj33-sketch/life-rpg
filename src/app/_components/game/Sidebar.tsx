'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Scroll,
  UserCircle,
  Trophy,
  Crown,
  Sword,
  ShoppingBag,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/app/_lib/utils'

interface Profile {
  id: string
  username: string
  avatar_url: string
  level: number
  title: string
}

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/quests', label: 'Quests', icon: Scroll },
  { href: '/character', label: 'Character', icon: UserCircle },
  { href: '/shop', label: 'Item Shop', icon: ShoppingBag },
  { href: '/achievements', label: 'Achievements', icon: Trophy },
  { href: '/leaderboard', label: 'Leaderboard', icon: Crown },
]

export function Sidebar({ profile }: { profile: Profile }) {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-[var(--border-default)] bg-[var(--bg-secondary)] relative z-20 select-none">
      {/* Top Accent Gradient Bar */}
      <div className="h-1 w-full bg-gradient-to-r from-[var(--purple)] via-[var(--cyan)] to-[var(--gold)]" />

      {/* Logo */}
      <div className="flex items-center gap-2.5 px-6 py-5 border-b border-[var(--border-default)]">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[var(--purple)] to-indigo-600 flex items-center justify-center shadow-md shadow-purple-500/20">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <span className="text-xl font-black tracking-tight text-white flex items-center">
          Life<span className="text-[var(--cyan)]">RPG</span>
        </span>
      </div>

      {/* Character Preview */}
      <div className="px-4 py-4 border-b border-[var(--border-default)] bg-[var(--bg-primary)]/80">
        <Link
          href="/character"
          className="flex items-center gap-3 p-2.5 rounded-2xl border border-purple-500/20 bg-[#090922] hover:border-purple-500/50 hover:bg-purple-500/10 transition-all group shadow-sm"
        >
          <div className="w-11 h-11 rounded-xl bg-[var(--bg-card)] border-2 border-purple-500/40 flex items-center justify-center text-2xl shadow-sm group-hover:scale-105 group-hover:border-[var(--cyan)] transition-all flex-shrink-0">
            {profile.avatar_url || '🧙‍♂️'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-sm text-white truncate group-hover:text-[var(--cyan)] transition-colors">
              {profile.username}
            </p>
            <p className="text-xs text-amber-300 font-semibold truncate font-mono">
              Lv.{profile.level} {profile.title}
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all relative group',
                isActive
                  ? 'bg-gradient-to-r from-purple-500/25 to-indigo-500/10 text-[var(--cyan)] border border-purple-500/40 shadow-[0_0_15px_rgba(139,92,246,0.15)] font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[var(--cyan)] rounded-r-full shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
              )}
              <Icon
                className={cn(
                  'w-4 h-4 transition-transform group-hover:scale-110',
                  isActive ? 'text-[var(--cyan)]' : 'text-slate-400 group-hover:text-white'
                )}
              />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Bottom Footer Quote */}
      <div className="px-4 py-4 border-t border-[var(--border-default)] text-center bg-[var(--bg-primary)]/40">
        <p className="text-[11px] text-slate-400 font-medium">
          ⚔️ Forge Your Legend Daily
        </p>
      </div>
    </aside>
  )
}
