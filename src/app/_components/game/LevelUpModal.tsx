'use client'

import { useEffect } from 'react'
import confetti from 'canvas-confetti'
import { Crown, Sparkles, X, ArrowUpRight } from 'lucide-react'

interface LevelUpModalProps {
  isOpen: boolean
  onClose: () => void
  newLevel: number
  newTitle: string
}

export function LevelUpModal({
  isOpen,
  onClose,
  newLevel,
  newTitle,
}: LevelUpModalProps) {
  useEffect(() => {
    if (isOpen) {
      // Grand celebratory confetti burst
      const end = Date.now() + 2000
      const colors = ['#f59e0b', '#fbbf24', '#8b5cf6', '#10b981']

      const frame = () => {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors,
        })
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors,
        })

        if (Date.now() < end) {
          requestAnimationFrame(frame)
        }
      }
      frame()
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="relative w-full max-w-sm rounded-3xl border-2 border-amber-400 bg-gradient-to-b from-amber-950/40 via-[var(--bg-card)] to-[var(--bg-primary)] p-6 text-center shadow-[0_0_50px_rgba(245,158,11,0.3)]">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-muted hover:text-white transition-colors cursor-pointer p-1"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Crown Icon */}
        <div className="mx-auto w-20 h-20 rounded-2xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-400 mb-4 shadow-[0_0_20px_rgba(245,158,11,0.4)] animate-bounce">
          <Crown className="w-10 h-10" />
        </div>

        <p className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-1">
          Glorious Ascension!
        </p>
        <h2 className="text-3xl font-black tracking-tight text-white mb-2">
          LEVEL UP!
        </h2>

        <div className="my-4 py-3 px-4 rounded-2xl bg-[var(--bg-primary)]/80 border border-amber-500/30">
          <p className="text-xs text-muted">You have reached</p>
          <p className="text-2xl font-black text-amber-400 font-mono">
            Level {newLevel}
          </p>
          <p className="text-sm font-semibold text-purple-300 mt-0.5">
            Title: {newTitle}
          </p>
        </div>

        <p className="text-xs text-muted mb-6 leading-relaxed">
          Your power and renown grow across the realm. Keep conquering your daily quests to unlock further glory!
        </p>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-black font-extrabold text-sm transition-all shadow-lg cursor-pointer flex items-center justify-center gap-2"
        >
          <span>Claim Glory</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
