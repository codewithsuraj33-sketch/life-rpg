'use client'

import { useEffect, useState } from 'react'
import { Modal } from './ui/Modal'
import { claimDailyReward } from '@/app/_actions/daily'
import { playSound } from '@/app/_lib/sound'
import { Coins, Sparkles } from 'lucide-react'
import confetti from 'canvas-confetti'

interface DailyRewardModalProps {
  lastLoginDate: string | null
}

export function DailyRewardModal({ lastLoginDate }: DailyRewardModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [rewarded, setRewarded] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    if (lastLoginDate !== today) {
      setIsOpen(true)
    }
  }, [lastLoginDate])

  const handleClaim = async () => {
    setLoading(true)
    const res = await claimDailyReward()
    if (res?.success) {
      playSound('reward')
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } })
      setRewarded(true)
      setTimeout(() => setIsOpen(false), 3000)
    } else {
      setIsOpen(false)
    }
    setLoading(false)
  }

  return (
    <Modal isOpen={isOpen} onClose={() => {}} title="Daily Login Reward!">
      <div className="text-center py-6">
        <h2 className="text-2xl font-black text-amber-400 mb-2">Welcome Back, Hero!</h2>
        <p className="text-muted mb-8">The realm rewards your consistency.</p>

        {rewarded ? (
          <div className="animate-fade-in text-emerald-400 font-bold text-xl flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6" /> Reward Claimed!
          </div>
        ) : (
          <button
            onClick={handleClaim}
            disabled={loading}
            className="btn-primary w-full max-w-xs mx-auto py-4 text-lg animate-pulse-glow flex items-center justify-center gap-2"
          >
            <Coins className="w-5 h-5" />
            Claim +50 XP & +20 Gold
          </button>
        )}
      </div>
    </Modal>
  )
}
