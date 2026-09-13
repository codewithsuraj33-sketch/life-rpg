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
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-[var(--bg-secondary)] border border-purple-500/25 overflow-x-auto no-scrollbar scroll-smooth shadow-sm">
          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex-shrink-0 ${
              filter === 'all'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            All Active ({activeCount})
          </button>
          <button
            onClick={() => setFilter('daily')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex-shrink-0 ${
              filter === 'daily'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Dailies
          </button>
          <button
            onClick={() => setFilter('habit')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex-shrink-0 ${
              filter === 'habit'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Habits
          </button>
          <button
            onClick={() => setFilter('todo')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex-shrink-0 ${
              filter === 'todo'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            To-Dos
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex-shrink-0 ${
              filter === 'completed'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Completed ({completedCount})
          </button>
        </div>

        <div className="flex justify-end sm:justify-start items-center flex-shrink-0">
          <CreateQuestModal stats={stats} />
        </div>
      </div>

      {/* Quest Cards Grid / List */}
      <div className="space-y-3.5">
        {filteredQuests.length > 0 ? (
          filteredQuests.map((quest) => <QuestCard key={quest.id} quest={quest} stats={stats} />)
        ) : (
          <div className="text-center py-16 border border-dashed border-purple-500/30 rounded-3xl bg-[#0d0d26]/80 space-y-3 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mx-auto text-2xl shadow-inner">
              📜
            </div>
            <h3 className="text-base font-bold text-white">No quests in this category</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
              Forge a new mission above to claim XP, level up your stats, and grow your coin bounty!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
