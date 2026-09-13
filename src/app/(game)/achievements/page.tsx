import { createClient } from '@/app/_lib/supabase/server'
import { Trophy, Sparkles, CheckCircle2 } from 'lucide-react'

export default async function AchievementsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Fetch all achievements & user's unlocked achievements
  const [{ data: allAchievements }, { data: userAchievements }] = await Promise.all([
    supabase.from('achievements').select('*').order('xp_reward', { ascending: true }),
    supabase.from('user_achievements').select('achievement_id, earned_at').eq('user_id', user.id),
  ])

  const unlockedMap = new Map(
    (userAchievements || []).map((ua) => [ua.achievement_id, ua.earned_at])
  )

  const unlockedCount = unlockedMap.size
  const totalCount = allAchievements?.length || 0

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
            <span>🏆</span> Achievements & Trophies
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Unlock prestigious honors and battle glory by conquering real-world milestones.
          </p>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-xs flex items-center gap-2 shadow-sm shadow-amber-500/10">
          <Trophy className="w-4 h-4 text-amber-400 animate-pulse" />
          <span className="font-extrabold text-amber-300 font-mono">
            {unlockedCount} / {totalCount} Unlocked ({Math.round((unlockedCount / Math.max(totalCount, 1)) * 100)}%)
          </span>
        </div>
      </div>

      {/* Grid of Achievements */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {allAchievements?.map((achievement) => {
          const isUnlocked = unlockedMap.has(achievement.id)
          const earnedAt = unlockedMap.get(achievement.id)

          return (
            <div
              key={achievement.id}
              className={`rpg-sheen p-4 sm:p-5 rounded-2xl border backdrop-blur-md transition-all flex items-start gap-4 ${
                isUnlocked
                  ? 'border-amber-500/40 bg-gradient-to-br from-[#161208]/95 to-[#0e0e28]/95 shadow-[0_0_20px_rgba(245,166,35,0.12)] hover:border-amber-400'
                  : 'border-white/10 bg-[#0a0a20]/80 opacity-70 hover:opacity-90'
              }`}
            >
              <div className="text-3xl p-3 rounded-2xl bg-[var(--bg-primary)] border-2 border-purple-500/30 flex-shrink-0 shadow-sm">
                {achievement.icon}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-bold text-sm sm:text-base text-white truncate">
                    {achievement.name}
                  </h4>
                  <span className="text-xs text-amber-300 font-mono font-bold flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/30">
                    <Sparkles className="w-3 h-3 text-[var(--cyan)]" /> +{achievement.xp_reward} XP
                  </span>
                </div>

                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{achievement.description}</p>

                <div className="mt-3 flex items-center justify-between text-[11px]">
                  {isUnlocked ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center gap-1 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Unlocked
                    </span>
                  ) : (
                    <span className="text-slate-500 font-semibold flex items-center gap-1">
                      <span>🔒</span> Locked
                    </span>
                  )}

                  {earnedAt && (
                    <span className="text-slate-400 font-mono text-[10px]">
                      Earned {new Date(earnedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
