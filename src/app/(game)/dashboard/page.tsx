import { createClient } from '@/app/_lib/supabase/server'
import { Card, CardHeader, CardTitle } from '@/app/_components/ui/Card'
import { BossHealthBar } from '@/app/_components/game/BossHealthBar'
import { DailyRewardModal } from '@/app/_components/game/DailyRewardModal'
import { ClassSelectionModal } from '@/app/_components/game/ClassSelectionModal'
import { ProgressBar } from '@/app/_components/ui/ProgressBar'
import { Badge } from '@/app/_components/ui/Badge'
import { ActivityHeatmap } from '@/app/_components/game/ActivityHeatmap'
import { calculateProgress } from '@/app/_lib/xp'
import Link from 'next/link'
import {
  Flame,
  CheckCircle2,
  Coins,
  ArrowRight,
  TrendingUp,
  Award,
  Scroll,
  History
} from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Parallel fetch dashboard data
  const [
    { data: profile },
    { data: stats },
    { data: recentQuests },
    { data: activityLog },
    { data: fullActivityHistory },
    { count: totalCompletedCount },
    { data: bossData }
  ] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('stats').select('*').eq('user_id', user.id).order('name'),
    supabase
      .from('quests')
      .select('*')
      .eq('user_id', user.id)
      .eq('completed', false)
      .order('created_at', { ascending: false })
      .limit(4),
    supabase
      .from('activity_log')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('activity_log')
      .select('created_at')
      .eq('user_id', user.id)
      .eq('action', 'QUEST_COMPLETED')
      .gte('created_at', new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()),
    supabase
      .from('quests')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('completed', true),
    supabase
      .from('bosses')
      .select('*')
      .eq('is_active', true)
      .maybeSingle()
  ])

  if (!profile) return null

  const { currentXP, xpForNextLevel, progress } = calculateProgress(profile.xp, profile.level)

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <DailyRewardModal lastLoginDate={profile.last_login_date} />
      <ClassSelectionModal currentClass={profile.class_type} />
      <BossHealthBar boss={bossData} />

      {/* Top Banner: Hero Overview */}
      <div className="relative overflow-hidden rounded-3xl border border-purple-500/35 bg-gradient-to-r from-[var(--bg-secondary)] via-[#0f0d32] to-[var(--bg-primary)] p-6 sm:p-8 shadow-[0_0_35px_rgba(139,92,246,0.18)]">
        {/* Ambient background glow orb */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="text-5xl sm:text-6xl p-3.5 bg-[var(--bg-card)] rounded-2xl border-2 border-purple-500/40 shadow-[0_0_20px_rgba(139,92,246,0.3)] animate-float flex-shrink-0">
              {profile.avatar_url || '🧙'}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">{profile.username}</h1>
                <Badge variant="gold" className="text-xs font-bold px-3 py-0.5 shadow-sm shadow-amber-500/20">
                  Lv.{profile.level} {profile.title}
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">Ready for today's adventures? Conquer your goals and claim glory!</p>
              
              <div className="mt-3.5 flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs">
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 font-mono font-bold shadow-sm shadow-amber-500/10">
                  <Coins className="w-3.5 h-3.5" /> {profile.coins.toLocaleString()} Gold
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-bold shadow-sm shadow-emerald-500/10">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {totalCompletedCount || 0} Quests Done
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-500/15 border border-purple-500/40 text-purple-300 font-bold">
                  <Award className="w-3.5 h-3.5" /> Rank {Math.floor(profile.level / 5) + 1}
                </span>
              </div>
            </div>
          </div>

          <div className="w-full sm:w-72 bg-black/60 p-4 sm:p-5 rounded-2xl border border-purple-500/30 backdrop-blur-md shadow-xl">
            <div className="flex justify-between text-xs mb-2 font-bold">
              <span className="text-slate-300 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-[var(--cyan)]" /> Level Progress
              </span>
              <span className="text-amber-300 font-mono font-bold">{currentXP} / {xpForNextLevel} XP</span>
            </div>
            <div className="w-full h-3 bg-black/80 rounded-full overflow-hidden border border-purple-500/40 p-0.5 shadow-inner">
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple-500 via-[var(--cyan)] to-amber-400 transition-all duration-700 relative overflow-hidden"
                style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              </div>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 font-mono">
              <span>{Math.round(progress * 100)}% complete</span>
              <span className="text-[var(--cyan)] font-semibold">
                {Math.max(xpForNextLevel - currentXP, 0)} XP to Lv.{profile.level + 1}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Layout: Stats Radar / Cards + Active Quests */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Stats & Active Quests */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Attributes / Stats Overview */}
          <Card glow className="border-purple-500/30 bg-[#0d0d26]/90 shadow-xl">
            <CardHeader>
              <CardTitle className="text-white">
                <TrendingUp className="w-5 h-5 text-[var(--cyan)]" />
                Character Attributes & Mastery
              </CardTitle>
              <Link href="/character" className="text-xs font-bold text-[var(--cyan)] hover:underline flex items-center gap-1">
                View Full Sheet <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </CardHeader>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {stats && stats.length > 0 ? (
                stats.map((stat) => {
                  const statProgress = Math.min((stat.xp % 100) / 100, 1)
                  const statColor = stat.name.toLowerCase().includes('strength')
                    ? '#f43f5e'
                    : stat.name.toLowerCase().includes('intellect')
                    ? '#22d3ee'
                    : stat.name.toLowerCase().includes('discipline')
                    ? '#f5a623'
                    : '#a78bfa'

                  return (
                    <div
                      key={stat.id}
                      className="rpg-sheen p-3.5 border border-purple-500/20 bg-[#090920]/90 rounded-xl flex flex-col justify-between hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(34,211,238,0.15)] transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl group-hover:scale-110 transition-transform">{stat.icon}</span>
                        <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-[var(--cyan)] font-mono">
                          Lv.{stat.level}
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        <p className="text-xs font-bold text-white group-hover:text-[var(--cyan)] transition-colors">{stat.name}</p>
                        <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden border border-white/10">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.max(statProgress * 100, 10)}%`,
                              backgroundColor: statColor,
                            }}
                          />
                        </div>
                        <p className="text-[10px] text-slate-400 font-mono">{stat.xp} XP total</p>
                      </div>
                    </div>
                  )
                })
              ) : (
                <p className="text-sm text-slate-400 col-span-3 py-4 text-center">No stats created yet.</p>
              )}
            </div>
          </Card>

          {/* Active Quests Quick-Board */}
          <Card className="border-purple-500/30 bg-[#0d0d26]/90 shadow-xl">
            <CardHeader>
              <CardTitle className="text-white">
                <Scroll className="w-5 h-5 text-[var(--purple-light)]" />
                Active Quests
              </CardTitle>
              <Link href="/quests" className="text-xs font-bold text-[var(--purple-light)] hover:underline flex items-center gap-1">
                Open Quest Board <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </CardHeader>
            <div className="space-y-3">
              {recentQuests && recentQuests.length > 0 ? (
                recentQuests.map((quest) => (
                  <div
                    key={quest.id}
                    className="rpg-sheen flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 border border-purple-500/20 bg-[#090920]/90 rounded-xl hover:border-purple-500/50 hover:shadow-[0_0_15px_rgba(139,92,246,0.15)] transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-2.5 h-2.5 rounded-full bg-[var(--cyan)] shadow-[0_0_8px_rgba(34,211,238,0.8)] flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-white truncate">{quest.title}</p>
                        <div className="flex flex-wrap items-center gap-2 mt-1 text-xs">
                          <span className="capitalize px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/5 border border-white/10 text-slate-300">
                            {quest.type}
                          </span>
                          <span className="text-purple-300 font-bold font-mono text-[11px] bg-purple-500/10 px-2 py-0.5 rounded-md border border-purple-500/20">
                            +{quest.xp_reward} XP
                          </span>
                          <span className="text-amber-300 font-bold font-mono text-[11px] bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                            +{quest.coin_reward} Gold
                          </span>
                          {quest.streak > 0 && (
                            <span className="flex items-center text-orange-400 font-bold text-[11px] bg-orange-500/10 px-2 py-0.5 rounded-md border border-orange-500/20">
                              <Flame className="w-3 h-3 mr-0.5 animate-pulse" /> {quest.streak}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <Link
                      href="/quests"
                      className="self-end sm:self-auto px-4 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[var(--purple)] to-indigo-600 text-white shadow-md shadow-purple-600/30 hover:scale-105 active:scale-90 transition-all text-center tap-flash"
                    >
                      Complete
                    </Link>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-400 space-y-2">
                  <p className="text-sm font-semibold">No active quests right now!</p>
                  <Link
                    href="/quests"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 hover:bg-purple-500/30 transition-all"
                  >
                    + Create your first quest
                  </Link>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right 1 Col: Quick Actions, AI & Activity Feed */}
        <div className="space-y-6">
          
          {/* Quick Shortcuts */}
          <Card className="border-purple-500/30 bg-[#0d0d26]/90 shadow-xl">
            <CardHeader>
              <CardTitle className="text-white">
                <Award className="w-5 h-5 text-[var(--gold)]" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <div className="flex flex-col gap-2.5">
              <Link
                href="/quests"
                className="group flex items-center justify-between p-3.5 border border-purple-500/20 bg-[#090920] hover:border-purple-500/60 hover:bg-purple-500/10 text-sm font-bold text-white rounded-xl transition-all shadow-sm tap-flash active:scale-[0.97]"
              >
                <span className="flex items-center gap-2"><span>⚔️</span> Quest Board</span>
                <ArrowRight className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/leaderboard"
                className="group flex items-center justify-between p-3.5 border border-amber-500/20 bg-[#090920] hover:border-amber-500/60 hover:bg-amber-500/10 text-sm font-bold text-white rounded-xl transition-all shadow-sm tap-flash active:scale-[0.97]"
              >
                <span className="flex items-center gap-2"><span>👑</span> View Leaderboard</span>
                <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/shop"
                className="group flex items-center justify-between p-3.5 border border-cyan-500/20 bg-[#090920] hover:border-cyan-500/60 hover:bg-cyan-500/10 text-sm font-bold text-white rounded-xl transition-all shadow-sm tap-flash active:scale-[0.97]"
              >
                <span className="flex items-center gap-2"><span>🛒</span> Rewards Market</span>
                <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/achievements"
                className="group flex items-center justify-between p-3.5 border border-emerald-500/20 bg-[#090920] hover:border-emerald-500/60 hover:bg-emerald-500/10 text-sm font-bold text-white rounded-xl transition-all shadow-sm tap-flash active:scale-[0.97]"
              >
                <span className="flex items-center gap-2"><span>🏆</span> Check Achievements</span>
                <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </Card>

          {/* Activity Heatmap */}
          <Card className="border-purple-500/30 bg-[#0d0d26]/90 shadow-xl">
            <CardHeader>
              <CardTitle className="text-white">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                Consistency Map
              </CardTitle>
            </CardHeader>
            <ActivityHeatmap activities={fullActivityHistory || []} />
          </Card>

          {/* Recent Activity Log */}
          <Card className="border-purple-500/30 bg-[#0d0d26]/90 shadow-xl">
            <CardHeader>
              <CardTitle className="text-white">
                <History className="w-5 h-5 text-[var(--cyan)]" />
                Recent History
              </CardTitle>
            </CardHeader>
            <div className="space-y-3">
              {activityLog && activityLog.length > 0 ? (
                activityLog.map((log) => (
                  <div key={log.id} className="text-xs border-b border-white/5 pb-2.5 last:border-0 last:pb-0">
                    <p className="font-bold text-slate-200">{log.action}</p>
                    <div className="flex items-center justify-between text-slate-400 mt-1 text-[11px]">
                      <span className="text-emerald-400 font-mono font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                        +{log.xp_gained} XP
                      </span>
                      <span>{new Date(log.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 text-center py-4">No recent activities logged yet.</p>
              )}
            </div>
          </Card>

        </div>
      </div>
    </div>
  )
}
