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
    <aside className="hidden md:flex flex-col w-64 border-r border-[var(--border-default)] bg-[var(--bg-secondary)]">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-5 border-b border-[var(--border-default)]">
        <Sword className="w-6 h-6 text-gold" />
        <span className="text-xl font-bold tracking-tight">
          Life<span className="text-gold">RPG</span>
        </span>
      </div>

      {/* Character Preview */}
      <div className="px-4 py-5 border-b border-[var(--border-default)]">
        <div className="flex items-center gap-3">
          <div className="text-3xl">{profile.avatar_url}</div>
          <div>
            <p className="font-semibold text-sm">{profile.username}</p>
            <p className="text-xs text-gold">
              Lv.{profile.level} {profile.title}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                isActive
                  ? 'bg-gold/10 text-gold border border-gold/20'
                  : 'text-muted hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]'
              )}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="px-4 py-4 border-t border-[var(--border-default)]">
        <p className="text-xs text-dim text-center">
          ⚔️ Every day is a new quest
        </p>
      </div>
    </aside>
  )
}
