'use client'

import { useState, useEffect } from 'react'
import { X, Sparkles, AlertTriangle } from 'lucide-react'
import { updateQuest } from '@/app/_actions/quests'
import { DIFFICULTY_XP, DIFFICULTY_COINS } from '@/app/_lib/constants'

interface Stat {
  id: string
  name: string
  icon: string
}

interface EditQuestModalProps {
  quest: {
    id: string
    title: string
    description: string
    type: string
    difficulty: string
    stat_id?: string | null
  }
  stats: Stat[]
  isOpen: boolean
  onClose: () => void
}

export function EditQuestModal({ quest, stats, isOpen, onClose }: EditQuestModalProps) {
  const [difficulty, setDifficulty] = useState<string>(quest.difficulty)
  const [type, setType] = useState<string>(quest.type)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const res = await updateQuest(quest.id, formData)
    setLoading(false)

    if (res?.error) {
      setError(res.error)
    } else {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-3.5 sm:p-4 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border border-amber-500/40 bg-[#0e0e28] p-5 sm:p-7 shadow-2xl shadow-amber-950/40 relative">
        <div className="flex items-center justify-between pb-4 border-b border-white/10 sticky top-0 bg-[#0e0e28] z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-lg">
              ⚔️
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white">
                Modify Quest
              </h2>
              <p className="text-[11px] text-slate-300">Update quest parameters & objectives</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form action={handleSubmit} className="mt-5 space-y-4">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-200 mb-1.5">
              Quest Title *
            </label>
            <input
              name="title"
              defaultValue={quest.title}
              required
              placeholder="e.g. Read 20 pages of a book"
              className="w-full px-4 py-2.5 rounded-xl border border-white/15 bg-black/40 text-white text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20 transition-all font-medium"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-200 mb-1.5">
              Description (Optional)
            </label>
            <textarea
              name="description"
              defaultValue={quest.description}
              rows={2}
              placeholder="Add details, objectives, or instructions..."
              className="w-full px-4 py-2.5 rounded-xl border border-white/15 bg-black/40 text-white text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20 transition-all resize-none font-medium"
            />
          </div>

          {/* Type & Difficulty Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-200 mb-1.5">
                Quest Type
              </label>
              <select
                name="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-black/40 text-white text-sm focus:outline-none focus:border-amber-400 transition-all font-medium"
              >
                <option value="todo" className="bg-[#0e0e28] text-white">Task (One-time)</option>
                <option value="daily" className="bg-[#0e0e28] text-white">Daily Habit</option>
                <option value="habit" className="bg-[#0e0e28] text-white">Repeatable Habit</option>
                <option value="challenge" className="bg-[#0e0e28] text-white">Boss Challenge</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-200 mb-1.5">
                Difficulty
              </label>
              <select
                name="difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-black/40 text-white text-sm focus:outline-none focus:border-amber-400 transition-all font-medium"
              >
                <option value="easy" className="bg-[#0e0e28] text-white">Easy (+15 XP)</option>
                <option value="medium" className="bg-[#0e0e28] text-white">Medium (+30 XP)</option>
                <option value="hard" className="bg-[#0e0e28] text-white">Hard (+60 XP)</option>
                <option value="legendary" className="bg-[#0e0e28] text-white">Legendary (+120 XP)</option>
              </select>
            </div>
          </div>

          {/* Link to Stat Attribute */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-200 mb-1.5">
              Character Attribute
            </label>
            <select
              name="stat_id"
              defaultValue={quest.stat_id || ''}
              className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-black/40 text-white text-sm focus:outline-none focus:border-amber-400 transition-all font-medium"
            >
              <option value="" className="bg-[#0e0e28] text-white">None (General XP)</option>
              {stats.map((s) => (
                <option key={s.id} value={s.id} className="bg-[#0e0e28] text-white">
                  {s.icon} {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Reward preview banner */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs font-medium">
            <span className="text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[var(--gold)]" /> Updated Bounty:
            </span>
            <span className="font-mono font-bold text-[var(--gold)]">
              +{DIFFICULTY_XP[difficulty] || 30} XP • +{DIFFICULTY_COINS[difficulty] || 10} Gold
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full border border-white/15 text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm shadow-lg shadow-amber-500/20 disabled:opacity-50 transition-all cursor-pointer"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
