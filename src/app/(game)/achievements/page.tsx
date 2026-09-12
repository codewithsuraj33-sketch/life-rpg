import { createClient } from '@/app/_lib/supabase/server'
import { Card } from '@/app/_components/ui/Card'
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
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2.5">
            <span>🏆</span> Achievements & Trophies
          </h1>
          <p className="text-sm text-muted mt-1">
            Unlock rare honors and glory by conquering real-world milestones.
          </p>
        </div>

        <div className="px-4 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-default)] text-xs flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span className="font-semibold text-[var(--text-primary)]">
            {unlockedCount} / {totalCount} Unlocked
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
              className={`p-4 rounded-xl border backdrop-blur-sm transition-all flex items-start gap-3.5 ${
                isUnlocked
                  ? 'border-amber-500/30 bg-amber-500/5 shadow-[0_0_12px_rgba(245,158,11,0.08)]'
                  : 'border-[var(--border-default)] bg-[var(--bg-card)] opacity-60 grayscale'
              }`}
            >
              <div className="text-3xl p-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-default)]">
                {achievement.icon}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-bold text-sm text-[var(--text-primary)] truncate">
                    {achievement.name}
                  </h4>
                  <span className="text-xs text-amber-400 font-mono font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> +{achievement.xp_reward} XP
                  </span>
                </div>

                <p className="text-xs text-muted mt-1">{achievement.description}</p>

                <div className="mt-2.5 flex items-center justify-between text-[11px]">
                  {isUnlocked ? (
                    <span className="text-emerald-400 flex items-center gap-1 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Unlocked
                    </span>
                  ) : (
                    <span className="text-dim">Locked</span>
                  )}

                  {earnedAt && (
                    <span className="text-dim">
                      {new Date(earnedAt).toLocaleDateString()}
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
