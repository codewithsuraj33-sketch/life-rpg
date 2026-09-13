'use client'

import { useEffect, useState } from 'react'
import { Modal } from '@/app/_components/ui/Modal'
import { claimDailyReward } from '@/app/_actions/daily'
import { playSound } from '@/app/_lib/sound'
import { Coins, Sparkles } from 'lucide-react'

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
    // 1. ⚡ Instant sound
    playSound('reward')

    // 2. ⚡ Fast, crisp confetti (higher gravity so it falls fast, doesn't float slowly)
    import('canvas-confetti').then((module) => {
      const confetti = module.default
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.55 },
        gravity: 2.4,       // Fast, snappy fall
        startVelocity: 40,
        ticks: 90,          // Quick dissipation
      })
    }).catch(() => {})

    // 3. Instant UI feedback
    setRewarded(true)
    setLoading(true)

    // 4. ⚡ Snappy close (no 3-second freeze delay!)
    setTimeout(() => {
      setIsOpen(false)
    }, 650)

    // 5. Background database update
    try {
      await claimDailyReward()
    } catch (e) {
      console.error('Failed to claim reward:', e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Daily Login Reward!">
      <div className="text-center py-5">
        <h2 className="text-2xl font-black text-amber-400 mb-1.5">Welcome Back, Hero!</h2>
        <p className="text-slate-300 text-xs sm:text-sm mb-6">The realm rewards your daily consistency.</p>

        {rewarded ? (
          <div className="animate-fade-in text-emerald-400 font-bold text-lg sm:text-xl flex items-center justify-center gap-2 py-3">
            <Sparkles className="w-6 h-6 text-amber-400 animate-spin" /> Reward Claimed!
          </div>
        ) : (
          <button
            onClick={handleClaim}
            disabled={loading}
            className="btn-primary w-full max-w-xs mx-auto py-3.5 text-base font-extrabold flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 active:scale-95 transition-all tap-flash cursor-pointer"
          >
            <Coins className="w-5 h-5 text-amber-300" />
            Claim +50 XP & +20 Gold
          </button>
        )}
      </div>
    </Modal>
  )
}
