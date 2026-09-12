'use client'

import { useState } from 'react'
import { completeQuest, deleteQuest } from '@/app/_actions/quests'
import { Badge } from '@/app/_components/ui/Badge'
import { DIFFICULTY_INFO } from '@/app/_lib/constants'
import { Check, Flame, Trash2, Coins, Sparkles, Edit2, Skull } from 'lucide-react'
import confetti from 'canvas-confetti'
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
      <div className="relative group rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] p-4 sm:p-5 backdrop-blur-sm transition-all hover:border-[var(--border-hover)] shadow-[var(--shadow-card)]">
        <div className="flex items-start justify-between gap-4">
          {/* Left Side removed - Checkbox is gone */}

          {/* Middle: Content */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h4
                className={`font-semibold text-sm sm:text-base truncate ${
                  quest.completed ? 'line-through text-muted' : 'text-[var(--text-primary)]'
                }`}
              >
                {quest.title}
              </h4>

              {quest.stat && (
                <span className="text-xs px-2 py-0.5 rounded bg-[var(--bg-secondary)] text-muted border border-[var(--border-default)]">
                  {quest.stat.icon} {quest.stat.name}
                </span>
              )}
            </div>

            {quest.description && (
              <p className="text-xs text-muted line-clamp-2 mb-3">{quest.description}</p>
            )}

            {/* Badges and Rewards */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span
                className="px-2 py-0.5 rounded text-[11px] font-medium"
                style={{
                  backgroundColor: `${diffInfo.color}15`,
                  color: diffInfo.color,
                  border: `1px solid ${diffInfo.color}30`,
                }}
              >
                {diffInfo.emoji} {diffInfo.label}
              </span>

              {quest.is_negative ? (
                <span className="text-rose-400 font-medium flex items-center gap-1 font-mono">
                  <Skull className="w-3 h-3" /> -{[10, 20, 30, 50][['easy','medium','hard','legendary'].indexOf(quest.difficulty) || 1]} HP
                </span>
              ) : (
                <>
                  <span className="text-amber-400 font-medium flex items-center gap-1 font-mono">
                    <Sparkles className="w-3 h-3" /> +{quest.xp_reward} XP
                  </span>

                  <span className="text-amber-300 font-medium flex items-center gap-1 font-mono">
                    <Coins className="w-3 h-3" /> +{quest.coin_reward}
                  </span>
                </>
              )}

              {quest.streak > 0 && (
                <span className="text-orange-400 font-medium flex items-center gap-1 font-semibold">
                  <Flame className="w-3.5 h-3.5" /> {quest.streak} streak
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
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[var(--purple-bg)] text-[var(--purple)] border border-[var(--border-default)] hover:border-[var(--purple)] hover:shadow-[var(--shadow-purple)] transition-all flex items-center gap-1 cursor-pointer"
                  title="Complete Quest"
                >
                  <Check className="w-3.5 h-3.5" /> Complete
                </button>
                <button
                  onClick={() => setIsEditOpen(true)}
                  className="text-muted hover:text-amber-400 transition-all p-1.5 cursor-pointer rounded-lg hover:bg-[var(--bg-secondary)] border border-transparent hover:border-[var(--border-default)]"
                  title="Edit quest"
                  aria-label="Edit quest"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </>
            )}
            <button
              onClick={handleDelete}
              className="text-muted hover:text-rose-400 transition-all p-1.5 cursor-pointer rounded-lg hover:bg-[var(--bg-secondary)] border border-transparent hover:border-[var(--border-default)]"
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
