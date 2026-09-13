'use client'

import { useState } from 'react'
import { completeQuest, deleteQuest } from '@/app/_actions/quests'
import { Badge } from '@/app/_components/ui/Badge'
import { DIFFICULTY_INFO } from '@/app/_lib/constants'
import { Check, Flame, Trash2, Coins, Sparkles, Edit2, Skull } from 'lucide-react'

import { EditQuestModal } from './EditQuestModal'
import { LevelUpModal } from './LevelUpModal'
import { playSound } from '@/app/_lib/sound'

interface Stat {
  id: string
  name: string
  icon: string
}

interface QuestCardProps {
  quest: {
    id: string
    title: string
    description: string
    type: string
    difficulty: string
    xp_reward: number
    coin_reward: number
    streak: number
    completed: boolean
    is_negative?: boolean
    stat_id?: string | null
    stat?: {
      name: string
      icon: string
    } | null
  }
  stats?: Stat[]
}

export function QuestCard({ quest, stats = [] }: QuestCardProps) {
  const [loading, setLoading] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [levelUpData, setLevelUpData] = useState<{ newLevel: number; newTitle: string } | null>(null)
  const [unlockedNotice, setUnlockedNotice] = useState<string | null>(null)
  const diffInfo = DIFFICULTY_INFO[quest.difficulty] || DIFFICULTY_INFO.medium

  async function handleComplete() {
    if (loading || quest.completed) return
    setLoading(true)

    try {
      const res = await completeQuest(quest.id)
      if (res?.success) {
        // Fire confetti celebration
        // Dynamic import to reduce initial bundle
        const confetti = (await import('canvas-confetti')).default
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.7 },
        })

        // Trigger level up modal if user leveled up
        if (res.leveledUp) {
          playSound('levelup')
          setLevelUpData({
            newLevel: res.newLevel,
            newTitle: res.newTitle,
          })
        } else {
          playSound('sword')
        }

        // Show achievement toast if unlocked
        if (res.unlockedAchievements && res.unlockedAchievements.length > 0) {
          playSound('reward')
          const achNames = res.unlockedAchievements.map((a: any) => `${a.icon} ${a.name}`).join(', ')
          setUnlockedNotice(`🏆 Achievement Unlocked: ${achNames}!`)
          setTimeout(() => setUnlockedNotice(null), 5000)
        }

        if (res.isNegative) {
          // Shake screen and play damage sound
          document.body.classList.add('animate-shake')
          setTimeout(() => {
            document.body.classList.remove('animate-shake')
          }, 500)
        }
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (confirm('Are you sure you want to abandon this quest?')) {
      await deleteQuest(quest.id)
    }
  }

  return (
    <>
      <div className={`rpg-sheen relative group rounded-2xl border ${quest.completed ? 'border-purple-500/10 bg-[#0a0a20]/70 opacity-75' : 'border-purple-500/25 bg-[#0e0e2a]/95 hover:border-purple-500/60 hover:shadow-[0_0_20px_rgba(139,92,246,0.18)]'} p-4 sm:p-5 backdrop-blur-md transition-all shadow-md`}>
        <div className="flex items-start justify-between gap-4">
          {/* Middle: Content */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <h4
                className={`font-bold text-sm sm:text-base truncate ${
                  quest.completed ? 'line-through text-slate-400' : 'text-white'
                }`}
              >
                {quest.title}
              </h4>

              {quest.stat && (
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-lg bg-purple-500/10 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                  <span>{quest.stat.icon}</span> <span>{quest.stat.name}</span>
                </span>
              )}
            </div>

            {quest.description && (
              <p className="text-xs text-slate-300 line-clamp-2 mb-3.5 leading-relaxed">{quest.description}</p>
            )}

            {/* Badges and Rewards */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span
                className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider"
                style={{
                  backgroundColor: `${diffInfo.color}18`,
                  color: diffInfo.color,
                  border: `1px solid ${diffInfo.color}45`,
                  boxShadow: `0 0 8px ${diffInfo.color}25`,
                }}
              >
                {diffInfo.emoji} {diffInfo.label}
              </span>

              {quest.is_negative ? (
                <span className="text-rose-400 font-bold flex items-center gap-1 font-mono text-[11px] bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/30">
                  <Skull className="w-3 h-3" /> -{[10, 20, 30, 50][['easy','medium','hard','legendary'].indexOf(quest.difficulty) || 1]} HP
                </span>
              ) : (
                <>
                  <span className="text-purple-300 font-bold flex items-center gap-1 font-mono text-[11px] bg-purple-500/10 px-2 py-0.5 rounded-md border border-purple-500/30">
                    <Sparkles className="w-3 h-3 text-[var(--cyan)]" /> +{quest.xp_reward} XP
                  </span>

                  <span className="text-amber-300 font-bold flex items-center gap-1 font-mono text-[11px] bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/30">
                    <Coins className="w-3 h-3" /> +{quest.coin_reward} Gold
                  </span>
                </>
              )}

              {quest.streak > 0 && (
                <span className="text-orange-400 font-bold flex items-center gap-1 text-[11px] bg-orange-500/10 px-2 py-0.5 rounded-md border border-orange-500/30">
                  <Flame className="w-3.5 h-3.5 animate-pulse" /> {quest.streak} Streak
                </span>
              )}
            </div>
          </div>

          {/* Right side: Actions (Edit, Delete, Complete) */}
          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 flex-shrink-0">
            {!quest.completed && (
              <>
                <button
                  onClick={handleComplete}
                  disabled={loading}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[var(--purple)] to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md shadow-purple-600/30 hover:scale-105 active:scale-90 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 tap-flash"
                  title="Complete Quest"
                >
                  <Check className="w-3.5 h-3.5" /> Complete
                </button>
                <button
                  onClick={() => setIsEditOpen(true)}
                  className="text-slate-400 hover:text-amber-300 transition-all p-1.5 cursor-pointer rounded-lg hover:bg-white/5 border border-transparent hover:border-white/10 tap-ring"
                  title="Edit quest"
                  aria-label="Edit quest"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </>
            )}
            <button
              onClick={handleDelete}
              className="text-slate-400 hover:text-rose-400 transition-all p-1.5 cursor-pointer rounded-lg hover:bg-white/5 border border-transparent hover:border-rose-500/30 tap-ring"
              title="Abandon quest"
              aria-label="Abandon quest"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {unlockedNotice && (
        <div className="mt-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold animate-in fade-in flex items-center gap-2">
          <span>{unlockedNotice}</span>
        </div>
      )}

      <EditQuestModal
        quest={quest}
        stats={stats}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
      />

      {levelUpData && (
        <LevelUpModal
          isOpen={!!levelUpData}
          onClose={() => setLevelUpData(null)}
          newLevel={levelUpData.newLevel}
          newTitle={levelUpData.newTitle}
        />
      )}
    </>
  )
}
