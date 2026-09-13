'use client'

import { useState, useEffect } from 'react'
import { Plus, X, Sparkles, AlertTriangle } from 'lucide-react'
import { createQuest } from '@/app/_actions/quests'
import { DIFFICULTY_XP, DIFFICULTY_COINS } from '@/app/_lib/constants'

interface Stat {
  id: string
  name: string
  icon: string
}

export function CreateQuestModal({ stats }: { stats: Stat[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [difficulty, setDifficulty] = useState<string>('medium')
  const [type, setType] = useState<string>('todo')
  const [isNegative, setIsNegative] = useState<boolean>(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

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
        className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-full text-white font-bold text-sm shadow-lg shadow-purple-600/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        <span>New Quest</span>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-3.5 sm:p-4 animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false)
          }}
        >
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border border-purple-500/35 bg-[#0e0e28] p-5 sm:p-7 shadow-2xl shadow-purple-900/40 relative">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 sticky top-0 bg-[#0e0e28] z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-lg">
                  ⚔️
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                    Forge New Quest
                  </h2>
                  <p className="text-[11px] text-slate-300">Set objectives to earn XP & gold</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
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
                  required
                  placeholder="e.g. Read 20 pages of a book"
                  className="w-full px-4 py-2.5 rounded-xl border border-white/15 bg-black/40 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-[var(--cyan)] focus:ring-2 focus:ring-cyan-500/20 transition-all font-medium"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-200 mb-1.5">
                  Description (Optional)
                </label>
                <textarea
                  name="description"
                  rows={2}
                  placeholder="Add details, objectives, or instructions..."
                  className="w-full px-4 py-2.5 rounded-xl border border-white/15 bg-black/40 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-[var(--cyan)] focus:ring-2 focus:ring-cyan-500/20 transition-all resize-none font-medium"
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
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-black/40 text-white text-sm focus:outline-none focus:border-[var(--cyan)] transition-all font-medium"
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
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-black/40 text-white text-sm focus:outline-none focus:border-[var(--cyan)] transition-all font-medium"
                  >
                    <option value="easy" className="bg-[#0e0e28] text-white">Easy (+15 XP)</option>
                    <option value="medium" className="bg-[#0e0e28] text-white">Medium (+30 XP)</option>
                    <option value="hard" className="bg-[#0e0e28] text-white">Hard (+60 XP)</option>
                    <option value="legendary" className="bg-[#0e0e28] text-white">Legendary (+120 XP)</option>
                  </select>
                </div>
              </div>

              {/* Is Negative (Bad Habit) */}
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 cursor-pointer">
                <input
                  type="checkbox"
                  id="is_negative"
                  name="is_negative"
                  value="true"
                  checked={isNegative}
                  onChange={(e) => setIsNegative(e.target.checked)}
                  className="w-4 h-4 rounded bg-black/40 border-rose-500 accent-rose-500 cursor-pointer"
                />
                <label htmlFor="is_negative" className="text-xs font-semibold text-rose-300 cursor-pointer select-none">
                  Bad Habit / Vice (Failing this damages your Hero HP!)
                </label>
              </div>

              {/* Link to Stat Attribute */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-200 mb-1.5">
                  Character Attribute
                </label>
                <select
                  name="stat_id"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-black/40 text-white text-sm focus:outline-none focus:border-[var(--cyan)] transition-all font-medium"
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
              <div className={`flex items-center justify-between p-3.5 rounded-xl border text-xs font-medium ${isNegative ? 'bg-rose-500/10 border-rose-500/30' : 'bg-purple-500/10 border-purple-500/30'}`}>
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[var(--gold)]" />
                  {isNegative ? 'Estimated Penalty:' : 'Estimated Bounty:'}
                </span>
                <span className={`font-mono font-bold ${isNegative ? 'text-rose-400' : 'text-[var(--gold)]'}`}>
                  {isNegative ? `-${[10, 20, 30, 50][['easy','medium','hard','legendary'].indexOf(difficulty) || 1]} HP` : `+${DIFFICULTY_XP[difficulty] || 30} XP • +${DIFFICULTY_COINS[difficulty] || 10} Gold`}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-5 py-2.5 rounded-full border border-white/15 text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary px-6 py-2.5 rounded-full text-white font-bold text-sm shadow-lg shadow-purple-600/30 disabled:opacity-50 transition-all cursor-pointer"
                >
                  {loading ? 'Forging Quest...' : 'Accept Quest'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
