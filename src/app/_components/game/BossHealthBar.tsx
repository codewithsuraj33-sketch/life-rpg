'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/app/_components/ui/Card'
import { Flame } from 'lucide-react'

interface BossHealthBarProps {
  boss: {
    id: string
    name: string
    max_hp: number
    current_hp: number
    image_url: string
  } | null
}

export function BossHealthBar({ boss }: BossHealthBarProps) {
  const [hp, setHp] = useState(boss?.current_hp || 0)
  const [animateHit, setAnimateHit] = useState(false)

  useEffect(() => {
    if (boss?.current_hp !== undefined && boss.current_hp < hp) {
      setAnimateHit(true)
      setTimeout(() => setAnimateHit(false), 500)
    }
    setHp(boss?.current_hp || 0)
  }, [boss?.current_hp, hp])

  if (!boss) return null

  const hpPercentage = Math.max(0, (hp / boss.max_hp) * 100)
  const isDefeated = hp <= 0

  return (
    <Card className={`relative overflow-hidden mb-6 border border-rose-500/40 bg-gradient-to-r from-rose-950/40 via-[var(--bg-secondary)] to-red-950/30 shadow-[0_0_25px_rgba(244,63,94,0.18)] ${animateHit ? 'animate-shake' : ''}`}>
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5 p-4 sm:p-5">
        
        <div className={`text-4xl sm:text-5xl p-3 sm:p-3.5 bg-rose-900/30 rounded-2xl border-2 border-rose-500/50 shadow-[0_0_20px_rgba(244,63,94,0.3)] ${animateHit ? 'scale-90 rotate-3' : 'animate-pulse'} transition-all duration-200 flex-shrink-0`}>
          {boss.image_url || '🐉'}
        </div>
        
        <div className="flex-1 w-full text-center sm:text-left space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-rose-500/20 text-rose-300 border border-rose-500/40">
                World Boss Raid
              </span>
              <h3 className="text-base sm:text-lg font-black text-rose-300 flex items-center gap-1.5" style={{ textShadow: '0 0 10px rgba(244,63,94,0.5)' }}>
                <Flame className="w-4 h-4 text-amber-400 animate-bounce" /> 
                {isDefeated ? `Defeated: ${boss.name}` : boss.name}
              </h3>
            </div>
            <span className="text-rose-200 font-mono text-xs sm:text-sm font-bold bg-black/60 border border-rose-500/30 px-3 py-1 rounded-xl shadow-inner">
              {hp.toLocaleString()} / {boss.max_hp.toLocaleString()} HP ({Math.round(hpPercentage)}%)
            </span>
          </div>
          
          <div className="w-full h-3.5 sm:h-4 bg-black/70 rounded-full overflow-hidden border border-rose-500/40 p-0.5 shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 via-rose-500 to-red-600 rounded-full transition-all duration-700 ease-out relative overflow-hidden"
              style={{ width: `${hpPercentage}%`, boxShadow: '0 0 12px rgba(244,63,94,0.6)' }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </div>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-300 font-medium">
            <span>⚔️ Complete daily quests to strike the boss!</span>
            <span className="text-amber-300 font-mono font-bold">Earn Bonus Gold & Glory</span>
          </div>
        </div>
        
      </div>
    </Card>
  )
}
