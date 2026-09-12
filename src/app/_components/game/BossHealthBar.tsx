'use client'

import { useEffect, useState } from 'react'
import { Card } from './ui/Card'
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
    <Card className={`relative overflow-hidden mb-6 border-red-900/30 bg-red-950/10 ${animateHit ? 'animate-pulse' : ''}`}>
      <div className="flex flex-col sm:flex-row items-center gap-4 p-4">
        
        <div className={`text-4xl p-3 bg-red-900/20 rounded-xl border-2 border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.2)] ${animateHit ? 'translate-y-1 scale-95' : ''} transition-all duration-100`}>
          {boss.image_url || '🐉'}
        </div>
        
        <div className="flex-1 w-full text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-red-400 flex items-center justify-center sm:justify-start gap-2">
              <Flame className="w-5 h-5" /> 
              {isDefeated ? `Defeated: ${boss.name}` : boss.name}
            </h3>
            <span className="text-red-300 font-mono text-sm font-bold bg-red-950 px-2 py-1 rounded-md">
              {hp.toLocaleString()} / {boss.max_hp.toLocaleString()} HP
            </span>
          </div>
          
          <div className="w-full h-4 bg-red-950 rounded-full overflow-hidden border border-red-900/50">
            <div 
              className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-1000 ease-out"
              style={{ width: `${hpPercentage}%` }}
            />
          </div>
          <p className="text-xs text-red-300/70 mt-2">
            Global Event: Complete tasks to deal damage!
          </p>
        </div>
        
      </div>
    </Card>
  )
}
