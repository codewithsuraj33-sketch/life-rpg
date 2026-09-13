'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Scroll,
  UserCircle,
  ShoppingBag,
  Settings,
} from 'lucide-react'
import { cn } from '@/app/_lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/quests', label: 'Quests', icon: Scroll },
  { href: '/character', label: 'Hero', icon: UserCircle },
  { href: '/shop', label: 'Shop', icon: ShoppingBag },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export default function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
      {/* Glassmorphism backdrop */}
      <div className="absolute inset-0 bg-[var(--bg-secondary)]/95 backdrop-blur-xl border-t border-purple-500/20" />

      {/* Top glow line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

      {/* Nav items */}
      <div className="relative flex items-center justify-around px-1 py-1.5 safe-area-bottom">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all duration-150',
                'touch-action-manipulation select-none',
                'active:scale-90 active:opacity-80',
                isActive
                  ? 'text-[var(--cyan)]'
                  : 'text-[var(--text-muted)] hover:text-white'
              )}
            >
              {/* Active glow indicator */}
              {isActive && (
                <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-gradient-to-r from-purple-500 to-cyan-400 shadow-[0_0_10px_rgba(139,92,246,0.5)]" />
              )}

              {/* Active background pill */}
              {isActive && (
                <span className="absolute inset-0 rounded-xl bg-purple-500/10 border border-purple-500/20" />
              )}

              <Icon
                className={cn(
                  'w-5 h-5 relative z-10 transition-transform duration-150',
                  isActive && 'drop-shadow-[0_0_6px_rgba(0,255,247,0.4)]'
                )}
              />

              <span
                className={cn(
                  'text-[10px] font-bold relative z-10 leading-none',
                  isActive ? 'text-[var(--cyan)]' : 'text-[var(--text-muted)]'
                )}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
