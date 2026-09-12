'use client'

import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { createQuest } from '@/app/_actions/quests'
import { DIFFICULTY_XP, DIFFICULTY_COINS, DIFFICULTY_INFO } from '@/app/_lib/constants'

interface Stat {
  id: string
  name: string
  icon: string
}

export function CreateQuestModal({ stats }: { stats: Stat[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [difficulty, setDifficulty] = useState<string>('medium')
  const [type, setType] = useState<string>('todo')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const res = await createQuest(formData)
    setLoading(false)

    if (res?.error) {
      setError(res.error)
    } else {
      setIsOpen(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-semibold text-sm shadow-md transition-all cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        New Quest
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-3.5 sm:p-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-amber-500/30 bg-[var(--bg-card)] p-5 sm:p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-default)] sticky top-0 bg-[var(--bg-card)] z-10">
              <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
                <span>⚔️</span> Forge New Quest
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-muted hover:text-white transition-colors cursor-pointer p-1"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form action={handleSubmit} className="mt-4 space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                  {error}
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-muted mb-1">Quest Title</label>
                <input
                  name="title"
                  required
                  placeholder="e.g. Read 20 pages of a book"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[var(--border-default)] bg-[var(--bg-primary)] text-sm focus:outline-none focus:border-amber-500/50"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-muted mb-1">Description (Optional)</label>
                <textarea
                  name="description"
                  rows={2}
                  placeholder="Add details, objectives, or instructions..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[var(--border-default)] bg-[var(--bg-primary)] text-sm focus:outline-none focus:border-amber-500/50 resize-none"
                />
              </div>

              {/* Type & Difficulty Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted mb-1">Quest Type</label>
                  <select
                    name="type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--border-default)] bg-[var(--bg-primary)] text-sm focus:outline-none focus:border-amber-500/50"
                  >
                    <option value="todo">Task (One-time)</option>
                    <option value="daily">Daily Habit</option>
                    <option value="habit">Repeatable Habit</option>
                    <option value="challenge">Boss Challenge</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted mb-1">Difficulty</label>
                  <select
                    name="difficulty"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--border-default)] bg-[var(--bg-primary)] text-sm focus:outline-none focus:border-amber-500/50"
                  >
                    <option value="easy">Easy (+15 XP)</option>
                    <option value="medium">Medium (+30 XP)</option>
                    <option value="hard">Hard (+60 XP)</option>
                    <option value="legendary">Legendary (+120 XP)</option>
                  </select>
                </div>
              </div>

              {/* Link to Stat Attribute */}
              <div>
                <label className="block text-xs font-semibold text-muted mb-1">Character Attribute</label>
                <select
                  name="stat_id"
                  className="w-full px-3 py-2 rounded-lg border border-[var(--border-default)] bg-[var(--bg-primary)] text-sm focus:outline-none focus:border-amber-500/50"
                >
                  <option value="">None (General XP)</option>
                  {stats.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.icon} {s.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Reward preview banner */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs">
                <span className="text-muted">Estimated Rewards:</span>
                <span className="font-semibold text-amber-400">
                  +{DIFFICULTY_XP[difficulty] || 30} XP • +{DIFFICULTY_COINS[difficulty] || 10} Coins
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded-lg border border-[var(--border-default)] text-sm text-muted hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-black font-semibold text-sm disabled:opacity-50 transition-colors cursor-pointer"
                >
                  {loading ? 'Creating...' : 'Accept Quest'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
