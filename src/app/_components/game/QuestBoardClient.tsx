'use client'

import { useState } from 'react'
import { QuestCard } from './QuestCard'
import { CreateQuestModal } from './CreateQuestModal'
import { Scroll, Sparkles, CheckCircle2 } from 'lucide-react'

interface Quest {
  id: string
  title: string
  description: string
  type: string
  difficulty: string
  xp_reward: number
  coin_reward: number
  streak: number
  completed: boolean
  stat?: {
    name: string
    icon: string
  } | null
}

interface Stat {
  id: string
  name: string
  icon: string
}

export function QuestBoardClient({
  initialQuests,
  stats,
}: {
  initialQuests: Quest[]
  stats: Stat[]
}) {
  const [filter, setFilter] = useState<'all' | 'daily' | 'habit' | 'todo' | 'completed'>('all')

  const filteredQuests = initialQuests.filter((q) => {
    if (filter === 'completed') return q.completed
    if (q.completed) return false // Active tab excludes completed
    if (filter === 'all') return true
    return q.type === filter
  })

  const activeCount = initialQuests.filter((q) => !q.completed).length
  const completedCount = initialQuests.filter((q) => q.completed).length

  return (
    <div className="space-y-6">
      {/* Header controls: Filter tabs + New Quest button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-default)] overflow-x-auto no-scrollbar scroll-smooth">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex-shrink-0 ${
              filter === 'all'
                ? 'bg-amber-500 text-black shadow-sm'
                : 'text-muted hover:text-white'
            }`}
          >
            All Active ({activeCount})
          </button>
          <button
            onClick={() => setFilter('daily')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex-shrink-0 ${
              filter === 'daily'
                ? 'bg-amber-500 text-black shadow-sm'
                : 'text-muted hover:text-white'
            }`}
          >
            Dailies
          </button>
          <button
            onClick={() => setFilter('habit')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex-shrink-0 ${
              filter === 'habit'
                ? 'bg-amber-500 text-black shadow-sm'
                : 'text-muted hover:text-white'
            }`}
          >
            Habits
          </button>
          <button
            onClick={() => setFilter('todo')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex-shrink-0 ${
              filter === 'todo'
                ? 'bg-amber-500 text-black shadow-sm'
                : 'text-muted hover:text-white'
            }`}
          >
            To-Dos
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex-shrink-0 ${
              filter === 'completed'
                ? 'bg-amber-500 text-black shadow-sm'
                : 'text-muted hover:text-white'
            }`}
          >
            Completed ({completedCount})
          </button>
        </div>

        <div className="self-end sm:self-auto">
          <CreateQuestModal stats={stats} />
        </div>
      </div>

      {/* Quest Cards Grid / List */}
      <div className="space-y-3">
        {filteredQuests.length > 0 ? (
          filteredQuests.map((quest) => <QuestCard key={quest.id} quest={quest} stats={stats} />)
        ) : (
          <div className="text-center py-16 border border-dashed border-[var(--border-default)] rounded-2xl bg-[var(--bg-card)]/40">
            <Scroll className="w-10 h-10 text-muted mx-auto mb-3 opacity-50" />
            <h3 className="text-sm font-semibold text-muted">No quests in this category</h3>
            <p className="text-xs text-dim mt-1">
              Forge a new quest above to start gaining XP and coins!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
